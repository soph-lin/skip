import Room from "../Room";
import { RoomInfo, RoomLayout } from "@/lib/utils/room";
import Interactable from "../Interactable";

const BedroomComponent = () => (
  <Room objects={[<Interactable key="book" dialogueName="book" />]} />
);

export const BedroomLayout: RoomLayout = { right: "bedroom" };

const Bedroom: RoomInfo = {
  room: BedroomComponent,
  layout: { left: "kitchen" },
};

export default Bedroom;
