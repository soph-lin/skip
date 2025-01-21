import Room from "../Room";
import { RoomInfo } from "@/lib/utils/room";
import Interactable from "../Interactable";
import bookSprite from "@/assets/book.png";
import guitarSprite from "@/assets/guitar.png";

const BedroomComponent = () => (
  <Room
    objects={[
      <Interactable
        key="book"
        dialogueName="book"
        textureSrc={bookSprite}
        x={30}
        y={50}
      />,
      <Interactable
        key="guitar"
        dialogueName="guitar"
        textureSrc={guitarSprite}
        x={650}
        y={200}
      />,
    ]}
  />
);

const Bedroom: RoomInfo = {
  room: BedroomComponent,
  layout: { left: "kitchen" },
};

export default Bedroom;
