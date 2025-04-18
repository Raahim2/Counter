import React, { useState } from 'react';
import Navbar from '../components/navbar';
import PromptBar from '../components/promptbar';
import ChatComponent from '../components/chat';
import chatbot from '../Utils/chatbot';
import imagebot from '../Utils/imagebot';

const HomeScreen = () => {
  const [userMessages, setUserMessages] = useState([]);
  const [botMessages, setBotMessages] = useState([]);

  const handleSubmit = async ({ text, image }) => {
    setUserMessages((prevMessages) => [
      ...prevMessages,
      { text, image }, // Store both text and image
    ]);

    try {
      if (image) {
        const botResponse = await imagebot.imagecaption(image);
        setBotMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse },
        ]);
      } else if (text) {
        // Bot response for text submissions
        const botResponse = await chatbot(text);

        setBotMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse },
        ]);
      }
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setBotMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, I couldn't understand that." },
      ]);
    }
  };

  return (
    <>
      <Navbar setBotMesseges={setBotMessages} setUsermesseges={setUserMessages}/>
      <ChatComponent userMessages={userMessages} botMessages={botMessages} />
      <PromptBar onSubmit={handleSubmit} />
    </>
  );
};

export default HomeScreen;
