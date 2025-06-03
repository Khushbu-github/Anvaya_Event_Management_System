import React from 'react';
import { CalendarDays, MapPin, ExternalLink, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  venue: string;
  image: string;
  category: 'cultural' | 'sports' | 'technical' | 'workshops';
  registrationUrl?: string;
  brochureUrl?: string;
  isPast?: boolean;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  venue,
  image,
  category,
  registrationUrl,
  brochureUrl,
  isPast = false,
  onClick
}) => {
  // Using the same white card background for all cards
  const cardClass = "bg-white overflow-hidden rounded shadow-md";
  
  // Text colors for different categories
  const categoryTextClasses = {
    'cultural': 'text-purple-700',  // Purple text for cultural
    'sports': 'text-purple-700',
    'technical': 'text-purple-700',
    'workshops': 'text-purple-700'
  };
  
  // Button color - using purple (from the third card) for all summary buttons
  const buttonClass = "bg-purple-600 hover:bg-purple-700 text-white";

  return (
    <div className={`event-card ${cardClass}`} onClick={onClick}>
      <div className="h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      
      <div className="p-4">
        <h3 className={`text-lg font-bold mb-2 ${categoryTextClasses[category]}`}>{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <CalendarDays size={16} />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <MapPin size={16} />
            <span>{venue}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          {brochureUrl && (
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1 text-sm font-medium p-2 rounded-md
                bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800"
            >
              <ExternalLink size={14} />
              <span>View Brochure</span>
            </a>
          )}
          
          {isPast ? (
            <Link
              to={`/events/${category}/${id}`}
              className="flex items-center justify-center space-x-1 text-sm font-medium p-2 rounded-md
                text-white transition-colors bg-purple-600 hover:bg-purple-700"
            >
              <Users size={14} />
              <span>View Summary</span>
            </Link>
          ) : registrationUrl ? (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="secondary" className={`w-full ${buttonClass}`}>Register Now</Button>
            </a>
          ) : (
            <Link to={`/events/${category}/${id}`} className="w-full">
              <Button variant="secondary" className={`w-full ${buttonClass}`}>Explore</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;