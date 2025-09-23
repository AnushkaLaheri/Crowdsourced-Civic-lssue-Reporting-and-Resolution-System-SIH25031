import { useState } from "react"
import { motion } from "framer-motion"
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  BarChart,
  Clock,
  MessageCircle,
  User,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Navbar from "../../components/Navbar"

// Mock data for demonstration
const mockFeedbackData = [
  {
    id: 1,
    userId: "user123",
    userName: "John Doe",
    rating: 4,
    comment: "Great response to my complaint about street lighting. Fixed within 48 hours!",
    sentiment: "positive",
    timestamp: "2025-09-15T10:30:00Z",
    category: "Infrastructure",
  },
  {
    id: 2,
    userId: "user456",
    userName: "Sarah Wilson",
    rating: 3,
    comment: "The process was okay, but took longer than expected to get a response.",
    sentiment: "neutral",
    timestamp: "2025-09-14T15:45:00Z",
    category: "Sanitation",
  },
  {
    id: 3,
    userId: "user789",
    userName: "Mike Brown",
    rating: 5,
    comment: "Excellent service! The pothole was fixed quickly and properly.",
    sentiment: "positive",
    timestamp: "2025-09-13T09:15:00Z",
    category: "Roads",
  },
]

const FeedbackSection = () => {
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Calculate analytics
  const totalFeedback = mockFeedbackData.length
  const averageRating = (
    mockFeedbackData.reduce((sum, item) => sum + item.rating, 0) / totalFeedback
  ).toFixed(1)
  const positiveFeedback = mockFeedbackData.filter(
    (item) => item.sentiment === "positive"
  ).length
  const satisfactionPercentage = Math.round((positiveFeedback / totalFeedback) * 100)

  const handleSubmitFeedback = (e) => {
    e.preventDefault()
    // Here you would typically make an API call to submit the feedback
    console.log({
      rating: feedbackRating,
      comment: feedbackComment,
    })
    // Reset form
    setFeedbackRating(0)
    setFeedbackComment("")
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Community Feedback</h1>
          <p className="text-muted-foreground">
            Share your experience and help us improve our services
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Analytics Cards */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Overall Rating</h3>
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <div className="text-3xl font-bold">{averageRating}</div>
              <div className="text-sm text-muted-foreground">
                Based on {totalFeedback} reviews
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Satisfaction Rate</h3>
                <ThumbsUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold">{satisfactionPercentage}%</div>
              <div className="text-sm text-muted-foreground">
                Positive sentiment ratio
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Response Time</h3>
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold">48h</div>
              <div className="text-sm text-muted-foreground">
                Average resolution time
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFeedback} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className={`p-1 rounded-full transition-colors ${
                            star <= feedbackRating
                              ? "text-yellow-400 hover:text-yellow-500"
                              : "text-gray-300 hover:text-gray-400"
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Feedback
                    </label>
                    <textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md resize-none"
                      placeholder="Share your experience with our services..."
                    />
                  </div>

                  <Button type="submit" disabled={!feedbackRating || !feedbackComment}>
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sentiment Distribution */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Positive</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="bg-muted" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Neutral</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="bg-muted" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Negative</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFeedbackData.map((feedback) => (
                    <Card key={feedback.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-medium">{feedback.userName}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(feedback.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={index}
                                  className={`h-4 w-4 ${
                                    index < feedback.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <Badge
                            variant={
                              feedback.sentiment === "positive"
                                ? "default"
                                : feedback.sentiment === "neutral"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {feedback.sentiment}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-2">
                          {feedback.comment}
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline">{feedback.category}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackSection