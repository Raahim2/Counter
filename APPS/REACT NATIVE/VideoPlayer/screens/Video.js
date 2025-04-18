import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Video } from 'expo-av';
import { useEffect, useRef, useState, useCallback } from 'react';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function VideoScreen({ route }) {
  const { videoUri } = route.params;
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [position, setPosition] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showCaptions, setShowCaptions] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotation, setRotation] = useState(0);

  const handlePlayPause = useCallback(async () => {
    if (video.current) {
      setIsPlaying((prevIsPlaying) => {
        if (prevIsPlaying) {
          video.current.pauseAsync();
        } else {
          video.current.playAsync();
        }
        return !prevIsPlaying;
      });
    }
  }, []);

  useEffect(() => {
    if (video.current) {
      video.current.setOnPlaybackStatusUpdate((status) => setStatus(status));
    }
  }, []);

  const handleSliderChange = useCallback(async (value) => {
    if (video.current && status.durationMillis) {
      const newPosition = Math.floor(value * status.durationMillis);
      try {
        await video.current.setPositionAsync(newPosition);
        setPosition(newPosition);
      } catch (e) {
        console.log(e)
      }
    }
  }, [status.durationMillis, video]);

  const handleForward = useCallback(async () => {
    if (video.current && status.durationMillis) {
      const newPosition = Math.min(status.positionMillis + 10000, status.durationMillis);
      try {
        await video.current.setPositionAsync(newPosition);
        setPosition(newPosition);
      } catch (e) {
        console.log(e)
      }
    }
  }, [status, video]);

  const handleRewind = useCallback(async () => {
    if (video.current) {
      const newPosition = Math.max(status.positionMillis - 10000, 0);
      try {
        await video.current.setPositionAsync(newPosition);
        setPosition(newPosition);
      } catch (e) {
        console.log(e)
      }
    }
  }, [status, video]);


  const toggleFullscreen = useCallback(async () => {
    try {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT); //Force landscape left
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.warn('Screen orientation lock not supported on this device');
      setIsFullscreen(!isFullscreen);
    }
  }, [isFullscreen]);

  const togglePlaybackSpeed = useCallback(async () => {
    if (video.current) {
      const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
      const currentIndex = speeds.indexOf(playbackSpeed);
      const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
      await video.current.setRateAsync(nextSpeed, true);
      setPlaybackSpeed(nextSpeed);
    }
  }, [playbackSpeed]);

  const toggleCaptions = useCallback(() => {
    setShowCaptions(!showCaptions);
  }, [showCaptions]);

  const toggleControls = useCallback(() => {
    setShowControls(!showControls);
  }, [showControls]);


  useEffect(() => {
    const loadVideo = async () => {
      if (video.current) {
        try {
          await video.current.loadAsync(
            { uri: videoUri },
            { shouldPlay: true, isLooping: true },
            false
          );
          setIsPlaying(true);
        } catch (error) {
          console.error("Error loading video:", error);
        }
      }
    };

    loadVideo();
  }, [videoUri]);

  const formatTime = (millis) => {
    if (!millis) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const rotateVideo = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          style={[
            styles.video,
            isFullscreen && styles.fullscreenVideo,
            { transform: [{ rotate: `${rotation}deg` }] },
          ]}
          resizeMode="contain"
          isLooping={true}
          shouldPlay={isPlaying}
          onPlaybackStatusUpdate={setStatus}
        />
        {showControls && (
          <TouchableOpacity
            style={styles.controlOverlay}
            onPress={toggleControls}
            activeOpacity={1}
          >
            <View style={styles.controlsWrapper}>
              <View style={styles.progressBarContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={status.durationMillis ? status.positionMillis / status.durationMillis : 0}
                  onValueChange={(value) => setPosition(value * status.durationMillis)}
                  onSlidingComplete={handleSliderChange}
                  minimumTrackTintColor="#FF0000"
                  maximumTrackTintColor="rgba(255,255,255,0.3)"
                  thumbTintColor="#FF0000"
                />
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {formatTime(status.positionMillis)} / {formatTime(status.durationMillis)}
                  </Text>
                </View>
              </View>

              <View style={styles.mainControls}>
                <View style={styles.leftControls}>
                  <TouchableOpacity onPress={handlePlayPause}>
                    <MaterialIcons
                      name={isPlaying ? "pause" : "play-arrow"}
                      size={28}
                      color="white"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleRewind}>
                    <MaterialIcons name="replay-10" size={28} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleForward}>
                    <MaterialIcons name="forward-10" size={28} color="white" />
                  </TouchableOpacity>
                </View>

                <View style={styles.rightControls}>
                  <TouchableOpacity onPress={toggleCaptions} style={styles.controlButton}>
                    <MaterialIcons
                      name={showCaptions ? "closed-caption" : "closed-caption-off"}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={togglePlaybackSpeed} style={styles.speedButton}>
                    <Text style={styles.speedText}>{playbackSpeed}x</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={toggleFullscreen}>
                    <MaterialIcons
                      name={isFullscreen ? "fullscreen-exit" : "fullscreen"}
                      size={28}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {showCaptions && (
          <View style={styles.captionsContainer}>
            <Text style={styles.captionsText}></Text>
          </View>
        )}
      </View>

      <StatusBar style="light" hidden={isFullscreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',     // Center content horizontally
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fullscreenVideo: {
    width: screenHeight, // Swap width and height in landscape
    height: screenWidth,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  progressBarContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  timeText: {
    color: 'white',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  speedButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  speedText: {
    color: 'white',
    fontSize: 14,
  },
  captionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  captionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
