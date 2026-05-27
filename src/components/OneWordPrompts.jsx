import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "../utils/constants";
import { saveInteraction } from "../utils/analytics";

const prompts = [
  { question: "Describe me in one word 👀", placeholder: "one word...", myResponse: "whatever you said — I'm choosing to be flattered 😄" },
  { question: "Most concerning trait? 😭", placeholder: "be honest...", myResponse: "mine is disappearing into random projects instead of replying normally" },
  { question: "Current mental state? 💀", placeholder: "honestly...", myResponse: "mine: functioning (debatable) + running on chai + mentally elsewhere" },
  { question: "Current vibe check 😄", placeholder: "current vibe...", myResponse: "mine right now: nervous + hopeful + slightly caffeinated" },
];

function PromptCard({ prompt, index }) {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleSend = () => {
    if (!value.trim()) return;
    saveInteraction("one_word", value, { question: prompt.question });
    setSent(true);
    setTimeout(() => setShowResponse(true), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-5"
    >
      <p className="text-white/80 font-medium mb-3">{prompt.question}</p>

      {!sent ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={prompt.placeholder}
            maxLength={30}
            className="flex-1 px-4 py-2.5 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 placeholder:text-white/20 focus:outline-none focus:border-pink-400/40 transition-colors"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="px-4 py-2.5 rounded-full text-sm bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/20 text-pink-300 cursor-pointer hover:from-pink-500/30 hover:to-purple-500/30 transition-all"
          >
            →
          </motion.button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-white/30">you said:</span>
            <span className="px-3 py-1 rounded-full text-sm bg-pink-500/15 border border-pink-500/20 text-pink-300">{value}</span>
          </div>
          <AnimatePresence>
            {showResponse && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-white/40 italic"
              >
                {prompt.myResponse}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function OneWordPrompts() {
  return (
    <section className="py-16 md:py-20 px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-md mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gradient mb-2">
          Quick Fire Round ⚡
        </h2>
        <p className="text-center text-white/30 text-xs mb-8">
          One word (or a few). No overthinking allowed.
        </p>

        <div className="space-y-4">
          {prompts.map((p, i) => (
            <PromptCard key={i} prompt={p} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
