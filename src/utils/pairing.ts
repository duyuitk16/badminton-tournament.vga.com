import { type Player, type Team } from "@/types";

export function generateRandomPairs(players: Player[]): Team[] {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const teams: Team[] = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      teams.push({
        id: crypto.randomUUID(),
        players: [shuffled[i], shuffled[i + 1]],
        totalSkill: shuffled[i].skillLevel + shuffled[i + 1].skillLevel,
        name: `${shuffled[i].name} & ${shuffled[i + 1].name}`,
      });
    }
  }
  return teams;
}

export function generateFairPairs(players: Player[]): Team[] {
  // Sort by skill descending
  const sorted = [...players].sort((a, b) => b.skillLevel - a.skillLevel);
  const teams: Team[] = [];

  const mid = Math.floor(sorted.length / 2);
  for (let i = 0; i < mid; i++) {
    const p1 = sorted[i];
    const p2 = sorted[sorted.length - 1 - i];

    teams.push({
      id: crypto.randomUUID(),
      players: [p1, p2],
      totalSkill: p1.skillLevel + p2.skillLevel,
      name: `${p1.name} & ${p2.name}`,
    });
  }

  return teams;
}
