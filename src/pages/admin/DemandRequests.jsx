import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// ✅ Mock data
const mockDemands = [
  {
    id: 1,
    title: "Road Repair in Ward 1",
    description: "Potholes causing accidents, request urgent repair.",
    ward: "ward1",
    type: "infrastructure",
    status: "pending",
    department: "public_works",
    submittedBy: "Ravi Sharma",
    submittedAt: "2025-09-01",
  },
  {
    id: 2,
    title: "Street Lights Needed",
    description: "Dark streets in Ward 2, request installation of new lights.",
    ward: "ward2",
    type: "services",
    status: "approved",
    department: "utilities",
    submittedBy: "Priya Singh",
    submittedAt: "2025-08-28",
  },
  {
    id: 3,
    title: "Garbage Collection",
    description: "Irregular garbage collection in Ward 3, request better schedule.",
    ward: "ward3",
    type: "maintenance",
    status: "rejected",
    department: "sanitation",
    submittedBy: "Amit Verma",
    submittedAt: "2025-08-25",
  },
];

const DemandRequests = ({ demands = mockDemands }) => {
  const [filters, setFilters] = useState({
    ward: "all",
    type: "all",
    status: "all",
    department: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDemand, setSelectedDemand] = useState(null);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleApprove = (demandId) => {
    console.log(`Approving demand ${demandId}`);
  };

  const handleReject = (demandId) => {
    console.log(`Rejecting demand ${demandId}`);
  };

  const filteredDemands = demands.filter((demand) => {
    return (
      (filters.ward === "all" || demand.ward === filters.ward) &&
      (filters.type === "all" || demand.type === filters.type) &&
      (filters.status === "all" || demand.status === filters.status) &&
      (filters.department === "all" || demand.department === filters.department) &&
      (demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Filters Toolbar */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="🔍 Search demands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <Select onValueChange={(value) => handleFilterChange("ward", value)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Ward" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            <SelectItem value="ward1">Ward 1</SelectItem>
            <SelectItem value="ward2">Ward 2</SelectItem>
            <SelectItem value="ward3">Ward 3</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange("type", value)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="infrastructure">Infrastructure</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
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

      {/* Demand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDemands.map((demand) => (
          <Card key={demand.id} className="hover:shadow-lg transition border rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{demand.title}</CardTitle>
                  <CardDescription>Ward {demand.ward.replace("ward", "")}</CardDescription>
                </div>
                <Badge className={statusColors[demand.status]}>
                  {demand.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {demand.description}
              </p>
              <div className="flex justify-between text-sm mb-1">
                <Badge variant="outline">{demand.type}</Badge>
                <Badge variant="secondary">{demand.department}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Submitted: {new Date(demand.submittedAt).toLocaleDateString()}
              </p>

              {/* View Details Dialog */}
              <div className="flex justify-end mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDemand(demand)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{demand.title}</DialogTitle>
                      <DialogDescription>
                        Submitted by: {demand.submittedBy}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>{demand.description}</p>
                      <div className="flex justify-between text-sm">
                        <span>Ward: {demand.ward}</span>
                        <span>Type: {demand.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Department: {demand.department}</span>
                        <span>Status: {demand.status}</span>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(demand.id)}
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleApprove(demand.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DemandRequests;
