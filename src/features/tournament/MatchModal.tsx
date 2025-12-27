import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type Match, type MatchSet, type TournamentConfig } from "@/types";
import { useState } from "react";

interface MatchModalProps {
  match: Match;
  team1Name: string;
  team2Name: string;
  config: TournamentConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (match: Match) => void;
}

export function MatchModal({
  match,
  team1Name,
  team2Name,
  config,
  isOpen,
  onClose,
  onSave,
}: MatchModalProps) {
  const [sets, setSets] = useState<MatchSet[]>(
    match.sets.length > 0
      ? match.sets
      : Array(config.sets).fill({ team1Score: 0, team2Score: 0 })
  );

  // We need to track actual played sets.
  // Initial state should probably be flexible.
  // For now let's show inputs for all potential sets.

  const updateScore = (setIndex: number, team: 1 | 2, score: string) => {
    const newSets = [...sets];
    const val = parseInt(score) || 0;
    if (!newSets[setIndex])
      newSets[setIndex] = { team1Score: 0, team2Score: 0 };

    if (team === 1) newSets[setIndex].team1Score = val;
    else newSets[setIndex].team2Score = val;

    setSets(newSets);
  };

  const calculateWinner = () => {
    let t1Wins = 0;
    let t2Wins = 0;

    sets.forEach((set) => {
      // Logic for valid set completion?
      // Assuming user enters valid final scores
      if (set.team1Score > set.team2Score) t1Wins++;
      if (set.team2Score > set.team1Score) t2Wins++;
    });

    const setsToWin = Math.ceil(config.sets / 2);
    if (t1Wins >= setsToWin) return match.team1Id;
    if (t2Wins >= setsToWin) return match.team2Id;
    return undefined;
  };

  const handleSave = () => {
    const winnerId = calculateWinner();
    onSave({
      ...match,
      sets: sets.filter((s) => s.team1Score > 0 || s.team2Score > 0), // Filter empty sets if desired, or keep logic simple
      winnerId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Match Result</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4 text-center font-bold">
            <div>{team1Name}</div>
            <div className="text-muted-foreground text-xs">VS</div>
            <div>{team2Name}</div>
          </div>

          <div className="space-y-2">
            {sets.map((set, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 items-center">
                <Input
                  type="number"
                  value={set.team1Score}
                  onChange={(e) => updateScore(idx, 1, e.target.value)}
                  className="text-center"
                />
                <div className="text-center text-sm text-muted-foreground">
                  Set {idx + 1}
                </div>
                <Input
                  type="number"
                  value={set.team2Score}
                  onChange={(e) => updateScore(idx, 2, e.target.value)}
                  className="text-center"
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Update Match</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
