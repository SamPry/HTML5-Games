import type { World } from "@app/world";
import type { Fixture } from "@domain/match/types";

function formatDate(date: World["date"]): string {
  return `Season ${date.season} • Week ${date.week + 1} • Day ${date.day + 1}`;
}

function nextFixture(world: World): Fixture | undefined {
  return world.fixtures.find((fixture) => !fixture.played);
}

export function renderDashboard(world: World): string {
  const fixture = nextFixture(world);
  const inboxPreview = world.inbox.slice(0, 3);
  const recentResults = world.results.slice(0, 3);

  return `
    <section class="card">
      <h2>Today</h2>
      <div class="grid">
        <div class="summary-metric">
          <strong>${formatDate(world.date)}</strong>
          <span class="badge info">World State</span>
        </div>
        <div class="summary-metric">
          <strong>${world.clubs.length}</strong>
          <span class="badge">Clubs</span>
        </div>
        <div class="summary-metric">
          <strong>${world.players.length}</strong>
          <span class="badge">Players</span>
        </div>
      </div>
    </section>
    <section class="card">
      <h2>Next Fixture</h2>
      ${fixture ? renderFixture(world, fixture) : "<p>No upcoming fixtures.</p>"}
    </section>
    <section class="card">
      <h2>Recent Results</h2>
      ${recentResults.length ? renderResults(world, recentResults) : "<p>No matches played yet.</p>"}
    </section>
    <section class="card">
      <h2>Inbox</h2>
      <ul>
        ${inboxPreview.map((message) => `<li>${message}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderFixture(world: World, fixture: Fixture): string {
  const home = world.clubs.find((club) => club.id === fixture.homeId);
  const away = world.clubs.find((club) => club.id === fixture.awayId);
  return `
    <div class="grid">
      <div>
        <div class="badge">Home</div>
        <h3>${home?.name ?? "Unknown"}</h3>
      </div>
      <div>
        <div class="badge">Away</div>
        <h3>${away?.name ?? "Unknown"}</h3>
      </div>
    </div>
  `;
}

function renderResults(world: World, matches: World["results"]): string {
  return `
    <ul>
      ${matches
        .map((match) => {
          const fixture = world.fixtures.find((f) => f.id === match.fixtureId);
          const home = world.clubs.find((club) => club.id === fixture?.homeId)?.shortName ?? "Home";
          const away = world.clubs.find((club) => club.id === fixture?.awayId)?.shortName ?? "Away";
          return `<li><strong>${home} ${match.score.home}-${match.score.away} ${away}</strong></li>`;
        })
        .join("")}
    </ul>
  `;
}
