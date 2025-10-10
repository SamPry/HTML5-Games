# HTML5 Football Manager: Technical Design and Implementation Guide

## 1) Objectives and Scope

* Single-page, offline-capable football management sim in the browser.
* Inspiration: long-term squad building, tactics depth, data-driven scouting, dynamic careers.
* Deterministic simulation with seeded RNG for reproducibility.
* Modular architecture enabling leagues, data packs, skins, and match engines to be swapped.

---

## 2) Tech Stack

* **Language:** TypeScript (strict mode).
* **Render:** HTML5 + Canvas (2D), CSS for UI, optional WebGL for future.
* **State:** Lightweight store (Zustand/vanilla observable pattern).
* **Persistence:** IndexedDB via idb/LocalForage; backup/export JSON.
* **Workers:** Web Workers for match simulation and batch sims.
* **Routing:** Hash-based (no SSR required).
* **Build:** Vite/ESBuild.
* **Testing:** Vitest + Playwright.
* **PWA:** Service Worker for offline play, cached assets and saves.

---

## 3) Project Structure

```
/src
  /app           # bootstrap, DI, service locator
  /core          # math, rng, time, scheduling
  /data          # league packs, fixtures templates, name pools
  /domain
    /club
    /player
    /staff
    /match
    /finance
    /transfer
    /training
    /scouting
    /board
    /competition
    /ai
  /engine
    /sim         # match engine, physics-lite, event model
    /ai          # opposition AI, recruitment AI
  /ui
    /screens     # Dashboard, Squad, Tactics, Scouting, Transfers, Matchday, Finance
    /components  # reusable UI
    /charts
  /persistence   # repositories, save/load, migrations
  /workers       # matchWorker.ts, batchSimWorker.ts
  /mods          # skin + data pack loader
```

---

## 4) Data Model (TypeScript Interfaces)

### Core

```ts
type ID = string;

interface DateStamp { season: number; week: number; day: number; } // 0-based within season
interface RNGSeed { s1: number; s2: number; } // for splitmix/xorshift

interface World {
  seed: RNGSeed;
  date: DateStamp;
  leagues: League[];
  competitions: Competition[];
  clubs: Club[];
  players: Player[];
  staff: StaffMember[];
  freeAgents: ID[];
  fixtures: Fixture[];
  finances: Record<ID, FinanceLedger>;
  transferList: TransferListing[];
  inbox: Mail[];
  settings: Settings;
  user: UserProfile;
}
```

### Player

```ts
type Foot = "Left" | "Right" | "Both";
type Position = "GK"|"RB"|"CB"|"LB"|"DM"|"CM"|"AM"|"RW"|"LW"|"ST";
type PotentialGrade = "E"|"D"|"C"|"B"|"A"|"A+";

interface Attributes {
  // Technical
  finishing: number; firstTouch: number; passing: number; crossing: number; dribbling: number;
  heading: number; tackling: number; marking: number; longShots: number; setPieces: number;
  // Mental
  decisions: number; anticipation: number; vision: number; workRate: number; bravery: number;
  composure: number; offTheBall: number; positioning: number; leadership: number; flair: number;
  // Physical
  pace: number; acceleration: number; strength: number; stamina: number; agility: number; jumping: number;
  // GK
  handling: number; reflexes: number; aerial: number; distribution: number;
}

interface Player {
  id: ID;
  name: string;
  age: number; // in years, fractional permitted
  nationality: string[];
  height: number; weight: number;
  foot: Foot;
  positions: Position[];
  attributes: Attributes;            // 1..20
  currentAbility: number;            // CA 1..200
  potentialAbility: number;          // PA 1..200
  potentialGrade: PotentialGrade;    // scouting abstraction
  form: number[];                    // last N matches ratings 1..10
  morale: number;                    // 0..100
  condition: number;                 // 0..100
  sharpness: number;                 // 0..100
  traits: string[];                  // "Shoots From Distance", etc.
  personality: { professionalism:number; ambition:number; loyalty:number; pressure:number; };
  contract: Contract;
  clubId: ID | null;
  value: number;                     // estimated market value
  wageDemand: number;
  injury?: Injury;
  suspensionMatches?: number;
  homegrownFlags: { club:boolean; nation:boolean };
  hidden: { consistency:number; injuryProneness:number; adaptability:number };
}
```

### Club/Staff

