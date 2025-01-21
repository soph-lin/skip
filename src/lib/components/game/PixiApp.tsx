"use client";

import { Application, ApplicationRef, extend } from "@pixi/react";
import { Rectangle, Text } from "pixi.js";
import { useState, useEffect, useRef, useMemo, Suspense } from "react";

import { CollisionInfo, isOutOfBounds } from "../../utils/interaction";
import Player from "./Player";
import GameUI from "../game-ui/GameUI";
import Bedroom from "./rooms/Bedroom";
import Kitchen from "./rooms/Kitchen";

extend({ Text });

const LoadingText = () => <pixiText />;
const preventChangeRoom = true;

export default function PixiApp() {
  const appRef = useRef<ApplicationRef | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const canChangeRoom = useRef(true);
  const [initialPlayerPosition, setInitialPlayerPosition] = useState({
    x: 150,
    y: 150,
  });

  const rooms = {
    bedroom: Bedroom,
    kitchen: Kitchen,
  };

  type RoomKey = keyof typeof rooms;

  // const { currentRoom, setCurrentRoom } = useGame();

  // const [currentRoom, setCurrentRoom] = useState<string>(window.currentRoom || "bedroom");
  // // useState<RoomKey>("bedroom");
  const currentRoom = useRef<RoomKey>("bedroom");

  const CurrentRoomComponent = useMemo(
    () => rooms[currentRoom.current].room,
    [currentRoom]
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (!canChangeRoom.current) {
      setIsLoaded(false);
      const timer = setTimeout(() => {
        setIsLoaded(true);
        canChangeRoom.current = true;
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentRoom]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (currentRoom.current === "bedroom") currentRoom.current = "kitchen";
      else currentRoom.current = "bedroom";
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handlePlayerMove = (playerBounds: CollisionInfo) => {
    if (!canChangeRoom || preventChangeRoom) return;
    const app = appRef.current?.getApplication();
    if (app) {
      const appBounds = app.screen;
      const outDir = isOutOfBounds(playerBounds, appBounds);
      const layout = rooms[currentRoom.current].layout;
      if (outDir && layout && outDir in layout) {
        const newRoom = layout[outDir];
        if (newRoom && newRoom in rooms) {
          repositionPlayerInNewRoom(outDir, playerBounds, appBounds);
          currentRoom.current = newRoom as RoomKey;
          canChangeRoom.current = false;
        }
      }
    }
  };

  useEffect(() => {
    const onPlayerMove = (e: MessageEvent) => {
      handlePlayerMove(e.data.playerBounds);
    };
    window.addEventListener("playerMove", onPlayerMove as EventListener);
  }, []);

  const repositionPlayerInNewRoom = (
    outDir: "left" | "right" | "up" | "down",
    playerBounds: CollisionInfo,
    appBounds: Rectangle
  ) => {
    const newPosition = { x: playerBounds.x, y: playerBounds.y };
    const offset = 200;
    if (outDir === "left") newPosition.x = appBounds.width - offset;
    else if (outDir === "right") newPosition.x = offset;
    else if (outDir === "up") newPosition.y = appBounds.height - offset;
    else if (outDir === "down") newPosition.y = offset;
    setInitialPlayerPosition(newPosition);
  };

  return (
    <div className="relative w-full h-full">
      {isLoaded && <GameUI />}
      <Application
        ref={appRef}
        width={800}
        height={500}
        autoStart
        sharedTicker
        backgroundColor={"white"}
        onInit={() => setIsLoaded(true)}
      >
        <Suspense fallback={<LoadingText />}>
          <Player initialPosition={initialPlayerPosition} />
          <CurrentRoomComponent />
        </Suspense>
      </Application>
    </div>
  );
}
