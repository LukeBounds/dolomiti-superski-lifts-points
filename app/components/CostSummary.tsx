import { useMemo } from "react";
import { PASS_PRICING } from "./PassPrices";

export default function CostSummary({ totalPoints }: { totalPoints: number }) {
  const pointTiers = useMemo(
    () => [
      { label: "600 pts @ €50", cost: (totalPoints / 600) * 50 },
      { label: "1,000 pts @ €80", cost: (totalPoints / 1000) * 80 },
      { label: "2,100 pts @ €150", cost: (totalPoints / 2100) * 150 },
    ],
    [totalPoints]
  );

  const perDayRates = useMemo(
    () =>
      PASS_PRICING.highSeason.map((h) => ({
        days: h.days,
        perDay: h.price / h.days,
      })),
    []
  );

  return (
    <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-700">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-zinc-900 dark:text-zinc-50">
          Total
        </span>
        <span className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-50">
          {totalPoints} pts
        </span>
      </div>
      <div className="mt-2 space-y-2">
        <div className="rounded-md bg-zinc-100 p-2 text-xs dark:bg-zinc-800">
          <div className="mb-1 font-medium text-zinc-600 dark:text-zinc-300">Effective cost</div>
          <div className="space-y-0.5 text-zinc-500 dark:text-zinc-400">
            {pointTiers.map((tier) => (
              <div key={tier.label} className="flex justify-between">
                <span>{tier.label}</span>
                <span className="font-mono">&euro;{tier.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md bg-zinc-100 p-2 text-xs dark:bg-zinc-800">
          <div className="mb-1 font-medium text-zinc-600 dark:text-zinc-300">vs. high season day pass</div>
          <div className="space-y-0.5 text-zinc-500 dark:text-zinc-400">
            {pointTiers.map((tier) => {
              const cost = tier.cost;
              const passesBeaten = perDayRates.filter((r) => cost < r.perDay);
              const passesNotBeaten = perDayRates.filter((r) => cost >= r.perDay);
              const cheapestPassBeaten = passesBeaten.length > 0
                ? passesBeaten[passesBeaten.length - 1]
                : null;
              const cheapestPassNotBeaten = passesNotBeaten.length > 0
                ? passesNotBeaten[0]
                : null;
              return (
                <div key={tier.label}>
                  {cheapestPassBeaten && !cheapestPassNotBeaten && (
                    <span>On {tier.label.split("@")[0].trim()} card: cheaper than all pass options</span>
                  )}
                  {cheapestPassBeaten && cheapestPassNotBeaten && (
                    <span>On {tier.label.split("@")[0].trim()} card: cheaper than {cheapestPassBeaten.days}-day <span className="font-mono">(&euro;{cheapestPassBeaten.perDay.toFixed(0)}/d)</span> but not {cheapestPassNotBeaten.days}-day <span className="font-mono">(&euro;{cheapestPassNotBeaten.perDay.toFixed(0)}/d)</span></span>
                  )}
                  {!cheapestPassBeaten && cheapestPassNotBeaten && (
                    <span>On {tier.label.split("@")[0].trim()} card: more expensive than all pass options</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
