import { Vector3 } from "../types";

type EventType = keyof HTMLElementEventMap;
type EventHandler<T extends Event> = (event: T) => void;

export const cameraPositionToVector3 = (
  cameraPosition: CameraPosition
): Vector3 => {
  const y = cameraPosition.radius * Math.sin(cameraPosition.latitude);
  const r = cameraPosition.radius * Math.cos(cameraPosition.latitude);
  const z = r * Math.cos(cameraPosition.longitude);
  const x = r * Math.sin(cameraPosition.longitude);
  return { x, y, z };
};

export type CameraPosition = {
  latitude: number;
  longitude: number;
  radius: number;
};

type Action =
  | {
      type: "orbitRotate";
      deltaLatitude: number;
      deltaLongitude: number;
    }
  | { type: "zoomInAt" }
  | { type: "zoomOutAt" };

const clampLatitude = (latitude: number) => {
  return Math.min(
    Math.max(latitude, -Math.PI / 2.0 + 0.1),
    Math.PI / 2.0 - 0.1
  );
};

const clampLongitude = (longitude: number) => {
  if (longitude > Math.PI) return longitude - Math.PI * 2.0;
  else if (longitude < -Math.PI) return longitude + Math.PI * 2.0;
  else return longitude;
};

const clampRadius = (radius: number) => {
  return Math.min(Math.max(radius, 1), 10);
};

const reducer = (position: CameraPosition, action: Action): CameraPosition => {
  switch (action.type) {
    case "orbitRotate": {
      return {
        ...position,
        latitude: clampLatitude(position.latitude + action.deltaLatitude),
        longitude: clampLongitude(position.longitude + action.deltaLongitude),
      };
    }
    case "zoomInAt": {
      return {
        ...position,
        radius: clampRadius(position.radius - 0.1),
      };
    }
    case "zoomOutAt": {
      return {
        ...position,
        radius: clampRadius(position.radius + 0.1),
      };
    }
    default:
      return position;
  }
};

export class CameraPositionManipulator {
  private pointerPosition = { x: 0, y: 0 };
  eventListeners = new Map<string, EventHandler<Event>>();
  private isMoving = false;

  constructor(
    protected element: HTMLElement,
    private positionProvider: () => CameraPosition,
    private onPositionChange: (newPosition: CameraPosition) => void
  ) {
    this.registerEvent("mousedown", this.onMouseDown);
    this.registerEvent("mousemove", this.onMouseMove);
    this.registerEvent("mouseup", this.onMouseUp);
    this.registerEvent("mouseleave", this.onMouseLeave);
    this.registerEvent("wheel", this.onWheel);
  }

  dispose() {
    this.eventListeners.forEach((value, key) =>
      this.element.removeEventListener(key, value)
    );
  }

  private registerEvent<T extends Event>(
    type: EventType,
    handler: EventHandler<T>
  ) {
    this.element.addEventListener(type, handler);
    this.eventListeners.set(type, handler as EventHandler<Event>);
  }

  private dispatchAction = (action: Action) => {
    const newViewport = reducer(this.positionProvider(), action);
    this.onPositionChange(newViewport);
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      this.pointerPosition = { x: e.offsetX, y: e.offsetY };
      this.isMoving = true;
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.isMoving) {
      const multiplier = 0.01;
      this.dispatchAction({
        type: "orbitRotate",
        deltaLongitude: -(e.offsetX - this.pointerPosition.x) * multiplier,
        deltaLatitude: (e.offsetY - this.pointerPosition.y) * multiplier,
      });
    }

    this.pointerPosition = { x: e.offsetX, y: e.offsetY };
  };

  private onMouseUp = () => {
    this.isMoving = false;
  };

  private onMouseLeave = () => {
    this.isMoving = false;
  };

  private onWheel = (e: WheelEvent) => {
    const action = e.deltaY < 0 ? "zoomInAt" : "zoomOutAt";

    this.dispatchAction({
      type: action,
    });
  };
}