```ts
interface Club {
  id: ID; name: string; shortName: string; leagueId: ID;
  rep: number; financesId: ID; trainingFacilities: number; youthFacilities: number;
  stadium: Stadium; colors: string[]; philosophy: ClubPhilosophy;
  roster: ID[]; // player ids
  staff: ID[];  // staff ids
  tactics: TacticsProfile;
}

interface StaffMember {
  id: ID; role: "Manager"|"Assistant"|"Coach"|"Physio"|"Scout"|"DoF"|"Analyst";
  attributes: StaffAttributes;
  contract: Contract; clubId: ID | null;
}
```

### Contracts/Finance/Transfers

```ts
interface Contract { clubId: ID; start: DateStamp; end: DateStamp; wagePerWeek: number; bonuses: Bonus[]; releaseClause?: number; }
interface FinanceLedger { balance: number; ffpWindow: number; wageBudget: number; transferBudget: number; transactions: Transaction[]; }
interface TransferListing { playerId: ID; askingPrice?: number; listedByClubId: ID; status: "Listed"|"Bids"|"Accepted"|"Sold"|"Withdrawn"; }
interface Bid { playerId: ID; fromClubId: ID; toClubId: ID; feeFixed: number; addOns?: AddOn[]; wageOffer?: number; contractYears?: number; }
```

### Competitions/Fixtures/Match

```ts
interface League { id: ID; name: string; level: number; nation: string; rules: LeagueRules; clubIds: ID[]; }
interface Competition { id: ID; name: string; type: "League"|"Cup"|"Continental"; rules: CompetitionRules; }
interface Fixture { id: ID; competitionId: ID; homeId: ID; awayId: ID; date: DateStamp; matchId?: ID; played: boolean; }
interface Match { id: ID; fixtureId: ID; state: MatchState; events: MatchEvent[]; ratings: Record<ID,number>; stats: MatchTeamStats[]; }
```

---

## 5) Time and Scheduling

* Discrete daily ticks; weekly bundles for training, finances, scouting.
* Matchdays invoke Match Engine in Worker; produce `Match` snapshot for UI replay.
* Scheduler queues:

  * `Daily`: injuries healing, morale drifts, news generation.
  * `Weekly`: training application, attribute deltas, wage payments.
  * `Monthly`: budgets reconciliation, board confidence updates.
  * `Windows`: transfer window open/close, registration checks.

```ts
type Job = () => void | Promise<void>;
class Scheduler {
  enqueue(when: DateStamp, job: Job): void;
  runDay(world: World): void; // executes due jobs
}
```

---

## 6) RNG and Determinism

* SplitMix64/Xoroshiro seeded per Match and per Simulation batch.
* Do not use `Math.random()`.
* Seed chain includes world seed + fixture id + minute.

```ts
interface RNG { next(): number; nextInt(n:number): number; pick<T>(arr:T[]): T; }
```

---

## 7) Match Engine Overview

### Representation

* 2D abstract pitch coordinates: 0..100 width, 0..100 length.
* Possession state machine; phases: Build-Up, Transition, Final Third, Set-Piece, Turnover.
* Event model: `Pass`, `Dribble`, `Shot`, `Tackle`, `Interception`, `Save`, `Foul`, `Card`, `Injury`, `Goal`, `Offside`.
* Simulation tick: 100ms real-time ~ 5s game-time (configurable).

### Inputs

* Team sheets with roles, mentalities, shape, lines:

  * Formation (e.g., 4-2-3-1).
  * Team instructions: tempo, width, line height, press intensity, time wasting, passing risk.
  * Player roles: e.g., `CM(S)`, `CM(D)`, `IW(A)`, `HB(D)`, `AF(A)`.
  * Set-piece routines.

### Outputs

* Full event log, team and player stats, xG, heatmaps, momentum, ratings 1..10.

### Core Loop (Worker)

```ts
function simulateMatch(input: MatchInput, seed: RNGSeed): Match {
  const rng = createRNG(seed);
  const ctx = initContext(input, rng);
  for (let t = 0; t < input.totalSeconds; t += ctx.delta) {
    advanceFatigue(ctx);
    maybeAdjustAI(ctx, rng);           // opposition tweaks
    stepPhase(ctx, rng);               // generates events
    if (shouldStopForSetPiece(ctx)) runSetPiece(ctx, rng);
    if (shouldApplySub(ctx)) applySub(ctx);
    if (isHalfTime(t)) halfTimeAdjust(ctx, rng);
  }
  finalizeRatings(ctx);
  return toMatch(ctx);
}
```

