import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "../utils/constants";
import { track } from "../utils/analytics";

const vault = [
  { type: "unsent", text: "Hey, random question — do you believe in the multiverse? Because in at least one universe I definitely sent this 😄" },
  { type: "deleted", text: "I typed 'you're cute' and deleted it 4 times before just sending a reel instead" },
  { type: "observation", text: "You have this thing where you laugh and then try to stop laughing and it's genuinely the funniest thing" },
  { type: "joke", text: "I was going to make a chemistry joke but I was afraid we'd have no reaction 💀" },
  { type: "observation", text: "You type like you're smiling sometimes and it's weirdly recognizable 😄" },
  { type: "unsent", text: "Sometimes I remember how random life is and then immediately send a meme to avoid thinking too hard." },
  { type: "observation", text: "I can tell what mood you're in based on punctuation now. that's probably concerning." },
  { type: "deleted", text: "I wrote a whole paragraph once and then replaced it with 'lol same'" },
  { type: "almost-said", text: "There were multiple moments where I almost became emotionally articulate. terrifying honestly." },
  { type: "thought", text: "you genuinely seem like a very comforting person to be around. no joke attached to this one." },
];

const typeStyles = {
  unsent: { label: "📱 Unsent text", glow: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/20" },
  deleted: { label: "🗑️ Deleted draft", glow: "from-red-500/20 to-rose-500/10", border: "border-red-500/20" },
  observation: { label: "👀 Filed observation", glow: "from-amber-500/20 to-yellow-500/10", border: "border-amber-500/20" },
  joke: { label: "😄 Unused joke", glow: "from-green-500/20 to-emerald-500/10", border: "border-green-500/20" },
  "almost-said": { label: "💭 Almost said", glow: "from-purple-500/20 to-violet-500/10", border: "border-purple-500/20" },
  thought: { label: "🧠 Random thought", glow: "from-pink-500/20 to-rose-500/10", border: "border-pink-500/20" },
};

export default function ThingsINeverSent({ onAchievement }) {
  const [revealed, setRevealed] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const unlockNext = () => {
    if (revealed >= vault.length || isUnlocking) return;
    setIsUnlocking(true);
    track("vault_unlock", { index: revealed });
    if (revealed === 0) onAchievement?.("vault_opened");

    setTimeout(() => {
      setRevealed((r) => r + 1);
      setIsUnlocking(false);
    }, 700);
  };

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
          The Vault 🔒
        </h2>
        <p className="text-center text-white/30 text-xs mb-2">
          Things I typed, thought, or almost said — but never actually sent
        </p>
        <p className="text-center text-white/15 text-[10px] mb-8">
          {revealed}/{vault.length} unlocked
        </p>

        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {vault.slice(0, revealed).map((item, i) => {
              const style = typeStyles[item.type];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className={`relative glass-card p-4 border ${style.border} overflow-hidden`}
                >
                  {/* Subtle glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.glow} opacity-30`} />
                  <div className="relative">
                    <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1.5">
                      {style.label}
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {revealed < vault.length ? (
          <motion.button
            whileHover={{ scale: 1.02, borderColor: "rgba(168, 85, 247, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={unlockNext}
            disabled={isUnlocking}
            className="w-full py-3.5 glass-button rounded-full text-sm font-medium text-white/50 hover:text-white/80 transition-all cursor-pointer disabled:opacity-50 border border-white/10"
          >
            {isUnlocking ? (
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>
                decrypting…
              </motion.span>
            ) : (
              `🔓 Unlock next (${vault.length - revealed} remaining)`
            )}
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className="text-white/40 text-sm italic">That's the whole vault. Now you know way too much 😄</p>
            <p className="text-white/15 text-[10px] mt-2">(the fact that you unlocked all of these says something about you)</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
