import React from "react";

export interface RoomLayout {
  up?: string;
  down?: string;
  left?: string;
  right?: string;
}

export interface RoomInfo {
  room: () => React.JSX.Element; // room: React.ReactNode;
  layout: RoomLayout;
}

export type RoomName = "bedroom" | "kitchen";

export const MasterRoomLayout: Record<RoomName, RoomLayout> = {
    "bedroom": {left: "kitchen"},
    "kitchen": {right: "bedroom"}
}