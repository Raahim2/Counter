import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const CardComponent = ({ navigation , formId }) => {
  // const imageUrl = 'https://thumbs.dreamstime.com/b/form-icon-form-logo-document-icon-simple-vector-icon-form-logo-document-icon-white-background-128622826.jpg'; // Replace with your image URL
  const imageUrl = 'https://dummyimage.com/1000x1000/6200ee/ffffff&text=Form'; 

  

  function handleClick() {
    navigation.navigate('Form', { formId });

  }

  return (
    <TouchableOpacity onPress={handleClick} style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>Sample Card Title</Text>
      <Text style={styles.date}>Edited, Dec 2023</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    width: '47%', // Half of the screen width
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#6B7280', // Gray text
    marginBottom: 12,
  },
});

export default CardComponent;
