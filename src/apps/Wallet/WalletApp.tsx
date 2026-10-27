import React, { useState } from 'react';
import {
  CreditCard,
  Wifi,
  Plus,
  Send,
  Download,
  QrCode,
  Plane,
  X,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/audio';

interface WalletAppProps {
  onClose: () => void;
}

export const WalletApp: React.FC<WalletAppProps> = ({ onClose }) => {
  const [selectedCard, setSelectedCard] = useState<'apple-card' | 'apple-cash' | 'boarding-pass'>('apple-card');
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [cashBalance, setCashBalance] = useState(1485.50);

  const handlePay = () => {
    setIsPaying(true);
    soundManager.playKeyClick();

    setTimeout(() => {
      soundManager.playBuildSuccess();
      setPaySuccess(true);
      setTimeout(() => {
        setIsPaying(false);
        setPaySuccess(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* HEADER */}
      <div className="px-5 pt-11 pb-2 flex items-center justify-between border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-neutral-300" />
            Wallet & Apple Pay
          </h1>
          <p className="text-[10px] text-neutral-400">Titanium Card · Apple Cash</p>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* BODY SCROLL */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* CARD SELECTOR CAROUSEL */}
        <div className="space-y-3">
          {/* 1. Apple Card Titanium */}
          <motion.div
            layout
            onClick={() => {
              setSelectedCard('apple-card');
              soundManager.playKeyClick();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-5 rounded-3xl cursor-pointer transition-all shadow-2xl relative overflow-hidden ${
              selectedCard === 'apple-card'
                ? 'h-48 ring-2 ring-white/40'
                : 'h-24 opacity-80'
            }`}
            style={{
              background: 'linear-gradient(135deg, #f5f5f7 0%, #d8d8dc 50%, #b8b8c0 100%)',
            }}
          >
            <div className="flex justify-between items-start text-neutral-900">
              <span className="text-xl font-bold tracking-tight">Card</span>
              <Wifi className="w-5 h-5 rotate-90 text-neutral-700" />
            </div>

            {selectedCard === 'apple-card' && (
              <div className="absolute bottom-5 inset-x-5 flex justify-between items-end text-neutral-900">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-70 block">
                    Lead Architect
                  </span>
                  <span className="text-sm font-semibold tracking-wide">Daniel Das</span>
                </div>
                <span className="text-xs font-mono font-medium tracking-widest">•••• 1513</span>
              </div>
            )}
          </motion.div>

          {/* 2. Apple Cash */}
          <motion.div
            layout
            onClick={() => {
              setSelectedCard('apple-cash');
              soundManager.playKeyClick();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-5 rounded-3xl cursor-pointer transition-all shadow-2xl relative overflow-hidden bg-neutral-900 border border-white/10 ${
              selectedCard === 'apple-cash'
                ? 'h-48 ring-2 ring-emerald-500/50'
                : 'h-24 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start text-white">
              <span className="text-lg font-bold tracking-tight text-emerald-400">Cash</span>
              <span className="text-xs text-neutral-400 font-mono">Dox6 Pay</span>
            </div>

            {selectedCard === 'apple-cash' && (
              <div className="absolute bottom-5 inset-x-5 flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Balance</span>
                  <span className="text-2xl font-light text-white font-mono">
                    ${cashBalance.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCashBalance((prev) => prev + 100);
                    soundManager.playBuildSuccess();
                  }}
                  className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  + Add $100
                </button>
              </div>
            )}
          </motion.div>

          {/* 3. Boarding Pass */}
          <motion.div
            layout
            onClick={() => {
              setSelectedCard('boarding-pass');
              soundManager.playKeyClick();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-5 rounded-3xl cursor-pointer transition-all shadow-2xl relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-neutral-900 border border-blue-500/30 ${
              selectedCard === 'boarding-pass'
                ? 'h-48 ring-2 ring-blue-500/50'
                : 'h-24 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start text-white">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold">Cupertino Airways</span>
              </div>
              <span className="text-xs text-blue-300 font-mono">FLIGHT AA1513</span>
            </div>

            {selectedCard === 'boarding-pass' && (
              <div className="absolute bottom-5 inset-x-5 flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white">SFO</span>
                    <span className="text-xs text-neutral-400">➔</span>
                    <span className="text-xl font-bold text-white">LHR</span>
                  </div>
                  <span className="text-[10px] text-neutral-300 block">Gate 84 · Seat 1A (First Class)</span>
                </div>
                <QrCode className="w-10 h-10 text-white opacity-90" />
              </div>
            )}
          </motion.div>
        </div>

        {/* TAP TO PAY ACTION */}
        <div className="pt-2">
          <button
            onClick={handlePay}
            disabled={isPaying}
            className="w-full py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 active:scale-98 transition-all flex flex-col items-center justify-center space-y-2 shadow-xl group"
          >
            {paySuccess ? (
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-6 h-6 animate-bounce" />
                <span>Payment Done</span>
              </div>
            ) : isPaying ? (
              <div className="flex items-center gap-2 text-blue-400 font-medium text-xs animate-pulse">
                <Wifi className="w-5 h-5 rotate-90" />
                <span>Hold Near Reader (NFC)...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Wifi className="w-5 h-5 rotate-90" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-white block">Double Click Side Button</span>
                  <span className="text-[10px] text-neutral-400">or Tap Here to Pay with Face ID</span>
                </div>
              </>
            )}
          </button>
        </div>

        {/* LATEST TRANSACTIONS */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
            Recent Transactions
          </span>
          <div className="space-y-1.5">
            {[
              { title: 'Apple Park Caffe Macs', date: 'Today, 12:30 PM', amount: '-$14.50' },
              { title: 'Apple Store Cupertino', date: 'Yesterday', amount: '-$1,199.00' },
              { title: 'Daily Cash 3% Reward', date: 'Yesterday', amount: '+$35.97', isCredit: true },
              { title: 'Whole Foods Market', date: 'Oct 24', amount: '-$42.80' },
            ].map((tx, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-neutral-900/60 border border-white/5 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-white">{tx.title}</h4>
                  <span className="text-[10px] text-neutral-400">{tx.date}</span>
                </div>
                <span className={`text-xs font-mono font-bold ${
                  tx.isCredit ? 'text-emerald-400' : 'text-neutral-200'
                }`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