### Event Resolution Examples

```ts
// Pass success probability
function passSuccess(passer: Player, difficulty: number, ctx: Ctx): number {
  const tech = passer.attributes.passing * 0.6 + passer.attributes.vision * 0.4;
  const pressure = ctx.defPressFactor; // 0..1
  const fatigue = 1 - passer.condition/100;
  const tempo = ctx.teamInstr.tempo; // increases error
  const base = clamp(0.15 + (tech/20)*0.75 - difficulty*0.3 - pressure*0.2 - fatigue*0.25 - tempo*0.05, 0.05, 0.95);
  return base;
}

// Shot xG model
function expectedGoalProb(shooter: Player, shot: ShotContext): number {
  const base = shotModel(shot.distance, shot.angle, shot.bodyPart, shot.pressure); // learnt or hardcoded
  const fin = shooter.attributes.finishing/20;
  const comp = shooter.attributes.composure/20;
  return clamp(base * (0.6 + 0.6*fin) * (0.7 + 0.5*comp), 0.01, 0.99);
}
```

### Ratings

* Baseline 6.5 adjusted by contributions:

  * Positive: key passes, progressive actions, xG+xA contribution, defensive wins, distance covered vs role demand.
  * Negative: errors leading to shots/goals, misplaced passes weighted by zone, fouls, low work rate.

---

## 8) Tactics System

### Team Instructions

* Mentality: `Very Defensive … Very Attacking` maps to risk multipliers.
* Tempo, Width, Defensive Line, Line of Engagement, Press intensity, Time Wasting.
* In possession: overlaps/underlaps, focus flanks/through middle, passing directness.
* In transition: counter/counter-press, regroup, GK distribution.
* Out of possession: trap inside/outside, tighter marking.

### Player Roles

* Role archetypes with behaviour vectors per phase: `support`, `attack`, `defend` weights and space occupation.
* Example role spec:

```ts
interface RoleBehaviour {
  supportZones: PitchZone[]; attackRuns: RunPattern[]; pressTendency: number;
  passingRisk: number; crossingFreq: number; shotFreq: number; holdBall: boolean;
}
```

### In-Match Adjustments

* Quick presets and granular sliders apply to engine context immediately.
* Opposition instructions target key attributes of opponents.

---

## 9) AI Manager

### Tactical AI

* Opponent scouts your recent matches (rolling stats) and generates plan vs your weaknesses.
* Bayesian switch policy during match based on xG differential, momentum, red cards, fatigue.

### Recruitment AI

* Profiles by club philosophy and budget.
* Shortlists naive + heuristic + Monte Carlo expected value:

  * `EV = ContributionValue(seasons) − TransferCost − Wages + ResaleValue`.
* Negotiation tactics simulate walk-away, clauses, overpayment risk.

---

## 10) Transfers and Contracts

### Valuation

* Base value from CA/PA, age curve, contract length, position scarcity, league reputation.
* Injury proneness and consistency discount.

```ts
value = leagueCoef * (CA^1.6) * ageCurve(age) * (1 + PA/200*0.2) * contractFactor(monthsLeft) * positionCoef * healthCoeff
```

### Negotiation State Machine

* States: `Initial → Counter → Optional Clauses → Accept | Decline | Timeout`.
* Clauses: sell-on %, appearance bonuses, goals/assists, promotion, minimum fee (domestic/foreign), relegation cut.

### Work Permits/Registration

* Rule validators injected per league (non-EU limits, homegrown quotas).

---

## 11) Training and Development

### Weekly Plan

* Team schedules: Physical/Technical/Tactical/Recovery slots with intensity.
* Individual focuses and role training.
* Attribute deltas:

```ts
delta = baseRate * facilityCoef * staffCoef * playerTraitCoef * intensityCoef
delta *= fatiguePenalty(condition) * ageCurve(age) * injuryPenalty
```

### Progression

* PA cap with stochastic breakthroughs/backslides influenced by professionalism, ambition, game time.

---

## 12) Scouting and Recruitment

### Knowledge Model

* Each report has `certainty 0..1`; fog reduces to banded grades.
* Assignments by region, competition, role archetype, or shortlist watch.

### Newgens/Regens

* Annual youth intake per club/nation seeded by youth rating; names from locale pools; PA distribution shaped by nation.

---

