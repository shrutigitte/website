import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "../utils/constants";
import { saveInteraction } from "../utils/analytics";

const options = [
  { label: "this was actually fun", reaction: "genuinely glad to hear that. effort validated. 😄" },
  { label: "respectfully unhinged", reaction: "the highest compliment I could receive honestly." },
  { label: "I need to process this", reaction: "understandable. I also had to process making it." },
  { label: "send help 😂", reaction: "help is not coming. only more side projects." },
];

export default function CTA() {
  const [picked, setPicked] = useState(null);

  const handlePick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    saveInteraction("final_vibe_check", options[i].label);
  };

  return (
    <section className="py-16 md:py-20 px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-md mx-auto text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-4">
          Final Vibe Check ✨
        </h2>
        <p className="text-white/50 text-sm mb-2">
          okay.
        </p>
        <p className="text-white/50 text-sm mb-8">
          this was a very normal and emotionally stable thing to make 😄
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              onClick={() => handlePick(i)}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-3 rounded-full text-sm cursor-pointer border transition-all duration-300 ${
                picked === i
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-transparent shadow-lg glow-pink scale-105"
                  : picked !== null
                  ? "bg-white/3 text-white/25 border-white/5"
                  : "glass-button text-white/70 hover:border-purple-400/30 hover:text-white/90"
              }`}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {picked !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 glass-card p-6 border-glow"
            >
              <p className="text-white/70 text-sm italic">{options[picked].reaction}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
