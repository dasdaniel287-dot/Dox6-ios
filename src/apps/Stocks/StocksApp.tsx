import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  X,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: string;
  high52: number;
  low52: number;
  volume: string;
  dataPoints: number[];
}

interface StocksAppProps {
  onClose: () => void;
}

export const StocksApp: React.FC<StocksAppProps> = ({ onClose }) => {
  const [selectedRange, setSelectedRange] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1D');
  const [searchQuery, setSearchQuery] = useState('');

  const [watchlist, setWatchlist] = useState<StockQuote[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 236.45,
      change: 3.25,
      changePercent: 1.39,
      marketCap: '3.62T',
      peRatio: '34.2',
      high52: 237.23,
      low52: 165.67,
      volume: '54.2M',
      dataPoints: [231, 232.5, 231.8, 233.2, 234.1, 235.8, 236.45],
    },
    {
      symbol: 'DOX6',
      name: 'Dox6 Systems Inc.',
      price: 74.80,
      change: 9.60,
      changePercent: 14.72,
      marketCap: '48.5B',
      peRatio: '28.4',
      high52: 76.50,
      low52: 24.10,
      volume: '18.9M',
      dataPoints: [64, 65.5, 68.2, 70.1, 72.8, 73.9, 74.8],
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 144.20,
      change: 4.85,
      changePercent: 3.48,
      marketCap: '3.54T',
      peRatio: '62.1',
      high52: 145.00,
      low52: 46.20,
      volume: '68.4M',
      dataPoints: [138, 139.5, 141.2, 140.8, 142.5, 143.8, 144.2],
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 432.10,
      change: 2.90,
      changePercent: 0.68,
      marketCap: '3.21T',
      peRatio: '35.8',
      high52: 468.35,
      low52: 327.20,
      volume: '22.1M',
      dataPoints: [428, 429.5, 430.1, 429.8, 431.2, 431.9, 432.1],
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 179.80,
      change: 2.10,
      changePercent: 1.18,
      marketCap: '2.24T',
      peRatio: '24.6',
      high52: 191.75,
      low52: 120.21,
      volume: '26.8M',
      dataPoints: [176, 177.2, 178.5, 177.9, 178.8, 179.2, 179.8],
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      price: 219.50,
      change: -1.80,
      changePercent: -0.81,
      marketCap: '698B',
      peRatio: '58.4',
      high52: 271.00,
      low52: 138.80,
      volume: '44.6M',
      dataPoints: [224, 222.5, 221.8, 220.2, 219.8, 220.4, 219.5],
    },
  ]);

  const [selectedStock, setSelectedStock] = useState<StockQuote>(watchlist[0]);

  const newsItems = [
    {
      source: 'Bloomberg Technology',
      headline: 'Apple Expands Silicon AI Architecture with A18 Pro Developers',
      time: '1h ago',
    },
    {
      source: 'Wall Street Journal',
      headline: 'Dox6 Systems Closes Landmark Strategic Round for On-Device Compilers',
      time: '3h ago',
    },
    {
      source: 'CNBC Markets',
      headline: 'Tech Index Rally Continues Across Semiconductor and Software Platforms',
      time: '4h ago',
    },
  ];

  const filteredList = watchlist.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* HEADER */}
      <div className="px-5 pt-11 pb-2 flex items-center justify-between border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Stocks
          </h1>
          <p className="text-[10px] text-neutral-400">NASDAQ & NYSE · Real-time</p>
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
        {/* SELECTED STOCK HERO CARD */}
        <div className="p-4 rounded-3xl bg-neutral-900 border border-white/10 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">{selectedStock.symbol}</span>
                <span className="text-xs text-neutral-400">{selectedStock.name}</span>
              </div>
              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="text-3xl font-light text-white font-mono">
                  ${selectedStock.price.toFixed(2)}
                </span>
                <span className={`text-xs font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-md ${
                  selectedStock.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent > 0 ? '+' : ''}{selectedStock.changePercent}%)
                </span>
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold text-neutral-400 bg-white/5 px-2 py-1 rounded-md">
              Market Open
            </span>
          </div>

          {/* SVG CHART */}
          <div className="h-28 w-full pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
              <defs>
                <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={selectedStock.change >= 0 ? '#10b981' : '#f43f5e'} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={selectedStock.change >= 0 ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke={selectedStock.change >= 0 ? '#10b981' : '#f43f5e'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,65 50,55 90,58 135,42 180,30 230,18 290,12"
              />
              <polygon
                fill="url(#stockGrad)"
                points="10,65 50,55 90,58 135,42 180,30 230,18 290,12 290,80 10,80"
              />
            </svg>
          </div>

          {/* TIMEFRAME PILLS */}
          <div className="flex justify-between border-t border-white/5 pt-2">
            {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRange(r);
                  soundManager.playKeyClick();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedRange === r ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* KEY METRICS GRID */}
          <div className="grid grid-cols-4 gap-2 border-t border-white/10 pt-3 text-[10px]">
            <div>
              <span className="text-neutral-500 block">MKT CAP</span>
              <span className="font-semibold text-white">{selectedStock.marketCap}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">P/E RATIO</span>
              <span className="font-semibold text-white">{selectedStock.peRatio}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">52W HIGH</span>
              <span className="font-semibold text-white">${selectedStock.high52}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">VOLUME</span>
              <span className="font-semibold text-white">{selectedStock.volume}</span>
            </div>
          </div>
        </div>

        {/* WATCHLIST */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Watchlist
            </span>
            <span className="text-[11px] text-neutral-500">{watchlist.length} Tickers</span>
          </div>

          <div className="space-y-1.5">
            {filteredList.map((item) => {
              const isPositive = item.change >= 0;
              const isSelected = selectedStock.symbol === item.symbol;

              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    setSelectedStock(item);
                    soundManager.playKeyClick();
                  }}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer border transition-all ${
                    isSelected ? 'bg-neutral-800 border-white/30 shadow-md' : 'bg-neutral-900/80 border-white/5 hover:bg-neutral-800/60'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.symbol}</h4>
                    <p className="text-[11px] text-neutral-400 truncate max-w-[120px]">{item.name}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-medium text-white font-mono block">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className={`text-[11px] font-semibold inline-block px-1.5 py-0.5 rounded ${
                      isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BUSINESS NEWS FEED */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
            Apple News Business
          </span>
          <div className="space-y-2">
            {newsItems.map((news, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-1 hover:bg-neutral-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span className="text-rose-400 font-semibold">{news.source}</span>
                  <span>{news.time}</span>
                </div>
                <h5 className="text-xs font-medium text-neutral-200 leading-snug">
                  {news.headline}
                </h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
