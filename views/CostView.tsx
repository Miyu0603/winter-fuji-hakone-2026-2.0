
import React, { useState, useMemo } from 'react';
import { GOOGLE_SCRIPT_URL, GOOGLE_SHEET_URL } from '../constants';
import { SheetIcon, PlusIcon, RefreshIcon, EditIcon, TrashIcon, XIcon } from '../components/Icons';
import { ExpenseRecord } from '../types';

interface CostViewProps {
  expenses: ExpenseRecord[];
  isLoading: boolean;
  fetchError: string | null;
  onRefresh: () => void;
  onAddSuccess: () => void;
}

export const CostView: React.FC<CostViewProps> = ({ 
  expenses, 
  isLoading, 
  onRefresh,
  onAddSuccess
}) => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  
  // Form State
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'JPY' | 'TWD'>('JPY');
  const [item, setItem] = useState('');
  const [payer, setPayer] = useState<'想想' | '錢錢'>('想想');
  const [note, setNote] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'manual'>('equal');
  const [manualXiangInput, setManualXiangInput] = useState('');
  const [manualQianInput, setManualQianInput] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);

  const totalTWD = expenses.reduce((sum, r) => sum + r.amountTwd, 0);
  const totalJPY = expenses.reduce((sum, r) => sum + r.amountJpy, 0);

  const settlement = useMemo(() => {
    let xiangPaidTwd = 0;
    let xiangPaidJpy = 0;
    let xiangShouldPayTwd = 0;
    let xiangShouldPayJpy = 0;
    expenses.forEach(r => {
      if (r.payer === '想想') { xiangPaidTwd += r.amountTwd; xiangPaidJpy += r.amountJpy; }
      xiangShouldPayTwd += r.splitXiangTwd || 0;
      xiangShouldPayJpy += r.splitXiangJpy || 0;
    });
    return { twd: xiangPaidTwd - xiangShouldPayTwd, jpy: xiangPaidJpy - xiangShouldPayJpy };
  }, [expenses]);

  const handleAmountChange = (val: string) => {
    setAmount(val);
    if (val) {
      const total = Number(val) || 0;
      setManualXiangInput(String(Math.round(total / 2)));
      setManualQianInput(String(total - Math.round(total / 2)));
    }
  };

  const handleManualXiangChange = (val: string) => {
    setManualXiangInput(val);
    const total = Number(amount) || 0;
    setManualQianInput(String(total - (Number(val) || 0)));
  };

  const handleManualQianChange = (val: string) => {
    setManualQianInput(val);
    const total = Number(amount) || 0;
    setManualXiangInput(String(total - (Number(val) || 0)));
  };

  const handleOpenAdd = () => {
    setMode('add'); setEditingRowIndex(null);
    const today = new Date();
    setDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    setAmount(''); setItem(''); setPayer('想想'); setNote(''); setCurrency('JPY'); setSplitType('equal'); 
    setManualXiangInput(''); setManualQianInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, record: ExpenseRecord) => {
    e.stopPropagation(); setMode('edit'); setEditingRowIndex(record.rowIndex);
    const d = new Date(record.date);
    setDate(!isNaN(d.getTime()) ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '');
    setItem(record.item); setPayer(record.payer); setNote(record.note || ''); setSplitType(record.splitType || 'equal');
    const amt = record.amountTwd > 0 ? record.amountTwd : record.amountJpy;
    setAmount(String(amt));
    setCurrency(record.amountTwd > 0 ? 'TWD' : 'JPY');
    const xVal = record.amountTwd > 0 ? record.splitXiangTwd : record.splitXiangJpy;
    const qVal = record.amountTwd > 0 ? record.splitQianTwd : record.splitQianJpy;
    setManualXiangInput(String(xVal));
    setManualQianInput(String(qVal));
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId === null) return;
    setIsDeleting(true);
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'delete', rowIndex: deleteConfirmId }) });
      const result = await res.json();
      if (result.result === "success") { setDeleteConfirmId(null); onAddSuccess(); }
    } catch { console.error("刪除失敗"); } finally { setIsDeleting(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!amount || !item) return;
    setIsSubmitting(true);
    const total = Number(amount) || 0;
    let xA = splitType === 'equal' ? total / 2 : (Number(manualXiangInput) || 0);
    let qA = total - xA;
    const payload = {
      action: mode, rowIndex: editingRowIndex, date: date.replace(/-/g, '/'), item: item.trim(), payer,
      amountTwd: currency === 'TWD' ? total : 0, amountJpy: currency === 'JPY' ? total : 0, note: note.trim(), splitType,
      splitXiangTwd: currency === 'TWD' ? xA : 0, splitXiangJpy: currency === 'JPY' ? xA : 0,
      splitQianTwd: currency === 'TWD' ? qA : 0, splitQianJpy: currency === 'JPY' ? qA : 0
    };
    try { await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) }); setShowModal(false); onAddSuccess(); }
    catch { console.error("儲存失敗"); } finally { setIsSubmitting(false); }
  };

  const renderSettlementItem = (amount: number, currency: 'TWD' | 'JPY') => {
    const absAmount = Math.abs(Math.round(amount));
    if (absAmount === 0) {
      return (
        <div className="bg-gray-50 p-6 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{currency === 'TWD' ? '台幣 TWD' : '日幣 JPY'}</div>
          <div className="text-xl font-bold text-gray-300">已結清</div>
        </div>
      );
    }
    const debtor = amount > 0 ? '錢錢' : '想想';
    const creditor = amount > 0 ? '想想' : '錢錢';
    const debtorColor = debtor === '想想' ? 'text-[#E91E63]' : 'text-[#2196F3]';
    const creditorColor = creditor === '想想' ? 'text-[#E91E63]' : 'text-[#2196F3]';
    return (
      <div className="bg-gray-50 p-6 flex flex-col items-center">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{currency === 'TWD' ? '台幣 TWD' : '日幣 JPY'}</div>
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-base font-black ${debtorColor}`}>{debtor}</span>
          <span className="text-gray-300">➔</span>
          <span className={`text-base font-black ${creditorColor}`}>{creditor}</span>
        </div>
        <div className="text-3xl font-mono font-bold text-mag-black">
          {currency === 'TWD' ? '$' : '¥'}{absAmount.toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-32 pt-1 animate-in fade-in duration-700">
      <div className="bg-white border border-gray-200 rounded-none overflow-hidden mb-8 shadow-sm">
        <div className="px-5 py-3 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-noto font-bold text-mag-black tracking-tight">旅費總覽</h2>
          <button onClick={onRefresh} className="text-gray-400 active:text-mag-black">
            <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
          <div className="p-3 text-center">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">JPY</div>
            <div className="text-2xl font-bold text-mag-black font-mono">¥{totalJPY.toLocaleString()}</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">TWD</div>
            <div className="text-2xl font-bold text-mag-black font-mono">${totalTWD.toLocaleString()}</div>
          </div>
        </div>
        <button onClick={() => setShowSettlement(true)} className="w-full bg-mag-black text-white py-3.5 font-bold text-sm tracking-[0.2em] flex items-center justify-center gap-2 active:bg-gray-800">
          結算精算 SETTLE
        </button>
      </div>

      <div className="flex justify-between items-end mb-6">
        <h3 className="text-xl font-noto font-bold text-mag-black inline-block">支出明細</h3>
        <button onClick={handleOpenAdd} className="bg-mag-black text-white p-2 shadow-md active:scale-95 transition-transform flex items-center justify-center">
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {expenses.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-400 font-bold border border-dashed border-gray-200">目前尚無支出明細</div>
        )}
        {expenses.map((record) => (
          <div key={record.rowIndex} className="bg-white p-4 rounded-none border border-gray-100 shadow-sm active:bg-gray-50 flex items-center gap-2 overflow-hidden" onClick={(e) => handleOpenEdit(e, record)}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`shrink-0 px-2 py-0.5 text-[9px] font-bold text-white rounded-none ${record.payer === '想想' ? 'bg-[#E91E63]' : 'bg-[#2196F3]'}`}>{record.payer === '想想' ? '想想' : '錢錢'}</span>
                <span className="text-base font-bold text-mag-black truncate">{record.item}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-gray-400">{record.date.split('T')[0].replace(/-/g, '/')}</span>
                {record.splitType === 'manual' && <span className="bg-[#FDF6E3] text-[#B58900] text-[8px] px-1.5 py-0.5 font-bold border border-[#EEE8D5] shrink-0">手動分帳</span>}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
               <div className="text-lg font-bold text-mag-black font-mono whitespace-nowrap">{record.amountJpy > 0 ? `¥${record.amountJpy.toLocaleString()}` : `$${record.amountTwd.toLocaleString()}`}</div>
               <div className="flex gap-1 shrink-0">
                 <button onClick={(e) => handleOpenEdit(e, record)} className="p-1 text-gray-300"><EditIcon className="w-4 h-4" /></button>
                 <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(record.rowIndex); }} className="p-1 text-gray-300 active:text-red-500"><TrashIcon className="w-4 h-4" /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 mb-8">
         <a href={GOOGLE_SHEET_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-mag-gold">
           <SheetIcon className="w-4 h-4" /> open google sheet
         </a>
      </div>

      {showSettlement && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettlement(false)} />
          <div className="bg-white text-mag-black w-full max-w-sm rounded-none p-8 z-10 animate-in zoom-in-95 border-t-8 border-mag-black">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold tracking-tight">結算面板</h3>
                <button onClick={() => setShowSettlement(false)} className="text-gray-300"><XIcon className="w-6 h-6" /></button>
             </div>
             <div className="space-y-6">
                {renderSettlementItem(settlement.twd, 'TWD')}
                {renderSettlementItem(settlement.jpy, 'JPY')}
             </div>
             <p className="mt-8 text-[11px] text-gray-400 font-bold text-center leading-relaxed">結算金額由雙方支付總額與應付份額計算所得。<br/>箭頭指向為應支付對象。</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-sm rounded-none p-5 z-10 overflow-hidden shadow-2xl relative border-t-4 border-mag-black">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-serif font-bold tracking-tight text-mag-black">{mode === 'edit' ? '編輯消費' : '新增消費'}</h3>
               <button onClick={() => setShowModal(false)} className="text-mag-gray p-1"><XIcon className="w-6 h-6" /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[9px] font-black uppercase text-mag-gray mb-1 block tracking-wide">日期 DATE</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#F7F7F7] p-2 rounded-none font-bold text-sm outline-none border-b border-gray-100" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-black uppercase text-mag-gray mb-1 block tracking-wide">支付者 PAYER</label>
                    <div className="flex border-[1.5px] border-mag-black overflow-hidden h-[36px]">
                        <button type="button" onClick={() => setPayer('想想')} className={`flex-1 font-bold text-xs transition-all ${payer === '想想' ? 'bg-[#E91E63] text-white' : 'bg-white text-mag-black'}`}>想想</button>
                        <button type="button" onClick={() => setPayer('錢錢')} className={`flex-1 font-bold text-xs transition-all ${payer === '錢錢' ? 'bg-[#2196F3] text-white' : 'bg-white text-mag-black'}`}>錢錢</button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-mag-gray mb-1 block tracking-wide">內容 DESCRIPTION</label>
                  <input type="text" placeholder="輸入消費內容" value={item} onChange={e => setItem(e.target.value)} className="w-full bg-[#F7F7F7] p-2.5 rounded-none font-bold text-base outline-none border-b border-gray-100" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-mag-gray mb-1 block tracking-wide">金額 AMOUNT</label>
                  <div className="flex bg-[#F7F7F7] items-center border-b border-gray-100 px-3 h-[56px] gap-2">
                    <input type="number" placeholder="0" value={amount} onChange={e => handleAmountChange(e.target.value)} className="flex-1 min-w-0 bg-transparent py-2.5 rounded-none font-bold text-2xl outline-none" />
                    <div className="flex shrink-0">
                       <div className="flex bg-white shadow-sm border border-gray-200 overflow-hidden h-[30px] rounded-sm">
                          <button type="button" onClick={() => setCurrency('JPY')} className={`px-2.5 flex items-center justify-center font-bold text-[10px] transition-colors ${currency === 'JPY' ? 'bg-mag-black text-white' : 'text-gray-400 hover:bg-gray-50'}`}>JPY</button>
                          <button type="button" onClick={() => setCurrency('TWD')} className={`px-2.5 flex items-center justify-center font-bold text-[10px] transition-colors ${currency === 'TWD' ? 'bg-mag-black text-white' : 'text-gray-400 hover:bg-gray-50'}`}>TWD</button>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F8F8F8] p-3 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-mag-black">分帳模式</label>
                      <select value={splitType} onChange={e => setSplitType(e.target.value as any)} className="appearance-none bg-white border border-mag-black py-1 px-3 text-[10px] font-bold rounded-none outline-none">
                          <option value="manual">自定義金額</option>
                          <option value="equal">平均分攤</option>
                      </select>
                    </div>
                    <div className="w-full h-[1px] border-t border-dashed border-gray-300"></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[8px] font-black text-[#E91E63] mb-0.5 block">想想負擔</label>
                          <input type="number" disabled={splitType === 'equal'} value={splitType === 'equal' ? (Math.round(Number(amount)/2) || 0) : manualXiangInput} onChange={e => handleManualXiangChange(e.target.value)} className={`w-full bg-white p-2 text-base font-mono font-bold border border-gray-200 outline-none ${splitType === 'equal' ? 'opacity-60 bg-transparent' : 'focus:border-[#E91E63]'}`} />
                        </div>
                        <div>
                          <label className="text-[8px] font-black text-[#2196F3] mb-0.5 block">錢錢負擔</label>
                          <input type="number" disabled={splitType === 'equal'} value={splitType === 'equal' ? (Number(amount) - Math.round(Number(amount)/2) || 0) : manualQianInput} onChange={e => handleManualQianChange(e.target.value)} className={`w-full bg-white p-2 text-base font-mono font-bold border border-gray-200 outline-none ${splitType === 'equal' ? 'opacity-60 bg-transparent' : 'focus:border-[#2196F3]'}`} />
                        </div>
                    </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-mag-gray mb-1 block tracking-wide">備註 NOTE</label>
                  <input type="text" placeholder="選填項目細節" value={note} onChange={e => setNote(e.target.value)} className="w-full bg-[#F7F7F7] p-2 rounded-none font-bold outline-none border-b border-gray-100 text-xs" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border-[1.5px] border-gray-200 text-mag-black font-bold text-sm active:bg-gray-50 transition-all">取消</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-mag-black text-white font-bold text-sm active:bg-gray-800 transition-all">{isSubmitting ? '儲存中...' : '儲存項目'}</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
           <div className="bg-white p-8 rounded-none z-10 w-full max-w-xs text-center border-t-8 border-red-500">
              <h3 className="text-xl font-bold mb-8 text-mag-black">確定要刪除此項目？</h3>
              <div className="flex gap-3">
                 <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-4 bg-gray-100 font-bold text-sm text-gray-500">取消</button>
                 <button onClick={handleConfirmDelete} className="flex-1 py-4 bg-red-500 text-white font-bold text-sm active:bg-red-600">{isDeleting ? '...' : '確認刪除'}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
