import type { Affine3 } from "./Affine3.js";
import type { EulerRot } from "./EulerRot.js";
import type { Mat4 } from "./Mat4.js";
import type { Vec2 } from "./Vec2.js";
import type { Vec4 } from "./Vec4.js";

import { Mat3 } from "./Mat3.js";
import { Vec3 } from "./Vec3.js";

const EULER_ORDERS = {
  ZYX: [2, 1, 0, false, false, true],
  ZXY: [2, 0, 1, true, false, true],
  YXZ: [1, 0, 2, false, false, true],
  YZX: [1, 2, 0, true, false, true],
  XYZ: [0, 1, 2, true, false, true],
  XZY: [0, 2, 1, false, false, true],
  ZYZ: [2, 1, 0, false, true, true],
  ZXZ: [2, 0, 1, true, true, true],
  YXY: [1, 0, 2, false, true, true],
  YZY: [1, 2, 0, true, true, true],
  XYX: [0, 1, 2, true, true, true],
  XZX: [0, 2, 1, false, true, true],
  ZYXEx: [0, 1, 2, true, false, false],
  ZXYEx: [1, 0, 2, false, false, false],
  YXZEx: [2, 0, 1, true, false, false],
  YZXEx: [0, 2, 1, false, false, false],
  XYZEx: [2, 1, 0, false, false, false],
  XZYEx: [1, 2, 0, true, false, false],
  ZYZEx: [2, 1, 0, false, true, false],
  ZXZEx: [2, 0, 1, true, true, false],
  YXYEx: [1, 0, 2, false, true, false],
  YZYEx: [1, 2, 0, true, true, false],
  XYXEx: [0, 1, 2, true, true, false],
  XZXEx: [0, 2, 1, false, true, false],
} as const satisfies Record<EulerRot, readonly [number, number, number, boolean, boolean, boolean]>;

/**
 * A quaternion representing an orientation.
 *
 * This quaternion is intended to be of unit length but may denormalize due to
 * floating point "error creep" which can occur when successive quaternion
 * operations are applied.
 */
export class Quat {
  declare x: number;
  declare y: number;
  declare z: number;
  declare w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /** The identity quaternion. Corresponds to no rotation. */
  static get IDENTITY() {
    return new Quat(0, 0, 0, 1);
  }

  /** All NANs. */
  static get NAN() {
    return new Quat(Number.NaN, Number.NaN, Number.NaN, Number.NaN);
  }

  static new(x: number, y: number, z: number, w: number): Quat {
    return new Quat(x, y, z, w);
  }

  /**
   * Creates a new rotation quaternion.
   *
   * This should generally not be called manually unless you know what you are doing.
   * Use one of the other constructors instead such as `identity` or `fromAxisAngle`.
   *
   * `fromXyzw` is mostly used by unit tests and `serde` deserialization.
   *
   * # Preconditions
   *
   * This function does not check if the input is normalized, it is up to the user to
   * provide normalized input or to normalized the resulting quaternion.
   */
  static fromXyzw(x: number, y: number, z: number, w: number): Quat {
    return new Quat(x, y, z, w);
  }

  /**
   * Creates a rotation quaternion from an array.
   *
   * # Preconditions
   *
   * This function does not check if the input is normalized, it is up to the user to
   * provide normalized input or to normalized the resulting quaternion.
   */
  static fromArray(a: [number, number, number, number]): Quat {
    return new Quat(a[0], a[1], a[2], a[3]);
  }

  /**
   * Creates a new rotation quaternion from a 4D vector.
   *
   * # Preconditions
   *
   * This function does not check if the input is normalized, it is up to the user to
   * provide normalized input or to normalized the resulting quaternion.
   */
  static fromVec4(v: Vec4): Quat {
    return new Quat(v.x, v.y, v.z, v.w);
  }

