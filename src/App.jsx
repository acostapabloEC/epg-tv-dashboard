import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

// ── REAL DATA ─────────────────────────────────────────────────────────────
const weeklyData = [
  { week: "Feb 09", engagements: 229, impressions: 20769 },
  { week: "Feb 16", engagements: 85,  impressions: 12127 },
  { week: "Feb 23", engagements: 138, impressions: 9501  },
  { week: "Mar 02", engagements: 198, impressions: 12040 },
  { week: "Mar 09", engagements: 130, impressions: 12579 },
  { week: "Mar 16", engagements: 190, impressions: 9776  },
  { week: "Mar 23", engagements: 44,  impressions: 8379  },
  { week: "Mar 30", engagements: 20,  impressions: 3546  },
];

const GOLD     = "#c9a84c";
const GOLD_DIM = "rgba(201,168,76,0.15)";
const GREEN    = "#3fb950";
const GREEN_DIM= "rgba(63,185,80,0.12)";
const RED      = "#f85149";
const RED_DIM  = "rgba(248,81,73,0.12)";
const BLUE     = "#58a6ff";
const MUTED    = "#8892a4";
const BORDER   = "rgba(255,255,255,0.07)";
const SURFACE  = "#111827";
const BG       = "#0a0f1e";

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const h = time.getHours() % 12 || 12;
  const m = String(time.getMinutes()).padStart(2, "0");
  const ampm = time.getHours() >= 12 ? "PM" : "AM";
  const date = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, color: "#f0f6fc", letterSpacing: 1 }}>{h}:{m} {ampm}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED, marginTop: 2 }}>{date}</div>
    </div>
  );
}

function KpiCard({ source, label, value, delta, deltaLabel, accent, sub }) {
  const isUp = delta > 0;
  return (
    <div style={{
      background: SURFACE, border: `1px solid ${BORDER}`,
      borderRadius: 10, padding: "16px 20px",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
      height: "100%",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent || GOLD, borderRadius: "10px 10px 0 0" }} />
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: MUTED, textTransform: "uppercase", marginBottom: 6 }}>{source}</div>
      <div style={{ fontSize: 12, color: "#a0aab4", marginBottom: 4, lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 700, color: "#f0f6fc", lineHeight: 1, marginBottom: 8, flex: 1, display: "flex", alignItems: "center" }}>
        {value}
      </div>
      {delta !== undefined && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: isUp ? GREEN_DIM : RED_DIM, color: isUp ? GREEN : RED, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, width: "fit-content", marginBottom: 4 }}>
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
        <div key={i} style={{ fontSize: 12, color: p.color }}>{p.name}: <strong>{p.value.toLocaleString()}</strong></div>
      ))}
    </div>
  );
}

export default function App() {
  const engMoM  = Math.round(((591 - 543) / 543) * 100);
  const imprMoM = Math.round(((46576 - 52925) / 52925) * 100);
  const follMoM = Math.round(((163 - 138) / 138) * 100);
  const podMoM  = Math.round(((330 - 375) / 375) * 100);

  return (
    <div style={{
      background: BG,
      width: "100vw", height: "100vh",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
      color: "#f0f6fc",
      display: "grid",
      gridTemplateRows: "56px 1fr 36px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
      `}</style>

      {/* HEADER */}
      <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 32, height: 32, background: GOLD, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: BG }}>E</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Elite Partners Group — Marketing Performance</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED, letterSpacing: 1, textTransform: "uppercase" }}>Frank LaRosa · LinkedIn + Podcast · Q1 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
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
      <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "1fr 1fr", gap: 10, overflow: "hidden" }}>

        {/* ROW 1 — KPI CARDS */}
        <KpiCard
          source="LinkedIn · Frank LaRosa"
          label="Total Engagements (Mar)"
          value="591"
          delta={engMoM}
          deltaLabel="vs Feb (543)"
          accent={GOLD}
        />
        <KpiCard
          source="LinkedIn · Frank LaRosa"
          label="Total Impressions (Mar)"
          value="46.6K"
          delta={imprMoM}
          deltaLabel="vs Feb (52.9K)"
          accent={BLUE}
        />
        <KpiCard
          source="LinkedIn · Frank LaRosa"
          label="New Followers (Mar)"
          value="163"
          delta={follMoM}
          deltaLabel="vs Feb (138)"
          accent={GREEN}
        />
        <KpiCard
          source="Simplecast · Advisor Talk"
          label="Podcast Downloads (7-Day)"
          value="330"
          delta={podMoM}
          deltaLabel="vs prior 7 days (375)"
          sub="All-time: 179,349"
          accent={BLUE}
        />

        {/* ROW 2 — CHART spans 2 cols + 2 stat cards */}
        <div style={{ gridColumn: "span 2", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: GOLD, borderRadius: "10px 10px 0 0" }} />
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Weekly Engagements — Frank LaRosa LinkedIn</div>
          <div style={{ fontSize: 10, color: MUTED, marginBottom: 10 }}>Last 8 weeks · Green line = Q2 weekly goal (187)</div>
          <ResponsiveContainer width="100%" height="78%">
            <AreaChart data={weeklyData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="week" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={187} stroke={GREEN} strokeDasharray="4 4" label={{ value: "Goal", fill: GREEN, fontSize: 10, position: "right" }} />
              <Area type="monotone" dataKey="engagements" name="Engagements" stroke={GOLD} strokeWidth={2.5} fill="url(#engGrad)" dot={false} activeDot={{ r: 4, fill: GOLD }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Q2 Goal Progress */}
        <div style={{ background: "linear-gradient(135deg, #1a1600 0%, #0f1208 100%)", border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 10, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>Q2 2026 · LinkedIn Goal</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: GOLD, lineHeight: 1 }}>2,250</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Total engagement target</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
            {[{ label: "April", val: "750" }, { label: "May", val: "750" }, { label: "June", val: "750" }].map((g) => (
              <div key={g.label} style={{ background: "rgba(201,168,76,0.08)", borderRadius: 6, padding: "8px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: MUTED, marginBottom: 3 }}>{g.label}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: GOLD }}>{g.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Q1 Recap */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Q1 2026 Recap</div>
          {[
            { label: "Total Engagements", val: "1,801",   color: GOLD  },
            { label: "Total Impressions",  val: "149,474", color: BLUE  },
            { label: "New Followers",       val: "489",    color: GREEN },
            { label: "Total Followers",     val: "12,745", color: MUTED },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 11, color: MUTED }}>{item.label}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: item.color }}>{item.val}</span>
            </div>
          ))}
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", fontFamily: "'DM Mono', monospace", fontSize: 9, color: MUTED, letterSpacing: 0.5 }}>
        <span>Elite Partners Group · TV Dashboard · Frank LaRosa LinkedIn</span>
        <span>Source: LinkedIn Analytics Export · Q1 2026 · Simplecast Advisor Talk</span>
        <span>Q2 Goal: 2,250 engagements · Updated weekly</span>
      </div>
    </div>
  );
}
