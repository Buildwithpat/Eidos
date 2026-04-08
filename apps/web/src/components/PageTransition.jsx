"use client";

import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start invisible and slightly lower
      animate={{ opacity: 1, y: 0 }} // Fade in and move to position
      exit={{ opacity: 0, y: -20 }} // Fade out and move up when leaving
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Premium "Cubic Bezier" easing
      }}
    >
      {children}
    </motion.div>
  );
}
