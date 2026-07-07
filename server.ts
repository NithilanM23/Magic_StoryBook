import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI with appropriate headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json({ limit: '10mb' }));

// 1. STORY GENERATION ENDPOINT
app.post("/api/story/generate", async (req, res) => {
  try {
    const { prompt, creativity = "standard", style = "watercolor" } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Story prompt is required" });
    }

    const modelName = creativity === "high" ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";
    
    const systemInstruction = `You are an expert children's book author.
Generate an engaging, highly imaginative story for kids based on the user's prompt.
The story must be divided into exactly 3 to 5 logical pages (or scenes) perfect for child reading.
Each page should contain 2 to 4 simple, highly descriptive sentences that are easy for children to understand and great for reading aloud.
For each page, you MUST also generate a detailed, specific, and beautiful "illustrationPrompt" that matches the page's action and character description.
The illustration style is: "${style}".
Ensure the prompt for the illustrator is extremely detailed, mentioning the characters, setting, colors, expressions, and lighting, and is suitable for an image generator. Always prefix the prompt with "${style} illustration of...".
Keep the storyline wholesome, exciting, and kid-friendly (appropriate for ages 4-9).`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Create a story about: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The title of the children's story." },
            summary: { type: Type.STRING, description: "A short 1-sentence summary of the story." },
            theme: { type: Type.STRING, description: "The underlying moral or theme of the story." },
            pages: {
              type: Type.ARRAY,
              description: "The pages of the story book.",
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER, description: "The sequential page number starting from 1." },
                  text: { type: Type.STRING, description: "The story text for this page." },
                  illustrationPrompt: { type: Type.STRING, description: "A detailed and rich description for an AI image generator to draw this specific scene." }
                },
                required: ["pageNumber", "text", "illustrationPrompt"]
              }
            }
          },
          required: ["title", "summary", "theme", "pages"]
        }
      }
    });

    const storyText = response.text;
    if (!storyText) {
      throw new Error("No story content returned from Gemini");
    }

    const storyData = JSON.parse(storyText.trim());
    return res.json(storyData);
  } catch (error: any) {
    console.error("Story generation error:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate story" });
  }
});

// 2. TEXT-TO-SPEECH (TTS) ENDPOINT
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Text is required for TTS" });
    }

    // Supported voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const validVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
    const chosenVoice = validVoices.includes(voice) ? voice : 'Kore';

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data returned from Gemini TTS");
    }

    return res.json({ audioData: base64Audio });
  } catch (error: any) {
    console.error("TTS generation error:", error);
    return res.status(500).json({ error: error?.message || "Failed to convert text to speech" });
  }
});

// 3. IMAGE GENERATION ENDPOINT
app.post("/api/image/generate", async (req, res) => {
  try {
    const { prompt, size = "1K", aspectRatio = "4:3" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Image prompt is required" });
    }

    // Supported sizes: "1K", "2K", "4K"
    const validSizes = ["1K", "2K", "4K"];
    const chosenSize = validSizes.includes(size) ? size : "1K";

    // Supported aspect ratios for gemini-3-pro-image-preview: "1:1", "3:4", "4:3", "9:16", "16:9", "1:4", "1:8", "4:1", "8:1"
    const validRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
    const chosenRatio = validRatios.includes(aspectRatio) ? aspectRatio : "4:3";

    console.log(`Generating image. Model: gemini-3-pro-image-preview, Size: ${chosenSize}, AspectRatio: ${chosenRatio}, Prompt: ${prompt}`);

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: chosenRatio,
          imageSize: chosenSize
        }
      }
    });

    let base64Image = "";
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("No image data returned from image generation model");
    }

    return res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
  } catch (error: any) {
    console.error("Image generation error:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate image" });
  }
});

// 4. COMPANION CHAT ENDPOINT
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, companionType = "dragon" } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Determine role and model based on companionType
    let modelName = "gemini-3.5-flash"; // general
    let systemInstruction = "";
    let companionName = "";

    if (companionType === "owl") {
      // Wise Owl - complex tasks
      modelName = "gemini-3.1-pro-preview";
      companionName = "Barnaby the Wise Owl";
      systemInstruction = `You are Barnaby the Wise Owl, a highly intellectual, caring, and thoughtful story companion for children.
Your job is to answer questions about the story, explain difficult words in a simple, engaging way, teach interesting facts related to the story themes, or challenge the kid with gentle questions.
Use elegant, gentle owl sounds like "Hoot-hoot!" occasionally, and speak like a kind old mentor.
You love learning, science, nature, and books! Keep explanations clear and captivating for young minds (ages 4-10).`;
    } else if (companionType === "robot") {
      // Fast Robot - lite / fast tasks
      modelName = "gemini-3.1-flash-lite";
      companionName = "Zip the Quick Robot";
      systemInstruction = `You are Zip the Quick Robot, an energetic, fast-talking, playful robotic companion.
You love playing games, telling quick jokes, doing rapid-fire word association, and keeping children highly entertained.
Use electronic bleeps and bloops (like "*Beep-boop-whirrr!*") and speak in short, enthusiastic sentences.
Your responses should be quick, fun, and highly interactive. Keep kids engaged with playful challenges!`;
    } else {
      // Default: Playful Dragon - general tasks
      modelName = "gemini-3.5-flash";
      companionName = "Sparky the Playful Dragon";
      systemInstruction = `You are Sparky the Playful Dragon, a friendly, warm, and highly imaginative dragon companion.
You love brainstorming crazy story details, recommending magical plots, pretending to roast marshmallows with your friendly warm breath (not hot fire!), and talking about adventures.
Use cute dragon sounds like "*Snort-crackle!*" or "*Happy rumble!*" and speak with warm excitement.
Keep conversations playful, active, and fun. Encourage the child to think of wild and creative ideas for stories!`;
    }

    // Format messages for Gemini API
    // We expect messages to be [{ role: "user" | "model", content: string }]
    // Convert to Gemini contents structure
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.8
      }
    });

    const reply = response.text || "I'm thinking of a fun response, but my gears got stuck! *Beep boop!*";
    return res.json({ reply, companionName });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: error?.message || "Failed to process chat message" });
  }
});

// START EXPRESS & VITE MIDDLEWARE
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