## 13) Squad Dynamics and Morale

* Social groups, hierarchy (captain/vice), promises, playing time expectations.
* Morale changes: results, praise/criticism, contracts, training workload, media handling.
* Board confidence tracks: results, finance, philosophy compliance, match style.

---

## 14) Competitions and Fixtures

* Rule schemas: points, tiebreakers, squad registration cutoffs, foreign limits, transfer windows.
* Fixture generator: round-robin, Swiss-style, cup with seeding.
* Congestion handler and postponements for weather or continental travel.

---

## 15) Finance and FFP

* Revenue streams: matchday, broadcasting, prize, sponsorship, sales.
* Costs: wages, amortization, bonuses, operations.
* FFP window rolling profit/loss with sanctions.

```ts
amortizationPerYear = transferFee / contractYears
wageToTurnover = totalWages / totalRevenue
```

---

## 16) UI Architecture

### Screens

* **Dashboard:** fixtures, injuries, training summary, transfer alerts, board confidence, finances sparkline.
* **Squad:** table with filters, role view, condition/morale, selection helpers.
* **Tactics:** formation canvas on Grid; drag-drop roles/instructions; set-piece editor.
* **Training:** calendar grid; intensity sliders; coach assignment.
* **Scouting:** assignments board, shortlist, player cards with banded attributes and certainty bars.
* **Transfers:** market list, bids inbox, negotiation modal.
* **Matchday:** canvas pitch, event timeline, stats tabs, heatmaps, momentum graph, quick shouts.
* **Finance:** ledger, budgets, projections, compliance.
* **Board/Club:** objectives, philosophies, promises, facility upgrades.

### Components

* DataGrid, Badge, ProgressBar, Sparkline, Radar chart for attributes, RolePicker, FormationPicker, ClauseEditor.

---

## 17) State Management

* Immutable world snapshots per day boundary for rollback/debug.
* UI derives from selectors; no component mutates world directly.
* Command pattern for actions:

```ts
interface Command { type:string; payload:any; }
dispatch({type:"TRANSFER_BID_SUBMIT", payload:{ playerId, fromClubId, offer }});
```

---

## 18) Persistence and Migrations

* Save slots: meta + chunked world JSON.
* Compress with LZ-string before IndexedDB write.
* Semantic versioned schema; migration pipeline applies on load.

---

## 19) Performance

* Web Worker handles match sim, training batch, fixture generation.
* Canvas layers: pitch/static, players, ball, overlays; requestAnimationFrame loop decoupled from sim tick.
* Virtualized tables for large datasets.
* Memoized selectors for derived stats.

---

## 20) Security/Cheating

* Hash world state with seed salt to detect edits (for achievements only).
* Dev tools gated by flag; export/import signed with checksum.

---

## 21) Internationalization

* i18n keys for UI strings; locale date/number formats; league packs localized names.
* Name pools per culture for regen generation.

---

## 22) Modding/Data Packs

* JSON schema for nations, leagues, clubs, players, kits, rules.
* Skin system: CSS variables + component theme tokens.
* Safe sandbox: validate pack schema before import.

---

## 23) Analytics/Telemetry (Local)

* Local opt-in: match length, fps, sim ms per tick; no remote by default.
* Debug overlay: sim speed, queued events, worker lag.

---

## 24) Minimal Implementable Slice (MIS)

1. World bootstrap with one league, 10 clubs, synthetic players.
2. Daily scheduler; fixtures; simple 2D match sim producing score + basic stats.
3. Squad screen; Tactics with formation and 3 global sliders; Transfers disabled.
4. Save/load; PWA offline.
5. Tests for match determinism and scheduler.

---

## 25) Key Algorithms (Pseudocode)

### Team Selection

```ts
function pickXI(club: Club): ID[] {
  const roles = formationToRoles(club.tactics.formation);
  return roles.map(r => bestFit(club.roster, r));
}
```

### Fitness and Fatigue

```ts
function advanceFatigue(ctx: Ctx) {
  for (const p of ctx.onPitch) {
    const workload = roleWorkload(p.role, ctx.instructions);
    const press = ctx.instructions.pressIntensity;
    p.condition -= clamp( baseDrop(workload, press) * (1 + (100 - p.attributes.stamina)/140), 0, 1.2 );
    p.sharpness += matchSharpnessGain(p);
  }
}
```

### Injury Probability

