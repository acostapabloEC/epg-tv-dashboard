import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const weeklyData = [
  { week: "Jan 05", engagements: 49,  impressions: 3648,  posts: 3  },
  { week: "Jan 12", engagements: 359, impressions: 21385, posts: 8  },
  { week: "Jan 19", engagements: 104, impressions: 9534,  posts: 6  },
  { week: "Jan 26", engagements: 154, impressions: 15452, posts: 7  },
  { week: "Feb 02", engagements: 96,  impressions: 9714,  posts: 8  },
  { week: "Feb 09", engagements: 229, impressions: 20769, posts: 10 },
  { week: "Feb 16", engagements: 85,  impressions: 12127, posts: 9  },
  { week: "Feb 23", engagements: 138, impressions: 9501,  posts: 9  },
  { week: "Mar 02", engagements: 198, impressions: 12040, posts: 22 },
  { week: "Mar 09", engagements: 130, impressions: 12579, posts: 25 },
  { week: "Mar 16", engagements: 190, impressions: 9776,  posts: 26 },
  { week: "Mar 23", engagements: 44,  impressions: 8379,  posts: 24 },
  { week: "Mar 30", engagements: 86,  impressions: 9787,  posts: 7  },
  { week: "Apr 06", engagements: 74,  impressions: 6632,  posts: 16 },
];

const GOLD     = "#c9a84c";
const GOLD_DIM = "rgba(201,168,76,0.15)";
const GREEN    = "#3fb950";
const GREEN_DIM= "rgba(63,185,80,0.12)";
const RED      = "#f85149";
const RED_DIM  = "rgba(248,81,73,0.12)";
const BLUE     = "#58a6ff";
const PURPLE   = "#a855f7";
const MUTED    = "#8892a4";
const BORDER   = "rgba(255,255,255,0.07)";
const SURFACE  = "#111827";
const BG       = "#0a0f1e";

const engMoM  = Math.round(((591 - 543) / 543) * 100);
const imprMoM = Math.round(((46576 - 52925) / 52925) * 100);
const follMoM = Math.round(((163 - 138) / 138) * 100);
const aprEng  = 145;
const aprPct  = Math.round((aprEng / 750) * 100);

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const h = time.getHours() % 12 || 12;
  const m = String(time.getMinutes()).padStart(2, "0");
  const ampm = time.getHours() >= 12 ? "PM" : "AM";
  const date = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: "#f0f6fc", letterSpacing: 1 }}>{h}:{m} {ampm}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED, marginTop: 1 }}>{date}</div>
    </div>
  );
}

