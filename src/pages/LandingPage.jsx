import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom";
import Hero from "../components/Hero"
import {
  MapPin,
  FileText,
  Users,
  BarChart3,
  CheckCircle,
  Star,
  Menu,
  X,
  Play,
  ArrowRight,
  Shield,
  Smartphone,
  ThumbsUp,
  Clock,
  TrendingUp,
  Camera,
  Bell,
  MessageSquare,
  Calendar,
  Award,
  Target,
  Zap,
  Globe,
  ChevronDown,
  ExternalLink,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ClipboardEdit,
  MessageCircle,
  Search,
  Home,
  Info,
  Settings,
  HelpCircle,
  Download,
  Eye,
  TrendingDown,
  Building,
  Wifi,
  Database,
  Cloud,
  Lock,
  HeadphonesIcon,
  ChevronRight,
  Activity,
  Layers,
  MonitorSpeaker
} from "lucide-react"

export default function GovtCivicLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [isContentShifted, setIsContentShifted] = useState(false)

  useEffect(() => {
    if (showMap) {
      setTimeout(() => setIsContentShifted(true), 100)
    } else {
      setIsContentShifted(false)
    }
  }, [showMap])

  const heroSlides = [
    {
      title: "Smart Civic Issue Reporting",
      subtitle: "Transforming Governance in Jharkhand",
      description: "Report civic issues, track progress in real-time, and engage with your local government. Making Jharkhand better, one issue at a time.",
      cta: "Start Reporting"
    },
    {
      title: "Real-Time Issue Tracking",
      subtitle: "Transparency at Your Fingertips",
      description: "Monitor the status of your reported issues with live updates, photographic proof, and direct communication with government officials.",
      cta: "Track Issues"
    },
    {
      title: "Citizen Demand Portal",
      subtitle: "Voice Your Community Needs",
      description: "Submit community demands, vote on priorities, and see how government responds to what matters most to your neighborhood.",
      cta: "Submit Demand"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const quickStats = [
    { icon: <Users className="h-6 w-6" />, value: "25K+", label: "Active Citizens", trend: "+12%" },
    { icon: <CheckCircle className="h-6 w-6" />, value: "15K+", label: "Issues Resolved", trend: "+8%" },
    { icon: <Clock className="h-6 w-6" />, value: "2.3", label: "Avg Resolution Days", trend: "-15%" },
    { icon: <ThumbsUp className="h-6 w-6" />, value: "94%", label: "Satisfaction Rate", trend: "+3%" }
  ]

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Smart Issue Reporting",
      description: "Report civic issues with photos, videos, and GPS location. AI categorizes and routes to the right department automatically.",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Real-time Tracking",
      description: "Track your reported issues from submission to resolution with live status updates and proof of completion.",
      color: "bg-green-50 text-green-600 border-green-100"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Citizen Demands",
      description: "Submit and vote on community demands. See what matters most to your neighbors and track government response.",
      color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description: "Government officials get comprehensive analytics on issue patterns, resolution times, and citizen satisfaction.",
      color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Transparent",
      description: "End-to-end encryption ensures data security while maintaining complete transparency in government operations.",
      color: "bg-red-50 text-red-600 border-red-100"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Optimized",
      description: "Access all features through our responsive web app or download our mobile application for on-the-go reporting.",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    }
  ]

  const howItWorks = [
    {
      step: "01",
      title: "Report Issue",
      description: "Take a photo, add location, and describe the problem. Our AI will categorize it automatically.",
      icon: <ClipboardEdit className="h-8 w-8" />
    },
    {
      step: "02",
      title: "Auto Assignment",
      description: "The system routes your issue to the right department and assigns it to available staff members.",
      icon: <MessageCircle className="h-8 w-8" />
    },
    {
      step: "03",
      title: "Track Progress",
      description: "Get real-time updates as staff work on your issue. See photos of work in progress.",
      icon: <Search className="h-8 w-8" />
    },
    {
      step: "04",
      title: "Issue Resolved",
      description: "Receive proof of completion and rate the service. Your feedback helps improve the system.",
      icon: <CheckCircle className="h-8 w-8" />
    }
  ]

  const impactStats = [
    { number: "15,000+", label: "Issues Resolved", icon: <CheckCircle className="h-8 w-8" />, desc: "Successfully completed civic issues across Jharkhand" },
    { number: "2.3 days", label: "Avg Resolution Time", icon: <Clock className="h-8 w-8" />, desc: "Faster response compared to traditional methods" },
    { number: "94%", label: "Citizen Satisfaction", icon: <ThumbsUp className="h-8 w-8" />, desc: "Citizens rate our service as excellent" },
    { number: "50+", label: "Government Departments", icon: <Building className="h-8 w-8" />, desc: "Connected departments across the state" }
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Ranchi Resident",
      content: "The pothole near my house was fixed within 3 days of reporting. Amazing response time and I could track everything!",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Rajesh Kumar",
      role: "Local Business Owner",
      content: "Finally, a system that works! I can track all my complaints and see real progress. This has transformed how we interact with government.",
      rating: 5,
      image: "👨‍💼"
    },
    {
      name: "Anita Devi",
      role: "Community Leader",
      content: "The demand voting feature helped us get a new park approved for our neighborhood. True democratic participation!",
      rating: 5,
      image: "👩‍🏫"
    }
  ]

  const newsUpdates = [
    {
      date: "15 Dec 2024",
      title: "New AI-powered Issue Classification Goes Live",
      excerpt: "Advanced machine learning now categorizes and prioritizes civic issues automatically for faster resolution.",
      tag: "Technology"
    },
    {
      date: "12 Dec 2024",
      title: "10,000 Issues Resolved Milestone Achieved",
      excerpt: "Jharkhand Civic platform successfully resolves its 10,000th civic issue, marking a significant milestone in digital governance.",
      tag: "Milestone"
    },
    {
      date: "08 Dec 2024",
      title: "New Mobile App Features Released",
      excerpt: "Enhanced photo reporting, offline mode, and voice-to-text functionality now available in the latest app update.",
      tag: "Update"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Top Government Banner */}
      <div className="bg-orange-500 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span>🇮🇳 Government of Jharkhand</span>
            <span>•</span>
            <span>Digital India Initiative</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span>Last Updated: 22 Sep 2024</span>
            <span>•</span>
            <span>Version 2.1</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b-2 border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">Jharkhand Civic</h1>
                <p className="text-xs text-blue-600 font-medium">Smart Governance Platform</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1">
                <Info className="h-4 w-4" />
                <span>About</span>
              </a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1">
                <Settings className="h-4 w-4" />
                <span>Features</span>
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </a>
              <div className="flex items-center space-x-3 ml-8 border-l border-gray-200 pl-8">
  <a
    href="/signin"
    className="bg-white border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium"
  >
    Sign In
  </a>
  <a
    href="/signup"
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
  >
    Register
  </a>
</div>

            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="lg:hidden border-t border-gray-200 bg-white py-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <a href="#home" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 py-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </a>
                  <a href="#about" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 py-2">
                    <Info className="h-4 w-4" />
                    <span>About</span>
                  </a>
                  <a href="#features" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 py-2">
                    <Settings className="h-4 w-4" />
                    <span>Features</span>
                  </a>
                  <a href="#contact" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 py-2">
                    <Phone className="h-4 w-4" />
                    <span>Contact</span>
                  </a>
                  <div className="flex items-center space-x-3 ml-8 border-l border-gray-200 pl-8">
  <a
    href="/signin"
    className="bg-white border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium"
  >
    Sign In
  </a>
  <a
    href="/signup"
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
  >
    Register
  </a>
</div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Floating Chatbot */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <button
          onClick={() => setChatbotOpen(!chatbotOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <HelpCircle className="h-6 w-6" />
        </button>
      </motion.div>

      <Hero
        currentSlide={currentSlide}
        heroSlides={heroSlides}
        showMap={showMap}
        setShowMap={setShowMap}
        setCurrentSlide={setCurrentSlide}
      />


      {/* Quick Stats Bar 
      <section className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl lg:text-3xl font-bold">{stat.value}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
                <div className="text-xs text-green-300 font-semibold">{stat.trend}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              About Jharkhand Civic Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A revolutionary digital governance platform designed to bridge the gap between citizens and government, 
              ensuring transparency, accountability, and efficient public service delivery across Jharkhand.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Mission</h3>
                    <p className="text-gray-600">
                      To create a transparent, efficient, and citizen-centric governance system that empowers 
                      every resident of Jharkhand to participate actively in improving their communities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Vision</h3>
                    <p className="text-gray-600">
                      To establish Jharkhand as a model state for digital governance, where technology 
                      serves as a catalyst for inclusive development and citizen satisfaction.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Impact</h3>
                    <p className="text-gray-600">
                      Since launch, we have facilitated the resolution of over 15,000 civic issues, 
                      connected 50+ government departments, and achieved 94% citizen satisfaction.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">24</div>
                    <div className="text-sm text-gray-600">Districts</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">3.3M</div>
                    <div className="text-sm text-gray-600">Population</div>
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <Globe className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-lg font-semibold text-gray-900">Statewide Coverage</div>
                  <div className="text-sm text-gray-600 mt-2">
                    From urban centers to remote villages, ensuring no citizen is left behind in digital governance.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent, and effective. Report issues and see real results through our streamlined process.
            </p>
          </motion.div>

          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:border-blue-200 transition-all duration-300 hover:shadow-lg group-hover:-translate-y-2">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mb-6 pt-4">
                      <div className="bg-blue-50 p-4 rounded-full w-fit mx-auto group-hover:bg-blue-100 transition-colors duration-300">
                        <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
                          {step.icon}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>

                    {/* Connection Line */}
                    {index < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <div className="w-8 h-0.5 bg-blue-200"></div>
                        <div className="absolute -right-1 -top-1 w-0 h-0 border-l-4 border-l-blue-200 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed to revolutionize how citizens interact with government services.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-xl group-hover:-translate-y-1 h-full">
                  <div className={`inline-flex p-4 rounded-xl mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Screenshots */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Platform Dashboards</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored interfaces designed for citizens, administrators, and staff members with role-specific features.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: "Citizen Dashboard",
                description: "Report issues, track progress, submit demands, and provide feedback through an intuitive interface.",
                icon: <Smartphone className="h-12 w-12" />,
                gradient: "from-blue-400 to-blue-600",
                features: ["Issue Reporting", "Real-time Tracking", "Community Voting", "Feedback System"]
              },
              {
                title: "Admin Dashboard",
                description: "Comprehensive management tools for overseeing operations, analytics, and departmental coordination.",
                icon: <BarChart3 className="h-12 w-12" />,
                gradient: "from-green-400 to-green-600",
                features: ["Analytics & Reports", "Staff Management", "Issue Assignment", "Performance Metrics"]
              },
              {
                title: "Staff Dashboard",
                description: "Streamlined interface for field staff to manage assigned tasks and update issue status efficiently.",
                icon: <CheckCircle className="h-12 w-12" />,
                gradient: "from-purple-400 to-purple-600",
                features: ["Task Management", "Status Updates", "Photo Upload", "Field Reporting"]
              }
            ].map((dashboard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-xl group-hover:-translate-y-2">
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${dashboard.gradient} p-8 text-white text-center`}>
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {dashboard.icon}
                    </div>
                    <h3 className="text-xl font-bold">{dashboard.title}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {dashboard.description}
                    </p>
                    
                    <div className="space-y-3">
                      {dashboard.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <a
  href="/signin"
  className="block text-center w-full mt-6 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 py-3 rounded-lg transition-all duration-300 font-medium group-hover:bg-blue-50 group-hover:text-blue-600"
>
  View Dashboard
</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Updates */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed about platform enhancements, new features, and success stories from across Jharkhand.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {newsUpdates.map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {news.tag}
                    </span>
                    <span className="text-xs text-gray-500">{news.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {news.excerpt}
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 group-hover:space-x-2 transition-all duration-300">
                    <span>Read More</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Citizens Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from people using the platform across Jharkhand, showing the impact of digital governance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1 h-full">
                  {/* Quote */}
                  <div className="text-4xl text-blue-600 mb-4">"</div>
                  
                  {/* Rating */}
                  <div className="flex space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-8 leading-relaxed italic">
                    {testimonial.content}
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Impact Across Jharkhand</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real numbers showing how digital governance is transforming lives and communities across the state.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 group-hover:-translate-y-2">
                  <div className="text-blue-200 mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold mb-2">{stat.label}</div>
                  <div className="text-sm text-blue-100 opacity-80">{stat.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8 text-orange-100">
              Join thousands of citizens already using the platform to improve their communities. Your voice matters, your issues count.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105">
                <span>Start Reporting Today</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                Download Mobile App
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg">Jharkhand Civic</div>
                  <div className="text-xs text-gray-400">Digital Governance Platform</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Making government services accessible, transparent, and efficient for all citizens of Jharkhand through innovative digital solutions.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
                <Youtube className="h-5 w-5 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Government Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6 text-white">Government Links</h3>
              <div className="space-y-3">
                {[
                  "Jharkhand Government Portal",
                  "Chief Minister's Office",
                  "District Collectors",
                  "RTI Online Portal",
                  "E-Governance Services",
                  "Digital India Mission"
                ].map((link) => (
                  <a key={link} href="#" className="block text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group">
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6 text-white">Quick Access</h3>
              <div className="space-y-3">
                {[
                  "Report New Issue",
                  "Track Existing Issues",
                  "Submit Community Demand",
                  "View Public Dashboard",
                  "Download Mobile App",
                  "Help & Support"
                ].map((link) => (
                  <a key={link} href="#" className="block text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div id="contact">
              <h3 className="font-semibold text-lg mb-6 text-white">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-400">
                    <div className="font-medium text-white">Jharkhand Secretariat</div>
                    <div>Ranchi, Jharkhand 834001</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <div className="text-sm text-gray-400">+91-651-2446001</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <div className="text-sm text-gray-400">civic@jharkhand.gov.in</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <div className="text-sm text-gray-400">www.jharkhancivic.gov.in</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400 text-center md:text-left">
                <p>&copy; 2024 Government of Jharkhand. All rights reserved.</p>
                <p className="mt-1">Developed under Smart India Hackathon 2024 | Digital India Initiative</p>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                <a href="#" className="hover:text-white transition-colors">Site Map</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}