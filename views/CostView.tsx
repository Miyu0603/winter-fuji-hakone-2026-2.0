
import React, { useState, useMemo, useEffect } from 'react';
import { GOOGLE_SCRIPT_URL, GOOGLE_SHEET_URL } from '../constants';
import { SheetIcon, PlusIcon, RefreshIcon, EditIcon, TrashIcon, CheckCircleIcon, XIcon } from '../components/Icons';
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
  fetchError, 
  onRefresh,
  onAddSuccess
}) => {
  // --- STATE ---
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  
  // Custom Confirmation Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form Data
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'JPY' | 'TWD'>('JPY');
  const [item, setItem] = useState('');
  const [payer, setPayer] = useState<'想想' | '錢錢'>('想想');
  const [note, setNote] = useState('');

  // Split Logic State
  const [splitType, setSplitType] = useState<'equal' | 'manual'>('equal');
  const [manualXiangInput, setManualXiangInput] = useState(''); // Stores input for the active currency

  // Processing States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);

  // --- CALCULATIONS ---
  // 1. Total Spending
  const totalTWD = expenses.reduce((sum, r) => sum + r.amountTwd, 0);
  const totalJPY = expenses.reduce((sum, r) => sum + r.amountJpy, 0);

  // 2. Settlement Calculation
  // Logic: 
  // Xiang Balance = (Xiang Paid) - (Xiang Should Pay)
  // If Positive: Xiang paid more than share -> Qian owes Xiang
  // If Negative: Xiang paid less than share -> Xiang owes Qian
  const settlement = useMemo(() => {
    let xiangPaidTwd = 0;
    let xiangPaidJpy = 0;
    let xiangShouldPayTwd = 0;
    let xiangShouldPayJpy = 0;

    expenses.forEach(r => {
      // Who Paid
      if (r.payer === '想想') {
        xiangPaidTwd += r.amountTwd;
        xiangPaidJpy += r.amountJpy;
      }

      // Who Should Pay (Split columns)
      xiangShouldPayTwd += r.splitXiangTwd || 0;
      xiangShouldPayJpy += r.splitXiangJpy || 0;
    });

    return {
      twd: xiangPaidTwd - xiangShouldPayTwd,
      jpy: xiangPaidJpy - xiangShouldPayJpy
    };
  }, [expenses]);

  // --- FORMATTERS ---
  const formatMoney = (val: number, curr: 'JPY' | 'TWD') => {
    return `$${Math.round(val).toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}/${m}/${d}`;
    }
    return dateStr;
  };

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setActionError(null);
    setMode('add');
    setEditingRowIndex(null);
    
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setDate(`${y}-${m}-${d}`);
    
    setAmount(''); 
    setItem(''); 
    setPayer('想想'); 
    setNote(''); 
    setCurrency('JPY');
    
    // Default Split
    setSplitType('equal');
    setManualXiangInput('');
    
    setShowModal(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, record: ExpenseRecord) => {
    e.stopPropagation();
    setActionError(null);
    setMode('edit');
    setEditingRowIndex(record.rowIndex);
    
    const dateObj = new Date(record.date);
    if (!isNaN(dateObj.getTime())) {
       const y = dateObj.getFullYear();
       const m = String(dateObj.getMonth() + 1).padStart(2, '0');
       const d = String(dateObj.getDate()).padStart(2, '0');
       setDate(`${y}-${m}-${d}`);
    } else {
       setDate(''); 
    }

    setItem(record.item);
    setPayer(record.payer);
    setNote(record.note);
    setSplitType(record.splitType || 'equal');
    
    // Set currency and amount based on what was saved
    if (record.amountTwd > 0) {
      setCurrency('TWD');
      setAmount(String(record.amountTwd));
      // If manual, prepopulate input
      if (record.splitType === 'manual') {
        setManualXiangInput(String(record.splitXiangTwd));
      } else {
        setManualXiangInput('');
      }
    } else {
      setCurrency('JPY');
      setAmount(String(record.amountJpy));
      if (record.splitType === 'manual') {
        setManualXiangInput(String(record.splitXiangJpy));
      } else {
        setManualXiangInput('');
      }
    }
    
    setShowModal(true);
  };

  const handleRequestDelete = (e: React.MouseEvent, rowIndex: number) => {
    e.stopPropagation();
    e.preventDefault();
    setActionError(null);

    const numericRowIndex = Number(rowIndex);
    if (!numericRowIndex || numericRowIndex <= 0 || isNaN(numericRowIndex)) {
      setActionError(`無法刪除：資料缺少行號 (rowIndex: ${rowIndex})。請更新 GAS。`);
      return;
    }
    
    setDeleteConfirmId(numericRowIndex);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId === null) return;
    setIsDeleting(true);
    setActionError(null);

    try {
      const payload = { action: 'delete', rowIndex: deleteConfirmId };
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { "Content-Type": "text/plain;charset=utf-8" }, 
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      
      if (result.result === "success") {
        setDeleteConfirmId(null);
        onAddSuccess(); 
      } else {
        setActionError("刪除失敗：" + (result.error || "未知錯誤"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      setActionError("刪除失敗，請檢查網路連線");
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate split amounts for display and submission
  const calculateSplits = () => {
    const total = Number(amount) || 0;
    
    let xiangAmt = 0;
    let qianAmt = 0;

    if (splitType === 'equal') {
      xiangAmt = total / 2;
      qianAmt = total / 2;
    } else {
      // Manual
      xiangAmt = Number(manualXiangInput) || 0;
      qianAmt = total - xiangAmt;
    }

    // Assign to correct currency buckets
    const splits = {
      splitXiangTwd: currency === 'TWD' ? xiangAmt : 0,
      splitXiangJpy: currency === 'JPY' ? xiangAmt : 0,
      splitQianTwd: currency === 'TWD' ? qianAmt : 0,
      splitQianJpy: currency === 'JPY' ? qianAmt : 0,
    };

    return { xiangAmt, qianAmt, splits };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    if (!amount || !item) return;

    setIsSubmitting(true);

    try {
      const dateObj = new Date(date);
      const formattedDate = !isNaN(dateObj.getTime()) 
          ? `${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}`
          : date;

      const { splits } = calculateSplits();

      const payload = {
        action: mode,
        rowIndex: editingRowIndex,
        date: formattedDate,
        item: item.trim(),
        payer: payer,
        amountTwd: currency === 'TWD' ? Number(amount) : 0,
        amountJpy: currency === 'JPY' ? Number(amount) : 0,
        note: note.trim(),
        // Split Data Fields
        splitType: splitType,
        ...splits
      };
      
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      setShowModal(false);
      onAddSuccess();

    } catch (error) {
      console.error(error);
      setActionError("提交失敗，請檢查網路");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { xiangAmt: currentXiangSplit, qianAmt: currentQianSplit } = calculateSplits();

  return (
    <div className="pb-32 pt-5 px-5 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-mag-gray uppercase mb-1 pl-1">EXPENSES</h2>
          <h3 className="text-2xl font-serif font-bold text-mag-black">消費紀錄</h3>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={() => setShowSettlement(true)} 
              className="p-3 rounded-full shadow-sm active:scale-95 transition-all bg-white text-mag-gray border border-gray-200 hover:text-mag-black"
              title="顯示結算"
            >
                <span className="font-bold text-xs">結算</span>
            </button>
            <button onClick={() => { setActionError(null); onRefresh(); }} className="bg-white text-mag-gray border border-gray-200 p-3 rounded-full shadow-sm hover:text-mag-black active:scale-95 transition-all">
                <RefreshIcon className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleOpenAdd} className="bg-mag-gold text-white p-3 rounded-full shadow-lg hover:bg-[#b08d48] active:scale-95 transition-transform">
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
      </div>

      {/* SUMMARY (Always Visible) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-mag-black text-white p-5 rounded-xl shadow-float">
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-2">Total JPY</div>
          <div className="text-2xl font-mono font-bold">¥{totalJPY.toLocaleString()}</div>
        </div>
        <div className="bg-white text-mag-black border border-gray-100 p-5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-mag-gray mb-2">Total TWD</div>
          <div className="text-2xl font-mono font-bold text-mag-black">${totalTWD.toLocaleString()}</div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {(fetchError || actionError) && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center text-sm font-bold mb-6 whitespace-pre-line leading-relaxed shadow-sm animate-in fade-in slide-in-from-top-2">
          {fetchError || actionError}
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {expenses.length === 0 && !isLoading ? (
          <div className="text-center py-10 text-gray-400 border border-dashed rounded-xl">尚無紀錄</div>
        ) : (
          expenses.map((record) => {
            const isValidRow = record.rowIndex && record.rowIndex > 0;
            return (
              <div key={record.rowIndex || Math.random()} className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${isDeleting && deleteConfirmId === record.rowIndex ? 'opacity-50' : ''}`}>
                
                {/* TOP ROW: Metadata */}
                <div className="flex justify-between items-start gap-2 mb-1">
                   <div className="flex flex-wrap items-center gap-2 flex-1">
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        {formatDate(record.date)}
                      </span>
                      <span className={`text-[10px] font-bold border px-1.5 py-0.5 rounded ${
                        record.payer === '想想' ? 'border-pink-200 text-pink-500 bg-pink-50' : 'border-blue-200 text-blue-600 bg-blue-50'
                      }`}>
                        {record.payer}
                      </span>
                      {record.splitType === 'manual' && (
                        <span className="text-[10px] font-bold border border-gray-200 text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                          手動分帳
                        </span>
                      )}
                      {record.note && (
                         <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded inline-block truncate max-w-[120px]">
                           {record.note}
                         </span>
                      )}
                   </div>

                   {/* Actions Buttons */}
                   <div className="flex gap-1 shrink-0">
                      <button 
                        type="button"
                        onClick={(e) => handleOpenEdit(e, record)}
                        className="p-1.5 bg-gray-50 text-gray-400 hover:text-mag-gold hover:bg-mag-gold/10 rounded-lg transition-colors cursor-pointer active:scale-95"
                        title="編輯"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>

                      <button 
                        type="button"
                        onClick={(e) => handleRequestDelete(e, record.rowIndex)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer active:scale-95 ${isValidRow ? 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50' : 'bg-red-50 text-red-500'}`}
                        title={isValidRow ? "刪除" : "資料異常"}
                      >
                        {!isValidRow ? <span className="text-xs font-bold">⚠️</span> : <TrashIcon className="w-4 h-4" />}
                      </button>
                   </div>
                </div>

                {/* BOTTOM ROW: Item Name & Amount */}
                <div className="flex justify-between items-center gap-4">
                   <h4 className="text-base font-bold text-mag-black leading-tight break-words flex-1">
                     {record.item}
                   </h4>
                   
                   <div className="text-base font-bold font-mono text-mag-black text-right shrink-0">
                      {record.amountJpy > 0 && <div>{formatMoney(record.amountJpy, 'JPY')}</div>}
                      {record.amountTwd > 0 && <div>{formatMoney(record.amountTwd, 'TWD')}</div>}
                   </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      <div className="text-center mt-8">
         <a href={GOOGLE_SHEET_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-mag-gray hover:text-mag-gold text-xs font-bold uppercase">
           <SheetIcon className="w-4 h-4" /> Open Google Sheets
         </a>
      </div>

      {/* SETTLEMENT MODAL */}
      {showSettlement && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettlement(false)} />
          <div className="bg-gradient-to-br from-mag-black to-gray-800 text-white w-full max-w-sm rounded-2xl shadow-2xl z-10 p-6 animate-in zoom-in-95 duration-200">
             
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h4 className="text-mag-gold font-bold text-sm tracking-widest uppercase mb-1">SETTLEMENT</h4>
                   <h3 className="text-xl font-serif font-bold">結算面板</h3>
                </div>
                <button onClick={() => setShowSettlement(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                   <XIcon className="w-5 h-5 text-white" />
                </button>
             </div>

             <div className="grid grid-cols-2 gap-8 relative mb-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-12 bg-white/20"></div>
                
                {/* TWD Balance */}
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-400 mb-1">台幣結算</div>
                  <div className={`text-2xl font-mono font-bold ${settlement.twd === 0 ? 'text-white' : settlement.twd > 0 ? 'text-green-400' : 'text-red-400'}`}>
                     {settlement.twd > 0 ? '+' : ''}{Math.round(settlement.twd).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {Math.abs(settlement.twd) === 0 ? '兩清' : settlement.twd > 0 ? '錢錢 給 想想' : '想想 給 錢錢'}
                  </div>
                </div>

                {/* JPY Balance */}
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-400 mb-1">日幣結算</div>
                  <div className={`text-2xl font-mono font-bold ${settlement.jpy === 0 ? 'text-white' : settlement.jpy > 0 ? 'text-green-400' : 'text-red-400'}`}>
                     {settlement.jpy > 0 ? '+' : ''}{Math.round(settlement.jpy).toLocaleString()}
                  </div>
                   <div className="text-[10px] text-gray-400 mt-1">
                    {Math.abs(settlement.jpy) === 0 ? '兩清' : settlement.jpy > 0 ? '錢錢 給 想想' : '想想 給 錢錢'}
                  </div>
                </div>
             </div>

             <div className="bg-white/10 rounded-lg p-3 text-center">
                <span className="text-[10px] text-gray-300">正數 = 錢錢欠想想 / 負數 = 想想欠錢錢</span>
             </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl z-10 p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between mb-4">
                <h3 className="text-xl font-serif font-bold">{mode === 'edit' ? '編輯項目' : '新增項目'}</h3>
                <button type="button" onClick={() => setShowModal(false)}><span className="text-2xl text-gray-400">×</span></button>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">日期</label>
                      <input 
                          type="date" required
                          value={date} onChange={e => setDate(e.target.value)}
                          className="w-full bg-gray-50 p-2.5 rounded-lg font-bold text-sm outline-none focus:ring-2 ring-mag-gold/20 text-mag-black"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">付款者</label>
                      <div className="flex gap-2">
                          {(['想想', '錢錢'] as const).map(p => (
                            <button type="button" key={p} onClick={() => setPayer(p)}
                                className={`flex-1 py-2.5 text-xs font-bold rounded-lg border transition-all ${payer === p ? 'border-mag-gold bg-mag-gold/10 text-mag-gold' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                {p}
                            </button>
                          ))}
                      </div>
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1">項目名稱</label>
                   <input 
                      type="text" placeholder="例如：晚餐" required
                      value={item} onChange={e => setItem(e.target.value)}
                      className="w-full bg-gray-50 p-3 rounded-lg font-bold text-base outline-none focus:ring-2 ring-mag-gold/20"
                   />
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1">總金額</label>
                   <div className="relative">
                      <input 
                         type="number" inputMode="decimal" placeholder="0" required 
                         value={amount} onChange={e => setAmount(e.target.value)}
                         className="w-full bg-gray-50 text-2xl font-serif font-bold p-3 pr-32 rounded-lg outline-none focus:ring-2 ring-mag-gold/20"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 p-1 rounded-lg grid grid-cols-2 gap-0.5 w-[100px]">
                         {(['JPY', 'TWD'] as const).map(c => (
                            <button type="button" key={c} onClick={() => setCurrency(c)}
                               className={`py-1 text-[10px] font-bold rounded-md transition-all text-center ${currency === c ? 'bg-mag-black text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                               {c}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>

                {/* 2. Split Logic Section */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <div className="flex justify-between items-center mb-3">
                      <label className="text-xs font-bold text-mag-gold uppercase tracking-widest">分帳方式</label>
                      <select 
                        value={splitType}
                        onChange={(e) => setSplitType(e.target.value as any)}
                        className="bg-white border border-gray-200 text-xs font-bold text-mag-black py-1 px-2 rounded-lg outline-none"
                      >
                         <option value="equal">平均分攤</option>
                         <option value="manual">手動分攤</option>
                      </select>
                   </div>
                   
                   {splitType === 'equal' ? (
                      <div className="flex justify-between text-sm font-medium text-gray-500 bg-white p-3 rounded-lg border border-dashed border-gray-200">
                         <div>想想: {Math.round(currentXiangSplit)}</div>
                         <div className="w-[1px] bg-gray-200 h-5"></div>
                         <div>錢錢: {Math.round(currentQianSplit)}</div>
                      </div>
                   ) : (
                      <div className="space-y-3">
                         {/* Xiang Input */}
                         <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1">想想 應付</label>
                            <input 
                               type="number" inputMode="decimal" placeholder="0"
                               value={manualXiangInput} onChange={e => setManualXiangInput(e.target.value)}
                               className="w-full bg-white border border-gray-200 p-2 rounded-lg font-bold text-sm outline-none focus:border-mag-gold"
                            />
                         </div>
                         {/* Qian Calculated */}
                         <div>
                             <label className="block text-[10px] font-bold text-gray-400 mb-1">錢錢 應付 (自動計算)</label>
                             <div className="w-full bg-gray-100 border border-transparent p-2 rounded-lg font-bold text-sm text-gray-500">
                                {Math.round(currentQianSplit)}
                             </div>
                         </div>
                      </div>
                   )}
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1">備註</label>
                   <input 
                      type="text" placeholder="補充說明..."
                      value={note} onChange={e => setNote(e.target.value)}
                      className="w-full bg-gray-50 p-3 rounded-lg text-sm font-medium outline-none focus:ring-2 ring-mag-gold/20"
                   />
                </div>

                <div className="pt-2">
                    <button 
                       type="submit" disabled={isSubmitting}
                       className="w-full bg-mag-gold text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#b08d48] transition-transform active:scale-95 disabled:opacity-50 text-lg"
                    >
                       {isSubmitting ? '處理中...' : '確認儲存'}
                    </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteConfirmId(null)} />
           <div className="bg-white w-full max-w-xs rounded-2xl shadow-2xl z-10 p-6 animate-in zoom-in-95 duration-200 text-center">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <TrashIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-mag-black mb-2">確定要刪除嗎？</h3>
              <p className="text-sm text-gray-500 mb-6">刪除後將無法復原此筆消費紀錄。</p>
              
              <div className="flex gap-3">
                 <button 
                   onClick={() => setDeleteConfirmId(null)}
                   disabled={isDeleting}
                   className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 active:scale-95 disabled:opacity-50"
                 >
                   取消
                 </button>
                 <button 
                   onClick={handleConfirmDelete}
                   disabled={isDeleting}
                   className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {isDeleting ? '刪除中...' : '確認刪除'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
