"use client";

import { useState } from "react";

import PixiApp from "@/lib/components/game/PixiApp";
import { GameProvider } from "@/lib/components/game/GameProvider";
import StartMenu from "@/lib/components/game-ui/StartMenu";
import Settings from "@/lib/components/game-ui/Settings";
import Controls from "@/lib/components/game-ui/Controls";

type View = "Menu" | "Game" | "Settings" | "Controls";

export default function Game() {
  const [view, setView] = useState("Menu");

  const views: Record<View, React.ReactNode> = {
    Menu: <StartMenu />,
    Game: <PixiApp />,
    Settings: <Settings />,
    Controls: <Controls />,
  };

  return (
    <div className="min-h-screen items-center justify-items-center gap-16 p-4">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <GameProvider>{views[view]}</GameProvider>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6"></footer>
    </div>
  );
}
