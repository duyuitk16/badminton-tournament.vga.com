import { type Match, type Team, type TournamentConfig } from "@/types";

export function generateBracket(
  teams: Team[],
  _config: TournamentConfig
): Match[] {
  // Simple single elimination bracket generation

  if (teams.length < 2) return [];

  const matches: Match[] = [];
  const round1MatchesCount = Math.ceil(teams.length / 2);

  // Create Round 1
  for (let i = 0; i < round1MatchesCount; i++) {
    const team1 = teams[i * 2];
    const team2 = teams[i * 2 + 1]; // Might be undefined if odd

    matches.push({
      id: crypto.randomUUID(),
      round: 1,
      team1Id: team1.id,
      team2Id: team2 ? team2.id : "BYE", // Handle bye
      winnerId: team2 ? undefined : team1.id, // Auto win if bye
      sets: [],
      // Next match ID to be linked later
    });
  }

  // Create subsequent rounds
  let currentRound = 1;
  let currentRoundMatches = matches.filter((m) => m.round === currentRound);

  while (currentRoundMatches.length > 1) {
    const nextRound = currentRound + 1;
    const nextRoundMatchesCount = Math.ceil(currentRoundMatches.length / 2);

    for (let i = 0; i < nextRoundMatchesCount; i++) {
      const m1 = currentRoundMatches[i * 2];
      const m2 = currentRoundMatches[i * 2 + 1];

      const newMatch: Match = {
        id: crypto.randomUUID(),
        round: nextRound,
        team1Id: "", // To be filled from previous
        team2Id: "",
        sets: [],
      };

      matches.push(newMatch);

      // Link previous matches to this new one
      if (m1) {
        m1.nextMatchId = newMatch.id;
        m1.nextMatchSlot = 1;
      }
      if (m2) {
        m2.nextMatchId = newMatch.id;
        m2.nextMatchSlot = 2;
      }
    }

    currentRound = nextRound;
    currentRoundMatches = matches.filter((m) => m.round === currentRound);
  }

  return matches;
}

export function getMatchLabel(round: number, totalRounds: number): string {
  if (round === totalRounds) return "Final";
  if (round === totalRounds - 1) return "Semi-Finals";
  if (round === totalRounds - 2) return "Quarter-Finals";
  return `Round ${round}`;
}
