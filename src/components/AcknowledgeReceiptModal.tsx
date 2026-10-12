import React from 'react';
import { ShieldCheck, X, CheckCircle2, Clock, Lock } from 'lucide-react';
import { TrustReceipt } from '../data/trustReceipts';

interface AcknowledgeReceiptModalProps {
  receipt: TrustReceipt | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (receiptId: string) => void;
}

export function AcknowledgeReceiptModal({
  receipt,
  isOpen,
  onClose,
  onConfirm,
}: AcknowledgeReceiptModalProps) {
  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center relative"
      >
        {/* Dismiss button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
          <ShieldCheck className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">
          Acknowledge Trust Receipt
        </h3>
        <p className="text-xs text-slate-500 font-semibold mb-4">
          Receipt #{receipt.receiptNumber} &middot; Created by {receipt.creatorName}
        </p>

        {/* Commitment Summary Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-left mb-4 space-y-2 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Recorded Commitment:
          </span>
          <p className="text-xs font-semibold text-slate-800 italic leading-relaxed">
            "{receipt.commitment}"
          </p>
          {receipt.amount && (
            <div className="text-[11px] font-extrabold text-slate-900 flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span className="text-slate-500">Amount:</span>
              <span>{receipt.amount}</span>
            </div>
          )}
          <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between pt-1 border-t border-slate-200/60">
            <span className="text-slate-500">Deadline:</span>
            <span className="font-extrabold">{receipt.deadlineLabel}</span>
          </div>
        </div>

        {/* Official Confirmation Text Required by Specification */}
        <p className="text-xs text-slate-600 font-medium leading-relaxed mb-5 bg-purple-50/70 border border-purple-200/60 p-3 rounded-xl text-left">
          "By acknowledging this receipt, you confirm that you recognize this commitment and the deadline recorded above."
        </p>

        <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium justify-center mb-5">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Commitment and deadline lock permanently upon acknowledgement.</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onConfirm(receipt.id)}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Acknowledge</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-extrabold text-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
