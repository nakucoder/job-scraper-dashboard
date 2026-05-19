import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Briefcase, MapPin, DollarSign, Cloud, AlertTriangle, BookOpen, ExternalLink, RefreshCw } from "lucide-react";
import axios from "axios";

const API_URL = "https://q0xo68b302.execute-api.us-east-1.amazonaws.com/Prod/jobs";

const scoreColor = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
};

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    days: 1,
    min_score: 0,
    remote_only: false,
    source: ""
  });
  const [stats, setStats] = useState({});

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("days", filters.days);
      if (filters.min_score > 0) params.append("min_score", filters.min_score);
      if (filters.remote_only) params.append("remote_only", "true");
      if (filters.source) params.append("source", filters.source);

      const res = await axios.get(`${API_URL}?${params.toString()}`);
      setJobs(res.data.jobs || []);

      // compute stats
      const jobList = res.data.jobs || [];
      const avgScore = jobList.length
        ? Math.round(jobList.reduce((a, b) => a + (b.match_score_percent || 0), 0) / jobList.length)
        : 0;
      const remoteCount = jobList.filter(j => j.is_remote).length;
      const sources = [...new Set(jobList.map(j => j.source))];
      setStats({ total: jobList.length, avgScore, remoteCount, sources });
    } catch (e) {
      setError("Could not load jobs. The scraper may not have run yet today.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const scoreDistribution = [
    { range: "0-25", count: jobs.filter(j => j.match_score_percent < 25).length },
    { range: "25-50", count: jobs.filter(j => j.match_score_percent >= 25 && j.match_score_percent < 50).length },
    { range: "50-75", count: jobs.filter(j => j.match_score_percent >= 50 && j.match_score_percent < 75).length },
    { range: "75-100", count: jobs.filter(j => j.match_score_percent >= 75).length },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1e293b", color: "white", padding: "24px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>🚀 Job Scraper Dashboard</h1>
            <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 14 }}>Multi-Cloud AI-Powered Job Pipeline</p>
          </div>
          <button onClick={fetchJobs} style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 32px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Jobs", value: stats.total || 0, icon: <Briefcase size={20} color="#2563eb" /> },
            { label: "Avg Match Score", value: `${stats.avgScore || 0}%`, icon: <Cloud size={20} color="#22c55e" /> },
            { label: "Remote Jobs", value: stats.remoteCount || 0, icon: <MapPin size={20} color="#f59e0b" /> },
            { label: "Sources", value: (stats.sources || []).length, icon: <DollarSign size={20} color="#8b5cf6" /> },
          ].map((s, i) => (
            <div key={i} style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>{s.label}</p>
                {s.icon}
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: "bold", color: "#111827" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Score Distribution Chart */}
        {jobs.length > 0 && (
          <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: 24 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 16, color: "#111827" }}>Match Score Distribution</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={scoreDistribution}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={index} fill={["#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filters */}
        <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: 24, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <label style={{ fontSize: 13, color: "#6b7280" }}>Days</label>
            <select value={filters.days} onChange={e => setFilters({ ...filters, days: e.target.value })}
              style={{ display: "block", marginTop: 4, padding: "6px 12px", borderRadius: 6, border: "1px solid #e5e7eb" }}>
              <option value={1}>Today</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#6b7280" }}>Min Score</label>
            <select value={filters.min_score} onChange={e => setFilters({ ...filters, min_score: e.target.value })}
              style={{ display: "block", marginTop: 4, padding: "6px 12px", borderRadius: 6, border: "1px solid #e5e7eb" }}>
              <option value={0}>Any</option>
              <option value={50}>50%+</option>
              <option value={75}>75%+</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#6b7280" }}>Source</label>
            <select value={filters.source} onChange={e => setFilters({ ...filters, source: e.target.value })}
              style={{ display: "block", marginTop: 4, padding: "6px 12px", borderRadius: 6, border: "1px solid #e5e7eb" }}>
              <option value="">All</option>
              <option value="USAJobs">USAJobs</option>
              <option value="Remotive">Remotive</option>
              <option value="StackOverflow">StackOverflow</option>
              <option value="Indeed">Indeed</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
            <input type="checkbox" checked={filters.remote_only} onChange={e => setFilters({ ...filters, remote_only: e.target.checked })} />
            <label style={{ fontSize: 13, color: "#6b7280" }}>Remote only</label>
          </div>
          <button onClick={fetchJobs} style={{ marginTop: 20, background: "#2563eb", color: "white", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}>
            Apply
          </button>
        </div>

        {/* Jobs List */}
        {loading && <p style={{ textAlign: "center", color: "#6b7280" }}>Loading jobs...</p>}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 20, textAlign: "center", color: "#dc2626" }}>
            {error}
          </div>
        )}
        {!loading && !error && jobs.length === 0 && (
          <div style={{ background: "white", borderRadius: 12, padding: 40, textAlign: "center", color: "#6b7280", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <Briefcase size={40} color="#d1d5db" />
            <p style={{ marginTop: 16 }}>No jobs yet — the scraper runs every morning at 7am Miami time.</p>
          </div>
        )}
        {!loading && jobs.map((job, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, color: "#111827" }}>{job.title}</h2>
                <p style={{ margin: "4px 0", color: "#6b7280", fontSize: 14 }}>{job.company} — {job.location} {job.is_remote ? "✅ Remote" : "🏢 On-site"}</p>
                <p style={{ margin: "4px 0", color: "#6b7280", fontSize: 14 }}>
                  💰 {job.estimated_salary_min && job.estimated_salary_max ? `$${job.estimated_salary_min?.toLocaleString()} - $${job.estimated_salary_max?.toLocaleString()}` : "Salary not specified"} &nbsp;|&nbsp;
                  ☁️ {job.primary_cloud || "N/A"} &nbsp;|&nbsp;
                  📌 {job.source}
                </p>
              </div>
              <span style={{ background: scoreColor(job.match_score_percent), color: "white", padding: "4px 14px", borderRadius: 20, fontWeight: "bold", fontSize: 14, whiteSpace: "nowrap" }}>
                {job.match_score_percent}% match
              </span>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "12px 0" }} />
            {job.constraint_violations?.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                {job.constraint_violations.map((v, i) => (
                  <p key={i} style={{ margin: "2px 0", fontSize: 13, color: "#dc2626" }}>
                    <AlertTriangle size={12} style={{ marginRight: 4 }} />⚠️ {v}
                  </p>
                ))}
              </div>
            )}
            {job.upskill_recommendations?.length > 0 && (
              <p style={{ margin: "4px 0", fontSize: 13, color: "#6b7280" }}>
                <BookOpen size={12} style={{ marginRight: 4 }} />
                📚 Upskill: {job.upskill_recommendations.join(", ")}
              </p>
            )}
            <a href={job.url} target="_blank" rel="noreferrer"
              style={{ display: "inline-block", marginTop: 12, background: "#2563eb", color: "white", padding: "8px 16px", borderRadius: 6, textDecoration: "none", fontSize: 14 }}>
              View Job <ExternalLink size={12} style={{ marginLeft: 4 }} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}