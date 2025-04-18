import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Sidebar = ({ closeSidebar }) => {
  return (
    <View style={styles.sidebar}>
      {/* Close Button */}
      <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
        <FontAwesome name="times" size={24} color="black" />
      </TouchableOpacity>

      {/* New Chat Button */}
      <TouchableOpacity style={styles.newChatButton} onPress={() => alert('New Chat')}>
        <FontAwesome name="plus" size={20} color="black" />
        <Text style={styles.newChatText}>New Chat</Text>
      </TouchableOpacity>

      {/* Chat Options */}
      <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
        {Array.from({ length: 17 }, (_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => alert(`Chat ${index + 1}`)}
          >
            <FontAwesome name="comments" size={16} color="black" />
            <Text style={styles.optionText}>Chat {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => alert('Settings')}>
          <FontAwesome name="gear" size={18} color="black" />
          <Text style={styles.footerButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => alert('Profile')}>
          <FontAwesome name="user" size={18} color="black" />
          <Text style={styles.footerButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 20,
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  newChatText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
  optionsList: {
    flex: 1,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  optionText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerButtonText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Sidebar;
