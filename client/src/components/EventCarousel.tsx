
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
}

const EventCarousel: React.FC<CarouselProps> = ({ 
  children, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === children.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(autoPlay), 10000); // Resume autoplay after 10 seconds
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isAutoPlaying) {
      timer = setInterval(handleNext, interval);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isAutoPlaying, currentIndex, interval]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative">
        {/* Carousel items */}
        <div 
          className="flex transition-transform duration-500 ease-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/70 hover:bg-white pointer-events-auto"
            onClick={handlePrevious}
          >
            <ArrowLeft size={20} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/70 hover:bg-white pointer-events-auto"
            onClick={handleNext}
          >
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {children.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex 
                ? 'bg-primary' 
                : 'bg-gray-300 hover:bg-gray-400'
            } transition-colors duration-300`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EventCarousel;
