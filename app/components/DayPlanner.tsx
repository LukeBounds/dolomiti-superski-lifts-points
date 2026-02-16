"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import type { Region, Lift, DayPlanEntry, LiftData, Preset, PresetData } from "../types";
import LiftTable from "./LiftTable";
import PassPrices from "./PassPrices";

function encodePlan(entries: DayPlanEntry[], regions: Region[]): string {
  if (entries.length === 0) return "";
  const idToNumericId = new Map<string, number>();
  for (const r of regions) idToNumericId.set(r.id, r.numericId);
  return entries
    .map(
      (e) =>
        `${idToNumericId.get(e.regionId) ?? e.regionId}:${e.liftNr}:${e.direction === "up" ? "u" : "d"}:${e.count}`
    )
    .join(",");
}

function decodePlan(
  planStr: string,
  regions: Region[]
): DayPlanEntry[] {
  if (!planStr) return [];
  const numericIdMap = new Map<number, Region>();
  for (const r of regions) numericIdMap.set(r.numericId, r);

  return planStr.split(",").flatMap((seg) => {
    const [regionKey, liftNr, dir, countStr] = seg.split(":");
    if (!regionKey || !liftNr || !dir) return [];
    const region = numericIdMap.get(parseInt(regionKey));
    if (!region) return [];
    const lift = region.lifts.find((l) => l.nr === liftNr);
    if (!lift) return [];
    const direction = dir === "d" ? "down" : "up";
    const points =
      direction === "up" ? (lift.up ?? 0) : (lift.down ?? 0);
    const count = Math.max(1, parseInt(countStr) || 1);
    return [
      {
        regionId: region.id,
        liftNr,
        liftName: lift.name,
        direction,
        count,
        points,
      },
    ];
  });
}

