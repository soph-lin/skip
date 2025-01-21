"use client";

import { useState } from "react";

import PixiApp from "@/lib/components/game/PixiApp";
import { GameProvider } from "@/lib/components/game/GameProvider";
import StartMenu from "@/lib/components/game-ui/StartMenu";
import Settings from "@/lib/components/game-ui/Settings";
import Controls from "@/lib/components/game-ui/Controls";

export type GameView = "Menu" | "Play" | "Settings" | "Controls";

export default function Game() {
  const [view, setView] = useState("Menu");

  const handleSetView = (view: GameView) => setView(view);

  const views: Record<GameView, React.ReactNode> = {
    Menu: <StartMenu setView={handleSetView} />,
    Play: <PixiApp />,
    Settings: <Settings />,
    Controls: <Controls />,
  };

  return (
    <div className="w-[800px] h-[500px] flex item-center justify-center border border-foreground">
      <GameProvider>{views[view]}</GameProvider>
    </div>
  );
}
