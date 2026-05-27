import { useState, useEffect, useRef } from "react";

export default function Typewriter({ text, speed = 35, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    const id = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(id);
        onDoneRef.current?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-[2px] h-[1.1em] bg-pink-400/70 ml-0.5 animate-pulse align-middle" />
    </span>
  );
}
