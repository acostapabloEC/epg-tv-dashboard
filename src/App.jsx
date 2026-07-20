import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const weeklyData = [
  { week: "Jan 05", engagements: 49,  impressions: 3648  },
  { week: "Jan 12", engagements: 359, impressions: 21385 },
  { week: "Jan 19", engagements: 104, impressions: 9534  },
  { week: "Jan 26", engagements: 154, impressions: 15452 },
  { week: "Feb 02", engagements: 96,  impressions: 9714  },
  { week: "Feb 09", engagements: 228, impressions: 20769 },
  { week: "Feb 16", engagements: 85,  impressions: 12127 },
  { week: "Feb 23", engagements: 138, impressions: 9501  },
  { week: "Mar 02", engagements: 198, impressions: 12040 },
  { week: "Mar 09", engagements: 130, impressions: 12579 },
  { week: "Mar 16", engagements: 190, impressions: 9776  },
  { week: "Mar 23", engagements: 44,  impressions: 8379  },
  { week: "Mar 30", engagements: 86,  impressions: 9787  },
  { week: "Apr 06", engagements: 93,  impressions: 8771  },
  { week: "Apr 13", engagements: 144, impressions: 10993 },
  { week: "Apr 20", engagements: 56,  impressions: 8273  },
  { week: "Apr 27", engagements: 68,  impressions: 3073  },
  { week: "May 04", engagements: 50,  impressions: 4064  },
  { week: "May 11", engagements: 35,  impressions: 3179  },
  { week: "May 18", engagements: 70,  impressions: 7588  },
  { week: "May 25", engagements: 24,  impressions: 3200  },
  { week: "Jun 01", engagements: 83,  impressions: 14931 },
  { week: "Jun 08", engagements: 12,  impressions: 1392  },
  { week: "Jun 15", engagements: 167, impressions: 14854 },
  { week: "Jun 22", engagements: 178, impressions: 22609, followers: 35 },
  { week: "Jun 29", engagements: 36,  impressions: 5107,  followers: 15 },
  { week: "Jul 01", engagements: 185, impressions: 19028, followers: 73 },
  { week: "Jul 06", engagements: 220, impressions: 32756, followers: 74 },
  { week: "Jul 13", engagements: 250, impressions: 32643, followers: 54 },
];

// ── Derived from data arrays — update by editing weeklyData ──
const DATA_YEAR      = 2026;
const TOTAL_FOLLOWERS = 13062;
const MONTHLY_GOALS  = { Jul: 700, Aug: 700, Sep: 700 };

const latestWeek = weeklyData[weeklyData.length - 1];
const prevWeek   = weeklyData[weeklyData.length - 2];

const _wStartDay     = parseInt(latestWeek.week.split(" ")[1]);
const _wMon          = latestWeek.week.split(" ")[0];
const _wEndDay       = _wStartDay + 6;
const weekLabel      = `${_wMon} ${_wStartDay}–${_wEndDay}`;
const dateRangeLabel = `Jan–${_wMon} ${_wEndDay}, ${DATA_YEAR}`;

const julEng  = weeklyData.filter(w => w.week.startsWith("Jul")).reduce((s, w) => s + w.engagements, 0);
const julGoal = MONTHLY_GOALS.Jul;
const julPct  = Math.round((julEng / julGoal) * 100);

function fmtK(n) { return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n); }

const engMoM  = Math.round(((latestWeek.engagements - prevWeek.engagements) / prevWeek.engagements) * 100);
const imprMoM = Math.round(((latestWeek.impressions - prevWeek.impressions) / prevWeek.impressions) * 100);
const follMoM = Math.round(((latestWeek.followers - prevWeek.followers) / prevWeek.followers) * 100);

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
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED, letterSpacing: 1, textTransform: "uppercase" }}>Frank LaRosa · LinkedIn · {dateRangeLabel}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ background: GOLD_DIM, color: GOLD, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", padding: "4px 12px", borderRadius: 6, border: `1px solid rgba(201,168,76,0.2)` }}>
            Jul 700 · Aug 700 · 175/week
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
        <KpiCard source="LinkedIn · Frank LaRosa" label={`Total Engagements (${weekLabel})`} value={latestWeek.engagements.toString()} delta={engMoM} deltaLabel={`vs prior week (${prevWeek.engagements})`} accent={GOLD} />
        <KpiCard source="LinkedIn · Frank LaRosa" label={`Total Impressions (${weekLabel})`} value={fmtK(latestWeek.impressions)} delta={imprMoM} deltaLabel={`vs prior week (${fmtK(prevWeek.impressions)})`} accent={BLUE} />
        <KpiCard source="LinkedIn · Frank LaRosa" label={`New Followers (${weekLabel})`} value={latestWeek.followers.toString()} delta={follMoM} deltaLabel={`vs prior week (${prevWeek.followers})`} accent={GREEN} />
        <KpiCard source="LinkedIn · Frank LaRosa" label="Total Followers" value={TOTAL_FOLLOWERS.toLocaleString()} accent={PURPLE} sub={`As of ${_wMon} ${_wEndDay}, ${DATA_YEAR}`} />

        {/* ROW 2 — CHART spans 2 cols */}
        <div style={{ gridColumn: "span 2", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 16px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: GOLD, borderRadius: "10px 10px 0 0" }} />
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>Weekly Engagements & Impressions</div>
          <div style={{ fontSize: 10, color: MUTED, marginBottom: 6 }}>Jan–May 2026 · Green dashed = 175 weekly goal</div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="90%">
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
                <ReferenceLine yAxisId="left" y={175} stroke={GREEN} strokeDasharray="4 4" label={{ value: "Goal", fill: GREEN, fontSize: 9, position: "insideTopRight" }} />
                <Area yAxisId="left" type="monotone" dataKey="engagements" name="Engagements" stroke={GOLD} strokeWidth={2} fill="url(#engGrad)" dot={false} activeDot={{ r: 3, fill: GOLD }} />
                <Area yAxisId="right" type="monotone" dataKey="impressions" name="Impressions" stroke={BLUE} strokeWidth={1.5} fill="url(#imprGrad)" strokeDasharray="5 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Q2 GOAL CARD — updated goals */}
        <div style={{ background: "linear-gradient(135deg, #1a1600 0%, #0f1208 100%)", border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 10, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>Q3 2026 · LinkedIn Goal</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 1 }}>2,100</div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>Total engagement target · 700/mo</div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: GOLD }}>{_wMon} (in progress)</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: GOLD }}>{julEng} / {julGoal}</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${Math.min(julPct, 100)}%`, background: GOLD, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 9, color: MUTED }}>{julPct}% of goal · in progress</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
            {[{ label: "July", val: "700" }, { label: "August", val: "700" }, { label: "September", val: "700" }].map((g) => (
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
            { label: "Total Engagements", val: "1,803",   color: GOLD   },
            { label: "Total Impressions",  val: "149,357", color: BLUE   },
            { label: "New Followers",       val: "491",    color: GREEN  },
            { label: "Total Followers",     val: "12,809", color: PURPLE },
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
        <span>Source: LinkedIn Native Analytics Export · Apr 3, 2025 – May 6, 2026</span>
        <span>Q3 Goals: Jul {MONTHLY_GOALS.Jul} · Aug {MONTHLY_GOALS.Aug} · Sep {MONTHLY_GOALS.Sep} · Weekly: 175</span>
      </div>
    </div>
  );
}
