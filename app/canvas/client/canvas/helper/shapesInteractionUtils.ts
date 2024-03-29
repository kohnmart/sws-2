import { IShape } from '../../types/shape.js';

const checkLineIntersection = (
  x: number,
  y: number,
  from: { x: number; y: number },
  to: { x: number; y: number }
) => {
  const { x: start_x, y: start_y } = from;
  const { x: end_x, y: end_y } = to;

  const crossProduct =
    (x - start_x) * (end_y - start_y) - (y - start_y) * (end_x - start_x);

  if (Math.abs(crossProduct) < 1500) {
    if (
      Math.min(start_x, end_x) <= x &&
      x <= Math.max(start_x, end_x) &&
      Math.min(start_y, end_y) <= y &&
      y <= Math.max(start_y, end_y)
    ) {
      return true;
    }
  }

  return false;
};

const checkPointInRectangle = (
  x: number,
  y: number,
  from: { x: number; y: number },
  to: { x: number; y: number }
) => {
  const { x: start_x, y: start_y } = from;
  const { x: end_x, y: end_y } = to;

  const distanceToLeft = Math.abs(x - start_x);
  const distanceToRight = Math.abs(x - end_x);
  const distanceToTop = Math.abs(y - start_y);
  const distanceToBottom = Math.abs(y - end_y);

  if (
    distanceToLeft <= Math.abs(end_x - start_x) &&
    distanceToRight <= Math.abs(end_x - start_x) &&
    distanceToTop <= Math.abs(end_y - start_y) &&
    distanceToBottom <= Math.abs(end_y - start_y)
  ) {
    return true;
  }

  return false;
};

const checkPointInTriangle = (
  x: number,
  y: number,
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
) => {
  const alpha =
    ((p2.y - p3.y) * (x - p3.x) + (p3.x - p2.x) * (y - p3.y)) /
    ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
  const beta =
    ((p3.y - p1.y) * (x - p3.x) + (p1.x - p3.x) * (y - p3.y)) /
    ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
  const gamma = 1 - alpha - beta;

  if (alpha >= 0 && beta >= 0 && gamma >= 0) {
    return true;
  }

  return false;
};

const checkPointInCircle = (
  x: number,
  y: number,
  center: { x: number; y: number },
  radius: number
) => {
  const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);

  if (distance <= radius) {
    return true;
  }

  return false;
};

const checkShapeColorsConsistency = (
  shapes: {
    [p: number]: IShape;
  },
  list: string[],
  bg: string,
  str: string
): boolean[] => {
  const val = [false, false];
  list.forEach((id) => {
    if (shapes[id].backgroundColorKey !== bg && val[0] != true) {
      val[0] = true;
    }
    if (shapes[id].strokeColorKey !== str && val[1] != true) {
      val[1] = true;
    }
  });
  return val;
};

export default {
  checkLineIntersection,
  checkPointInCircle,
  checkPointInRectangle,
  checkPointInTriangle,
  checkShapeColorsConsistency,
};

export {
  checkLineIntersection,
  checkPointInCircle,
  checkPointInRectangle,
  checkPointInTriangle,
  checkShapeColorsConsistency,
};
