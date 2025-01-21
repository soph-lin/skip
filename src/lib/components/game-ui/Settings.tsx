import Modal from "../ui/Modal";
import { useState } from "react";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [sfxVolume, setSfxVolume] = useState(50); // Default volume level is 50

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSfxVolume(Number(event.target.value));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {/* Settings Title */}
        <h2 className="text-2xl font-bold mb-4">Settings</h2>

        {/* SFX Volume Slider */}
        <div className="mb-6">
          <label
            htmlFor="sfx-slider"
            className="block text-lg font-medium text-foreground mb-2"
          >
            SFX Volume: {sfxVolume}%
          </label>
          <input
            id="sfx-slider"
            type="range"
            min="0"
            max="100"
            value={sfxVolume}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </Modal>
  );
}
