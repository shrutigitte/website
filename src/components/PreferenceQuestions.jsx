import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, creatorName } from "../utils/constants";
import { saveInteraction } from "../utils/analytics";

const preferences = [
  {
    question: "Coffee or Tea? ☕",
    options: ["Coffee ☕", "Tea 🍵", "Both (unserious) 😄"],
    myAnswer: "Tea 🍵",
    matchReaction: "okay good. i was prepared to start an unnecessary debate otherwise 😄",
    mismatchReaction: "we'll figure this out. relationships have survived worse disagreements.",
    myNote: "specifically masala chai. non-negotiable.",
  },
  {
    question: "Calls or Texts? 📞",
    options: ["Calls 📞", "Texts 💬", "Depends on the person 👀"],
    myAnswer: "Depends on the person 👀",
    matchReaction: "exactly. not everyone earns the voice note privilege.",
    mismatchReaction: "noted. I'll adjust my communication protocol accordingly 😄",
    myNote: "but if it's someone I like? calls hit different.",
  },
  {
    question: "Mountains or Beaches? ⛰️",
    options: ["Mountains ⛰️", "Beaches 🏖️", "Depends who I'm with 😄"],
    myAnswer: "Mountains ⛰️",
    matchReaction: "mountains just feel quieter mentally somehow.",
    mismatchReaction: "valid. but imagine: mountain road, no signal, good music. just existing.",
    myNote: "cold air + silence + views. that's the whole pitch.",
  },
  {
    question: "Most dangerous thing to send at 2 AM? 😄",
    options: ["\"you up?\" 💀", "Voice note 🎤", "Paragraph 📝", "Suspiciously specific reel 😂"],
    myAnswer: "Suspiciously specific reel 😂",
    matchReaction: "the classic emotional avoidance strategy. we're the same 😄",
    mismatchReaction: "interesting. mine is the reel route. plausible deniability is key.",
    myNote: "if I send you a reel at 2 AM it means more than a paragraph honestly.",
  },
  {
    question: "Night owl or Early bird? 🌙",
    options: ["Night owl 🦉", "Early bird 🌅", "Depends on mood 😄"],
    myAnswer: "Night owl 🦉",
    matchReaction: "the good conversations always happen when they shouldn't.",
    mismatchReaction: "I'll try to be a functional human before noon. no guarantees.",
    myNote: "my best ideas show up after midnight. annoying but true.",
  },
  {
    question: "What instantly improves your mood? 😄",
    options: ["Music 🎧", "Good food 🍕", "Someone funny texting you 💬", "Rain 🌧️", "Unexpectedly good weather 🌤️"],
    myAnswer: "Rain 🌧️",
    matchReaction: "rain + window + oddly specific playlist = instant calm.",
    mismatchReaction: "valid pick. mine's rain though. something cinematic about it.",
    myNote: "also oddly specific playlists with exactly 11 likes 😄",
    hasFollowUp: true,
    followUpPrompt: "okay now elaborate slightly 😄",
    followUpPlaceholder: "what specifically about it...",
  },
  {
    question: "What's your toxic productivity habit? 💻",
    options: ["Overplanning 📋", "Last-minute panic 🔥", "Acting productive while reorganizing everything 😭", "Opening YouTube accidentally 📺"],
    myAnswer: "Acting productive while reorganizing everything 😭",
    matchReaction: "ah. fellow fake productivity enjoyer.",
    mismatchReaction: "mine is spending 4 hours perfecting something nobody asked for. for example: this website 😄",
    myNote: "I once spent 6 hours on a font choice. I'm not okay.",
  },
  {
    question: "Favorite type of humor? 😂",
    options: ["Sarcasm 🙄", "Self-deprecating 💀", "Deeply stupid humor 😭", "Dark humor 😈"],
    myAnswer: "Self-deprecating 💀",
    matchReaction: "we'd either be extremely funny together or in therapy. possibly both.",
    mismatchReaction: "I'll calibrate. my default is laughing at my own problems.",
    myNote: "it's a coping mechanism but also genuinely funny so win-win.",
  },
  {
    question: "Dream type of day? 🌇",
    options: ["Exploring a new city 🗺️", "Cozy day at home 🛋️", "Long drive with good music 🎶", "Unplanned adventures 🚗"],
    myAnswer: "Long drive with good music 🎶",
    matchReaction: "okay this needs to happen. playlist ready, route irrelevant.",
    mismatchReaction: "understandable. but picture this: no destination, good playlist, sundown.",
    myNote: "good playlist > destination honestly.",
  },
  {
    question: "What kind of reels make you instantly send them? 😂",
    options: ["Relatable 💀", "Absurdly niche 🤌", "Cute animals 🐶", "Edits that feel illegally relatable 🎬"],
    myAnswer: "Absurdly niche 🤌",
    matchReaction: "the ones with 200 views that somehow describe your exact situation.",
    mismatchReaction: "mine are the absurdly niche ones. if you get it, you get it.",
    myNote: "if a reel has under 500 likes and I still relate, it's getting forwarded.",
  },
  {
    question: "What's the most emotionally damaging minor situation? 😭",
    options: ["Accidentally sending the screenshot 💀", "Waving back at someone who wasn't waving at you 😭", "Voice crack during a serious moment 🎤", "Typing \"you too\" when it makes zero sense 😄"],
    myAnswer: "Accidentally sending the screenshot 💀",
    matchReaction: "the paranoia is REAL.",
    mismatchReaction: "mine is the screenshot one. that fear has shortened my lifespan.",
    myNote: "I check my screen share button 4 times before sending anything.",
  },
  {
    question: "Which minor inconvenience ruins your whole mood? 😄",
    options: ["Slow WiFi 📶", "Stepping in water with socks 🧦", "Losing one earbud 🎧", "Typing a long message and it disappears 💀"],
    myAnswer: "Typing a long message and it disappears 💀",
    matchReaction: "the emotional devastation is unmatched.",
    mismatchReaction: "mine is the disappearing message. nothing survives emotionally after that.",
    myNote: "I've gone completely silent after losing a paragraph. just given up.",
  },
  {
    question: "What's your comfort YouTube rabbit hole? 📺",
    options: ["Cooking videos 🍳", "Travel videos ✈️", "Random interviews 🎙️", "Video essays at 2 AM 🌙"],
    myAnswer: "Video essays at 2 AM 🌙",
    matchReaction: "one video becomes 14 somehow. time stops existing.",
    mismatchReaction: "mine is video essays at 2 AM. one video becomes 14 somehow.",
    myNote: "I now know way too much about topics that will never be useful.",
  },
  {
    question: "Ideal vibe? ✨",
    options: ["Peaceful 🌙", "Slightly unhinged 😭", "Deep talks 🎧", "Other 😄"],
    myAnswer: "Deep talks 🎧",
    matchReaction: "surface level is boring. I want the weird tangents.",
    mismatchReaction: "respectable. I'll match your energy 😄",
    myNote: "give me someone who can jump from serious life discussions to the dumbest topic imaginable.",
    hasOtherInput: true,
    otherPlaceholder: "your vibe in a few words...",
  },
];