function KpiCard({ source, label, value, delta, deltaLabel, accent, sub }) {
  const isUp = delta > 0;
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", height: "100%" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent || GOLD, borderRadius: "10px 10px 0 0" }} />
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: MUTED, textTransform: "uppercase", marginBottom: 5 }}>{source}</div>
      <div style={{ fontSize: 12, color: "#a0aab4", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 46, fontWeight: 700, color: "#f0f6fc", lineHeight: 1, marginBottom: 8, flex: 1, display: "flex", alignItems: "center" }}>{value}</div>
      {delta !== undefined && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: isUp ? GREEN_DIM : RED_DIM, color: isUp ? GREEN : RED, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, width: "fit-content", marginBottom: 3 }}>
          {isUp ? "↑" : "↓"} {Math.abs(delta)}%
        </div>
      )}
      {deltaLabel && <div style={{ fontSize: 10, color: MUTED }}>{deltaLabel}</div>}
      {sub && <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a2235", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px" }}>
      <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color }}>{p.name}: <strong>{p.value?.toLocaleString()}</strong></div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ background: BG, width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "'DM Sans', sans-serif", color: "#f0f6fc", display: "grid", gridTemplateRows: "54px 1fr 32px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
      `}</style>

      {/* HEADER */}
      <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: GOLD, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: BG }}>E</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Elite Partners Group — Marketing Performance</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED, letterSpacing: 1, textTransform: "uppercase" }}>Frank LaRosa · LinkedIn · Jan–Apr 10, 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ background: GOLD_DIM, color: GOLD, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", padding: "4px 12px", borderRadius: 6, border: `1px solid rgba(201,168,76,0.2)` }}>
            Q2 Goal · 750 eng/month · 187/week
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: MUTED }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN, animation: "pulse 2s infinite" }} />
            Live
          </div>
          <Clock />
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gridTemplateRows: "1fr 1.8fr", gap: 10, overflow: "hidden" }}>

        {/* ROW 1 — KPI CARDS */}
        <KpiCard source="LinkedIn · Frank LaRosa" label="Total Engagements (Mar)" value="591" delta={engMoM} deltaLabel="vs Feb (543)" accent={GOLD} />
        <KpiCard source="LinkedIn · Frank LaRosa" label="Total Impressions (Mar)" value="46.6K" delta={imprMoM} deltaLabel="vs Feb (52.9K)" accent={BLUE} />
        <KpiCard source="LinkedIn · Frank LaRosa" label="New Followers (Mar)" value="163" delta={follMoM} deltaLabel="vs Feb (138)" accent={GREEN} />
        <KpiCard source="LinkedIn · Frank LaRosa" label="Total Followers" value="12,764" accent={PURPLE} sub="As of April 10, 2026" />

        {/* ROW 2 — CHART spans 2 cols */}
        <div style={{ gridColumn: "span 2", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 16px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: GOLD, borderRadius: "10px 10px 0 0" }} />
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>Weekly Engagements & Impressions</div>
          <div style={{ fontSize: 10, color: MUTED, marginBottom: 6 }}>Jan–Apr 2026 · Green dashed = 187 weekly goal</div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="55%">
              <AreaChart data={weeklyData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="imprGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BLUE} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="week" tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, color: MUTED }} />
                <ReferenceLine yAxisId="left" y={187} stroke={GREEN} strokeDasharray="4 4" label={{ value: "Goal", fill: GREEN, fontSize: 9, position: "insideTopRight" }} />
                <Area yAxisId="left" type="monotone" dataKey="engagements" name="Engagements" stroke={GOLD} strokeWidth={2} fill="url(#engGrad)" dot={false} activeDot={{ r: 3, fill: GOLD }} />
                <Area yAxisId="right" type="monotone" dataKey="impressions" name="Impressions" stroke={BLUE} strokeWidth={1.5} fill="url(#imprGrad)" strokeDasharray="5 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, marginTop: 8, marginBottom: 4 }}>Posts Per Week</div>
            <ResponsiveContainer width="100%" height="35%">
              <BarChart data={weeklyData} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                <XAxis dataKey="week" tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={5} stroke={GREEN} strokeDasharray="4 4" />
                <Bar dataKey="posts" name="Posts" fill={GOLD} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Q2 GOAL CARD */}
        <div style={{ background: "linear-gradient(135deg, #1a1600 0%, #0f1208 100%)", border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 10, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>Q2 2026 · LinkedIn Goal</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 1 }}>2,250</div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>Total engagement target</div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: GOLD }}>April Progress</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: GOLD }}>{aprEng} / 750</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${Math.min(aprPct, 100)}%`, background: GOLD, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 9, color: MUTED }}>{aprPct}% of goal · Apr 10 · 20 days remaining</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
            {[{ label: "April", val: "750" }, { label: "May", val: "750" }, { label: "June", val: "750" }].map((g) => (
              <div key={g.label} style={{ background: "rgba(201,168,76,0.08)", borderRadius: 6, padding: "7px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: MUTED, marginBottom: 2 }}>{g.label}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: GOLD }}>{g.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Q1 RECAP */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Q1 2026 Recap</div>
          {[
            { label: "Total Engagements", val: "1,745",   color: GOLD   },
            { label: "Total Impressions",  val: "149,474", color: BLUE   },
            { label: "New Followers",       val: "459",    color: GREEN  },
            { label: "Total Followers",     val: "12,764", color: PURPLE },
            { label: "Posts Published",     val: "~181",   color: MUTED  },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 11, color: MUTED }}>{item.label}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: item.color }}>{item.val}</span>
            </div>
          ))}
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", fontFamily: "'DM Mono', monospace", fontSize: 9, color: MUTED, letterSpacing: 0.5 }}>
        <span>Elite Partners Group · TV Dashboard · Frank LaRosa LinkedIn</span>
        <span>Source: LinkedIn Analytics Export · Jan 11 – Apr 10, 2026</span>
        <span>Q2 Goal: 2,250 engagements · Updated weekly</span>
      </div>
    </div>
  );
}
