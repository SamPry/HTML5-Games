import type { StandingsRow, World } from "@app/world";
import { standingsForLeague } from "@app/world";
import type { ID } from "@core/types";

export function renderStandings(world: World, selectedLeagueId: ID | null): string {
  const sortedLeagues = [...world.leagues].sort(
    (a, b) => a.level - b.level || a.name.localeCompare(b.name)
  );
  const league =
    sortedLeagues.find((entry) => entry.id === selectedLeagueId) ?? sortedLeagues[0];
  if (!league) {
    return `<section class="card"><p class="empty">No league data available.</p></section>`;
  }

  const standings = standingsForLeague(world, league.id);
  const competitionSummary = `${world.leagues.length} competitions across ${new Set(
    world.leagues.map((l) => l.nation)
  ).size} nations`;

  return `
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Competition</span>
        <h2>${league.name}</h2>
      </div>
      <div class="toolbar">
        <label for="standings-league" class="muted-text">League</label>
        <select id="standings-league">
          ${sortedLeagues
            .map(
              (entry) =>
                `<option value="${entry.id}" ${entry.id === league.id ? "selected" : ""}>${entry.name} (Tier ${entry.level}, ${entry.nation})</option>`
            )
            .join("")}
        </select>
      </div>
      <p class="muted-text">${competitionSummary}</p>
      <table class="data-table standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Club</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
            <th>Form</th>
          </tr>
        </thead>
        <tbody>
          ${renderTableBody(world, standings)}
        </tbody>
      </table>
    </section>
  `;
}

function renderTableBody(world: World, standings: StandingsRow[]): string {
  return standings
    .map((row, index) => {
      const club = world.clubs.find((entry) => entry.id === row.clubId);
      const isUser = row.clubId === world.userClubId;
      return `
        <tr class="${isUser ? "highlight" : ""}">
          <td>${index + 1}</td>
          <td>${club?.name ?? row.clubId}</td>
          <td>${row.played}</td>
          <td>${row.won}</td>
          <td>${row.drawn}</td>
          <td>${row.lost}</td>
          <td>${row.goalsFor}</td>
          <td>${row.goalsAgainst}</td>
          <td>${row.goalDifference}</td>
          <td>${row.points}</td>
          <td><span class="form-seq">${row.form.join(" ") || "-"}</span></td>
        </tr>
      `;
    })
    .join("");
}

export function bindStandingsInteractions(
  container: HTMLElement,
  helpers: { onLeagueChange: (leagueId: ID) => void }
): void {
  const select = container.querySelector<HTMLSelectElement>("#standings-league");
  if (!select) return;
  select.addEventListener("change", () => {
    helpers.onLeagueChange(select.value as ID);
  });
}