```ts
P(injury) = base * workload * (1 + hidden.injuryProneness/20) * (1 - condition/100) * congestionFactor
```

### Transfer Bid Acceptance

```ts
accept = feeFixed >= value * demandCoef && (clauses acceptable) && not keyPlayerUnlessReplacement
```

### Player Progression Weekly

```ts
for each attribute a:
  delta = (trainingFocus[a] ? 1.2 : 0.8) * facilities * coachQuality * professionalismCoef * minutesPlayedCoef
  player.attributes[a] = clamp(player.attributes[a] + gaussian(delta, sigma), 1, 20)
  adjust CA with total attribute energy, cap by PA
```

### Scouting Certainty Update

```ts
certainty += min(1, (scoutAbility * hoursObserved) / targetThreshold) * regionFamiliarity
```

---

## 26) API Contracts (Selected)

### Match Worker

```ts
// main thread
worker.postMessage({ type:"RUN_MATCH", input: matchInput, seed });

// worker
onmessage = (e) => {
  if (e.data.type === "RUN_MATCH") {
    const result = simulateMatch(e.data.input, e.data.seed);
    postMessage({ type:"MATCH_DONE", result });
  }
};
```

### Repository

```ts
interface SaveRepository {
  save(slot: string, world: World): Promise<void>;
  load(slot: string): Promise<World>;
  list(): Promise<SaveMeta[]>;
}
```

---

## 27) UI/UX Details

* Keyboard navigation across squad table, bulk actions, filters.
* Tactics board with snap-to-lanes; tooltips show role behaviours and demanded attributes.
* Matchday: pause, speed x1/x2/x4; instant result; post-match analytics with xG plot and pass networks.
* Dark/light themes; high-contrast mode.

---

## 28) KPIs for Simulation Quality

* Correlation of team strength vs points ~0.7–0.85 over seasons.
* Goals per match ~2.4–3.1 depending on league rules and tactics.
* Shot conversion ~9–13%; pass accuracy midfield 78–88%; press intensity impacts turnovers by ±10–20%.
* Variance controlled by seeded randomness; repeatable outcomes from same seed.

---

## 29) Testing Protocol

* Unit tests: valuation, injury calc, xG model bounds, training deltas, registration rules.
* Property tests: no negative balances after monthly reconcile; fixtures cover all pairs in round-robin.
* Golden tests: given seed + lineups, exact event sequence hash must match.
* UI tests: negotiation modal flows; drag-drop tactics; save/load.

---

## 30) Roadmap

* **v0.1** MIS + save/load + single league + instant result.
* **v0.2** Full match visualizer + set-pieces + basic transfers.
* **v0.3** Training planner + injuries + squad dynamics.
* **v0.4** Multi-league pyramid + promotions/relegations + registrations.
* **v0.5** Cups + continental comps + media/inbox + board confidence.
* **v1.0** Modding, skins, full scouting network, data import, achievements.

---

## 31) Example Type Definitions and Utilities

```ts
// Attribute helper
export function attribScore(p: Player, weights: Partial<Record<keyof Attributes, number>>): number {
  let s = 0, w = 0;
  for (const k in weights) { const wk = weights[k as keyof Attributes] ?? 0; s += (p.attributes[k as keyof Attributes] || 0) * wk; w += wk; }
  return w ? s / w : 0;
}

// Role fit
const roleWeights = {
  "CM(S)": { passing:3, vision:2, decisions:2, stamina:2, firstTouch:1, workRate:2, positioning:1 },
  "IW(A)": { dribbling:3, pace:2, acceleration:2, crossing:2, flair:2, offTheBall:2, finishing:1 },
  "AF(A)": { finishing:3, offTheBall:3, pace:2, acceleration:2, composure:2, firstTouch:2, strength:1 },
} as const;

// Rating aggregator
function computeRating(ctx: PlayerMatchCtx): number {
  let r = 6.5;
  r += 0.3 * ctx.keyPasses + 0.4 * ctx.tacklesWon + 0.5 * ctx.interceptions;
  r += 0.8 * ctx.goals + 0.5 * ctx.assists + 0.1 * (ctx.xG + ctx.xA);
  r -= 0.6 * ctx.errorsLeadToShot - 0.9 * ctx.errorsLeadToGoal;
  r += clamp((ctx.distanceCovered / ctx.roleDemand) - 1, -0.5, 0.5);
  return clamp(r, 1, 10);
}
```

---

