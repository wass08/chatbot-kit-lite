import { generateUUID } from "three/src/math/MathUtils.js";
import { Lipsync } from "wawa-lipsync";
import { create } from "zustand";

const useChatbot = create((set, get) => ({
  loaded: false,
  setAppLoaded: () => set({ loaded: true }),
  audioPlayer: null,
  lipsyncManager: null,
  setupAudioPlayer: () => {
    if (typeof Audio === "undefined") {
      return; // Audio API is not supported in this environment (SSR)
    }
    const audioPlayer = new Audio();
    audioPlayer.crossOrigin = "anonymous"; // Ensure CORS is handled
    audioPlayer.preload = "auto"; // Preload audio for better performance

    const lipsyncManager = new Lipsync({});
    let lipsyncManagerInitialized = false;

    audioPlayer.onerror = (error) => {
      console.error("Audio playback error:", error);
    };
    audioPlayer.onplaying = () => {
      if (!lipsyncManagerInitialized) {
        lipsyncManager.connectAudio(audioPlayer);
        lipsyncManagerInitialized = true;
      }
      set({ status: "playing" });
    };
    audioPlayer.onended = () => {
      set({ status: "idle" });
    };
    set({ audioPlayer, lipsyncManager });
  },
  playAudio: (url) => {
    const audioPlayer = get().audioPlayer;
    if (!audioPlayer) {
      console.warn("Audio player is not set up yet.");
      return;
    }
    audioPlayer.src = url;
    audioPlayer.play();
  },
  status: "idle",
  messages: [],
  sessionId: generateUUID(),
  sendMessage: async (message) => {
    set((state) => ({
      messages: [...state.messages, { text: message, sender: "user" }],
      status: "loading",
    }));

    const data = await fetch(
      `${import.meta.env.VITE_API_URL}/chat?message=${encodeURIComponent(
        message
      )}&sessionId=${encodeURIComponent(get().sessionId)}`
    );

    const result = await data.json();
    set((state) => ({
      messages: [...state.messages, { text: result.output, sender: "bot" }],
    }));

    get().playAudio(
      `${import.meta.env.VITE_API_URL}/tts?message=${encodeURIComponent(
        result.output
      )}`
    );
  },
}));

useChatbot.getState().setupAudioPlayer();

export default useChatbot;
