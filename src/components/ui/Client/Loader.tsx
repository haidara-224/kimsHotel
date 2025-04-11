
'use client'

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-40">
      <motion.div
        className="w-6 h-6 rounded-full bg-blue-500 mx-1"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
      />
      <motion.div
        className="w-6 h-6 rounded-full bg-blue-500 mx-1"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
      />
      <motion.div
        className="w-6 h-6 rounded-full bg-blue-500 mx-1"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
      />
    </div>
  );
}
