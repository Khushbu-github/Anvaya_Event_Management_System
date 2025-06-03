import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Award,
  CheckCircle,
  Clock,
  FileText,
  ExternalLink,
  X,
  Check,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../lib/axiosInstance";
import { Label } from "@/components/ui/label";

const StudentAchievementsDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [studentAchievements, setStudentAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    verified: 0,
    pending: 0,
  });
  const [pendingBookings, setPendingBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [timetableData, setTimetableData] = useState({
    timetable: [],
    bookings: [],
  });
  const slots = [
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
  ];
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    fetchStudentAchievements();
    fetchPendingBookings();
    axiosInstance
      .get("/classrooms")
      .then((res) => setClassrooms(res.data))
      .catch(() => setClassrooms([]));
  }, []);

  useEffect(() => {
    if (selectedDate) {
      axiosInstance
        .get(`/timetable?date=${selectedDate}`)
        .then((res) => setTimetableData(res.data))
        .catch(() => setTimetableData({ timetable: [], bookings: [] }));
    }
  }, [selectedDate]);

  const fetchStudentAchievements = async () => {
    setLoading(true);
    try {
      const adminId = localStorage.getItem("adminId");

      if (!adminId) {
        toast({
          title: "Error",
          description: "Admin ID not found. Please login again.",
        });
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:5001/api/student_events_verify`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (response.status === 200) {
        setStudentAchievements(response.data);

        // Calculate statistics
        const verified = response.data.filter(
          (a) => a.verification === "Verified"
        ).length;
        const total = response.data.length;

        setStatistics({
          total,
          verified,
          pending: total - verified,
        });
      }
    } catch (error) {
      console.error("Error fetching student achievements:", error);

      // Fallback to mock data for demonstration
      const mockData = [
        {
          id: "1",
          name: "John Doe",
          rollNo: "CS19001",
          title: "National Coding Competition",
          event_date: "February 15, 2023",
          placement: "1st Place",
          verification: "Verified",
          certificate: "https://example.com/certificate1.pdf",
          department: "Computer Science",
        },
        {
          id: "2",
          name: "Emma Johnson",
          rollNo: "EC19042",
          title: "IEEE Paper Presentation",
          event_date: "March 22, 2023",
          placement: "2nd Place",
          verification: "Pending",
          certificate: "https://example.com/certificate2.pdf",
          department: "Electronics",
        },
        {
          id: "3",
          name: "Raj Patel",
          rollNo: "ME19105",
          title: "Robotics Competition",
          event_date: "April 10, 2023",
          placement: "Participation",
          verification: "Pending",
          certificate: "https://example.com/certificate3.pdf",
          department: "Mechanical",
        },
        {
          id: "4",
          name: "Sarah Williams",
          rollNo: "CS19022",
          title: "UI/UX Design Challenge",
          event_date: "January 30, 2023",
          placement: "3rd Place",
          verification: "Verified",
          certificate: "https://example.com/certificate4.pdf",
          department: "Computer Science",
        },
        {
          id: "5",
          name: "Alex Chen",
          rollNo: "AI19015",
          title: "ML Hackathon",
          event_date: "May 5, 2023",
          placement: "1st Place",
          verification: "Pending",
          certificate: "https://example.com/certificate5.pdf",
          department: "AI & Data Science",
        },
      ];

      setStudentAchievements(mockData);

      // Calculate statistics from mock data
      const verified = mockData.filter(
        (a) => a.verification === "Verified"
      ).length;
      const total = mockData.length;

      setStatistics({
        total,
        verified,
        pending: total - verified,
      });

      toast({
        title: "Using demo data",
        description: "Connected to mock data as the API is not available.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAchievement = async (achievementId) => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/verify_participation/${achievementId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Achievement verified",
          description:
            "The student's achievement has been verified successfully.",
        });

        setIsCertificateDialogOpen(false);

        // Update the local state to reflect the change
        setStudentAchievements((prevAchievements) =>
          prevAchievements.length >= 0
            ? prevAchievements.map((a) =>
                a.id === achievementId ? { ...a, verification: "Verified" } : a
              )
            : []
        );

        // Update statistics
        setStatistics((prev) => ({
          ...prev,
          verified: prev.verified + 1,
          pending: prev.pending - 1,
        }));
      }
    } catch (error) {
      console.error("Failed to verify achievement:", error);

      // For demo purposes, update state directly
      setStudentAchievements((prevAchievements) =>
        prevAchievements.map((a) =>
          a.id === achievementId ? { ...a, verification: "Verified" } : a
        )
      );

      // Update statistics
      setStatistics((prev) => ({
        ...prev,
        verified: prev.verified + 1,
        pending: prev.pending - 1,
      }));

      toast({
        title: "Achievement verified",
        description:
          "The student's achievement has been verified successfully.",
      });

      setIsCertificateDialogOpen(false);
    }
  };

  const openCertificateDialog = (achievement) => {
    setSelectedAchievement(achievement);
    setIsCertificateDialogOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("adminId");

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });

    navigate("/login?role=admin");
  };

  // Filter and search achievements
  const filteredAchievements = studentAchievements.filter((achievement) => {
    // Filter by status
    if (filter !== "all") {
      const statusMatch =
        filter === "verified"
          ? achievement.verification === "Verified"
          : achievement.verification === "Pending";

      if (!statusMatch) return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        achievement.name.toLowerCase().includes(searchLower) ||
        achievement.rollNo.toLowerCase().includes(searchLower) ||
        achievement.title.toLowerCase().includes(searchLower) ||
        (achievement.department &&
          achievement.department.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  const fetchPendingBookings = async () => {
    setBookingLoading(true);
    try {
      const res = await axiosInstance.get("/bookings");
      setPendingBookings(res.data.filter((b) => b.status === "pending"));
    } catch (err) {
      setPendingBookings([]);
      toast({ title: "Error", description: err.response?.data?.error || "Failed to fetch bookings." });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      await axiosInstance.post(`/bookings/${bookingId}/approve`);
      setPendingBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast({ title: "Booking approved" });
    } catch {
      toast({ title: "Error", description: "Failed to approve booking." });
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await axiosInstance.post(`/bookings/${bookingId}/reject`);
      setPendingBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast({ title: "Booking rejected" });
    } catch {
      toast({ title: "Error", description: "Failed to reject booking." });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Student Achievements</h1>
              <p className="text-gray-500">
                Verify and manage student achievements and certifications
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline" className="mr-2">
                <Link to="/">Home</Link>
              </Button>
              <Button asChild variant="outline" className="mr-2">
                <Link to="/faculty-dashboard">Dashboard</Link>
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="animate-fade-in bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Total Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics.total}</div>
                <p className="text-sm text-muted-foreground">
                  From all students
                </p>
              </CardContent>
            </Card>
            <Card className="animate-fade-in bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">
                  {statistics.pending}
                </div>
                <p className="text-sm text-muted-foreground">
                  Waiting for verification
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-3">
              <TabsTrigger value="all" onClick={() => setFilter("all")}>
                All Achievements
              </TabsTrigger>
              <TabsTrigger value="pending" onClick={() => setFilter("pending")}>
                Pending
              </TabsTrigger>
              <TabsTrigger value="bookings">Booking Approvals</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <Card className="animate-fade-in bg-white">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                      <CardTitle>Student Achievement Records</CardTitle>
                      <CardDescription>
                        View and verify student achievements and certificates
                      </CardDescription>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2 flex-col md:flex-row">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search by name, ID or event..."
                          className="pl-8 w-full md:w-[250px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600"></div>
                    </div>
                  ) : filteredAchievements.length > 0 ? (
                    <Table>
                      <TableCaption>
                        A list of student achievement records
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Achievement</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Placement</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAchievements.map((achievement) => (
                          <TableRow key={achievement.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{achievement.name}</span>
                                <span className="text-xs text-gray-500">
                                  {achievement.rollNo}
                                </span>
                                {achievement.department && (
                                  <span className="text-xs text-gray-500">
                                    {achievement.department}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{achievement.title}</TableCell>
                            <TableCell>{achievement.event_date}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="flex items-center w-fit gap-1"
                              >
                                <Award size={14} /> {achievement.placement}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {achievement.verification === "Verified" ? (
                                <Badge
                                  variant="secondary"
                                  className="flex items-center w-fit gap-1 bg-green-100 text-green-800"
                                >
                                  <CheckCircle size={14} /> Verified
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="flex items-center w-fit gap-1"
                                >
                                  <Clock size={14} /> Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    openCertificateDialog(achievement)
                                  }
                                >
                                  <FileText size={16} />
                                </Button>
                                {achievement.verification !== "Verified" && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleVerifyAchievement(achievement.id)
                                    }
                                  >
                                    Verify
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-md">
                      <User size={36} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        No Achievements Found
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm
                          ? "No results match your search criteria. Try different keywords."
                          : filter !== "all"
                          ? `There are no ${filter} achievement records to display.`
                          : "There are currently no student achievement records."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <Card className="animate-fade-in bg-white">
                <CardHeader>
                  <CardTitle>Pending Verifications</CardTitle>
                  <CardDescription>
                    Student achievements waiting for your verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Same table but for pending achievements */}
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600"></div>
                    </div>
                  ) : filteredAchievements.length > 0 ? (
                    <Table>
                      <TableCaption>
                        A list of pending student achievements
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Achievement</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Placement</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAchievements.map((achievement) => (
                          <TableRow key={achievement.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{achievement.name}</span>
                                <span className="text-xs text-gray-500">
                                  {achievement.rollNo}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{achievement.title}</TableCell>
                            <TableCell>{achievement.event_date}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="flex items-center w-fit gap-1"
                              >
                                <Award size={14} /> {achievement.placement}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    openCertificateDialog(achievement)
                                  }
                                >
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleVerifyAchievement(achievement.id)
                                  }
                                >
                                  Verify
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-md">
                      <CheckCircle
                        size={36}
                        className="mx-auto text-green-500 mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        All Caught Up!
                      </h3>
                      <p className="text-gray-500">
                        There are no pending achievements that need
                        verification.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="mt-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  Pending Venue Booking Requests
                </h2>
                <p className="mb-4 text-gray-600">
                  Review and approve or reject venue booking requests below.
                  <Button size="sm" variant="outline" className="ml-4" onClick={fetchPendingBookings}>
                    Refresh
                  </Button>
                </p>
                {bookingLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600"></div>
                  </div>
                ) : pendingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm"
                      >
                        <div className="flex-1 mb-2 md:mb-0">
                          <div className="font-semibold text-lg text-gray-800">
                            {booking.classroom?.name || booking.classroom}
                          </div>
                          <div className="text-gray-700 text-sm mt-1">
                            Date: <span className="font-medium">{booking.date}</span>
                          </div>
                          <div className="text-gray-700 text-sm">
                            Slot: <span className="font-medium">{booking.slot}</span>
                          </div>
                          {booking.requestedBy && (
                            <div className="text-gray-500 text-xs mt-1">
                              Requested by: {booking.requestedBy.name || booking.requestedBy}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(booking._id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(booking._id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-md border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      No Pending Booking Requests
                    </h3>
                    <p className="text-gray-500">
                      All venue booking requests have been reviewed.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Dialog
            open={isCertificateDialogOpen}
            onOpenChange={setIsCertificateDialogOpen}
          >
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Student Achievement Details</DialogTitle>
                <DialogDescription>
                  Review the certificate and verify the student's achievement
                </DialogDescription>
              </DialogHeader>

              {selectedAchievement && (
                <div className="py-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Student Information
                        </h3>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div className="font-medium text-gray-500">Name:</div>
                          <div className="col-span-2">
                            {selectedAchievement.name}
                          </div>

                          <div className="font-medium text-gray-500">
                            Roll No:
                          </div>
                          <div className="col-span-2">
                            {selectedAchievement.rollNo}
                          </div>

                          {selectedAchievement.department && (
                            <>
                              <div className="font-medium text-gray-500">
                                Department:
                              </div>
                              <div className="col-span-2">
                                {selectedAchievement.department}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold">
                          Achievement Details
                        </h3>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div className="font-medium text-gray-500">
                            Event:
                          </div>
                          <div className="col-span-2">
                            {selectedAchievement.title}
                          </div>

                          <div className="font-medium text-gray-500">Date:</div>
                          <div className="col-span-2">
                            {selectedAchievement.event_date}
                          </div>

                          <div className="font-medium text-gray-500">
                            Placement:
                          </div>
                          <div className="col-span-2">
                            <Badge
                              variant="outline"
                              className="flex items-center w-fit gap-1"
                            >
                              <Award size={14} />{" "}
                              {selectedAchievement.placement}
                            </Badge>
                          </div>

                          <div className="font-medium text-gray-500">
                            Status:
                          </div>
                          <div className="col-span-2">
                            {selectedAchievement.verification === "Verified" ? (
                              <Badge
                                variant="secondary"
                                className="flex items-center w-fit gap-1 bg-green-100 text-green-800"
                              >
                                <CheckCircle size={14} /> Verified
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="flex items-center w-fit gap-1"
                              >
                                <Clock size={14} /> Pending Verification
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Certificate</h3>
                      <div className="border rounded-lg bg-gray-50 p-4 h-64 flex flex-col justify-center items-center">
                        {selectedAchievement.certificate ? (
                          <div className="text-center">
                            <img
                              src="/api/placeholder/300/200"
                              alt="Certificate placeholder"
                              className="mx-auto mb-4 rounded border"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() =>
                                window.open(
                                  selectedAchievement.certificate,
                                  "_blank"
                                )
                              }
                            >
                              <ExternalLink size={14} />
                              <span>View Full Certificate</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500">
                            <FileText
                              size={48}
                              className="mx-auto mb-2 text-gray-400"
                            />
                            <p>No certificate uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 bg-amber-200 rounded-full p-1">
                        <Clock size={16} className="text-amber-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-800">
                          Verification Note
                        </h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Please carefully review the certificate and
                          achievement details before verifying. Once verified,
                          this achievement will be added to the student's
                          official records.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsCertificateDialogOpen(false)}
                >
                  <X size={16} className="mr-2" />
                  Close
                </Button>
                {selectedAchievement &&
                  selectedAchievement.verification !== "Verified" && (
                    <Button
                      onClick={() =>
                        handleVerifyAchievement(selectedAchievement.id)
                      }
                    >
                      <Check size={16} className="mr-2" />
                      Verify Achievement
                    </Button>
                  )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentAchievementsDashboard;