  /**
   * Creates a rotation quaternion from a slice.
   *
   * # Preconditions
   *
   * This function does not check if the input is normalized, it is up to the user to
   * provide normalized input or to normalized the resulting quaternion.
   *
   * Throws a `RangeError` if `slice` length is less than 4.
   */
  static fromSlice(slice: ArrayLike<number>): Quat {
    return new Quat(
      Quat.#sliceElement(slice, 0),
      Quat.#sliceElement(slice, 1),
      Quat.#sliceElement(slice, 2),
      Quat.#sliceElement(slice, 3),
    );
  }

  /**
   * Writes the quaternion to an unaligned slice.
   *
   * Throws a `RangeError` if `slice` length is less than 4.
   */
  writeToSlice(slice: { [index: number]: number; readonly length: number }): void {
    if (slice.length < 4) {
      throw new RangeError("index out of bounds");
    }

    slice[0] = this.x;
    slice[1] = this.y;
    slice[2] = this.z;
    slice[3] = this.w;
  }

  /**
   * Create a quaternion for a normalized rotation `axis` and `angle` (in radians).
   *
   * The axis must be a unit vector.
   */
  static fromAxisAngle(axis: Vec3, angle: number): Quat {
    const s = Math.sin(angle * 0.5);

    return new Quat(axis.x * s, axis.y * s, axis.z * s, Math.cos(angle * 0.5));
  }

  /**
   * Create a quaternion that rotates `v.length()` radians around `v.normalize()`.
   *
   * `fromScaledAxis(Vec3.ZERO)` results in the identity quaternion.
   */
  static fromScaledAxis(v: Vec3): Quat {
    const length = v.length();

    if (length === 0) {
      return Quat.IDENTITY;
    }

    return Quat.fromAxisAngle(new Vec3(v.x / length, v.y / length, v.z / length), length);
  }

  /** Creates a quaternion from the `angle` (in radians) around the x axis. */
  static fromRotationX(angle: number): Quat {
    const s = Math.sin(angle * 0.5);
    const c = Math.cos(angle * 0.5);

    return new Quat(s, 0, 0, c);
  }

  /** Creates a quaternion from the `angle` (in radians) around the y axis. */
  static fromRotationY(angle: number): Quat {
    const s = Math.sin(angle * 0.5);
    const c = Math.cos(angle * 0.5);

    return new Quat(0, s, 0, c);
  }

  /** Creates a quaternion from the `angle` (in radians) around the z axis. */
  static fromRotationZ(angle: number): Quat {
    const s = Math.sin(angle * 0.5);
    const c = Math.cos(angle * 0.5);

    return new Quat(0, 0, s, c);
  }

  /** Creates a quaternion from the given Euler rotation sequence and the angles (in radians). */
  static fromEuler(euler: EulerRot, a: number, b: number, c: number): Quat {
    const [i, j, k, parityEven, initialRepeated, frameStatic] = EULER_ORDERS[euler];
    const ti = (frameStatic ? a : c) * 0.5;
    const tj = (parityEven ? -b : b) * 0.5;
    const th = (frameStatic ? c : a) * 0.5;
    const si = Math.sin(ti);
    const ci = Math.cos(ti);
    const sj = Math.sin(tj);
    const cj = Math.cos(tj);
    const sh = Math.sin(th);
    const ch = Math.cos(th);
    const cc = ci * ch;
    const cs = ci * sh;
    const sc = si * ch;
    const ss = si * sh;
    const parity = parityEven ? -1 : 1;
    const q: [number, number, number, number] = [0, 0, 0, 0];

    if (initialRepeated) {
      q[i] = cj * (cs + sc);
      q[j] = sj * (cc + ss) * parity;
      q[k] = sj * (cs - sc);
      q[3] = cj * (cc - ss);
    } else {
      q[i] = cj * sc - sj * cs;
      q[j] = (cj * ss + sj * cc) * parity;
      q[k] = cj * cs - sj * sc;
      q[3] = cj * cc + sj * ss;
    }

    return Quat.fromArray(q);
  }

