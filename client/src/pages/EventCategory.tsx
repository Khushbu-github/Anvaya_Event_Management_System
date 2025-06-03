import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { Button } from '@/components/ui/button';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const categoryTitles: Record<string, string> = {
  cultural: 'Cultural Events',
  sports: 'Sports Events',
  technical: 'Technical Events',
  workshops: 'Workshops'
};

const categoryDescriptions: Record<string, string> = {
  cultural: 'Explore a vibrant showcase of artistic talents through dance, music, drama, and more.',
  sports: 'Participate in competitive sports events ranging from cricket and football to chess and athletics.',
  technical: 'Engage in hackathons, coding competitions, technical symposiums, and cutting-edge tech events.',
  workshops: 'Enhance your skills through hands-on training sessions conducted by experts in various domains.'
};

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  image: string;
  category: 'cultural' | 'sports' | 'technical' | 'workshops';
  registrationUrl?: string;
  brochureUrl?: string;
  isPast?: boolean;
  description?: string;
}

const EventCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [events, setEvents] = useState<{
    upcoming: Event[];
    cityLevel: Event[];
    past: Event[];
  }>({
    upcoming: [],
    cityLevel: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get user role from localStorage
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setUserRole(user.role);
      } catch {
        setUserRole(null);
      }
    }

    // Fetch events for the category
    const fetchEvents = async () => {
      try {
        console.log('Fetching events for category:', category); // Debug log
        
        // Use the same API endpoint as your Index component
        const response = await fetch('http://localhost:5001/api/all_events');
        
        console.log('API response status:', response.status); // Debug log
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        console.log('Raw API data:', data); // Debug log
        
        // Filter events by category (case-insensitive comparison)
        const categoryEvents = data.filter((event: any) => 
          event.category.toLowerCase() === category?.toLowerCase()
        );
        
        console.log('Filtered category events:', categoryEvents); // Debug log
        
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize to start of day
        
        // Sort events into upcoming, city level, and past
        const sortedEvents = categoryEvents.reduce((acc: any, event: any) => {
          const eventDate = new Date(event.start_date);
          eventDate.setHours(0, 0, 0, 0); // Normalize to start of day
          
          const eventObj = {
            id: event._id,
            title: event.event_name,
            date: new Date(event.start_date).toLocaleDateString(),
            venue: event.venue,
            image: event.image || '/placeholder.svg',
            category: event.category.toLowerCase() as 'cultural' | 'sports' | 'technical' | 'workshops',
            description: event.description
          };

          console.log(`Event ${event.event_name}: eventDate=${eventDate}, currentDate=${currentDate}, isPast=${eventDate < currentDate}`); // Debug log

          if (eventDate < currentDate) {
            acc.past.push({ ...eventObj, isPast: true });
          } else if (event.venue.toLowerCase().includes('city')) {
            acc.cityLevel.push(eventObj);
          } else {
            acc.upcoming.push(eventObj);
          }
          return acc;
        }, { upcoming: [], cityLevel: [], past: [] });

        console.log('Sorted events:', sortedEvents); // Debug log
        setEvents(sortedEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    if (category) {
      fetchEvents();
    }
  }, [category]);
  
  if (!category || !categoryTitles[category]) {
    return <div>Category not found</div>;
  }
  
  const title = categoryTitles[category];
  const description = categoryDescriptions[category];

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${category}/${eventId}${userRole ? `?role=${userRole}` : ''}`);
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Category Header */}
        <div className="bg-purple-800 text-white py-16">
          <div className="container mx-auto px-4">
            <Link 
              to={userRole ? `/?role=${userRole}` : '/'} 
              className="inline-flex items-center text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-white/80 max-w-2xl">{description}</p>
          </div>
        </div>
        
        {/* Events Grid */}
        <div className="container mx-auto px-4 py-12">
          {/* Show message if no events found */}
          {events.upcoming.length === 0 && events.cityLevel.length === 0 && events.past.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No events found for this category.</p>
            </div>
          )}

          {/* Upcoming Events */}
          {events.upcoming.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.upcoming.map((event) => (
                  <EventCard
                    key={event.id}
                    {...event}
                    onClick={() => handleEventClick(event.id)}
                  />
                ))}
              </div>
            </section>
          )}
          
          {/* City Level Events */}
          {events.cityLevel.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">City Level Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.cityLevel.map((event) => (
                  <EventCard
                    key={event.id}
                    {...event}
                    onClick={() => handleEventClick(event.id)}
                  />
                ))}
              </div>
            </section>
          )}
          
          {/* Past Events */}
          {events.past.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.past.map((event) => (
                  <EventCard
                    key={event.id}
                    {...event}
                    onClick={() => handleEventClick(event.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventCategory;