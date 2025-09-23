"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeftIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline"

const OTPVerification = ({ phoneNumber, onVerify, onBack, loading }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      onVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = () => {
    setTimeLeft(60)
    setCanResend(false)
    setOtp(["", "", "", "", "", ""])
    // In a real app, trigger resend OTP API call here
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 grid-pattern">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Sign Up
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8 shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <DevicePhoneMobileIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Verify Your Phone</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              We've sent a 6-digit code to{" "}
              <span className="font-semibold text-neutral-900 dark:text-white">{phoneNumber}</span>
            </p>

            <div className="flex justify-center space-x-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={loading}
                />
              ))}
            </div>

            {loading && (
              <div className="mb-6">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Verifying...</p>
              </div>
            )}

            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-neutral-600 dark:text-neutral-400">
                  Resend code in <span className="font-semibold">{timeLeft}s</span>
                </p>
              )}
            </div>

            <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Demo OTP:</p>
              <p className="text-sm font-mono text-neutral-900 dark:text-white">123456</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
