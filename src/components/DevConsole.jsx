import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../utils/constants";

const logs = [
  { type: "system", text: "> initializing confidence..." },
  { type: "error", text: "✗ confidence.exe failed successfully" },
  { type: "system", text: "> loading school crush memories..." },
  { type: "warn", text: "⚠ warning: found 847 unnecessary hypothetical situations" },
  { type: "system", text: "> compiling unnecessary effort..." },
  { type: "success", text: "✓ effort.build complete (took 3 weeks and 5 existential crises)" },
  { type: "system", text: "> loading charm module..." },
  { type: "error", text: "✗ charm.js: module not found. falling back to humor.js" },
  { type: "success", text: "✓ humor.js loaded (quality: debatable)" },
  { type: "system", text: "> checking emotional stability..." },
  { type: "error", text: "✗ results inconclusive 😄" },
  { type: "system", text: "> deploying website to crush..." },
  { type: "warn", text: "⚠ risk assessment: HIGH. deploying anyway." },
  { type: "success", text: "✓ deploy successful. outcome: pending" },
  { type: "system", text: "> running outcome prediction..." },
  { type: "system", text: "> scenarios: [they love it, they're confused, I fake my own disappearance]" },
  { type: "success", text: "✓ prediction: probably the first one. hopefully." },
  { type: "system", text: "> backup plan: pretend this was 'just a project'" },
  { type: "warn", text: "⚠ backup plan credibility: 3%" },
];

const typeColors = {
  system: "text-slate-500",
  error: "text-red-400",
  success: "text-emerald-400",
  warn: "text-amber-400",
};

export default function DevConsole({ onAchievement }) {
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!started) return;
    if (visibleLogs >= logs.length) return;

    const baseDelay = logs[visibleLogs]?.type === "system" ? 300 : 550;
    const randomDelay = baseDelay + Math.random() * 150;

    const timer = setTimeout(() => {
      setVisibleLogs((v) => v + 1);
      containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [started, visibleLogs]);

  const handleClick = () => {
    if (!started) {
      setStarted(true);
      setVisibleLogs(1);
      onAchievement?.("console_hacker");
    }
  };

  return (
    <section className="py-16 md:py-20 px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-lg mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gradient mb-2">
          Developer Logs 💻
        </h2>
        <p className="text-center text-white/30 text-xs mb-8">
          Behind the scenes of building this (emotionally and technically)
        </p>

        <motion.div
          whileHover={{ scale: 1.01, boxShadow: "0 0 40px rgba(0,0,0,0.4)" }}
          onClick={handleClick}
          className="bg-[#0d1117] rounded-2xl overflow-hidden shadow-2xl border border-white/5 cursor-pointer"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 text-[11px] text-white/20 font-mono">crush-website — build.log</span>
          </div>

          {/* Terminal body */}
          <div
            ref={containerRef}
            className="p-5 font-mono text-[13px] leading-relaxed space-y-1 max-h-80 overflow-y-auto scrollbar-thin"
          >
            {!started && (
              <p className="text-white/20 animate-pulse">$ click to run build...</p>
            )}
            {logs.slice(0, visibleLogs).map((log, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={typeColors[log.type]}
              >
                {log.text}
              </motion.p>
            ))}
            {started && visibleLogs < logs.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-emerald-400"
              >
                █
              </motion.span>
            )}
            {visibleLogs >= logs.length && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <p className="text-purple-400 mt-3">{">"} build complete. now we wait.</p>
                <p className="text-white/20 mt-1">{">"} if you're reading this: hi. text me back sometime 😄</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <p className="text-center text-[10px] text-white/15 mt-4">
          no actual code was harmed in the making of this website. my confidence, on the other hand...
        </p>
      </motion.div>
    </section>
  );
}
