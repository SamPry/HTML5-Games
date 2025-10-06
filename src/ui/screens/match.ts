import type { World } from "@app/world";

export function renderMatch(world: World): string {
  const match = world.results[0];
  if (!match) {
    return `<section class="card"><p>No match has been played yet.</p></section>`;
  }
  const fixture = world.fixtures.find((f) => f.id === match.fixtureId);
  const homeClub = world.clubs.find((club) => club.id === fixture?.homeId);
  const awayClub = world.clubs.find((club) => club.id === fixture?.awayId);
  const homeStats = match.stats.find((s) => s.clubId === fixture?.homeId);
  const awayStats = match.stats.find((s) => s.clubId === fixture?.awayId);

  return `
    <section class="card match-card">
      <div class="section-heading">
        <span class="eyebrow">Last Result</span>
        <h2>Full-time report</h2>
      </div>
      ${renderScoreline(homeClub?.name ?? "Home", awayClub?.name ?? "Away", match.score.home, match.score.away)}
      <div class="match-stats">
        ${renderMatchStat("Shots", homeStats?.shots ?? 0, awayStats?.shots ?? 0)}
        ${renderMatchStat("On Target", homeStats?.shotsOnTarget ?? 0, awayStats?.shotsOnTarget ?? 0)}
        ${renderMatchStat("Possession", formatPossession(homeStats?.possession), formatPossession(awayStats?.possession))}
      </div>
      <h3>Timeline</h3>
      <ul class="timeline">
        ${match.events.length
          ? match.events
              .map((event) => `<li><span class="minute">${event.minute}'</span><span>${event.description}</span></li>`)
              .join("")
          : '<li class="empty">No key events recorded.</li>'}
      </ul>
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Ratings</span>
        <h2>Player impact</h2>
      </div>
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
    </section>
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
