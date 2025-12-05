
import React from 'react';
import { USEFUL_LINKS, EMERGENCY_CONTACTS } from '../constants';
import { ExternalLinkIcon } from '../components/Icons';

export const InfoView: React.FC = () => {
  return (
    <div className="pb-32 pt-5 px-5 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Useful Links Section */}
      <div className="mb-4">
        <h2 className="text-xs font-bold tracking-[0.2em] text-mag-gray uppercase mb-1 pl-1">INFORMATION</h2>
        <h3 className="text-2xl font-serif font-bold text-mag-black">實用連結</h3>
      </div>

      <div className="grid gap-2 mb-8">
        {USEFUL_LINKS.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-mag-gold/30 transition-all active:scale-[0.99]"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-base font-bold text-mag-black group-hover:text-mag-gold transition-colors">{link.title}</h4>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-mag-gold group-hover:text-white transition-colors">
                <ExternalLinkIcon className="w-4 h-4" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Emergency Contacts Section */}
      <div className="mb-4">
        <h2 className="text-xs font-bold tracking-[0.2em] text-mag-gray uppercase mb-1 pl-1">EMERGENCY & SUPPORT</h2>
        <h3 className="text-2xl font-serif font-bold text-mag-black">緊急聯絡</h3>
      </div>

      <div className="bg-mag-red/5 border border-mag-red/20 rounded-2xl overflow-hidden shadow-sm">
        {/* Top Row: Police & Fire (Split 50/50, No Icons, Compact) */}
        <div className="flex border-b border-mag-red/10 divide-x divide-mag-red/10">
          {/* Police */}
          <a 
            href={`tel:${EMERGENCY_CONTACTS[0].number}`} 
            className="flex-1 p-3 hover:bg-mag-red/10 transition-colors text-center active:scale-[0.98] flex flex-col items-center justify-center"
          >
             <div className="text-lg font-bold text-mag-black">{EMERGENCY_CONTACTS[0].title}</div>
             <div className="text-3xl font-mono font-bold text-mag-red tracking-tight">{EMERGENCY_CONTACTS[0].number}</div>
          </a>

          {/* Fire/Ambulance */}
          <a 
            href={`tel:${EMERGENCY_CONTACTS[1].number}`} 
            className="flex-1 p-3 hover:bg-mag-red/10 transition-colors text-center active:scale-[0.98] flex flex-col items-center justify-center"
          >
             <div className="text-lg font-bold text-mag-black">{EMERGENCY_CONTACTS[1].title}</div>
             <div className="text-3xl font-mono font-bold text-mag-red tracking-tight">{EMERGENCY_CONTACTS[1].number}</div>
          </a>
        </div>

        {/* Bottom Row: JNTO (Full Width, Compact, No Icon, Centered Number) */}
        <a 
          href={`tel:${EMERGENCY_CONTACTS[2].number}`} 
          className="block p-4 hover:bg-mag-red/10 transition-colors active:scale-[0.99]"
        >
           <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col justify-center min-w-0">
                  <div className="text-sm font-bold text-mag-black truncate">{EMERGENCY_CONTACTS[2].title}</div>
                  <div className="text-[10px] text-mag-gray font-medium truncate">
                  {EMERGENCY_CONTACTS[2].note}
                  </div>
              </div>
              
              <div className="text-xl font-mono font-bold text-mag-red tracking-wide shrink-0">
                {EMERGENCY_CONTACTS[2].number}
              </div>
           </div>
        </a>
      </div>

    </div>
  );
};
