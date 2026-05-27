import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reactions = [
  { emoji: "👀", text: "watching..." },
  { emoji: "😏", text: "interesting choice" },
  { emoji: "🤭", text: "noted" },
  { emoji: "😌", text: "good taste" },
  { emoji: "👻", text: "still here" },
  { emoji: "🫠", text: "processing" },
];

function Ghost() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path
        d="M12 28C12 18.059 18.059 12 24 12C29.941 12 36 18.059 36 28V38C36 38 34 36 32 38C30 40 28 36 26 38C24 40 22 36 20 38C18 40 16 36 14 38C12 40 12 38 12 38V28Z"
        fill="rgba(255,255,255,0.85)"
      />
      {/* Left eye */}
      <circle cx="20" cy="24" r="2.5" fill="#1a0a2e" />
      {/* Right eye */}
      <circle cx="28" cy="24" r="2.5" fill="#1a0a2e" />
      {/* Blush */}
      <circle cx="17" cy="27" r="2" fill="rgba(244,114,182,0.3)" />
      <circle cx="31" cy="27" r="2" fill="rgba(244,114,182,0.3)" />
    </svg>
  );
}

export default function Mascot({ triggerCount }) {
  const [reaction, setReaction] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (triggerCount === 0) return;
    const r = reactions[triggerCount % reactions.length];
    setReaction(r);
    const timer = setTimeout(() => setReaction(null), 2500);
    return () => clearTimeout(timer);
  }, [triggerCount]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-50 flex items-end gap-2 pointer-events-none"
    >
      {/* Ghost */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="opacity-70"
      >
        <Ghost />
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence>
        {reaction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -5 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 mb-4"
          >
            <p className="text-[11px] text-white/60 whitespace-nowrap">
              {reaction.emoji} {reaction.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
