import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "../utils/constants";
import { saveInteraction } from "../utils/analytics";

const vibeOptions = [
  "Currently functioning ✅",
  "Powered by caffeine ☕",
  "Mentally in another dimension 🌀",
  "Pretending everything is fine 😄",
];

const vibeReactions = [
  "respectable. rare but respectable.",
  "same. always same.",
  "honestly? relatable. come back when you land.",
  "the most honest answer here 😄",
];

export default function VibeCheck() {
  const [picked, setPicked] = useState(null);
  const [showDeep, setShowDeep] = useState(false);
  const [deepText, setDeepText] = useState("");
  const [deepSent, setDeepSent] = useState(false);

  const handlePick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    saveInteraction("vibe_check", vibeOptions[i]);
  };

  const sendDeep = () => {
    if (!deepText.trim()) return;
    saveInteraction("deep_question", deepText);
    setDeepSent(true);
  };

  return (
    <section className="py-16 md:py-20 px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-md mx-auto">

        {/* Emergency Vibe Check */}
        <div className="glass-card p-6 text-center mb-10">
          <p className="text-xs text-pink-400 font-bold uppercase tracking-widest mb-1">🚨 Emergency Vibe Check 🚨</p>
          <p className="text-white/80 font-medium mb-4">Current status?</p>

          <div className="flex flex-wrap gap-2 justify-center">
            {vibeOptions.map((opt, i) => (
              <motion.button
                key={i}
                onClick={() => handlePick(i)}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2.5 rounded-full text-sm cursor-pointer border transition-all duration-300 ${
                  picked === i
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-transparent shadow-lg glow-pink"
                    : picked !== null
                    ? "bg-white/3 text-white/25 border-white/5"
                    : "glass-button text-white/70 hover:border-purple-400/30 hover:text-white/90"
                }`}
              >
                {opt}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {picked !== null && (
              <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4 text-sm text-white/40 italic">
                {vibeReactions[picked]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Quiet deep question */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center px-4"
        >
          {!showDeep ? (
            <motion.button
              onClick={() => setShowDeep(true)}
              whileHover={{ scale: 1.02 }}
              className="text-white/20 text-sm cursor-pointer hover:text-white/35 transition-colors"
            >
              one slightly deeper question (optional) →
            </motion.button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-white/50 text-sm mb-1">you don't have to answer this —</p>
              <p className="text-white/70 font-medium mb-4">but what's something you wish people understood about you?</p>

              {!deepSent ? (
                <div className="max-w-sm mx-auto">
                  <textarea
                    value={deepText}
                    onChange={(e) => setDeepText(e.target.value)}
                    placeholder="no pressure. skip if you want."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl text-sm bg-white/4 border border-white/8 text-white/70 placeholder:text-white/15 focus:outline-none focus:border-purple-400/20 transition-colors resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] text-white/15">completely optional</p>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={sendDeep}
                      className="px-4 py-2 rounded-full text-xs bg-white/5 border border-white/10 text-white/40 cursor-pointer hover:text-white/60 hover:border-white/20 transition-all"
                    >
                      share
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/30 text-sm italic mt-2">
                  thank you for trusting me with that.
                </motion.p>
              )}
            </motion.div>
          )}
        </motion.div>

      </motion.div>
    </section>
  );
}
