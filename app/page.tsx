import liftData from "../data/lifts";
import presetData from "../data/preset-plans";
import DayPlanner from "./components/DayPlanner";

export default function Home() {
  return (
    <DayPlanner
      liftData={liftData}
      presetData={presetData}
    />
  );
}
