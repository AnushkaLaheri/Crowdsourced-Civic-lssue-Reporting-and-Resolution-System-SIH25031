import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"
import LandingPage from "./pages/LandingPage"
import SignIn from "./pages/auth/SignIn"
import SignUp from "./pages/auth/SignUp"
import CitizenDashboard from "./pages/citizen/CitizenDashboard"
import AdminDashboard from "./pages/admin/AdminDashboard"
import LiveMapView from "./pages/admin/LiveMapView"
import IssueManagement from "./pages/admin/IssueManagement"
import DemandRequests from "./pages/admin/DemandRequests"
import StaffManagement from "./pages/admin/StaffManagement"
import Analytics from "./pages/admin/Analytics"
import StaffDashboard from "./pages/staff/StaffDashboard"
import IssueDetails from "./pages/staff/IssueDetails"
import ReportIssue from "./pages/citizen/ReportIssue"
import TrackIssues from "./pages/citizen/TrackIssues"
import DemandSection from "./pages/citizen/DemandSection"
import FeedbackSection from "./pages/citizen/FeedbackSection"
import ProtectedRoute from "./components/ProtectedRoute"
import "./index.css"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Citizen Routes */}
              <Route
                path="/citizen"
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <CitizenDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/report"
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <ReportIssue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/track"
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <TrackIssues />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/demands"
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <DemandSection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/feedback"
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <FeedbackSection />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/map"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <LiveMapView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/issues"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <IssueManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/demands"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DemandRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/staff"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <StaffManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              {/* Staff Routes */}
              <Route
                path="/staff"
                element={
                  <ProtectedRoute allowedRoles={["staff"]}>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/issues/:issueId"
                element={
                  <ProtectedRoute allowedRoles={["staff"]}>
                    <IssueDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
