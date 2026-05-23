/** Shared Framer Motion tokens — premium SaaS feel */
export const premiumEase = [0.22, 1, 0.36, 1] as const;

export const springSnappy = { type: "spring" as const, stiffness: 420, damping: 32 };
export const springSoft = { type: "spring" as const, stiffness: 280, damping: 28 };
export const springNav = { type: "spring" as const, stiffness: 380, damping: 30 };

export const duration = {
  fast: 0.22,
  base: 0.4,
  slow: 0.65,
  page: 0.38,
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: premiumEase },
  },
} as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: premiumEase } },
} as const;

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: duration.slow, ease: premiumEase },
  },
} as const;

export const pageTransition = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.page, ease: premiumEase },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(6px)",
    transition: { duration: 0.28, ease: premiumEase },
  },
} as const;

export const pageTransitionReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
} as const;

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    scale: 1.02,
    transition: springSnappy,
  },
} as const;

export const glowPulse = {
  rest: { opacity: 0.45, scale: 1 },
  hover: { opacity: 0.85, scale: 1.04, transition: { duration: 0.35 } },
} as const;

export const equationVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: premiumEase },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    filter: "blur(6px)",
    transition: { duration: 0.28, ease: premiumEase },
  },
} as const;

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
} as const;

export const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: premiumEase },
  },
} as const;

export const shake = {
  x: [0, -6, 6, -4, 4, 0],
  transition: { duration: 0.45 },
} as const;
