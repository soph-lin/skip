import { useGame } from "../game/GameProvider";

export default function HUD() {
  const { currentEnergy } = useGame();
  return (
    <div className="w-full flex flex-row p-2 text-xl">
      <div className="ml-auto">{currentEnergy} 🍀</div>
    </div>
  );
}
