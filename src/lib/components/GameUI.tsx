import DialogueSystem from "./DialogueSystem";

export default function GameUI() {
  return (
    <div className="absolute w-[800px] h-[500px]">
      <div className="relative w-full h-full">
        <div className="absolute bottom-0 w-full p-2">
          <DialogueSystem />
        </div>
      </div>
    </div>
  );
}
