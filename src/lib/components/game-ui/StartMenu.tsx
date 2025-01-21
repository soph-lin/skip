import { useState } from "react";
import Menu from "./Menu";
import Settings from "./Settings";
import Controls from "./Controls";

interface StartMenuProps {
  setRunGame: () => void;
}

type MenuView = "Menu" | "Settings" | "Controls";

export default function StartMenu({ setRunGame }: StartMenuProps) {
  const [menuView, setMenuView] = useState<MenuView>("Menu");

  const handleSelect = (view: string) => {
    if (view === "Play") setRunGame();
    else setMenuView(view as MenuView);
  };

  const closeModal = () => setMenuView("Menu");

  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <div className="w-1/2">
        <Menu
          title="Skip"
          options={["Play", "Settings", "Controls"]}
          onSelect={handleSelect}
        />
        <Settings isOpen={menuView === "Settings"} onClose={closeModal} />
        <Controls isOpen={menuView === "Controls"} onClose={closeModal} />
      </div>
    </div>
  );
}
