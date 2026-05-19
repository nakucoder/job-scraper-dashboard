🚀 Job Scraper Dashboard

A React dashboard that displays AI-scored job listings from the Multi-Cloud Job Scraper Pipeline.

## 🌐 Live Demo

[job-scraper-dashboard-taupe.vercel.app](https://job-scraper-dashboard-taupe.vercel.app)

## 📊 Features

- Daily job listings scored by Gemini AI
- Filter by days, minimum match score, source, and remote status
- Match score distribution chart
- Stats cards — total jobs, average score, remote count, sources
- Direct links to job postings

## 🔗 Connected To

This dashboard consumes the `/jobs` API endpoint from the backend pipeline:
GET https://q0xo68b302.execute-api.us-east-1.amazonaws.com/Prod/jobs

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| days | int | Days of history | ?days=7 |
| min_score | int | Minimum match score | ?min_score=70 |
| remote_only | bool | Remote jobs only | ?remote_only=true |
| source | string | Filter by source | ?source=USAJobs |

## 🗂️ Project Structure

```
job-scraper-dashboard/
├── src/
│   ├── App.jsx        # Main dashboard component
│   ├── index.css      # Global styles
│   └── main.jsx       # Entry point
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## 🚀 Run Locally

```bash
npm install
npm run dev
```

## 🛠️ Tech Stack

- React + Vite
- Recharts — score distribution chart
- Lucide React — icons
- Axios — API calls
- Vercel — deployment

## 👨‍💻 Author

Juan Spinelli — Miami, FL
