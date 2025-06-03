import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GridNavigation from '../components/GridNavigation';
import EventCarousel from '../components/EventCarousel';
import EventCard from '../components/EventCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('http://localhost:5001/api/all_events');
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        const mappedEvents = data.map(event => ({
          id: event._id,
          title: event.event_name,
          date: event.start_date,
          venue: event.venue,
          image: event.image,
          category: event.category,
        }));
        setEvents(mappedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizeDate = (dateString) => {
    const d = new Date(dateString);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const validEvents = events.filter(e => {
    const d = new Date(e.date);
    return e.date && !isNaN(d.getTime());
  });

  const sortedEvents = validEvents.sort((a, b) => {
    const timeA = isNaN(new Date(a.date).getTime()) ? 0 : new Date(a.date).getTime();
    const timeB = isNaN(new Date(b.date).getTime()) ? 0 : new Date(b.date).getTime();
    return timeA - timeB;
  });

  const upcomingEvents = sortedEvents.filter(event =>
    normalizeDate(event.date) >= today
  );

  const recentEvents = sortedEvents
    .filter(event => normalizeDate(event.date) < today)
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <GridNavigation />

        {/* Hero 3D Welcome Section */}
        <section className="relative bg-gradient-to-br from-purple-100 to-white py-24 overflow-hidden">
          {/* Content with 3D effect */}
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-purple-900 drop-shadow-md transition-transform duration-500 hover:scale-105">
                Welcome to Anvaya
              </h1>
              <p className="text-lg md:text-xl mb-8 text-purple-800 drop-shadow transition-all duration-500 hover:translate-y-1">
                Connecting students, faculty, and the community through enriching events 
                and experiences. Anvaya serves as a platform to showcase talent, foster 
                learning, and build lasting connections.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="text-purple-700 border-purple-400 hover:bg-purple-50 font-medium px-6 py-3 rounded-md shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  Learn More
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      className="bg-purple-600 text-white hover:bg-purple-700 font-medium px-6 py-3 rounded-md shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      Browse Events
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/events/cultural" className="cursor-pointer">Cultural Events</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/events/technical" className="cursor-pointer">Technical Events</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/events/sports" className="cursor-pointer">Sports Events</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/events/workshops" className="cursor-pointer">Workshops</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Foreground glass effect */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/20 to-transparent backdrop-blur-sm"></div>

          {/* Embedded styles for animations */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes float {
              0% { transform: translateY(0) rotate(0); }
              50% { transform: translateY(-20px) rotate(5deg); }
              100% { transform: translateY(0) rotate(0); }
            }

            @keyframes float-delay {
              0% { transform: translateY(0) rotate(0); }
              50% { transform: translateY(-15px) rotate(-5deg); }
              100% { transform: translateY(0) rotate(0); }
            }

            @keyframes pulse {
              0% { transform: scale(1) rotate(-12deg); }
              50% { transform: scale(1.1) rotate(-8deg); }
              100% { transform: scale(1) rotate(-12deg); }
            }
          `}} />
        </section>

        {/* Upcoming Events */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Link to="/events" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                <span className="mr-2">View all</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="h-[400px]">
              {loading ? (
                <p>Loading upcoming events...</p>
              ) : upcomingEvents.length ? (
                <EventCarousel>
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="relative h-[400px] w-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
                        <div className="inline-block px-2 py-1 bg-primary text-white text-xs uppercase tracking-wider rounded mb-2">
                          {event.category}
                        </div>
                        <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
                        <div className="flex items-center space-x-2 mb-4 text-white/90">
                          <span>{new Date(event.date).toLocaleDateString()} • {event.venue}</span>
                        </div>
                        <Link to={`/events/${event.category}/${event.id}`}>
                          <Button>Explore Event</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </EventCarousel>
              ) : (
                <p>No upcoming events available.</p>
              )}
            </div>
          </div>
        </section>

        {/* Recent Events */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Recent Events</h2>
            {loading ? (
              <p>Loading recent events...</p>
            ) : recentEvents.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {recentEvents.map(event => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={event.date}
                    venue={event.venue}
                    image={event.image}
                    category={event.category}
                  />
                ))}
              </div>
            ) : (
              <p>No recent events available.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
