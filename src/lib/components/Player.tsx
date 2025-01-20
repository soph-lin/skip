import { useState, useEffect, useRef, useCallback } from "react";
import { useSuspenseAssets, extend } from "@pixi/react";
import { AnimatedSprite, Container } from "pixi.js";
import playerIdle1 from "@/assets/player-idle-1.png";
import playerIdle2 from "@/assets/player-idle-2.png";
import playerIdle3 from "@/assets/player-idle-3.png";
import { CollisionInfo } from "../utils/interaction";

extend({ Container, AnimatedSprite });

interface PlayerProps {
  initialPosition: { x: number; y: number };
}

export default function Player({ initialPosition }: PlayerProps) {
  const playerTextures = useSuspenseAssets([
    playerIdle1,
    playerIdle2,
    playerIdle3,
  ]);
  const [position, setPosition] = useState(initialPosition);
  const width = 800;
  const height = 800;
  const initialScale = { x: 0.15, y: 0.15 };
  const [scale, setScale] = useState(initialScale);
  const speed = 10;

  // Key bindings
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setPosition((prev) => {
      switch (event.key) {
        case "w": // Move up
          return { ...prev, y: prev.y - speed };
        case "a": // Move left
          setScale((prevScale) => ({
            ...prevScale,
            x: -Math.abs(prevScale.x),
          }));
          return { ...prev, x: prev.x - speed };
        case "s": // Move down
          return { ...prev, y: prev.y + speed };
        case "d": // Move right
          setScale((prevScale) => ({ ...prevScale, x: Math.abs(prevScale.x) }));
          return { ...prev, x: prev.x + speed };
        default:
          return prev;
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Movement dispatching
  useEffect(() => {
    const playerBounds = {
      x: position.x,
      y: position.y,
      width: Math.abs(width * scale.x),
      height: Math.abs(height * scale.y),
    };
    const playerMovementEvent = new MessageEvent<{
      playerBounds: CollisionInfo;
    }>("playerMove", { data: { playerBounds } });
    window.dispatchEvent(playerMovementEvent);
  }, [position]);

  // External position update
  useEffect(() => {
    console.log("updated player position", initialPosition);
    setPosition(initialPosition);
  }, [initialPosition]);

  // Animation
  const playerRef = useRef<AnimatedSprite>(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.animationSpeed = 0.05;
      playerRef.current.gotoAndPlay(0);
    }
  }, [playerTextures]);

  // Content
  return (
    <pixiContainer>
      <pixiAnimatedSprite
        ref={playerRef}
        eventMode="dynamic"
        textures={playerTextures}
        x={position.x}
        y={position.y}
        scale={scale}
        anchor={0.5}
      />
    </pixiContainer>
  );
}
