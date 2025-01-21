import Room from "../Room";
import { RoomInfo } from "@/lib/utils/room";
import Interactable from "../Interactable";

const KitchenComponent = () => (
  <Room
    key="kitchen"
    objects={[
      <Interactable
        key="cat"
        textureSrc="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-playful-kitten-kitty-cute-cat-smile-png-image_10263743.png"
      />,
    ]}
  />
);

const Kitchen: RoomInfo = {
  room: KitchenComponent,
  layout: { right: "bedroom" },
};

export default Kitchen;
