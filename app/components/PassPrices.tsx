"use client";

import { useState } from "react";

const PASS_PRICING = {
  highSeason: [
    { days: 1, price: 86 },
    { days: 2, price: 170 },
    { days: 3, price: 248 },
    { days: 4, price: 317 },
    { days: 5, price: 380 },
    { days: 6, price: 436 },
    { days: 7, price: 462 },
    { days: 8, price: 517 },
    { days: 9, price: 570 },
    { days: 10, price: 620 },
    { days: 12, price: 713 },
    { days: 15, price: 832 },
    { days: 20, price: 1016 },
  ],
  lowSeason: [
    { days: 1, price: 77 },
    { days: 2, price: 153 },
    { days: 3, price: 223 },
    { days: 4, price: 285 },
    { days: 5, price: 342 },
    { days: 6, price: 392 },
    { days: 7, price: 416 },
    { days: 8, price: 466 },
    { days: 9, price: 513 },
    { days: 10, price: 558 },
    { days: 12, price: 642 },
    { days: 15, price: 711 },
    { days: 20, price: 915 },
  ],
  specials: [
    { label: "10 Superdays (non-consecutive)", price: 660, perDay: 66 },
    { label: "Season pass", price: 1040, perDay: null },
  ],
  earlyBookingDiscount: 0.05,
};

export default function PassPrices() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-4 rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
      >
        Pass Prices
        <svg
          className={`h-4 w-4 text-zinc-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                  <th className="pb-1.5 pr-3 font-medium">Days</th>
                  <th className="pb-1.5 pr-3 font-medium">High Season</th>
                  <th className="pb-1.5 font-medium">Low Season</th>
                </tr>
              </thead>
              <tbody className="text-zinc-700 dark:text-zinc-300">
                {PASS_PRICING.highSeason.map((h, i) => {
                  const l = PASS_PRICING.lowSeason[i];
                  const earlyH = Math.round(h.price * (1 - PASS_PRICING.earlyBookingDiscount));
                  const earlyL = Math.round(l.price * (1 - PASS_PRICING.earlyBookingDiscount));
                  return (
                    <tr key={h.days} className="border-t border-zinc-50 dark:border-zinc-800/50">
                      <td className="py-1 pr-3 font-mono font-medium">{h.days}</td>
                      <td className="py-1 pr-3 font-mono">&euro;{h.price} <span className="text-[10px]">&euro;{(h.price / h.days).toFixed(0)}/d</span> <span className="text-zinc-400 dark:text-zinc-500">(&euro;{earlyH} <span className="text-[10px]">&euro;{Math.round(earlyH / h.days)}/d</span>)</span></td>
                      <td className="py-1 font-mono">&euro;{l.price} <span className="text-[10px]">&euro;{(l.price / l.days).toFixed(0)}/d</span> <span className="text-zinc-400 dark:text-zinc-500">(&euro;{earlyL} <span className="text-[10px]">&euro;{Math.round(earlyL / l.days)}/d</span>)</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 border-t border-zinc-100 pt-2 dark:border-zinc-800">
            <div className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Specials</div>
            <div className="space-y-0.5 text-xs text-zinc-700 dark:text-zinc-300">
              {PASS_PRICING.specials.map((s) => (
                <div key={s.label} className="flex justify-between">
                  <span>{s.label}</span>
                  <span className="font-mono">&euro;{s.price}{s.perDay != null && <span className="text-[10px]"> &euro;{s.perDay}/d</span>}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[10px] text-zinc-400">
            Greyed prices in brackets = 5% early booking discount. Prices from dolomitisuperski.com 2025/26 season.
          </p>
        </div>
      )}
    </div>
  );
}
