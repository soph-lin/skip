"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import { RoomName } from "../utils/room";

interface GameContextType {
  completedTutorial: boolean;
  setCompletedTutorial: Dispatch<SetStateAction<boolean>>;
  currentRoom: string;
  setCurrentRoom: Dispatch<SetStateAction<RoomName>>;
  currentEnergy: number;
  setCurrentEnergy: Dispatch<SetStateAction<number>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [completedTutorial, setCompletedTutorial] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomName>("bedroom");
  const [currentEnergy, setCurrentEnergy] = useState(50);

  return (
    <GameContext.Provider
      value={{
        completedTutorial,
        setCompletedTutorial,
        currentRoom,
        setCurrentRoom,
        currentEnergy,
        setCurrentEnergy,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }

  return context;
};
