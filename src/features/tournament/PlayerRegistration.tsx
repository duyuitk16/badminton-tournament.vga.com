import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Player, type SkillLevel } from "@/types";
import { Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface PlayerRegistrationProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PlayerRegistration({
  players,
  onPlayersChange,
  onNext,
  onBack,
}: PlayerRegistrationProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [skill, setSkill] = useState<number>(5);

  const handleAddPlayer = () => {
    if (!name.trim()) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      gender,
      skillLevel: skill as SkillLevel,
    };

    onPlayersChange([...players, newPlayer]);
    setName("");
    setSkill(5);
  };

  const handleRemovePlayer = (id: string) => {
    onPlayersChange(players.filter((p) => p.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddPlayer();
  };

  const getSkillLabel = (val: number) => {
    if (val <= 4) return "Weak (1-4)";
    if (val <= 6) return "Average (5-6)";
    if (val <= 8) return "Good (7-8)";
    return "Excellent (9-10)";
  };

  const getSkillColor = (val: number) => {
    if (val <= 4) return "bg-gray-500 hover:bg-gray-600";
    if (val <= 6) return "bg-blue-500 hover:bg-blue-600";
    if (val <= 8) return "bg-green-500 hover:bg-green-600";
    return "bg-purple-500 hover:bg-purple-600";
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <div className="md:col-span-4 space-y-2">
            <Label>Player Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter name..."
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label>Gender</Label>
            <Select
              value={gender}
              onValueChange={(v) => setGender(v as "male" | "female")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-4 space-y-2">
            <div className="flex justify-between">
              <Label>Skill Level: {skill}</Label>
              <span className="text-xs font-medium text-muted-foreground">
                {getSkillLabel(skill)}
              </span>
            </div>
            <Slider
              value={[skill]}
              min={1}
              max={10}
              step={1}
              onValueChange={(v) => setSkill(v[0])}
              className="py-2"
            />
          </div>

          <div className="md:col-span-2 w-full">
            <Button
              onClick={handleAddPlayer}
              className="w-full"
              disabled={!name.trim()}
            >
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {players.length === 0 ? (
              <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
                No players added yet.
              </div>
            ) : (
              players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{player.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="capitalize">{player.gender}</span>
                      <span>•</span>
                      <Badge
                        className={getSkillColor(player.skillLevel)}
                        variant="secondary"
                      >
                        {player.skillLevel}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePlayer(player.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Skill</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No players added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  players.map((player, index) => (
                    <TableRow key={player.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {player.name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {player.gender}
                      </TableCell>
                      <TableCell>
                        <Badge className={getSkillColor(player.skillLevel)}>
                          {player.skillLevel} -{" "}
                          {getSkillLabel(player.skillLevel).split(" ")[0]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePlayer(player.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-4 md:flex-row md:justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full md:w-auto"
          >
            Back
          </Button>
          <div className="flex flex-col gap-3 md:flex-row md:gap-2">
            <Button variant="secondary" className="gap-2 w-full md:w-auto">
              <Users className="w-4 h-4" /> Load Sample Data
            </Button>
            <Button
              onClick={onNext}
              disabled={players.length < 2}
              className="w-full md:w-auto"
            >
              Next: Pairing
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
