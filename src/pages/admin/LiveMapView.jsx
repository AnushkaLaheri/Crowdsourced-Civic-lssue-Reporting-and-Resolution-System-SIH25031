import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, MapPin, AlertCircle, CheckCircle, Clock } from "lucide-react";

// Enhanced color scheme for professional appearance
const priorityColors = {
  high: "#dc2626",     // refined red
  medium: "#ea580c",   // refined orange
  low: "#16a34a",      // refined green
};

const statusIcons = {
  pending: AlertCircle,
  inProgress: Clock,
  resolved: CheckCircle,
};

const statusColors = {
  pending: "bg-red-100 text-red-800 border-red-200",
  inProgress: "bg-yellow-100 text-yellow-800 border-yellow-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
};

// Mock issues
const mockIssues = [
  // Ward 1
  { id: 1, title: "Potholes in Main Road", type: "infrastructure", status: "pending", ward: "ward1", department: "public_works", priority: "high", latitude: 23.3441, longitude: 85.3096 },
  { id: 2, title: "Street light not working", type: "utilities", status: "inProgress", ward: "ward1", department: "utilities", priority: "medium", latitude: 23.3500, longitude: 85.3100 },
  { id: 3, title: "Garbage not collected", type: "sanitation", status: "resolved", ward: "ward1", department: "sanitation", priority: "low", latitude: 23.3485, longitude: 85.3120 },

  // Ward 2
  { id: 4, title: "Water leakage in pipeline", type: "utilities", status: "pending", ward: "ward2", department: "utilities", priority: "high", latitude: 22.8046, longitude: 86.2029 },
  { id: 5, title: "Overflowing dustbins", type: "sanitation", status: "inProgress", ward: "ward2", department: "sanitation", priority: "medium", latitude: 22.8100, longitude: 86.2050 },
  { id: 6, title: "Broken footpath", type: "infrastructure", status: "resolved", ward: "ward2", department: "public_works", priority: "low", latitude: 22.8055, longitude: 86.2080 },

  // Ward 3
  { id: 7, title: "Illegal encroachment", type: "infrastructure", status: "pending", ward: "ward3", department: "public_works", priority: "high", latitude: 23.7957, longitude: 86.4304 },
  { id: 8, title: "Street lights flickering", type: "utilities", status: "inProgress", ward: "ward3", department: "utilities", priority: "medium", latitude: 23.7980, longitude: 86.4320 },
  { id: 9, title: "Overflowing drain", type: "sanitation", status: "resolved", ward: "ward3", department: "sanitation", priority: "low", latitude: 23.7965, longitude: 86.4310 },

  // Ward 4
  { id: 10, title: "Damaged traffic signals", type: "utilities", status: "pending", ward: "ward4", department: "utilities", priority: "high", latitude: 23.6340, longitude: 85.3330 },
  { id: 11, title: "Garbage collection delayed", type: "sanitation", status: "inProgress", ward: "ward4", department: "sanitation", priority: "medium", latitude: 23.6355, longitude: 85.3350 },
  { id: 12, title: "Cracks in road", type: "infrastructure", status: "resolved", ward: "ward4", department: "public_works", priority: "low", latitude: 23.6360, longitude: 85.3365 },

  // Ward 5
  { id: 13, title: "Waterlogging after rain", type: "infrastructure", status: "pending", ward: "ward5", department: "public_works", priority: "high", latitude: 23.6200, longitude: 85.3200 },
  { id: 14, title: "Street lights off", type: "utilities", status: "inProgress", ward: "ward5", department: "utilities", priority: "medium", latitude: 23.6220, longitude: 85.3220 },
  { id: 15, title: "Garbage not collected for 3 days", type: "sanitation", status: "resolved", ward: "ward5", department: "sanitation", priority: "low", latitude: 23.6210, longitude: 85.3215 },
];


const LiveMapView = ({ issues = mockIssues }) => {
  const [filters, setFilters] = useState({
    type: "all",
    ward: "all",
    status: "all",
    department: "all",
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const filteredIssues = issues.filter(issue => (
    (filters.type === "all" || issue.type === filters.type) &&
    (filters.ward === "all" || issue.ward === filters.ward) &&
    (filters.status === "all" || issue.status === filters.status) &&
    (filters.department === "all" || issue.department === filters.department)
  ));

  return (
    <div className="w-full h-[calc(100vh-2rem)] bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Live Map View</h1>
              <p className="text-sm text-gray-500">Real-time civic issue monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {filteredIssues.length} issues
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 p-6">
        {/* Enhanced Filters Panel */}
        <Card className="w-80 bg-white shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-gray-600" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "type", label: "Issue Type", icon: AlertCircle },
              { key: "ward", label: "Ward", icon: MapPin },
              { key: "status", label: "Status", icon: Clock },
              { key: "department", label: "Department", icon: AlertCircle }
            ].map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <filter.icon className="h-4 w-4" />
                  {filter.label}
                </label>
                <Select
                  onValueChange={(value) => handleFilterChange(filter.key, value)}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder={`All ${filter.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filter.label}</SelectItem>
                    {filter.key === "type" && <>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                    </>}
                    {filter.key === "ward" && <>
                      <SelectItem value="ward1">Ward 1</SelectItem>
                      <SelectItem value="ward2">Ward 2</SelectItem>
                      <SelectItem value="ward3">Ward 3</SelectItem>
                      <SelectItem value="ward4">Ward 4</SelectItem>
                      <SelectItem value="ward5">Ward 5</SelectItem>
                    </>}
                    {filter.key === "status" && <>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inProgress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </>}
                    {filter.key === "department" && <>
                      <SelectItem value="public_works">Public Works</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                    </>}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Enhanced Map */}
        <Card className="flex-1 bg-white shadow-lg border-0 overflow-hidden">
          <CardContent className="p-0 h-full">
            <div className="h-full rounded-lg overflow-hidden border border-gray-200">
              <MapContainer
                center={[23.6102, 85.2799]}
                zoom={7}
                style={{ height: "100%", width: "100%" }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {filteredIssues.map(issue => {
                  const StatusIcon = statusIcons[issue.status];
                  return (
                    <CircleMarker
                      key={issue.id}
                      center={[issue.latitude, issue.longitude]}
                      radius={12}
                      color={priorityColors[issue.priority]}
                      fillColor={priorityColors[issue.priority]}
                      fillOpacity={0.8}
                      weight={2}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <Popup className="custom-popup">
                        <div className="p-3 min-w-[280px]">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 text-base leading-tight">
                              {issue.title}
                            </h3>
                            <Badge className={`${statusColors[issue.status]} text-xs font-medium border`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {issue.status === "inProgress" ? "In Progress" : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium capitalize">{issue.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ward:</span>
                              <span className="font-medium">{issue.ward}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Department:</span>
                              <span className="font-medium capitalize">{issue.department.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Priority:</span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  issue.priority === "high" ? "border-red-300 text-red-700" :
                                  issue.priority === "medium" ? "border-orange-300 text-orange-700" :
                                  "border-green-300 text-green-700"
                                }`}
                              >
                                {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveMapView;