function DayPlannerInner({
  liftData,
  presetData,
}: {
  liftData: LiftData;
  presetData: PresetData;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [entries, setEntries] = useState<DayPlanEntry[]>([]);
  const [search, setSearch] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(
    new Set()
  );
  const [showPlanner, setShowPlanner] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hydrate from URL on mount
  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam) {
      const decoded = decodePlan(planParam, liftData.regions);
      if (decoded.length > 0) {
        setEntries(decoded);
        setShowPlanner(true);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync entries to URL via effect (avoids setState-during-render)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!hydrated) return;
    const encoded = encodePlan(entries, liftData.regions);
    const params = new URLSearchParams(searchParams.toString());
    if (encoded) {
      params.set("plan", encoded);
    } else {
      params.delete("plan");
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/", { scroll: false });
  }, [entries, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const addLift = useCallback(
    (regionId: string, lift: Lift, direction: "up" | "down") => {
      setHydrated(true);
      setEntries((prev) => {
        const existing = prev.findIndex(
          (e) =>
            e.regionId === regionId &&
            e.liftNr === lift.nr &&
            e.direction === direction
        );
        if (existing >= 0) {
          return prev.map((e, i) =>
            i === existing ? { ...e, count: e.count + 1 } : e
          );
        }
        const points =
          direction === "up" ? (lift.up ?? 0) : (lift.down ?? 0);
        return [
          ...prev,
          {
            regionId,
            liftNr: lift.nr,
            liftName: lift.name,
            direction,
            count: 1,
            points,
          },
        ];
      });
      setShowPlanner(true);
    },
    []
  );

  const removeEntry = useCallback((index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateCount = useCallback((index: number, delta: number) => {
    setEntries((prev) =>
      prev.map((e, i) => {
        if (i !== index) return e;
        return { ...e, count: Math.max(0, e.count + delta) };
      })
    );
  }, []);

  const clearPlan = useCallback(() => {
    setEntries([]);
  }, []);

  const loadPreset = useCallback(
    (preset: Preset) => {
      const newEntries = decodePlan(
        preset.entries
          .map(
            (e) =>
              `${e.regionId}:${e.liftNr}:${e.direction === "up" ? "u" : "d"}:${e.count}`
          )
          .join(","),
        liftData.regions
      );
      setHydrated(true);
      setEntries(newEntries);
      setShowPlanner(true);
    },
    [liftData.regions]
  );

  const totalPoints = useMemo(
    () => entries.reduce((sum, e) => sum + e.points * e.count, 0),
    [entries]
  );

  const euroCosts = useMemo(() => {
    if (totalPoints === 0) return null;
    return {
      pointTiers: [
        { label: "600 pts @ €50", cost: (totalPoints / 600) * 50 },
        { label: "1,000 pts @ €80", cost: (totalPoints / 1000) * 80 },
        { label: "2,100 pts @ €150", cost: (totalPoints / 2100) * 150 },
      ],
    };
  }, [totalPoints]);

  const toggleRegion = useCallback((regionId: string) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  }, []);

  // Filter regions/lifts by search
  const filteredRegions = useMemo(() => {
    if (!search.trim()) return liftData.regions;
    const q = search.toLowerCase();
    return liftData.regions
      .map((r) => ({
        ...r,
        lifts: r.lifts.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.nr.toLowerCase().includes(q)
        ),
      }))
      .filter((r) => r.lifts.length > 0);
  }, [liftData.regions, search]);

  // Auto-expand regions when searching
  const displayRegions = useMemo(() => {
    if (search.trim()) {
      return filteredRegions.map((r) => ({ ...r, expanded: true }));
    }
    return filteredRegions.map((r) => ({
      ...r,
      expanded: expandedRegions.has(r.id),
    }));
  }, [filteredRegions, expandedRegions, search]);

  const regionNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of liftData.regions) map.set(r.id, r.name);
    return map;
  }, [liftData.regions]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dolomiti Superski Lift Points
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Browse lift point costs and plan your day
          </p>
        </header>

        {/* Preset plans */}
        <div className="mb-4 flex flex-wrap gap-2">
          {presetData.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: preset.color }}
              />
              {preset.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search lifts by name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        {/* Regions */}
        <div className="space-y-2">
          {displayRegions.map((region) => (
            <div
              key={region.id}
              className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
            >
              <button
                onClick={() => toggleRegion(region.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {region.name}
                </span>
                <span className="flex items-center gap-2 text-xs text-zinc-400">
                  <span>{region.lifts.length} lifts</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${region.expanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              {region.expanded && (
                <div className="border-t border-zinc-100 dark:border-zinc-800">
                  <LiftTable
                    lifts={region.lifts}
                    regionId={region.id}
                    onAddLift={addLift}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Day planner sidebar */}
      {showPlanner && (
        <div className="border-t border-zinc-200 bg-zinc-50 p-4 sm:p-6 lg:w-[32rem] lg:border-l lg:border-t-0 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Day Plan
              {entries.length > 0 && (
                <span className="ml-2 text-sm font-normal text-zinc-400">
                  ({entries.reduce((sum, e) => sum + e.count, 0)} lifts)
                </span>
              )}
            </h2>
            <button
              onClick={() => setShowPlanner(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 lg:hidden"
            >
              Hide
            </button>
          </div>

          {entries.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-400">
              Add lifts to start planning your day.
            </p>
          ) : (
            <>
              <div className="mt-3 space-y-2">
                {entries.map((entry, i) => (
                  <div
                    key={`${entry.regionId}-${entry.liftNr}-${entry.direction}-${i}`}
                    className="rounded-md border border-zinc-200 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {entry.liftName}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {regionNameMap.get(entry.regionId)} #{entry.liftNr}{" "}
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
                        onClick={() => removeEntry(i)}
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
                          onClick={() => updateCount(i, -1)}
                          className="h-5 w-5 rounded bg-zinc-100 text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono">
                          {entry.count}
                        </span>
                        <button
                          onClick={() => updateCount(i, 1)}
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
                ))}
              </div>

              <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    Total
                  </span>
                  <span className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-50">
                    {totalPoints} pts
                  </span>
                </div>
                {euroCosts && (
                  <div className="mt-2 space-y-2">
                    <div className="rounded-md bg-zinc-100 p-2 text-xs dark:bg-zinc-800">
                      <div className="mb-1 font-medium text-zinc-600 dark:text-zinc-300">Effective cost</div>
                      <div className="space-y-0.5 text-zinc-500 dark:text-zinc-400">
                        {euroCosts.pointTiers.map((tier) => (
                          <div key={tier.label} className="flex justify-between">
                            <span>{tier.label}</span>
                            <span className="font-mono">&euro;{tier.cost.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1000);
                    });
                  }}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors ${copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {copied ? "Copied!" : "Copy Share Link"}
                </button>
                <button
                  onClick={clearPlan}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Clear
                </button>
              </div>
            </>
          )}

          <div className="mt-4">
            <PassPrices />
          </div>
        </div>
      )}

      {/* Floating button to show planner on mobile when hidden */}
      {!showPlanner && entries.length > 0 && (
        <button
          onClick={() => setShowPlanner(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-blue-700 lg:hidden"
        >
          Plan ({entries.length}) - {totalPoints} pts
        </button>
      )}
    </div>
  );
}

export default function DayPlanner({
  liftData,
  presetData,
}: {
  liftData: LiftData;
  presetData: PresetData;
}) {
  return (
    <Suspense>
      <DayPlannerInner liftData={liftData} presetData={presetData} />
    </Suspense>
  );
}
