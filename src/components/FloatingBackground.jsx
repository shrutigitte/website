import { motion } from "framer-motion";

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Main aurora gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a0a2e_0%,_#0f0a1a_50%,_#0a0612_100%)]" />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 20, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, 25, -15, 0], y: [0, -25, 35, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -20, 40, 0], y: [0, 40, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[80px]"
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30 - Math.random() * 20, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
          className="absolute w-[2px] h-[2px] bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
