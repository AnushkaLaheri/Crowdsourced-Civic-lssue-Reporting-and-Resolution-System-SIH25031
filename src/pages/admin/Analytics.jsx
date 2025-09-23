import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Trophy,
  MapPin,
  Clock,
  Users,
  Target,
  Award,
  Activity
} from "lucide-react";

const Analytics = () => {
  // 📊 Mock Data
  const resolutionTimeData = [
    { department: "Public Works", avgTime: 5 },
    { department: "Sanitation", avgTime: 3 },
    { department: "Utilities", avgTime: 4 },
    { department: "Traffic", avgTime: 6 },
    { department: "Health", avgTime: 2 },
  ];

  const satisfactionData = [
    { month: "Jan", satisfaction: 70 },
    { month: "Feb", satisfaction: 72 },
    { month: "Mar", satisfaction: 75 },
    { month: "Apr", satisfaction: 78 },
    { month: "May", satisfaction: 80 },
    { month: "Jun", satisfaction: 82 },
    { month: "Jul", satisfaction: 79 },
    { month: "Aug", satisfaction: 83 },
    { month: "Sep", satisfaction: 85 },
  ];

  const leaderboardData = [
    { id: 1, name: "Sanitation Dept.", type: "Department", score: 92, resolvedIssues: 120 },
    { id: 2, name: "Ward 12", type: "Ward", score: 88, resolvedIssues: 98 },
    { id: 3, name: "Public Works Dept.", type: "Department", score: 85, resolvedIssues: 110 },
    { id: 4, name: "Ward 7", type: "Ward", score: 80, resolvedIssues: 87 },
    { id: 5, name: "Utilities Dept.", type: "Department", score: 78, resolvedIssues: 95 },
  ];

  const hotspots = [
    {
      id: 1,
      location: "Ranchi",
      latitude: 23.3441,
      longitude: 85.3096,
      intensity: 90,
      totalIssues: 140,
      commonIssueType: "Sanitation",
    },
    {
      id: 2,
      location: "Jamshedpur",
      latitude: 22.8046,
      longitude: 86.2029,
      intensity: 75,
      totalIssues: 120,
      commonIssueType: "Traffic",
    },
    {
      id: 3,
      location: "Dhanbad",
      latitude: 23.7957,
      longitude: 86.4304,
      intensity: 60,
      totalIssues: 100,
      commonIssueType: "Public Works",
    },
    {
      id: 4,
      location: "Bokaro",
      latitude: 23.6693,
      longitude: 86.1511,
      intensity: 50,
      totalIssues: 80,
      commonIssueType: "Utilities",
    },
  ];

  return (
    <div className="w-full h-[calc(100vh-2rem)] bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500">Comprehensive civic issue insights and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Live Data
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 p-6">
        {/* Sidebar with Key Metrics */}
        <div className="w-80 space-y-4">
          {/* Average Resolution Time */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-blue-600" />
                Avg Resolution Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">4.2</div>
              <div className="text-sm text-gray-500">days</div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  ↓ 12% from last month
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Citizen Satisfaction */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Satisfaction Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">82%</div>
              <div className="text-sm text-gray-500">overall rating</div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  ↑ 3% from last month
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Top Performer */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-4 w-4 text-yellow-600" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-gray-900">Sanitation Dept.</div>
              <div className="text-sm text-gray-500">92% resolution rate</div>
              <div className="mt-2">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  Excellence Award
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Row 1: Two Charts Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issue Hotspots Map */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  Issue Hotspots
                </CardTitle>
                <CardDescription>Areas with frequent reported issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer
                    center={[20.5937, 78.9629]} // India
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-lg"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {hotspots.map((spot) => (
                      <CircleMarker
                        key={spot.id}
                        center={[spot.latitude, spot.longitude]}
                        radius={15 * (spot.intensity / 100)}
                        fillColor="#dc2626"
                        color="#dc2626"
                        weight={2}
                        opacity={0.8}
                        fillOpacity={0.6}
                        className="hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <Popup className="custom-popup">
                          <div className="p-3 min-w-[250px]">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{spot.location}</h3>
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                Hotspot
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Issues:</span>
                                <span className="font-medium">{spot.totalIssues}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Most Common:</span>
                                <span className="font-medium capitalize">{spot.commonIssueType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Intensity:</span>
                                <span className="font-medium">{spot.intensity}%</span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
            {/* Citizen Satisfaction Chart */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Citizen Satisfaction Trends
                </CardTitle>
                <CardDescription>Monthly satisfaction ratings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={satisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#d1d5db' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            

            
          </div>

          {/* Row 2: Map and Leaderboard Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Average Resolution Time Chart */}
<Card className="bg-white shadow-lg border-0">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Activity className="h-5 w-5 text-blue-600" />
      Average Resolution Time by Department
    </CardTitle>
    <CardDescription>Time taken to resolve issues (days)</CardDescription>
  </CardHeader>
  <CardContent className="p-4">
    <div className="w-full h-[350px] lg:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={resolutionTimeData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="department"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar
            dataKey="avgTime"
            fill="#3b82f6"
            name="Resolution Time"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>


            {/* Performance Leaderboard */}
<Card className="bg-white shadow-lg border-0">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Trophy className="h-5 w-5 text-yellow-600" />
      Performance Leaderboard
    </CardTitle>
    <CardDescription>Department and ward rankings</CardDescription>
  </CardHeader>
  <CardContent className="space-y-3">
    {leaderboardData.slice(0, 5).map((item, index) => (
      <div
        key={item.id}
        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            index === 0 ? 'bg-yellow-100 text-yellow-800' :
            index === 1 ? 'bg-gray-100 text-gray-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {index + 1}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-500">{item.type}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-gray-900">{item.score}%</p>
          <p className="text-xs text-gray-500">
            {item.resolvedIssues} issues resolved
          </p>
        </div>
      </div>
    ))}
  </CardContent>
</Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
