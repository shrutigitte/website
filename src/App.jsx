import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import FloatingBackground from "./components/FloatingBackground";
import AchievementPopup from "./components/AchievementPopup";
import EasterEggs from "./components/EasterEggs";
import Mascot from "./components/Mascot";
import Landing from "./components/Landing";
import CompatibilityScanner from "./components/CompatibilityScanner";
import PreferenceQuestions from "./components/PreferenceQuestions";
import GuessMyAnswer from "./components/GuessMyAnswer";
import OneWordPrompts from "./components/OneWordPrompts";
import MiniGames from "./components/MiniGames";
import Scrapbook from "./components/Scrapbook";
import ThingsINeverSent from "./components/ThingsINeverSent";
import VibeCheck from "./components/VibeCheck";
import DevConsole from "./components/DevConsole";
import CTA from "./components/CTA";
import SpotifyWrapped from "./components/SpotifyWrapped";
import HiddenEnding from "./components/HiddenEnding";
import Footer from "./components/Footer";
import SectionDivider from "./components/SectionDivider";

import { useAchievements } from "./hooks/useAchievements";
import { useVisitAwareness } from "./hooks/useVisitAwareness";
import { track } from "./utils/analytics";

export default function App() {
  const [started, setStarted] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const { queue, unlock, dismiss } = useAchievements();
  const visitData = useVisitAwareness();

  const handleUnlock = (id) => {
    unlock(id);
    setInteractionCount((c) => c + 1);
  };

  useEffect(() => {
    if (visitData.isReturning) unlock("return_visitor");
  }, [visitData.isReturning, unlock]);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => unlock("stayed_long"), 60000);
    return () => clearTimeout(timer);
  }, [started, unlock]);

  useEffect(() => {
    if (!started) return;
    const handleScroll = () => {
      const pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (pct > 0.85) {
        unlock("full_scroll");
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [started, unlock]);

  const handleStart = () => {
    setStarted(true);
    track("journey_started");
  };

  return (
    <div className="min-h-screen text-white font-sans antialiased relative">
      <FloatingBackground />
      <AchievementPopup queue={queue} dismiss={dismiss} />
      {started && <EasterEggs onAchievement={handleUnlock} />}
      {started && <Mascot triggerCount={interactionCount} />}

      {!started ? (
        <Landing onContinue={handleStart} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <CompatibilityScanner onAchievement={handleUnlock} />
          <SectionDivider />
          <PreferenceQuestions onAchievement={handleUnlock} />
          <SectionDivider />
          <GuessMyAnswer onAchievement={handleUnlock} />
          <SectionDivider />
          <OneWordPrompts />
          <SectionDivider />
          <MiniGames onAchievement={handleUnlock} />
          <SectionDivider />
          <Scrapbook onAchievement={handleUnlock} />
          <SectionDivider />
          <ThingsINeverSent onAchievement={handleUnlock} />
          <SectionDivider />
          <VibeCheck />
          <SectionDivider />
          <DevConsole onAchievement={handleUnlock} />
          <SectionDivider />
          <CTA />
          <SectionDivider />
          <SpotifyWrapped />
          <SectionDivider />
          <HiddenEnding onAchievement={handleUnlock} />
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
