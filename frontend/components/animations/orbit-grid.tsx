"use client";

import { motion } from "framer-motion";

export function OrbitGrid() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1200 760" aria-hidden="true">
      <defs>
        <linearGradient id="erpAmber" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <motion.path
        d="M80 520 C280 300 430 660 660 380 S970 130 1140 300"
        fill="none"
        stroke="url(#erpAmber)"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />
      {[160, 360, 560, 780, 980].map((x, index) => (
        <motion.circle
          key={x}
          cx={x}
          cy={index % 2 ? 260 : 430}
          r="8"
          fill="#111"
          animate={{ y: [0, -18, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3 + index * 0.4, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

