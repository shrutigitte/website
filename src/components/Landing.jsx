import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "./Typewriter";
import { userName, fadeUp } from "../utils/constants";
import { track } from "../utils/analytics";

export default function Landing({ onContinue }) {
  const [typingDone, setTypingDone] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Animated rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[500px] border border-purple-500/10 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute w-[350px] h-[350px] border border-pink-500/10 rounded-full"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="glass-card border-glow max-w-lg w-full p-7 md:p-10 text-center relative"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-pink-500/60 to-transparent rounded-full" />

        <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
          <Typewriter
            text={`Hi ${userName}. This is either the cutest thing you'll see today… or the most unnecessary. No in-between.`}
            onDone={() => setTypingDone(true)}
          />
        </p>

        <AnimatePresence>
          {typingDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="mt-5 text-white/40 text-sm leading-relaxed">
                I made this because texting felt too normal and I needed a challenge 😄
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(236, 72, 153, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { track("landing_continue"); onContinue(); }}
                className="mt-7 px-7 py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-lg glow-pink cursor-pointer transition-all duration-300"
              >
                👉 Continue (at your own risk)
              </motion.button>
              <p className="mt-4 text-[10px] text-white/20">
                estimated time: 5 minutes. emotional damage: minimal. probably.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
