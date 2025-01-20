"use client";

import { Application, ApplicationRef, extend } from "@pixi/react";
import { Rectangle, Text } from "pixi.js";
import { useState, useEffect, useRef, useMemo, Suspense } from "react";

import { CollisionInfo, isOutOfBounds } from "../utils/interaction";
import Player from "./Player";
import GameUI from "./GameUI";
import Bedroom from "./rooms/Bedroom";
import Kitchen from "./rooms/Kitchen";
import { useRoom } from "./RoomProvider";

extend({ Text });

const LoadingText = () => <pixiText />;

export default function PixiApp() {
  const appRef = useRef<ApplicationRef | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [canChangeRoom, setCanChangeRoom] = useState(true);
  const [initialPlayerPosition, setInitialPlayerPosition] = useState({
    x: 150,
    y: 150,
  });

  const rooms = {
    bedroom: Bedroom,
    kitchen: Kitchen,
  };

  type RoomKey = keyof typeof rooms;

  const { currentRoom, setCurrentRoom } = useRoom();

  // const [currentRoom, setCurrentRoom] = useState<string>(window.currentRoom || "bedroom");
  // // useState<RoomKey>("bedroom");
  // const currentRoom = useRef<RoomKey>("bedroom");

  const CurrentRoomComponent = useMemo(
    () => rooms[currentRoom as RoomKey].room,
    [currentRoom]
  );

  console.log("current room", currentRoom);
  // const [renderTrigger, setRenderTrigger] = useState(0);
  // const forceRender = () => {
  //   setRenderTrigger((prev) => prev + 1);
  // };

  useEffect(() => {
    if (!isLoaded) return;
    console.log("updated room", currentRoom);
    if (!canChangeRoom) {
      const timer = setTimeout(() => {
        setCanChangeRoom(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentRoom]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (currentRoom === "bedroom") setCurrentRoom("kitchen");
      else setCurrentRoom("bedroom");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handlePlayerMove = (playerBounds: CollisionInfo) => {
    if (!canChangeRoom) {
      console.log("can't change room");
      return;
    }
    const app = appRef.current?.getApplication();
    if (app) {
      const appBounds = app.screen;
      const outDir = isOutOfBounds(playerBounds, appBounds);
      const layout = rooms[currentRoom as RoomKey].layout;
      // console.log("current room move", currentRoom);
      // console.log("out of bounds", outDir);
      // console.log("layout", layout);
      // console.log("outDir in layout", outDir && outDir in layout);
      if (outDir && layout && outDir in layout) {
        const newRoom = layout[outDir];
        if (newRoom && newRoom in rooms) {
          repositionPlayerInNewRoom(outDir, playerBounds, appBounds);
          setCurrentRoom(newRoom as RoomKey);
          setCanChangeRoom(false);
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
