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
    <section class="card">
      <h2>${club.name} Squad</h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Pos</th>
            <th>Age</th>
            <th>CA</th>
            <th>Morale</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          ${players
            .map(
              (player) => `
                <tr>
                  <td>${player.name}</td>
                  <td>${player.positions.join(", ")}</td>
                  <td>${player.age}</td>
                  <td>${player.currentAbility}</td>
                  <td>${Math.round(player.morale)}</td>
                  <td>${Math.round(player.condition)}%</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}
