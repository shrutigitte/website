import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "../utils/analytics";

const endingLines = [
  "okay… since you made it all the way here 😄",
  "you've been on my mind for longer than I'd like to admit.",
  "this whole situation is very out-of-character for me honestly.",
  "my previous strategy of pretending this wasn't happening clearly wasn't working 😄",
  "apparently my communication style is building interactive web experiences instead of texting normally.",
  "this definitely counts as effort. medically speaking.",
];

export default function HiddenEnding({ onAchievement }) {
  const [open, setOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showClose, setShowClose] = useState(false);
  const [toast, setToast] = useState(false);

  const start = () => {
    setOpen(true);
    setVisibleLines(0);
    setShowClose(false);
    document.body.style.overflow = "hidden";
    track("hidden_ending_opened");
    onAchievement?.("curiosity_won");

    endingLines.forEach((_, i) => {
      setTimeout(() => setVisibleLines(i + 1), 500 + i * 1300);
    });
    setTimeout(() => setShowClose(true), 500 + endingLines.length * 1300 + 600);
  };

  const close = () => {
    setOpen(false);
    document.body.style.overflow = "";
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  return (
    <>
      <section className="py-10 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto text-center"
        >
          <p
            onClick={start}
            className="text-white/20 text-sm cursor-pointer hover:text-white/40 hover:underline underline-offset-4 transition-all select-none"
          >
            one last thing (only if you're curious) 👀
          </p>
        </motion.div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-[200] px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card border-glow p-7 md:p-9 max-w-md w-full text-center space-y-4"
            >
              {endingLines.map((line, i) => (
                <AnimatePresence key={i}>
                  {visibleLines > i && (
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={
                        i === 1
                          ? "text-xl font-bold text-white"
                          : i === 0 || i === endingLines.length - 1
                          ? "text-white/40 text-sm italic"
                          : "text-white/60 text-sm"
                      }
                    >
                      {line}
                    </motion.p>
                  )}
                </AnimatePresence>
              ))}

              <AnimatePresence>
                {showClose && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={close}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-lg glow-pink cursor-pointer"
                  >
                    Okay that was… a lot. But in a good way? 😄
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-card px-6 py-3 z-[210] text-sm text-white/70"
          >
            You made it to the end. That means something 💫
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
