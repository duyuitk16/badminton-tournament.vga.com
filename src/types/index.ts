export type TournamentType =
  | "mens_singles"
  | "womens_singles"
  | "mens_doubles"
  | "womens_doubles"
  | "mixed_doubles";

export interface TournamentConfig {
  name: string;
  type: TournamentType;
  sets: number;
  pointsPerSet: number;
}

export type SkillLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Player {
  id: string;
  name: string;
  skillLevel: SkillLevel;
  gender: "male" | "female";
}

export interface Team {
  id: string;
  players: Player[];
  name?: string;
  totalSkill: number;
}

export interface MatchSet {
  team1Score: number;
  team2Score: number;
}

export interface Match {
  id: string;
  round: number;
  team1Id: string;
  team2Id: string;
  sets: MatchSet[];
  winnerId?: string;
  nextMatchId?: string; // For bracket progression
  nextMatchSlot?: 1 | 2;
}

export interface Tournament {
  id: string;
  config: TournamentConfig;
  players: Player[];
  teams: Team[];
  matches: Match[];
  status: "setup" | "registration" | "pairing" | "ongoing" | "completed";
}
