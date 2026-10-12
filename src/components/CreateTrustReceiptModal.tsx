import React, { useState } from 'react';
import {
  X,
  FileCheck,
  Clock,
  UserCheck,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { SharedPerson } from '../data/sharedPeople';
import { TrustReceipt, saveTrustReceipts, loadTrustReceipts } from '../data/trustReceipts';

interface CreateTrustReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePeople: SharedPerson[];
  initialPersonId?: string | null;
  initialQuote?: string;
  onReceiptCreated: (receipt: TrustReceipt) => void;
}

export function CreateTrustReceiptModal({
  isOpen,
  onClose,
  availablePeople,
  initialPersonId,
  initialQuote = '',
  onReceiptCreated,
}: CreateTrustReceiptModalProps) {
  const [selectedPersonId, setSelectedPersonId] = useState<string>(
    initialPersonId || (availablePeople[0]?.id ?? '')
  );
  const [personSearch, setPersonSearch] = useState('');
  const [commitment, setCommitment] = useState(initialQuote);
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'review'>('form');

  // Initialize with tonight at 11:59 PM (or 6 hours from now)
  const [deadlinePreset, setDeadlinePreset] = useState<
    '2h' | 'tonight' | 'tomorrow' | '3days' | '1week' | 'custom'
  >('tonight');

  const initialTarget = new Date();
  initialTarget.setHours(23, 59, 0, 0);

  const [customYear, setCustomYear] = useState<number>(() => initialTarget.getFullYear());
  const [customMonth, setCustomMonth] = useState<number>(() => initialTarget.getMonth()); // 0-11
  const [customDay, setCustomDay] = useState<number>(() => initialTarget.getDate());
  const [customHour12, setCustomHour12] = useState<number>(11);
  const [customMinute, setCustomMinute] = useState<number>(59);
  const [customAmPm, setCustomAmPm] = useState<'AM' | 'PM'>('PM');

  if (!isOpen) return null;

  const selectedPerson = availablePeople.find((p) => p.id === selectedPersonId) || availablePeople[0];

  const filteredPeople = availablePeople.filter(
    (p) =>
      p.name.toLowerCase().includes(personSearch.toLowerCase()) ||
      p.handle.toLowerCase().includes(personSearch.toLowerCase()) ||
      p.city.toLowerCase().includes(personSearch.toLowerCase())
  );

  // Helper to apply quick presets
  const applyPreset = (preset: '2h' | 'tonight' | 'tomorrow' | '3days' | '1week') => {
    setDeadlinePreset(preset);
    const d = new Date();
    if (preset === '2h') {
      d.setHours(d.getHours() + 2);
    } else if (preset === 'tonight') {
      d.setHours(23, 59, 0, 0);
    } else if (preset === 'tomorrow') {
      d.setDate(d.getDate() + 1);
      d.setHours(18, 0, 0, 0);
    } else if (preset === '3days') {
      d.setDate(d.getDate() + 3);
      d.setHours(18, 0, 0, 0);
    } else if (preset === '1week') {
      d.setDate(d.getDate() + 7);
      d.setHours(18, 0, 0, 0);
    }
    setCustomYear(d.getFullYear());
    setCustomMonth(d.getMonth());
    setCustomDay(d.getDate());
    const h = d.getHours() % 12;
    setCustomHour12(h === 0 ? 12 : h);
    setCustomMinute(d.getMinutes());
    setCustomAmPm(d.getHours() >= 12 ? 'PM' : 'AM');
  };

  // Helper when user selects from HTML5 datetime-local picker
  const handleDatetimeLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const d = new Date(e.target.value);
    if (!isNaN(d.getTime())) {
      setCustomYear(d.getFullYear());
      setCustomMonth(d.getMonth());
      setCustomDay(d.getDate());
      const h = d.getHours() % 12;
      setCustomHour12(h === 0 ? 12 : h);
      setCustomMinute(d.getMinutes());
      setCustomAmPm(d.getHours() >= 12 ? 'PM' : 'AM');
      setDeadlinePreset('custom');
    }
  };

  // Compute actual target timestamp
  const hour24 =
    customAmPm === 'PM'
      ? customHour12 === 12
        ? 12
        : customHour12 + 12
      : customHour12 === 12
      ? 0
      : customHour12;

  const targetDate = new Date(customYear, customMonth, customDay, hour24, customMinute, 0, 0);
  const deadlineAt = targetDate.getTime();
  const isPast = deadlineAt <= Date.now();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayOfWeekName = daysOfWeek[targetDate.getDay()];
  const monthName = monthNames[customMonth];
  const formattedTime = `${String(customHour12).padStart(2, '0')}:${String(customMinute).padStart(2, '0')} ${customAmPm}`;
  const deadlineLabel = `${dayOfWeekName}, ${monthName} ${customDay}, ${customYear} at ${formattedTime}`;

  // Days in month calculation
  const daysInMonth = new Date(customYear, customMonth + 1, 0).getDate();

  // Diff breakdown for remaining preview
  const diffMs = deadlineAt - Date.now();
  const diffMinutes = Math.floor(Math.abs(diffMs) / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const remHours = diffHours % 24;
  const remMins = diffMinutes % 60;

  let remainingText = '';
  if (isPast) {
    remainingText = 'Past deadline';
  } else if (diffDays > 0) {
    remainingText = `~${diffDays}d ${remHours}h ${remMins}m remaining`;
  } else if (diffHours > 0) {
    remainingText = `~${diffHours}h ${remMins}m remaining`;
  } else {
    remainingText = `~${remMins}m remaining`;
  }

  // HTML5 datetime-local string (YYYY-MM-DDTHH:mm)
  const datetimeLocalValue = `${customYear}-${String(customMonth + 1).padStart(2, '0')}-${String(customDay).padStart(2, '0')}T${String(hour24).padStart(2, '0')}:${String(customMinute).padStart(2, '0')}`;

  const handleSubmit = () => {
    if (!commitment.trim() || !selectedPerson) return;

    const receiptNumber = `TR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt: TrustReceipt = {
      id: `tr-${Date.now()}`,
      receiptNumber,
      promiserId: selectedPerson.id,
      promiserName: selectedPerson.name,
      promiserHandle: selectedPerson.handle,
      promiserAvatarUrl: selectedPerson.avatarUrl,
      promiserAvatarInitial: selectedPerson.avatarInitial || selectedPerson.name.charAt(0),
      promiserAvatarBg: selectedPerson.avatarBg || 'bg-slate-800',
      promiserCity: selectedPerson.city,
      promiserPercent: selectedPerson.percent ?? selectedPerson.matchPercent ?? 85,
      creatorId: 'user-me',
      creatorName: 'You',
      commitment: commitment.trim(),
      amount: amount.trim() ? amount.trim() : undefined,
      createdAt: Date.now(),
      deadlineAt,
      deadlineLabel,
      history: [
        {
          id: `h-${Date.now()}`,
          action: 'Receipt Created',
          timestamp: Date.now(),
          actor: 'You',
          note: `Trust Receipt ${receiptNumber} created and awaiting acknowledgement from ${selectedPerson.name}.`,
        },
      ],
    };

    const currentReceipts = loadTrustReceipts();
    const updated = [newReceipt, ...currentReceipts];
    saveTrustReceipts(updated);

    onReceiptCreated(newReceipt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
              <FileCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-900 leading-tight">
                {step === 'form' ? 'Create Trust Receipt' : 'Review & Confirm Trust Receipt'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                FAIRY Relationship &amp; Commitment Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {step === 'form' ? (
            <>
              {/* Step 1: Person Involved */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  1. Person Involved (User A)
                </label>

                {/* Selected Person Card */}
                {selectedPerson && (
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-full ${selectedPerson.avatarBg} text-white font-black text-sm flex items-center justify-center overflow-hidden shadow-xs shrink-0`}
                      >
                        {selectedPerson.avatarUrl ? (
                          <img
                            src={selectedPerson.avatarUrl}
                            alt={selectedPerson.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          selectedPerson.avatarInitial || selectedPerson.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-slate-900">
                            {selectedPerson.name}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                            {selectedPerson.percent ?? selectedPerson.matchPercent}% match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {selectedPerson.handle} &middot; {selectedPerson.city}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-200">
                      Promiser
                    </span>
                  </div>
                )}

                {/* Quick search and people picker */}
                <div className="space-y-2 pt-1">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={personSearch}
                      onChange={(e) => setPersonSearch(e.target.value)}
                      placeholder="Search person to make deal with by name, handle, or city..."
                      className="w-full bg-slate-100 focus:bg-white rounded-xl pl-8 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black border border-transparent focus:border-slate-200 transition-all"
                    />
                    {personSearch && (
                      <button
                        type="button"
                        onClick={() => setPersonSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Horizontal one-click picker for quick switching */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                    {filteredPeople.map((p) => {
                      const isSelected = p.id === selectedPersonId;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedPersonId(p.id);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-black text-white border-black shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full ${p.avatarBg} text-white font-bold text-[9px] flex items-center justify-center shrink-0`}
                          >
                            {p.avatarInitial || p.name.charAt(0)}
                          </div>
                          <span className="text-[11px] font-extrabold whitespace-nowrap">{p.name}</span>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {personSearch && (
                    <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white shadow-lg animate-in fade-in duration-150">
                      {filteredPeople.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedPersonId(p.id);
                            setPersonSearch('');
                          }}
                          className="w-full p-2.5 text-left flex items-center justify-between hover:bg-purple-50/60 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full ${p.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                            >
                              {p.avatarInitial || p.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{p.name}</span>
                                <span className="text-[10px] text-slate-500">{p.handle}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">{p.city}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            Select &rarr;
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Promise / Commitment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    2. Their Commitment (Exact Words)
                  </label>
                  <span className="text-[10px] text-slate-400 font-bold">Required</span>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={commitment}
                    onChange={(e) => setCommitment(e.target.value)}
                    placeholder='e.g. "I will pay you ₦50,000 by the end of today." or "I will review your code prototype by 6 PM."'
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white leading-relaxed resize-none shadow-2xs"
                  />
                </div>

                {/* Suggested Fast-fill samples */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      setCommitment('I will pay you ₦50,000 for the frontend commission by the end of today.')
                    }
                    className="text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    + "I will pay you ₦50,000..."
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCommitment('I will deliver the completed mobile layout Figma kit by tonight 11:59 PM.')
                    }
                    className="text-[10px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/80 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    + "I will deliver the Figma kit..."
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCommitment('I will test the vibe code prototype and send a 5-point audio breakdown.')
                    }
                    className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    + "I will test the prototype..."
                  </button>
                </div>
              </div>

              {/* Step 3: Optional Amount */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Optional: Financial Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    ₦ / $
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. ₦50,000 or $100"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                  />
                </div>
              </div>

              {/* Step 4: Deadline & Countdown with Day, Month, Year, and Time Picker */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-black" />
                    <span>3. Set Deadline (Date, Time, Day, Month &amp; Year)</span>
                  </label>
                  <span
                    className={`text-[11px] font-extrabold flex items-center gap-1 ${
                      isPast ? 'text-rose-600' : 'text-slate-900'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {remainingText}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPreset('2h')}
                    className={`py-1.5 px-2 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer text-center ${
                      deadlinePreset === '2h'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    +2 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('tonight')}
                    className={`py-1.5 px-2 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer text-center ${
                      deadlinePreset === 'tonight'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Tonight (11:59 PM)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('tomorrow')}
                    className={`py-1.5 px-2 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer text-center ${
                      deadlinePreset === 'tomorrow'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Tomorrow 6 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('3days')}
                    className={`py-1.5 px-2 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer text-center ${
                      deadlinePreset === '3days'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    In 3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('1week')}
                    className={`py-1.5 px-2 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer text-center ${
                      deadlinePreset === '1week'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    In 1 Week
                  </button>
                </div>

                {/* Detailed Date & Time Selector Box */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                  {/* Row 1: Month, Day, Year, Day of Week */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Date (Month, Day &amp; Year)
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        Day: {dayOfWeekName}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Month Selector */}
                      <div>
                        <label className="text-[9.5px] font-bold text-slate-400 block mb-0.5">Month</label>
                        <select
                          value={customMonth}
                          onChange={(e) => {
                            setCustomMonth(parseInt(e.target.value, 10));
                            setDeadlinePreset('custom');
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-2xs"
                        >
                          {monthNames.map((m, idx) => (
                            <option key={m} value={idx}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Day / Date Selector */}
                      <div>
                        <label className="text-[9.5px] font-bold text-slate-400 block mb-0.5">Day</label>
                        <select
                          value={Math.min(customDay, daysInMonth)}
                          onChange={(e) => {
                            setCustomDay(parseInt(e.target.value, 10));
                            setDeadlinePreset('custom');
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-2xs"
                        >
                          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>
                              Day {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Year Selector */}
                      <div>
                        <label className="text-[9.5px] font-bold text-slate-400 block mb-0.5">Year</label>
                        <select
                          value={customYear}
                          onChange={(e) => {
                            setCustomYear(parseInt(e.target.value, 10));
                            setDeadlinePreset('custom');
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-2xs"
                        >
                          {[2026, 2027, 2028, 2029, 2030].map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Time Selector (Hour, Minute, AM/PM) & Native Calendar Input */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                      Exact Time (Hours &amp; Minutes)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                      <div className="flex items-center gap-1.5">
                        {/* Hour */}
                        <div className="flex-1">
                          <label className="text-[9.5px] font-bold text-slate-400 block mb-0.5">Hour</label>
                          <select
                            value={customHour12}
                            onChange={(e) => {
                              setCustomHour12(parseInt(e.target.value, 10));
                              setDeadlinePreset('custom');
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-2xs"
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                              <option key={h} value={h}>
                                {String(h).padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>

                        <span className="text-slate-400 font-bold self-end pb-2">:</span>

                        {/* Minute */}
                        <div className="flex-1">
                          <label className="text-[9.5px] font-bold text-slate-400 block mb-0.5">Minute</label>
                          <select
                            value={customMinute}
                            onChange={(e) => {
                              setCustomMinute(parseInt(e.target.value, 10));
                              setDeadlinePreset('custom');
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-2xs"
                          >
                            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59].map((m) => (
                              <option key={m} value={m}>
                                {String(m).padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* AM / PM Toggle */}
                        <div className="self-end pb-0.5">
                          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl border border-slate-300">
                            <button
                              type="button"
                              onClick={() => {
                                setCustomAmPm('AM');
                                setDeadlinePreset('custom');
                              }}
                              className={`px-2 py-1 text-[10.5px] font-black rounded-lg transition-all cursor-pointer ${
                                customAmPm === 'AM'
                                  ? 'bg-black text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              AM
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomAmPm('PM');
                                setDeadlinePreset('custom');
                              }}
                              className={`px-2 py-1 text-[10.5px] font-black rounded-lg transition-all cursor-pointer ${
                                customAmPm === 'PM'
                                  ? 'bg-black text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              PM
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Or device picker */}
                      <div>
                        <label className="text-[9.5px] font-bold text-slate-400 block mb-0.5">
                          Or Pick Using Device Calendar:
                        </label>
                        <input
                          type="datetime-local"
                          value={datetimeLocalValue}
                          onChange={handleDatetimeLocalChange}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Selected Deadline Live Preview Banner */}
                  <div
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-medium ${
                      isPast
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {isPast ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <div>
                        <strong className="font-extrabold block text-xs">
                          {deadlineLabel}
                        </strong>
                        <span className="text-[10.5px] opacity-80">
                          {isPast
                            ? 'Warning: Deadline is in the past! Please pick a future date.'
                            : `${remainingText}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Review & Confirmation Screen */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed font-medium">
                  <strong className="font-extrabold block text-amber-950 mb-0.5">
                    Integrity Record Guarantee
                  </strong>
                  Once created, this Trust Receipt will be sent to <strong>{selectedPerson.name}</strong> for
                  formal acknowledgement. Once acknowledged, the commitment and deadline will permanently lock.
                </div>
              </div>

              {/* Digital Receipt Card Preview */}
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-5 shadow-xs relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-black">
                      TR
                    </div>
                    <span className="text-xs font-black tracking-widest text-slate-900 uppercase">
                      FAIRY TRUST RECEIPT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    AWAITING ACKNOWLEDGEMENT
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Promiser</span>
                    <span className="font-extrabold text-slate-900">{selectedPerson.name}</span>
                    <span className="text-[10px] text-slate-500 block">{selectedPerson.handle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Created By</span>
                    <span className="font-extrabold text-slate-900">You</span>
                    <span className="text-[10px] text-slate-500 block">FAIRY Relationship System</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black tracking-wider text-slate-400 block uppercase mb-1">
                    Their Commitment:
                  </span>
                  <blockquote className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-900 italic leading-relaxed">
                    "{commitment.trim()}"
                  </blockquote>
                </div>

                {amount.trim() && (
                  <div className="flex items-center justify-between p-2.5 bg-slate-100/70 rounded-xl">
                    <span className="text-xs font-bold text-slate-600">Attached Amount</span>
                    <span className="text-sm font-black text-slate-900">{amount.trim()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Deadline</span>
                    <span className="font-extrabold text-slate-900">{deadlineLabel}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Countdown</span>
                    <span className="font-mono font-extrabold text-amber-700">{remainingText}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
          {step === 'form' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-extrabold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                {isPast && (
                  <span className="text-[10.5px] font-bold text-rose-600">
                    Choose a future deadline
                  </span>
                )}
                <button
                  type="button"
                  disabled={!commitment.trim() || isPast}
                  onClick={() => setStep('review')}
                  className="px-5 py-2.5 bg-black hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Review Receipt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep('form')}
                className="px-4 py-2 text-xs font-extrabold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                &larr; Back to Edit
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-black hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Issue Trust Receipt</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
