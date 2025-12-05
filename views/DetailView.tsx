













import React, { useEffect, useState } from 'react';
import { LocationDetail } from '../types';
import { MapIcon, CarIcon, CopyIcon, CheckCircleIcon, BusIcon, WalkIcon, TicketIcon } from '../components/Icons';

interface DetailViewProps {
  location: LocationDetail;
  onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ location, onBack }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleCopy = (text?: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      
      {/* Backdrop (Click to close) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onBack}
      ></div>

      {/* Bottom Sheet Container */}
      <div className="relative z-10 w-full max-w-lg bg-mag-paper rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-300">
        
        {/* Sticky Header with Handle, Title & Close Button */}
        <div className="sticky top-0 left-0 right-0 bg-mag-paper z-20 px-6 pt-12 pb-2 shrink-0">
           {/* Visual Drag Handle (Centered) */}
           <div className="absolute left-1/2 -translate-x-1/2 top-4 w-10 h-1 bg-gray-200 rounded-full"></div>
           
           <div className="flex justify-between items-start mt-2">
             {/* Title */}
             <h1 className="text-2xl font-serif font-bold text-mag-black leading-tight pr-4">
               {location.title}
             </h1>

             {/* Close Button */}
             <button 
               onClick={onBack}
               className="shrink-0 p-2 bg-gray-100/80 hover:bg-gray-200 text-mag-gray hover:text-mag-black rounded-full transition-colors active:scale-95"
               aria-label="Close"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-8 pt-2">
            
            {/* Divider */}
            <div className="w-10 h-0.5 bg-mag-gold mb-4"></div>

            {/* Image (Optional) */}
            {location.imageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-md border border-gray-100">
                <img 
                  src={location.imageUrl} 
                  alt={location.title}
                  className="w-full h-auto object-cover block" 
                />
              </div>
            )}

            {/* Structured Reservation Info */}
            {location.reservation && (
              <div className="mb-8">
                {/* Booking ID Card */}
                <div className="bg-mag-black text-white p-5 rounded-2xl shadow-lg mb-6 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transform scale-150">
                     <TicketIcon className="w-24 h-24" />
                   </div>
                   <div className="relative z-10">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-mag-gold mb-2">Booking ID</div>
                      <div 
                        className="text-2xl font-mono font-bold tracking-wider cursor-pointer flex items-center gap-2"
                        onClick={() => handleCopy(location.reservation?.id)}
                        title="點擊複製"
                      >
                         {location.reservation.id}
                         <CopyIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                      {isCopied && <div className="absolute bottom-4 right-4 text-xs font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded">已複製</div>}
                   </div>
                </div>

                {/* Reservation Sections */}
                <div className="space-y-6">
                  {location.reservation.sections.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                      <h3 className="text-xs font-bold text-mag-gray uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                        {section.title}
                      </h3>
                      <div className="grid grid-cols-1 gap-y-4">
                        {section.items.map((item, i) => (
                          <div key={i} className={`flex flex-col ${item.isFullWidth ? 'col-span-1' : ''}`}>
                             <span className="text-[10px] font-bold text-gray-400 mb-0.5">{item.label}</span>
                             <span className="text-base font-bold text-mag-black whitespace-pre-line leading-snug">
                               {item.value}
                             </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description (Legacy or Supplementary) */}
            {location.description && (
              <div className="prose prose-sm prose-gray mb-6">
                 <p className="text-mag-black leading-relaxed text-base font-medium whitespace-pre-line">
                   {location.description}
                 </p>
              </div>
            )}

            {/* Structured Transit Info - Simplified View */}
            {location.transitLegs && location.transitLegs.length > 0 && (
              <div className="mb-6 relative">
                 {/* Continuous Line (Background) */}
                 <div className="absolute left-[11px] top-3 bottom-8 w-0.5 bg-gray-200"></div>

                 {/* 1. Start Node */}
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-mag-black border-2 border-white shadow-sm shrink-0"></div>
                    <div>
                       <span className="text-xl font-mono font-bold text-mag-black mr-3">{location.transitLegs[0].depTime}</span>
                       <span className="text-base font-bold text-mag-black">{location.transitLegs[0].depStop}</span>
                    </div>
                 </div>

                 {/* 2. Legs Cards (Without intermediate nodes) */}
                 {location.transitLegs.map((leg, i) => (
                    <div key={i} className="relative z-10 mb-6">
                        
                        {/* Dot for Walk Leg */}
                        {leg.type === 'walk' && (
                           <div className="absolute left-[8px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400 ring-4 ring-mag-paper"></div>
                        )}

                        <div className="pl-10 pr-2">
                            <div className={`p-3 rounded-xl border flex flex-col gap-1 shadow-sm ${leg.type === 'walk' ? 'bg-white border-dashed border-gray-300' : 'bg-gray-50 border-gray-100'}`}>
                                <div className="flex items-center gap-2 font-bold text-mag-black">
                                    {leg.type === 'walk' ? <WalkIcon className="w-5 h-5 text-gray-500"/> : <BusIcon className="w-5 h-5 text-mag-gold"/>}
                                    <span>{leg.transport}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                {leg.details?.map((d, idx) => (
                                    <span key={idx} className="text-xs font-bold text-gray-500 bg-black/5 px-2 py-0.5 rounded">{d}</span>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                 ))}

                 {/* 3. End Node */}
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-mag-red border-2 border-white shadow-sm shrink-0"></div>
                    <div>
                       <span className="text-xl font-mono font-bold text-mag-black mr-3">
                         {location.transitLegs[location.transitLegs.length - 1].arrTime}
                       </span>
                       <span className="text-base font-bold text-mag-black">
                         {location.transitLegs[location.transitLegs.length - 1].arrStop}
                       </span>
                    </div>
                 </div>
              </div>
            )}

            {/* Meta Data Grid */}
            {(location.address || location.openingHours || location.carNaviPhone) && (
              <div className="grid grid-cols-1 gap-3 mb-4 border-t border-gray-100 pt-6">
                 
                 {/* Car Navigation Phone */}
                 {location.carNaviPhone && (
                   <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 items-center justify-between">
                      <div className="flex gap-3 items-center">
                          <div className="w-8 h-8 rounded-full bg-mag-black text-white flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                             <CarIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-[10px] font-bold text-mag-gray uppercase tracking-wider mb-0.5">自駕導航 (電話)</h3>
                            <p className="text-base font-bold font-mono text-mag-black">{location.carNaviPhone}</p>
                          </div>
                      </div>
                      <button 
                          onClick={() => handleCopy(location.carNaviPhone)}
                          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                          title="複製"
                      >
                          {isCopied ? <CheckCircleIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5 text-gray-500" />}
                      </button>
                   </div>
                 )}

                 {location.address && (
                   <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 text-mag-black border border-gray-100 shadow-sm mt-0.5">
                         <MapIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-[10px] font-bold text-mag-gray uppercase tracking-wider mb-0.5">地址</h3>
                        <p className="text-sm font-medium text-mag-black leading-tight">{location.address}</p>
                      </div>
                   </div>
                 )}
                 
                 {location.openingHours && (
                   <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 text-mag-black border border-gray-100 shadow-sm mt-0.5">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      </div>
                      <div>
                        <h3 className="text-[10px] font-bold text-mag-gray uppercase tracking-wider mb-0.5">營業時間</h3>
                        <p className="text-sm font-medium text-mag-black leading-tight">{location.openingHours}</p>
                      </div>
                   </div>
                 )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pb-safe-bottom">
              {location.mapUrl && (
                <a 
                  href={location.mapUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-mag-black text-white text-center font-bold text-sm rounded-xl shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <MapIcon className="w-4 h-4" />
                  開啟 Google Maps
                </a>
              )}
              {location.websiteUrl && (
                <a 
                  href={location.websiteUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-white text-mag-black border border-gray-200 text-center font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  訪問官方網站
                </a>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};