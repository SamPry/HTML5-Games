import type { World } from "@app/world";

export function renderStandings(world: World): string {
  const standings = world.standings;
  return `
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Competition</span>
        <h2>${world.leagues[0]?.name ?? "League table"}</h2>
      </div>
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
          ${standings
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
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}
