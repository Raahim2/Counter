import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Alert, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { FontAwesome } from '@expo/vector-icons';
import AudioItem from './item';
import ControlBar from './controlbar';
import InteractiveText from './textaudio';
import MicButton from './record';

export default function App() {
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const getAudioFiles = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Please allow media library access.");
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 20, // Limit to 20 files
        sortBy: [[MediaLibrary.SortBy.creationTime, false]], // Sort by newest first
      });

      const audioList = media.assets.map((file) => ({
        id: file.id,
        name: file.filename,
        duration: Math.round(file.duration), // Convert to seconds
        date: new Date(file.creationTime).toDateString(),
        uri: file.uri, // File path
      }));

      setRecordings(audioList);
    };

    getAudioFiles();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <Text style={styles.headerText}>Calls</Text>

      <TouchableOpacity onPress={() => setIsRecording(!isRecording)}>
  <FontAwesome name="microphone" size={24} color={isRecording ? "blue" : "black"} />
</TouchableOpacity>

      </View>

      {isRecording ? (
        <MicButton />
      ) : (
        <>
          {/* List of Recordings - Show all items if no recording is playing */}
          {!currentRecording && (
            <FlatList
              data={recordings}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <AudioItem
                  name={item.name}
                  duration={item.duration}
                  date={item.date}
                  onPress={() => setCurrentRecording(item)}
                />
              )}
            />
          )}
          {currentRecording && <InteractiveText recording={currentRecording} />}

          {/* Control Bar - Show only when a recording is selected */}
          {currentRecording && (
            <View>
              <ControlBar
                recording={currentRecording}
                onStop={() => setCurrentRecording(null)}
                onPlay={() => setCurrentRecording(currentRecording)}
              />
            </View>
          )}
        </>
      )}

      <StatusBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
});