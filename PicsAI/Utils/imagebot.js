import { Buffer } from 'buffer';

async function imagecaption(imageUrl) {
  const HF_API = "HF_API"
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();

    // Convert the ArrayBuffer to a Buffer for compatibility with the API
    const imageData = Buffer.from(imageBuffer);

    // Send the image data to the Hugging Face API
    const apiResponse = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        headers: {
          Authorization: `Bearer ${HF_API}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: imageData,
      }
    );

    // Get the result from the API
    const result = await apiResponse.json();

    // Extract the generated text from the API response
    const generatedText = result[0]?.generated_text || "Sorry, I couldn't understand that";

    console.log(generatedText);  // Log the generated text for debugging
    return generatedText;  // Return the generated text
  } catch (error) {
    console.error('Error fetching image or API response:', error);
    return "Error occurred";
  }
}






export default {imagecaption  };
