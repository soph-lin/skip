"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

import { Rectangle } from "pixi.js";
import { useApplication } from "@pixi/react";
import { CollisionInfo, isOutOfBounds } from "../utils/interaction";
import { RoomName, MasterRoomLayout } from "../utils/room";

interface RoomContextType {
  currentRoom: string;
  setCurrentRoom: Dispatch<SetStateAction<RoomName>>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoom] = useState<RoomName>("bedroom");
  const [initialPlayerPosition, setInitialPlayerPosition] = useState({
    x: 150,
    y: 150,
  });
  // const { app } = useApplication();
  // type RoomKey = "bedroom" | "kitchen";

  // const handlePlayerMove = (playerBounds: CollisionInfo) => {
  //   if (app) {
  //     const appBounds = app.screen;
  //     const outDir = isOutOfBounds(playerBounds, appBounds);
  //     console.log("current room move", currentRoom);
  //     console.log("out of bounds", outDir);
  //     if (outDir && outDir in MasterRoomLayout[currentRoom]) {
  //       const newRoom = MasterRoomLayout[currentRoom][outDir];
  //       if (newRoom) {
  //         repositionPlayerInNewRoom(outDir, playerBounds, appBounds);
  //         setCurrentRoom(newRoom as RoomKey);
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("playerMove" as any, (e: MessageEvent) => {
  //     handlePlayerMove(e.data.playerBounds);
  //   });
  // }, []);

  // const repositionPlayerInNewRoom = (
  //   outDir: "left" | "right" | "up" | "down",
  //   playerBounds: CollisionInfo,
  //   appBounds: Rectangle
  // ) => {
  //   let newPosition = { x: playerBounds.x, y: playerBounds.y };
  //   const offset = 200;
  //   if (outDir === "left") newPosition.x = appBounds.width - offset;
  //   else if (outDir === "right") newPosition.x = offset;
  //   else if (outDir === "up") newPosition.y = appBounds.height - offset;
  //   else if (outDir === "down") newPosition.y = offset;
  //   setInitialPlayerPosition(newPosition);
  // };

  return (
    <RoomContext.Provider value={{ currentRoom, setCurrentRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }

  return context;
};
