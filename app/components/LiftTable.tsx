"use client";

import { Lift } from "../types";

interface LiftTableProps {
  lifts: Lift[];
  regionId: string;
  onAddLift: (regionId: string, lift: Lift, direction: "up" | "down") => void;
}

export default function LiftTable({
  lifts,
  regionId,
  onAddLift,
}: LiftTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500 uppercase dark:border-zinc-700 dark:text-zinc-400">
            <th className="px-3 py-2 w-16">#</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2 w-20 text-right">Up</th>
            <th className="px-3 py-2 w-20 text-right">Down</th>
            <th className="px-3 py-2 w-24 text-center">Add</th>
          </tr>
        </thead>
        <tbody>
          {lifts.map((lift, i) => (
            <tr
              key={`${lift.nr}-${i}`}
              className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <td className="px-3 py-1.5 font-mono text-xs text-zinc-400">
                {lift.nr}
              </td>
              <td className="px-3 py-1.5">
                {lift.zone && (
                  <span className="mr-1.5 text-[10px] font-medium uppercase text-zinc-400 dark:text-zinc-500">
                    {lift.zone} /
                  </span>
                )}
                {lift.name}
              </td>
              <td className="px-3 py-1.5 text-right font-mono">
                {lift.up ?? "–"}
              </td>
              <td className="px-3 py-1.5 text-right font-mono">
                {lift.down ?? "–"}
              </td>
              <td className="px-3 py-1.5 text-center">
                <span className="inline-flex gap-1">
                  {lift.up != null && (
                    <button
                      onClick={() => onAddLift(regionId, lift, "up")}
                      className="rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                      title={`Add ${lift.name} up (${lift.up} pts)`}
                    >
                      +Up
                    </button>
                  )}
                  {lift.down != null && (
                    <button
                      onClick={() => onAddLift(regionId, lift, "down")}
                      className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
                      title={`Add ${lift.name} down (${lift.down} pts)`}
                    >
                      +Down
                    </button>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
