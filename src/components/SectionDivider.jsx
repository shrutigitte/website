import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="my-12 md:my-16 flex items-center justify-center gap-3">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        className="h-[1px] w-16 bg-gradient-to-r from-transparent to-purple-500/30"
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-1.5 h-1.5 bg-purple-400/50 rounded-full"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        className="h-[1px] w-16 bg-gradient-to-l from-transparent to-pink-500/30"
      />
    </div>
  );
}
