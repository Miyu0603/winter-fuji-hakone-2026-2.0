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
    const ic = "w-9 h-9"; 
    if (code === 0) return <SunIcon className={`${ic} text-mag-gold`} />;
    if (code >= 1 && code <= 3) return <CloudIcon className={`${ic} text-gray-400`} />;
    if ((code >= 45 && code <= 48) || (code >= 51 && code <= 55)) return <CloudIcon className={`${ic} text-gray-300`} />;
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <RainIcon className={`${ic} text-blue-400`} />;
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <SnowIcon className={`${ic} text-blue-200`} />;
    return <SunIcon className={`${ic} text-mag-gold`} />;
  };

  return (
    <div className="relative min-h-screen font-sans text-mag-black bg-mag-paper selection:bg-mag-gold selection:text-white">
      {selectedLocationId && LOCATION_DETAILS[selectedLocationId] && (
        <DetailView location={LOCATION_DETAILS[selectedLocationId]} onBack={() => setSelectedLocationId(null)} />
      )}

      <header className="fixed top-0 left-0 right-0 z-30 pt-safe-top bg-white">
        <div className="max-w-xl mx-auto">
          {/* Row 1: Brand & Weather */}
          <div className="flex justify-between items-center py-5 px-6">
             <div className="text-left">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="bg-mag-black text-white text-[10px] px-1.5 py-0.5 rounded-none font-black tracking-normal leading-none">2026</span>
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-mag-gold">Tokyo Trip</span>
                </div>
                <h1 className="font-noto font-medium text-[20px] leading-none">冬富士之旅</h1>
             </div>
             {weather && (
               <div className="flex items-center gap-3">
                  <div className="text-right">
                    {/* Position Swapped per user request: Temp on top, Region below (assuming from previous 'swapped' comment) */}
                    <div className="text-lg font-mono font-black text-mag-black leading-none mb-1">{weather.temp}°C</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase leading-none tracking-tighter">TOKYO</div>
                  </div>
                  {getWeatherIcon(weather.code)}
               </div>
             )}
          </div>

          {/* Row 2: Navigation Tabs - Smaller gap above, thicker gold active indicator */}
          <nav className="flex w-full bg-white">
            {Object.values(Tab).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pt-0 pb-3 text-[13px] font-noto transition-all border-b-[4px] text-center whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-mag-gold text-mag-black font-bold' 
                    : 'border-transparent text-gray-400 font-normal'
                }`}
              >
                {tab === Tab.ITINERARY ? '行程' : 
                 tab === Tab.PREP ? '準備' : 
                 tab === Tab.COST ? '記帳' : 
                 tab === Tab.PACKING ? '行李' : 
                 tab === Tab.SHOPPING ? '購物' : '資訊'}
              </button>
            ))}
          </nav>

          {/* Row 3: Date Selector */}
          {activeTab === Tab.ITINERARY && (
            <div className="flex w-full border-t border-gray-50 bg-white px-2">
              {ITINERARY.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDateIdx(idx)}
                  className="flex-1 flex flex-col items-center justify-center py-3 transition-all"
                >
                  <div className={`flex flex-col items-center justify-center w-11 h-11 transition-all ${
                    selectedDateIdx === idx ? 'bg-mag-black text-white' : 'bg-transparent'
                  }`}>
                    <div className={`text-[9px] font-bold mb-1 leading-none ${selectedDateIdx === idx ? 'text-gray-300' : 'text-mag-gray'}`}>
                      {day.weekday[2]}
                    </div>
                    <div className={`text-[11px] font-mono font-black leading-none ${selectedDateIdx === idx ? 'text-white' : 'text-mag-gray'}`}>
                      {day.date}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area - Corrected padding-top due to tighter header */}
      <main className={`max-w-xl mx-auto px-6 ${activeTab === Tab.ITINERARY ? 'pt-[190px]' : 'pt-[120px]'} min-h-screen`}>
        {activeTab === Tab.ITINERARY && (
          <ItineraryView onNavigateToDetail={setSelectedLocationId} selectedDateIdx={selectedDateIdx} />
        )}
        {activeTab === Tab.PREP && (
          <PrepView checkedItems={checkedItems} toggleItem={toggleItem} list={todoList} setList={setTodoList} />
        )}
        {activeTab === Tab.PACKING && (
          <PackingView 
            checkedItems={checkedItems} 
            toggleItem={toggleItem} 
            carryOnList={carryOnList} 
            setCarryOnList={setCarryOnList}
            checkedBagList={checkedBagList}
            setCheckedBagList={setCheckedBagList}
          />
        )}
        {activeTab === Tab.SHOPPING && (
          <ShoppingView items={shoppingList} setItems={setShoppingList} />
        )}
        {activeTab === Tab.COST && (
          <CostView expenses={expenses} isLoading={isExpensesLoading} fetchError={expensesError} onRefresh={fetchExpenses} onAddSuccess={fetchExpenses} />
        )}
        {activeTab === Tab.INFO && (
          <InfoView />
        )}
      </main>
    </div>
  );
};

export default App;