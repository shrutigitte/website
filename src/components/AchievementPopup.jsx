import { motion, AnimatePresence } from "framer-motion";

export default function AchievementPopup({ queue, dismiss }) {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {queue.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={dismiss}
            className="pointer-events-auto cursor-pointer glass-card px-5 py-3.5 flex items-center gap-3 max-w-xs glow-purple"
          >
            <span className="text-2xl">{a.icon}</span>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-purple-400 font-bold">Achievement Unlocked</p>
              <p className="text-sm text-white/90 font-medium">{a.title}</p>
              <p className="text-[10px] text-white/30">{a.sub}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
