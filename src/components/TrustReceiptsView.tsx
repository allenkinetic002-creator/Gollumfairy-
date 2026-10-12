import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Lock,
  Plus,
  ArrowRight,
  Filter,
  Search,
  Zap,
  Calendar,
  User,
  History,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import {
  TrustReceipt,
  TrustReceiptStatus,
  loadTrustReceipts,
  saveTrustReceipts,
  computeReceiptStatus,
} from '../data/trustReceipts';
import { SharedPerson } from '../data/sharedPeople';
import { AcknowledgeReceiptModal } from './AcknowledgeReceiptModal';

interface TrustReceiptsViewProps {
  availablePeople: SharedPerson[];
  onOpenCreateModal: () => void;
  onOpenCreateModalForPerson?: (personId: string) => void;
  onOpenChatWithPerson?: (personId: string) => void;
  onBackToMatches?: () => void;
  hideHeader?: boolean;
}

export function TrustReceiptsView({
  availablePeople,
  onOpenCreateModal,
  onOpenCreateModalForPerson,
  onOpenChatWithPerson,
  onBackToMatches,
  hideHeader = false,
}: TrustReceiptsViewProps) {
  const [receipts, setReceipts] = useState<TrustReceipt[]>(() => loadTrustReceipts());
  const [now, setNow] = useState<number>(Date.now());
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'active' | 'awaiting' | 'acknowledged' | 'expired' | 'fulfilled' | 'not_fulfilled'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dealPersonSearch, setDealPersonSearch] = useState('');
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  // Acknowledge modal target
  const [acknowledgingReceipt, setAcknowledgingReceipt] = useState<TrustReceipt | null>(null);

  // Role perspective switcher (so the user can test acknowledging as the promiser, or viewing as creator)
  const [actingRole, setActingRole] = useState<'creator' | 'promiser'>('creator');

  // Filter people to make a deal with
  const matchingDealPeople = availablePeople.filter((p) => {
    if (!dealPersonSearch.trim()) return true;
    const q = dealPersonSearch.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.handle.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q)
    );
  });

  // Clock tick every second for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen to cross-component sync
  useEffect(() => {
    const handleSync = () => {
      setReceipts(loadTrustReceipts());
    };
    window.addEventListener('fairy_receipts_sync', handleSync);
    return () => window.removeEventListener('fairy_receipts_sync', handleSync);
  }, []);

  // Format countdown HH:MM:SS
  const getRemainingFormatted = (deadlineAt: number): string => {
    const remainingMs = Math.max(0, deadlineAt - now);
    if (remainingMs <= 0) return '00:00:00';
    const totalSecs = Math.floor(remainingMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Fast forward deadline for testing
  const handleFastForwardDeadline = (receiptId: string) => {
    const updated = receipts.map((r) => {
      if (r.id === receiptId) {
        return {
          ...r,
          deadlineAt: Date.now() - 1000,
          expiredAt: Date.now() - 1000,
          history: [
            ...r.history,
            {
              id: `h-exp-${Date.now()}`,
              action: 'Deadline Expired',
              timestamp: Date.now(),
              actor: 'System Timer',
              note: 'Deadline reached zero. Outcome stage now open.',
            },
          ],
        };
      }
      return r;
    });
    setReceipts(updated);
    saveTrustReceipts(updated);
  };

  // Acknowledge confirm
  const handleConfirmAcknowledge = (receiptId: string) => {
    const updated = receipts.map((r) => {
      if (r.id === receiptId) {
        return {
          ...r,
          acknowledgedAt: Date.now(),
          acknowledgedBy: r.promiserName,
          history: [
            ...r.history,
            {
              id: `h-ack-${Date.now()}`,
              action: 'Acknowledged',
              timestamp: Date.now(),
              actor: r.promiserName,
              note: 'Confirmed commitment & deadline. Record permanently locked.',
            },
          ],
        };
      }
      return r;
    });
    setReceipts(updated);
    saveTrustReceipts(updated);
    setAcknowledgingReceipt(null);
  };

  // Outcome recording: Fulfilled or Not Fulfilled
  const handleRecordOutcome = (receiptId: string, outcome: 'fulfilled' | 'not_fulfilled') => {
    const updated = receipts.map((r) => {
      if (r.id === receiptId) {
        return {
          ...r,
          outcome,
          outcomeRecordedAt: Date.now(),
          outcomeRecordedBy: actingRole === 'creator' ? 'You (Creator)' : r.promiserName,
          history: [
            ...r.history,
            {
              id: `h-out-${Date.now()}`,
              action: outcome === 'fulfilled' ? 'Marked as Fulfilled' : 'Marked as Not Fulfilled',
              timestamp: Date.now(),
              actor: actingRole === 'creator' ? 'You' : r.promiserName,
              note:
                outcome === 'fulfilled'
                  ? 'Agreement recorded as successfully fulfilled.'
                  : 'Agreement recorded as not fulfilled. Note: This is an agreement record, not an automatic judgment of character.',
            },
          ],
        };
      }
      return r;
    });
    setReceipts(updated);
    saveTrustReceipts(updated);
  };

  // Filter receipts
  const filteredReceipts = receipts.filter((r) => {
    const status = computeReceiptStatus(r, now);
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      r.promiserName.toLowerCase().includes(query) ||
      r.commitment.toLowerCase().includes(query) ||
      r.receiptNumber.toLowerCase().includes(query) ||
      (r.amount && r.amount.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return status === 'acknowledged' && now < r.deadlineAt;
    if (selectedFilter === 'awaiting') return status === 'awaiting_acknowledgement';
    if (selectedFilter === 'acknowledged') return !!r.acknowledgedAt;
    if (selectedFilter === 'expired') return status === 'expired';
    if (selectedFilter === 'fulfilled') return status === 'fulfilled';
    if (selectedFilter === 'not_fulfilled') return status === 'not_fulfilled';

    return true;
  });

  // Counts
  const counts = {
    all: receipts.length,
    active: receipts.filter((r) => computeReceiptStatus(r, now) === 'acknowledged' && now < r.deadlineAt).length,
    awaiting: receipts.filter((r) => computeReceiptStatus(r, now) === 'awaiting_acknowledgement').length,
    fulfilled: receipts.filter((r) => computeReceiptStatus(r, now) === 'fulfilled').length,
    notFulfilled: receipts.filter((r) => computeReceiptStatus(r, now) === 'not_fulfilled').length,
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {/* Top Banner & Title Area (Single header discipline: hidden when embedded) */}
      {!hideHeader ? (
        <div className="bg-white border-b border-slate-100 px-4 py-3 shrink-0 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider">
                  FAIRY RELATIONSHIP
                </span>
                <span className="text-[11px] font-bold text-slate-400">&middot; Independent System</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
                <span>Trust Receipts</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {receipts.length}
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Record promises &amp; commitments, verify acknowledgements, track live deadlines.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Role Switcher to test both Creator & Promiser perspectives */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[10.5px] font-bold border border-slate-200">
                <span className="px-2 text-slate-400 font-medium hidden sm:inline">Role:</span>
                <button
                  onClick={() => setActingRole('creator')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    actingRole === 'creator'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="View as Creator (You)"
                >
                  You (Creator)
                </button>
                <button
                  onClick={() => setActingRole('promiser')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    actingRole === 'promiser'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="View as Promiser (test acknowledging & outcomes)"
                >
                  Promiser
                </button>
              </div>

              <button
                onClick={onOpenCreateModal}
                className="px-3.5 py-2 bg-black hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Create Trust Receipt</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Active</span>
              <span className="font-mono font-black text-slate-900 text-sm">{counts.active}</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800">Awaiting</span>
              <span className="font-mono font-black text-amber-900 text-sm">{counts.awaiting}</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800">Fulfilled</span>
              <span className="font-mono font-black text-emerald-900 text-sm">{counts.fulfilled}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/70 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600">Unfulfilled</span>
              <span className="font-mono font-black text-slate-800 text-sm">{counts.notFulfilled}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Compact role switcher and stats bar when embedded inside MatchesScreen single header */
        <div className="bg-white border-b border-slate-100 px-3 py-2 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-500">Testing Perspective:</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold border border-slate-200">
              <button
                onClick={() => setActingRole('creator')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  actingRole === 'creator'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                You (Creator)
              </button>
              <button
                onClick={() => setActingRole('promiser')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  actingRole === 'promiser'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Promiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search People to Make a Deal Section */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 shrink-0 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span>Search People to Make a Deal</span>
            </h2>
          </div>
          <span className="text-[10.5px] font-bold text-slate-400">
            {availablePeople.length} people available on FAIRY
          </span>
        </div>

        {/* Search input for finding people */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={dealPersonSearch}
            onChange={(e) => setDealPersonSearch(e.target.value)}
            placeholder="Search person by name, handle, or city to make a deal (e.g. Alex, Elena, Clara)..."
            className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black transition-all border border-transparent focus:border-slate-200"
          />
          {dealPersonSearch && (
            <button
              onClick={() => setDealPersonSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Horizontal interactive cards of matching people */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {matchingDealPeople.length === 0 ? (
            <div className="text-xs text-slate-400 py-1 italic">
              No people found matching "{dealPersonSearch}".
            </div>
          ) : (
            matchingDealPeople.slice(0, 10).map((person) => (
              <button
                key={person.id}
                onClick={() =>
                  onOpenCreateModalForPerson
                    ? onOpenCreateModalForPerson(person.id)
                    : onOpenCreateModal()
                }
                className="p-2 pr-3 rounded-2xl bg-slate-50 hover:bg-purple-50 hover:border-purple-300 border border-slate-200/80 transition-all flex items-center gap-2.5 shrink-0 group cursor-pointer shadow-2xs hover:shadow-xs text-left active:scale-95"
                title={`Make a deal with ${person.name}`}
              >
                <div
                  className={`w-8 h-8 rounded-full ${person.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs overflow-hidden`}
                >
                  {person.avatarUrl ? (
                    <img
                      src={person.avatarUrl}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    person.avatarInitial
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1 leading-tight">
                    <span className="font-extrabold text-xs text-slate-900 group-hover:text-purple-950">
                      {person.name}
                    </span>
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded-sm">
                      {person.percent}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-purple-700 font-extrabold mt-0.5">
                    <span>+ Make Deal</span>
                    <span className="text-slate-300 font-normal">&middot;</span>
                    <span className="text-slate-400 font-medium">{person.city}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 max-w-full overflow-hidden">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people or promises..."
            className="w-full bg-slate-100 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black truncate"
          />
        </div>

        {/* Filter Tabs in horizontal scroll view with right-edge fade */}
        <div className="relative w-full sm:w-auto overflow-hidden">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none w-full sm:w-auto text-[10.5px] pr-8">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedFilter === 'all'
                  ? 'bg-black text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setSelectedFilter('awaiting')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedFilter === 'awaiting'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100'
              }`}
            >
              Awaiting ({counts.awaiting})
            </button>
            <button
              onClick={() => setSelectedFilter('active')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedFilter === 'active'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-purple-50 text-purple-800 border border-purple-200/60 hover:bg-purple-100'
              }`}
            >
              Countdown ({counts.active})
            </button>
            <button
              onClick={() => setSelectedFilter('fulfilled')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedFilter === 'fulfilled'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
              }`}
            >
              Fulfilled ({counts.fulfilled})
            </button>
            <button
              onClick={() => setSelectedFilter('not_fulfilled')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedFilter === 'not_fulfilled'
                  ? 'bg-slate-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Unfulfilled ({counts.notFulfilled})
            </button>
          </div>
          {/* Subtle fade on right edge so users can tell it scrolls */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-7 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* Receipts Stream */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 overscroll-contain touch-pan-y">
        {filteredReceipts.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">No Trust Receipts Found</h3>
            <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto leading-relaxed">
              {searchQuery
                ? 'No receipts match your search terms.'
                : 'Record a promise or commitment from a vibe coder to issue your first Trust Receipt.'}
            </p>
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Create Trust Receipt
            </button>
          </div>
        ) : (
          filteredReceipts.map((receipt) => {
            const status = computeReceiptStatus(receipt, now);
            const isExpired = now >= receipt.deadlineAt;
            const remaining = getRemainingFormatted(receipt.deadlineAt);
            const isHistoryExpanded = expandedHistoryId === receipt.id;

            return (
              <div
                key={receipt.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:shadow-md"
              >
                {/* Header Strip with Tear Line styling */}
                <div className="bg-slate-50 px-5 py-3 border-b border-dashed border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-black">
                      TR
                    </div>
                    <span className="text-xs font-mono font-black text-slate-900 tracking-wider">
                      #{receipt.receiptNumber}
                    </span>
                    <span className="text-[10.5px] text-slate-400 font-medium">
                      &middot; Created {new Date(receipt.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {status === 'awaiting_acknowledgement' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin-slow shrink-0" />
                        <span>Awaiting</span>
                      </span>
                    )}
                    {status === 'acknowledged' && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-purple-200">
                        <Lock className="w-3 h-3 text-purple-600 shrink-0" />
                        <span>Locked</span>
                      </span>
                    )}
                    {status === 'expired' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-rose-200">
                        <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>Expired</span>
                      </span>
                    )}
                    {status === 'fulfilled' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Fulfilled</span>
                      </span>
                    )}
                    {status === 'not_fulfilled' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-slate-300">
                        <XCircle className="w-3 h-3 text-slate-600 shrink-0" />
                        <span>Not Fulfilled</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Parties Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                    {/* User A (Promiser) */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${receipt.promiserAvatarBg} text-white font-bold text-sm flex items-center justify-center overflow-hidden shadow-xs shrink-0`}
                      >
                        {receipt.promiserAvatarUrl ? (
                          <img
                            src={receipt.promiserAvatarUrl}
                            alt={receipt.promiserName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          receipt.promiserAvatarInitial
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                            Promiser:
                          </span>
                          <span className="font-black text-xs text-slate-900">
                            {receipt.promiserName}
                          </span>
                          <span className="text-[9.5px] font-bold px-1.5 rounded-full bg-slate-200 text-slate-700">
                            {receipt.promiserPercent}% match
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 font-medium">
                          {receipt.promiserHandle} &middot; {receipt.promiserCity}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block text-slate-300 font-black">&rarr;</div>

                    {/* User B (Creator) */}
                    <div className="flex items-center gap-2">
                      <div className="text-right sm:text-left">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                          Recorded By:
                        </span>
                        <span className="font-black text-xs text-slate-900">{receipt.creatorName}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                        You
                      </div>
                    </div>
                  </div>

                  {/* Commitment Quote Block */}
                  <div>
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Their Commitment (Quoted Words):
                    </span>
                    <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-amber-500 text-slate-900 text-xs font-semibold leading-relaxed shadow-2xs">
                      "{receipt.commitment}"
                      {receipt.amount && (
                        <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between font-mono font-black text-xs">
                          <span className="text-slate-500 font-sans font-bold">Attached Amount:</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold">
                            {receipt.amount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visual Lifecycle Progress Bar */}
                  <div className="py-1">
                    <div className="flex items-center justify-between text-[9.5px] font-black tracking-wider uppercase text-slate-400 mb-1.5">
                      <span className="text-slate-900">1. Commitment</span>
                      <span className={receipt.acknowledgedAt ? 'text-purple-700 font-black' : ''}>
                        2. Acknowledged
                      </span>
                      <span className={receipt.acknowledgedAt && !isExpired ? 'text-amber-700 font-black' : ''}>
                        3. Countdown
                      </span>
                      <span className={receipt.outcome ? 'text-emerald-700 font-black' : ''}>
                        4. Outcome
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden flex">
                      <div className="h-full bg-black w-1/4" />
                      <div
                        className={`h-full transition-all duration-500 ${
                          receipt.acknowledgedAt ? 'bg-purple-600 w-1/4' : 'w-0'
                        }`}
                      />
                      <div
                        className={`h-full transition-all duration-500 ${
                          receipt.acknowledgedAt && isExpired
                            ? 'bg-rose-500 w-1/4'
                            : receipt.acknowledgedAt
                            ? 'bg-amber-500 w-1/4'
                            : 'w-0'
                        }`}
                      />
                      <div
                        className={`h-full transition-all duration-500 ${
                          receipt.outcome === 'fulfilled'
                            ? 'bg-emerald-500 w-1/4'
                            : receipt.outcome === 'not_fulfilled'
                            ? 'bg-slate-600 w-1/4'
                            : 'w-0'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Deadline & Live Countdown Row */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Target Deadline
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{receipt.deadlineLabel}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({new Date(receipt.deadlineAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Remaining Timer
                        </span>
                        <span
                          className={`font-mono text-sm font-black tracking-wider ${
                            isExpired ? 'text-rose-600' : 'text-amber-800'
                          }`}
                        >
                          {isExpired ? '00:00:00 (Expired)' : remaining}
                        </span>
                      </div>

                      {/* Fast-forward deadline lightning trigger for testing */}
                      {!isExpired && (
                        <button
                          onClick={() => handleFastForwardDeadline(receipt.id)}
                          className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Fast-forward timer to test expired/outcome stage"
                        >
                          <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                          <span className="hidden sm:inline">Expire Timer</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Acknowledgement Status / Prominent Action */}
                  {!receipt.acknowledgedAt ? (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                      <div className="text-xs text-amber-950 leading-relaxed font-medium">
                        <div className="flex items-center gap-1.5 font-black text-amber-900 mb-0.5">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Status: Awaiting Acknowledgement</span>
                        </div>
                        {receipt.promiserName} must review and confirm recognition of this commitment and deadline.
                      </div>

                      <button
                        onClick={() => setAcknowledgingReceipt(receipt)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>[ ACKNOWLEDGE ]</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-purple-50/60 border border-purple-200/70 rounded-2xl flex items-center justify-between text-xs text-purple-950 font-medium">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-purple-700 shrink-0" />
                        <span>
                          Acknowledged by <strong>{receipt.acknowledgedBy || receipt.promiserName}</strong> on{' '}
                          {new Date(receipt.acknowledgedAt).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                        Record Locked
                      </span>
                    </div>
                  )}

                  {/* Outcome Stage: When Expired or Acknowledged, show Fulfilled / Not Fulfilled */}
                  {!receipt.outcome ? (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500">
                          Outcome Evaluation Stage
                        </span>
                        {isExpired && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Deadline Reached &middot; Record What Happened
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium mb-3 italic">
                        "The Trust Receipt is a record of an agreement/commitment, not an automatic judgment of someone's character."
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleRecordOutcome(receipt.id, 'fulfilled')}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                          <span>[ FULFILLED ]</span>
                        </button>
                        <button
                          onClick={() => handleRecordOutcome(receipt.id, 'not_fulfilled')}
                          className="py-2.5 px-3 bg-slate-700 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4 text-slate-300" />
                          <span>[ NOT FULFILLED ]</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Final Recorded Outcome */
                    <div
                      className={`p-3.5 rounded-2xl border text-xs font-medium flex items-center justify-between ${
                        receipt.outcome === 'fulfilled'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-slate-100 border-slate-300 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {receipt.outcome === 'fulfilled' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-600 shrink-0" />
                        )}
                        <div>
                          <strong className="font-extrabold block text-sm">
                            {receipt.outcome === 'fulfilled' ? 'FULFILLED' : 'NOT FULFILLED'}
                          </strong>
                          <span className="text-[11px] opacity-80">
                            Recorded by {receipt.outcomeRecordedBy || 'User'} on{' '}
                            {new Date(receipt.outcomeRecordedAt || Date.now()).toLocaleString([], {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current">
                        Final Record
                      </span>
                    </div>
                  )}

                  {/* Collapsible History / Audit Trail */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() =>
                        setExpandedHistoryId(isHistoryExpanded ? null : receipt.id)
                      }
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>
                        Integrity History &amp; Audit Trail ({receipt.history.length})
                      </span>
                      {isHistoryExpanded ? (
                        <ChevronUp className="w-3 h-3 ml-0.5" />
                      ) : (
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                      )}
                    </button>

                    {isHistoryExpanded && (
                      <div className="mt-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-2 animate-in fade-in duration-150">
                        {receipt.history.map((h) => (
                          <div
                            key={h.id}
                            className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-200/50 last:border-b-0 last:pb-0"
                          >
                            <div>
                              <span className="font-extrabold text-slate-900 block text-[11px]">
                                {h.action} &middot; <span className="font-normal text-slate-500">{h.actor}</span>
                              </span>
                              {h.note && (
                                <p className="text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                                  {h.note}
                                </p>
                              )}
                            </div>
                            <span className="font-mono text-[9.5px] text-slate-400 shrink-0">
                              {new Date(h.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Acknowledge Confirmation Modal */}
      <AcknowledgeReceiptModal
        receipt={acknowledgingReceipt}
        isOpen={!!acknowledgingReceipt}
        onClose={() => setAcknowledgingReceipt(null)}
        onConfirm={handleConfirmAcknowledge}
      />
    </div>
  );
}
