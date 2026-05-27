import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "../utils/constants";
import { track } from "../utils/analytics";

const photos = [
  {
    caption: "around here I realized I was slightly doomed 😄",
    backText: "This moment lives in my head rent-free. Not in a weird way. Okay maybe slightly weird.",
    rotation: -3,
    color: "from-rose-500/20 to-pink-500/10",
    emoji: "📸",
    accent: "pink",
  },
  {
    caption: "evidence collected over multiple years",
    backText: "If being observant was a sport I'd have multiple trophies by now.",
    rotation: 2.5,
    color: "from-purple-500/20 to-indigo-500/10",
    emoji: "✨",
    accent: "purple",
  },
  {
    caption: "this probably looked normal to everyone else 😄",
    backText: "Plot twist: it was not normal in my head. There was a full cinematic sequence happening internally.",
    rotation: -1.5,
    color: "from-amber-500/20 to-orange-500/10",
    emoji: "🎬",
    accent: "amber",
  },
];

function PolaroidCard({ photo, index, onAchievement }) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped) {
      onAchievement?.("double_click");
      track("scrapbook_flip", { index });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: photo.rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: photo.rotation }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 + 0.1, duration: 0.7, ease: "easeOut" }}
      whileHover={{ scale: 1.08, rotate: 0, y: -8, zIndex: 10 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onDoubleClick={handleFlip}
      className="relative cursor-pointer select-none group"
      style={{ perspective: "1000px" }}
    >
      {/* Glow effect on hover */}
      <motion.div
        animate={{ opacity: hovered ? 0.4 : 0 }}
        className={`absolute inset-0 bg-gradient-to-br ${photo.color} rounded-2xl blur-xl -z-10`}
      />

      {/* Tape */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/10 border border-white/10 backdrop-blur-sm rounded-sm z-10 rotate-1" />

      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="glass-card p-3 pb-14"
             style={{ backfaceVisibility: "hidden" }}>
          <div className={`w-full aspect-square bg-gradient-to-br ${photo.color} rounded-xl flex items-center justify-center relative overflow-hidden`}>
            <motion.span
              animate={hovered ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.8 }}
              className="text-5xl"
            >
              {photo.emoji}
            </motion.span>
            {/* Shimmer */}
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            />
            {/* Hover hint */}
            <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-white/50 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">double-click to flip</span>
            </div>
          </div>
          <p className="absolute bottom-4 left-3 right-3 text-center text-sm text-white/40 italic">
            {photo.caption}
          </p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 glass-card p-5 flex items-center justify-center"
             style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div className="text-center">
            <p className="text-sm text-white/70 italic leading-relaxed">{photo.backText}</p>
            <p className="text-[10px] text-white/20 mt-4">← double-click to flip back</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Scrapbook({ onAchievement }) {
  return (
    <section className="py-16 md:py-20 px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-3xl mx-auto"
        onViewportEnter={() => onAchievement?.("scrapbook_peek")}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gradient mb-2">
          Memory Fragments 📸
        </h2>
        <p className="text-center text-white/30 text-xs mb-3">
          A curated collection of moments that meant more than they looked
        </p>
        <p className="text-center text-white/15 text-[10px] mb-12">
          (hover to inspect. double-click for the backstory.)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 max-w-2xl mx-auto">
          {photos.map((photo, i) => (
            <PolaroidCard key={i} photo={photo} index={i} onAchievement={onAchievement} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