function CardQuestion({ pref, index, onAnswer, onNext, isActive }) {
  const [selected, setSelected] = useState(null);
  const [showMine, setShowMine] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [followUpText, setFollowUpText] = useState("");
  const [followUpSent, setFollowUpSent] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [otherSent, setOtherSent] = useState(false);

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);
    saveInteraction("preference", option, { question: pref.question, index });
    setTimeout(() => setShowMine(true), 600);
    setTimeout(() => setShowReaction(true), 1400);
    onAnswer?.(option, pref.myAnswer);
  };

  const sendFollowUp = () => {
    if (!followUpText.trim()) return;
    saveInteraction("preference_followup", followUpText, { question: pref.question });
    setFollowUpSent(true);
  };

  const sendOther = () => {
    if (!otherText.trim()) return;
    saveInteraction("preference_other", otherText, { question: pref.question });
    setOtherSent(true);
  };

  const isMatch = selected === pref.myAnswer;
  const isOtherSelected = pref.hasOtherInput && selected?.startsWith("Other");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
      style={{ perspective: "1000px" }}
    >
      {/* Card */}
      <div className="glass-card p-6 md:p-8 border-glow relative overflow-hidden">
        {/* Card number badge */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-[11px] text-white/30 font-bold">{index + 1}</span>
        </div>

        {/* Question */}
        <p className="font-semibold text-white/90 text-xl mb-5 pr-10">{pref.question}</p>

        {/* Options as playable cards */}
        <div className="flex flex-wrap gap-2.5 mb-4">
          {pref.options.map((opt, oi) => (
            <motion.button
              key={oi}
              onClick={() => handleSelect(opt)}
              whileHover={!selected ? { y: -4, scale: 1.03 } : {}}
              whileTap={!selected ? { scale: 0.95, y: 0 } : {}}
              className={`px-4 py-3 rounded-2xl text-sm transition-all duration-300 cursor-pointer border relative ${
                selected === opt
                  ? "bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white border-transparent shadow-[0_4px_20px_rgba(236,72,153,0.3)] scale-105"
                  : selected
                  ? "bg-white/2 text-white/25 border-white/5 scale-95"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/8 hover:border-white/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
              }`}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        {/* "Other" text input */}
        <AnimatePresence>
          {isOtherSelected && !otherSent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3">
              <div className="flex gap-2">
                <input type="text" value={otherText} onChange={(e) => setOtherText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendOther()} placeholder={pref.otherPlaceholder}
                  className="flex-1 px-4 py-2.5 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-400/40 transition-colors" />
                <motion.button whileTap={{ scale: 0.9 }} onClick={sendOther} className="px-4 py-2.5 rounded-full text-sm bg-purple-500/20 border border-purple-500/30 text-purple-300 cursor-pointer hover:bg-purple-500/30 transition-colors">→</motion.button>
              </div>
            </motion.div>
          )}
          {isOtherSelected && otherSent && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs text-purple-400">noted 📝</motion.p>
          )}
        </AnimatePresence>

        {/* My answer reveal — flips in */}
        <AnimatePresence>
          {showMine && (
            <motion.div
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4"
            >
              <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-widest mb-1.5">{creatorName}'s answer:</p>
              <p className="text-white/90 font-medium text-base">
                {pref.myAnswer} {isMatch && <span className="text-pink-400 ml-1">✨</span>}
              </p>
              {isMatch && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xs text-pink-400 font-medium mt-1">match 👀</motion.p>}
              <p className="text-xs text-white/25 italic mt-2">"{pref.myNote}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reaction */}
        <AnimatePresence>
          {showReaction && (
            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-white/35 italic">
              {isMatch ? pref.matchReaction : pref.mismatchReaction}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Optional follow-up */}
        <AnimatePresence>
          {pref.hasFollowUp && showReaction && !isOtherSelected && !followUpSent && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4">
              <p className="text-xs text-white/20 mb-2">{pref.followUpPrompt}</p>
              <div className="flex gap-2">
                <input type="text" value={followUpText} onChange={(e) => setFollowUpText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendFollowUp()} placeholder={pref.followUpPlaceholder}
                  className="flex-1 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/8 text-white/70 placeholder:text-white/15 focus:outline-none focus:border-pink-400/30 transition-colors" />
                <motion.button whileTap={{ scale: 0.9 }} onClick={sendFollowUp} className="px-3 py-2 rounded-full text-xs bg-pink-500/15 border border-pink-500/20 text-pink-300 cursor-pointer hover:bg-pink-500/25 transition-colors">send</motion.button>
              </div>
              <p className="text-[10px] text-white/15 mt-1.5 ml-1">optional — skip if you want</p>
            </motion.div>
          )}
          {pref.hasFollowUp && followUpSent && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs text-pink-400/60 italic">saved. will overanalyze later 😄</motion.p>
          )}
        </AnimatePresence>

        {/* Next card button */}
        {showReaction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-5 py-2.5 rounded-full text-sm bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 cursor-pointer transition-all"
            >
              next card →
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function PreferenceQuestions({ onAchievement }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (selected, myAnswer) => {
    setAnsweredCount((c) => c + 1);
    if (selected === myAnswer) setMatchCount((m) => m + 1);
  };

  const nextCard = () => {
    if (currentCard >= preferences.length - 1) {
      setFinished(true);
      onAchievement?.("emotional_investor");
    } else {
      setCurrentCard((c) => c + 1);
    }
  };

  return (
    <section className="py-16 md:py-20 px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-lg mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gradient mb-2">Let's Compare Notes 📝</h2>
        <p className="text-center text-white/30 text-xs mb-2">Pick yours. I'll show you mine.</p>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-1.5 w-40 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
              animate={{ width: `${((currentCard + (finished ? 1 : 0)) / preferences.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-xs text-white/30">{currentCard + (finished ? 1 : 0)}/{preferences.length}</span>
        </div>

        {/* Deck indicator */}
        {!finished && (
          <div className="relative flex justify-center mb-6">
            {/* Stacked cards behind */}
            {[...Array(Math.min(3, preferences.length - currentCard - 1))].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/[0.02] border border-white/[0.04] rounded-2xl"
                style={{
                  width: `${100 - (i + 1) * 4}%`,
                  height: "40px",
                  top: `${-(i + 1) * 6}px`,
                  zIndex: -i - 1,
                  opacity: 1 - (i + 1) * 0.3,
                }}
              />
            ))}
          </div>
        )}

        {/* Active card */}
        <AnimatePresence mode="wait">
          {!finished ? (
            <CardQuestion
              key={currentCard}
              pref={preferences[currentCard]}
              index={currentCard}
              isActive={true}
              onAnswer={handleAnswer}
              onNext={nextCard}
            />
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 text-center border-glow"
            >
              <p className="text-3xl mb-3">🃏</p>
              <p className="text-lg font-bold text-white/90 mb-2">
                {matchCount >= 9 ? "okay this is suspicious 👀" : matchCount >= 5 ? "compatible enough to not annoy each other. probably." : "opposites attract… right? 😄"}
              </p>
              <p className="text-sm text-white/40">{matchCount}/{preferences.length} matches</p>
              <div className="mt-4 flex justify-center gap-1">
                {preferences.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < matchCount ? "bg-pink-500" : "bg-white/10"}`} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
