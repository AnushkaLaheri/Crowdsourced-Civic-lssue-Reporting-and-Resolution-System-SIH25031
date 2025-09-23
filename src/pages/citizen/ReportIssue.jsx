"use client"

import { useState, useEffect, useRef} from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import {
  PhotoIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
  MapPinIcon,
  PencilSquareIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline"
import Navbar from "../../components/Navbar"
import { useAuth } from "../../contexts/AuthContext"
import "leaflet/dist/leaflet.css"

const ReportIssue = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [listening, setListening] = useState(false)
const [voiceError, setVoiceError] = useState("")
const recognitionRef = useRef(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    location: { lat: 23.3441, lng: 85.3096 },
    address: "",
    images: [],
    token: "",
  })
  const [loading, setLoading] = useState(false)

  const categories = [
    "Infrastructure",
    "Roads",
    "Water Supply",
    "Waste Management",
    "Street Lighting",
    "Public Transport",
    "Parks & Recreation",
    "Others",
  ]
  const priorities = ["Low", "Medium", "High", "Critical"]

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData({
      ...formData,
      images: [...formData.images, ...files.map((file) => URL.createObjectURL(file))],
    })
  }

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  // Voice-to-Text Handler with animated mic feedback
  const handleVoiceToText = () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice recognition not supported in this browser")
    return
  }

  const recognition = new window.webkitSpeechRecognition()
  recognitionRef.current = recognition
  recognition.lang = "en-IN"
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => {
    setListening(true)
    setVoiceError("")
  }

  recognition.onend = () => {
    setListening(false)
  }

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript
    setFormData((prev) => ({
      ...prev,
      description: prev.description ? prev.description + " " + text : text,
    }))
  }

 recognition.onerror = (event) => {
  setListening(false)
  if (event.error === "no-speech") {
    setVoiceError("No voice detected. Please speak clearly after clicking.")
  } else if (event.error === "not-allowed") {
    setVoiceError("Microphone access denied. Please allow it in browser settings.")
  } else {
    setVoiceError("Voice input failed: " + event.error)
  }
}


  try {
    recognition.start()
  } catch (err) {
    console.error("Voice recognition start failed", err)
    setVoiceError("Could not start voice recognition.")
  }
}

// Optional: stop manually
const stopVoiceRecognition = () => {
  if (recognitionRef.current) {
    recognitionRef.current.stop()
    setListening(false)
  }
}


  const generateToken = () => "TOK" + Math.random().toString(36).substr(2, 6).toUpperCase()

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setFormData({ ...formData, location: { lat: e.latlng.lat, lng: e.latlng.lng } })
      },
    })
    return null
  }

  const handleSubmit = async () => {
    setLoading(true)
    const token = generateToken()
    setFormData({ ...formData, token })
    setTimeout(() => {
      setStep(6)
      setLoading(false)
    }, 1500)
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        {step <= 4 && (
          <div className="mb-8">
            <div className="flex justify-between items-center text-sm text-neutral-600 dark:text-neutral-400">
              <span>Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-2 bg-blue-600 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-2xl shadow-lg"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Issue Reported!</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Token: <strong>{formData.token}</strong>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/citizen/track")}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all"
              >
                Track Your Issues
              </button>
              <button
                onClick={() => {
                  setStep(1)
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    priority: "Medium",
                    location: { lat: 23.3441, lng: 85.3096 },
                    address: "",
                    images: [],
                    token: "",
                  })
                }}
                className="w-full py-3 px-4 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
              >
                Report Another Issue
              </button>
            </div>
          </motion.div>
        )}

        {step !== 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
          >
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Basic Information</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Issue Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border rounded-xl bg-white dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border rounded-xl bg-white dark:bg-neutral-800"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border rounded-xl bg-white dark:bg-neutral-800"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
  <label className="block text-gray-700 font-medium mb-2">
    Issue Description <span className="text-red-500">*</span>
  </label>
  <textarea
    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
    rows="4"
    placeholder="Describe the issue..."
    value={formData.description}
    onChange={(e) =>
      setFormData({ ...formData, description: e.target.value })
    }
  />

  {/* Voice input button */}
  <div className="mt-2 flex items-center gap-3">
    <button
      onClick={listening ? stopVoiceRecognition : handleVoiceToText}
      className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
        listening ? "bg-red-600 text-white animate-pulse" : "bg-blue-600 text-white"
      }`}
    >
      {listening ? "Listening..." : "Click to Speak"}
      <MicrophoneIcon className="w-5 h-5" />
    </button>
    {voiceError && <p className="text-sm text-red-500">{voiceError}</p>}
  </div>
</div>

              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPinIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Select Location</h2>
                </div>
                <div className="h-96 rounded-xl overflow-hidden border shadow">
                  <MapContainer center={[formData.location.lat, formData.location.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker />
                    <Marker position={[formData.location.lat, formData.location.lng]} />
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <PhotoIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Upload Photos</h2>
                </div>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center border-2 border-dashed rounded-xl p-6 text-center hover:border-blue-500 transition-all">
                  <PhotoIcon className="w-12 h-12 text-neutral-400 mb-2" />
                  <span>Click or drag files to upload</span>
                </label>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} className="w-full h-28 object-cover rounded-lg shadow" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Review Your Report</h2>
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="p-4 rounded-xl border bg-white dark:bg-neutral-800 shadow-sm relative">
                    <button className="absolute top-3 right-3 text-blue-600" onClick={() => setStep(1)}>
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <h3 className="font-semibold mb-2">Basic Info</h3>
                    <p><strong>Title:</strong> {formData.title}</p>
                    <p><strong>Category:</strong> {formData.category}</p>
                    <p><strong>Priority:</strong> {formData.priority}</p>
                  </div>

                  {/* Description */}
                  <div className="p-4 rounded-xl border bg-white dark:bg-neutral-800 shadow-sm relative">
                    <button className="absolute top-3 right-3 text-blue-600" onClick={() => setStep(1)}>
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p>{formData.description || "No description provided"}</p>
                  </div>

                  {/* Location */}
                  <div className="p-4 rounded-xl border bg-white dark:bg-neutral-800 shadow-sm relative">
                    <button className="absolute top-3 right-3 text-blue-600" onClick={() => setStep(2)}>
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p>Lat {formData.location.lat.toFixed(6)}, Lng {formData.location.lng.toFixed(6)}</p>
                  </div>

                  {/* Photos */}
                  <div className="p-4 rounded-xl border bg-white dark:bg-neutral-800 shadow-sm relative">
                    <button className="absolute top-3 right-3 text-blue-600" onClick={() => setStep(3)}>
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <h3 className="font-semibold mb-2">Photos</h3>
                    {formData.images.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((img, idx) => (
                          <img key={idx} src={img} className="w-full h-20 object-cover rounded-lg" />
                        ))}
                      </div>
                    ) : (
                      <p>No photos uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button type="button" onClick={prevStep} disabled={step === 1} className="px-6 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back
              </button>
              {step < 4 ? (
                <button type="button" onClick={nextStep} className="px-6 py-3 rounded-xl bg-blue-600 text-white">
                  Next <ArrowRightIcon className="w-5 h-5 inline" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={loading} className="px-6 py-3 rounded-xl bg-green-600 text-white">
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ReportIssue
