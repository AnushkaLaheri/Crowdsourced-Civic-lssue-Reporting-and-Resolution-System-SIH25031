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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Filter,
  Plus,
  Search,
  UserCheck
} from "lucide-react";

// ✅ Mock Data
const mockIssues = [
  {
    id: 1,
    title: "Broken Streetlight",
    description: "Streetlight not working in Ward 1, near park.",
    type: "utilities",
    status: "pending",
    priority: "high",
    department: "utilities",
    assignedTo: null,
  },
  {
    id: 2,
    title: "Garbage Overflow",
    description: "Dustbins overflowing in market area.",
    type: "sanitation",
    status: "inProgress",
    priority: "medium",
    department: "sanitation",
    assignedTo: "Ravi Kumar",
  },
  {
    id: 3,
    title: "Potholes on Road",
    description: "Large potholes causing traffic jams.",
    type: "infrastructure",
    status: "resolved",
    priority: "high",
    department: "public_works",
    assignedTo: "Sita Devi",
  },
];

const mockStaff = [
  { id: "s1", name: "Ravi Kumar", department: "sanitation" },
  { id: "s2", name: "Sita Devi", department: "public_works" },
  { id: "s3", name: "Amit Sharma", department: "utilities" },
];

const IssueManagement = ({ issues = mockIssues, staff = mockStaff }) => {
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    department: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleAssign = (issueId, staffId) => {
    const staffMember = staff.find((s) => s.id === staffId);
    console.log(`✅ Assigning issue ${issueId} to ${staffMember?.name}`);
  };

  const handleAutoAssign = (issueId) => {
    console.log(`⚡ Auto-assigning issue ${issueId}`);
  };

  const filteredIssues = issues.filter((issue) => {
    return (
      (filters.type === "all" || issue.type === filters.type) &&
      (filters.status === "all" || issue.status === filters.status) &&
      (filters.department === "all" || issue.department === filters.department) &&
      (issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // UI color mappings
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    inProgress: "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-orange-100 text-orange-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div className="w-full h-[calc(100vh-2rem)] bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Issue Management</h1>
              <p className="text-sm text-gray-500">Manage and track civic issues and assignments</p>
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
          {/* Total Issues */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Total Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{issues.length}</div>
              <div className="text-sm text-gray-500">active issues</div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {filteredIssues.length} filtered
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pending Issues */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-yellow-600" />
                Pending Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {issues.filter(i => i.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">awaiting assignment</div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                  Needs attention
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* High Priority */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {issues.filter(i => i.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-500">urgent issues</div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                  Critical
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
              <CardDescription>Filter issues by type, status, and department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Select onValueChange={(value) => handleFilterChange("type", value)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="sanitation">Sanitation</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleFilterChange("department", value)}>
                  <SelectTrigger className="w-[160px]">
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

          {/* Issues Table */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Issues Overview
              </CardTitle>
              <CardDescription>Manage and track all civic issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues.map((issue) => (
                      <TableRow key={issue.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">#{issue.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{issue.title}</p>
                            <p className="text-sm text-gray-500">{issue.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{issue.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[issue.status]}>
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[issue.priority]} variant="outline">
                            {issue.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{issue.department.replace('_', ' ')}</TableCell>
                        <TableCell>
                          {issue.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-green-600" />
                              <span>{issue.assignedTo}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedIssue(issue)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Assign
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Assign Issue: {selectedIssue?.title}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Select
                                  onValueChange={(staffId) =>
                                    handleAssign(selectedIssue?.id, staffId)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Staff Member" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {staff.map((member) => (
                                      <SelectItem key={member.id} value={member.id}>
                                        {member.name} - {member.department}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="secondary"
                                  onClick={() => handleAutoAssign(selectedIssue?.id)}
                                  className="w-full"
                                >
                                  ⚡ Auto Assign
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
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

export default IssueManagement;
