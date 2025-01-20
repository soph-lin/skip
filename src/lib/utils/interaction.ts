import { Container } from "pixi.js";

export type CollisionInfo = {
  x: number;
  y: number;
  width: number,
  height: number;
  anchor?: number;
}

export function isColliding(object1: Container | CollisionInfo, object2: Container | CollisionInfo) { 
    const bounds1 = (object1 instanceof Container)? object1.getBounds() : object1;
    const bounds2 = (object2 instanceof Container)? object2.getBounds() : object2;
  
    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
}

// Currently only customized for player object, whose anchor is 0.5, hence object size is halved.
// Returns string for direction, NOT boolean.
export function isOutOfBounds(object: Container | CollisionInfo, bounds: Container | CollisionInfo) {
  const objectBounds = object instanceof Container ? object.getBounds() : object;
  const containerBounds = bounds instanceof Container ? bounds.getBounds() : bounds;

  if (objectBounds.x - objectBounds.width/2 < containerBounds.x) {
    return "left";
  } else if (objectBounds.x > containerBounds.x + containerBounds.width) {
    return "right";
  } else if (objectBounds.y + objectBounds.height/2 < containerBounds.y) {
    return "up";
  } else if (objectBounds.y > containerBounds.y + containerBounds.height) {
    return "down";
  } else {
    return false;
  }
}