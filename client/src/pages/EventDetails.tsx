import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Users, 
  Clock,
  ArrowLeft,
  X 
} from 'lucide-react';

const EventDetails = () => {
  const { category, id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    semester: '',
    teamName: '',
    phone: '',
    email: '',
    collegeName: ''
  });
  const [registrationLoading, setRegistrationLoading] = useState(false);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        console.log('Fetching event details for ID:', id);
        const res = await fetch(`http://localhost:5001/api/events/${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await res.json();
        console.log('Event details:', data);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setRegistrationLoading(true);

    try {
      const res = await fetch(`http://localhost:5001/api/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      alert('Registration successful!');
      setShowRegistration(false);
      setRegistrationData({
        name: '',
        semester: '',
        teamName: '',
        phone: '',
        email: '',
        collegeName: ''
      });
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed. Please try again.');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live':
        return 'bg-red-500';
      case 'Upcoming':
        return 'bg-green-500';
      case 'Planning':
        return 'bg-yellow-500';
      case 'Ended':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">Loading event details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'The requested event could not be found.'}</p>
            <Link to="/events">
              <Button>
                <ArrowLeft className="mr-2" size={16} />
                Back to Events
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0">
            {event.image && event.image !== '/placeholder.svg' ? (
              <img
                src={event.image}
                alt={event.event_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
            )}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
            <div className="text-white">
              <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-4">
                <ArrowLeft className="mr-2" size={16} />
                Back to Events
              </Link>
              
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  {event.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{event.event_name}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center">
                  <Calendar className="mr-2" size={16} />
                  <span>{formatDate(event.start_date)}</span>
                </div>
                {event.venue && (
                  <div className="flex items-center">
                    <MapPin className="mr-2" size={16} />
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-6">Event Details</h2>
                
                {event.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                )}

                {event.session_details && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">Session Details</h3>
                    <p className="text-gray-700 leading-relaxed">{event.session_details}</p>
                  </div>
                )}

                {event.guest_name && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">Guest Speaker</h3>
                    <div className="flex items-center gap-4">
                      <User className="text-gray-500" size={20} />
                      <div>
                        <p className="font-medium">{event.guest_name}</p>
                        {event.guest_contact && (
                          <p className="text-gray-600 text-sm">{event.guest_contact}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-6">Event Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="font-medium">Start Date</p>
                      <p className="text-sm text-gray-600">{formatDate(event.start_date)}</p>
                      <p className="text-sm text-gray-600">{formatTime(event.start_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="font-medium">End Date</p>
                      <p className="text-sm text-gray-600">{formatDate(event.end_date)}</p>
                      <p className="text-sm text-gray-600">{formatTime(event.end_date)}</p>
                    </div>
                  </div>

                  {event.venue && (
                    <div className="flex items-start gap-3">
                      <MapPin className="text-gray-500 mt-1" size={18} />
                      <div>
                        <p className="font-medium">Venue</p>
                        <p className="text-sm text-gray-600">{event.venue}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Users className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-sm text-gray-600">{event.number_of_participants || 0} registered</p>
                    </div>
                  </div>
                </div>

                {/* Registration Button */}
                {event.status !== 'Ended' && (
                  <Button 
                    className="w-full mt-8" 
                    size="lg"
                    onClick={() => setShowRegistration(true)}
                  >
                    Register for Event
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Register for {event.event_name}</h2>
              <button
                onClick={() => setShowRegistration(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={registrationData.name}
                  onChange={handleRegistrationChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={registrationData.semester}
                  onChange={handleRegistrationChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name (if applicable)
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={registrationData.teamName}
                  onChange={handleRegistrationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleRegistrationChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleRegistrationChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College Name *
                </label>
                <input
                  type="text"
                  name="collegeName"
                  value={registrationData.collegeName}
                  onChange={handleRegistrationChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRegistration(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={registrationLoading}
                  className="flex-1"
                >
                  {registrationLoading ? 'Registering...' : 'Register'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventDetails;