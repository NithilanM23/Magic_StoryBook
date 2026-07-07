import { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Play, 
  Pause, 
  Send, 
  ChevronRight, 
  Plus, 
  HelpCircle,
  Sparkle,
  MessageCircle,
  X,
  Volume1,
  RotateCcw,
  Bot,
  User,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { sound } from "./sound";
import { Story, StoryPage, ChatMessage, Companion } from "./types";

// PRE-POPULATED STORY SHELF TEMPLATES
const SHELF_STORIES: Story[] = [
  {
    title: "Oliver's Bubble Adventure",
    summary: "Oliver blows a magical bubble that floats him up to the cloud-castle!",
    theme: "Curiosity and friendship are the best keys to adventure.",
    pages: [
      {
        pageNumber: 1,
        text: "Oliver had a jar of glowing bubble soap. He blew a tiny bubble, then a medium one, and finally, a bubble as BIG as a bicycle! The big bubble wiggled, giggled, and floated gently in front of him.",
        illustrationPrompt: "watercolor illustration of a cute little boy with curly brown hair blowing a giant glowing rainbow soap bubble in a sunny green garden, whimsical style",
        imageUrl: "https://picsum.photos/seed/bubble1/800/600"
      },
      {
        pageNumber: 2,
        text: "With a soft *whoosh*, the bubble wrapped Oliver in a cozy, warm hug and lifted him right off the grass! Oliver laughed as he floated over the apple trees, waving hello to a surprised squirrel.",
        illustrationPrompt: "watercolor illustration of a cute little boy floating inside a giant rainbow bubble high above green apple trees, waving at a cute squirrel on a branch, whimsical style",
        imageUrl: "https://picsum.photos/seed/bubble2/800/600"
      },
      {
        pageNumber: 3,
        text: "Higher and higher they went, all the way to a fluffy castle made of pink cotton candy. There, a friendly cloud-puppy with wings barked happily and offered Oliver a marshmallow key to the castle gates.",
        illustrationPrompt: "watercolor illustration of a majestic pink cotton candy castle in the clouds, a cute winged puppy made of white fluff greeting a little boy floating in a bubble, magical sky, whimsical style",
        imageUrl: "https://picsum.photos/seed/bubble3/800/600"
      }
    ]
  },
  {
    title: "The Tiny Dragon's Spark",
    summary: "Pip is a tiny dragon who has lost his flame, but finds a sparkling friend.",
    theme: "True sparks come from sharing and laughter.",
    pages: [
      {
        pageNumber: 1,
        text: "Pip was a little green dragon about the size of a tea cup. He tried to breathe fire to toast his morning marshmallow, but only a tiny, sad bubble of purple smoke popped out. *Poof!*",
        illustrationPrompt: "3D claymation style of a tiny cute green baby dragon looking sad because only a purple puff of smoke came out of his snout, a single marshmallow on a twig in front of him, warm kitchen setting",
        imageUrl: "https://picsum.photos/seed/dragon1/800/600"
      },
      {
        pageNumber: 2,
        text: "Pip set off into the Whispering Forest to find his spark. Under a glowing mushroom, he met a shiny golden firefly named Stella, who was practicing her starry flashes. 'Let's find your spark together!' she buzzed.",
        illustrationPrompt: "3D claymation style of a tiny cute green baby dragon talking to a glowing gold firefly under a giant magical purple mushroom in a mystical forest, cute, detailed",
        imageUrl: "https://picsum.photos/seed/dragon2/800/600"
      },
      {
        pageNumber: 3,
        text: "Stella tickled Pip's nose with her glowing wings. Pip let out a giant, happy sneeze, and out shot a sparkling stream of magical, multicolored star-fire! It toasted their marshmallow perfectly.",
        illustrationPrompt: "3D claymation style of a tiny cute green baby dragon sneezing and breathing a stream of colorful star sparks, roasting a marshmallow on a twig next to a glowing golden firefly, happy faces",
        imageUrl: "https://picsum.photos/seed/dragon3/800/600"
      }
    ]
  },
  {
    title: "The Astronaut's Cosmic Key",
    summary: "Commander Maya searches the moon for her lost spaceship keys.",
    theme: "Being neat is helpful, but helpers are everywhere.",
    pages: [
      {
        pageNumber: 1,
        text: "Commander Maya was ready to fly back to Earth, but her rocket ship keys were missing! She searched her space pockets, her helmet, and even under her moon-boots. 'Where could they be?' she sighed.",
        illustrationPrompt: "crayon sketch of a cute young girl astronaut looking puzzled next to a shiny white rocket ship on the glowing moon, searching her pockets, cute, starry background",
        imageUrl: "https://picsum.photos/seed/space1/800/600"
      },
      {
        pageNumber: 2,
        text: "Suddenly, a friendly moon-octopus with three sparkly eyes slid out from behind a silver crater. He was juggling three shiny things: a moon-rock, a cosmic star-fruit, and Maya's glowing brass spaceship key!",
        illustrationPrompt: "crayon sketch of a friendly purple moon octopus with three sparkly eyes juggling a glowing spaceship key, a starry space fruit, and a shiny silver moon rock, cute, cheerful",
        imageUrl: "https://picsum.photos/seed/space2/800/600"
      },
      {
        pageNumber: 3,
        text: "Maya giggled and did a slow-motion moon dance. The moon-octopus handed her the key, and Maya shared her delicious strawberry astronaut ice cream with him. Together they watched Earth shine like a blue marble.",
        illustrationPrompt: "crayon sketch of a happy girl astronaut and a friendly purple moon octopus eating strawberry ice cream together on the lunar surface, looking at a beautiful blue Earth in the distance",
        imageUrl: "https://picsum.photos/seed/space3/800/600"
      }
    ]
  }
];

// COMPANION CONFIGURATIONS
const COMPANIONS: Companion[] = [
  {
    id: "dragon",
    name: "Sparky",
    avatar: "🐉",
    description: "Fun, warm, & full of crazy story ideas!",
    voiceName: "Zephyr",
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-orange-50",
    accentColor: "text-orange-500 border-orange-200 hover:bg-orange-100",
    modelName: "gemini-3.5-flash",
    greeting: "*Snort-crackle!* Hello there! I'm Sparky! 🌋 I can help you brainstorm silly story ideas, pretend to roast yummy marshmallows, or chat about magical realms! What adventure should we imagine today?",
  },
  {
    id: "owl",
    name: "Barnaby",
    avatar: "🦉",
    description: "Wise, gentle, & loves big words!",
    voiceName: "Kore",
    color: "from-emerald-400 to-teal-500",
    bgColor: "bg-teal-50",
    accentColor: "text-teal-600 border-teal-200 hover:bg-teal-100",
    modelName: "gemini-3.1-pro-preview",
    greeting: "Hoot-hoot! Salutations, young scholar. I am Barnaby. 📖 I love explaining tricky words, discussing the moral lessons of stories, or teaching you facts about science and nature. What would you like to explore?",
  },
  {
    id: "robot",
    name: "Zip",
    avatar: "🤖",
    description: "Fast-talking, quick games, & silly jokes!",
    voiceName: "Puck",
    color: "from-sky-400 to-indigo-500",
    bgColor: "bg-indigo-50",
    accentColor: "text-indigo-600 border-indigo-200 hover:bg-indigo-100",
    modelName: "gemini-3.1-flash-lite",
    greeting: "*Beep-boop-whirrr!* ZIP in the house! ⚡ Let's do some rapid word-association, play a fast-paced guessing game, or I can tell you some ultra-cool mechanical jokes! Ask me anything, fast-fast-fast!",
  }
];

export default function App() {
  // NAVIGATION & VIEW STATE
  const [currentView, setCurrentView] = useState<"lobby" | "reader">("lobby");
  
  // CREATION SCREEN INPUTS
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("watercolor");
  const [selectedCreativity, setSelectedCreativity] = useState("standard");
  const [selectedVoice, setSelectedVoice] = useState<"Kore" | "Puck" | "Zephyr" | "Fenrir" | "Charon">("Kore");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");

  // ACTIVE STORY STATE
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // CHAT COMPANION STATE
  const [activeCompanion, setActiveCompanion] = useState<Companion>(COMPANIONS[0]);
  const [chatMessages, setChatMessages] = useState<{ [key: string]: ChatMessage[] }>({
    dragon: [
      { id: "g1", role: "assistant", content: COMPANIONS[0].greeting, timestamp: new Date() }
    ],
    owl: [
      { id: "g2", role: "assistant", content: COMPANIONS[1].greeting, timestamp: new Date() }
    ],
    robot: [
      { id: "g3", role: "assistant", content: COMPANIONS[2].greeting, timestamp: new Date() }
    ],
  });
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // AUDIO/TTS STATE
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // CHAT AUTO-SCROLL
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeCompanion, isSidebarOpen]);

  // Cleanup audio on component unmount or page change
  useEffect(() => {
    stopActiveAudio();
  }, [currentPageIndex, activeStory]);

  const stopActiveAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
    setAudioBase64(null);
  };

  // STORY GENERATION ACTION
  const handleGenerateStory = async () => {
    if (!customPrompt.trim()) return;
    
    sound.playMagic();
    setIsGeneratingStory(true);
    setCurrentPageIndex(0);

    try {
      const response = await fetch("/api/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt,
          creativity: selectedCreativity,
          style: selectedStyle
        })
      });

      if (!response.ok) {
        throw new Error("Failed to conjure up the story! Try again.");
      }

      const data: Story = await response.json();
      
      // Initially, the generated pages will not have images or audios. We'll generate the first image immediately.
      setActiveStory(data);
      setCurrentView("reader");
      sound.playSuccess();

      // Trigger automatic image generation for the first page
      generateImageForPage(data, 0);

    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Oops! The magical library got a bit tangled. Please try again!");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // SELECT AND LOAD A TEMPLATE STORY
  const handleLoadTemplate = (story: Story) => {
    sound.playPop();
    // Copy story to prevent mutations
    const copy = JSON.parse(JSON.stringify(story)) as Story;
    setActiveStory(copy);
    setCurrentPageIndex(0);
    setCurrentView("reader");
    sound.playSuccess();
  };

  // TTS PLAY ALOUD ACTION
  const handlePlayAudio = async () => {
    if (!activeStory) return;
    const page = activeStory.pages[currentPageIndex];

    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      }
      return;
    }

    if (audioBase64) {
      // Audio is already generated, play it
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlayingAudio(true);
      }
      return;
    }

    // Generate new audio
    sound.playPop();
    setIsAudioLoading(true);

    try {
      // Modify page state
      const updatedStory = { ...activeStory };
      updatedStory.pages[currentPageIndex].isGeneratingAudio = true;
      setActiveStory(updatedStory);

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: page.text,
          voice: selectedVoice
        })
      });

      if (!response.ok) {
        throw new Error("Magic voice got lost in transit!");
      }

      const { audioData } = await response.json();
      setAudioBase64(audioData);

      // Create blob and play
      const binaryString = window.atob(audioData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlayingAudio(false);
      };

      audio.play();
      setIsPlayingAudio(true);

    } catch (err) {
      console.error(err);
    } finally {
      setIsAudioLoading(false);
      if (activeStory) {
        const updatedStory = { ...activeStory };
        updatedStory.pages[currentPageIndex].isGeneratingAudio = false;
        setActiveStory(updatedStory);
      }
    }
  };

  // PAGE RE-ILLUSTRATION (OR AUTOMATIC GEN)
  const generateImageForPage = async (storyContext: Story, pageIdx: number, promptOverride?: string) => {
    if (!storyContext) return;
    const page = storyContext.pages[pageIdx];
    const promptToUse = promptOverride || page.illustrationPrompt;

    sound.playMagic();
    
    // Set loading state
    const loadingStory = { ...storyContext };
    loadingStory.pages[pageIdx].isGeneratingImage = true;
    setActiveStory(loadingStory);

    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToUse,
          size: imageSize, // Use user selected size (1K, 2K, 4K)
          aspectRatio: "4:3"
        })
      });

      if (!response.ok) {
        throw new Error("Illustrator run failed");
      }

      const { imageUrl } = await response.json();

      const finalStory = { ...storyContext };
      finalStory.pages[pageIdx].imageUrl = imageUrl;
      finalStory.pages[pageIdx].isGeneratingImage = false;
      setActiveStory(finalStory);
      sound.playSuccess();

    } catch (error) {
      console.error("Image generation error:", error);
      // Fallback
      const finalStory = { ...storyContext };
      finalStory.pages[pageIdx].isGeneratingImage = false;
      if (!finalStory.pages[pageIdx].imageUrl) {
        finalStory.pages[pageIdx].imageUrl = `https://picsum.photos/seed/${pageIdx}-${Date.now()}/800/600`;
      }
      setActiveStory(finalStory);
    }
  };

  // CHAT MESSAGE SEND
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date()
    };

    // Update messages
    const currentCompanionId = activeCompanion.id;
    const currentHistory = chatMessages[currentCompanionId] || [];
    const updatedHistory = [...currentHistory, userMsg];
    
    setChatMessages(prev => ({
      ...prev,
      [currentCompanionId]: updatedHistory
    }));
    
    setChatInput("");
    setIsChatLoading(true);
    sound.playPop();

    try {
      // Prepare chat history payload for API
      // Keep only the last 15 messages to stay under limits
      const apiMessages = updatedHistory.slice(-15).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          companionType: currentCompanionId
        })
      });

      if (!response.ok) {
        throw new Error("Your companion got distracted!");
      }

      const { reply } = await response.json();

      const companionMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date()
      };

      setChatMessages(prev => ({
        ...prev,
        [currentCompanionId]: [...prev[currentCompanionId], companionMsg]
      }));
      sound.playMagic();

    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: `Oops! *Bloop!* Something went wrong in my digital tummy! Let's try saying that again.`,
        timestamp: new Date()
      };
      setChatMessages(prev => ({
        ...prev,
        [currentCompanionId]: [...prev[currentCompanionId], errorMsg]
      }));
    } finally {
      setIsChatLoading(false);
    }
  };

  // Quick Chat Suggestion Chips
  const handleSuggestionClick = (text: string) => {
    setChatInput(text);
  };

  // Preset prompts for kids
  const kidPrompts = [
    "A fluffy puppy learning to fly with bird wings",
    "A magical candy tree that grows giant pink lollipops",
    "A dinosaur who wants to play soccer with monkeys",
    "A shy little ghost looking for friendly monsters",
    "A toy spaceship traveling to a cheese planet"
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-purple-200">
      
      {/* MAGICAL NAVBAR */}
      <header className="bg-white/80 backdrop-blur-md border-b-4 border-purple-200 sticky top-0 z-40 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => { sound.playMagic(); setCurrentView("lobby"); }} 
            className="cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 p-2.5 rounded-2xl shadow-md text-white hover:scale-105 transition-transform"
          >
            <BookOpen className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-purple-900 tracking-tight flex items-center gap-2">
              Magic Storybook <span className="hidden sm:inline-block text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full border border-purple-200">Creator & Illustrator</span>
            </h1>
          </div>
        </div>

        {/* TOP LEVEL NAVIGATION & SIDEBAR TOGGLE */}
        <div className="flex items-center gap-3">
          {currentView === "reader" && (
            <button 
              onClick={() => { sound.playPop(); setCurrentView("lobby"); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl border border-purple-200 transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Bookshelf
            </button>
          )}

          <button 
            onClick={() => { sound.playPop(); setIsSidebarOpen(!isSidebarOpen); }}
            className={`flex items-center gap-2 px-4 py-2 font-bold rounded-xl border transition-all text-sm ${
              isSidebarOpen 
                ? "bg-purple-600 border-purple-700 text-white shadow-inner" 
                : "bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Story Buddy</span>
            <span className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded-full ml-1 font-bold hidden sm:inline">
              {activeCompanion.name}
            </span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            
            {/* LOBBY VIEW (BOOKSHELF & CREATION) */}
            {currentView === "lobby" && (
              <motion.div
                key="lobby"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12 pb-12"
              >
                {/* HERO BANNER */}
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-15 transform translate-x-12 -translate-y-12 w-96 h-96 bg-white rounded-full filter blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 left-10 opacity-10 w-64 h-64 bg-yellow-300 rounded-full filter blur-2xl pointer-events-none" />
                  
                  <div className="max-w-2xl relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold tracking-wide">
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                      Every page illustrated dynamically!
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                      Let's write a magical story together!
                    </h2>
                    <p className="text-purple-100 text-base md:text-lg font-medium leading-relaxed">
                      Type your favorite animals or planets, and our AI storyteller will craft a story just for you. It reads aloud and draws beautiful illustrations on every single page!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* STORY CREATOR PANEL */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border-4 border-purple-200 p-6 md:p-8 shadow-md space-y-6">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-purple-100">
                      <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
                        <Sparkle className="w-5 h-5 animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-purple-900">Custom Story Maker</h3>
                        <p className="text-sm text-purple-500 font-medium">Type anything, or tap a fun prompt below!</p>
                      </div>
                    </div>

                    {/* SUGGESTION CHIPS FOR KIDS */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-purple-500 uppercase tracking-wider block">Tap a magical idea:</span>
                      <div className="flex flex-wrap gap-2">
                        {kidPrompts.map((promptText, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              sound.playPop();
                              setCustomPrompt(promptText);
                            }}
                            className="text-xs px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-xl border border-purple-100 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                          >
                            ⭐ {promptText}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* STORY PROMPT INPUT */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-purple-900 block">Your Story Description:</label>
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="E.g., A funny penguin who wants to fly to the hot sun to get a nice suntan..."
                        className="w-full h-32 px-4 py-3 rounded-2xl border-2 border-purple-100 focus:border-purple-400 focus:outline-none text-base font-medium placeholder-purple-300 resize-none transition-colors"
                      />
                    </div>

                    {/* MAGIC CONTROLS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* ILLUSTRATION STYLE */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-purple-800 block">Art & Illustration Style:</label>
                        <select
                          value={selectedStyle}
                          onChange={(e) => { sound.playPop(); setSelectedStyle(e.target.value); }}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-purple-100 text-sm font-semibold focus:border-purple-400 bg-white"
                        >
                          <option value="watercolor">Watercolor Children's Book</option>
                          <option value="3D claymation">3D Claymation Toy</option>
                          <option value="crayon sketch">Pastel Crayon Drawing</option>
                          <option value="pixel art">Retro Pixel Art</option>
                          <option value="fantasy oil painting">Magical Fantasy Oil</option>
                        </select>
                      </div>

                      {/* TELLER VOICE */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-purple-800 block">Read-Aloud Voice (TTS):</label>
                        <select
                          value={selectedVoice}
                          onChange={(e: any) => { sound.playPop(); setSelectedVoice(e.target.value); }}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-purple-100 text-sm font-semibold focus:border-purple-400 bg-white"
                        >
                          <option value="Kore">Kore (Warm & Loving)</option>
                          <option value="Zephyr">Zephyr (Bright & Cheerful)</option>
                          <option value="Puck">Puck (Energetic Kid-like)</option>
                          <option value="Fenrir">Fenrir (Wise & Deep Storyteller)</option>
                          <option value="Charon">Charon (Soft & Peaceful Whisperer)</option>
                        </select>
                      </div>

                      {/* CREATIVITY MODEL */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-purple-800 block">Creative Storyteller Brain:</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => { sound.playPop(); setSelectedCreativity("standard"); }}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                              selectedCreativity === "standard"
                                ? "bg-purple-100 border-purple-400 text-purple-800 shadow-sm"
                                : "bg-white border-purple-50 text-purple-500 hover:border-purple-200"
                            }`}
                          >
                            Fast Story
                            <span className="block text-[9px] font-medium opacity-80">(gemini-3.5-flash)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { sound.playPop(); setSelectedCreativity("high"); }}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                              selectedCreativity === "high"
                                ? "bg-purple-100 border-purple-400 text-purple-800 shadow-sm"
                                : "bg-white border-purple-50 text-purple-500 hover:border-purple-200"
                            }`}
                          >
                            Super Creative
                            <span className="block text-[9px] font-medium opacity-80">(gemini-3.1-pro)</span>
                          </button>
                        </div>
                      </div>

                      {/* ILLUSTRATOR SIZE RESOLUTION */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-purple-800 block">Illustration Size (Resolution):</label>
                        <div className="grid grid-cols-3 gap-1">
                          {(["1K", "2K", "4K"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => { sound.playPop(); setImageSize(sz); }}
                              className={`px-2 py-3 text-xs font-bold rounded-xl border-2 transition-all ${
                                imageSize === sz
                                  ? "bg-purple-600 border-purple-700 text-white shadow-md"
                                  : "bg-white border-purple-100 text-purple-700 hover:border-purple-300"
                              }`}
                            >
                              {sz}
                              <span className="block text-[8px] font-medium opacity-80">
                                {sz === "1K" ? "Fast / HD" : sz === "2K" ? "Crisp / 2K" : "Max Quality"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* GENERATE BUTTON */}
                    <button
                      onClick={handleGenerateStory}
                      disabled={isGeneratingStory || !customPrompt.trim()}
                      className={`w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] sparkle-btn ${
                        isGeneratingStory || !customPrompt.trim()
                          ? "bg-purple-200 text-purple-400 cursor-not-allowed shadow-none"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                      }`}
                    >
                      {isGeneratingStory ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          <span>Mixing Magical Pixels & Words...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                          <span>Generate My Story Book!</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* READ-TO-GO BOOKSHELF */}
                  <div className="lg:col-span-5 bg-purple-50/60 rounded-3xl border-4 border-purple-100 p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      <h3 className="text-xl font-extrabold text-purple-900">Instant Ready Bookshelf</h3>
                    </div>
                    <p className="text-sm text-purple-600 font-medium leading-relaxed">
                      Tap any book below to load an instant story! You can read them right away, change their page illustrations, or ask your story companion questions.
                    </p>

                    <div className="space-y-4">
                      {SHELF_STORIES.map((story, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleLoadTemplate(story)}
                          className="bg-white rounded-2xl p-4 border-2 border-purple-100 hover:border-purple-400 shadow-sm hover:shadow-md cursor-pointer transition-all flex gap-4 hover:translate-x-1"
                        >
                          <div className="w-20 h-24 rounded-lg overflow-hidden bg-purple-100 shrink-0 relative border border-purple-200">
                            <img 
                              src={story.pages[0].imageUrl} 
                              alt={story.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent flex items-end justify-center p-1">
                              <span className="text-[9px] text-white font-extrabold uppercase">Read Now</span>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h4 className="text-base font-extrabold text-purple-950 line-clamp-1">{story.title}</h4>
                              <p className="text-xs text-purple-500 font-medium line-clamp-2 mt-1">{story.summary}</p>
                            </div>
                            <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 self-start mt-2">
                              {story.pages.length} Magic Pages
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* READER VIEW */}
            {currentView === "reader" && activeStory && (
              <motion.div
                key="reader"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="pb-12"
              >
                
                {/* STORYBOOK NAVIGATION HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-purple-100">
                  <div>
                    <button 
                      onClick={() => { sound.playPop(); setCurrentView("lobby"); }}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer mb-1"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Bookshelf
                    </button>
                    <h2 className="text-2xl sm:text-3xl font-black text-purple-950">{activeStory.title}</h2>
                    <p className="text-xs sm:text-sm text-purple-500 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-spin" />
                      <span>Theme/Moral: {activeStory.theme}</span>
                    </p>
                  </div>

                  {/* READ STATE/VOICE SELECT */}
                  <div className="flex items-center gap-2 shrink-0 bg-white p-2 rounded-2xl border-2 border-purple-100">
                    <span className="text-xs font-bold text-purple-800 px-2">Voice:</span>
                    <select
                      value={selectedVoice}
                      onChange={(e: any) => {
                        sound.playPop();
                        setSelectedVoice(e.target.value);
                        stopActiveAudio();
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-purple-200 text-xs font-bold bg-white text-purple-800 focus:outline-none focus:border-purple-400"
                    >
                      <option value="Kore">Kore (Warm)</option>
                      <option value="Zephyr">Zephyr (Bright)</option>
                      <option value="Puck">Puck (Fast)</option>
                      <option value="Fenrir">Fenrir (Wise)</option>
                      <option value="Charon">Charon (Whisper)</option>
                    </select>
                  </div>
                </div>

                {/* THE BOOK EXPERIENCE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* ILLUSTRATION DISPLAY CONTAINER (LEFT) */}
                  <div className="lg:col-span-6 bg-white rounded-3xl border-4 border-purple-200 p-4 shadow-md relative overflow-hidden flex flex-col space-y-4">
                    
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-purple-50 relative border-2 border-purple-100 group">
                      
                      {/* ACTIVE ILLUSTRATION */}
                      {activeStory.pages[currentPageIndex].isGeneratingImage ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-purple-50 to-indigo-50 animate-pulse">
                          <div className="relative">
                            <ImageIcon className="w-16 h-16 text-purple-400 animate-bounce" />
                            <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-purple-950">Mixing magical colors...</p>
                            <p className="text-xs text-purple-500 font-bold max-w-sm mt-1">
                              Generating {imageSize} illustration! Choosing custom palettes, sketching clouds, and drying the paint.
                            </p>
                          </div>
                          {/* FUNNY QUIP FOR KIDS */}
                          <div className="bg-white/80 border border-purple-100 px-3 py-1.5 rounded-full text-[10px] font-extrabold text-purple-600 animate-pulse">
                            🎨 Story Buddy is polishing the canvas!
                          </div>
                        </div>
                      ) : activeStory.pages[currentPageIndex].imageUrl ? (
                        <img 
                          src={activeStory.pages[currentPageIndex].imageUrl} 
                          alt={`Illustration for page ${currentPageIndex + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
                          <ImageIcon className="w-12 h-12 text-purple-300" />
                          <div>
                            <p className="text-base font-bold text-purple-900">No illustration yet</p>
                            <button
                              onClick={() => generateImageForPage(activeStory, currentPageIndex)}
                              className="mt-3 px-4 py-2 bg-purple-600 text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-colors shadow-sm cursor-pointer"
                            >
                              🎨 Generate Illustration Now
                            </button>
                          </div>
                        </div>
                      )}

                      {/* SIZE INDICATOR CHIP */}
                      {activeStory.pages[currentPageIndex].imageUrl && (
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20">
                          {imageSize} Illustration
                        </div>
                      )}
                    </div>

                    {/* REGENERATOR PANEL */}
                    <div className="bg-purple-50/60 p-4 rounded-2xl border-2 border-purple-100 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-black text-purple-900">Redraw or Edit Illustration:</span>
                        </div>

                        {/* SIZE SELECTOR ON PAGE */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-extrabold text-purple-600 mr-1">Quality:</span>
                          {(["1K", "2K", "4K"] as const).map((sz) => (
                            <button
                              key={sz}
                              onClick={() => { sound.playPop(); setImageSize(sz); }}
                              className={`px-2 py-0.5 text-[9px] font-black rounded-lg border transition-all ${
                                imageSize === sz 
                                  ? "bg-purple-600 text-white border-purple-700"
                                  : "bg-white text-purple-700 border-purple-200 hover:border-purple-300"
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* CUSTOM ILLUSTRATION PROMPT OVERRIDE */}
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          id={`prompt-override-${currentPageIndex}`}
                          placeholder="Type custom art ideas, e.g., 'Make it rain magical candy candy cane trees'..."
                          defaultValue={activeStory.pages[currentPageIndex].illustrationPrompt}
                          className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-purple-200 bg-white focus:outline-none focus:border-purple-400 text-purple-900"
                        />
                        <button
                          onClick={() => {
                            const inputEl = document.getElementById(`prompt-override-${currentPageIndex}`) as HTMLInputElement;
                            generateImageForPage(activeStory, currentPageIndex, inputEl?.value);
                          }}
                          disabled={activeStory.pages[currentPageIndex].isGeneratingImage}
                          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${activeStory.pages[currentPageIndex].isGeneratingImage ? 'animate-spin' : ''}`} />
                          <span>Redraw!</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-purple-500 font-bold">
                        Tip: You can change the drawing prompt completely to draw custom versions of your story!
                      </p>
                    </div>

                  </div>

                  {/* STORY TEXT & READER AUDIO CONTROLS (RIGHT) */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* PAGE COUNT AND MAIN BOOK AREA */}
                    <div className="bg-white rounded-3xl border-4 border-purple-200 p-6 md:p-8 shadow-md relative min-h-[280px] flex flex-col justify-between">
                      <div className="absolute top-4 right-4 text-xs font-bold text-purple-400">
                        Page {currentPageIndex + 1} of {activeStory.pages.length}
                      </div>

                      {/* STORY TEXT (FREDOKA FONT - LARGE) */}
                      <div className="space-y-4 py-4">
                        <p className="text-xl sm:text-2xl font-semibold leading-relaxed text-purple-950 tracking-wide text-center sm:text-left">
                          {activeStory.pages[currentPageIndex].text}
                        </p>
                      </div>

                      {/* PLAY CONTROLS & VOICE WAVEFORM */}
                      <div className="border-t-2 border-purple-50 pt-6 flex flex-col items-center sm:flex-row sm:justify-between gap-4">
                        
                        {/* READ ALOUD BUTTON */}
                        <button
                          onClick={handlePlayAudio}
                          disabled={isAudioLoading}
                          className={`px-5 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                            isPlayingAudio 
                              ? "bg-amber-500 text-white hover:bg-amber-600 hover:scale-[1.02]"
                              : isAudioLoading 
                              ? "bg-purple-100 text-purple-400 cursor-wait"
                              : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.02]"
                          }`}
                        >
                          {isAudioLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Warming vocal cords...</span>
                            </>
                          ) : isPlayingAudio ? (
                            <>
                              <Pause className="w-4 h-4" />
                              <span>Pause Reading</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4" />
                              <span>Read Aloud</span>
                            </>
                          )}
                        </button>

                        {/* AUDIO WAVEFORM SYNTHESIZED */}
                        {isPlayingAudio && (
                          <div className="flex items-center gap-1 px-4 py-2 bg-purple-50 rounded-full border border-purple-100">
                            <span className="text-[10px] font-extrabold text-purple-600 mr-1.5 animate-pulse">Reading Live...</span>
                            <div className="w-1 bg-purple-500 h-4 rounded-full animate-[bubbly_1s_infinite]" />
                            <div className="w-1 bg-purple-500 h-6 rounded-full animate-[bubbly_0.6s_infinite_0.1s]" />
                            <div className="w-1 bg-purple-500 h-3 rounded-full animate-[bubbly_0.8s_infinite_0.2s]" />
                            <div className="w-1 bg-purple-500 h-5 rounded-full animate-[bubbly_0.5s_infinite_0.3s]" />
                            <div className="w-1 bg-purple-500 h-2 rounded-full animate-[bubbly_1.2s_infinite]" />
                          </div>
                        )}
                        
                        {isAudioLoading && (
                          <span className="text-xs font-bold text-purple-400 animate-pulse">Converting text with gemini-3.1-flash-tts-preview...</span>
                        )}
                      </div>
                    </div>

                    {/* PAGE NAVIGATION BUTTONS */}
                    <div className="flex justify-between items-center gap-4 bg-purple-50 p-3 rounded-2xl border border-purple-100">
                      <button
                        onClick={() => {
                          if (currentPageIndex > 0) {
                            sound.playPageFlip();
                            setCurrentPageIndex(prev => prev - 1);
                          }
                        }}
                        disabled={currentPageIndex === 0}
                        className={`px-4 py-3 rounded-xl text-sm font-black flex items-center gap-1 cursor-pointer transition-transform active:scale-95 ${
                          currentPageIndex === 0 
                            ? "text-purple-300 bg-purple-100/50 cursor-not-allowed" 
                            : "text-purple-700 bg-white hover:bg-purple-100 border border-purple-200"
                        }`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {activeStory.pages.map((_, i) => (
                          <div 
                            key={i} 
                            onClick={() => {
                              if (i !== currentPageIndex) {
                                sound.playPageFlip();
                                setCurrentPageIndex(i);
                              }
                            }}
                            className={`w-3.5 h-3.5 rounded-full border-2 cursor-pointer transition-all ${
                              i === currentPageIndex 
                                ? "bg-purple-600 border-purple-800 scale-125" 
                                : "bg-purple-200 border-purple-300 hover:bg-purple-300"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (currentPageIndex < activeStory.pages.length - 1) {
                            sound.playPageFlip();
                            const nextIdx = currentPageIndex + 1;
                            setCurrentPageIndex(nextIdx);
                            // Pre-generate image for the next page if missing
                            if (!activeStory.pages[nextIdx].imageUrl && !activeStory.pages[nextIdx].isGeneratingImage) {
                              generateImageForPage(activeStory, nextIdx);
                            }
                          }
                        }}
                        disabled={currentPageIndex === activeStory.pages.length - 1}
                        className={`px-4 py-3 rounded-xl text-sm font-black flex items-center gap-1 cursor-pointer transition-transform active:scale-95 ${
                          currentPageIndex === activeStory.pages.length - 1 
                            ? "text-purple-300 bg-purple-100/50 cursor-not-allowed" 
                            : "text-purple-700 bg-white hover:bg-purple-100 border border-purple-200"
                        }`}
                      >
                        <span>Next Page</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </main>

        {/* SIDEBAR: STORY COMPANION CHAT PANEL */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", maxWidth: "380px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l-4 border-purple-200 bg-white flex flex-col h-[calc(100vh-80px)] shrink-0 z-30 shadow-2xl relative"
            >
              
              {/* CHAT HEADER */}
              <div className="p-4 border-b-2 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-xl text-purple-700">
                    <Bot className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-purple-950 text-base">Story Companions</h3>
                    <p className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">Multi-Turn Gemini Buddy</p>
                  </div>
                </div>
                <button 
                  onClick={() => { sound.playPop(); setIsSidebarOpen(false); }}
                  className="p-1 rounded-lg hover:bg-purple-100 text-purple-400 hover:text-purple-700 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* COMPANION SELECTOR TABS */}
              <div className="grid grid-cols-3 gap-1 p-2 bg-purple-100/50 border-b border-purple-100">
                {COMPANIONS.map((companion) => {
                  const isActive = activeCompanion.id === companion.id;
                  return (
                    <button
                      key={companion.id}
                      onClick={() => {
                        sound.playPop();
                        setActiveCompanion(companion);
                      }}
                      className={`py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-[1.02] cursor-pointer ${
                        isActive 
                          ? `bg-gradient-to-r ${companion.color} text-white shadow-md font-bold`
                          : "bg-white text-purple-700 border border-purple-100 hover:bg-purple-50 font-semibold"
                      }`}
                    >
                      <span className="text-xl">{companion.avatar}</span>
                      <span className="text-[10px] uppercase tracking-wide font-black">{companion.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* ACTIVE BUDDY DESCRIPTION */}
              <div className={`p-2.5 text-center text-[10px] font-extrabold border-b border-purple-50 ${activeCompanion.bgColor} text-purple-800`}>
                🧠 Model: <span className="underline font-mono">{activeCompanion.modelName}</span> — {activeCompanion.description}
              </div>

              {/* MESSAGES THREAD (SCROLLABLE) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-purple-50/20">
                {chatMessages[activeCompanion.id]?.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div 
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm shrink-0 border ${
                        isUser 
                          ? "bg-purple-600 text-white border-purple-700" 
                          : `bg-gradient-to-r ${activeCompanion.color} text-white border-white`
                      }`}>
                        {isUser ? <User className="w-4.5 h-4.5" /> : activeCompanion.avatar}
                      </div>

                      {/* Message Bubble */}
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                        isUser 
                          ? "bg-purple-600 text-white rounded-tr-none font-medium" 
                          : "bg-white text-purple-950 border border-purple-100 rounded-tl-none font-medium"
                      }`}>
                        <p>{msg.content}</p>
                        <span className={`block text-[8px] mt-1 text-right font-semibold ${isUser ? "text-purple-200" : "text-purple-400"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isChatLoading && (
                  <div className="flex gap-2.5 items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm shrink-0 border bg-gradient-to-r ${activeCompanion.color} text-white animate-bounce`}>
                      {activeCompanion.avatar}
                    </div>
                    <div className="bg-white border border-purple-100 text-purple-950 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs font-bold shadow-sm animate-pulse flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                      <span>{activeCompanion.name} is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* QUICK SUGGESTION CHIPS */}
              <div className="p-2 border-t border-purple-100 bg-white overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin scrollbar-thumb-purple-200">
                {activeCompanion.id === "dragon" && (
                  <>
                    <button onClick={() => handleSuggestionClick("Give me a crazy story plot idea about a banana!")} className="text-[10px] px-2.5 py-1.5 bg-orange-50 border border-orange-100 hover:bg-orange-100 text-orange-800 rounded-lg shrink-0 font-bold cursor-pointer">🍌 Banana Plot Idea</button>
                    <button onClick={() => handleSuggestionClick("How do dragons roast marshmallows?")} className="text-[10px] px-2.5 py-1.5 bg-orange-50 border border-orange-100 hover:bg-orange-100 text-orange-800 rounded-lg shrink-0 font-bold cursor-pointer">🍡 Roast Marshmallows</button>
                    <button onClick={() => handleSuggestionClick("Let's brainstorm a story about a flying pig!")} className="text-[10px] px-2.5 py-1.5 bg-orange-50 border border-orange-100 hover:bg-orange-100 text-orange-800 rounded-lg shrink-0 font-bold cursor-pointer">🐷 Flying Pig Story</button>
                  </>
                )}
                {activeCompanion.id === "owl" && (
                  <>
                    <button onClick={() => handleSuggestionClick("Explain the lesson behind this story.")} className="text-[10px] px-2.5 py-1.5 bg-teal-50 border border-teal-100 hover:bg-teal-100 text-teal-800 rounded-lg shrink-0 font-bold cursor-pointer">🧠 Story Lesson</button>
                    <button onClick={() => handleSuggestionClick("Tell me a cool nature fact about real owls.")} className="text-[10px] px-2.5 py-1.5 bg-teal-50 border border-teal-100 hover:bg-teal-100 text-teal-800 rounded-lg shrink-0 font-bold cursor-pointer">🌲 Nature Fact</button>
                    <button onClick={() => handleSuggestionClick("What is a synonym for 'magnificent'?")} className="text-[10px] px-2.5 py-1.5 bg-teal-50 border border-teal-100 hover:bg-teal-100 text-teal-800 rounded-lg shrink-0 font-bold cursor-pointer">📝 Tricky Synonyms</button>
                  </>
                )}
                {activeCompanion.id === "robot" && (
                  <>
                    <button onClick={() => handleSuggestionClick("Tell me a funny joke about computers!")} className="text-[10px] px-2.5 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-800 rounded-lg shrink-0 font-bold cursor-pointer">⚡ Robo Joke</button>
                    <button onClick={() => handleSuggestionClick("Let's do a fast word association game!")} className="text-[10px] px-2.5 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-800 rounded-lg shrink-0 font-bold cursor-pointer">🎮 Fast Word Game</button>
                    <button onClick={() => handleSuggestionClick("Beep boop! Give me a random robot sound!")} className="text-[10px] px-2.5 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-800 rounded-lg shrink-0 font-bold cursor-pointer">🔊 Beep Boop Sound</button>
                  </>
                )}
              </div>

              {/* CHAT INPUT AREA */}
              <div className="p-3 border-t-2 border-purple-100 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={`Chat with ${activeCompanion.name}...`}
                    className="flex-1 px-3.5 py-2 rounded-xl border-2 border-purple-100 focus:outline-none focus:border-purple-400 font-medium text-sm text-purple-950 placeholder-purple-300"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isChatLoading || !chatInput.trim()}
                    className={`p-2.5 rounded-xl transition-all flex items-center justify-center shadow-md cursor-pointer shrink-0 ${
                      isChatLoading || !chatInput.trim()
                        ? "bg-purple-100 text-purple-300 cursor-not-allowed shadow-none"
                        : "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 active:scale-95"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.aside>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
