import { GameStore, randomSeed } from "@app/store";
import type { World } from "@app/world";
import { drawPitch } from "@ui/components/pitch";
import { renderDashboard } from "@ui/screens/dashboard";
import { renderMatch } from "@ui/screens/match";
import { renderSquad } from "@ui/screens/squad";
import { renderTactics } from "@ui/screens/tactics";

const store = new GameStore(randomSeed());
const app = document.getElementById("app");

if (!app) {
  throw new Error("App container not found");
}

const header = document.createElement("header");
const nav = document.createElement("nav");
const main = document.createElement("main");
const title = document.createElement("h1");
const controls = document.createElement("div");
controls.className = "controls";

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

controls.append(advanceDayButton, advanceWeekButton);
header.append(title, controls);

const navTitle = document.createElement("h1");
navTitle.textContent = "Manager";
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

app.append(nav, header, main);

function render(): void {
  const world = store.snapshot;
  title.textContent = `HTML5 Football Manager — ${world.clubs.find((c) => c.id === world.userClubId)?.name ?? "Unknown"}`;
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

const notifications = document.createElement("section");
notifications.className = "card";
notifications.innerHTML = "<h2>Daily Summary</h2><div id=\"notifications\"><p>No messages yet.</p></div>";
main.after(notifications);

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
