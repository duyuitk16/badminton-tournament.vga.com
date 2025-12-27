import { Card, CardContent } from "@/components/ui/card";
import { type Match, type Team, type TournamentConfig } from "@/types";
import { generateBracket, getMatchLabel } from "@/utils/bracket";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { MatchModal } from "./MatchModal";

interface BracketViewProps {
  teams: Team[];
  config: TournamentConfig;
}

export function BracketView({ teams, config }: BracketViewProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (teams.length > 0 && matches.length === 0) {
      const generated = generateBracket(teams, config);
      setMatches(generated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams]);
  // Disable exhaustive deps because we only want to generate once when teams change,
  // and we check matches.length === 0 to avoid overwrite IF we don't want to reset.
  // Ideally we should key the component or handle reset better.

  const rounds = matches.reduce((acc, match) => {
    acc[match.round] = acc[match.round] || [];
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const roundNumbers = Object.keys(rounds)
    .map(Number)
    .sort((a, b) => a - b);
  const totalRounds = roundNumbers.length;

  const getTeamName = (id: string) => {
    if (id === "BYE") return "BYE";
    if (!id) return "TBD";
    const t = teams.find((t) => t.id === id);
    return t ? t.name : "Unknown";
  };

  const handleMatchUpdate = (updatedMatch: Match) => {
    const newMatches = matches.map((m) =>
      m.id === updatedMatch.id ? updatedMatch : m
    );

    // Propagate winner
    if (
      updatedMatch.winnerId &&
      updatedMatch.nextMatchId &&
      updatedMatch.nextMatchSlot
    ) {
      const nextMatchIndex = newMatches.findIndex(
        (m) => m.id === updatedMatch.nextMatchId
      );
      if (nextMatchIndex !== -1) {
        const nextMatch = { ...newMatches[nextMatchIndex] };
        if (updatedMatch.nextMatchSlot === 1) {
          nextMatch.team1Id = updatedMatch.winnerId;
        } else {
          nextMatch.team2Id = updatedMatch.winnerId;
        }
        newMatches[nextMatchIndex] = nextMatch;
      }
    }
    setMatches(newMatches);
    setSelectedMatch(null);
  };

  return (
    <div className="overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide md:scrollbar-default">
      <div className="flex gap-8 min-w-max p-4 justify-center">
        {roundNumbers.map((round) => (
          <div
            key={round}
            className="flex flex-col gap-8 justify-around relative"
          >
            <h3 className="text-center font-bold text-lg sticky top-0 bg-background/95 p-2 backdrop-blur">
              {getMatchLabel(round, totalRounds)}
            </h3>
            {rounds[round].map((match) => (
              <Card
                key={match.id}
                className={`w-64 cursor-pointer hover:border-primary transition-colors ${
                  match.winnerId ? "border-green-200 dark:border-green-900" : ""
                }`}
                onClick={() => setSelectedMatch(match)}
              >
                <CardContent className="p-3 space-y-2">
                  <div
                    className={`flex justify-between items-center p-2 rounded ${
                      match.winnerId === match.team1Id
                        ? "bg-green-100 dark:bg-green-900/30"
                        : ""
                    }`}
                  >
                    <span className="truncate text-sm font-medium">
                      {getTeamName(match.team1Id)}
                    </span>
                    {match.sets.length > 0 && (
                      <span className="font-bold">
                        {match.sets.reduce(
                          (a, b) => a + (b.team1Score > b.team2Score ? 1 : 0),
                          0
                        )}
                      </span>
                    )}
                  </div>
                  <div className="h-px bg-border" />
                  <div
                    className={`flex justify-between items-center p-2 rounded ${
                      match.winnerId === match.team2Id
                        ? "bg-green-100 dark:bg-green-900/30"
                        : ""
                    }`}
                  >
                    <span className="truncate text-sm font-medium">
                      {getTeamName(match.team2Id)}
                    </span>
                    {match.sets.length > 0 && (
                      <span className="font-bold">
                        {match.sets.reduce(
                          (a, b) => a + (b.team2Score > b.team1Score ? 1 : 0),
                          0
                        )}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-1">
                    Match #{match.id.slice(0, 4)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}

        {matches.length > 0 && matches[matches.length - 1].winnerId && (
          <div className="flex flex-col justify-center gap-4 animate-in fade-in zoom-in duration-500">
            <Card className="w-64 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-6 text-center space-y-4">
                <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
                <div>
                  <h3 className="font-bold text-xl text-yellow-700 dark:text-yellow-400">
                    Winner
                  </h3>
                  <p className="text-2xl font-black mt-2">
                    {getTeamName(matches[matches.length - 1].winnerId!)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          team1Name={getTeamName(selectedMatch.team1Id) || "TBD"}
          team2Name={getTeamName(selectedMatch.team2Id) || "TBD"}
          config={config}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSave={handleMatchUpdate}
        />
      )}
    </div>
  );
}
