import type { DateStamp, ID } from "@core/types";
import { nextDay } from "@core/types";
import type { Club } from "@domain/club/types";
import type { Fixture } from "@domain/match/types";

export function buildSchedule(clubs: Club[], competitionId: ID, start: DateStamp): Fixture[] {
  const ordering = [...clubs];
  const fixtures: Fixture[] = [];
  let dateCursor = { ...start };
  let fixtureId = 1;

  for (let round = 0; round < ordering.length - 1; round += 1) {
    for (let i = 0; i < ordering.length / 2; i += 1) {
      const home = ordering[i];
      const away = ordering[ordering.length - 1 - i];
      fixtures.push({
        id: `fixture-${fixtureId++}`,
        competitionId,
        homeId: home.id,
        awayId: away.id,
        date: { ...dateCursor },
        played: false
      });
    }
    dateCursor = nextDay(dateCursor);
    rotate(ordering);
  }

  // reverse fixtures
  const reverseFixtures = fixtures.map((fixture) => ({
    ...fixture,
    id: `fixture-${fixtureId++}`,
    homeId: fixture.awayId,
    awayId: fixture.homeId,
    date: nextDay(fixture.date)
  }));

  return [...fixtures, ...reverseFixtures];
}

function rotate(clubs: Club[]): void {
  const fixed = clubs[0];
  const rest = clubs.slice(1);
  rest.unshift(rest.pop()!);
  clubs.splice(0, clubs.length, fixed, ...rest);
}
