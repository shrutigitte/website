import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "../utils/analytics";

function FloatingStar({ onFind, delay, position }) {
  const [found, setFound] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleClick = () => {
    if (found) return;
    setFound(true);
    onFind?.();
    track("easter_egg_star");
  };

  if (!visible || found) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.1, 0.8] }}
      transition={{ duration: 3, repeat: Infinity }}
      onClick={handleClick}
      className="fixed cursor-pointer z-40 select-none hover:!opacity-100 hover:!scale-150 transition-transform"
      style={{ top: position.top, left: position.left }}
    >
      <span className="text-lg text-pink-300 hover:text-pink-500 transition-colors">✦</span>
    </motion.div>
  );
}

const starPositions = [
  { top: "12%", left: "6%" },
  { top: "38%", left: "93%" },
  { top: "62%", left: "4%" },
  { top: "85%", left: "91%" },
  { top: "55%", left: "50%" },
];

export default function EasterEggs({ onAchievement }) {
  const [starsFound, setStarsFound] = useState(0);
  const [secretMessage, setSecretMessage] = useState(null);
  const [konamiProgress, setKonamiProgress] = useState(0);

  const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight"];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === konamiCode[konamiProgress]) {
        const next = konamiProgress + 1;
        setKonamiProgress(next);
        if (next >= konamiCode.length) {
          setKonamiProgress(0);
          onAchievement?.("easter_egg");
          setSecretMessage("🎮 Konami code detected. You're officially a nerd. I respect that.");
          setTimeout(() => setSecretMessage(null), 4000);
          track("easter_egg_konami");
        }
      } else {
        setKonamiProgress(0);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [konamiProgress, onAchievement]);

  const handleStarFind = () => {
    const newCount = starsFound + 1;
    setStarsFound(newCount);
    if (newCount === 3) {
      onAchievement?.("curiosity_won");
      setSecretMessage("✦ 3 stars found — Secret: I spent more time on this website than I'd ever admit 😄");
      setTimeout(() => setSecretMessage(null), 5000);
    }
    if (newCount >= 5) {
      onAchievement?.("easter_egg");
      setSecretMessage("✦ ALL stars found — You're way too thorough. I'm impressed and slightly scared.");
      setTimeout(() => setSecretMessage(null), 5000);
    }
  };

  return (
    <>
      {starPositions.map((pos, i) => (
        <FloatingStar
          key={i}
          position={pos}
          delay={8000 + i * 6000}
          onFind={handleStarFind}
        />
      ))}

      <AnimatePresence>
        {secretMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl px-6 py-4 z-[110] max-w-sm text-center border border-white/50"
          >
            <p className="text-sm text-gray-700 font-medium">{secretMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
