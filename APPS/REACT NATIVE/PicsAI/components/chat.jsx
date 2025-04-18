import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import Markdown from 'react-native-markdown-display';

const ChatComponent = ({ userMessages, botMessages }) => {
  // Combine messages into a single array with alternating user and bot messages
  const messages = [];
  const maxLength = Math.max(userMessages.length, botMessages.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < userMessages.length) {
      messages.push({ type: 'user', ...userMessages[i] });
    }
    if (i < botMessages.length) {
      messages.push({ type: 'bot', ...botMessages[i] });
    }
  }

  const renderMessage = ({ item }) => {
    const isUser = item.type === 'user';


    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userContainer : styles.botContainer,
        ]}
      >
        {/* Render Image if available */}
        {item.image && (
          <>
          <Image source={{ uri: item.image }} style={styles.image} />
          </>
        )}

        {/* Render Text Message */}
        {item.text && (
          <Markdown
            style={[styles.messageText, isUser ? styles.userText : styles.botText]}
          >
            {item.text}
          </Markdown>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.chatContainer}
      showsVerticalScrollIndicator={false} // Hide the scrollbar
      scrollEnabled={true} // Ensure scrolling is enabled
    />
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 70,
    backgroundColor: '#f8f8f8',
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '75%',
    padding: 14,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#0061f2',
    borderBottomRightRadius: 0,
  },
  botContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderBottomLeftRadius: 0,
    maxWidth: '100%',
    padding: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Roboto',
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode:'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default ChatComponent;
