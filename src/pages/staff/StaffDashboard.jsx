"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  CalendarIcon,
  PhotoIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline"
import Navbar from "../../components/Navbar"
import { useAuth } from "../../contexts/AuthContext"
import { mockIssues } from "../../utils/mockData"
import "leaflet/dist/leaflet.css"

const StaffDashboard = () => {
  const { user } = useAuth()
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [filter, setFilter] = useState("assigned")
  const [updateText, setUpdateText] = useState("")

  // Filter issues assigned to current staff member
  const assignedIssues = mockIssues.filter(
    (issue) => issue.assignedTo === user?.name || issue.assignedTo === "Staff Member 1",
  )
  const pendingIssues = assignedIssues.filter((issue) => issue.status === "Pending")
  const inProgressIssues = assignedIssues.filter((issue) => issue.status === "In Progress")
  const resolvedIssues = assignedIssues.filter((issue) => issue.status === "Resolved")

  const getFilteredIssues = () => {
    switch (filter) {
      case "pending":
        return pendingIssues
      case "inProgress":
        return inProgressIssues
      case "resolved":
        return resolvedIssues
      default:
        return assignedIssues
    }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    }
  }

  const handleStatusUpdate = (issueId, newStatus) => {
    // In a real app, this would make an API call
    console.log(`Updating issue ${issueId} to ${newStatus}`)
  }

  const handleAddUpdate = (issueId) => {
    if (updateText.trim()) {
      // In a real app, this would make an API call
      console.log(`Adding update to issue ${issueId}: ${updateText}`)
      setUpdateText("")
    }
  }

  const stats = [
    {
      title: "Assigned Issues",
      value: assignedIssues.length,
      icon: ClipboardDocumentListIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "In Progress",
      value: inProgressIssues.length,
      icon: ClockIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "Resolved Today",
      value: resolvedIssues.length,
      icon: CheckCircleIcon,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Pending",
      value: pendingIssues.length,
      icon: ExclamationTriangleIcon,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Staff Dashboard</h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Welcome back, {user?.name} • Field Operations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Today's Date</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Issues List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">My Issues</h2>
              <div className="flex space-x-2">
                {[
                  { key: "assigned", label: "All", count: assignedIssues.length },
                  { key: "pending", label: "Pending", count: pendingIssues.length },
                  { key: "inProgress", label: "In Progress", count: inProgressIssues.length },
                  { key: "resolved", label: "Resolved", count: resolvedIssues.length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === tab.key
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {getFilteredIssues().map((issue) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedIssue?.id === issue.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                  }`}
                  onClick={() => setSelectedIssue(issue)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">{issue.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}
                        >
                          {issue.priority}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-500">
                        <span className="flex items-center">
                          <MapPinIcon className="w-3 h-3 mr-1" />
                          {issue.address}
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                        <span>#{issue.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2">
                    {issue.status === "Pending" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusUpdate(issue.id, "In Progress")
                        }}
                        className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Start Work
                      </button>
                    )}
                    {issue.status === "In Progress" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusUpdate(issue.id, "Resolved")
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <Link
                      to={`/staff/issues/${issue.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors inline-block"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Issue Details 
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 sticky top-8">
            {selectedIssue ? (
              <>
                {/* Issue Info 
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 max-h-[calc(100vh-6rem)] overflow-y-auto">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Issue Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-white mb-1">{selectedIssue.title}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{selectedIssue.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600 dark:text-neutral-400">Category:</span>
                        <p className="font-medium text-neutral-900 dark:text-white">{selectedIssue.category}</p>
                      </div>
                      <div>
                        <span className="text-neutral-600 dark:text-neutral-400">Priority:</span>
                        <p className="font-medium text-neutral-900 dark:text-white">{selectedIssue.priority}</p>
                      </div>
                      <div>
                        <span className="text-neutral-600 dark:text-neutral-400">Ward:</span>
                        <p className="font-medium text-neutral-900 dark:text-white">{selectedIssue.ward}</p>
                      </div>
                      <div>
                        <span className="text-neutral-600 dark:text-neutral-400">Reported By:</span>
                        <p className="font-medium text-neutral-900 dark:text-white">{selectedIssue.reportedBy}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-neutral-600 dark:text-neutral-400">Location:</span>
                      <p className="font-medium text-neutral-900 dark:text-white text-sm">{selectedIssue.address}</p>
                    </div>

                    {selectedIssue.images && selectedIssue.images.length > 0 && (
                      <div>
                        <span className="text-neutral-600 dark:text-neutral-400">Photos:</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {selectedIssue.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image || "/placeholder.svg?height=80&width=80"}
                                alt={`Issue ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Map 
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Location</h3>
                  <div className="h-48 rounded-xl overflow-hidden">
                    <MapContainer
                      center={[selectedIssue.location.lat, selectedIssue.location.lng]}
                      zoom={15}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[selectedIssue.location.lat, selectedIssue.location.lng]}>
                        <Popup>
                          <div className="text-center">
                            <h4 className="font-semibold">{selectedIssue.title}</h4>
                            <p className="text-sm">{selectedIssue.address}</p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>

                {/* Timeline 
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Timeline</h3>
                  <div className="space-y-3">
                    {selectedIssue.timeline.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{event.status}</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">{event.note}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500">
                            {new Date(event.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Update 
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
                        onClick={() => handleAddUpdate(selectedIssue.id)}
                        disabled={!updateText.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-xl transition-colors"
                      >
                        Add Update
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700 text-center">
                <ClipboardDocumentListIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Select an Issue</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Choose an issue from the list to view details and manage progress
                </p>
              </div>
            )}
          </motion.div>*/}
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard
