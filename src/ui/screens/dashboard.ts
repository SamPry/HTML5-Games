import type { World } from "@app/world";
import { upcomingFixtures } from "@app/world";
import type { Fixture } from "@domain/match/types";

function formatDate(date: World["date"]): string {
  return `Season ${date.season} • Week ${date.week + 1} • Day ${date.day + 1}`;
}

function nextFixture(world: World): Fixture | undefined {
  return world.fixtures.find((fixture) => !fixture.played);
}

export function renderDashboard(world: World): string {
  const fixture = nextFixture(world);
  const inboxPreview = world.inbox.slice(0, 4);
  const recentResults = world.results.slice(0, 4);
  const club = world.clubs.find((c) => c.id === world.userClubId);
  const league = world.leagues.find((l) => l.id === club?.leagueId);
  const fixturesById = new Map(world.fixtures.map((f) => [f.id, f] as const));
  const schedule = upcomingFixtures(world, world.userClubId)
    .slice(0, 3)
    .map((fixture) => ({
      id: fixture.id,
      home: fixture.homeId === world.userClubId,
      opponentId: fixture.homeId === world.userClubId ? fixture.awayId : fixture.homeId,
      date: fixture.date
    }));
  const standings = world.standings.slice(0, 6);

  return `
    <section class="card hero">
      <div class="hero-text">
        <span class="eyebrow">Today</span>
        <h2>${club?.name ?? "HTML5 Football Manager"}</h2>
        <p>${formatDate(world.date)}</p>
        <div class="hero-meta">
          ${league ? `<span class="pill">${league.name}</span>` : ""}
          <span class="pill">${world.clubs.length} clubs</span>
          <span class="pill">${world.players.length} players</span>
        </div>
      </div>
      <div class="hero-stats">
        ${renderSnapshotMetric("Form", formatForm(world.results, fixturesById, club?.id ?? ""))}
        ${renderSnapshotMetric(
          "Goal Difference",
          goalDifference(world.results, fixturesById, club?.id ?? "")
        )}
        ${renderSnapshotMetric(
          "Matches Played",
          `${matchesPlayed(world.results, fixturesById, club?.id ?? "")}`
        )}
      </div>
    </section>
    <section class="card fixture-card">
      <div class="section-heading">
        <span class="eyebrow">Next Fixture</span>
        <h2>On the horizon</h2>
      </div>
      ${fixture ? renderFixture(world, fixture) : "<p class=\"empty\">No upcoming fixtures scheduled.</p>"}
    </section>
    <section class="card results-card">
      <div class="section-heading">
        <span class="eyebrow">Recent Results</span>
        <h2>Match log</h2>
      </div>
      ${
        recentResults.length
          ? renderResults(world, recentResults, fixturesById)
          : "<p class=\"empty\">No matches played yet.</p>"
      }
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Form guide</span>
        <h2>Upcoming</h2>
      </div>
      ${
        schedule.length
          ? `<ul class="fixtures-list">${schedule
              .map(
                (item) =>
                  `<li><span class="badge">${item.home ? "Home" : "Away"}</span><strong>${clubName(world, item.opponentId)}</strong><span>${formatDate(item.date)}</span></li>`
              )
              .join("")}</ul>`
          : '<p class="empty">Your schedule is clear.</p>'
      }
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Standings</span>
        <h2>Top six</h2>
      </div>
      ${renderStandingsPreview(world, standings)}
    </section>
    <section class="card inbox-card">
      <div class="section-heading">
        <span class="eyebrow">Inbox</span>
        <h2>Latest notes</h2>
      </div>
      <ul class="inbox-list">
        ${inboxPreview.length ? inboxPreview.map((message) => `<li>${message}</li>`).join("") : "<li>No new mail.</li>"}
      </ul>
    </section>
  `;
}

function renderStandingsPreview(world: World, standings: World["standings"]): string {
  if (!standings.length) {
    return '<p class="empty">No table data yet.</p>';
  }
  return `
    <table class="data-table compact">
      <thead>
        <tr>
          <th>#</th>
          <th>Club</th>
          <th>Pts</th>
          <th>GD</th>
        </tr>
      </thead>
      <tbody>
        ${standings
          .map((row, index) => {
            const club = world.clubs.find((c) => c.id === row.clubId);
            return `
              <tr>
                <td>${index + 1}</td>
                <td>${club?.shortName ?? row.clubId}</td>
                <td>${row.points}</td>
                <td>${row.goalDifference}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function clubName(world: World, id: string): string {
  return world.clubs.find((club) => club.id === id)?.shortName ?? id;
}

function renderSnapshotMetric(label: string, value: string): string {
  return `
    <div class="hero-metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderFixture(world: World, fixture: Fixture): string {
  const home = world.clubs.find((club) => club.id === fixture.homeId);
  const away = world.clubs.find((club) => club.id === fixture.awayId);
  return `
    <div class="fixture">
      <div class="club home">
        <span class="badge">Home</span>
        <h3>${home?.name ?? "Unknown"}</h3>
      </div>
      <div class="vs">VS</div>
      <div class="club away">
        <span class="badge">Away</span>
        <h3>${away?.name ?? "Unknown"}</h3>
      </div>
    </div>
  `;
}

function renderResults(
  world: World,
  matches: World["results"],
  fixturesById: Map<Fixture["id"], Fixture>
): string {
  return `
    <ul class="results-list">
      ${matches
        .map((match) => {
          const fixture = fixturesById.get(match.fixtureId) ?? world.fixtures.find((f) => f.id === match.fixtureId);
          const home = world.clubs.find((club) => club.id === fixture?.homeId)?.shortName ?? "Home";
          const away = world.clubs.find((club) => club.id === fixture?.awayId)?.shortName ?? "Away";
          return `
            <li>
              <div class="result-match">
                <strong>${home}</strong>
                <span class="score-pill">${match.score.home} - ${match.score.away}</span>
                <strong>${away}</strong>
              </div>
            </li>
          `;
        })
        .join("")}
    </ul>
  `;
}

function formatForm(
  results: World["results"],
  fixturesById: Map<Fixture["id"], Fixture>,
  clubId: string
): string {
  if (!clubId) return "-";
  const sequence = results
    .filter((match) => participated(fixturesById, match, clubId))
    .slice(0, 5)
    .map((match) => {
      const fixture = fixturesById.get(match.fixtureId);
      if (!fixture) return "-";
      const isHome = fixture.homeId === clubId;
      const scored = isHome ? match.score.home : match.score.away;
      const conceded = isHome ? match.score.away : match.score.home;
      if (scored === conceded) return "D";
      return scored > conceded ? "W" : "L";
    })
    .join(" ");
  return sequence || "-";
}

function goalDifference(
  matches: World["results"],
  fixturesById: Map<Fixture["id"], Fixture>,
  clubId: string
): string {
  if (!clubId) return "0";
  const diff = matches.reduce((total, match) => {
    const fixture = fixturesById.get(match.fixtureId);
    if (!fixture) return total;
    if (fixture.homeId !== clubId && fixture.awayId !== clubId) return total;
    const isHome = fixture.homeId === clubId;
    const scored = isHome ? match.score.home : match.score.away;
    const conceded = isHome ? match.score.away : match.score.home;
    return total + (scored - conceded);
  }, 0);
  return diff >= 0 ? `+${diff}` : `${diff}`;
}

function matchesPlayed(
  matches: World["results"],
  fixturesById: Map<Fixture["id"], Fixture>,
  clubId: string
): number {
  if (!clubId) return 0;
  return matches.filter((match) => participated(fixturesById, match, clubId)).length;
}

function participated(
  fixturesById: Map<Fixture["id"], Fixture>,
  match: World["results"][number],
  clubId: string
): boolean {
  const fixture = fixturesById.get(match.fixtureId);
  if (!fixture) return false;
  return fixture.homeId === clubId || fixture.awayId === clubId;
}
