import { EulerRot, Mat3, Mat4, Quat } from "@";

const E_EPS = 1e-8;
const STEP = 15;

const AXIS_ORDERS: Record<EulerRot, [number, number, number]> = {
  XYZ: [0, 1, 2],
  XYX: [0, 1, 0],
  XZY: [0, 2, 1],
  XZX: [0, 2, 0],
  YZX: [1, 2, 0],
  YZY: [1, 2, 1],
  YXZ: [1, 0, 2],
  YXY: [1, 0, 1],
  ZXY: [2, 0, 1],
  ZXZ: [2, 0, 2],
  ZYX: [2, 1, 0],
  ZYZ: [2, 1, 2],
  ZYXEx: [2, 1, 0],
  XYXEx: [0, 1, 0],
  YZXEx: [1, 2, 0],
  XZXEx: [0, 2, 0],
  XZYEx: [0, 2, 1],
  YZYEx: [1, 2, 1],
  ZXYEx: [2, 0, 1],
  YXYEx: [1, 0, 1],
  YXZEx: [1, 0, 2],
  ZXZEx: [2, 0, 2],
  XYZEx: [0, 1, 2],
  ZYZEx: [2, 1, 2],
};

const ORDERS: EulerRot[] = [
  EulerRot.XYZ,
  EulerRot.XZY,
  EulerRot.YZX,
  EulerRot.YXZ,
  EulerRot.ZXY,
  EulerRot.ZYX,
  EulerRot.XZX,
  EulerRot.XYX,
  EulerRot.YXY,
  EulerRot.YZY,
  EulerRot.ZYZ,
  EulerRot.ZXZ,
  EulerRot.XYZEx,
  EulerRot.XZYEx,
  EulerRot.YZXEx,
  EulerRot.YXZEx,
  EulerRot.ZXYEx,
  EulerRot.ZYXEx,
  EulerRot.XZXEx,
  EulerRot.XYXEx,
  EulerRot.YXYEx,
  EulerRot.YZYEx,
  EulerRot.ZYZEx,
  EulerRot.ZXZEx,
];

const ANGLES = Array.from({ length: 360 / STEP + 1 }, (_, index) => -180 + index * STEP);

type Rotations<T> = [(angle: number) => T, (angle: number) => T, (angle: number) => T];

function deg(angle: number) {
  return (angle * Math.PI) / 180;
}

function forEachAngle(check: (angles: [number, number, number]) => void) {
  for (const i of ANGLES) {
    for (const j of ANGLES) {
      for (const k of ANGLES) {
        check([deg(i), deg(j), deg(k)]);
      }
    }
  }
}

function axisAngle<T>(rotations: Rotations<T>, axis: number, angle: number) {
  const rotation = rotations[axis];

  if (rotation === undefined) {
    throw new RangeError("axis out of range");
  }

  return rotation(angle);
}

function composed<T extends { mul: (rhs: T) => T }>(
  order: EulerRot,
  rotations: Rotations<T>,
  [a, b, c]: [number, number, number],
) {
  const [i, j, k] = AXIS_ORDERS[order];

  if (order.endsWith("Ex")) {
    return axisAngle(rotations, k, c)
      .mul(axisAngle(rotations, j, b))
      .mul(axisAngle(rotations, i, a));
  }

  return axisAngle(rotations, i, a)
    .mul(axisAngle(rotations, j, b))
    .mul(axisAngle(rotations, k, c));
}

function canonical(q: Quat) {
  if (q.w >= 1e-5) {
    return q;
  }

  if (q.w <= -1e-5) {
    return q.neg();
  }

  return Quat.fromXyzw(0, 0, 0, 1);
}

function maxDiff(a: ArrayLike<number>, b: ArrayLike<number>) {
  return Math.max(...Array.from(a, (value, index) => Math.abs(value - (b[index] ?? Number.NaN))));
}

describe("euler", () => {
  test("variants", () => {
    expect(Object.keys(EulerRot)).toHaveLength(24);
    expect(Object.keys(EulerRot)).toStrictEqual(Object.values(EulerRot));
  });

  test.each(ORDERS)("quat %s", (order) => {
    let worst = 0;

    forEachAngle((angles) => {
      const m = canonical(Quat.fromEuler(order, ...angles));
      const n = canonical(Quat.fromEuler(order, ...m.toEuler(order)));

      const o = canonical(
        composed(order, [Quat.fromRotationX, Quat.fromRotationY, Quat.fromRotationZ], angles),
      );

      worst = Math.max(worst, maxDiff(m.toArray(), n.toArray()), maxDiff(m.toArray(), o.toArray()));
    });

    expect(worst).toBeLessThanOrEqual(E_EPS);
  });

  test.each(ORDERS)("mat3 %s", (order) => {
    let worst = 0;

    forEachAngle((angles) => {
      const m = Mat3.fromEuler(order, ...angles);
      const n = Mat3.fromEuler(order, ...m.toEuler(order));

      const o = composed(
        order,
        [Mat3.fromRotationX, Mat3.fromRotationY, Mat3.fromRotationZ],
        angles,
      );

      worst = Math.max(
        worst,
        maxDiff(m.toColsArray(), n.toColsArray()),
        maxDiff(m.toColsArray(), o.toColsArray()),
      );
    });

    expect(worst).toBeLessThanOrEqual(E_EPS);
  });

  test.each(ORDERS)("mat4 %s", (order) => {
    let worst = 0;

    forEachAngle((angles) => {
      const m = Mat4.fromEuler(order, ...angles);
      const n = Mat4.fromEuler(order, ...m.toEuler(order));

      const o = composed(
        order,
        [Mat4.fromRotationX, Mat4.fromRotationY, Mat4.fromRotationZ],
        angles,
      );

      worst = Math.max(
        worst,
        maxDiff(m.toColsArray(), n.toColsArray()),
        maxDiff(m.toColsArray(), o.toColsArray()),
      );
    });

    expect(worst).toBeLessThanOrEqual(E_EPS);
  });
});
