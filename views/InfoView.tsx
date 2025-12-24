
import React from 'react';
import { USEFUL_LINKS, EMERGENCY_CONTACTS } from '../constants';

export const InfoView: React.FC = () => {
  // Helper to map specific links to appropriate emojis
  const getLinkEmoji = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('japan web')) return '🛂';
    if (t.includes('纜車')) return '🚠';
    if (t.includes('預報')) return '🗻';
    if (t.includes('巴士')) return '🚌';
    if (t.includes('地圖')) return '🗺️';
    if (t.includes('camera')) return '📸';
    return '🔗';
  };

  return (
    <div className="pb-32 pt-0 animate-in fade-in duration-700">
      
      {/* Emergency Contacts Header */}
      <div className="mb-6">
        <h2 className="text-xs font-black tracking-[0.2em] text-mag-gray uppercase mb-1">EMERGENCY</h2>
        <h3 className="text-[20px] font-serif font-black text-mag-black">緊急聯絡</h3>
      </div>

      {/* Emergency Contacts - White Background + Black Borders (Thicker) */}
      <div className="bg-white border-2 border-mag-black rounded-none overflow-hidden mb-10">
        <div className="flex border-b border-mag-black/10 divide-x divide-mag-black/10">
          <a href={`tel:${EMERGENCY_CONTACTS[0].number}`} className="flex-1 p-4 text-center active:bg-gray-50">
             <div className="text-sm font-black text-mag-black">{EMERGENCY_CONTACTS[0].title}</div>
             <div className="text-3xl font-mono font-black text-mag-red">{EMERGENCY_CONTACTS[0].number}</div>
          </a>
          <a href={`tel:${EMERGENCY_CONTACTS[1].number}`} className="flex-1 p-4 text-center active:bg-gray-50">
             <div className="text-sm font-black text-mag-black">{EMERGENCY_CONTACTS[1].title}</div>
             <div className="text-3xl font-mono font-black text-mag-red">{EMERGENCY_CONTACTS[1].number}</div>
          </a>
        </div>
        <a href={`tel:${EMERGENCY_CONTACTS[2].number}`} className="block p-4 active:bg-gray-50">
           <div className="flex items-center justify-between">
              <div>
                  <div className="text-sm font-black text-mag-black">{EMERGENCY_CONTACTS[2].title}</div>
                  <div className="text-[10px] text-mag-gray font-bold">{EMERGENCY_CONTACTS[2].note}</div>
              </div>
              <div className="text-xl font-mono font-black text-mag-red">{EMERGENCY_CONTACTS[2].number}</div>
           </div>
        </a>
      </div>

      {/* Useful Links Header */}
      <div className="mb-6">
        <h2 className="text-xs font-black tracking-[0.2em] text-mag-gray uppercase mb-1">INFORMATION</h2>
        <h3 className="text-[20px] font-serif font-black text-mag-black">實用連結</h3>
      </div>

      {/* 2-Column Grid for Links - White Background + Black Borders (Thicker) */}
      <div className="grid grid-cols-2 gap-3">
        {USEFUL_LINKS.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center bg-white p-4 rounded-none border-2 border-mag-black hover:border-mag-gold transition-all active:bg-gray-50 text-center"
          >
            <div className="mb-2 text-3xl group-hover:scale-110 transition-transform duration-300">
              {getLinkEmoji(link.title)}
            </div>
            <h4 className="text-[13px] font-bold text-mag-black leading-tight tracking-tight">
              {link.title.split('(')[0].trim()}
            </h4>
            {link.title.includes('(') && (
              <span className="text-[10px] text-mag-gray mt-1 font-medium">
                {link.title.match(/\(([^)]+)\)/)?.[1]}
              </span>
            )}
          </a>
        ))}
      </div>

    </div>
  );
};
