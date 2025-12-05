
import React, { useState } from 'react';
import { PACKING_CARRY_ON, PACKING_CHECKED } from '../constants';
import { Checkbox } from '../components/Checkbox';

interface PackingViewProps {
  checkedItems: Set<string>;
  toggleItem: (id: string) => void;
}

export const PackingView: React.FC<PackingViewProps> = ({ checkedItems, toggleItem }) => {
  const [activeSegment, setActiveSegment] = useState<'carry-on' | 'checked'>('carry-on');
  const activeList = activeSegment === 'carry-on' ? PACKING_CARRY_ON : PACKING_CHECKED;

  return (
    <div className="pb-32 pt-5 px-5 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Minimal Tab Switcher */}
      <div className="flex mb-8 bg-gray-200/50 p-1 rounded-lg">
        <button
          onClick={() => setActiveSegment('carry-on')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all duration-200 ${
            activeSegment === 'carry-on' 
              ? 'bg-white text-mag-black shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          隨身行李 (手提)
        </button>
        <button
          onClick={() => setActiveSegment('checked')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all duration-200 ${
            activeSegment === 'checked' 
              ? 'bg-white text-mag-black shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          托運行李
        </button>
      </div>

      {/* Liquid Restriction Warning Banner (Carry-on) */}
      {activeSegment === 'carry-on' && (
        <div className="mb-6 bg-mag-red/5 border-l-4 border-mag-red px-4 py-3 rounded-r-lg flex items-center justify-between">
           <div className="flex flex-col">
             <span className="text-mag-red font-bold text-xs uppercase tracking-wider mb-0.5">LIMIT</span>
             <span className="text-mag-black text-sm font-bold">液體每瓶限 100ml 以下</span>
           </div>
           <span className="text-[10px] font-medium text-mag-gray bg-white px-2 py-1 rounded border border-gray-100">須裝於透明袋</span>
        </div>
      )}

      {/* Battery Warning Banner (Checked) */}
      {activeSegment === 'checked' && (
        <div className="mb-6 bg-mag-red/5 border-l-4 border-mag-red px-4 py-3 rounded-r-lg flex items-center justify-between">
           <div className="flex flex-col">
             <span className="text-mag-red font-bold text-xs uppercase tracking-wider mb-0.5">NOTE</span>
             <span className="text-mag-black text-sm font-bold">電池請勿托運</span>
           </div>
           <span className="text-[10px] font-medium text-mag-gray bg-white px-2 py-1 rounded border border-gray-100">須隨身攜帶</span>
        </div>
      )}

      {/* Checklist */}
      <div className="bg-mag-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        {/* List Header */}
        <div className="bg-mag-black px-4 py-2 flex justify-between items-center">
           <span className="text-[10px] font-bold text-white tracking-widest uppercase">
             {activeSegment === 'carry-on' ? 'Carry-On Items' : 'Checked Items'}
           </span>
           <span className="text-[10px] font-mono text-mag-gold">
             {activeList.filter(i => checkedItems.has(i.id)).length}/{activeList.length}
           </span>
        </div>

        {activeList.map((item) => (
          <Checkbox
            key={item.id}
            label={item.text}
            checked={checkedItems.has(item.id)}
            onChange={() => toggleItem(item.id)}
          />
        ))}
        
        {activeList.length === 0 && (
           <div className="p-8 text-center text-gray-400 font-medium">
             無項目
           </div>
        )}
      </div>
    </div>
  );
};
