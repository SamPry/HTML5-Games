import { GameStore, randomSeed } from "@app/store";
import { dateLabel, type World } from "@app/world";
import type { ID } from "@core/types";
import { drawPitch } from "@ui/components/pitch";
import { renderDashboard } from "@ui/screens/dashboard";
import { bindMatchInteractions, renderMatch } from "@ui/screens/match";
import { renderSquad } from "@ui/screens/squad";
import { renderTactics } from "@ui/screens/tactics";
import { bindTransferInteractions, renderTransfers } from "@ui/screens/transfers";
import { renderStandings } from "@ui/screens/standings";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "hfm-theme";

function getStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // ignore storage failures
  }
  return null;
}

function detectSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function persistTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore storage failures
  }
}

const store = new GameStore(randomSeed());
let seasonBootstrapped = false;
const app = document.getElementById("app");

const storedTheme = getStoredTheme();
let userSelectedTheme = storedTheme !== null;
let activeTheme: Theme = storedTheme ?? detectSystemTheme();

const themeToggle = document.createElement("button");
themeToggle.type = "button";
themeToggle.classList.add("ghost");

function applyTheme(theme: Theme, persist = true): void {
  activeTheme = theme;
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  if (persist) {
    persistTheme(theme);
  }
}

applyTheme(activeTheme, userSelectedTheme);

const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
systemThemeQuery.addEventListener("change", (event) => {
  if (!userSelectedTheme) {
    applyTheme(event.matches ? "dark" : "light", false);
  }
});

if (!app) {
  throw new Error("App container not found");
}

app.className = "shell";

const header = document.createElement("header");
header.className = "topbar glass";

const nav = document.createElement("aside");
nav.className = "sidebar glass";

const main = document.createElement("main");
main.className = "content";

const titleGroup = document.createElement("div");
titleGroup.className = "title-group";

const title = document.createElement("h1");
title.className = "page-title";

const subtitle = document.createElement("p");
subtitle.className = "page-subtitle";

const controls = document.createElement("div");
controls.className = "controls";

themeToggle.addEventListener("click", () => {
  userSelectedTheme = true;
  applyTheme(activeTheme === "dark" ? "light" : "dark");
});

const advanceDayButton = document.createElement("button");
advanceDayButton.textContent = "Advance Day";
advanceDayButton.className = "primary";
advanceDayButton.addEventListener("click", () => {
  const result = store.dispatch({ type: "ADVANCE_DAY" });
  handleCommandResult(result);
});

const advanceWeekButton = document.createElement("button");
advanceWeekButton.textContent = "Advance 7 Days";
advanceWeekButton.addEventListener("click", () => {
  const result = store.dispatch({ type: "ADVANCE_DAYS", payload: { days: 7 } });
  handleCommandResult(result);
});

controls.append(themeToggle, advanceDayButton, advanceWeekButton);

function setControlsEnabled(enabled: boolean): void {
  advanceDayButton.disabled = !enabled;
  advanceWeekButton.disabled = !enabled;
}

const navTitle = document.createElement("div");
navTitle.className = "brand";
navTitle.innerHTML = `<span class="brand-mark">⚽</span><span class="brand-text">Manager</span>`;
nav.append(navTitle);

interface ViewHelpers {
  simulateFixture: (fixtureId: ID) => ReturnType<typeof store.dispatch>;
  makeTransferBid: (playerId: ID, offer: number) => string;
  handleResult: (result: ReturnType<typeof store.dispatch>) => void;
  notify: (message: string) => void;
}

interface ViewConfig {
  render: (world: World) => string;
  bind?: (container: HTMLElement, helpers: ViewHelpers) => void;
}

const viewHelpers: ViewHelpers = {
  simulateFixture: (fixtureId) => store.dispatch({ type: "SIMULATE_FIXTURE", payload: { fixtureId } }),
  makeTransferBid: (playerId, offer) => {
    const clubId = store.snapshot.userClubId;
    if (!clubId) {
      return "Choose a club before making transfer bids.";
    }
    return store.dispatch({
      type: "MAKE_TRANSFER_BID",
      payload: { playerId, buyingClubId: clubId, offer }
    }) as string;
  },
  handleResult: (result) => handleCommandResult(result),
  notify
};

const views: Record<string, ViewConfig> = {
  dashboard: { render: renderDashboard },
  squad: { render: renderSquad },
  tactics: { render: renderTactics },
  match: { render: renderMatch, bind: bindMatchInteractions },
  standings: { render: renderStandings },
  transfers: { render: renderTransfers, bind: bindTransferInteractions }
};

let activeView: keyof typeof views = "dashboard";

Object.entries(views).forEach(([key]) => {
  const button = document.createElement("button");
  button.textContent = key.charAt(0).toUpperCase() + key.slice(1);
  button.dataset.view = key;
  if (key === activeView) button.classList.add("active");
  button.addEventListener("click", () => {
    activeView = key as keyof typeof views;
    updateNavigation();
    render();
  });
  nav.append(button);
});

titleGroup.append(title, subtitle);
header.append(titleGroup, controls);

const workspace = document.createElement("div");
workspace.className = "workspace";
workspace.append(main);

app.append(nav, header, workspace);

function formatDate(date: World["date"]): string {
  return `Season ${date.season} • Week ${date.week + 1} • Day ${date.day + 1}`;
}

function render(): void {
  const world = store.snapshot;
  const club = world.clubs.find((c) => c.id === world.userClubId);
  setControlsEnabled(Boolean(world.userClubId));
  if (!club) {
    title.textContent = "Choose your club";
    subtitle.textContent = "Select a team to begin your journey.";
  } else {
    title.textContent = club.name;
    subtitle.textContent = dateLabel(world.date);
  }
  const view = views[activeView];
  main.innerHTML = view.render(world);
  if (activeView === "tactics") {
    drawPitch(document.getElementById("tactics-pitch") as HTMLCanvasElement | null);
  }
  if (view.bind) {
    view.bind(main, viewHelpers);
  }
}

function updateNavigation(): void {
  nav.querySelectorAll("button").forEach((button) => {
    const view = button.dataset.view as keyof typeof views | undefined;
    if (view) {
      button.classList.toggle("active", view === activeView);
    }
  });
}

const notifications = document.createElement("aside");
notifications.className = "panel glass";
notifications.innerHTML = "<div class=\"panel-header\"><span class=\"badge info\">Digest</span><h2>Daily Summary</h2></div><div id=\"notifications\" class=\"panel-body\"><p>No messages yet.</p></div>";
workspace.append(notifications);

function notify(message: string): void {
  const container = document.getElementById("notifications");
  if (!container) return;
  const list = container.querySelector("ul") ?? document.createElement("ul");
  if (!list.parentElement) {
    container.innerHTML = "";
    container.appendChild(list);
  }
  const item = document.createElement("li");
  item.textContent = message;
  list.prepend(item);
}

function handleCommandResult(result: ReturnType<typeof store.dispatch>) {
  if (!result) return;
  if (typeof result === "string") {
    notify(result);
    return;
  }
  if (Array.isArray((result as any).messages)) {
    (result as any).messages.forEach((message: string) => notify(message));
  } else if (typeof (result as any).message === "string") {
    notify((result as any).message);
  }
}

function bootstrapSeason(): void {
  if (seasonBootstrapped) return;
  seasonBootstrapped = true;
  for (let i = 0; i < 3; i += 1) {
    const result = store.dispatch({ type: "ADVANCE_DAY" });
    handleCommandResult(result);
  }
}

function createTeamSelectionModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-backdrop hidden";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  const modal = document.createElement("div");
  modal.className = "modal glass";

  const header = document.createElement("div");
  header.className = "section-heading";
  header.innerHTML = '<span class="eyebrow">Career setup</span><h2>Select your club</h2>';

  const intro = document.createElement("p");
  intro.className = "muted-text";
  intro.textContent = "Choose a club to manage. This choice is locked for the current session.";

  const leagueList = document.createElement("div");
  leagueList.className = "league-list";

  const clubGrid = document.createElement("div");
  clubGrid.className = "club-grid";

  const footer = document.createElement("div");
  footer.className = "modal-footer";

  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "primary";
  confirmButton.textContent = "Confirm club";
  confirmButton.disabled = true;

  footer.append(confirmButton);
  modal.append(header, intro, leagueList, clubGrid, footer);
  overlay.append(modal);
  document.body.appendChild(overlay);

  let selectedLeagueId: ID | null = null;
  let selectedClubId: ID | null = null;

  function renderLeagueButtons(): void {
    const world = store.snapshot;
    const sortedLeagues = [...world.leagues].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    if (!selectedLeagueId || !sortedLeagues.some((league) => league.id === selectedLeagueId)) {
      selectedLeagueId = world.userLeagueId ?? sortedLeagues[0]?.id ?? null;
    }
    leagueList.innerHTML = "";
    sortedLeagues.forEach((league) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${league.name} (L${league.level})`;
      button.className = "league-option";
      if (league.id === selectedLeagueId) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        selectedLeagueId = league.id;
        renderLeagueButtons();
        renderClubCards();
      });
      leagueList.append(button);
    });
  }

  function renderClubCards(): void {
    const world = store.snapshot;
    clubGrid.innerHTML = "";
    confirmButton.disabled = !selectedClubId;
    if (!selectedLeagueId) {
      clubGrid.innerHTML = '<p class="empty">No leagues available.</p>';
      return;
    }
    const clubs = world.clubs
      .filter((club) => club.leagueId === selectedLeagueId)
      .sort((a, b) => a.name.localeCompare(b.name));
    const league = world.leagues.find((entry) => entry.id === selectedLeagueId);
    clubs.forEach((club) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "club-card";
      if (club.id === selectedClubId) {
        card.classList.add("active");
      }
      const levelLabel = league ? `Level ${league.level}` : "League";
      card.innerHTML = `
        <div class="club-card-header">
          <span class="badge">${levelLabel}</span>
          <strong>${club.name}</strong>
        </div>
        <div class="club-meta">
          <span>Rep ${club.rep}</span>
          <span>£${formatBudget(club.transferBudget)} transfer</span>
          <span>£${formatBudget(club.wageBudget)}/wk wages</span>
        </div>
      `;
      card.addEventListener("click", () => {
        selectedClubId = club.id;
        selectedLeagueId = club.leagueId;
        renderLeagueButtons();
        renderClubCards();
        confirmButton.disabled = false;
      });
      clubGrid.append(card);
    });
  }

  confirmButton.addEventListener("click", () => {
    if (!selectedClubId) {
      notify("Select a club to continue.");
      return;
    }
    store.dispatch({ type: "SET_USER_CLUB", payload: { clubId: selectedClubId } });
    const world = store.snapshot;
    const club = world.clubs.find((entry) => entry.id === selectedClubId);
    notify(`You are now in charge of ${club?.name ?? "your club"}.`);
    close();
    bootstrapSeason();
  });

  function open(): void {
    const world = store.snapshot;
    selectedClubId = world.userClubId;
    const sorted = [...world.leagues].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    selectedLeagueId = world.userLeagueId ?? sorted[0]?.id ?? null;
    renderLeagueButtons();
    renderClubCards();
    confirmButton.disabled = !selectedClubId;
    overlay.classList.remove("hidden");
  }

  function close(): void {
    overlay.classList.add("hidden");
  }

  return { open, close };
}

function formatBudget(value: number): string {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value);
}

const teamSelection = createTeamSelectionModal();

store.subscribe(render);
render();

if (!store.snapshot.userClubId) {
  setControlsEnabled(false);
  teamSelection.open();
} else {
  bootstrapSeason();
}
