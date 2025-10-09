import type { World } from "@app/world";
import type { Player } from "@domain/player/types";

export function renderSquad(world: World): string {
  const club = world.clubs.find((c) => c.id === world.userClubId);
  if (!club) {
    return `<section class="card"><p>No club selected.</p></section>`;
  }

  const players = club.roster
    .map((playerId) => world.players.find((player) => player.id === playerId))
    .filter((player): player is Player => Boolean(player))
    .sort((a, b) => b.currentAbility - a.currentAbility);

  return `
    <section class="card squad-card">
      <div class="section-heading">
        <span class="eyebrow">Squad Overview</span>
        <h2>${club.name}</h2>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Positions</th>
            <th>Age</th>
            <th>CA</th>
            <th>Morale</th>
            <th>Condition</th>
            <th>Wage</th>
            <th>Value</th>
            <th>Contract</th>
          </tr>
        </thead>
        <tbody>
          ${players
            .map(
              (player) => {
                const nationality = player.nationality;
                return `
                <tr>
                  <td>
                    <div class="player-cell">
                      <span class="avatar">${player.name.slice(0, 1)}</span>
                      <div>
                        <strong>${player.name}</strong>
                        ${nationality ? `<small>${nationality}</small>` : ""}
                      </div>
                    </div>
                  </td>
                  <td>${player.positions
                    .map((pos) => `<span class="pill muted">${pos}</span>`)
                    .join(" ")}</td>
                  <td>${player.age.toFixed(0)}</td>
                  <td><span class="stat-badge">${player.currentAbility}</span></td>
                  <td>
                    <div class="meter" style="--value:${Math.round(player.morale)}"></div>
                    <small>${Math.round(player.morale)}</small>
                  </td>
                  <td>
                    <div class="meter positive" style="--value:${Math.round(player.condition)}"></div>
                    <small>${Math.round(player.condition)}%</small>
                  </td>
                  <td>£${formatCurrency(player.wage)}/wk</td>
                  <td>£${formatCurrency(player.value)}</td>
                  <td>${player.contractExpirySeason}</td>
                </tr>
              `;
              }
            )
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value);
}
