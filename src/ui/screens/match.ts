import type { World } from "@app/world";
import type { Match } from "@domain/match/types";

export function renderMatch(world: World): string {
  const match = world.results[0];
  if (!match) {
    return `<section class="card"><p>No match has been played yet.</p></section>`;
  }
  return `
    <section class="card">
      <h2>Last Result</h2>
      ${renderScoreline(world, match)}
      <h3>Timeline</h3>
      <ul>
        ${match.events
          .map((event) => `<li><span class="badge">${event.minute}'</span> ${event.description}</li>`)
          .join("")}
      </ul>
    </section>
    <section class="card">
      <h2>Player Ratings</h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Rating</th>
            <th>Goals</th>
            <th>Shots</th>
            <th>Passes</th>
            <th>Tackles</th>
          </tr>
        </thead>
        <tbody>
          ${match.playerStats
            .slice()
            .sort((a, b) => b.rating - a.rating)
            .map((stat) => {
              const player = world.players.find((p) => p.id === stat.playerId);
              return `
                <tr>
                  <td>${player?.name ?? stat.playerId}</td>
                  <td>${stat.rating.toFixed(1)}</td>
                  <td>${stat.goals}</td>
                  <td>${stat.shots}</td>
                  <td>${stat.passesCompleted}</td>
                  <td>${stat.tacklesWon}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderScoreline(world: World, match: Match): string {
  const fixture = world.fixtures.find((f) => f.id === match.fixtureId);
  const home = world.clubs.find((club) => club.id === fixture?.homeId)?.name ?? "Home";
  const away = world.clubs.find((club) => club.id === fixture?.awayId)?.name ?? "Away";
  return `<div class="scoreline"><h3>${home} ${match.score.home} - ${match.score.away} ${away}</h3></div>`;
}
