import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const API_KEY = "API_KEY_HERE";

const InteractiveText = ({ recording }) => {
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recording?.uri) {
      transcribeAudio(recording.uri);
    }
  }, [recording]);

  const transcribeAudio = async (audioUri) => {
    try {
      // 1. Upload the audio file
      const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: { "authorization": API_KEY },
        body: await fetch(audioUri).then(res => res.blob()),
      });

      const uploadData = await uploadResponse.json();
      const audioUrl = uploadData.upload_url;

      // 2. Send for transcription
      const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        headers: {
          "authorization": API_KEY,
          "content-type": "application/json"
        },
        body: JSON.stringify({ audio_url: audioUrl, speaker_labels: true })
      });

      const transcriptData = await transcriptResponse.json();
      const transcriptId = transcriptData.id;

      // 3. Polling until transcription is complete
      let transcriptText = "";
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before checking again

        const checkResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          method: "GET",
          headers: { "authorization": API_KEY }
        });

        const checkData = await checkResponse.json();
        if (checkData.status === "completed") {
          transcriptText = checkData.text;
          break;
        } else if (checkData.status === "failed") {
          setTranscription("Failed to transcribe.");
          setLoading(false);
          return;
        }
      }

      setTranscription(transcriptText);
      setLoading(false);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setTranscription("Error transcribing audio.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Text style={styles.text}>{transcription}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default InteractiveText;
