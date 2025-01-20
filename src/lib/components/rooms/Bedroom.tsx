import Room from "../Room";
import { RoomInfo, RoomLayout } from "@/lib/utils/room";
import Interactable from "../Interactable";

const BedroomComponent = () => (
  <Room children={[<Interactable key="book" />]} />
);

// const BedroomComponent = <Room children={[<Interactable key="book" />]} />

export const BedroomLayout: RoomLayout = { right: "bedroom" };

const Bedroom: RoomInfo = {
  room: BedroomComponent,
  layout: { left: "kitchen" },
};

export default Bedroom;
