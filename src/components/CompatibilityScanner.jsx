import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "../utils/constants";
import { track } from "../utils/analytics";

const scanMessages = [
  "analyzing humor compatibility…",
  "checking reel tolerance…",
  "checking decision-making quality…",
  "scanning for green flags…",
  "measuring reply speed anxiety…",
  "cross-referencing vibe databases…",
  "calculating late night call potential…",
  "compiling emotional improvisation score…",
  "finalizing report…",
];

const metrics = [
  { label: "Meme Compatibility", value: 92, emoji: "😂", color: "from-pink-500 to-rose-500" },
  { label: "Cinematic Energy Match", value: 81, emoji: "🎬", color: "from-purple-500 to-indigo-500" },
  { label: "Late Night Call Potential", value: 86, emoji: "🌙", color: "from-blue-500 to-cyan-500" },
  { label: "Reel Tolerance", value: 88, emoji: "📱", color: "from-amber-500 to-orange-500" },
  { label: "Emotional Damage Probability", value: 37, emoji: "💀", color: "from-emerald-500 to-teal-500" },
  { label: "Reading Too Much Into Texts", value: 94, emoji: "📖", color: "from-rose-500 to-pink-500" },
  { label: "Overall Vibe Match", value: 89, emoji: "✨", color: "from-violet-500 to-purple-500" },
];

export default function CompatibilityScanner({ onAchievement }) {
  const [scanning, setScanning] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [done, setDone] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const intervalRef = useRef(null);

  const startScan = () => {
    setScanning(true);
    setCurrentMsg(0);
    setDone(false);
    setShowMetrics(false);
    track("scanner_started");
    onAchievement?.("compatibility_scan");

    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      if (i >= scanMessages.length) {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          setDone(true);
          setScanning(false);
          setTimeout(() => setShowMetrics(true), 500);
        }, 600);
      } else {
        setCurrentMsg(i);
      }
    }, 900);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <section className="py-16 md:py-20 px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-md mx-auto text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-2">
          Compatibility Scanner™ 📡
        </h2>
        <p className="text-white/30 text-xs mb-8">
          Powered by questionable science, vibes, and slight bias
        </p>

        {!scanning && !done && (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={startScan}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-xl glow-purple cursor-pointer transition-all"
          >
            🔬 Run Compatibility Scan
          </motion.button>
        )}

        {scanning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            {/* Animated scan line */}
            <div className="relative mb-5 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentMsg + 1) / scanMessages.length) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentMsg}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-sm text-white/60 font-mono"
              >
                {scanMessages[currentMsg]}
              </motion.p>
            </AnimatePresence>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mt-5"
            />
          </motion.div>
        )}

        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-3xl mb-3"
            >
              ✓
            </motion.div>
            <p className="text-lg font-bold text-white/90 mb-1">Scan Complete</p>
            <p className="text-xs text-white/30 mb-8">Disclaimer: I wrote the algorithm so results may be slightly biased in my favor 😄</p>

            {showMetrics && (
              <div className="space-y-5 text-left">
                {metrics.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60 font-medium">
                        {m.emoji} {m.label}
                      </span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.12 + 0.5 }}
                        className="text-white font-bold"
                      >
                        {m.value}%
                      </motion.span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${m.color} rounded-full relative`}
                        initial={{ width: 0 }}
                        animate={{ width: `${m.value}%` }}
                        transition={{ duration: 1.2, delay: i * 0.12 + 0.3, ease: "easeOut" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="pt-5 text-center border-t border-white/5"
                >
                  <p className="text-sm text-white/50 italic">
                    Overall verdict: suspiciously compatible. Further investigation recommended 👀
                  </p>
                  <p className="text-[10px] text-white/20 mt-2">
                    (emotional damage probability is low. I promise I'm mostly harmless)
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
