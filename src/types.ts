export interface StoryPage {
  pageNumber: number;
  text: string;
  illustrationPrompt: string;
  imageUrl?: string;
  audioUrl?: string;
  isGeneratingImage?: boolean;
  isGeneratingAudio?: boolean;
}

export interface Story {
  title: string;
  summary: string;
  theme: string;
  pages: StoryPage[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Companion {
  id: "dragon" | "owl" | "robot";
  name: string;
  avatar: string; // Emoji or short description
  description: string;
  voiceName: "Kore" | "Puck" | "Zephyr" | "Fenrir" | "Charon";
  color: string; // Tailwind class
  bgColor: string; // Tailwind class
  accentColor: string; // Tailwind class
  modelName: string;
  greeting: string;
}