  /**
   * From the columns of a 3x3 rotation matrix.
   *
   * Note if the input axes contain scales, shears, or other non-rotation transformations then
   * the output of this function is ill-defined.
   */
  static fromRotationAxes(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): Quat {
    return Quat.#fromRotationElements(
      xAxis.x,
      xAxis.y,
      xAxis.z,
      yAxis.x,
      yAxis.y,
      yAxis.z,
      zAxis.x,
      zAxis.y,
      zAxis.z,
    );
  }

  /**
   * Creates a quaternion from a 3x3 rotation matrix.
   *
   * Note if the input matrix contain scales, shears, or other non-rotation transformations then
   * the resulting quaternion will be ill-defined.
   */
  static fromMat3(mat: Mat3): Quat {
    return Quat.fromRotationAxes(mat.xAxis, mat.yAxis, mat.zAxis);
  }

  /**
   * Creates a quaternion from the upper 3x3 rotation matrix inside a homogeneous 4x4 matrix.
   *
   * Note if the upper 3x3 matrix contain scales, shears, or other non-rotation transformations
   * then the resulting quaternion will be ill-defined.
   */
  static fromMat4(mat: Mat4): Quat {
    const { xAxis, yAxis, zAxis } = mat;

    return Quat.#fromRotationElements(
      xAxis.x,
      xAxis.y,
      xAxis.z,
      yAxis.x,
      yAxis.y,
      yAxis.z,
      zAxis.x,
      zAxis.y,
      zAxis.z,
    );
  }

  /**
   * Gets the minimal rotation for transforming `from` to `to`.  The rotation is in the
   * plane spanned by the two vectors.  Will rotate at most 180 degrees.
   *
   * The inputs must be unit vectors.
   *
   * `fromRotationArc(from, to).mul(from) ≈ to`.
   *
   * For near-singular cases (from≈to and from≈-to) the current implementation
   * is only accurate to about 0.001 (for `f32`).
   */
  static fromRotationArc(from: Vec3, to: Vec3): Quat {
    const oneMinusEps = 1 - 2 * Number.EPSILON;
    const dot = from.dot(to);

    if (dot > oneMinusEps) {
      return Quat.IDENTITY;
    }

    if (dot < -oneMinusEps) {
      const sign = from.z < 0 || Object.is(from.z, -0) ? -1 : 1;
      const a = -1 / (sign + from.z);

      return Quat.fromAxisAngle(
        new Vec3(from.x * from.y * a, sign + from.y * from.y * a, -from.y),
        Math.PI,
      );
    }

    return new Quat(
      from.y * to.z - from.z * to.y,
      from.z * to.x - from.x * to.z,
      from.x * to.y - from.y * to.x,
      1 + dot,
    ).normalize();
  }

  /**
   * Gets the minimal rotation for transforming `from` to either `to` or `-to`.  This means
   * that the resulting quaternion will rotate `from` so that it is colinear with `to`.
   *
   * The rotation is in the plane spanned by the two vectors.  Will rotate at most 90
   * degrees.
   *
   * The inputs must be unit vectors.
   *
   * `Math.abs(to.dot(fromRotationArcColinear(from, to).mul(from))) ≈ 1`.
   */
  static fromRotationArcColinear(from: Vec3, to: Vec3): Quat {
    if (from.dot(to) < 0) {
      return Quat.fromRotationArc(from, new Vec3(-to.x, -to.y, -to.z));
    }

    return Quat.fromRotationArc(from, to);
  }

  /**
   * Gets the minimal rotation for transforming `from` to `to`.  The resulting rotation is
   * around the z axis. Will rotate at most 180 degrees.
   *
   * The inputs must be unit vectors.
   *
   * `fromRotationArc2d(from, to).mul(from) ≈ to`.
   *
   * For near-singular cases (from≈to and from≈-to) the current implementation
   * is only accurate to about 0.001 (for `f32`).
   */
  static fromRotationArc2d(from: Vec2, to: Vec2): Quat {
    const oneMinusEpsilon = 1 - 2 * Number.EPSILON;
    const dot = from.dot(to);

    if (dot > oneMinusEpsilon) {
      return Quat.IDENTITY;
    }

    if (dot < -oneMinusEpsilon) {
      return new Quat(0, 0, 1, 0);
    }

    const z = from.x * to.y - to.x * from.y;
    const w = 1 + dot;
    const lenRcp = 1 / Math.hypot(z, w);

    return new Quat(0, 0, z * lenRcp, w * lenRcp);
  }

  /** Returns the rotation axis (normalized) and angle (in radians) of `this`. */
  toAxisAngle(): [Vec3, number] {
    const epsilon = 1e-8;
    const length = Math.hypot(this.x, this.y, this.z);

    if (length >= epsilon) {
      return [
        new Vec3(this.x / length, this.y / length, this.z / length),
        2 * Math.atan2(length, this.w),
      ];
    }

    return [new Vec3(1, 0, 0), 0];
  }

  /** Returns the rotation axis scaled by the rotation in radians. */
  toScaledAxis(): Vec3 {
    const [axis, angle] = this.toAxisAngle();

    return new Vec3(axis.x * angle, axis.y * angle, axis.z * angle);
  }

  /** Returns the rotation angles for the given euler rotation sequence. */
  toEuler(order: EulerRot): [number, number, number] {
    return Mat3.fromQuat(this).toEuler(order);
  }

  /** Converts `this` to `[x, y, z, w]` */
  toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }

  /** Returns the vector part of the quaternion. */
  xyz(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * Returns the quaternion conjugate of `this`. For a unit quaternion the
   * conjugate is also the inverse.
   */
  conjugate(): Quat {
    return new Quat(-this.x, -this.y, -this.z, this.w);
  }

  /**
   * Returns the inverse of a normalized quaternion.
   *
   * Typically quaternion inverse returns the conjugate of a normalized quaternion.
   * Because `this` is assumed to already be unit length this method *does not* normalize
   * before returning the conjugate.
   */
  inverse(): Quat {
    return this.conjugate();
  }

  /**
   * Computes the dot product of `this` and `rhs`. The dot product is
   * equal to the cosine of the angle between two quaternion rotations.
   */
  dot(rhs: Quat): number {
    return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z + this.w * rhs.w;
  }

  /** Computes the length of `this`. */
  length(): number {
    return Math.sqrt(this.dot(this));
  }

  /**
   * Computes the squared length of `this`.
   *
   * This is generally faster than `length()` as it avoids a square
   * root operation.
   */
  lengthSquared(): number {
    return this.dot(this);
  }

  /**
   * Computes `1.0 / length()`.
   *
   * For valid results, `this` must _not_ be of length zero.
   */
  lengthRecip(): number {
    return 1 / this.length();
  }

  /**
   * Returns `this` normalized to length 1.0.
   *
   * For valid results, `this` must _not_ be of length zero.
   */
  normalize(): Quat {
    const rcp = this.lengthRecip();

    return new Quat(this.x * rcp, this.y * rcp, this.z * rcp, this.w * rcp);
  }

  /**
   * Returns `true` if, and only if, all elements are finite.
   * If any element is either `NaN`, positive or negative infinity, this will return `false`.
   */
  isFinite(): boolean {
    return (
      Number.isFinite(this.x) &&
      Number.isFinite(this.y) &&
      Number.isFinite(this.z) &&
      Number.isFinite(this.w)
    );
  }

  /** Returns `true` if any elements are `NaN`. */
  isNan(): boolean {
    return (
      Number.isNaN(this.x) || Number.isNaN(this.y) || Number.isNaN(this.z) || Number.isNaN(this.w)
    );
  }

  /**
   * Returns whether `this` of length `1.0` or not.
   *
   * Uses a precision threshold of `1e-6`.
   */
  isNormalized(): boolean {
    return Math.abs(this.lengthSquared() - 1) <= 2e-4;
  }

  /** Returns `true` if `this` represents a rotation near the identity. */
  isNearIdentity(): boolean {
    return Math.abs(this.w) > 1 - 1e-14;
  }

  /**
   * Returns the angle (in radians) for the minimal rotation between two quaternions
   * in the range `[0, +π]`.
   *
   * Both quaternions must be normalized.
   */
  angleBetween(rhs: Quat): number {
    return Math.acos(Math.min(Math.abs(this.dot(rhs)), 1)) * 2;
  }

  /**
   * Rotates towards `rhs` up to `maxAngle` (in radians).
   *
   * When `maxAngle` is `0.0`, the result will be equal to `this`. When `maxAngle` is equal to
   * `this.angleBetween(rhs)`, the result will be equal to `rhs`. If `maxAngle` is negative,
   * rotates towards the exact opposite of `rhs`. Will not go past the target.
   *
   * Both quaternions must be normalized.
   */
  rotateTowards(rhs: Quat, maxAngle: number): Quat {
    const angle = this.angleBetween(rhs);

    if (angle <= 1e-4) {
      return rhs.clone();
    }

    return this.slerp(rhs, Math.min(Math.max(maxAngle / angle, -1), 1));
  }

  /**
   * Returns true if the absolute difference of all elements between `this` and `rhs`
   * is less than or equal to `maxAbsDiff`.
   *
   * This can be used to compare if two quaternions contain similar elements. It works
   * best when comparing with a known value. The `maxAbsDiff` that should be used used
   * depends on the values being compared against.
   *
   * For more see
   * [comparing floating point numbers](https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/).
   */
  absDiffEq(rhs: Quat, maxAbsDiff: number): boolean {
    return (
      Math.abs(this.x - rhs.x) <= maxAbsDiff &&
      Math.abs(this.y - rhs.y) <= maxAbsDiff &&
      Math.abs(this.z - rhs.z) <= maxAbsDiff &&
      Math.abs(this.w - rhs.w) <= maxAbsDiff
    );
  }

  /**
   * Performs a linear interpolation between `this` and `rhs` based on
   * the value `s`, using the form `this * (1.0 - s) + end * s` before normalizing.
   *
   * When `s` is `0.0`, the result will be equal to `this`.  When `s`
   * is `1.0`, the result will be equal to `rhs`.
   *
   * This interpolates linearly between the two rotations and does not rotate at a constant
   * angular velocity; see `slerp` if that is required.
   */
  lerp(end: Quat, s: number): Quat {
    return this.#lerpImpl(end, this.dot(end) >= 0 ? 1 : -1, s);
  }

  /**
   * Performs a spherical linear interpolation between `this` and `end`
   * based on the value `s`.
   *
   * When `s` is `0.0`, the result will be equal to `this`.  When `s`
   * is `1.0`, the result will be equal to `end`.
   */
  slerp(end: Quat, s: number): Quat {
    const dot = this.dot(end);
    const endScale = dot < 0 ? -1 : 1;
    const absDot = dot * endScale;

    if (absDot > 1 - Number.EPSILON) {
      return this.#lerpImpl(end, endScale, s);
    }

    return this.#slerpImpl(end, endScale, absDot, s);
  }

  /**
   * Performs a spherical linear interpolation between `this` and `end` based on the value `s`,
   * preserving the rotation direction.
   *
   * When `s` is `0.0`, the result will be equal to `this`.  When `s` is `1.0`, the result will
   * be equal to `end`.
   *
   * When the dot product of `this` and `end` is negative, the standard `slerp`
   * will flip the end quaternion to take the shortest path, while this method will take the
   * longer arc. This is useful when the intended rotation direction must be preserved.
   */
  slerpLong(end: Quat, s: number): Quat {
    const dot = this.dot(end);

    if (Math.abs(dot) > 1 - Number.EPSILON) {
      return this.#lerpImpl(end, 1, s);
    }

    return this.#slerpImpl(end, 1, dot, s);
  }

  /** Multiplies a quaternion and a 3D vector, returning the rotated vector. */
  mulVec3(rhs: Vec3): Vec3 {
    const { x, y, z, w } = this;
    const k0 = w * w - (x * x + y * y + z * z);
    const k1 = (rhs.x * x + rhs.y * y + rhs.z * z) * 2;
    const k2 = w * 2;

    return new Vec3(
      rhs.x * k0 + x * k1 + (y * rhs.z - z * rhs.y) * k2,
      rhs.y * k0 + y * k1 + (z * rhs.x - x * rhs.z) * k2,
      rhs.z * k0 + z * k1 + (x * rhs.y - y * rhs.x) * k2,
    );
  }

  /**
   * Multiplies two quaternions. If they each represent a rotation, the result will
   * represent the combined rotation.
   *
   * Note that due to floating point rounding the result may not be perfectly normalized.
   */
  mulQuat(rhs: Quat): Quat {
    const { x: x0, y: y0, z: z0, w: w0 } = this;
    const { x: x1, y: y1, z: z1, w: w1 } = rhs;

    return new Quat(
      w0 * x1 + x0 * w1 + y0 * z1 - z0 * y1,
      w0 * y1 - x0 * z1 + y0 * w1 + z0 * x1,
      w0 * z1 + x0 * y1 - y0 * x1 + z0 * w1,
      w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1,
    );
  }

  /**
   * Creates a quaternion from a 3x3 rotation matrix inside a 3D affine transform.
   *
   * Note if the input affine matrix contain scales, shears, or other non-rotation
   * transformations then the resulting quaternion will be ill-defined.
   */
  static fromAffine3(a: Affine3): Quat {
    return Quat.fromRotationAxes(a.matrix3.xAxis, a.matrix3.yAxis, a.matrix3.zAxis);
  }

  clone(): Quat {
    return new Quat(this.x, this.y, this.z, this.w);
  }

  add(rhs: Quat): Quat {
    return new Quat(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, this.w + rhs.w);
  }

  sub(rhs: Quat): Quat {
    return new Quat(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z, this.w - rhs.w);
  }

  mul(rhs: Vec3): Vec3;
  mul(rhs: Quat | number): Quat;
  mul(rhs: Quat | Vec3 | number): Quat | Vec3 {
    if (typeof rhs === "number") {
      return new Quat(this.x * rhs, this.y * rhs, this.z * rhs, this.w * rhs);
    }

    if (rhs instanceof Vec3) {
      return this.mulVec3(rhs);
    }

    return this.mulQuat(rhs);
  }

  div(rhs: number): Quat {
    return new Quat(this.x / rhs, this.y / rhs, this.z / rhs, this.w / rhs);
  }

  neg(): Quat {
    return new Quat(-this.x, -this.y, -this.z, -this.w);
  }

  addAssign(rhs: Quat): this {
    this.x += rhs.x;
    this.y += rhs.y;
    this.z += rhs.z;
    this.w += rhs.w;

    return this;
  }

  subAssign(rhs: Quat): this {
    this.x -= rhs.x;
    this.y -= rhs.y;
    this.z -= rhs.z;
    this.w -= rhs.w;

    return this;
  }

  mulAssign(rhs: Quat | number): this {
    if (typeof rhs === "number") {
      this.x *= rhs;
      this.y *= rhs;
      this.z *= rhs;
      this.w *= rhs;

      return this;
    }

    const { x: x0, y: y0, z: z0, w: w0 } = this;
    const { x: x1, y: y1, z: z1, w: w1 } = rhs;

    this.x = w0 * x1 + x0 * w1 + y0 * z1 - z0 * y1;
    this.y = w0 * y1 - x0 * z1 + y0 * w1 + z0 * x1;
    this.z = w0 * z1 + x0 * y1 - y0 * x1 + z0 * w1;
    this.w = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;

    return this;
  }

  divAssign(rhs: number): this {
    this.x /= rhs;
    this.y /= rhs;
    this.z /= rhs;
    this.w /= rhs;

    return this;
  }

  eq(rhs: Quat): boolean {
    return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z && this.w === rhs.w;
  }

  ne(rhs: Quat): boolean {
    return this.x !== rhs.x || this.y !== rhs.y || this.z !== rhs.z || this.w !== rhs.w;
  }

  toString(): string {
    return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
  }

  static #sliceElement(slice: ArrayLike<number>, index: number): number {
    const value = slice[index];

    if (value === undefined) {
      throw new RangeError("index out of bounds");
    }

    return value;
  }

  static #fromRotationElements(
    m00: number,
    m01: number,
    m02: number,
    m10: number,
    m11: number,
    m12: number,
    m20: number,
    m21: number,
    m22: number,
  ): Quat {
    if (m22 <= 0) {
      const dif10 = m11 - m00;
      const omm22 = 1 - m22;

      if (dif10 <= 0) {
        const fourXsq = omm22 - dif10;
        const inv4x = 0.5 / Math.sqrt(fourXsq);

        return new Quat(
          fourXsq * inv4x,
          (m01 + m10) * inv4x,
          (m02 + m20) * inv4x,
          (m12 - m21) * inv4x,
        );
      }

      const fourYsq = omm22 + dif10;
      const inv4y = 0.5 / Math.sqrt(fourYsq);

      return new Quat(
        (m01 + m10) * inv4y,
        fourYsq * inv4y,
        (m12 + m21) * inv4y,
        (m20 - m02) * inv4y,
      );
    }

    const sum10 = m11 + m00;
    const opm22 = 1 + m22;

    if (sum10 <= 0) {
      const fourZsq = opm22 - sum10;
      const inv4z = 0.5 / Math.sqrt(fourZsq);

      return new Quat(
        (m02 + m20) * inv4z,
        (m12 + m21) * inv4z,
        fourZsq * inv4z,
        (m01 - m10) * inv4z,
      );
    }

    const fourWsq = opm22 + sum10;
    const inv4w = 0.5 / Math.sqrt(fourWsq);

    return new Quat((m12 - m21) * inv4w, (m20 - m02) * inv4w, (m01 - m10) * inv4w, fourWsq * inv4w);
  }

  #lerpImpl(end: Quat, endScale: number, s: number): Quat {
    const t = 1 - s;

    return new Quat(
      this.x * t + end.x * endScale * s,
      this.y * t + end.y * endScale * s,
      this.z * t + end.z * endScale * s,
      this.w * t + end.w * endScale * s,
    ).normalize();
  }

  #slerpImpl(end: Quat, endScale: number, dot: number, s: number): Quat {
    const theta = Math.acos(Math.min(Math.max(dot, -1), 1));
    const scale1 = Math.sin(theta * (1 - s));
    const scale2 = Math.sin(theta * s);
    const thetaSinRecip = 1 / Math.sin(theta);

    return new Quat(
      (this.x * scale1 + end.x * endScale * scale2) * thetaSinRecip,
      (this.y * scale1 + end.y * endScale * scale2) * thetaSinRecip,
      (this.z * scale1 + end.z * endScale * scale2) * thetaSinRecip,
      (this.w * scale1 + end.w * endScale * scale2) * thetaSinRecip,
    );
  }
}

/**
 * Creates a quaternion from `x`, `y`, `z` and `w` values.
 *
 * This should generally not be called manually unless you know what you are doing. Use
 * one of the other constructors instead such as `identity` or `fromAxisAngle`.
 */
export function quat(x: number, y: number, z: number, w: number): Quat {
  return new Quat(x, y, z, w);
}
