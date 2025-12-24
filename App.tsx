
import React, { useState, useEffect } from 'react';
import { Tab, ShoppingItem, ExpenseRecord, ChecklistItem } from './types';
import { LOCATION_DETAILS, GOOGLE_SCRIPT_URL, ITINERARY, TODO_LIST, PACKING_CARRY_ON, PACKING_CHECKED } from './constants';
import { ItineraryView } from './views/ItineraryView';
import { PrepView } from './views/PrepView';
import { PackingView } from './views/PackingView';
import { DetailView } from './views/DetailView';
import { InfoView } from './views/InfoView';
import { ShoppingView } from './views/ShoppingView';
import { CostView } from './views/CostView';
import { SunIcon, CloudIcon, RainIcon, SnowIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ITINERARY);
  
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('checked_items');
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) { console.error(e); }
    return new Set();
  });

  useEffect(() => {
    try {
      localStorage.setItem('checked_items', JSON.stringify(Array.from(checkedItems)));
    } catch (e) { console.error(e); }
  }, [checkedItems]);

  const [todoList, setTodoList] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('dynamic_todo_list');
    return saved ? JSON.parse(saved) : TODO_LIST;
  });

  const [carryOnList, setCarryOnList] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('dynamic_carryon_list');
    return saved ? JSON.parse(saved) : PACKING_CARRY_ON;
  });

  const [checkedBagList, setCheckedBagList] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('dynamic_checkedbag_list');
    return saved ? JSON.parse(saved) : PACKING_CHECKED;
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopping_list');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => { localStorage.setItem('dynamic_todo_list', JSON.stringify(todoList)); }, [todoList]);
  useEffect(() => { localStorage.setItem('dynamic_carryon_list', JSON.stringify(carryOnList)); }, [carryOnList]);
  useEffect(() => { localStorage.setItem('dynamic_checkedbag_list', JSON.stringify(checkedBagList)); }, [checkedBagList]);
  useEffect(() => { localStorage.setItem('shopping_list', JSON.stringify(shoppingList)); }, [shoppingList]);

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedDateIdx, setSelectedDateIdx] = useState<number>(0);

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isExpensesLoading, setIsExpensesLoading] = useState(false);
  const [expensesError, setExpensesError] = useState<string | null>(null);
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [activeTab, selectedDateIdx]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current=temperature_2m,weather_code&timezone=Asia%2FTokyo'
        );
        const data = await res.json();
        if (data.current) setWeather({ temp: Math.round(data.current.temperature_2m), code: data.current.weather_code });
      } catch (e) { console.error(e); }
    };
    fetchWeather();
  }, []);

  const fetchExpenses = async () => {
    if (!GOOGLE_SCRIPT_URL) return;
    setIsExpensesLoading(true);
    setExpensesError(null);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${new Date().getTime()}`);
      const json = await response.json();
      if (json.status === 'error' || json.result === 'error') throw new Error(json.message);
      
      const parsedData: ExpenseRecord[] = (json.data || [])
        .map((row: any) => ({
          rowIndex: Number(row.rowIndex),
          date: row.date,
          item: row.item,
          payer: row.payer,
          amountTwd: Number(String(row.twd || 0).replace(/[^0-9.-]/g, '')),
          amountJpy: Number(String(row.jpy || 0).replace(/[^0-9.-]/g, '')),
          note: row.note,
          splitType: Math.abs(Number(row.splitXiangTwd || 0) - Number(row.splitQianTwd || 0)) > 1 ? 'manual' : 'equal',
          splitXiangTwd: Number(row.splitXiangTwd || 0),
          splitXiangJpy: Number(row.splitXiangJpy || 0),
          splitQianTwd: Number(row.splitQianTwd || 0),
          splitQianJpy: Number(row.splitQianJpy || 0)
        }))
        .filter((r: any) => r.rowIndex >= 3 && !r.date.includes('日期'));

      parsedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.rowIndex - a.rowIndex);
      setExpenses(parsedData);
    } catch (err: any) { setExpensesError(err.message || "讀取失敗"); }
    finally { setIsExpensesLoading(false); }
  };

  useEffect(() => { if (activeTab === Tab.COST && expenses.length === 0) fetchExpenses(); }, [activeTab]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const getWeatherIcon = (code: number) => {
    const ic = "w-11 h-11"; 
    if (code === 0) return <SunIcon className={`${ic} text-mag-gold`} />;
    if (code >= 1 && code <= 3) return <CloudIcon className={`${ic} text-gray-500`} />;
    if ((code >= 45 && code <= 48) || (code >= 51 && code <= 55)) return <CloudIcon className={`${ic} text-gray-400`} />;
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <RainIcon className={`${ic} text-blue-500`} />;
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <SnowIcon className={`${ic} text-blue-300`} />;
    return <SunIcon className={`${ic} text-mag-gold`} />;
  };

  return (
    <div className="relative min-h-screen font-sans text-mag-black bg-mag-paper selection:bg-mag-gold selection:text-white">
      {selectedLocationId && LOCATION_DETAILS[selectedLocationId] && (
        <DetailView location={LOCATION_DETAILS[selectedLocationId]} onBack={() => setSelectedLocationId(null)} />
      )}

      <header className="fixed top-0 left-0 right-0 z-30 pt-safe-top">
        <div className="max-w-xl mx-auto px-6 pt-4 pb-0">
          <div className="flex justify-between items-center mb-4">
             <div className="text-left">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="bg-mag-black text-white text-[10px] px-1.5 py-0.5 rounded-none font-black tracking-normal leading-none">2026</span>
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-mag-gold">Tokyo Trip</span>
                </div>
                <h1 className="font-serif text-mag-black">
                  <span className="block text-[20px] font-black tracking-tight leading-none">冬富士之旅</span>
                </h1>
             </div>

             <a href="https://www.google.com/search?q=Tokyo+weather" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 active:opacity-50 transition-opacity">
                 <div className="flex flex-col items-end">
                     {weather && (
                       <>
                         <span className="text-lg font-bold font-serif text-mag-black leading-none">{weather.temp}°</span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-mag-gray mt-1.5">TOKYO</span>
                       </>
                     )}
                 </div>
                 <div className="shrink-0">{weather && getWeatherIcon(weather.code)}</div>
             </a>
          </div>

          <div className="flex w-full justify-between items-end">
            {[Tab.ITINERARY, Tab.PREP, Tab.COST, Tab.PACKING, Tab.SHOPPING, Tab.INFO].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-all relative whitespace-nowrap text-center font-serif ${activeTab === tab ? 'text-mag-black' : 'text-gray-400'}`}
              >
                {tab === Tab.ITINERARY && '行程'}{tab === Tab.PREP && '準備'}{tab === Tab.COST && '記帳'}{tab === Tab.PACKING && '行李'}{tab === Tab.SHOPPING && '購物'}{tab === Tab.INFO && '資訊'}
                {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-[4px] bg-mag-gold rounded-none"></span>}
              </button>
            ))}
          </div>
          <div className="w-full h-[1px] bg-gray-100"></div>

          {activeTab === Tab.ITINERARY && (
            <div className="flex w-full justify-between py-2 animate-in fade-in slide-in-from-top-1">
              {ITINERARY.map((day, idx) => (
                <button key={idx} onClick={() => setSelectedDateIdx(idx)}
                  className="flex-1 flex flex-col items-center justify-center transition-all group"
                >
                  <div className={`w-12 py-1.5 flex flex-col items-center justify-center transition-all rounded-none ${idx === selectedDateIdx ? 'bg-mag-black text-white' : 'text-gray-400'}`}>
                    <span className={`text-[10px] font-bold tracking-wider mb-0.5 ${idx === selectedDateIdx ? 'text-white/60' : 'opacity-60'}`}>{day.date}</span>
                    <span className="text-xs font-black">{day.weekday.replace('星期', '')}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className={activeTab === Tab.ITINERARY ? "h-[165px]" : "h-[115px]"}></div>

      <main className="max-w-xl mx-auto px-6">
        {activeTab === Tab.ITINERARY && <ItineraryView onNavigateToDetail={setSelectedLocationId} selectedDateIdx={selectedDateIdx} setSelectedDateIdx={setSelectedDateIdx} />}
        {activeTab === Tab.PREP && <PrepView checkedItems={checkedItems} toggleItem={toggleItem} list={todoList} setList={setTodoList} />}
        {activeTab === Tab.PACKING && <PackingView checkedItems={checkedItems} toggleItem={toggleItem} carryOnList={carryOnList} setCarryOnList={setCarryOnList} checkedBagList={checkedBagList} setCheckedBagList={setCheckedBagList} />}
        {activeTab === Tab.INFO && <InfoView />}
        {activeTab === Tab.COST && <CostView expenses={expenses} isLoading={isExpensesLoading} fetchError={expensesError} onRefresh={fetchExpenses} onAddSuccess={fetchExpenses} />}
        {activeTab === Tab.SHOPPING && <ShoppingView items={shoppingList} setItems={setShoppingList} />}
      </main>
      
      <div className="pb-safe-bottom h-10"></div>
    </div>
  );
};

export default App;