## 32) Minimal HTML/Canvas Skeleton

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>HTML5 Football Manager</title>
  <style>
    html,body,#app{height:100%;margin:0}
    .layout{display:grid;grid-template-columns:280px 1fr;grid-template-rows:56px 1fr;grid-template-areas:"nav header" "nav main";height:100%}
    nav{grid-area:nav;border-right:1px solid #ddd;overflow:auto}
    header{grid-area:header;border-bottom:1px solid #ddd;display:flex;align-items:center;padding:0 12px}
    main{grid-area:main;overflow:auto}
    canvas{width:100%;height:360px;border:1px solid #ddd}
  </style>
</head>
<body>
<div id="app" class="layout">
  <nav>
    <button data-view="dashboard">Dashboard</button>
    <button data-view="squad">Squad</button>
    <button data-view="tactics">Tactics</button>
    <button data-view="match">Match</button>
  </nav>
  <header><strong id="title">Dashboard</strong></header>
  <main id="view"></main>
</div>
<script type="module">
  const state = { view: "dashboard" };
  const view = document.getElementById("view"), title = document.getElementById("title");
  document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>render(b.dataset.view));
  function render(v){
    state.view=v; title.textContent=v[0].toUpperCase()+v.slice(1);
    if(v==="match"){ view.innerHTML=`<canvas id="pitch" width="900" height="360"></canvas>`; drawPitch(); }
    else if(v==="tactics"){ view.innerHTML=`<div>Formation editor placeholder</div>`; }
    else if(v==="squad"){ view.innerHTML=`<div>Squad table placeholder</div>`; }
    else { view.innerHTML=`<div>Dashboard placeholder</div>`; }
  }
  function drawPitch(){
    const c = document.getElementById("pitch"); const ctx = c.getContext("2d");
    ctx.fillStyle="#0b7a2a"; ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle="#fff"; ctx.lineWidth=2;
    ctx.strokeRect(10,10,c.width-20,c.height-20);
    ctx.beginPath(); ctx.moveTo(c.width/2,10); ctx.lineTo(c.width/2,c.height-10); ctx.stroke();
    ctx.beginPath(); ctx.arc(c.width/2,c.height/2,60,0,Math.PI*2); ctx.stroke();
  }
  render("dashboard");
</script>
</body>
</html>
```

---

## 33) Save Format Outline

```json
{
  "version":"1.0.0",
  "seed":{"s1":123,"s2":456},
  "date":{"season":2025,"week":12,"day":4},
  "clubs":[/*...*/],
  "players":[/*...*/],
  "fixtures":[/*...*/],
  "finances":{/*...*/},
  "settings":{"difficulty":"Standard","simSpeed":2}
}
```

---

## 34) Data Import Schema (Mods)

```json
{
  "$schema":"https://example.com/fm/schema.json",
  "nations":[{"code":"NL","name":"Netherlands","youthRating":140}],
  "leagues":[{"id":"eredivisie","nation":"NL","level":1,"rules":{"foreignLimit":null}}],
  "clubs":[{"id":"ajax","leagueId":"eredivisie","name":"AFC Ajax","rep":8200}],
  "players":[{"id":"p1","clubId":"ajax","name":"J. Doe","age":19,"positions":["CM"],"CA":95,"PA":160}]
}
```

---

## 35) Build Targets

* Desktop Chrome/Edge/Firefox latest; touch-friendly layouts for tablets.
* 60 FPS render target on matchday; sim at fixed timestep capped to 5x.

---

## 36) Accessibility

* Keyboard first navigation, skip links.
* ARIA roles for grids and tabs.
* Color-blind safe palettes for kits and event highlights.

---

## 37) Deployment

* Static hosting (Netlify/Vercel/GitHub Pages).
* Cache busting via hashed assets.
* Service Worker pre-cache plus runtime caching for saves.

---

## 38) Versioning and Compatibility

* SemVer for save schema and engine.
* Migrations per minor; major may break match replay compatibility while preserving career data.

---

## 39) Telemetry for Balancing (Local Only)

* Export anonymized CSV of season aggregates: goals, cards, pass %, shot maps.
* Tools to tune coefficients and rerun season sims with fixed seed batches.

---

## 40) Exit Criteria for v1.0

* 10+ season careers without softlocks.
* AI squads maintain role coverage and wage sanity.
* Transfer markets exhibit realistic fees and wage inflation.
* Tactical choices measurably change event profiles and outcomes.
