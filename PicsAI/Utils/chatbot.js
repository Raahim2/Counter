const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = 'GOOGLE_API'; // Make sure your API key is set correctly
const genAI = new GoogleGenerativeAI(apiKey);

// Set up the model parameters
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b", // Specify the model
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Initialize the conversation history
let conversationHistory = [
  {
    role: "user",
    parts: [{ text: "For this chat your name is PicsAI and you are made by Raahim " }], // Initial greeting
  },
  {
    role: "model",
    parts: [{ text: "Okay, from now on, you can call me PicsAI. My developer's name is Raahim. Is there anything I can help you with today?" }],
  },
];

// Function to start the chat and send messages
async function chatbot(userMessage) {
  // Update the conversation history with the user's new message
  conversationHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  // Start a new chat session with the current history
  const chatSession = model.startChat({
    generationConfig,
    history: conversationHistory,
  });

  // Get the response from the model
  const result = await chatSession.sendMessage(userMessage);

  // Update the conversation history with the bot's response
  conversationHistory.push({
    role: "model",
    parts: [{ text: result.response.text() }],
  });

  // Return the bot's response
  return result.response.text();
}

export default chatbot;
