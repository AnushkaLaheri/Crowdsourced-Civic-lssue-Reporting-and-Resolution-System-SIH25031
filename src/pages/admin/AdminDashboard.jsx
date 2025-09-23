"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import Navbar from "../../components/Navbar"
import { useAuth } from "../../contexts/AuthContext"
import { mockIssues, mockAnalytics, mockStaff } from "../../utils/mockData"

// Mock data for new components
const mockDemands = [
  {
    id: 1,
    title: 'New Park Request',
    description: 'Request for a new children\'s park in Ward 2',
    ward: 'ward2',
    type: 'infrastructure',
    status: 'pending',
    department: 'public_works',
    submittedAt: '2025-09-15',
    submittedBy: 'John Doe',
  },
  {
    id: 2,
    title: 'Street Light Installation',
    description: 'Request for additional street lights on Main Road',
    ward: 'ward1',
    type: 'utilities',
    status: 'approved',
    department: 'utilities',
    submittedAt: '2025-09-14',
    submittedBy: 'Jane Smith',
  },
  // Add more mock demands...
];

const AdminDashboard = () => {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("issues")

  const stats = [
    {
      title: "Total Issues",
      value: mockAnalytics.totalIssues,
      change: "+12%",
      trend: "up",
      icon: ExclamationTriangleIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Resolved Issues",
      value: mockAnalytics.resolvedIssues,
      change: "+8%",
      trend: "up",
      icon: CheckCircleIcon,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Pending Issues",
      value: mockAnalytics.pendingIssues,
      change: "-5%",
      trend: "down",
      icon: ClockIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "Citizen Satisfaction",
      value: `${mockAnalytics.citizenSatisfaction}%`,
      change: "+3%",
      trend: "up",
      icon: UserGroupIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  const categoryData = mockAnalytics.topCategories.map((cat) => ({
    name: cat.name,
    value: cat.count,
    color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][mockAnalytics.topCategories.indexOf(cat)],
  }))

  const recentIssues = mockIssues.slice(0, 5)
  const activeStaff = mockStaff.filter((staff) => staff.assignedIssues > 0)

  const quickActions = [
    {
      title: "Live Map",
      description: "View real-time issue locations",
      icon: MapPinIcon,
      link: "/admin/map",
      color: "bg-blue-500",
    },
    {
      title: "Issue Management",
      description: "Track and manage issues",
      icon: ExclamationTriangleIcon,
      link: "/admin/issues",
      color: "bg-red-500",
    },
    {
      title: "Demands",
      description: "Review citizen demands",
      icon: UserGroupIcon,
      link: "/admin/demands",
      color: "bg-purple-500",
    },
    {
      title: "Staff",
      description: "Manage staff workload",
      icon: UsersIcon,
      link: "/admin/staff",
      color: "bg-green-500",
    },
    {
      title: "Analytics",
      description: "View performance metrics",
      icon: ChartBarIcon,
      link: "/admin/analytics",
      color: "bg-orange-500",
    },
  ]

  // Department leaderboard data
  const departmentLeaderboard = [
    {
      name: "Public Works",
      resolvedIssues: 145,
      avgResponseTime: "24h",
      satisfaction: 92,
      efficiency: 95,
      trend: "up",
      color: "#3b82f6",
    },
    {
      name: "Sanitation",
      resolvedIssues: 132,
      avgResponseTime: "36h",
      satisfaction: 88,
      efficiency: 87,
      trend: "up",
      color: "#10b981",
    },
    {
      name: "Parks & Recreation",
      resolvedIssues: 98,
      avgResponseTime: "48h",
      satisfaction: 85,
      efficiency: 82,
      trend: "down",
      color: "#f59e0b",
    },
    {
      name: "Traffic Management",
      resolvedIssues: 87,
      avgResponseTime: "32h",
      satisfaction: 86,
      efficiency: 84,
      trend: "up",
      color: "#8b5cf6",
    },
    {
      name: "Street Lighting",
      resolvedIssues: 76,
      avgResponseTime: "40h",
      satisfaction: 83,
      efficiency: 80,
      trend: "down",
      color: "#ef4444",
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
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Welcome back, {user?.name} • System Overview
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <CogIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.trend === "up" ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}
                  >
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
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Trends Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Issue Trends</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMetric("issues")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === "issues"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Issues
                </button>
                <button
                  onClick={() => setSelectedMetric("resolved")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === "resolved"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAnalytics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={selectedMetric === "issues" ? "#3b82f6" : "#10b981"}
                    strokeWidth={3}
                    dot={{ fill: selectedMetric === "issues" ? "#3b82f6" : "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
          >
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Issue Categories</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.slice(0, 3).map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">{category.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Recent Issues</h2>
              <Link
                to="/admin/issues"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-start space-x-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">{issue.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          issue.status === "Resolved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : issue.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">{issue.description}</p>
                    <div className="flex items-center space-x-3 text-xs text-neutral-500 dark:text-neutral-500">
                      <span>#{issue.id}</span>
                      <span>{issue.category}</span>
                      <span>{issue.ward}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Staff Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Staff Performance</h2>
              <Link
                to="/admin/staff"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium"
              >
                Manage Staff
              </Link>
            </div>
            <div className="space-y-4">
              {activeStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <UsersIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{staff.name}</h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">{staff.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {staff.assignedIssues}
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">active</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.floor(staff.rating) ? "bg-yellow-400" : "bg-neutral-300 dark:bg-neutral-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">{staff.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Analytics Row */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Department Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Department Leaderboard</h2>
              <select
                className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="efficiency">By Efficiency</option>
                <option value="satisfaction">By Satisfaction</option>
                <option value="resolved">By Resolved Issues</option>
              </select>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600">
              {departmentLeaderboard.map((dept, index) => (
                <div
                  key={dept.name}
                  className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl transition-transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${dept.color}20` }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                            {index + 1}. {dept.name}
                          </h3>
                          {dept.trend === "up" ? (
                            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {dept.resolvedIssues} issues resolved • {dept.avgResponseTime} avg. response
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-right">
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">{dept.efficiency}%</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">Efficiency</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">{dept.satisfaction}%</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${dept.efficiency}%`,
                        backgroundColor: dept.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Ward Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Ward Performance</h2>
              <select
                className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { ward: "Ward 1", issues: 12, resolved: 10 },
                    { ward: "Ward 2", issues: 8, resolved: 7 },
                    { ward: "Ward 3", issues: 15, resolved: 12 },
                    { ward: "Ward 4", issues: 6, resolved: 6 },
                    { ward: "Ward 5", issues: 11, resolved: 9 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="ward" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="issues" fill="#3b82f6" name="Total Issues" />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
                </div>
      </div>
    </div>
  )
}

export default AdminDashboard
