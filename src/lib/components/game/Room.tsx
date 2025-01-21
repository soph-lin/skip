import React, { useRef } from "react";
import { Container, Sprite } from "pixi.js";
import { extend } from "@pixi/react";
import { InteractableProps } from "./Interactable";

extend({ Container });

interface RoomProps {
  objects: React.ReactNode[];
}

export default function Room({ objects }: RoomProps) {
  const objectsRefs = useRef<(Sprite | null)[]>([]);

  const enhancedChildren = objects.map((object, index) => {
    if (React.isValidElement<InteractableProps>(object)) {
      return React.cloneElement(object, {
        key: object.key || `object-${index}`,
        ref: (el: Sprite | null) => {
          if (el) {
            objectsRefs.current[index] = el;
          } else {
            objectsRefs.current[index] = null;
          }
        },
      } as InteractableProps);
    }
    return object;
  });

  return <pixiContainer>{enhancedChildren}</pixiContainer>;
}
