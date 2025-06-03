import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Award, MapPin, CalendarDays, Clock, CheckCircle, Link, ExternalLink, Upload, GraduationCap, Trophy, Cpu, Gamepad2, BookOpen } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axiosInstance';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudentDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [placement, setPlacement] = useState('');
  const [semester, setSemester] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [certificateFile, setCertificateFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const studentId = localStorage.getItem("studentId");
  const [allEvents, setAllEvents] = useState([]);
  const [loadingAllEvents, setLoadingAllEvents] = useState(true);
  const [eventError, setEventError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);

  // Semester options for dropdown
  const semesterOptions = [
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Semester 3' },
    { value: '4', label: 'Semester 4' },
    { value: '5', label: 'Semester 5' },
    { value: '6', label: 'Semester 6' },
    { value: '7', label: 'Semester 7' },
    { value: '8', label: 'Semester 8' }
  ];

  // Function to get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Cultural Events':
        return <Trophy size={14} />;
      case 'Technical Events':
        return <Cpu size={14} />;
      case 'Sports Events':
        return <Gamepad2 size={14} />;
      case 'Workshop':
        return <BookOpen size={14} />;
      default:
        return <Award size={14} />;
    }
  };

  // Function to get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Cultural Events':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Technical Events':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sports Events':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Workshop':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchRegisteredEvents(studentId);
      fetchAchievements(studentId);
      fetchEventCategories();
    } else {
      toast({
        title: "Error",
        description: "Student ID not found. Please login again.",
      });
      navigate('/login');
    }
  }, [studentId, navigate, toast]);

  useEffect(() => {
    setLoadingAllEvents(true);
    axiosInstance.get('/events')
      .then(res => setAllEvents(res.data))
      .catch(() => setEventError('Failed to fetch events.'))
      .finally(() => setLoadingAllEvents(false));
  }, []);

  const fetchEventCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/event_categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
        }
      });
      
      if (response.status === 200) {
        setAvailableCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching event categories:", error);
      // Fallback to hardcoded categories if API fails
      setAvailableCategories(['Cultural Events', 'Technical Events', 'Sports Events', 'Workshop']);
    }
  };

  const fetchRegisteredEvents = async (studentId) => {
    setLoadingEvents(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/student_events/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
        }
      });

      if (response.status === 200) {
        setRegisteredEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching registered events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch registered events. Please try again.",
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchAchievements = async (studentId) => {
    setLoadingAchievements(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/student_achievements`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
        }
      });

      if (response.status === 200) {
        setAchievements(response.data);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast({
        title: "Error",
        description: "Failed to fetch achievements. Please try again.",
      });
    } finally {
      setLoadingAchievements(false);
    }
  };

  const handleUploadAchievement = async () => {
    if (!eventName || !eventDate || !venue || !semester || !eventCategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including event category.",
      });
      return;
    }

    setIsUploading(true);

    // Create form data to send file
    const formData = new FormData();
    formData.append('event_name', eventName);
    formData.append('event_date', eventDate);
    formData.append('venue', venue);
    formData.append('placement', placement);
    formData.append('semester', semester);
    formData.append('event_category', eventCategory);

    // Append certificate file or an empty string if no file is uploaded
    if (certificateFile) {
      formData.append('certificate', certificateFile);
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/student_add_achievement`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        toast({
          title: "Achievement uploaded",
          description: "Your achievement has been uploaded successfully and is pending verification.",
        });

        // Reset form fields
        clearForm();
        
        // Refresh achievements list
        fetchAchievements(studentId);
      }
    } catch (error) {
      console.error("Failed to upload achievement:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to upload achievement. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system."
    });
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('studentId');
    navigate('/login?role=student');
  };

  const handleRegister = async (eventId) => {
    setRegistering(true);
    try {
      await axiosInstance.post(`/events/${eventId}/register`);
      setRegistrationStatus(prev => ({ ...prev, [eventId]: 'registered' }));
      toast({ title: 'Registered', description: 'You have registered for this event.' });
    } catch (err) {
      setRegistrationStatus(prev => ({ ...prev, [eventId]: 'error' }));
      toast({ title: 'Error', description: err.response?.data?.error || 'Failed to register.' });
    } finally {
      setRegistering(false);
    }
  };

  const clearForm = () => {
    setEventName('');
    setEventDate('');
    setVenue('');
    setPlacement('');
    setSemester('');
    setEventCategory('');
    setCertificateFile(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-gray-500">Manage your events and achievements</p>
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
                    <RouterLink to="/events/cultural">Cultural Events</RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <RouterLink to="/events/technical">Technical Events</RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <RouterLink to="/events/sports">Sports Events</RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <RouterLink to="/events/workshops">Workshops</RouterLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
            </div>
          </div>
          
          <Tabs defaultValue="registered" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="registered">Registered Events</TabsTrigger>
              <TabsTrigger value="participation">My Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="registered">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {loadingAllEvents ? (
                  <div className="col-span-full flex justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600"></div>
                  </div>
                ) : eventError ? (
                  <div className="col-span-full text-center p-8 bg-red-50 rounded-md animate-fade-in">
                    <h3 className="text-lg font-medium text-red-700 mb-2">{eventError}</h3>
                  </div>
                ) : allEvents.length > 0 ? (
                  allEvents.map(event => (
                    <Card key={event.id} className="animate-fade-in cursor-pointer hover:shadow-lg transition-shadow" onClick={() => { setSelectedEvent(event); setShowEventModal(true); }}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <Badge variant={event.status === 'Upcoming' ? 'default' : 'outline'}>
                            {event.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          <div className="flex items-center space-x-1 text-sm">
                            <CalendarDays size={14} />
                            <span>{event.start_date} - {event.end_date}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm mt-1">
                            <MapPin size={14} />
                            <span>{event.venue}</span>
                          </div>
                          <div className="mt-2 text-gray-600 text-xs">{event.description}</div>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" className="w-full" onClick={e => { e.stopPropagation(); handleRegister(event.id); }} disabled={registrationStatus[event.id] === 'registered' || registering}>
                          {registrationStatus[event.id] === 'registered' ? 'Registered' : 'Register'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-full text-center p-8 bg-gray-50 rounded-md animate-fade-in">
                    <Calendar size={36} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Events Available</h3>
                    <p className="text-gray-500">
                      There are currently no events to display.
                    </p>
                  </Card>
                )}
                
                <Card className="border-2 border-dashed border-gray-200 bg-transparent flex flex-col items-center justify-center p-6 h-[220px] animate-fade-in hover:border-gray-300 transition-colors">
                  <Calendar size={32} className="text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Find New Events</h3>
                  <Button asChild variant="secondary">
                    <RouterLink to="/events/cultural">Browse Events</RouterLink>
                  </Button>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="participation">
              <Card className="mt-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>Upload Achievement</CardTitle>
                  <CardDescription>
                    Add details about events you've participated in
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-name">Event Name *</Label>
                      <Input 
                        id="event-name" 
                        placeholder="Enter event name" 
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Event Date *</Label>
                      <Input 
                        id="event-date" 
                        type="date" 
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-venue">Venue *</Label>
                      <Input 
                        id="event-venue" 
                        placeholder="Enter venue" 
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="placement">Placement (if any)</Label>
                      <Input 
                        id="placement" 
                        placeholder="e.g., 1st Place, Runner-up" 
                        value={placement}
                        onChange={(e) => setPlacement(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester *</Label>
                      <Select value={semester} onValueChange={setSemester}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="event-category">Event Category *</Label>
                      <Select value={eventCategory} onValueChange={setEventCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event category" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(category)}
                                {category}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certificate-file">Certificate File</Label>
                    <Input 
                      id="certificate-file" 
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>

                  {certificateFile && (
                    <div className="text-sm text-green-600 flex items-center mt-2">
                      <CheckCircle size={16} className="mr-2" />
                      File selected: {certificateFile.name.length > 30 ? 
                        certificateFile.name.substring(0, 30) + '...' : 
                        certificateFile.name}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 flex items-center">
                    <Upload size={16} className="mr-1" /> 
                    Supported formats: PDF, JPG, JPEG, PNG (Max 5MB)
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={clearForm}
                  >
                    Clear Form
                  </Button>
                  <Button 
                    onClick={handleUploadAchievement}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                        Uploading...
                      </>
                    ) : (
                      'Upload Achievement'
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>My Achievements</CardTitle>
                  <CardDescription>
                    Your past participations and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingAchievements ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600"></div>
                    </div>
                  ) : achievements.length > 0 ? (
                    <div className="rounded-md border">
                      {achievements.map(achievement => (
                        <div 
                          key={achievement.id} 
                          className="grid grid-cols-12 gap-4 p-4 items-center border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                          <div className="col-span-3">
                            <div className="font-medium">{achievement.event_name}</div>
                            <div className="text-sm text-gray-500">
                              {achievement.date ? new Date(achievement.date).toLocaleDateString() : 'Date not specified'}
                            </div>
                            <div className="text-sm text-gray-500">{achievement.venue}</div>
                          </div>
                          <div className="col-span-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Award size={14} /> 
                              {achievement.placement || 'Participation'}
                            </Badge>
                          </div>
                          <div className="col-span-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <GraduationCap size={14} />
                              Sem {achievement.semester || 'N/A'}
                            </Badge>
                          </div>
                          <div className="col-span-2">
                            {achievement.event_category && (
                              <Badge className={`flex items-center gap-1 ${getCategoryColor(achievement.event_category)}`}>
                                {getCategoryIcon(achievement.event_category)}
                                {achievement.event_category}
                              </Badge>
                            )}
                          </div>
                          <div className="col-span-2">
                            <Badge 
                              variant={achievement.verification === 'Verified' ? 'secondary' : 
                                      achievement.verification === 'Rejected' ? 'destructive' : 'outline'} 
                              className="flex items-center gap-1"
                            >
                              {achievement.verification === 'Verified' ? (
                                <>
                                  <CheckCircle size={14} /> Verified
                                </>
                              ) : achievement.verification === 'Rejected' ? (
                                <>
                                  <Clock size={14} /> Rejected
                                </>
                              ) : (
                                <>
                                  <Clock size={14} /> Pending
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="col-span-1">
                            {achievement.certificate && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(achievement.certificate, '_blank')}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink size={14} />
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-md">
                      <Award size={36} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Achievements Found</h3>
                      <p className="text-gray-500">
                        You haven't uploaded any achievements yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />

      {/* Event Detail Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent>
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>{selectedEvent.description}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 mt-2">
                <div><b>Category:</b> {selectedEvent.category}</div>
                <div><b>Dates:</b> {selectedEvent.start_date} - {selectedEvent.end_date}</div>
                <div><b>Venue:</b> {selectedEvent.venue}</div>
                <div><b>Status:</b> {selectedEvent.status}</div>
                <div><b>Participants:</b> {selectedEvent.participants}</div>
              </div>
              <DialogFooter>
                <Button onClick={() => handleRegister(selectedEvent.id)} disabled={registrationStatus[selectedEvent.id] === 'registered' || registering}>
                  {registrationStatus[selectedEvent.id] === 'registered' ? 'Registered' : 'Register'}
                </Button>
                <Button variant="outline" onClick={() => setShowEventModal(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;