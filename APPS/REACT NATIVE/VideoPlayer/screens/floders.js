import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

export default function VideoFolderList({ navigation }) {
  const [folders, setFolders] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoFolders = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      setPermissionGranted(true);

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: ['video'],
        first: 1000,
        include: ['fileSize', 'filename', 'duration', 'creationTime'] 
      });

      const folderMap = {}; // Track videos by folder

      media.assets.forEach(video => {
        const folderPath = video.uri.substring(0, video.uri.lastIndexOf('/'));
        if (!folderMap[folderPath]) {
          folderMap[folderPath] = [];
        }
        folderMap[folderPath].push({
          ...video,
          fileSize: video.fileSize || 9 // Handle missing fileSize
        });
      });

      const folderArray = Object.keys(folderMap).map((folderPath, index) => ({
        id: index,
        path: folderPath,
        name: folderPath.split('/').pop(),
        videos: folderMap[folderPath], // Pass videos here
      }));

      setFolders(folderArray);
      setLoading(false);
    };

    fetchVideoFolders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Loading folders...</Text>
      </View>
    );
  }

  if (!permissionGranted) {
    return <Text>Please grant permission to access media library.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {folders.map((folder) => (
        <TouchableOpacity 
          key={folder.id} 
          style={styles.folderCard}
          onPress={() => navigation.navigate('Videos', { folderName: folder.name, videos: folder.videos })}
        >
          <FontAwesome name="folder" size={50} color="#4A90E2" />
          <View style={styles.folderDetails}>
            <Text style={styles.folderName}>{folder.name}</Text>
            <Text style={styles.folderCount}>{folder.videos.length} videos</Text>
          </View>
        </TouchableOpacity>
      ))}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  folderDetails: {
    marginLeft: 16,
  },
  folderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  folderCount: {
    fontSize: 14,
    color: '#888',
    marginVertical: 4,
  },
});
