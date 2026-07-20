# EPG TV Dashboard

React/Vite app. Mirrors the LinkedIn dashboard but TV-focused (shown on office screens).

- **Local:** `C:\Users\ECP\epg-tv-dashboard\`
- **GitHub:** acostapabloEC/epg-tv-dashboard
- **Vercel:** epg-tv-dashboard.vercel.app ✓ auto-deploy on push
- **Password:** Elite2026

---

## The one file to edit

**`src/App.jsx`** — same structure as the LinkedIn dashboard but simpler (no `posts` field, no `topPosts`, no `formatMix`).

| Constant | What it is |
|---|---|
| `weeklyData` | One row per week — engagements, impressions, followers |
| `TOTAL_FOLLOWERS` | Cumulative follower count |
| `MONTHLY_GOALS` | Monthly targets (Jul/Aug/Sep = 700) |

Everything else (header dates, KPI labels) derives automatically from `weeklyData[last]`.

---

## Weekly update workflow

Same export as the LinkedIn dashboard — same file, same week.

1. Append to `weeklyData`: `{ week: "Mon DD", engagements: N, impressions: N, followers: N }`
2. Update `TOTAL_FOLLOWERS`
3. Build and push:
   ```
   npm run build
   git add src/App.jsx
   git commit -m "Data: <Mon DD>-<Sun DD>"
   git push
   ```

**Always update this in the same session as the LinkedIn dashboard** — they share the same source numbers. This dashboard lags behind when they're updated separately.

---

## Week labeling convention

Same as LinkedIn dashboard: Monday start date, `"Mon DD"` format (e.g., `"Jul 06"`).

---

## Current data state

- Latest row: `"Jul 07"` — **stale, needs correcting to `"Jul 06"` with 220 eng / 32756 impr / 74 followers**
- Has the Jun 28 / Jun 29 duplicate row issue (same as LinkedIn dashboard) — do not replicate
- `TOTAL_FOLLOWERS` = 13045 — needs updating to 13050
- Missing May 11–Jun 08 rows entirely (gap in the data)

---

## Gotchas

- No `posts` field in this dashboard's weeklyData — don't add it, it's not used
- `follMoM` divides by `prevWeek.followers` — ensure last two rows always have `followers` set
