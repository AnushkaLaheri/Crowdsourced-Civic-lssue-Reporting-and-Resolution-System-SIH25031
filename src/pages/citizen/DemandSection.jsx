"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Camera,
  Mic,
  PlusCircle,
  ThumbsUp,
  Eye,
  Clock,
  CheckCircle,
  Upload,
  AlertCircle,
  Bell,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const DemandSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New demand in Ward 7: New Park Development", ward: "Ward 7" },
    { id: 2, message: "New demand in Ward 3: Street Lights Repair", ward: "Ward 3" },
  ])
  const [demands, setDemands] = useState([
    {
      id: "DEM001",
      title: "New Park Development",
      description: "Request for a new park in Sector 7 for community recreation",
      image: "/children-park-proposal.jpg",
      votes: 145,
      totalVoters: 200,
      status: "Pending",
      completedAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      ward: "Ward 7",
    },
    {
      id: "DEM002",
      title: "Street Lights Repair",
      description: "Repair street lights in Ward 3, near main road",
      image: "/broken-street-light.png",
      votes: 80,
      totalVoters: 150,
      status: "Approved",
      timestamp: new Date().toISOString(),
      ward: "Ward 3",
    },
    
    {
    id: "DEM004",
    title: "New Garden Renovation",
    description: "Renovation completed in Ward 7 garden",
    image: "/garden.jpg",
    votes: 100,
    totalVoters: 120,
    status: "Completed",
    completedAt: new Date("2025-09-18").toISOString(),
    timestamp: new Date("2025-08-25").toISOString(),
    ward: "Ward 7",
  },
  {
    id: "DEM005",
    title: "Community Hall Repair",
    description: "Repairs finished at the community hall, Ward 7",
    image: "/community-hall.jpg",
    votes: 80,
    totalVoters: 100,
    status: "Completed",
    completedAt: new Date("2025-09-15").toISOString(),
    timestamp: new Date("2025-08-20").toISOString(),
    ward: "Ward 2",
  },
  
  ])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const startRecording = () => setIsRecording(true)
  const stopRecording = () => setIsRecording(false)

  const generateToken = () => "DEM" + Math.random().toString(36).substr(2, 6).toUpperCase()

  const handleSubmitDemand = () => {
    const newDemand = {
      id: generateToken(),
      title: document.getElementById("demand-title").value,
      description: document.getElementById("demand-desc").value,
      image: previewImage,
      votes: 0,
      totalVoters: 0,
      status: "Under Review",
      timestamp: new Date().toISOString(),
      ward: document.getElementById("demand-ward").value,
    }
    setDemands([newDemand, ...demands])
    setNotifications([
      {
        id: notifications.length + 1,
        message: `New demand in ${newDemand.ward}: ${newDemand.title}`,
        ward: newDemand.ward,
      },
      ...notifications,
    ])
    setPreviewImage(null)
    setAudioBlob(null)
    setIsFormOpen(false)
  }

  // Filter completed demands for a certain ward (example: Ward 7)
  const completedDemands = demands.filter(d => d.status === "Completed" && d.ward === "Ward 7"||d.ward === "Ward 2")
  // Demands raised (exclude completed)
const raisedDemands = demands.filter(d => d.status !== "Completed")
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Add Demand Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Community Demands</h1>
            <p className="text-muted-foreground">Submit, vote, and track demands in your ward</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>+ Add Demand</Button>
        </motion.div>

        {/* Demands Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column: Demands Raised (4/5 width) */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4">Demands Raised</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {raisedDemands.map((demand) => (
                <Card key={demand.id} >
                  <CardHeader className="pb-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge variant="outline" className="mb-2">{demand.id}</Badge>
                        <CardTitle className="text-xl">{demand.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{demand.ward} • {new Date(demand.timestamp).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={demand.status === "Approved" ? "default" : demand.status === "Completed" ? "success" : "secondary"}>{demand.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {demand.image && <img src={demand.image} alt={demand.title} className="w-full h-48 object-cover rounded-md mb-4" />}
                    <p className="text-muted-foreground mb-4">{demand.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Community Support</span>
                        <span>{Math.round((demand.votes / Math.max(demand.totalVoters,1)) * 100)}%</span>
                      </div>
                      <Progress value={(demand.votes / Math.max(demand.totalVoters,1)) * 100} />
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" /> {demand.votes} votes
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" /> {demand.totalVoters} voters
                        </span>
                      </div>
                      <Button variant="outline" size="sm">Vote</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column: Completed Demands (1/5 width) */}
          <div className="col-span-1">
            <h2 className="text-xl font-semibold mb-4">Completed Demands</h2>
            <div className="space-y-4">
              {completedDemands.map((demand) => (
                <Card key={demand.id} className="shadow-md border border-neutral-200 dark:border-neutral-700 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant="outline">{demand.id}</Badge>
                      <CardTitle className="text-lg mt-1">{demand.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">{demand.ward}</p>
                      <p className="text-xs text-muted-foreground">Completed: {new Date(demand.completedAt).toLocaleDateString()}</p>
                    </div>
                    <CheckCircle className="text-green-500 h-5 w-5 mt-1" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="bg-background w-full max-w-2xl p-6 rounded-xl shadow-xl relative"
              >
                <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
                <CardTitle className="text-2xl mb-4">Create New Demand</CardTitle>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Demand Title</label>
                    <Input type="text" id="demand-title" placeholder="Enter a clear title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ward/Location</label>
                    <Input type="text" id="demand-ward" placeholder="Enter ward or location" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea id="demand-desc" rows={4} placeholder="Explain your demand..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Photo</label>
                    <div className="mt-1 flex items-center gap-4">
                      <Button variant="outline" size="sm" onClick={() => document.getElementById("photo-upload").click()}>
                        <Upload className="h-4 w-4 mr-2" /> Choose Photo
                      </Button>
                      <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      {previewImage && (
                        <div className="relative w-24 h-24">
                          <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-md" />
                          <button className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1" onClick={() => setPreviewImage(null)}>
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Voice Note (Optional)</label>
                    <div className="flex items-center gap-4">
                      <Button variant={isRecording ? "destructive" : "outline"} size="sm" onClick={isRecording ? stopRecording : startRecording}>
                        {isRecording ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-2" /> Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" /> Record Voice Note
                          </>
                        )}
                      </Button>
                      {audioBlob && <audio controls className="w-full"><source src={URL.createObjectURL(audioBlob)} type="audio/webm" /></audio>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmitDemand}>Submit Demand</Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DemandSection
