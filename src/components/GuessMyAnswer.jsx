import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, creatorName } from "../utils/constants";
import { saveInteraction } from "../utils/analytics";

const guesses = [
  {
    question: "What's my go-to comfort food? 🍕",
    options: ["Pizza", "Maggi", "Momos", "Biryani"],
    answer: "Maggi",
    revealText: "Late night Maggi hits different. Don't argue.",
    correctReaction: "okay that's actually impressive 👀",
    wrongReaction: "wow. you really don't know me yet 😔",
  },
  {
    question: "What time do I usually sleep? 🌙",
    options: ["Before midnight (mature)", "1-2 AM (reasonable)", "3 AM+ (concerning)", "Sleep is a suggestion"],
    answer: "3 AM+ (concerning)",
    revealText: "I know. I'm working on it. (I'm not working on it)",
    correctReaction: "unfortunately accurate",
    wrongReaction: "you gave me too much credit there",
  },
  {
    question: "How many times did I almost send this website before actually doing it? 👀",
    options: ["0 — sent immediately", "2-3 times", "5+ times", "Lost count"],
    answer: "5+ times",
    revealText: "Each time I added 'one more feature' as an excuse to delay 😄",
    correctReaction: "you understand my avoidance patterns. concerning.",
    wrongReaction: "it was way more than you think 😄",
  },
  {
    question: "What's my most played song genre? 🎧",
    options: ["Bollywood", "Lo-fi / chill", "Indie", "Chaotic mix of everything"],
    answer: "Chaotic mix of everything",
    revealText: "My playlist goes from Arijit to Arctic Monkeys in 3 songs. No transitions.",
    correctReaction: "you can tell? is my personality that obvious?",
    wrongReaction: "I'm not that organized musically. or in any other way.",
  },
  {
    question: "What's my most concerning habit? 🚩",
    options: ["Disappearing while coding", "Replying mentally but not actually", "Turning emotions into side projects", "Functioning on 3 hours of sleep"],
    answer: "Turning emotions into side projects",
    revealText: "unfortunately most of the above. but especially this one. the evidence is literally on your screen right now 😄",
    correctReaction: "I mean… you're looking at the proof",
    wrongReaction: "it's all slightly true but this one is the most documented 😄",
  },
];

function GuessCard({ guess, index, onCorrect, onNext }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handlePick = (opt) => {
    if (selected) return;
    setSelected(opt);
    saveInteraction("guess", opt, { question: guess.question, correct: opt === guess.answer });
    setTimeout(() => setRevealed(true), 800);
    if (opt === guess.answer) onCorrect?.();
  };

  const isCorrect = selected === guess.answer;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-card p-6 md:p-8 border-glow relative"
    >
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-[11px] text-white/30 font-bold">{index + 1}</span>
      </div>

      <p className="font-semibold text-white/90 text-lg mb-5 pr-10">{guess.question}</p>
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {guess.options.map((opt) => (
          <motion.button
            key={opt}
            onClick={() => handlePick(opt)}
            whileHover={!selected ? { y: -3, scale: 1.02 } : {}}
            whileTap={!selected ? { scale: 0.95 } : {}}
            className={`px-3 py-3.5 rounded-2xl text-sm text-left transition-all duration-300 cursor-pointer border ${
              !selected
                ? "bg-white/5 text-white/70 border-white/10 hover:bg-white/8 hover:border-white/20"
                : selected === opt && revealed
                ? isCorrect
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-red-500/10 text-red-300/80 border-red-500/30"
                : opt === guess.answer && revealed
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-white/2 text-white/20 border-white/5 scale-95"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`rounded-2xl p-4 mt-3 ${
              isCorrect
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : "bg-amber-500/10 border border-amber-500/20"
            }`}>
              <p className="text-xs font-bold mb-1.5" style={{ color: isCorrect ? "#6ee7b7" : "#fbbf24" }}>
                {isCorrect ? `🎯 ${guess.correctReaction}` : `❌ ${guess.wrongReaction}`}
              </p>
              <p className="text-sm text-white/60 italic">"{guess.revealText}"</p>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="px-5 py-2.5 rounded-full text-sm bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 cursor-pointer transition-all"
              >
                next →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GuessMyAnswer({ onAchievement }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleCorrect = () => {
    const newCount = correctCount + 1;
    setCorrectCount(newCount);
    if (newCount >= 2) onAchievement?.("guess_master");
  };

  const nextCard = () => {
    if (currentCard >= guesses.length - 1) {
      setFinished(true);
    } else {
      setCurrentCard((c) => c + 1);
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
          Guess My Answer 👀
        </h2>
        <p className="text-center text-white/30 text-xs mb-2">
          How well do you think you know me? Let's test this theory.
        </p>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
              animate={{ width: `${((currentCard + (finished ? 1 : 0)) / guesses.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-xs text-white/30">{correctCount}✓</span>
        </div>

        <AnimatePresence mode="wait">
          {!finished ? (
            <GuessCard
              key={currentCard}
              guess={guesses[currentCard]}
              index={currentCard}
              onCorrect={handleCorrect}
              onNext={nextCard}
            />
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 text-center border-glow"
            >
              <p className="text-3xl mb-3">{correctCount >= 4 ? "🎯" : correctCount >= 2 ? "👀" : "😔"}</p>
              <p className="text-lg font-bold text-white/90 mb-1">
                {correctCount >= 4 ? "okay you actually know me" : correctCount >= 2 ? "not bad. room for improvement." : "we clearly need more conversations 😄"}
              </p>
              <p className="text-sm text-white/40">{correctCount}/{guesses.length} correct</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
