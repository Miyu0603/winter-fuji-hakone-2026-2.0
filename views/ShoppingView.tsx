
import React, { useState } from 'react';
import { ShoppingItem } from '../types';
import { PlusIcon, TrashIcon, EditIcon, SaveIcon, XIcon, ShoppingIcon } from '../components/Icons';

interface ShoppingViewProps {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({ items, setItems }) => {
  const [newItemText, setNewItemText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      isCompleted: false,
    };

    setItems(prev => [newItem, ...prev]);
    setNewItemText('');
  };

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('確定要刪除此項目嗎？')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const startEdit = (item: ShoppingItem) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const saveEdit = (id: string) => {
    if (!editingText.trim()) return;
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, text: editingText.trim() } : item
    ));
    setEditingId(null);
  };

  return (
    <div className="pb-32 pt-5 px-5 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-mag-gray uppercase mb-1 pl-1">SHOPPING</h2>
          <h3 className="text-2xl font-serif font-bold text-mag-black">購物清單</h3>
        </div>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="mb-8 relative">
        <input 
          type="text" 
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="新增購物項目..."
          className="w-full bg-white border border-gray-200 text-mag-black font-medium text-base rounded-xl py-3 pl-4 pr-12 shadow-sm focus:border-mag-gold focus:ring-1 focus:ring-mag-gold outline-none transition-all placeholder-gray-300"
        />
        <button 
          type="submit"
          disabled={!newItemText.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-mag-black text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-xl">
             <div className="text-gray-300 mb-2">
               <ShoppingIcon className="w-10 h-10 mx-auto opacity-50" />
             </div>
             <p className="text-sm font-bold text-gray-400">目前沒有購物清單</p>
          </div>
        ) : (
          items.map(item => (
            <div 
              key={item.id} 
              className={`bg-white rounded-xl border p-4 transition-all duration-200 ${
                item.isCompleted ? 'border-gray-100 opacity-60 bg-gray-50' : 'border-gray-200 shadow-sm'
              }`}
            >
              {editingId === item.id ? (
                // Edit Mode
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 bg-gray-50 border border-mag-gold/30 rounded-lg px-3 py-2 text-base font-bold text-mag-black outline-none"
                    autoFocus
                  />
                  <button onClick={() => saveEdit(item.id)} className="p-2 text-green-600 bg-green-50 rounded-lg">
                    <SaveIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-lg">
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleToggle(item.id)}
                    className={`shrink-0 w-6 h-6 rounded border transition-all flex items-center justify-center ${
                      item.isCompleted 
                        ? 'bg-mag-gold border-mag-gold' 
                        : 'bg-white border-gray-300 hover:border-mag-gold'
                    }`}
                  >
                     {item.isCompleted && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline strokeWidth="3" points="20 6 9 17 4 12"/></svg>}
                  </button>
                  
                  <span 
                    onClick={() => handleToggle(item.id)}
                    className={`flex-1 text-base font-bold cursor-pointer select-none transition-all ${
                      item.isCompleted ? 'text-gray-400 line-through' : 'text-mag-black'
                    }`}
                  >
                    {item.text}
                  </span>

                  <div className="flex gap-1 shrink-0">
                    <button 
                      onClick={() => startEdit(item)}
                      className="p-2 text-gray-400 hover:text-mag-gold transition-colors"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
