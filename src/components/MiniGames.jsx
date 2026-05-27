import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "../utils/constants";
import { saveInteraction } from "../utils/analytics";

const wouldYouRather = [
  {
    a: "Always have wet socks",
    b: "Always have your phone at 2% battery",
    myPick: "a",
    myReason: "wet socks are fixable. 2% battery anxiety is permanent damage.",
  },
  {
    a: "Never be able to use emojis again",
    b: "Never make jokes at the wrong time again",
    myPick: "a",
    myReason: "badly timed jokes are my entire personality. I'd survive without emojis. barely.",
  },
  {
    a: "Have a 10-hour flight next to someone super interesting",
    b: "Have a 10-minute call that changes your life",
    myPick: "a",
    myReason: "I'll always pick more time with the right person over a shortcut.",
  },
  {
    a: "Know what everyone thinks about you",
    b: "Never know what anyone thinks about you",
    myPick: "b",
    myReason: "ignorance is underrated. knowing too much would ruin me.",
  },
  {
    a: "Accidentally send every screenshot in your gallery",
    b: "Have every typo spoken out loud",
    myPick: "b",
    myReason: "typos. the gallery would end my career.",
  },
];

const traitRatings = [
  { trait: "Attention to detail", emoji: "🧠", tooltip: "ability to create 14 scenarios from one text" },
  { trait: "Humor", emoji: "😂", tooltip: "quality of jokes (self-assessed: high)" },
  { trait: "Effort", emoji: "💪", tooltip: "see: this entire website" },
  { trait: "Side Quest Energy", emoji: "🎮", tooltip: "ability to get distracted into unnecessary but impressive things" },
  { trait: "Loyalty", emoji: "🤝", tooltip: "once I'm in, I'm annoyingly in" },
];

function WouldYouRather({ item, index, onAchievement }) {
  const [picked, setPicked] = useState(null);
  const [showMine, setShowMine] = useState(false);

  const handlePick = (choice) => {
    if (picked) return;
    setPicked(choice);
    saveInteraction("would_you_rather", choice, { index });
    setTimeout(() => setShowMine(true), 800);
    onAchievement?.("mini_game_player");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-5"
    >
      <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-3">Would you rather…</p>
      <div className="grid grid-cols-1 gap-2">
        {["a", "b"].map((key) => (
          <motion.button
            key={key}
            onClick={() => handlePick(key)}
            whileTap={{ scale: 0.97 }}
            className={`p-3.5 rounded-xl text-sm text-left transition-all duration-300 cursor-pointer border ${
              picked === key
                ? "bg-pink-500/15 border-pink-500/40 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                : picked
                ? "bg-white/2 border-white/5 text-white/30"
                : "glass-button text-white/70 hover:border-purple-400/30 hover:text-white/90"
            }`}
          >
            <span className="text-white/30 font-bold mr-2">{key.toUpperCase()}.</span>
            {item[key]}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showMine && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3"
          >
            <p className="text-xs text-purple-400 font-semibold">
              I'd pick {item.myPick.toUpperCase()} {picked === item.myPick ? "— same! 👀" : ""}
            </p>
            <p className="text-xs text-white/30 italic mt-1">"{item.myReason}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TraitRater({ onAchievement }) {
  const [ratings, setRatings] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const rate = (trait, value) => setRatings((r) => ({ ...r, [trait]: value }));

  const handleSubmit = () => {
    setSubmitted(true);
    saveInteraction("trait_ratings", ratings);
    onAchievement?.("mini_game_player");
  };

  const allRated = Object.keys(ratings).length === traitRatings.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-5 mt-5"
    >
      <p className="text-[10px] text-pink-400 font-bold uppercase tracking-widest mb-1">Rate My Traits</p>
      <p className="text-xs text-white/25 mb-5">How do you perceive these? Be honest 😄</p>

      <div className="space-y-4">
        {traitRatings.map(({ trait, emoji, tooltip }) => (
          <div key={trait} className="flex items-center gap-3 group relative">
            <span className="text-sm w-32 text-white/50 cursor-default" title={tooltip}>{emoji} {trait}</span>
            <div className="flex gap-1.5 flex-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <motion.button
                  key={v}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => rate(trait, v)}
                  className={`w-9 h-9 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    ratings[trait] === v
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg glow-pink scale-110"
                      : ratings[trait]
                      ? "bg-white/5 text-white/20"
                      : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
                  }`}
                >
                  {v}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!submitted && allRated && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="mt-5 w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-semibold cursor-pointer shadow-lg glow-pink"
        >
          Lock in ratings
        </motion.button>
      )}

      {submitted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 text-center text-sm text-white/40 italic"
        >
          Noted. These will be referenced in future arguments 😄
        </motion.p>
      )}
    </motion.div>
  );
}

export default function MiniGames({ onAchievement }) {
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
          Quick Round 🎮
        </h2>
        <p className="text-center text-white/30 text-xs mb-8">
          Mini games because apparently a quiz wasn't enough
        </p>

        <div className="space-y-4">
          {wouldYouRather.map((item, i) => (
            <WouldYouRather key={i} item={item} index={i} onAchievement={onAchievement} />
          ))}
        </div>

        <TraitRater onAchievement={onAchievement} />
      </motion.div>
    </section>
  );
}
