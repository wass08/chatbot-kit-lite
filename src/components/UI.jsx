import { motion } from "motion/react";
import { useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import useChatbot from "../hooks/useChatbot";

export const UI = () => {
  const [input, setInput] = useState("");
  const messages = useChatbot((state) => state.messages);
  const sendMessage = useChatbot((state) => state.sendMessage);
  const status = useChatbot((state) => state.status);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const appLoaded = useChatbot((state) => state.loaded);

  const lastTwoMessages = messages.slice(-2);

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black z-2 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: appLoaded ? 0 : 1 }}
        transition={{ duration: 2 }}
      >
        {!appLoaded && (
          <div className="w-full h-full flex items-center justify-center">
            <ImSpinner8 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}
      </motion.div>
      {appLoaded && (
        <main className="fixed inset-0 pointer-events-none z-10 flex flex-col bg-radial from-transparent via-black/10 to-black/80">
          <div className="w-full py-10">
            <motion.h1
              className="font-bold font-display text-red-500 text-5xl lg:text-8xl text-center -rotate-6 -translate-3"
              initial={{
                opacity: 0,
                y: -50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
              }}
            >
              Santa
              <motion.span
                className="text-white inline-block"
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{
                  delay: 0.75,
                }}
              >
                Hotline
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-center text-md lg:text-2xl text-white"
              initial={{
                opacity: 0,
                y: -50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1,
              }}
            >
              Ask Santa what you want for Christmas!
            </motion.p>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-end">
            <div className="space-y-4 max-w-md mx-auto w-full">
              {lastTwoMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[75%] px-5 py-3 rounded-2xl backdrop-blur-md shadow-lg pointer-events-auto ${
                      msg.sender === "user"
                        ? "bg-white/20 text-white border border-white/30 rounded-br-md"
                        : "bg-black/20 text-white border border-white/20 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {status === "loading" && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="px-5 py-3 rounded-2xl rounded-bl-md backdrop-blur-md shadow-lg bg-black/20 border border-white/20">
                    <ImSpinner8 className="w-5 h-5 text-white animate-spin" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          <motion.div
            className="pb-6 flex flex-col gap-2 items-center pointer-events-auto"
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: status === "loading" ? 0 : 1,
              y: status === "loading" ? 50 : 0,
            }}
            transition={{
              delay: status === "loading" ? 0 : 1.5,
            }}
          >
            <div className="relative max-w-md w-full">
              <input
                autoFocus
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full px-5 py-3 pr-12 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:bg-white/25 focus:border-white/50 transition-all shadow-lg"
              />
              <button
                onClick={handleSend}
                disabled={status === "loading"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors disabled:opacity-50"
              >
                <IoSend className="w-5 h-5" />
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <a
                className="text-white"
                href="https://wawasensei.dev/chatbot-kit"
              >
                Build your own chatbot with Chatbot Kit
              </a>
            </motion.div>
          </motion.div>
        </main>
      )}
    </>
  );
};
