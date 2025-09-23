"use client"

import { motion } from "framer-motion"
import { MapPinIcon, CheckCircleIcon, ExclamationTriangleIcon, UserGroupIcon } from "@heroicons/react/24/outline"

const FloatingElements = () => {
  const elements = [
    {
      icon: MapPinIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      delay: 0,
      x: "10%",
      y: "20%",
    },
    {
      icon: CheckCircleIcon,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      delay: 0.5,
      x: "80%",
      y: "15%",
    },
    {
      icon: ExclamationTriangleIcon,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      delay: 1,
      x: "15%",
      y: "70%",
    },
    {
      icon: UserGroupIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      delay: 1.5,
      x: "75%",
      y: "75%",
    },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 360],
            y: [-20, 20, -20],
          }}
          transition={{
            duration: 8,
            delay: element.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute"
          style={{ left: element.x, top: element.y }}
        >
          <div className={`p-4 rounded-2xl ${element.bgColor} backdrop-blur-sm`}>
            <element.icon className={`w-8 h-8 ${element.color}`} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingElements
