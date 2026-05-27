import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { userName, creatorName } from "../utils/constants";
import { track } from "../utils/analytics";
import confetti from "canvas-confetti";

const slides = [
  { bg: "from-[#1a1a2e] to-[#16213e]", content: "intro" },
  { bg: "from-pink-600 to-rose-700", metric: "97%", title: "Curiosity Level", detail: "You clicked things most people wouldn't. That says something." },
  { bg: "from-emerald-600 to-teal-700", metric: "A+", title: "Green Flag Compatibility", detail: "Based on the completely unbiased algorithm I wrote. Trust me." },
  { bg: "from-purple-700 to-indigo-800", metric: "94%", title: "Side Quest Compatibility", detail: "We'd either be really fun together or a complete disaster. Probably both 😄" },
  { bg: "from-amber-600 to-orange-700", metric: "High", title: "Reel Tolerance", detail: "You haven't blocked me yet. The bar was low and you cleared it 📱" },
  { bg: "from-blue-600 to-indigo-700", metric: "89%", title: "Call Survival Probability", detail: "11% chance of awkward silence. I'll fill it with bad jokes. You're welcome." },
  { bg: "from-rose-600 to-pink-800", metric: null, title: "Final Verdict", detail: "this was genuinely fun to make 😄" },
];

export default function SpotifyWrapped() {
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!active || !autoPlay || current >= slides.length - 1) return;
    const timer = setTimeout(() => setCurrent((c) => c + 1), 4500);
    return () => clearTimeout(timer);
  }, [active, current, autoPlay]);

  const start = () => {
    setActive(true);
    setCurrent(0);
    track("wrapped_started");
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const next = () => { setAutoPlay(false); if (current < slides.length - 1) setCurrent((c) => c + 1); };
  const prev = () => { setAutoPlay(false); if (current > 0) setCurrent((c) => c - 1); };

  if (!active) {
    return (
      <section className="py-16 md:py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-2">Your Wrapped 🎵</h2>
          <p className="text-white/30 text-xs mb-8">A Spotify Wrapped-style summary of… whatever this is between us</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={start}
            className="px-8 py-4 bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white rounded-full font-semibold shadow-xl border border-white/10 cursor-pointer"
          >
            ▶ View Your Wrapped
          </motion.button>
        </motion.div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="py-16 md:py-20 px-4">
      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-br ${slide.bg} rounded-3xl p-8 md:p-10 text-center min-h-[440px] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden`}
          >
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl" />

            <div className="relative z-10">
              {slide.content === "intro" ? (
                <>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="text-white/40 text-xs uppercase tracking-widest mb-6">Your Wrapped</motion.p>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="text-3xl md:text-4xl font-black text-white mb-4">{userName} × {creatorName}</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="text-white/40 text-sm">Interaction Summary</motion.p>
                </>
              ) : (
                <>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-white/50 text-xs uppercase tracking-wider mb-4">{slide.title}</motion.p>
                  {slide.metric && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      className="text-6xl md:text-7xl font-black text-white mb-4"
                    >
                      {slide.metric}
                    </motion.p>
                  )}
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                    className="text-white/60 text-sm leading-relaxed max-w-xs">{slide.detail}</motion.p>
                  {current === slides.length - 1 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                      className="text-white/25 text-xs mt-8">— {creatorName}, who clearly has too much time and too many side projects</motion.p>
                  )}
                </>
              )}
            </div>

            {/* Progress */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {slides.map((_, i) => (
                <motion.div key={i} animate={{ width: i === current ? 18 : 6 }}
                  className={`h-1.5 rounded-full transition-colors duration-300 ${i === current ? "bg-white" : "bg-white/20"}`} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center mt-5 px-2">
          <button onClick={prev} disabled={current === 0}
            className="text-sm text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors cursor-pointer px-3 py-1">← prev</button>
          <p className="text-xs text-white/20">{current + 1} / {slides.length}</p>
          <button onClick={next} disabled={current === slides.length - 1}
            className="text-sm text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors cursor-pointer px-3 py-1">next →</button>
        </div>
      </div>
    </section>
  );
}
