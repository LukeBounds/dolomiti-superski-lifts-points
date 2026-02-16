import type { DayPlanEntry } from "../types";

export default function PlanEntry({
  entry,
  regionName,
  onRemove,
  onUpdateCount,
}: {
  entry: DayPlanEntry;
  regionName: string | undefined;
  onRemove: () => void;
  onUpdateCount: (delta: number) => void;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {entry.liftName}
          </div>
          <div className="text-xs text-zinc-400">
            {regionName} #{entry.liftNr}{" "}
            <span
              className={
                entry.direction === "up"
                  ? "text-blue-500"
                  : "text-emerald-500"
              }
            >
              {entry.direction === "up" ? "Up" : "Down"}
            </span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="shrink-0 text-zinc-300 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400"
          title="Remove"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdateCount(-1)}
            className="h-5 w-5 rounded bg-zinc-100 text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            -
          </button>
          <span className="w-6 text-center text-xs font-mono">
            {entry.count}
          </span>
          <button
            onClick={() => onUpdateCount(1)}
            className="h-5 w-5 rounded bg-zinc-100 text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            +
          </button>
        </div>
        <span className="font-mono text-xs font-medium text-zinc-600 dark:text-zinc-300">
          {entry.points * entry.count} pts
        </span>
      </div>
    </div>
  );
}
