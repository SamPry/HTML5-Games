import type { World } from "@app/world";

export function renderTransfers(world: World): string {
  const club = world.clubs.find((entry) => entry.id === world.userClubId);
  if (!club) {
    return `<section class="card"><p class="empty">Select a club to manage transfers.</p></section>`;
  }
  const listings = world.transferListings.filter((listing) => listing.status !== "Completed");
  const history = world.transferHistory.slice(0, 6);

  return `
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Budgets</span>
        <h2>Financial outlook</h2>
      </div>
      <div class="budget-grid">
        <div class="budget-tile">
          <span>Transfer budget</span>
          <strong>£${formatCurrency(club.transferBudget)}</strong>
        </div>
        <div class="budget-tile">
          <span>Wage budget</span>
          <strong>£${formatCurrency(club.wageBudget)}/wk</strong>
        </div>
        <div class="budget-tile">
          <span>Committed wages</span>
          <strong>£${formatCurrency(club.wageCommitment)}/wk</strong>
        </div>
      </div>
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Marketplace</span>
        <h2>Transfer targets</h2>
      </div>
      ${
        listings.length
          ? `<table class="data-table transfers-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Club</th>
                  <th>Value</th>
                  <th>Asking price</th>
                  <th>Bid</th>
                </tr>
              </thead>
              <tbody>
                ${listings
                  .map((listing) => renderListingRow(world, listing))
                  .join("")}
              </tbody>
            </table>`
          : '<p class="empty">No players are currently available.</p>'
      }
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Recent activity</span>
        <h2>Completed deals</h2>
      </div>
      ${
        history.length
          ? `<ul class="timeline">${history
              .map((entry) => {
                const player = world.players.find((p) => p.id === entry.playerId);
                const seller = world.clubs.find((c) => c.id === entry.fromClubId);
                const buyer = world.clubs.find((c) => c.id === entry.toClubId);
                return `<li><span class="minute">£${formatCurrency(entry.fee)}</span><span>${player?.name ?? "Player"} → ${buyer?.shortName ?? "???"} (${seller?.shortName ?? "???"})</span></li>`;
              })
              .join("")}</ul>`
          : '<p class="empty">No recent transfers.</p>'
      }
    </section>
  `;
}

export function bindTransferInteractions(
  container: HTMLElement,
  helpers: {
    makeTransferBid: (playerId: string, offer: number) => string;
    notify: (message: string) => void;
  }
): void {
  container.querySelectorAll<HTMLButtonElement>("[data-transfer-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const playerId = button.dataset.playerId;
      const inputId = button.dataset.inputId;
      if (!playerId || !inputId) return;
      const input = container.querySelector<HTMLInputElement>(`#${inputId}`);
      if (!input) return;
      const offer = Number.parseInt(input.value.replace(/[^0-9]/g, ""), 10);
      if (!Number.isFinite(offer) || offer <= 0) {
        helpers.notify("Enter a valid offer amount.");
        return;
      }
      const response = helpers.makeTransferBid(playerId, offer);
      helpers.notify(response);
    });
  });
}

function renderListingRow(world: World, listing: World["transferListings"][number]): string {
  const player = world.players.find((p) => p.id === listing.playerId);
  const club = world.clubs.find((c) => c.id === listing.fromClubId);
  const inputId = `offer-${listing.playerId}`;
  return `
    <tr>
      <td>
        <div class="player-cell">
          <strong>${player?.name ?? "Unknown"}</strong>
          <span>${player?.positions.join(", ") ?? ""}</span>
        </div>
      </td>
      <td>${club?.shortName ?? "-"}</td>
      <td>£${formatCurrency(player?.value ?? 0)}</td>
      <td>£${formatCurrency(listing.askingPrice)}</td>
      <td>
        <div class="input-row">
          <input id="${inputId}" type="number" min="100000" step="500000" value="${listing.askingPrice}" />
          <button type="button" class="primary" data-transfer-action data-player-id="${listing.playerId}" data-input-id="${inputId}">
            Submit bid
          </button>
        </div>
      </td>
    </tr>
  `;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value);
}
