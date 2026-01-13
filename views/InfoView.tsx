
import React, { useState, useRef } from 'react';
import { USEFUL_LINKS, EMERGENCY_CONTACTS, JAPANESE_PHRASES } from '../constants';

export const InfoView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (audioPath: string, id: string) => {
    // If something is already playing, stop it
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (isPlaying === id) {
      setIsPlaying(null);
      return;
    }

    const audio = new Audio(audioPath);
    audioRef.current = audio;
    setIsPlaying(id);

    audio.play().catch(error => {
      console.error("Audio playback failed:", error);
      setIsPlaying(null);
    });

    audio.onended = () => {
      setIsPlaying(null);
      audioRef.current = null;
    };
  };

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
      
      {/* Emergency Contacts Section */}
      <div className="mb-6">
        <h2 className="text-xs font-black tracking-[0.2em] text-mag-gray uppercase mb-1">EMERGENCY</h2>
        <h3 className="text-[20px] font-serif font-black text-mag-black">緊急聯絡</h3>
      </div>

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

      {/* Useful Links Section */}
      <div className="mb-6">
        <h2 className="text-xs font-black tracking-[0.2em] text-mag-gray uppercase mb-1">INFORMATION</h2>
        <h3 className="text-[20px] font-serif font-black text-mag-black">實用連結</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-10">
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

      {/* Useful Japanese Section */}
      <div className="mb-6">
        <h2 className="text-xs font-black tracking-[0.2em] text-mag-gray uppercase mb-1">LANGUAGE</h2>
        <h3 className="text-[20px] font-serif font-black text-mag-black">實用日文</h3>
      </div>

      <div className="space-y-10">
        {JAPANESE_PHRASES.map((section, sIdx) => (
          <div key={sIdx} className="bg-white border-2 border-mag-black overflow-hidden relative">
            <div className="bg-mag-black text-white px-5 py-2.5 text-[12px] font-black uppercase tracking-widest w-full flex justify-between items-center">
              <span>{section.category}</span>
            </div>
            
            <div className="p-5">
              <div className={`${section.sentences && section.sentences.length > 0 ? 'mb-6' : ''}`}>
                <h4 className="text-[11px] font-black text-mag-gold uppercase tracking-[0.15em] mb-4 border-b border-gray-100 pb-1.5">關鍵單字 KEYWORDS</h4>
                <div className="space-y-2">
                  {section.vocab.map((v, vIdx) => (
                    <div key={vIdx} className="flex items-center justify-between pb-1 border-b border-gray-50 last:border-0 group">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[14px] font-bold text-mag-black">{v.jp}</span>
                        <span className="text-[12px] text-mag-gray font-medium">{v.cn}</span>
                      </div>
                      {v.audio && (
                        <button 
                          onClick={() => playAudio(v.audio!, `vocab-${sIdx}-${vIdx}`)}
                          className={`p-1.5 transition-colors ${isPlaying === `vocab-${sIdx}-${vIdx}` ? 'text-mag-gold' : 'text-gray-300 hover:text-mag-gold'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {section.sentences && section.sentences.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-black text-mag-gold uppercase tracking-[0.15em] mb-4 border-b border-gray-100 pb-1.5">實用句子 PHRASES</h4>
                  <div className="space-y-5">
                    {section.sentences.map((sent, pIdx) => (
                      <div key={pIdx} className="flex gap-3 group">
                        <div className="mt-1 w-1.5 h-1.5 bg-mag-gold shrink-0"></div>
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="flex justify-between items-start gap-2">
                            <div className="text-[15px] font-bold text-mag-black leading-snug">
                              {sent.jp}
                            </div>
                            {sent.audio && (
                              <button 
                                onClick={() => playAudio(sent.audio!, `sent-${sIdx}-${pIdx}`)}
                                className={`p-1 mt-0.5 transition-colors shrink-0 ${isPlaying === `sent-${sIdx}-${pIdx}` ? 'text-mag-gold' : 'text-gray-300 hover:text-mag-gold'}`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="text-[12px] font-medium text-mag-gray">
                            {sent.cn}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
