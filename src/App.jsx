import { useState, useEffect, useMemo } from "react";
import { RefreshCw, Bookmark, AlertCircle, Activity, Briefcase, Database, Globe, ArrowUp } from "lucide-react";
import { fetchJobs } from "@/lib/jobs-data";
import { StatCard } from "@/components/dashboard/StatCard";
import { MatchGauge } from "@/components/dashboard/MatchGauge";
import { SkillRadar } from "@/components/dashboard/SkillRadar";
import { ScoreDistribution } from "@/components/dashboard/ScoreDistribution";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { JobCard } from "@/components/dashboard/JobCard";
import { PriorityGaps } from "@/components/dashboard/PriorityGaps";

const DEFAULT_FILTERS = {
  days: 7,
  minScore: 0,
  source: "all",
  remoteOnly: false,
  query: "",
  sort: "score",
};

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const load = async (currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJobs({
        days: currentFilters.days,
        min_score: currentFilters.minScore > 0 ? currentFilters.minScore : undefined,
        remote_only: currentFilters.remoteOnly || undefined,
        source: currentFilters.source !== "all" ? currentFilters.source : undefined,
      });
      setJobs(data);
      setLastSync(new Date());
    } catch {
      setError("Could not load jobs. The scraper may not have run yet today.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("apexscout:bookmarks");
      if (saved) setBookmarks(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("apexscout:bookmarks", JSON.stringify([...next]));
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = jobs.filter((j) => {
      if (j.score < filters.minScore) return false;
      if (filters.source !== "all" && j.source !== filters.source) return false;
      if (filters.remoteOnly && !j.remote) return false;
      if (showSavedOnly && !bookmarks.has(j.id)) return false;
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase();
        const hay = `${j.title} ${j.company} ${j.tags.join(" ")} ${j.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (filters.sort === "score") return b.score - a.score;
      if (filters.sort === "date") return a.postedDaysAgo - b.postedDaysAgo;
      return b.salaryMax - a.salaryMax;
    });
  }, [jobs, filters, bookmarks, showSavedOnly]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const avg = total
      ? jobs.reduce((s, j) => s + j.score, 0) / total
      : 0;
    const remote = jobs.filter((j) => j.remote).length;
    const sources = new Set(jobs.map((j) => j.source)).size;
    const strong = jobs.filter((j) => j.score >= 85).length;
    const topScore = jobs.length ? Math.max(...jobs.map((j) => j.score)) : 0;
    const salaries = jobs.filter((j) => j.salaryMax > 0).map((j) => j.salaryMax);
    const medianSalary = salaries.length
      ? salaries.sort((a, b) => a - b)[Math.floor(salaries.length / 2)]
      : 0;
    return { total, avg, remote, sources, strong, topScore, medianSalary };
  }, [jobs]);

  const syncTime = lastSync
    ? lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  return (
    <div className="min-h-screen bg-brand-bg text-foreground">

      {/* ── HERO ── */}
      <section
        className="relative border-b border-brand-border"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.27 0.008 286 / 0.15) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.27 0.008 286 / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      >
        {/* Nav bar */}
        <nav className="flex items-center justify-end px-6 lg:px-10 py-4 border-b border-brand-border/50">
          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <span>Pipeline <span className="text-foreground">MIA-EAST-1</span></span>
            <span>Cron <span className="text-foreground">07:00 EST</span></span>
            {syncTime && <span>Sync <span className="text-foreground">{syncTime}</span></span>}
            <span className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${error ? "bg-brand-danger" : "bg-brand-primary animate-pulse"}`} />
              <span className={error ? "text-brand-danger" : "text-brand-primary"}>
                {error ? "Offline" : "Live"}
              </span>
            </span>
          </div>
        </nav>

        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Your jobs,{" "}
              <span className="text-brand-primary">scored</span>
              <br />
              <span className="text-foreground/40 font-light">daily.</span>
            </h1>
            <p className="mt-5 text-muted-foreground text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
              Gemini scans four job boards every morning at 07:00 EST and ranks each listing
              against your profile.{" "}
              {stats.total > 0 && (
                <>
                  <span className="text-brand-primary font-semibold">{stats.strong} strong</span>
                  {stats.strong === 1 ? " match" : " matches"} out of {stats.total} listings today.
                </>
              )}
            </p>
          </div>

          {/* Buttons — centered */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <button
              onClick={() => load()}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-52 px-5 py-3 bg-brand-primary text-brand-bg font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm uppercase tracking-wider"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Stream
            </button>
            <button
              onClick={() => setShowSavedOnly((v) => !v)}
              className={`flex items-center justify-center gap-2 w-52 px-5 py-3 rounded-lg border font-bold text-sm uppercase tracking-wider transition-colors ${
                showSavedOnly
                  ? "border-brand-primary text-brand-primary bg-brand-primary/10"
                  : "border-brand-border text-foreground hover:bg-brand-card"
              }`}
            >
              <Bookmark className="size-4" />
              Saved [{String(bookmarks.size).padStart(2, "0")}]
            </button>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">

        {error ? (
          <div className="bg-brand-card border border-brand-danger/40 rounded-xl p-8 flex items-start gap-4">
            <div className="size-10 bg-brand-danger/15 text-brand-danger rounded-full flex items-center justify-center shrink-0">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Data pipeline offline</h3>
              <p className="text-muted-foreground mt-1">{error}</p>
              <button
                onClick={() => load()}
                className="mt-4 px-4 py-2 bg-brand-card border border-brand-border rounded-lg text-sm font-semibold hover:bg-brand-border/40 transition-colors"
              >
                Retry connection
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Match gauge */}
              <MatchGauge
                avg={stats.avg}
                total={stats.total}
                strong={stats.strong}
                remote={stats.remote}
                sources={stats.sources}
              />

              {/* Right: stat cards + radar */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    label="Total Scraped"
                    value={String(stats.total).padStart(3, "0")}
                    icon={Briefcase}
                  />
                  <StatCard
                    label="Median Salary"
                    value={stats.medianSalary ? `$${Math.round(stats.medianSalary / 1000)}k` : "N/A"}
                    icon={Activity}
                    tone="primary"
                  />
                  <StatCard
                    label="Top Score"
                    value={stats.topScore ? `${stats.topScore}%` : "—"}
                    icon={Globe}
                    tone="primary"
                  />
                  <StatCard
                    label="Saved"
                    value={String(bookmarks.size).padStart(2, "0")}
                    icon={Database}
                    tone="secondary"
                  />
                </div>
                <SkillRadar jobs={jobs} />
              </div>
            </div>

            {/* Score distribution */}
            {jobs.length > 0 && <ScoreDistribution jobs={jobs} />}

            {/* Priority gaps */}
            <PriorityGaps jobs={jobs} />

            {/* Filter bar */}
            <FilterBar filters={filters} onChange={setFilters} />

            {/* Job listings */}
            <section className="space-y-4 pb-20">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                  Matched Listings{" "}
                  <span className="font-mono text-foreground/60">
                    [{filtered.length} OF {jobs.length}]
                  </span>
                </h2>
              </div>

              {loading && jobs.length === 0 ? (
                <div className="grid gap-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-48 bg-brand-card border border-brand-border rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-brand-card border border-brand-border rounded-xl p-10 text-center">
                  <p className="text-muted-foreground">
                    No jobs match the current filters. Try lowering the minimum score or
                    expanding the timeframe.
                  </p>
                </div>
              ) : (
                filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    bookmarked={bookmarks.has(job.id)}
                    onToggleBookmark={() => toggleBookmark(job.id)}
                  />
                ))
              )}
            </section>
          </>
        )}
      </main>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-brand-card border border-brand-border text-muted-foreground hover:text-brand-primary hover:border-brand-primary transition-colors shadow-lg"
        >
          <ArrowUp className="size-5" />
        </button>
      )}
    </div>
  );
}
