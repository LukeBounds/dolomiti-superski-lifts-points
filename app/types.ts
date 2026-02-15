export interface Lift {
  nr: string;
  name: string;
  up: number | null;
  down: number | null;
  zone?: string;
  liftType?: string;
}

export interface Region {
  id: string;
  numericId: number;
  name: string;
  lifts: Lift[];
}

export interface LiftData {
  regions: Region[];
}

export interface DayPlanEntry {
  regionId: string;
  liftNr: string;
  liftName: string;
  direction: "up" | "down";
  count: number;
  points: number;
}

export interface PresetEntry {
  regionId: number;
  liftNr: string;
  direction: "up" | "down";
  count: number;
}

export interface Preset {
  id: string;
  name: string;
  color: string;
  entries: PresetEntry[];
}

export interface PresetData {
  presets: Preset[];
}
