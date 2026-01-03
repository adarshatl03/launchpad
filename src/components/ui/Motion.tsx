"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// FadeIn animation with optional direction and distance
export interface FadeInProps extends HTMLMotionProps<"div"> {
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Direction of the entrance animation */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance to travel from the start position (pixels) */
  distance?: number;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  className,
  ...props
}: FadeInProps) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ScaleIn animation with premium easing
export interface ScaleInProps extends HTMLMotionProps<"div"> {
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Duration of the animation (seconds) */
  duration?: number;
  /** Additional class names */
  className?: string;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  className,
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.16, 1, 0.3, 1], // premium cubic‑bezier
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
