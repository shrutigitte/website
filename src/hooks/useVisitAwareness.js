import { useState, useEffect } from "react";
import { incrementVisit, getVisitCount, getLastVisit } from "../utils/analytics";

const greetings = {
  first: [
    "Welcome. This is either going to be cute or chaotic. No in-between.",
  ],
  returning: [
    "Back again? 👀",
    "Statistically speaking, curiosity won 😄",
    "Oh you returned. Interesting data point.",
    "The algorithm predicted this. Just saying.",
    "You're either invested or very bored 😄",
  ],
  frequent: [
    "At this point you should just text me 😄",
    "Third time's a pattern, not a coincidence 👀",
    "Okay this is becoming a habit. I approve.",
    "You've officially visited more than my portfolio site 😄",
  ],
};

export function useVisitAwareness() {
  const [visitData, setVisitData] = useState({ count: 0, greeting: "", isReturning: false, lastVisit: null });

  useEffect(() => {
    const count = incrementVisit();
    const lastVisit = getLastVisit();
    let greeting;

    if (count === 1) {
      greeting = greetings.first[0];
    } else if (count >= 4) {
      greeting = greetings.frequent[Math.floor(Math.random() * greetings.frequent.length)];
    } else {
      greeting = greetings.returning[Math.floor(Math.random() * greetings.returning.length)];
    }

    setVisitData({ count, greeting, isReturning: count > 1, lastVisit });
  }, []);

  return visitData;
}
