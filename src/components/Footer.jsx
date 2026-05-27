import { creatorName } from "../utils/constants";

export default function Footer() {
  return (
    <footer className="py-12 text-center">
      <p className="text-white/20 text-sm">— made by {creatorName}</p>
      <p className="text-white/10 text-xs mt-1">powered by courage, caffeine, and questionable decision-making</p>
      <p className="text-white/5 text-[10px] mt-3">v2.0 — now with 300% more unnecessary features</p>
    </footer>
  );
}
