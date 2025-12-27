import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { SetupForm } from "./SetupForm";
import { PlayerRegistration } from "./PlayerRegistration";
import { PairingScreen } from "./PairingScreen";
import { BracketView } from "./BracketView";
import { type Player, type Team, type TournamentConfig } from "@/types";

export function TournamentWizard() {
  const [activeTab, setActiveTab] = useState("setup");
  const [config, setConfig] = useState<TournamentConfig | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const handleSetupComplete = (newConfig: TournamentConfig) => {
    setConfig(newConfig);
    setActiveTab("players");
  };

  const handlePlayersNext = () => {
    setActiveTab("pairing");
  };

  const handlePairingNext = (pairs: Team[]) => {
    setTeams(pairs);
    setActiveTab("bracket");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Badminton Tournament Manager
          </CardTitle>
          {config && (
            <p className="text-muted-foreground">
              {config.name} ({config.type.replace("_", " ")})
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="overflow-x-auto pb-2 -mx-4 px-4 md:overflow-visible md:pb-0 md:px-0">
              <TabsList className="w-full inline-flex md:grid md:grid-cols-4 h-auto min-w-max md:min-w-0">
                <TabsTrigger value="setup" disabled={false} className="py-2.5">
                  Setup
                </TabsTrigger>
                <TabsTrigger
                  value="players"
                  disabled={!config}
                  className="py-2.5"
                >
                  Players
                </TabsTrigger>
                <TabsTrigger
                  value="pairing"
                  disabled={!config || players.length < 2}
                  className="py-2.5"
                >
                  Pairing
                </TabsTrigger>
                <TabsTrigger
                  value="bracket"
                  disabled={!config || teams.length < 2}
                  className="py-2.5"
                >
                  Bracket
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="setup" className="space-y-4">
              <SetupForm
                onComplete={handleSetupComplete}
                initialConfig={config || undefined}
              />
            </TabsContent>

            <TabsContent value="players">
              <PlayerRegistration
                players={players}
                onPlayersChange={setPlayers}
                onNext={handlePlayersNext}
                onBack={() => setActiveTab("setup")}
              />
            </TabsContent>

            <TabsContent value="pairing">
              <PairingScreen
                players={players}
                onPairsConfirmed={handlePairingNext}
                onBack={() => setActiveTab("players")}
              />
            </TabsContent>

            <TabsContent value="bracket">
              {config && <BracketView teams={teams} config={config} />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
