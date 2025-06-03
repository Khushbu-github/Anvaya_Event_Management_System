import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Calendar,
  Users,
  MapPin,
  CalendarDays,
  BookOpen,
  User,
  Award,
  Check,
  X,
  ExternalLink,
  Pencil,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../lib/axiosInstance";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Add custom focus styles for Input and Textarea
const customFocusStyles = `
  .input-focus:focus, .textarea-focus:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const classroomList = ["Room 1", "Room 2", "Room 3", "Room 4"];

type SlotInfo = {
  status: string;
  subject: string | null;
  year?: string | number;
};

type TimetablesType = {
  [room: string]: {
    [slot: string]: SlotInfo;
  };
};

const FacultyDashboard = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");
  const [sessionDetails, setSessionDetails] = useState("");
  

  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [selectedParticipation, setSelectedParticipation] = useState(null);
  const [facevents, setFacevents] = useState([]);
  const [studentParticipations, setStudentParticipations] = useState([]);
  const [loading, setLoading] = useState(false);
  const facultyId = localStorage.getItem("facultyId");
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [classroomSlots, setClassroomSlots] = useState({});
  const allSlots = [
    "09:00-10:00",
    "10:00-11:00",
    "11:15-12:15",
    "12:15-13:15",
    "13:15-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
  ];
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] = useState(false);
const [selectedEventParticipants, setSelectedEventParticipants] = useState([]);
const [selectedEventForParticipants, setSelectedEventForParticipants] = useState(null);
const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [dateMode, setDateMode] = useState("single");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const classrooms = classroomList;
  const [timetables, setTimetables] = useState<TimetablesType>({});
  const [fetchingTimetable, setFetchingTimetable] = useState(false);
  const [timetableError, setTimetableError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (facultyId) {
      fetchEvents();
      fetchStudentParticipations(facultyId);
      axiosInstance
        .get(`/bookings?facultyId=${facultyId}`)
        .then((res) => setMyBookings(res.data))
        .catch(() => setMyBookings([]));
    } else {
      toast({
        title: "Error",
        description: "Faculty ID not found. Please login again.",
      });
      navigate("/login");
    }
  }, [facultyId]);

  useEffect(() => {
    if (selectedDate && selectedClassroom) {
      fetch(
        `/full-timetable/classroom?date=${selectedDate}&classroom=${encodeURIComponent(
          selectedClassroom
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setClassroomSlots(data.slots || {}))
        .catch(() => setClassroomSlots({}));
    } else {
      setClassroomSlots({});
    }
  }, [selectedDate, selectedClassroom]);

  
  const fetchEventParticipants = async (eventId) => {
    setLoadingParticipants(true);
    try {
      const response = await axios.get(
        `http://localhost:5001/api/getparticipants/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      if (response.status === 200) {
        setSelectedEventParticipants(response.data);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      toast({
        title: "Error",
        description: "Failed to fetch participants.frontend eror Please try again.",
      });
      setSelectedEventParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  };
  
  const handleViewParticipants = (event) => {
    setSelectedEventForParticipants(event);
    setIsParticipantsDialogOpen(true);
    fetchEventParticipants(event.id);
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/fac_events`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch events");
      const fetchedEvents = await response.json();
      setFacevents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch events. Please try again.",
      });
    }
  };

  const fetchStudentParticipations = async (facultyId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5001/api/student_events_verify`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (response.status === 200) {
        setStudentParticipations(response.data);
      }
    } catch (error) {
      console.error("Error fetching student participations:", error);
      toast({
        title: "Error",
        description:
          "Failed to fetch student participations. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const capitalizeCategory = (cat) =>
    cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();

  const handleAddEvent = async () => {
    if (!localStorage.getItem("jwt_token")) {
      toast({
        title: "Error",
        description: "Not authenticated. Please login again.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", capitalizeCategory(category));
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("venue", venue);
    formData.append("description", description);
    formData.append("guest_name", guestName);
    formData.append("guest_contact", guestContact);
    formData.append("session_details", sessionDetails);
    
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/fac_add_events`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast({
          title: "Event added",
          description: "Your event has been added successfully.",
        });
        setIsEventDialogOpen(false);
        resetForm();
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to add event:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          "Failed to add event. Please try again.",
      });
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("facultyId");
    navigate("/login?role=faculty");
  };

  const openCertificateDialog = (participation) => {
    setSelectedParticipation(participation);
    setIsCertificateDialogOpen(true);
  };
  const handleVerifyParticipation = async () => {
    if (!selectedParticipation) return;

    try {
      const response = await axios.post(
        `http://localhost:5001/api/verify_participation/${selectedParticipation.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Participation verified",
          description:
            "The student's participation has been verified successfully.",
        });

        setIsCertificateDialogOpen(false);

        // Update the local state to reflect the change
        setStudentParticipations((prevParticipations) =>
          prevParticipations.map((p) =>
            p.id === selectedParticipation.id
              ? { ...p, verification: "Verified" }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to verify participation:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          "Failed to verify participation. Please try again.",
      });
    }
  };

  const handleBookingRequest = async (slot) => {
    if (!selectedClassroom || !selectedDate || !slot) return;
    try {
      await axiosInstance.post("/bookings/request", {
        classroom: selectedClassroom,
        date: selectedDate,
        slot,
        year: null, // or remove if not needed
      });
      toast({
        title: "Booking requested",
        description: "Your booking request has been submitted.",
      });
      // Optionally refresh bookings or classroomSlots
      axiosInstance
        .get(
          `/full-timetable/classroom?date=${selectedDate}&classroom=${encodeURIComponent(
            selectedClassroom
          )}`
        )
        .then((res) => setClassroomSlots(res.data.slots || {}));
    } catch {
      toast({ title: "Error", description: "Failed to request booking." });
    }
  };

  const handleFetchTimetable = async () => {
    setFetchingTimetable(true);
    setTimetableError("");
    setTimetables({});
    try {
      const date = dateMode === "single" ? selectedDate : rangeStart; // Only single date supported for this UI
      if (!date) {
        setTimetableError("Please select a date.");
        setFetchingTimetable(false);
        return;
      }
      const results = await Promise.all(
        classroomList.map(async (room) => {
          const url = `/api/classroom-timetable?classroom=${encodeURIComponent(
            room
          )}&date=${date}`;
          const res = await axiosInstance.get(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          });
          return { room, timetable: res.data.timetable[date] };
        })
      );
      const newTimetables = {};
      results.forEach(({ room, timetable }) => {
        newTimetables[room] = timetable;
      });
      setTimetables(newTimetables);
    } catch (err) {
      setTimetableError("Failed to fetch timetable.");
    } finally {
      setFetchingTimetable(false);
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", capitalizeCategory(category));
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("venue", venue);
    formData.append("description", description);
    formData.append("guest_name", guestName);
    formData.append("guest_contact", guestContact);
    formData.append("session_details", sessionDetails);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:5001/api/edit_events/${editingEvent.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Event updated",
          description: "Your event has been updated successfully.",
        });
        setIsEditDialogOpen(false);
        resetForm();
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to update event:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          "Failed to update event. Please try again.",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setVenue("");
    setDescription("");
    setGuestName("");
    setGuestContact("");
    setSessionDetails("");
    setSelectedImage(null);
    setEditingEvent(null);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setCategory(event.category.toLowerCase());
    setStartDate(event.start_date.split("T")[0]);
    setEndDate(event.end_date.split("T")[0]);
    setVenue(event.venue);
    setDescription(event.description);
    setGuestName(event.guest_name || "");
    setGuestContact(event.guest_contact || "");
    setSessionDetails(event.session_details || "");
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
              <p className="text-gray-500">
                Manage your events and student participations
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline" className="mr-2">
                <RouterLink to="/">Home</RouterLink>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="mr-2">
                    Events
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <RouterLink to="/events/cultural">
                      Cultural Events
                    </RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <RouterLink to="/events/technical">
                      Technical Events
                    </RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <RouterLink to="/events/sports">Sports Events</RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <RouterLink to="/events/workshops">Workshops</RouterLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="destructive" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>

          <Tabs defaultValue="myEvents" className="w-full">
            <TabsList className="grid w-full md:w-[600px] grid-cols-3">
              <TabsTrigger value="myEvents">Manage Events</TabsTrigger>
              <TabsTrigger value="participations">
                Student Participations
              </TabsTrigger>
              <TabsTrigger value="venue">Venue Booking</TabsTrigger>
            </TabsList>

            <TabsContent value="myEvents">
              <div className="flex justify-between items-center mt-6 mb-4">
                <h2 className="text-xl font-bold">My Events</h2>

                <Dialog
                  open={isEventDialogOpen}
                  onOpenChange={setIsEventDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <PlusCircle size={16} />
                      <span>Add Event</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                      <DialogTitle>Add New Event</DialogTitle>
                      <DialogDescription>
                        Enter the details of the event you're coordinating
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-8 max-h-[60vh] overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="event-title">Event Title</Label>
                          <Input
                            id="event-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter event title"
                            className="input-focus"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="event-category">Category</Label>
                          <Select
                            value={category}
                            onValueChange={(val) => setCategory(val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cultural">Cultural</SelectItem>
                              <SelectItem value="technical">
                                Technical
                              </SelectItem>
                              <SelectItem value="sports">Sports</SelectItem>
                              <SelectItem value="workshops">
                                Workshops
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input-focus"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="end-date">End Date</Label>
                          <Input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input-focus"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="venue">Venue</Label>
                        <Input
                          id="venue"
                          placeholder="Enter venue"
                          value={venue}
                          onChange={(e) => setVenue(e.target.value)}
                          className="input-focus"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter event description"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="textarea-focus"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="guest-name">Guest/Speaker Name</Label>
                          <Input
                            id="guest-name"
                            placeholder="Enter name if applicable"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="input-focus"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guest-contact">
                            Guest/Speaker Contact
                          </Label>
                          <Input
                            id="guest-contact"
                            placeholder="Enter contact details"
                            value={guestContact}
                            onChange={(e) => setGuestContact(e.target.value)}
                            className="input-focus"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="session-details">Session Details</Label>
                        <Textarea
                          id="session-details"
                          placeholder="Enter session details, schedule, etc."
                          rows={3}
                          value={sessionDetails}
                          onChange={(e) => setSessionDetails(e.target.value)}
                          className="textarea-focus"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-image">Event Image</Label>
                        <Input
                          id="event-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedImage(e.target.files[0])}
                          className="input-focus"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEventDialogOpen(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddEvent}>Add Event</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facevents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{event.venue}</p>
                    <p className="text-sm text-gray-600 mb-4">
                      {new Date(event.start_date).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-purple-600">
                        {event.category}
                      </span>
                      <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleViewParticipants(event)}
        className="flex items-center space-x-1"
      >
        <Users size={14} />
        <span>{event.participants || 0}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEditClick(event)}
        className="flex items-center space-x-1"
      >
                        <Pencil size={14} />
                        <span>Edit</span>
                      </Button>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="participations">
              <Card className="mt-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>Student Participations</CardTitle>
                  <CardDescription>
                    Verify and manage student participation records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600"></div>
                    </div>
                  ) : studentParticipations.length > 0 ? (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-4 p-4 font-medium bg-gray-50 border-b">
                        <div className="col-span-3">Student</div>
                        <div className="col-span-4">Achievement</div>
                        <div className="col-span-3">Placement</div>
                        <div className="col-span-2">Status</div>
                      </div>

                      {studentParticipations.map((participation) => (
                        <div
                          key={participation.id}
                          className="grid grid-cols-12 gap-4 p-4 items-center border-b last:border-b-0"
                        >
                          <div className="col-span-3 flex items-center gap-2">
                            <User size={18} className="text-gray-500" />
                            <span>{participation.name}</span>
                          </div>
                          <div className="col-span-4">
                            {participation.title}
                          </div>
                          <div className="col-span-3">
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 w-fit"
                            >
                              <Award size={14} />{" "}
                              {participation.placement || "Participation"}
                            </Badge>
                          </div>
                          <div className="col-span-2 flex gap-2">
                            {participation.verification === "Verified" ? (
                              <Badge
                                variant="secondary"
                                className="w-fit flex items-center gap-1"
                              >
                                <Check size={14} /> Verified
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() =>
                                  openCertificateDialog(participation)
                                }
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Award size={14} /> Verify
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-md">
                      <User size={36} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        No Participations Found
                      </h3>
                      <p className="text-gray-500">
                        There are currently no student participations to verify
                        for your events.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Dialog
                open={isCertificateDialogOpen}
                onOpenChange={setIsCertificateDialogOpen}
              >
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>Verify Student Achievement</DialogTitle>
                    <DialogDescription>
                      Review the certificate and confirm the student's
                      achievement
                    </DialogDescription>
                  </DialogHeader>

                  {selectedParticipation && (
                    <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium">Student Name:</Label>
                          <p>{selectedParticipation.name}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Achievement:</Label>
                          <p>{selectedParticipation.title}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="font-medium">Placement:</Label>
                        <p>
                          {selectedParticipation.placement || "Participation"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-medium">Certificate:</Label>
                        <div className="border rounded-md p-2">
                          {selectedParticipation.certificate.match(
                            /\.(jpeg|jpg|png|gif)$/i
                          ) ? (
                            <img
                              src={selectedParticipation.certificate}
                              alt="Achievement Certificate"
                              className="w-full object-contain max-h-96"
                              onError={() => {
                                toast({
                                  title: "Error loading certificate",
                                  description:
                                    "Could not load the certificate image.",
                                  variant: "destructive",
                                });
                              }}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <a
                                href={selectedParticipation.certificate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Certificate
                              </a>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  window.open(
                                    selectedParticipation.certificate,
                                    "_blank"
                                  )
                                }
                              >
                                <ExternalLink size={16} />
                              </Button>
                            </div>
                          )}
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
                      Cancel
                    </Button>
                    <Button onClick={handleVerifyParticipation}>
                      <Check size={16} className="mr-2" />
                      Verify Achievement
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="venue">
              <Card className="mt-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>Venue Booking System</CardTitle>
                  <CardDescription>
                    Check venue availability and manage bookings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div>
                      <Label>Date Mode</Label>
                      <Select value={dateMode} onValueChange={setDateMode}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single Date</SelectItem>
                          <SelectItem value="range">Date Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {dateMode === "single" ? (
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={rangeStart}
                            onChange={(e) => setRangeStart(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={rangeEnd}
                            onChange={(e) => setRangeEnd(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <Label>Classroom</Label>
                      <Select
                        value={selectedClassroom}
                        onValueChange={(val) => setSelectedClassroom(val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select classroom" />
                        </SelectTrigger>
                        <SelectContent>
                          {classrooms.map((roomName) => (
                            <SelectItem key={roomName} value={roomName}>
                              {roomName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-6 mt-6">
                    <Button
                      onClick={handleFetchTimetable}
                      disabled={fetchingTimetable || !selectedDate}
                      className="mb-4"
                    >
                      {fetchingTimetable ? "Fetching..." : "Fetch Timetable"}
                    </Button>
                    <div className="overflow-x-auto">
                      {selectedClassroom && timetables[selectedClassroom] && (
                        <div className="bg-white rounded shadow p-4 min-w-[320px]">
                          <h3 className="text-lg font-semibold mb-2 text-center">
                            {selectedClassroom}
                          </h3>
                          {timetableError && (
                            <div className="text-red-500 mb-2">
                              {timetableError}
                            </div>
                          )}
                          <table className="min-w-full text-sm border">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-2 py-1 border">Time Slot</th>
                                <th className="px-2 py-1 border">Status</th>
                                <th className="px-2 py-1 border">Year</th>
                                <th className="px-2 py-1 border">Booking</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(
                                timetables[selectedClassroom] || {}
                              ).map(([slot, infoRaw]) => {
                                const info = infoRaw as SlotInfo;
                                return (
                                  <tr key={slot}>
                                    <td className="px-2 py-1 border">{slot}</td>
                                    <td className="px-2 py-1 border">
                                      {info.status === "Available" ? (
                                        <span className="text-green-700">
                                          Available
                                        </span>
                                      ) : info.status === "Lunch Break" ? (
                                        <span className="text-yellow-700">
                                          Lunch Break
                                        </span>
                                      ) : (
                                        <span className="text-blue-700">
                                          {info.subject}
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-2 py-1 border">
                                      {info.year ? `${info.year} year` : "-"}
                                    </td>
                                    <td className="px-2 py-1 border">
                                      {info.status === "Available" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleBookingRequest(slot)
                                          }
                                        >
                                          Book
                                        </Button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">
                      My Booking Requests
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr>
                            <th className="px-2 py-1">Classroom</th>
                            <th className="px-2 py-1">Date</th>
                            <th className="px-2 py-1">Slot</th>
                            <th className="px-2 py-1">Year</th>
                            <th className="px-2 py-1">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myBookings.length > 0 ? (
                            myBookings.map((b) => (
                              <tr key={b._id}>
                                <td className="px-2 py-1">{b.classroom}</td>
                                <td className="px-2 py-1">{b.date}</td>
                                <td className="px-2 py-1">{b.slot}</td>
                                <td className="px-2 py-1">{b.year}</td>
                                <td className="px-2 py-1">
                                  <span
                                    className={`px-2 py-1 rounded text-xs ${
                                      b.status === "approved"
                                        ? "bg-green-200 text-green-800"
                                        : b.status === "pending"
                                        ? "bg-yellow-200 text-yellow-800"
                                        : "bg-red-200 text-red-800"
                                    }`}
                                  >
                                    {b.status.charAt(0).toUpperCase() +
                                      b.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="text-center py-4 text-gray-500"
                              >
                                No booking requests found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the details of your event
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-event-title">Event Title</Label>
              <Input
                id="edit-event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-event-category">Category</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="workshops">Workshops</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-event-start-date">Start Date</Label>
              <Input
                id="edit-event-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-event-end-date">End Date</Label>
              <Input
                id="edit-event-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-event-venue">Venue</Label>
              <Input
                id="edit-event-venue"
                placeholder="Enter venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-event-description">Description</Label>
              <Textarea
                id="edit-event-description"
                placeholder="Enter event description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-event-guest-name">Guest/Speaker Name</Label>
              <Input
                id="edit-event-guest-name"
                placeholder="Enter name if applicable"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-event-guest-contact">
                Guest/Speaker Contact
              </Label>
              <Input
                id="edit-event-guest-contact"
                placeholder="Enter contact details"
                value={guestContact}
                onChange={(e) => setGuestContact(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-event-session-details">
                Session Details
              </Label>
              <Textarea
                id="edit-event-session-details"
                placeholder="Enter session details, schedule, etc."
                rows={3}
                value={sessionDetails}
                onChange={(e) => setSessionDetails(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-event-image">Event Image</Label>
              <Input
                id="edit-event-image"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              {editingEvent?.image && !selectedImage && (
                <p className="text-sm text-gray-500">
                  Current image: {editingEvent.image}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditEvent}>Update Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


{/* Participants Dialog */}
<Dialog open={isParticipantsDialogOpen} onOpenChange={setIsParticipantsDialogOpen}>
  <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
    <DialogHeader>
      <DialogTitle>Event Participants</DialogTitle>
      <DialogDescription>
        {selectedEventForParticipants?.title} - Registered Participants
      </DialogDescription>
    </DialogHeader>

    <div className="py-4 max-h-[60vh] overflow-y-auto">
      {loadingParticipants ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600"></div>
        </div>
      ) : selectedEventParticipants.length > 0 ? (
        <div className="rounded-md border">
          <div className="grid grid-cols-12 gap-2 p-3 font-medium bg-gray-50 border-b text-sm">
            <div className="col-span-2">Name</div>
            <div className="col-span-2">Email</div>
            <div className="col-span-1">Phone</div>
            <div className="col-span-1">Sem</div>
            <div className="col-span-2">College</div>
            <div className="col-span-2">Team Name</div>
            <div className="col-span-2">Registration Date</div>
          </div>

          {selectedEventParticipants.map((participant, index) => (
            <div
              key={participant.id || index}
              className="grid grid-cols-12 gap-2 p-3 items-center border-b last:border-b-0 text-sm"
            >
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span className="truncate">{participant.name}</span>
                </div>
              </div>
              <div className="col-span-2">
                <span className="truncate text-gray-600">{participant.email}</span>
              </div>
              <div className="col-span-1">
                <span className="text-gray-600">{participant.phone}</span>
              </div>
              <div className="col-span-1">
                <Badge variant="outline" className="w-fit">
                  {participant.sem}
                </Badge>
              </div>
              <div className="col-span-2">
                <span className="truncate text-gray-600">{participant.college}</span>
              </div>
              <div className="col-span-2">
                <span className="truncate text-gray-600">
                  {participant.team_name || 'Individual'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">
                  {new Date(participant.registration_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <Users size={36} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Participants Found
          </h3>
          <p className="text-gray-500">
            No one has registered for this event yet.
          </p>
        </div>
      )}
    </div>

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setIsParticipantsDialogOpen(false)}
      >
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default FacultyDashboard;