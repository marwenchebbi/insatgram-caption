const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function getBase64FromImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data:image/jpeg;base64, prefix
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
}

export async function generateCaption(image: File) {
  try {
    const base64Image = await getBase64FromImage(image);
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inlineData: {
                mimeType: image.type,
                data: base64Image
              }
            },
            {
              text: "Generate a creative and engaging Instagram caption for this image. Make it catchy and include relevant hashtags."
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating caption:', error);
    return 'Sorry, I encountered an error generating the caption. Please try again.';
  }
} 