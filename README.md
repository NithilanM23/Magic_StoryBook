# 📖 Magic Storybook: Creator & Illustrator

**Magic Storybook** is an interactive, AI-powered storybook creator and reader designed specifically for kids. It crafts highly imaginative stories based on simple prompts, reads them aloud using rich Text-to-Speech (TTS), and generates stunning, page-by-page illustrations dynamically. 

Kids can also interact with magical AI "Story Companions" (a dragon, an owl, or a robot) to brainstorm ideas, ask questions, or play games!

## ✨ Visual Showcase

Here is a glimpse of the Magic Storybook interface:

![Magic Storybook Interface - View 1](./images/Screenshot%202026-07-07%20112812.png)
*The main creator lobby where you can prompt your own story or choose from the Instant Ready Bookshelf. You can also see the interactive Story Buddy panel on the right.*

![Magic Storybook Interface - View 2](./images/Screenshot%202026-07-07%20112824.png)
*Detailed view showing the custom story generation options like Art & Illustration Style, Read-Aloud Voice, Creativity Level, and Illustration Resolution.*

## 🚀 Key Features

* **Custom Story Generation:** Type a prompt or select a fun suggestion, and the AI will craft a wholesome 3-5 page story complete with a moral theme.
* **Dynamic Page Illustrations:** Every page is brought to life with a unique AI-generated illustration. You can choose the art style (e.g., Watercolor, 3D Claymation, Pixel Art) and resolution (1K, 2K, 4K).
* **Immersive Read-Aloud (TTS):** Choose from multiple unique voices (Kore, Zephyr, Puck, Fenrir, Charon) to have the story read aloud to you using expressive AI speech.
* **Multi-Turn Story Companions:** Chat with friendly AI buddies directly in the app:
  * 🐉 **Sparky the Dragon:** Playful and full of crazy story ideas.
  * 🦉 **Barnaby the Owl:** Wise, gentle, and loves explaining tricky words.
  * 🤖 **Zip the Robot:** Fast-talking, energetic, and ready for quick games.
* **Instant Ready Bookshelf:** Don't want to write? Jump straight into pre-generated magical templates.

## 🛠 Tech Stack

This project is built using modern web technologies and Google's latest generative AI models:

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS (v4), Framer Motion, and Lucide React.
* **Backend:** Express.js (Node.js) to serve API routes and handle AI requests securely.
* **AI Integration (Google Gen AI SDK):**
  * `gemini-3.5-flash` & `gemini-3.1-pro-preview` for Story Generation & Chat.
  * `gemini-3.1-flash-tts-preview` for Text-to-Speech capabilities.
  * `gemini-3-pro-image-preview` for generating page illustrations.

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
* Node.js installed on your machine.
* A [Gemini API Key](https://aistudio.google.com/app/apikey).

### Installation

1. **Clone the repository** (if you haven't already) and navigate into the project directory.

2. **Install dependencies:**
   ```bash
   npm install
