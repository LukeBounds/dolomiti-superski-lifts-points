import liftData from "../data/lifts.json";
import presetData from "../data/preset-plans.json";
import DayPlanner from "./components/DayPlanner";
import type { LiftData, PresetData } from "./types";

export default function Home() {
  return (
    <DayPlanner
      liftData={liftData as LiftData}
      presetData={presetData as PresetData}
    />
  );
}
