
import React from 'react';
import { PRE_TRIP_NOTES, TODO_LIST } from '../constants';
import { Checkbox } from '../components/Checkbox';

interface PrepViewProps {
  checkedItems: Set<string>;
  toggleItem: (id: string) => void;
}

export const PrepView: React.FC<PrepViewProps> = ({ checkedItems, toggleItem }) => {
  return (
    <div className="pb-32 pt-5 px-5 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Section 1: Notes */}
      <div className="mb-10">
        <h2 className="text-base font-bold tracking-[0.2em] text-mag-gray uppercase mb-4 pl-1">注意事項</h2>
        <div className="bg-mag-white rounded-xl shadow-soft border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-mag-red"></div>
          <ul className="space-y-4">
            {PRE_TRIP_NOTES.map((note, idx) => (
              <li key={idx} className="flex gap-4 text-mag-black text-base leading-relaxed font-medium">
                <span className="text-mag-red font-serif font-bold italic opacity-80">0{idx + 1}</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 2: Checklist */}
      <div>
        <h2 className="text-base font-bold tracking-[0.2em] text-mag-gray uppercase mb-4 pl-1">待辦事項</h2>
        <div className="bg-mag-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
          {TODO_LIST.map((item) => (
            <Checkbox
              key={item.id}
              label={item.text}
              checked={checkedItems.has(item.id)}
              onChange={() => toggleItem(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
