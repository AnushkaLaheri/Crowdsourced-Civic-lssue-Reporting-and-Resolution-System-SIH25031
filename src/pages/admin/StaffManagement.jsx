import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  TrendingUp,
  Search,
  Filter,
  Star,
  Activity,
  Award
} from "lucide-react";

// ✅ Mock Staff Data
const mockStaff = [
  {
    id: "s1",
    name: "Ravi Kumar",
    department: "sanitation",
    assignedTasks: 15,
    completedTasks: 10,
    performanceRating: 4,
  },
  {
    id: "s2",
    name: "Sita Devi",
    department: "public_works",
    assignedTasks: 20,
    completedTasks: 18,
    performanceRating: 5,
  },
  {
    id: "s3",
    name: "Amit Sharma",
    department: "utilities",
    assignedTasks: 12,
    completedTasks: 6,
    performanceRating: 3,
  },
  {
    id: "s4",
    name: "Priya Singh",
    department: "sanitation",
    assignedTasks: 8,
    completedTasks: 2,
    performanceRating: 2,
  },
];

const StaffManagement = ({ staff = mockStaff }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Workload percentage calculation
  const getWorkloadPercentage = (assigned, completed) => {
    if (assigned === 0) return 0;
    return Math.round((completed / assigned) * 100);
  };

  // Workload status color/label
  const getWorkloadStatus = (workload) => {
    if (workload < 30) return { label: "Low", color: "bg-green-100 text-green-700" };
    if (workload < 70) return { label: "Medium", color: "bg-yellow-100 text-yellow-700" };
    return { label: "High", color: "bg-red-100 text-red-700" };
  };

  const filteredStaff = staff.filter((member) => {
    return (
      (departmentFilter === "all" || member.department === departmentFilter) &&
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="w-full h-[calc(100vh-2rem)] bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Staff Management</h1>
              <p className="text-sm text-gray-500">Manage staff performance and workload</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Live Updates
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 p-6">
        {/* Sidebar with Key Metrics */}
        <div className="w-80 space-y-4">
          {/* Total Staff */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-blue-600" />
                Total Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staff.length}</div>
              <div className="text-sm text-gray-500">active members</div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {filteredStaff.length} filtered
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Average Performance */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-4 w-4 text-yellow-600" />
                Avg Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {(staff.reduce((acc, member) => acc + member.performanceRating, 0) / staff.length).toFixed(1)}/5
              </div>
              <div className="text-sm text-gray-500">overall rating</div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Good performance
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* High Workload */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-red-600" />
                High Workload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {staff.filter(member => {
                  const workload = getWorkloadPercentage(member.assignedTasks, member.completedTasks);
                  return workload >= 70;
                }).length}
              </div>
              <div className="text-sm text-gray-500">staff members</div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                  Needs attention
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Filters Toolbar */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                Filters & Search
              </CardTitle>
              <CardDescription>Filter staff by department and search by name</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Select onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="public_works">Public Works</SelectItem>
                    <SelectItem value="sanitation">Sanitation</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Staff Table */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Staff Overview
              </CardTitle>
              <CardDescription>Monitor staff performance and workload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Assigned Tasks</TableHead>
                      <TableHead>Completed Tasks</TableHead>
                      <TableHead>Workload</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((member) => {
                      const workloadPercentage = getWorkloadPercentage(
                        member.assignedTasks,
                        member.completedTasks
                      );
                      const status = getWorkloadStatus(workloadPercentage);

                      return (
                        <TableRow key={member.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserCheck className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {member.department.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{member.assignedTasks}</TableCell>
                          <TableCell className="font-medium">{member.completedTasks}</TableCell>
                          <TableCell className="w-[200px]">
                            <div className="space-y-1">
                              <Progress value={workloadPercentage} className="h-2" />
                              <div className="text-xs text-gray-500 text-center">
                                {workloadPercentage}% complete
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color} variant="outline">
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.performanceRating}/5</span>
                              <div className="flex">
                                {[...Array(5)].map((_, index) => (
                                  <Star
                                    key={index}
                                    className={`w-4 h-4 ${
                                      index < member.performanceRating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
