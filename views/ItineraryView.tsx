
import React, { useState, useEffect } from 'react';
import { ITINERARY } from '../constants';
import { ItineraryEvent, DaySchedule } from '../types';
import { BedIcon, MapIcon, ChevronRightIcon } from '../components/Icons';

interface ItineraryViewProps {
  onNavigateToDetail: (locationId: string) => void;
  selectedDateIdx: number;
  setSelectedDateIdx: (idx: number) => void;
}

const TimelineEvent: React.FC<{ event: ItineraryEvent; isLast: boolean; onLocationClick: (id: string) => void }> = ({ event, isLast, onLocationClick }) => {
  return (
    <div className="flex relative group">
      {/* Left: Time */}
      <div className="w-14 pt-1 flex-shrink-0 text-right pr-4">
        <span className="text-sm font-bold text-mag-black font-mono">{event.time}</span>
      </div>

      {/* Middle: Line & Dot */}
      <div className="flex flex-col items-center mr-4 relative">
        <div className={`w-2.5 h-2.5 rounded-full border-2 z-10 bg-mag-paper ${event.isHighlight ? 'border-mag-red' : 'border-gray-300'}`}></div>
        {!isLast && <div className="w-[1px] bg-gray-200 flex-grow my-1"></div>}
      </div>

      {/* Right: Content Card */}
      <div className="flex-1 pb-8">
        <div 
          onClick={() => event.locationId && onLocationClick(event.locationId)}
          className={`relative p-4 rounded-lg transition-all ${
            event.isHighlight 
              ? 'bg-mag-gold-light border border-mag-gold/20' 
              : 'bg-white border-gray-100 shadow-sm'
          } ${event.locationId ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' : ''}`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className={`text-base leading-relaxed ${event.isHighlight ? 'text-mag-black font-bold' : 'text-mag-black font-medium'}`}>
                {event.description}
              </p>
              {event.note && (
                <p className="text-sm text-mag-gray mt-1">
                  {event.note}
                </p>
              )}
            </div>
            
            {/* Clickable Arrow */}
            {event.locationId && (
              <div className="text-mag-gold opacity-60 group-hover:opacity-100 transition-opacity">
                <ChevronRightIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ItineraryView: React.FC<ItineraryViewProps> = ({ onNavigateToDetail, selectedDateIdx, setSelectedDateIdx }) => {
  const currentDay = ITINERARY[selectedDateIdx];
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-2">
      {/* Horizontal Date Selector - Full Width */}
      <div className="relative bg-mag-paper">
        <div className="flex w-full justify-between px-4 py-2 gap-2">
          {ITINERARY.map((day, idx) => {
            const isSelected = idx === selectedDateIdx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDateIdx(idx)}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-300 border ${
                  isSelected 
                    ? 'bg-mag-black text-white border-mag-black shadow-md transform scale-105' 
                    : 'bg-white text-gray-400 border-gray-100'
                }`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase mb-0.5 opacity-80">{day.date}</span>
                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-500'}`}>{day.weekday.replace('星期', '')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pt-1 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Day Header Info - Reduced Spacing */}
        <div className="mb-4 relative">
          <div className="pr-10"> {/* Add padding right to avoid overlap with map icon */}
             <h2 className="text-2xl font-serif font-bold text-mag-black mb-1">{currentDay.title}</h2>
             
             {/* Minimal Accommodation Style with Link */}
             {currentDay.accommodation && (
               <div className="flex items-center gap-2 mt-2">
                 <BedIcon className="w-4 h-4 text-mag-gold" />
                 {currentDay.accommodationMapUrl ? (
                   <a 
                     href={currentDay.accommodationMapUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-sm font-bold text-mag-gray hover:text-mag-red hover:underline transition-colors"
                   >
                     {currentDay.accommodation}
                   </a>
                 ) : (
                   <span className="text-sm font-bold text-mag-gray">{currentDay.accommodation}</span>
                 )}
               </div>
             )}
          </div>

          {currentDay.mapUrl && (
             <a href={currentDay.mapUrl} target="_blank" rel="noopener noreferrer" className="absolute right-0 top-1 p-2 bg-white rounded-full border border-gray-200 shadow-sm text-mag-gold hover:text-mag-black transition-colors z-10">
                <MapIcon className="w-5 h-5" />
             </a>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          {currentDay.events.map((event, idx) => (
            <TimelineEvent 
              key={idx} 
              event={event} 
              isLast={idx === currentDay.events.length - 1} 
              onLocationClick={onNavigateToDetail}
            />
          ))}
        </div>
      </div>

      {/* Fixed Back To Top Floating Action Button */}
      <button 
        onClick={handleScrollToTop}
        className={`fixed bottom-6 right-5 z-40 p-3 bg-mag-black text-white rounded-full shadow-xl hover:bg-gray-800 transition-all duration-300 active:scale-90 flex items-center justify-center ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="返回頂部"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

    </div>
  );
};
