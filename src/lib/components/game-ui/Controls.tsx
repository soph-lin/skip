import Modal from "../ui/Modal";

interface ControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Controls({ isOpen, onClose }: ControlsProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Controls</h2>
        <ul className="space-y-2 text-lg">
          <li>
            <span className="font-semibold">W A S D:</span> Movement
          </li>
          <li>
            <span className="font-semibold">Z:</span> Interact
          </li>
          <li>
            <span className="font-semibold">Space:</span> Next dialogue / Skip
            to dialogue line end
          </li>
        </ul>
      </div>
    </Modal>
  );
}
