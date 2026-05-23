import { motion } from "framer-motion";

export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg-fine opacity-60" />
      <div className="absolute inset-x-0 top-0 h-[480px] spotlight-top" />

      <motion.div
        className="absolute -top-[30%] left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.14 285 / 0.18) 0%, transparent 65%)",
        }}
        animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[20%] -right-[15%] h-[500px] w-[500px] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.12 250 / 0.12) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[10%] -left-[10%] h-[400px] w-[400px] rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.5 0.1 210 / 0.08) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="noise absolute inset-0 opacity-80" />
    </div>
  );
}
