import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type TournamentConfig, type TournamentType } from "@/types";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface SetupFormProps {
  onComplete: (config: TournamentConfig) => void;
  initialConfig?: Partial<TournamentConfig>;
}

export function SetupForm({ onComplete, initialConfig }: SetupFormProps) {
  const [name, setName] = useState(initialConfig?.name || "");
  const [type, setType] = useState<TournamentType>(
    initialConfig?.type || "mens_doubles"
  );
  const [sets, setSets] = useState(initialConfig?.sets || 3);
  const [points, setPoints] = useState(initialConfig?.pointsPerSet || 21);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onComplete({
      name,
      type,
      sets,
      pointsPerSet: points,
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="t-name">Tournament Name</Label>
          <Input
            id="t-name"
            placeholder="e.g. Winter Badminton Championship 2024"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tournament Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as TournamentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mens_singles">Men's Singles</SelectItem>
                <SelectItem value="womens_singles">Women's Singles</SelectItem>
                <SelectItem value="mens_doubles">Men's Doubles</SelectItem>
                <SelectItem value="womens_doubles">Women's Doubles</SelectItem>
                <SelectItem value="mixed_doubles">Mixed Doubles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Points per Set ({points})</Label>
            <Select
              value={points.toString()}
              onValueChange={(v) => setPoints(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Points" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="11">11 Points</SelectItem>
                <SelectItem value="15">15 Points</SelectItem>
                <SelectItem value="21">21 Points</SelectItem>
                <SelectItem value="30">30 Points</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Number of Sets ({sets})</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[sets]}
              min={1}
              max={5}
              step={2}
              onValueChange={(vals) => setSets(vals[0])}
              className="flex-1"
            />
            <span className="font-bold text-lg w-8 text-center">{sets}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Best of {sets} (First to reach {Math.ceil(sets / 2)} match wins)
          </p>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={handleSubmit} size="lg" className="w-full md:w-auto">
            Next: Player Registration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
