"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Navbar from "../../components/Navbar"
import {
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  X,
  MapPin,
  Calendar,
  Filter,
  Search,
  ChevronRight,
  Download,
  Share2,
  MessageSquare,
} from "lucide-react"

const TrackIssues = () => {
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [issues, setIssues] = useState([])

  // Fetch from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("issues")) || []
    setIssues(stored)
  }, [])

  const getStatusIcon = (status = "") => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "assigned":
        return <User className="h-4 w-4" />
      case "in progress":
        return <AlertCircle className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in progress":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getProgressValue = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 25
      case "assigned":
        return 50
      case "in progress":
        return 75
      case "resolved":
        return 100
      default:
        return 0
    }
  }

  const filteredIssues = issues
    .filter((issue) => 
      filter === "all" || issue.status?.toLowerCase().includes(filter)
    )
    .filter((issue) =>
      issue.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.token?.toString().includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt)
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Track Your Issues
              </h1>
              <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
                Monitor and manage your submitted civic issues in real-time
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview - 2 columns for mini screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8"
        >
          {["pending", "assigned", "in progress", "resolved"].map((status) => (
            <Card key={status} className="bg-white dark:bg-gray-800 shadow-sm">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
                      {status}
                    </p>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                      {issues.filter(issue => issue.status?.toLowerCase() === status).length}
                    </p>
                  </div>
                  <div className={`p-2 lg:p-3 rounded-full ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-sm mb-4 lg:mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-32 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter */}
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full lg:w-32 text-sm">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Issues</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Issue List - 2 columns for mini screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
        >
          {filteredIssues.length === 0 ? (
            <div className="col-span-2">
              <Card className="text-center py-8 lg:py-12">
                <CardContent>
                  <div className="text-gray-400 dark:text-gray-500 mb-3 lg:mb-4">
                    <MessageSquare className="h-8 w-8 lg:h-12 lg:w-12 mx-auto" />
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No issues found
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                    {searchQuery ? "Try adjusting your search terms" : "You haven't reported any issues yet"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-gray-800 h-full flex flex-col"
                  onClick={() => setSelectedIssue(issue)}
                >
                  <CardContent className="p-4 lg:p-6 flex-1">
                    <div className="flex flex-col gap-3 lg:gap-4">
                      {/* Header */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1 lg:gap-2">
                          <Badge variant="secondary" className="text-xs font-mono">
                            #{issue.token}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {issue.category}
                          </Badge>
                        </div>
                        <Badge className={`capitalize border-0 text-xs ${getStatusColor(issue.status)}`}>
                          {getStatusIcon(issue.status)}
                          {issue.status}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="space-y-2 lg:space-y-3">
                        <CardTitle className="text-base lg:text-xl text-gray-900 dark:text-white line-clamp-2">
                          {issue.title || "Untitled Issue"}
                        </CardTitle>
                        
                        <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {issue.description}
                        </p>

                        <div className="flex flex-col gap-1 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 lg:h-4 lg:w-4" />
                            {issue.city} • Ward {issue.wardNo}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                            {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "N/A"}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1 lg:space-y-2">
                          <div className="flex justify-between text-xs lg:text-sm">
                            <span>Progress</span>
                            <span>{getProgressValue(issue.status)}%</span>
                          </div>
                          <Progress value={getProgressValue(issue.status)} className="h-1 lg:h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Footer */}
                  <CardFooter className="bg-gray-50 dark:bg-gray-700/50 px-4 lg:px-6 py-3 border-t mt-auto">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate mr-2">
                        {issue.members?.length > 0 ? (
                          `Assigned: ${issue.members.join(", ")}`
                        ) : (
                          "Not yet assigned"
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs lg:text-sm">
                        View
                        <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 lg:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl w-full max-w-lg lg:max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
            >
              <div className="relative">
                {/* Header */}
                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-3 lg:mb-4">
                    <div className="pr-4">
                      <Badge variant="secondary" className="mb-2 text-xs lg:text-sm font-mono">
                        #{selectedIssue.token}
                      </Badge>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedIssue.title || "Untitled Issue"}
                      </h2>
                    </div>
                    <button
                      onClick={() => setSelectedIssue(null)}
                      className="p-1 lg:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                    >
                      <X className="h-4 w-4 lg:h-5 lg:w-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 lg:gap-2">
                    <Badge className={`capitalize border-0 text-xs ${getStatusColor(selectedIssue.status)}`}>
                      {getStatusIcon(selectedIssue.status)}
                      {selectedIssue.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {selectedIssue.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {selectedIssue.priority} Priority
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-6 overflow-y-auto max-h-[50vh] lg:max-h-[60vh]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  lg:gap-8">
                    {/* Left Column */}
                    <div className="space-y-3 lg:space-y-4">
                      <div>
                        <h3 className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white mb-2">Description</h3>
                        <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">{selectedIssue.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white mb-2">Location Details</h3>
                        <div className="space-y-1 text-xs lg:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">City:</span>
                            <span className="text-gray-900 dark:text-white">{selectedIssue.city}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Ward Number:</span>
                            <span className="text-gray-900 dark:text-white">{selectedIssue.wardNo}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3 lg:space-y-4">
                      <div>
                        <h3 className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white mb-2">Assignment Details</h3>
                        <div className="space-y-1 text-xs lg:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Department:</span>
                            <span className="text-gray-900 dark:text-white">{selectedIssue.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Assigned Members:</span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedIssue.members?.join(", ") || "Not assigned"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white mb-2">Timeline</h3>
                        <div className="space-y-1 text-xs lg:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Reported On:</span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedIssue.createdAt ? new Date(selectedIssue.createdAt).toLocaleString() : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white mb-2">Helpful Tips</h3>
                        <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">{selectedIssue.tips}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <Button variant="outline" size="sm" className="gap-2 text-xs lg:text-sm">
                      <Share2 className="h-3 w-3 lg:h-4 lg:w-4" />
                      Share Status
                    </Button>
                    <Button onClick={() => setSelectedIssue(null)} size="sm" className="text-xs lg:text-sm">
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TrackIssues