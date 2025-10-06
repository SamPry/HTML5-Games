import { GameStore, randomSeed } from "@app/store";
import type { World } from "@app/world";
import { drawPitch } from "@ui/components/pitch";
import { renderDashboard } from "@ui/screens/dashboard";
import { renderMatch } from "@ui/screens/match";
import { renderSquad } from "@ui/screens/squad";
import { renderTactics } from "@ui/screens/tactics";

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
  const summary = store.dispatch({ type: "ADVANCE_DAY" });
  if (summary) {
    summary.messages.forEach((message) => notify(message));
  }
});

const advanceWeekButton = document.createElement("button");
advanceWeekButton.textContent = "Advance 7 Days";
advanceWeekButton.addEventListener("click", () => {
  const summary = store.dispatch({ type: "ADVANCE_DAYS", payload: { days: 7 } });
  if (summary) {
    summary.messages.forEach((message) => notify(message));
  }
});

controls.append(themeToggle, advanceDayButton, advanceWeekButton);

const navTitle = document.createElement("div");
navTitle.className = "brand";
navTitle.innerHTML = `<span class="brand-mark">⚽</span><span class="brand-text">Manager</span>`;
nav.append(navTitle);

const views: Record<string, (world: World) => string> = {
  dashboard: renderDashboard,
  squad: renderSquad,
  tactics: renderTactics,
  match: renderMatch
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
  title.textContent = club ? club.name : "HTML5 Football Manager";
  subtitle.textContent = formatDate(world.date);
  main.innerHTML = views[activeView](world);
  if (activeView === "tactics") {
    drawPitch(document.getElementById("tactics-pitch") as HTMLCanvasElement | null);
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

store.subscribe(render);
render();

// auto-play opening week to give data
for (let i = 0; i < 3; i += 1) {
  const summary = store.dispatch({ type: "ADVANCE_DAY" });
  summary?.messages.forEach((message) => notify(message));
}
render();
