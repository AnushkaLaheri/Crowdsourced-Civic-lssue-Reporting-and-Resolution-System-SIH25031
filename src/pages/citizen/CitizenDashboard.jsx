"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  PlusIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  CheckIcon,
} from "@heroicons/react/24/outline"
import Navbar from "../../components/Navbar"
import { useAuth } from "../../contexts/AuthContext"
import { mockIssues, mockDemands, mockAnalytics } from "../../utils/mockData"

const CitizenDashboard = () => {
  const { user } = useAuth()
  const [recentIssues, setRecentIssues] = useState([])
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    reported: 0,
    inProgress: 0,
    resolved: 0,
    demands: 0,
    currentStep: 0,
    
  totalFiles: 0, // add this
  })

 useEffect(() => {
  if (!user) return;

  // 1️⃣ Get all issues from localStorage
  const stored = JSON.parse(localStorage.getItem("issues")) || [];

  // 2️⃣ Remove duplicates using token
  const uniqueIssuesMap = {};
  stored.forEach((issue) => {
    if (!uniqueIssuesMap[issue.token]) {
      uniqueIssuesMap[issue.token] = issue;
    }
  });
  const uniqueIssues = Object.values(uniqueIssuesMap).reverse(); // latest first
  setIssues(uniqueIssues);

  // 3️⃣ Filter issues reported by current user
  const userIssues = uniqueIssues.filter((issue) => issue.reportedBy === user.name);
  // Assuming issues is your state array
const totalFiles = issues.reduce((acc, issue) => acc + (issue.files?.length || 0), 0);

console.log("Total files attached in all issues:", totalFiles);


  // 4️⃣ Recent 3 issues
  setRecentIssues(userIssues.slice(0, 3));

  // 5️⃣ Aggregate stats
  const stats = {
    reported: userIssues.length,
    inProgress: userIssues.filter((i) => i.status === "In Progress").length,
    resolved: userIssues.filter((i) => i.status === "Resolved").length,
    demands: mockDemands.length,
    currentStep: 0,
  };

  if (stats.resolved > 0) stats.currentStep = 3;
  else if (stats.inProgress > 0) stats.currentStep = 2;
  else if (stats.reported > 0) stats.currentStep = 1;

  setStats(stats);
}, [user]);


  const quickActions = [
    {
      title: "Report Issue",
      description: "Report a new civic issue",
      icon: PlusIcon,
      link: "/citizen/report",
      color: "bg-blue-500",
    },
    {
      title: "Track Issues",
      description: "View your reported issues",
      icon: MapPinIcon,
      link: "/citizen/track",
      color: "bg-green-500",
    },
    {
      title: "Community Demands",
      description: "Vote on civic improvements",
      icon: UserGroupIcon,
      link: "/citizen/demands",
      color: "bg-purple-500",
    },
    {
      title: "Feedback",
      description: "Share your experience",
      icon: ChartBarIcon,
      link: "/citizen/feedback",
      color: "bg-orange-500",
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case "In Progress":
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
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

  const pieData = [
    { name: "Resolved", value: stats.resolved, color: "#10b981" },
    { name: "In Progress", value: stats.inProgress, color: "#f59e0b" },
    { name: "Pending", value: stats.reported - stats.resolved - stats.inProgress, color: "#ef4444" },
  ]

  // Issue statuses for progress chart
  const issueStatuses = [
    {
      title: "Reported",
      step: 1,
      count: stats.reported - stats.inProgress - stats.resolved,
      color: stats.reported - stats.inProgress - stats.resolved > 0 ? "#10b981" : "#d1d5db",
    },
    {
      title: "In Progress",
      step: 2,
      count: stats.inProgress,
      color: stats.inProgress > 0 ? "#10b981" : "#d1d5db",
    },
    {
      title: "Resolved",
      step: 3,
      count: stats.resolved,
      color: stats.resolved > 0 ? "#10b981" : "#d1d5db",
    },
    {
      title: "Completed",
      step: 4,
      count: 0,
      color: "#d1d5db",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Welcome Back, {user?.name}</h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">{user?.ward} • Citizen Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <BellIcon className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Issues Reported", value: stats.reported, icon: MapPinIcon, color: "text-blue-600" },
            { label: "In Progress", value: stats.inProgress, icon: ClockIcon, color: "text-yellow-600" },
            { label: "Resolved", value: stats.resolved, icon: CheckCircleIcon, color: "text-green-600" },
            { label: "Community Demands", value: stats.demands, icon: UserGroupIcon, color: "text-purple-600" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-neutral-100 dark:bg-neutral-700 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions + Recent Issues */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            {/* Quick Actions */}
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="group bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{action.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Issues */}
<h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">All Issues</h2>
<div className="space-y-4">
  {issues.length > 0 ? (
    issues.map((issue) => (
      <motion.div
        key={issue.token || issue.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {getStatusIcon(issue.status)}
              <h3 className="font-semibold text-neutral-900 dark:text-white">{issue.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                {issue.status}
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{issue.description}</p>
            <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span>#{issue.token || issue.id}</span>
              <span>{issue.category}</span>
              <span>{issue.city}</span>
              <span>{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
        </div>
      </motion.div>
    ))
  ) : (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700 text-center">
      <MapPinIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">No Issues Reported</h3>
      <p className="text-neutral-600 dark:text-neutral-400 mb-4">
        You haven't reported any issues yet. Start by reporting your first civic issue.
      </p>
      <Link
        to="/citizen/report"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        Report Issue
      </Link>
    </div>
  )}



            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Issue Status Chart 
<div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
    Your Issues Status
  </h3>

  {stats.reported > 0 ? (
    <div className="flex items-center justify-between w-full relative">
      {issueStatuses.map((status, idx) => {
        const isDone = stats.currentStep > idx;
        const isCurrent = stats.currentStep === idx;

        return (
          <div key={idx} className="flex flex-col items-center relative w-20">
            {/* Connector line 
            {idx < issueStatuses.length - 1 && (
              <div className="absolute top-3 left-1/2 w-full h-1 -translate-x-1/2 flex">
                {/* Left half 
                <div
                  className="h-1 rounded-l-full"
                  style={{
                    flex: 1,
                    backgroundColor: isDone || isCurrent ? "#10b981" : "#d1d5db",
                  }}
                />
                {/* Right half 
                <div
                  className="h-1 rounded-r-full"
                  style={{
                    flex: 1,
                    backgroundColor: isDone ? "#10b981" : "#d1d5db",
                  }}
                />
              </div>
            )}

            {/* Step circle 
            <div
              className="w-6 h-6 rounded-full border-2 border-white dark:border-neutral-800 z-10 flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: isDone || isCurrent ? "#10b981" : "#d1d5db" }}
            >
              {isDone ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <span>{status.step}</span>
              )}
            </div>

            {/* Step title 
            <span className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 text-center">
              {status.title}
            </span>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="h-48 flex items-center justify-center text-neutral-400">
      <div className="text-center">
        <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />
        <p>No data to display</p>
      </div>
    </div>
  )}
</div>*/}


            {/* Community Activity */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Community Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Total Issues</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{mockAnalytics.totalIssues}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Resolved</span>
                  <span className="font-semibold text-green-600">{mockAnalytics.resolvedIssues}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Satisfaction</span>
                  <span className="font-semibold text-blue-600">{mockAnalytics.citizenSatisfaction}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Avg Resolution</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{mockAnalytics.avgResolutionTime}</span>
                </div>
              </div>
            </div>

            {/* Popular Demands */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Popular Demands</h3>
              <div className="space-y-3">
                {mockDemands.slice(0, 2).map((demand) => (
                  <div key={demand.id} className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                    <h4 className="font-medium text-neutral-900 dark:text-white text-sm mb-1">{demand.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">{demand.votes} votes</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          demand.status === "Approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {demand.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/citizen/demands"
                className="block text-center text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium mt-4"
              >
                View All Demands
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CitizenDashboard
