/**
 * Euler rotation sequences.
 *
 * The three elemental rotations may be extrinsic (rotations about the axes xyz of the original
 * coordinate system, which is assumed to remain motionless), or intrinsic (rotations about the
 * axes of the rotating coordinate system XYZ, solidary with the moving body, which changes its
 * orientation after each elemental rotation).
 *
 * ```ts
 * const i = Math.PI / 2;
 * const j = Math.PI / 4;
 * const k = Math.PI / 8;
 * const mIntrinsic = Mat3.fromRotationX(i).mul(Mat3.fromRotationY(j)).mul(Mat3.fromRotationZ(k));
 * const nIntrinsic = Mat3.fromEuler(EulerRot.XYZ, i, j, k);
 * console.assert(mIntrinsic.absDiffEq(nIntrinsic, 2e-6));
 *
 * const mExtrinsic = Mat3.fromRotationZ(k).mul(Mat3.fromRotationY(j)).mul(Mat3.fromRotationX(i));
 * const nExtrinsic = Mat3.fromEuler(EulerRot.XYZEx, i, j, k);
 * console.assert(mExtrinsic.absDiffEq(nExtrinsic, 2e-6));
 * ```
 *
 * The default rotation order is `EulerRot.YXZ`, as yaw (y-axis), pitch (x-axis), roll (z-axis).
 */
export const EulerRot = {
  /** Intrinsic three-axis rotation ZYX */
  ZYX: "ZYX",
  /** Intrinsic three-axis rotation ZXY */
  ZXY: "ZXY",
  /** Intrinsic three-axis rotation YXZ */
  YXZ: "YXZ",
  /** Intrinsic three-axis rotation YZX */
  YZX: "YZX",
  /** Intrinsic three-axis rotation XYZ */
  XYZ: "XYZ",
  /** Intrinsic three-axis rotation XZY */
  XZY: "XZY",
  /** Intrinsic two-axis rotation ZYZ */
  ZYZ: "ZYZ",
  /** Intrinsic two-axis rotation ZXZ */
  ZXZ: "ZXZ",
  /** Intrinsic two-axis rotation YXY */
  YXY: "YXY",
  /** Intrinsic two-axis rotation YZY */
  YZY: "YZY",
  /** Intrinsic two-axis rotation XYX */
  XYX: "XYX",
  /** Intrinsic two-axis rotation XZX */
  XZX: "XZX",
  /** Extrinsic three-axis rotation ZYX */
  ZYXEx: "ZYXEx",
  /** Extrinsic three-axis rotation ZXY */
  ZXYEx: "ZXYEx",
  /** Extrinsic three-axis rotation YXZ */
  YXZEx: "YXZEx",
  /** Extrinsic three-axis rotation YZX */
  YZXEx: "YZXEx",
  /** Extrinsic three-axis rotation XYZ */
  XYZEx: "XYZEx",
  /** Extrinsic three-axis rotation XZY */
  XZYEx: "XZYEx",
  /** Extrinsic two-axis rotation ZYZ */
  ZYZEx: "ZYZEx",
  /** Extrinsic two-axis rotation ZXZ */
  ZXZEx: "ZXZEx",
  /** Extrinsic two-axis rotation YXY */
  YXYEx: "YXYEx",
  /** Extrinsic two-axis rotation YZY */
  YZYEx: "YZYEx",
  /** Extrinsic two-axis rotation XYX */
  XYXEx: "XYXEx",
  /** Extrinsic two-axis rotation XZX */
  XZXEx: "XZXEx",
} as const;

export type EulerRot = (typeof EulerRot)[keyof typeof EulerRot];
