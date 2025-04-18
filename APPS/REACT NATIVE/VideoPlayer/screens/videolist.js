import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function VideoList({ route, navigation }) {
  const { folderName, videos } = route.params;

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatCreationDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.videoItem} 
            onPress={() => navigation.navigate('VideoScreen', { videoUri: item.uri })} // Navigate to VideoScreen
          >
            {/* Thumbnail Container with Duration Overlay */}
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: item.uri }}
                style={styles.videoThumbnail}
              />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
              </View>
            </View>

            {/* Video Info */}
            <View style={styles.videoInfo}>
              <Text 
                style={styles.videoName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.filename}
              </Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>{(item.fileSize / (1024 * 1024)).toFixed(1)} MB</Text>
                <View style={styles.dotSeparator} />
                <Text style={styles.detailText}>{formatCreationDate(item.creationTime)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 10,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  videoThumbnail: {
    width: 100,
    height: 60,
    backgroundColor: '#E0E0E0',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  videoName: {
    fontSize: 14,
    fontWeight:'600',
    color:'#1A1A1A',
    marginBottom :2,
    maxWidth : '90%',
   },
   detailsRow:{
     flexDirection:'row',
     alignItems:'center',
   },
   detailText:{
     fontSize :12 ,
     color:'#6B6B6B',
     fontWeight:'400',
   },
   dotSeparator:{
     width :2 ,
     height :2 ,
     borderRadius :1 ,
     backgroundColor :'#6B6B6B',
     marginHorizontal :6 ,
   },
});
