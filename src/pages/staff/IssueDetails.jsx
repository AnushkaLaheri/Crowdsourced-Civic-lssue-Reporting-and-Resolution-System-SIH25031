"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import {
  ArrowLeftIcon,
  PhotoIcon,
  PaperClipIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline"
import Navbar from "../../components/Navbar"
import { mockIssues } from "../../utils/mockData"
import "leaflet/dist/leaflet.css"

const IssueDetails = () => {
  const { issueId } = useParams()
  const navigate = useNavigate()
  const [issue, setIssue] = useState(null)
  const [updateText, setUpdateText] = useState("")

  useEffect(() => {
    // In a real app, this would be an API call
    const foundIssue = mockIssues.find((i) => i.id === issueId)
    setIssue(foundIssue)
  }, [issueId])

  const handleAddUpdate = () => {
    if (updateText.trim()) {
      // In a real app, this would make an API call
      console.log(`Adding update to issue ${issueId}: ${updateText}`)
      setUpdateText("")
    }
  }

  const handleStatusUpdate = (newStatus) => {
    // In a real app, this would make an API call
    console.log(`Updating issue ${issueId} to ${newStatus}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    }
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Issue Details</h1>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                {issue.status}
              </span>
              {issue.status === "Pending" && (
                <button
                  onClick={() => handleStatusUpdate("In Progress")}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Start Work
                </button>
              )}
              {issue.status === "In Progress" && (
                <button
                  onClick={() => handleStatusUpdate("Resolved")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Issue Info */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">{issue.title}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400">{issue.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Category:</span>
                    <p className="font-medium text-neutral-900 dark:text-white">{issue.category}</p>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Priority:</span>
                    <p className="font-medium text-neutral-900 dark:text-white">{issue.priority}</p>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Ward:</span>
                    <p className="font-medium text-neutral-900 dark:text-white">{issue.ward}</p>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Reported By:</span>
                    <p className="font-medium text-neutral-900 dark:text-white">{issue.reportedBy}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-500">
                  <span className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {issue.address}
                  </span>
                  <span className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Photos */}
            {issue.images && issue.images.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {issue.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Issue ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Timeline</h3>
              <div className="space-y-4">
                {issue.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{event.status}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{event.note}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        {new Date(event.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Map */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Location</h3>
              <div className="h-64 rounded-xl overflow-hidden">
                <MapContainer
                  center={[issue.location.lat, issue.location.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[issue.location.lat, issue.location.lng]}>
                    <Popup>
                      <div className="text-center">
                        <h4 className="font-semibold">{issue.title}</h4>
                        <p className="text-sm">{issue.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* Add Update */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Add Update</h3>
              <div className="space-y-4">
                <textarea
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  placeholder="Add a progress update..."
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <PhotoIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <PaperClipIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddUpdate}
                    disabled={!updateText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-xl transition-colors"
                  >
                    Add Update
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default IssueDetails