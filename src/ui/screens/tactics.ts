import type { World } from "@app/world";

export function renderTactics(world: World): string {
  const club = world.clubs.find((c) => c.id === world.userClubId);
  if (!club) return `<section class="card"><p>No tactics available.</p></section>`;

  const instructions = `
    <div class="tactics-controls">
      <div class="control">
        <span class="eyebrow">Formation</span>
        <div class="field">
          <select id="formation-select" disabled>
            ${["4-4-2", "4-3-3", "3-5-2", "4-2-3-1"]
              .map((formation) => `<option value="${formation}" ${
                formation === club.tactics.formation ? "selected" : ""
              }>${formation}</option>`)
              .join("")}
          </select>
        </div>
      </div>
      <div class="control">
        <span class="eyebrow">Mentality</span>
        <div class="field">
          <select id="mentality-select" disabled>
            ${["Cautious", "Balanced", "Positive"]
              .map((mentality) => `<option value="${mentality}" ${
                mentality === club.tactics.mentality ? "selected" : ""
              }>${mentality}</option>`)
              .join("")}
          </select>
        </div>
      </div>
      <div class="control">
        <span class="eyebrow">Tempo</span>
        <div class="slider"><input type="range" min="0" max="100" value="${club.tactics.tempo}" disabled /></div>
      </div>
      <div class="control">
        <span class="eyebrow">Press</span>
        <div class="slider"><input type="range" min="0" max="100" value="${club.tactics.press}" disabled /></div>
      </div>
    </div>
  `;

  return `
    <section class="card tactics-card">
      <div class="section-heading">
        <span class="eyebrow">Tactical Identity</span>
        <h2>Game model</h2>
      </div>
      ${instructions}
      <p class="muted-text">
        Editing is locked for this slice. The next milestone unlocks interactive role selection,
        in-possession tweaks, and set-piece blueprints.
      </p>
    </section>
    <section class="card formation-card">
      <div class="section-heading">
        <span class="eyebrow">Shape</span>
        <h2>Formation board</h2>
      </div>
      <canvas id="tactics-pitch" class="pitch" width="900" height="420"></canvas>
    </section>
  `;
}
