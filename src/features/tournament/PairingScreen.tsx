import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Player, type Team } from "@/types";
import { generateFairPairs, generateRandomPairs } from "@/utils/pairing";
import { Shuffle, Users } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PairingScreenProps {
  players: Player[];
  onPairsConfirmed: (pairs: Team[]) => void;
  onBack: () => void;
}

export function PairingScreen({
  players,
  onPairsConfirmed,
  onBack,
}: PairingScreenProps) {
  const [teams, setTeams] = useState<Team[]>([]);

  const handleRandom = () => {
    setTeams(generateRandomPairs(players));
  };

  const handleFair = () => {
    setTeams(generateFairPairs(players));
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={handleFair}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Users className="mr-2 h-5 w-5" /> Fair Pairing (Balanced)
          </Button>
          <Button size="lg" variant="outline" onClick={handleRandom}>
            <Shuffle className="mr-2 h-5 w-5" /> Random Pairing
          </Button>
        </div>

        {teams.length > 0 && (
          <div className="space-y-4">
            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {teams.map((team, idx) => (
                <div
                  key={team.id}
                  className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center bg-muted/50 -m-4 p-3 mb-0 rounded-t-lg border-b">
                    <span className="font-semibold">Team {idx + 1}</span>
                    <Badge
                      variant="secondary"
                      className="text-base px-3 py-1 bg-white dark:bg-slate-800"
                    >
                      Total Skill: {team.totalSkill}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    {team.players.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>{p.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {p.skillLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Players</TableHead>
                    <TableHead>Total Skill</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team, idx) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">
                        Team {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {team.players.map((p) => (
                            <span key={p.id}>
                              {p.name} (Skill: {p.skillLevel})
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-lg">
                          {team.totalSkill}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 pt-4 md:flex-row md:justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full md:w-auto"
          >
            Back
          </Button>
          <Button
            onClick={() => onPairsConfirmed(teams)}
            disabled={teams.length === 0}
            className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
          >
            Confirm & Generate Bracket
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
