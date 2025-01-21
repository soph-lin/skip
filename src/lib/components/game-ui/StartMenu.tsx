import Menu from "./Menu";
import { GameView } from "../game/Game";

interface StartMenuProps {
  setView: (view: GameView) => void;
}

export default function StartMenu({ setView }: StartMenuProps) {
  const handleSelect = (view: GameView) => setView(view);

  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <div className="w-1/2">
        <Menu
          title="Skip"
          options={["Play", "Settings", "Controls"]}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
