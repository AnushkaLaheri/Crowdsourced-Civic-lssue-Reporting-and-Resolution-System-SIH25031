"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const InteractiveCard = ({ children, className = "", hoverScale = 1.05, tapScale = 0.98 }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      whileHover={{ scale: hoverScale, rotateY: 5 }}
      whileTap={{ scale: tapScale }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        animate={{
          boxShadow: isHovered ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default InteractiveCard
