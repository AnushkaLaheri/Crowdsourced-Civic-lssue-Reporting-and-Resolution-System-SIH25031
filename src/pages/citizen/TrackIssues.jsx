import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  Edit2,
  Image as ImageIcon,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navbar from "../../components/Navbar"
import { mockIssues } from "../../utils/mockData"

const statusSteps = {
  Pending: 0,
  Assigned: 1,
  "In Progress": 2,
  Resolved: 3,
}

const statusColors = {
  Pending: "bg-yellow-500",
  Assigned: "bg-blue-500",
  "In Progress": "bg-purple-500",
  Resolved: "bg-green-500",
}

const statusColorsTimeline = {
  Pending: "bg-yellow-400",
  Assigned: "bg-blue-400",
  "In Progress": "bg-purple-400",
  Resolved: "bg-green-400",
}


const TrackIssues = () => {
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [filter, setFilter] = useState("all")

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5 text-white" />
      case "Assigned":
        return <User className="h-5 w-5 text-white" />
      case "In Progress":
        return <AlertCircle className="h-5 w-5 text-white" />
      case "Resolved":
        return <CheckCircle className="h-5 w-5 text-white" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Track My Issues</h1>
          <p className="text-muted-foreground">Monitor and manage your submitted civic issues</p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          {["all", "pending", "assigned", "in progress", "resolved"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Issue List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {mockIssues
            .filter((issue) => filter === "all" || issue.status.toLowerCase().includes(filter))
            .map((issue) => (
              <Card
                key={issue.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedIssue(issue)}
              >
                <CardHeader className="p-4 flex justify-between items-start">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">#{issue.id}</Badge>
                      <Badge>{issue.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {issue.ward}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${statusColors[issue.status]} text-white`}>
                    {issue.status}
                  </Badge>
                </CardHeader>
              </Card>
            ))}
        </div>

        {/* Issue Detail Modal */}
        <AnimatePresence>
          {selectedIssue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-5xl p-6 relative shadow-xl overflow-y-auto max-h-[90vh]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">{selectedIssue.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">#{selectedIssue.id}</Badge>
                      <Badge>{selectedIssue.category}</Badge>
                      <Badge className={`${statusColors[selectedIssue.status]} text-white`}>
                        {selectedIssue.status}
                      </Badge>
                    </div>
                  </div>
                  {selectedIssue.status === "Pending" && (
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  )}
                </div>

                {/* Horizontal Status Timeline */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Status Timeline</h3>
                  <div className="relative flex items-center justify-between w-full mt-6 mb-4">
  {Object.entries(statusSteps).map(([status, step], index) => (
    <div key={status} className="flex-1 relative flex flex-col items-center">
      {/* Horizontal connecting line */}
      {index < Object.keys(statusSteps).length - 1 && (
        <div
          className={`absolute top-5 left-1/2 w-full h-1 ${
            step < statusSteps[selectedIssue.status]
              ? statusColorsTimeline[status]
              : "bg-gray-300"
          } z-0 -translate-x-1/2`}
        ></div>
      )}

      {/* Status Circle */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          step <= statusSteps[selectedIssue.status]
            ? statusColorsTimeline[status]
            : "bg-gray-300"
        } z-10`}
      >
        {getStatusIcon(status)}
      </div>
      <div className="mt-2 text-center font-medium">{status}</div>
    </div>
  ))}
</div>

                </div>

                {/* Issue Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-1">Description</h3>
                      <p className="text-muted-foreground">{selectedIssue.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">{selectedIssue.address}</p>
                    </div>
                  </div>

                  {/* Images */}
                  {selectedIssue.images?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Images</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedIssue.images.map((img, idx) => (
                          <div key={idx} className="aspect-video bg-muted rounded-md overflow-hidden">
                            <img src={img} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resolution */}
                  {selectedIssue.status === "Resolved" && selectedIssue.resolution && (
                    <div>
                      <h3 className="font-semibold mb-2">Resolution Proof</h3>
                      <div className="bg-muted p-4 rounded-md">
                        <p className="text-sm text-muted-foreground mb-2">{selectedIssue.resolution.note}</p>
                        {selectedIssue.resolution.images?.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {selectedIssue.resolution.images.map((img, idx) => (
                              <div key={idx} className="aspect-video bg-background rounded-md overflow-hidden">
                                <img src={img} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TrackIssues
