# Dolomiti Superski Lift Points

Browse lift point costs across all 12 Dolomiti Superski regions and plan your ski day.

## Features

- **Lift data for 12 regions** — Alta Badia, Val Gardena, Val di Fassa, Arabba, 3 Zinnen, Kronplatz, Cortina, Val di Fiemme, Civetta, San Martino, Gitschberg, Alpe Lusia
- **Day planner** — select lifts with direction (up/down) and adjust counts to see total point cost
- **Search** — filter lifts across all regions by name, number, or zone
- **Shareable URLs** — plan state is encoded in the URL query string for easy sharing/bookmarking
- **Preset plans** — quick-load Sellaronda clockwise and counter-clockwise tours

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
data/
  lifts.json          # All lift data for 12 regions
  preset-plans.json   # Pre-built Sellaronda tour plans
app/
  types.ts            # TypeScript interfaces
  page.tsx            # Home page (server component)
  layout.tsx          # Root layout with metadata
  components/
    DayPlanner.tsx    # Main client component (search, regions, day plan, URL sync)
    LiftTable.tsx     # Lift table with add buttons
```

## URL Format

Plans are encoded as `?plan=<regionNumericId>:<liftNr>:<u|d>:<count>,...`

Example: `?plan=2:29:u:1,1:19:u:2` = Val Gardena lift #29 up x1, Alta Badia lift #19 up x2

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript
