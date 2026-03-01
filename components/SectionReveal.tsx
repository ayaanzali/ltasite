"use client";

import { motion } from "framer-motion";

const defaultVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: typeof defaultVariants;
}

export function SectionReveal({
  children,
  className = "",
  delay = 0,
  variants = defaultVariants,
}: SectionRevealProps) {
  return (
    <motion.div
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
