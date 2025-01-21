"use client";

import { useState } from "react";

import PixiApp from "@/lib/components/game/PixiApp";
import { GameProvider } from "@/lib/components/game/GameProvider";
import StartMenu from "@/lib/components/game-ui/StartMenu";

export default function Game() {
  const [runGame, setRunGame] = useState(false);

  const handleSetRunGame = () => setRunGame(true);

  const Menu = <StartMenu setRunGame={handleSetRunGame} />;
  const Game = <PixiApp />;

  return (
    <div className="w-[800px] h-[500px] flex item-center justify-center border border-foreground">
      <GameProvider>{runGame ? Game : Menu}</GameProvider>
    </div>
  );
}
