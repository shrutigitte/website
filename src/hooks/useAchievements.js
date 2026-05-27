import { useState, useCallback, useRef } from "react";
import { track } from "../utils/analytics";

const ACHIEVEMENT_DEFS = {
  stayed_long: { title: "Stayed longer than expected", icon: "⏳", sub: "time flies when it's cute" },
  curiosity_won: { title: "Curiosity won", icon: "👀", sub: "knew it" },
  quiz_complete: { title: "Research submitted", icon: "🔬", sub: "data collected successfully" },
  easter_egg: { title: "Secret finder", icon: "🥚", sub: "you weren't supposed to see that" },
  return_visitor: { title: "Back for more", icon: "🔄", sub: "the algorithm predicted this" },
  scrapbook_peek: { title: "Memory unlocked", icon: "📸", sub: "nostalgia incoming" },
  vault_opened: { title: "Vault cracked", icon: "🔓", sub: "emotional damage loading" },
  console_hacker: { title: "Tried to hack me", icon: "💻", sub: "bold move" },
  full_scroll: { title: "Scrolled the whole thing", icon: "📜", sub: "commitment detected" },
  double_click: { title: "Double-tap detective", icon: "👆", sub: "you found something" },
  compatibility_scan: { title: "Scanned for vibes", icon: "📡", sub: "results may be biased" },
  reel_tolerance: { title: "Elite reel tolerance", icon: "📱", sub: "don't unfollow me" },
  guess_master: { title: "Predicted correctly", icon: "🎯", sub: "are you psychic or just paying attention" },
  mini_game_player: { title: "Mini game enjoyer", icon: "🎮", sub: "competitive spirit noted" },
  emotional_investor: { title: "Emotionally invested", icon: "💭", sub: "too late to leave now" },
};

export function useAchievements() {
  const [queue, setQueue] = useState([]);
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("crush_achievements") || "[]");
    } catch { return []; }
  });
  const timeoutRef = useRef(null);

  const unlock = useCallback((id) => {
    if (unlocked.includes(id)) return;
    const def = ACHIEVEMENT_DEFS[id];
    if (!def) return;

    const newUnlocked = [...unlocked, id];
    setUnlocked(newUnlocked);
    localStorage.setItem("crush_achievements", JSON.stringify(newUnlocked));
    track("achievement_unlocked", { achievement: id });

    setQueue((q) => [...q, { id, ...def }]);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setQueue((q) => q.slice(1));
    }, 3500);
  }, [unlocked]);

  const dismiss = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  return { queue, unlocked, unlock, dismiss, totalPossible: Object.keys(ACHIEVEMENT_DEFS).length };
}
