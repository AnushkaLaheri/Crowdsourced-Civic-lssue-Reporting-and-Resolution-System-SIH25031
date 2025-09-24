"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navbar from "../../components/Navbar"
import {
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react"

const TrackIssues = () => {
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [filter, setFilter] = useState("all")
  const [issues, setIssues] = useState([])

  // fetch from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("issues")) || []
    setIssues(stored)
  }, [])

  const getStatusIcon = (status = "") => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-5 w-5 text-white" />
      case "assigned":
        return <User className="h-5 w-5 text-white" />
      case "in progress":
        return <AlertCircle className="h-5 w-5 text-white" />
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-white" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Track My Issues
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your submitted civic issues
          </p>
        </motion.div>

        {/* Filter buttons */}
        <div className="flex space-x-2 mb-6">
          {["all", "pending", "assigned", "in progress", "resolved"].map(
            (status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            )
          )}
        </div>

        {/* Issue list */}
        <div className="grid lg:grid-cols-2 gap-6">
          {issues.length === 0 ? (
            <p className="text-muted-foreground">No issues reported yet.</p>
          ) : (
            issues
              .filter(
                (issue) =>
                  filter === "all" ||
                  issue.status?.toLowerCase().includes(filter)
              )
              .map((issue) => (
                <Card
                  key={issue.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedIssue(issue)}
                >
                  <CardHeader className="p-4 flex justify-between items-start">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">#{issue.token}</Badge>
                        <Badge>{issue.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {issue.title || "Untitled Issue"}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {issue.city} •{" "}
                        {issue.createdAt
                          ? new Date(issue.createdAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                      {getStatusIcon(issue.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {issue.description}
                    </p>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>

      {/* Detailed Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            <button
              onClick={() => setSelectedIssue(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedIssue.title || "Untitled Issue"}
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Category:</strong> {selectedIssue.category}
              </p>
              <p>
                <strong>Priority:</strong> {selectedIssue.priority}
              </p>
              <p>
                <strong>Status:</strong> {selectedIssue.status}
              </p>
              <p>
                <strong>City:</strong> {selectedIssue.city}
              </p>
              <p>
                <strong>Ward No:</strong> {selectedIssue.wardNo}
              </p>
              <p>
                <strong>Members:</strong>{" "}
                {selectedIssue.members?.join(", ")}
              </p>
              <p>
                <strong>Department:</strong> {selectedIssue.department}
              </p>
              <p>
                <strong>Token:</strong> {selectedIssue.token}
              </p>
              <p>
                <strong>Tips:</strong> {selectedIssue.tips}
              </p>
              <p>
                <strong>Description:</strong> {selectedIssue.description}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {selectedIssue.createdAt
                  ? new Date(selectedIssue.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackIssues
