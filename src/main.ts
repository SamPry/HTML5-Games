import { GameStore, randomSeed } from "@app/store";
import { dateLabel, type World, type CustomClubInput, type CustomClubResult } from "@app/world";
import type { ID } from "@core/types";
import { drawPitch } from "@ui/components/pitch";
import { renderDashboard } from "@ui/screens/dashboard";
import { bindMatchInteractions, renderMatch } from "@ui/screens/match";
import { renderSquad } from "@ui/screens/squad";
import { renderTactics } from "@ui/screens/tactics";
import { bindTransferInteractions, renderTransfers } from "@ui/screens/transfers";
import { bindStandingsInteractions, renderStandings } from "@ui/screens/standings";

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
let standingsLeagueId: ID | null = null;

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
  standings: {
    render: (world) => {
      if (!standingsLeagueId || !world.leagues.some((league) => league.id === standingsLeagueId)) {
        standingsLeagueId = world.userLeagueId ?? world.leagues[0]?.id ?? null;
      }
      return renderStandings(world, standingsLeagueId);
    },
    bind: (container) => {
      bindStandingsInteractions(container, {
        onLeagueChange: (leagueId) => {
          standingsLeagueId = leagueId;
          render();
        }
      });
    }
  },
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

  const customPanel = document.createElement("div");
  customPanel.className = "custom-club-panel hidden";
  customPanel.innerHTML = `
    <form class="custom-club-form">
      <div class="section-heading">
        <span class="eyebrow">Founder mode</span>
        <h3>Create your own club</h3>
      </div>
      <p class="muted-text">Craft a new identity, choose a league, and we'll assemble a squad to match your ambition.</p>
      <label class="field">
        <span>Club name</span>
        <input name="name" type="text" maxlength="40" required placeholder="Newcastle Bluebirds" />
      </label>
      <label class="field-inline">
        <span>Short name</span>
        <input name="short" type="text" maxlength="5" required placeholder="NWB" />
      </label>
      <label class="field">
        <span>League</span>
        <select name="league" required></select>
      </label>
      <div class="field colors">
        <label>
          <span>Primary</span>
          <input name="primary" type="color" value="#113399" />
        </label>
        <label>
          <span>Secondary</span>
          <input name="secondary" type="color" value="#f5f5f5" />
        </label>
      </div>
      <label class="field">
        <span>Mentality</span>
        <select name="mentality">
          <option value="Balanced">Balanced</option>
          <option value="Positive" selected>Positive</option>
          <option value="Cautious">Cautious</option>
        </select>
      </label>
      <label class="field">
        <span>Formation</span>
        <select name="formation">
          <option value="4-3-3">4-3-3</option>
          <option value="4-2-3-1">4-2-3-1</option>
          <option value="3-4-3">3-4-3</option>
          <option value="4-4-2">4-4-2</option>
        </select>
      </label>
      <label class="field">
        <span>Ambition</span>
        <select name="profile">
          <option value="academy">Academy project – build for the future</option>
          <option value="challenger" selected>Challenger – compete immediately</option>
          <option value="elite">Elite – chase silverware</option>
        </select>
      </label>
      <div class="modal-footer">
        <button type="button" class="ghost" data-action="cancel">Back</button>
        <button type="submit" class="primary">Create club</button>
      </div>
    </form>
  `;

  const footer = document.createElement("div");
  footer.className = "modal-footer";

  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "primary";
  confirmButton.textContent = "Confirm club";
  confirmButton.disabled = true;

  footer.append(confirmButton);
  modal.append(header, intro, leagueList, clubGrid, footer, customPanel);
  overlay.append(modal);
  document.body.appendChild(overlay);

  let selectedLeagueId: ID | null = null;
  let selectedClubId: ID | null = null;
  const customForm = customPanel.querySelector("form") as HTMLFormElement;
  const customLeagueSelect = customForm.querySelector("select[name=\"league\"]") as HTMLSelectElement;
  const cancelCustomButton = customForm.querySelector("button[data-action=\"cancel\"]") as HTMLButtonElement;

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
    populateCustomLeagueOptions(sortedLeagues);
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
          <span>£${formatBudget(club.marketValue)} value</span>
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

    const createCard = document.createElement("button");
    createCard.type = "button";
    createCard.className = "club-card create";
    createCard.innerHTML = `
      <div class="club-card-header">
        <span class="badge info">Custom</span>
        <strong>Create your own club</strong>
      </div>
      <div class="club-meta">
        <span>Design colours & crest</span>
        <span>Pick any league</span>
        <span>Tailor ambition</span>
      </div>
    `;
    createCard.addEventListener("click", () => {
      openCustomForm();
    });
    clubGrid.append(createCard);
  }

  confirmButton.addEventListener("click", () => {
    if (!selectedClubId) {
      notify("Select a club to continue.");
      return;
    }
    store.dispatch({ type: "SET_USER_CLUB", payload: { clubId: selectedClubId } });
    standingsLeagueId = store.snapshot.userLeagueId ?? standingsLeagueId;
    const world = store.snapshot;
    const club = world.clubs.find((entry) => entry.id === selectedClubId);
    notify(`You are now in charge of ${club?.name ?? "your club"}.`);
    close();
    bootstrapSeason();
  });

  customForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(customForm);
    const leagueId = (data.get("league") as string) || selectedLeagueId;
    if (!leagueId) {
      notify("Choose a league for your new club.");
      return;
    }
    const payload = {
      leagueId,
      name: String(data.get("name") || "").trim(),
      shortName: String(data.get("short") || "").trim(),
      primaryColor: String(data.get("primary") || "#113399"),
      secondaryColor: String(data.get("secondary") || "#f5f5f5"),
      mentality: data.get("mentality") as "Balanced" | "Positive" | "Cautious",
      formation: String(data.get("formation") || "4-3-3"),
      profile: (data.get("profile") as "academy" | "challenger" | "elite") ?? "academy"
    } satisfies CustomClubInput;

    const result = store.dispatch({ type: "CREATE_CUSTOM_CLUB", payload }) as CustomClubResult;
    if (!result.success || !result.clubId) {
      notify(result.message);
      return;
    }
    store.dispatch({ type: "SET_USER_CLUB", payload: { clubId: result.clubId } });
    standingsLeagueId = store.snapshot.userLeagueId ?? standingsLeagueId;
    notify(result.message);
    closeCustomForm();
    close();
    bootstrapSeason();
  });

  cancelCustomButton.addEventListener("click", () => {
    closeCustomForm();
  });

  function open(): void {
    const world = store.snapshot;
    selectedClubId = world.userClubId;
    const sorted = [...world.leagues].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    selectedLeagueId = world.userLeagueId ?? sorted[0]?.id ?? null;
    renderLeagueButtons();
    renderClubCards();
    confirmButton.disabled = !selectedClubId;
    closeCustomForm();
    overlay.classList.remove("hidden");
  }

  function close(): void {
    overlay.classList.add("hidden");
  }

  function openCustomForm(): void {
    modal.classList.add("custom-mode");
    customPanel.classList.remove("hidden");
    leagueList.classList.add("hidden");
    clubGrid.classList.add("hidden");
    footer.classList.add("hidden");
    if (selectedLeagueId) {
      customLeagueSelect.value = selectedLeagueId;
    }
    customForm.querySelector<HTMLInputElement>("input[name=\"name\"]")?.focus();
  }

  function closeCustomForm(): void {
    modal.classList.remove("custom-mode");
    customPanel.classList.add("hidden");
    leagueList.classList.remove("hidden");
    clubGrid.classList.remove("hidden");
    footer.classList.remove("hidden");
    customForm.reset();
    populateCustomLeagueOptions([...store.snapshot.leagues]);
  }

  function populateCustomLeagueOptions(leagues: World["leagues"]): void {
    customLeagueSelect.innerHTML = "";
    leagues
      .slice()
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
      .forEach((league) => {
        const option = document.createElement("option");
        option.value = league.id;
        option.textContent = `${league.name} (L${league.level})`;
        customLeagueSelect.append(option);
      });
    if (selectedLeagueId) {
      customLeagueSelect.value = selectedLeagueId;
    }
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
