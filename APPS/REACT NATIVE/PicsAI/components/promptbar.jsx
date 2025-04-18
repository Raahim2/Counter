import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_UPLOAD_PRESET = 'CLOUD_PRESET';
const CLOUDINARY_CLOUD_NAME = 'CLOUDNAME';

const PromptBar = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = () => {
    if (text.trim() !== '' || image) {
      onSubmit({ text, image }); // Pass both text and Cloudinary URL to the parent
      setText(''); // Clear text input
      setImage(null); // Clear image
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access the gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      uploadImageToCloudinary(localUri);
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    setUploading(true);
    const data = new FormData();
    data.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    data.append('folder', 'PicsAI');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );
      const result = await response.json();
      setImage(result.secure_url); // Set the Cloudinary URL
    } catch (error) {
      alert('Image upload failed. Please try again.');
      console.error('Cloudinary upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Show Image Preview Above Prompt Bar */}
      {image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => setImage(null)} // Remove the selected image
            style={styles.removeButton}
          >
            <FontAwesome name="times" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Prompt Bar */}
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Type your prompt here..."
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity onPress={handleImagePick} style={styles.button}>
          <FontAwesome name="paperclip" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <FontAwesome name="paper-plane" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {uploading && (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff3d3d',
    borderRadius: 15,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
});

export default PromptBar;
