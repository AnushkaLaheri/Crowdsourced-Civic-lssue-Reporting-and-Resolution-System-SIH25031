"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
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
  DocumentTextIcon,
  EyeIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline"
import Navbar from "../../components/Navbar"
import { useAuth } from "../../contexts/AuthContext"
import "leaflet/dist/leaflet.css"
import axios from "axios"
import { getAuth } from "firebase/auth"

const ReportIssue = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState("")
  const recognitionRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    location: { lat: 23.3441, lng: 85.3096 },
    city: "Deoghar",
    address: "",
    images: [],
    token: "",
  })

  // 🏙 Ward mapping
  const wardMapping = {
    "Deoghar": {
      "1": { name: "Ward 1", members: ["Jay Prakash", "Asha Kumari"] },
      "2": { name: "Ward 2", members: ["Kaushal Rai", "Abhinash Kumar"] },
      "3": { name: "Ward 3", members: ["Naresh Prasad", "Vandana Sharma"] }
    },
    "Katras": {
      "1": { name: "Ward 1", members: ["Mohd. Keshar", "Afroj"] },
      "2": { name: "Ward 2", members: ["Member Y", "Member Z"] }
    }
  };

  // 🎲 Random ward picker
  function pickRandomWard(city) {
    const wards = wardMapping[city] || { "0": { name: "Default Ward", members: ["Default Member"] } };
    const wardNos = Object.keys(wards);
    const randomWardNo = wardNos[Math.floor(Math.random() * wardNos.length)];
    return { wardNo: randomWardNo, wardInfo: wards[randomWardNo] };
  }

  // 💡 Random tips
  function generateRandomTips() {
    const tipsArray = [
      "Take photos before submitting report",
      "Ensure the location is correct",
      "Provide as much detail as possible",
      "Follow up in 48 hours",
      "Share with local ward members"
    ];
    return tipsArray[Math.floor(Math.random() * tipsArray.length)];
  }

  const categories = [
    "Potholes / Broken Roads",
    "Broken Footpaths",
    "Traffic Signal Not Working",
    "Streetlight Not Working",
    "Overflowing Garbage Bins",
    "Dirty / Non-functional Public Toilets",
    "Blocked Drainage / Sewer Overflow",
    "Water Leakage / Irregular Supply",
    "Waterlogging on Roads",
    "Air / Noise Pollution Hotspot",
    "Poor Lighting in Public Area",
    "Unsafe Pedestrian Crossing",
    "Vandalism / Damage to Public Property",
    "Park / Playground Not Maintained",
    "Illegal Construction / Encroachment",
    "Others",
  ]

  const priorities = [
    { value: "Low", color: "text-green-600 bg-green-100" },
    { value: "Medium", color: "text-yellow-600 bg-yellow-100" },
    { value: "High", color: "text-orange-600 bg-orange-100" },
    { value: "Critical", color: "text-red-600 bg-red-100" }
  ]

  const steps = [
    { number: 1, title: "Basic Info", icon: DocumentTextIcon },
    { number: 2, title: "Location", icon: MapPinIcon },
    { number: 3, title: "Media", icon: PhotoIcon },
    { number: 4, title: "Review", icon: EyeIcon }
  ]

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData({ ...formData, images: [...formData.images, ...files] })
  }

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  // Voice-to-text
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
        setVoiceError("No voice detected. Please speak clearly.")
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

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    setListening(false)
  }

  // Map picker
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setFormData({ ...formData, location: { lat: e.latlng.lat, lng: e.latlng.lng } })
      },
    })
    return null
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setLoading(true)
    try {
      const auth = getAuth()
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error("User not logged in")
      const token = await currentUser.getIdToken()

      const form = new FormData()
      form.append("category", formData.category)
      form.append("description", formData.description)
      form.append("address", formData.address || "Unknown Address")
      form.append("lat", formData.location.lat)
      form.append("lon", formData.location.lng)
      form.append("city", formData.city)
      formData.images.forEach((file) => form.append("media", file))

      const res = await axios.post(`${BACKEND_URL}/report-issue`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      const { wardNo, wardInfo } = pickRandomWard(formData.city)

      const newIssue = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        city: formData.city,
        address: formData.address,
        location: formData.location,
        images: formData.images.map((f) => f.name),
        token: res.data.token || "N/A",
        department: res.data.department || "Public Works",
        wardNo,
        members: wardInfo.members,
        tips: generateRandomTips(),
        status: "Pending",
        createdAt: new Date().toISOString(),
      }

      const stored = JSON.parse(localStorage.getItem("issues")) || []
      stored.push(newIssue)
      localStorage.setItem("issues", JSON.stringify(stored))

      setFormData((prev) => ({
        ...prev,
        token: newIssue.token,
        wardNo: newIssue.wardNo,
        members: newIssue.members,
        department: newIssue.department,
        tips: newIssue.tips,
      }))

      setStep(5)
    } catch (err) {
      console.error("Issue submission failed:", err.response?.data || err)
      alert(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
            Report an Issue
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Help us make your city better by reporting civic issues
          </p>
        </motion.div>

        {/* Progress Steps */}
        {step <= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                {steps.map((stepItem, index) => (
                  <div key={stepItem.number} className="flex items-center">
                    <div className={`flex flex-col items-center ${step >= stepItem.number ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        step > stepItem.number ? 'bg-green-500 border-green-500 text-white' :
                        step === stepItem.number ? 'bg-blue-600 border-blue-600 text-white' :
                        'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                      }`}>
                        {step > stepItem.number ? (
                          <CheckCircleIcon className="w-6 h-6" />
                        ) : (
                          <stepItem.icon className="w-6 h-6" />
                        )}
                      </div>
                      <span className="text-sm mt-2 font-medium">{stepItem.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step > stepItem.number ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Screen */}
        {step === 5 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-green-200 dark:border-green-800">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Issue Reported Successfully!
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6 text-left">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Token Number:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">#{formData.token}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Ward Number:</span>
                    <span className="font-semibold">Ward {formData.wardNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Department:</span>
                    <span className="font-semibold">{formData.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Assigned Members:</span>
                    <p className="font-semibold text-sm mt-1">{formData.members?.join(", ")}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Tips:</span>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-1">{formData.tips}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => navigate("/citizen/track")}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
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
                      city: "Deoghar",
                      address: "",
                      images: [],
                      token: "",
                    })
                  }}
                  className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Steps */}
        {step <= 4 && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Issue Details</h2>
                    <p className="text-gray-600 dark:text-gray-300">Tell us about the problem you've encountered</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Issue Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g., Broken streetlight near main road"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a category</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {priorities.map(p => <option key={p.value} value={p.value}>{p.value}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description *
                      </label>
                      <button
                        type="button"
                        onClick={listening ? stopVoiceRecognition : handleVoiceToText}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                          listening 
                            ? "bg-red-100 text-red-700 animate-pulse" 
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        } transition-colors duration-200`}
                      >
                        <MicrophoneIcon className="w-4 h-4" />
                        {listening ? "Listening..." : "Voice Input"}
                      </button>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the issue in detail... What exactly is the problem? When did you notice it? How is it affecting the community?"
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    {voiceError && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        {voiceError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <MapPinIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pin the Location</h2>
                    <p className="text-gray-600 dark:text-gray-300">Click on the map to mark the exact location</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="h-96 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                    <MapContainer 
                      center={[formData.location.lat, formData.location.lng]} 
                      zoom={15} 
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationPicker />
                      <Marker position={[formData.location.lat, formData.location.lng]} />
                    </MapContainer>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      Selected coordinates: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Media Upload */}
            {step === 3 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <PhotoIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Photos</h2>
                    <p className="text-gray-600 dark:text-gray-300">Visual evidence helps us resolve issues faster</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    id="image-upload"
                  />
                  
                  <label 
                    htmlFor="image-upload" 
                    className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200"
                  >
                    <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mb-4" />
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Photos
                    </span>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Click to browse or drag and drop images here
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      PNG, JPG, JPEG up to 10MB each
                    </p>
                  </label>

                  {formData.images.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Uploaded Photos ({formData.images.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center p-2">
                              <PhotoIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                              {img.name}
                            </p>
                            <button 
                              onClick={() => removeImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                    <EyeIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review & Submit</h2>
                    <p className="text-gray-600 dark:text-gray-300">Please verify all details before submitting</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Issue Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Title:</span>
                            <span className="font-medium">{formData.title || "Not provided"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Category:</span>
                            <span className="font-medium">{formData.category || "Not selected"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                            <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                              priorities.find(p => p.value === formData.priority)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {formData.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">City:</span>
                            <span className="font-medium">{formData.city}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Coordinates:</span>
                            <span className="font-mono text-xs">{formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formData.description || "No description provided"}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Media Files</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formData.images.length} photo(s) uploaded
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      After submission, you'll receive a tracking token to monitor your issue's progress
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-500 transition-all duration-200"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Previous
                </button>

                {step < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={!formData.title || !formData.category || !formData.description}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                  >
                    Next
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                  >
                    {loading || isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Submit Report
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ReportIssue