import type { World } from "@app/world";

export function renderTactics(world: World): string {
  const club = world.clubs.find((c) => c.id === world.userClubId);
  if (!club) return `<section class="card"><p>No tactics available.</p></section>`;

  const instructions = `
    <div class="controls">
      <label>
        Formation
        <select id="formation-select">
          ${["4-4-2", "4-3-3", "3-5-2", "4-2-3-1"]
            .map((formation) => `<option value="${formation}" ${
              formation === club.tactics.formation ? "selected" : ""
            }>${formation}</option>`)
            .join("")}
        </select>
      </label>
      <label>
        Mentality
        <select id="mentality-select">
          ${["Cautious", "Balanced", "Positive"]
            .map((mentality) => `<option value="${mentality}" ${
              mentality === club.tactics.mentality ? "selected" : ""
            }>${mentality}</option>`)
            .join("")}
        </select>
      </label>
      <label>
        Tempo
        <input type="range" min="0" max="100" value="${club.tactics.tempo}" disabled />
      </label>
      <label>
        Press
        <input type="range" min="0" max="100" value="${club.tactics.press}" disabled />
      </label>
    </div>
  `;

  return `
    <section class="card">
      <h2>Tactical Identity</h2>
      ${instructions}
      <details>
        <summary>Coming soon: Editable tactics</summary>
        <p>
          This minimal slice keeps tactics read-only. Future updates will unlock editing,
          role selection, and granular instructions.
        </p>
      </details>
    </section>
    <section class="card">
      <h2>Formation Board</h2>
      <canvas id="tactics-pitch" class="pitch" width="900" height="420"></canvas>
    </section>
  `;
}
