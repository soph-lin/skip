import React, { useRef } from "react";
import { Container, Sprite } from "pixi.js";
import { extend } from "@pixi/react";
import { InteractableProps } from "./Interactable";

extend({ Container });

interface RoomProps {
  children: React.ReactNode[];
}

export default function Room({ children }: RoomProps) {
  const childrenRefs = useRef<Sprite[]>([]);

  const enhancedChildren = children.map((child, index) => {
    if (React.isValidElement<InteractableProps>(child)) {
      return React.cloneElement(child, {
        key: child.key || `object-${index}`,
        ref: (el: Sprite | null) => {
          if (el) {
            childrenRefs.current[index] = el;
          } else {
            childrenRefs.current[index] = null as any;
          }
        },
      } as InteractableProps);
    }
    return child;
  });

  return <pixiContainer>{enhancedChildren}</pixiContainer>;
}
