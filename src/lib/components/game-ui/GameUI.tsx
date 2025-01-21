import DialogueSystem from "./DialogueSystem";
import HUD from "./HUD";

export default function GameUI() {
  return (
    <div className="absolute w-full h-full">
      <div className="relative w-full h-full">
        <div className="absolute top-0 w-full">
          <HUD />
        </div>
        <div className="absolute bottom-0 w-full p-2">
          <DialogueSystem />
        </div>
      </div>
    </div>
  );
}
