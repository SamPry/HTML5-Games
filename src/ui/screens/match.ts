import type { World } from "@app/world";
import { upcomingFixtures } from "@app/world";

export function renderMatch(world: World): string {
  if (!world.userClubId) {
    return `<section class="card"><p class="empty">Select a club to view matchday reports.</p></section>`;
  }
  const match = world.results[0];
  const nextFixtures = upcomingFixtures(world, world.userClubId);

  return `
    <section class="card match-card">
      <div class="section-heading">
        <span class="eyebrow">Last Result</span>
        <h2>Full-time report</h2>
      </div>
      ${match ? renderMatchSummary(world, match) : '<p class="empty">No matches played yet.</p>'}
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Simulation</span>
        <h2>Instant result</h2>
      </div>
      ${
        nextFixtures.length
          ? `<form id="manual-sim-form" class="inline-form">
              <label for="manual-sim-select">Upcoming fixture</label>
              <div class="input-row">
                <select id="manual-sim-select" required>
                  ${nextFixtures
                    .map(
                      (fixture) =>
                        `<option value="${fixture.id}">${fixture.homeId === world.userClubId ? "vs " + clubName(world, fixture.awayId) : "at " + clubName(world, fixture.homeId)}</option>`
                    )
                    .join("")}
                </select>
                <button type="submit" class="primary">Simulate</button>
              </div>
            </form>`
          : '<p class="empty">No fixtures remain to simulate.</p>'
      }
    </section>
  `;
}

export function bindMatchInteractions<T>(
  container: HTMLElement,
  helpers: {
    simulateFixture: (fixtureId: string) => T;
    handleResult: (result: T) => void;
    notify: (message: string) => void;
  }
): void {
  const form = container.querySelector<HTMLFormElement>("#manual-sim-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const select = form.querySelector<HTMLSelectElement>("#manual-sim-select");
    if (!select || !select.value) {
      helpers.notify("Select a fixture to simulate.");
      return;
    }
    const result = helpers.simulateFixture(select.value);
    helpers.handleResult(result);
  });
}

function renderMatchSummary(world: World, match: World["results"][number]): string {
  const fixture = world.fixtures.find((f) => f.id === match.fixtureId);
  const homeClub = world.clubs.find((club) => club.id === fixture?.homeId);
  const awayClub = world.clubs.find((club) => club.id === fixture?.awayId);
  const homeStats = match.stats.find((s) => s.clubId === fixture?.homeId);
  const awayStats = match.stats.find((s) => s.clubId === fixture?.awayId);

  return `
    ${renderScoreline(homeClub?.name ?? "Home", awayClub?.name ?? "Away", match.score.home, match.score.away)}
    <div class="match-stats">
      ${renderMatchStat("Shots", homeStats?.shots ?? 0, awayStats?.shots ?? 0)}
      ${renderMatchStat("On Target", homeStats?.shotsOnTarget ?? 0, awayStats?.shotsOnTarget ?? 0)}
      ${renderMatchStat("Possession", formatPossession(homeStats?.possession), formatPossession(awayStats?.possession))}
    </div>
    <h3>Timeline</h3>
    <ul class="timeline">
      ${
        match.events.length
          ? match.events
              .map((event) => `<li><span class="minute">${event.minute}'</span><span>${event.description}</span></li>`)
              .join("")
          : '<li class="empty">No key events recorded.</li>'
      }
    </ul>
    <h3>Player impact</h3>
    <table class="data-table">
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
                <td><span class="stat-badge">${stat.rating.toFixed(1)}</span></td>
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
  `;
}

function renderScoreline(home: string, away: string, homeScore: number, awayScore: number): string {
  return `
    <div class="scoreboard">
      <div class="team">
        <span class="team-name">${home}</span>
        <span class="team-score">${homeScore}</span>
      </div>
      <div class="score-divider">vs</div>
      <div class="team">
        <span class="team-name">${away}</span>
        <span class="team-score">${awayScore}</span>
      </div>
    </div>
  `;
}

function renderMatchStat(label: string, home: number | string, away: number | string): string {
  return `
    <div class="match-stat">
      <span class="label">${label}</span>
      <div class="values">
        <span>${home}</span>
        <span>${away}</span>
      </div>
    </div>
  `;
}

function formatPossession(value: number | undefined): string {
  return value !== undefined ? `${value.toFixed(0)}%` : "-";
}

function clubName(world: World, id: string): string {
  return world.clubs.find((club) => club.id === id)?.shortName ?? "Unknown";
}
