# Job Scraper Dashboard

A personal dashboard that displays Gemini AI-scored job listings from the Multi-Cloud Job Scraper Pipeline. Scores every listing against your profile every morning at 07:00 EST.

## Live Demo

[job-scraper-dashboard-taupe.vercel.app](https://job-scraper-dashboard-taupe.vercel.app)

## Features

- Daily job listings scored by Gemini AI (match % against your profile)
- Circular match index gauge with strong / remote / sources breakdown
- Skill coverage radar chart derived from today's job titles
- Score distribution chart (red → amber → blue → green)
- Priority skill gaps — recurring blockers across stretch-zone listings
- Full filter bar — search, timeframe, min score slider, source, sort, remote toggle
- Job cards with left accent bar, score ring, gaps, and upskill path
- Bookmark jobs — saved to localStorage
- Scroll-to-top button
- Mobile responsive

## API

Consumes the `/jobs` endpoint from the backend scraper pipeline:

```
GET https://q0xo68b302.execute-api.us-east-1.amazonaws.com/Prod/jobs
```

| Parameter   | Type   | Description            |
|-------------|--------|------------------------|
| days        | int    | Days of history        |
| min_score   | int    | Minimum match score    |
| remote_only | bool   | Remote jobs only       |
| source      | string | USAJobs / Remotive / StackOverflow / Indeed |

## Project Structure

```
src/
├── App.jsx                        # Main layout + state
├── index.css                      # Tailwind v4 + brand tokens
├── main.jsx                       # Entry point
├── lib/
│   ├── jobs-data.ts               # API client + Job type + field mapping
│   └── utils.ts                   # cn() helper
└── components/dashboard/
    ├── StatCard.tsx
    ├── MatchGauge.tsx
    ├── SkillRadar.tsx
    ├── ScoreDistribution.tsx
    ├── FilterBar.tsx
    ├── JobCard.tsx
    └── PriorityGaps.tsx
```

## Run Locally

```bash
cd ~/job-scraper-dashboard
npm install
npm run dev
```

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Recharts — bar chart + radar chart
- Lucide React — icons
- Axios — API calls
- Vercel — deployment

## Author

Juan Spinelli — Miami, FL
