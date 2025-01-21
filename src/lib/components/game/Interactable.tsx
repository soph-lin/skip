import { useEffect, useRef, useCallback } from "react";

import { extend, PixiReactElementProps, useSuspenseAssets } from "@pixi/react";
import { Sprite } from "pixi.js";
import { isColliding } from "../../utils/interaction";
import { CollisionInfo } from "../../utils/interaction";

extend({ Sprite });

export interface InteractableProps
  extends PixiReactElementProps<typeof Sprite> {
  key: string;
  textureSrc?: string;
  dialogueName?: string;
  onTouch?: () => void;
  onInteract?: () => void;
}

export default function Interactable({
  dialogueName = "",
  textureSrc = "https://images.vexels.com/media/users/3/324278/isolated/preview/36957dab47f399e7db3b7c7129de6d20-book-icon-in-pink-color.png",
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  onTouch,
  onInteract,
  ...spriteProps
}: InteractableProps) {
  const objectRef = useRef<Sprite>(null);
  const myCollisionInfo = { x, y, width, height };
  const [texture] = useSuspenseAssets([textureSrc]);
  const touchingPlayer = useRef(false);
  // const [touchingPlayer, setTouchingPlayer] = useState(false);

  const handleOnTouch = () => {
    console.log("Player touched object!");
    onTouch?.();
  };

  const handleOnInteract = () => {
    console.log("Player interacted with object!");
    if (dialogueName) handleSetDialogue();
    onInteract?.();
  };

  const handleCollision = (playerBounds: CollisionInfo) => {
    if (playerBounds && isColliding(playerBounds, myCollisionInfo)) {
      handleOnTouch();
      touchingPlayer.current = true;
    } else {
      touchingPlayer.current = false;
    }
  };

  const handleSetDialogue = () => {
    const setDialogueEvent = new MessageEvent("setDialogue", {
      data: { name: dialogueName },
    });
    window.dispatchEvent(setDialogueEvent);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "z" && touchingPlayer.current) handleOnInteract();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const handlePlayerMove = (
      e: MessageEvent<{ playerBounds: CollisionInfo }>
    ) => {
      handleCollision(e.data.playerBounds);
    };

    window.addEventListener("playerMove", handlePlayerMove as EventListener);

    return () => {
      window.removeEventListener(
        "playerMove",
        handlePlayerMove as EventListener
      );
    };
  }, []);

  return (
    <pixiSprite
      ref={objectRef}
      eventMode="dynamic"
      x={x}
      y={y}
      width={width}
      height={height}
      interactive={true}
      texture={texture}
      {...spriteProps}
    />
  );
}
