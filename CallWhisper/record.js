import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Animated, Easing, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export default function MicButton() {
  const [recording, setRecording] = useState(null);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    if (recording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [recording]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please grant microphone access.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) {
        Alert.alert("Error", "Recording failed to save.");
        return;
      }

      const fileName = `call_${Date.now().toString().slice(-4)}.m4a`; // Shorter name
      const newPath = FileSystem.documentDirectory + fileName;
      
      // Move file safely
      try {
        await FileSystem.moveAsync({ from: uri, to: newPath });
      } catch (err) {
        console.error("Error moving file:", err);
        Alert.alert("Error", "Could not move the file.");
        return;
      }

      // Request Media Library permission
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please allow access to save recordings.");
        return;
      }

      // Save to Music/Recordings
      try {
        const asset = await MediaLibrary.createAssetAsync(newPath);
        let album = await MediaLibrary.getAlbumAsync("Recordings");
        if (!album) {
          album = await MediaLibrary.createAlbumAsync("Recordings", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } catch (err) {
        console.error("Error saving to Media Library:", err);
        Alert.alert("Error", "Could not save recording.");
        return;
      }

      setRecording(null);
      Alert.alert("Recording Saved", `Saved as ${fileName} in Music > Recordings`);
    } catch (error) {
      console.error("Failed to stop recording:", error);
      Alert.alert("Error", "Something went wrong while stopping the recording.");
    }
  };

  return (
    <View style={styles.container}>
      {recording && (
        <Animated.View
          style={[
            styles.wave,
            {
              transform: [{ scale: scaleAnim }],
              opacity: scaleAnim.interpolate({
                inputRange: [1, 1.5],
                outputRange: [1, 0],
              }),
            },
          ]}
        />
      )}
      <TouchableOpacity
        style={styles.micButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <FontAwesome name={recording ? "stop" : "microphone"} size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  wave: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 0, 0, 0.5)",
  },
};
