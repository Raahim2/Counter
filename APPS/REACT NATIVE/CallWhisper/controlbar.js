import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';


let globalSound = null;

const ControlBar = ({ recording, onStop, onPlay }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [recording]);

  const loadSound = async () => {
    if (recording.uri) {
      if (globalSound) {
        await globalSound.stopAsync();
        await globalSound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recording.uri },
        { shouldPlay: false }
      );
      setSound(newSound);
      globalSound = newSound;
      
      const status = await newSound.getStatusAsync();
      setDuration(status.durationMillis / 1000);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isPlaying) {
          setProgress(status.positionMillis / 1000);
        }
        if (status.didJustFinish) {
          setIsPlaying(false);
          setProgress(0);
        }
      });
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      if (onPlay) {
        onPlay();
      }
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setProgress(0);
    }
    onStop();
  };

  const handleSliderChange = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value * 1000);
      setProgress(value);
    }
  };

  const seekBackward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      await sound.setPositionAsync(Math.max(0, status.positionMillis - 5000));
    }
  };

  const seekForward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      await sound.setPositionAsync(Math.min(status.durationMillis, status.positionMillis + 5000));
    }
  };

  return (
        <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{recording.name}</Text>
        <Text style={styles.details}>{recording.date} | {recording.duration}s</Text>
      </View>

      <Slider
        style={styles.seekbar}
        minimumValue={0}
        maximumValue={duration}
        value={progress}
        onSlidingComplete={handleSliderChange}
        minimumTrackTintColor="red"
        maximumTrackTintColor="#ccc"
        thumbTintColor="red"
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={stopPlayback}>
          <Icon name="close" size={24} color="red" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={seekBackward}>
          <Icon name="replay-5" size={32} color="red" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
          <Icon name={isPlaying ? "pause" : "play-arrow"} size={48} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={seekForward}>
          <Icon name="forward-5" size={32} color="red" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Icon name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  seekbar: {
    width: '90%',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '90%',
  },
  playButton: {
    backgroundColor: 'red',
    borderRadius: 40,
    padding: 15,
    marginHorizontal: 15,
  },
});

export default ControlBar;
