import { BVec3 } from "./BVec3.js";
import { Vec2 } from "./Vec2.js";
import { Vec4 } from "./Vec4.js";

/** A 3-dimensional vector. */
export class Vec3 {
  declare x: number;
  declare y: number;
  declare z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /** All zeroes. */
  static get ZERO() {
    return new Vec3(0, 0, 0);
  }

  /** All ones. */
  static get ONE() {
    return new Vec3(1, 1, 1);
  }

  /** All negative ones. */
  static get NEG_ONE() {
    return new Vec3(-1, -1, -1);
  }

  /** All `-Number.MAX_VALUE`. */
  static get MIN() {
    return new Vec3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
  }

  /** All `Number.MAX_VALUE`. */
  static get MAX() {
    return new Vec3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  }

  /** All `NaN`. */
  static get NAN() {
    return new Vec3(Number.NaN, Number.NaN, Number.NaN);
  }

  /** All `Infinity`. */
  static get INFINITY() {
    return new Vec3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  }

  /** All `-Infinity`. */
  static get NEG_INFINITY() {
    return new Vec3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
  }

  /** A unit vector pointing along the positive X axis. */
  static get X() {
    return new Vec3(1, 0, 0);
  }

  /** A unit vector pointing along the positive Y axis. */
  static get Y() {
    return new Vec3(0, 1, 0);
  }

  /** A unit vector pointing along the positive Z axis. */
  static get Z() {
    return new Vec3(0, 0, 1);
  }

  /** A unit vector pointing along the negative X axis. */
  static get NEG_X() {
    return new Vec3(-1, 0, 0);
  }

  /** A unit vector pointing along the negative Y axis. */
  static get NEG_Y() {
    return new Vec3(0, -1, 0);
  }

  /** A unit vector pointing along the negative Z axis. */
  static get NEG_Z() {
    return new Vec3(0, 0, -1);
  }

  /** The unit axes. */
  static get AXES() {
    return [new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1)];
  }

  /** Creates a new vector. */
  static new(x: number, y: number, z: number): Vec3 {
    return new Vec3(x, y, z);
  }

  /** Creates a vector with all elements set to `v`. */
  static splat(v: number): Vec3 {
    return new Vec3(v, v, v);
  }

  /** Returns a vector containing each element of `this` modified by a mapping function `f`. */
  map(f: (value: number) => number): Vec3 {
    return new Vec3(f(this.x), f(this.y), f(this.z));
  }

  /**
   * Creates a vector from the elements in `ifTrue` and `ifFalse`, selecting which to use
   * for each element of `this`.
   *
   * A true element in the mask uses the corresponding element from `ifTrue`, and false
   * uses the element from `ifFalse`.
   */
  static select(mask: BVec3, ifTrue: Vec3, ifFalse: Vec3): Vec3 {
    return new Vec3(
      mask.x ? ifTrue.x : ifFalse.x,
      mask.y ? ifTrue.y : ifFalse.y,
      mask.z ? ifTrue.z : ifFalse.z,
    );
  }

  /** Creates a new vector from an array. */
  static fromArray(a: [number, number, number]): Vec3 {
    return new Vec3(a[0], a[1], a[2]);
  }

  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /** Converts `this` to `[x, y, z]` */
  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  /**
   * Creates a vector from the first 3 values in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 3 elements long.
   */
  static fromSlice(slice: ArrayLike<number>): Vec3 {
    if (slice.length < 3) {
      throw new RangeError("slice is less than 3 elements long");
    }

    return new Vec3(slice[0] ?? Number.NaN, slice[1] ?? Number.NaN, slice[2] ?? Number.NaN);
  }

  /**
   * Writes the elements of `this` to the first 3 elements in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 3 elements long.
   */
  writeToSlice(slice: { [index: number]: number; readonly length: number }): void {
    if (slice.length < 3) {
      throw new RangeError("slice is less than 3 elements long");
    }

    slice[0] = this.x;
    slice[1] = this.y;
    slice[2] = this.z;
  }

  /** Creates a 4D vector from `this` and the given `w` value. */
  extend(w: number): Vec4 {
    return new Vec4(this.x, this.y, this.z, w);
  }

  /** Creates a 2D vector from the `x` and `y` elements of `this`, discarding `z`. */
  truncate(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /** Projects a homogeneous coordinate to 3D space by performing perspective divide. */
  static fromHomogeneous(v: Vec4): Vec3 {
    return new Vec3(v.x / v.w, v.y / v.w, v.z / v.w);
  }

  /** Creates a homogeneous coordinate from `this`, equivalent to `this.extend(1.0)`. */
  toHomogeneous(): Vec4 {
    return new Vec4(this.x, this.y, this.z, 1);
  }

  /** Creates a 3D vector from `this` with the given value of `x`. */
  withX(x: number): Vec3 {
    return new Vec3(x, this.y, this.z);
  }

  /** Creates a 3D vector from `this` with the given value of `y`. */
  withY(y: number): Vec3 {
    return new Vec3(this.x, y, this.z);
  }

  /** Creates a 3D vector from `this` with the given value of `z`. */
  withZ(z: number): Vec3 {
    return new Vec3(this.x, this.y, z);
  }

  /** Computes the dot product of `this` and `rhs`. */
  dot(rhs: Vec3): number {
    return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
  }

  /** Returns a vector where every component is the dot product of `this` and `rhs`. */
  dotIntoVec(rhs: Vec3): Vec3 {
    return Vec3.splat(this.dot(rhs));
  }

  /** Computes the cross product of `this` and `rhs`. */
  cross(rhs: Vec3): Vec3 {
    return new Vec3(
      this.y * rhs.z - rhs.y * this.z,
      this.z * rhs.x - rhs.z * this.x,
      this.x * rhs.y - rhs.x * this.y,
    );
  }

  /**
   * Returns a vector containing the minimum values for each element of `this` and `rhs`.
   *
   * In other words this computes `[min(x, rhs.x), min(this.y, rhs.y), ..]`.
   */
  min(rhs: Vec3): Vec3 {
    return new Vec3(Math.min(this.x, rhs.x), Math.min(this.y, rhs.y), Math.min(this.z, rhs.z));
  }

  /**
   * Returns a vector containing the maximum values for each element of `this` and `rhs`.
   *
   * In other words this computes `[max(this.x, rhs.x), max(this.y, rhs.y), ..]`.
   */
  max(rhs: Vec3): Vec3 {
    return new Vec3(Math.max(this.x, rhs.x), Math.max(this.y, rhs.y), Math.max(this.z, rhs.z));
  }

  /**
   * Component-wise clamping of values, similar to `Math.min(Math.max(value, min), max)`.
   *
   * Each element in `min` must be less-or-equal to the corresponding element in `max`.
   */
  clamp(min: Vec3, max: Vec3): Vec3 {
    return new Vec3(
      Math.min(Math.max(this.x, min.x), max.x),
      Math.min(Math.max(this.y, min.y), max.y),
      Math.min(Math.max(this.z, min.z), max.z),
    );
  }

  /**
   * Returns the horizontal minimum of `this`.
   *
   * In other words this computes `min(x, y, ..)`.
   */
  minElement(): number {
    return Math.min(this.x, this.y, this.z);
  }

  /**
   * Returns the horizontal maximum of `this`.
   *
   * In other words this computes `max(x, y, ..)`.
   */
  maxElement(): number {
    return Math.max(this.x, this.y, this.z);
  }

  /** Returns the index of the first minimum element of `this`. */
  minPosition(): number {
    let min = this.x;
    let index = 0;

    if (this.y < min) {
      min = this.y;
      index = 1;
    }

    if (this.z < min) {
      index = 2;
    }

    return index;
  }

  /** Returns the index of the first maximum element of `this`. */
  maxPosition(): number {
    let max = this.x;
    let index = 0;

    if (this.y > max) {
      max = this.y;
      index = 1;
    }

    if (this.z > max) {
      index = 2;
    }

    return index;
  }

  /**
   * Returns the sum of all elements of `this`.
   *
   * In other words, this computes `this.x + this.y + ..`.
   */
  elementSum(): number {
    return this.x + this.y + this.z;
  }

  /**
   * Returns the product of all elements of `this`.
   *
   * In other words, this computes `this.x * this.y * ..`.
   */
  elementProduct(): number {
    return this.x * this.y * this.z;
  }

  /**
   * Returns a vector mask containing the result of a `==` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words, this computes `[this.x == rhs.x, this.y == rhs.y, ..]` for all
   * elements.
   */
  cmpeq(rhs: Vec3): BVec3 {
    return new BVec3(this.x === rhs.x, this.y === rhs.y, this.z === rhs.z);
  }

  /**
   * Returns a vector mask containing the result of a `!=` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x != rhs.x, this.y != rhs.y, ..]` for all
   * elements.
   */
  cmpne(rhs: Vec3): BVec3 {
    return new BVec3(this.x !== rhs.x, this.y !== rhs.y, this.z !== rhs.z);
  }

  /**
   * Returns a vector mask containing the result of a `>=` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x >= rhs.x, this.y >= rhs.y, ..]` for all
   * elements.
   */
  cmpge(rhs: Vec3): BVec3 {
    return new BVec3(this.x >= rhs.x, this.y >= rhs.y, this.z >= rhs.z);
  }

  /**
   * Returns a vector mask containing the result of a `>` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x > rhs.x, this.y > rhs.y, ..]` for all
   * elements.
   */
  cmpgt(rhs: Vec3): BVec3 {
    return new BVec3(this.x > rhs.x, this.y > rhs.y, this.z > rhs.z);
  }

  /**
   * Returns a vector mask containing the result of a `<=` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x <= rhs.x, this.y <= rhs.y, ..]` for all
   * elements.
   */
  cmple(rhs: Vec3): BVec3 {
    return new BVec3(this.x <= rhs.x, this.y <= rhs.y, this.z <= rhs.z);
  }

  /**
   * Returns a vector mask containing the result of a `<` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x < rhs.x, this.y < rhs.y, ..]` for all
   * elements.
   */
  cmplt(rhs: Vec3): BVec3 {
    return new BVec3(this.x < rhs.x, this.y < rhs.y, this.z < rhs.z);
  }

  /** Returns a vector containing the absolute value of each element of `this`. */
  abs(): Vec3 {
    return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
  }

  /**
   * Returns a vector with elements representing the sign of `this`.
   *
   * - `1.0` if the number is positive, `+0.0` or `Infinity`
   * - `-1.0` if the number is negative, `-0.0` or `-Infinity`
   * - `NaN` if the number is `NaN`
   */
  signum(): Vec3 {
    return new Vec3(
      Math.sign(this.x + 1 / this.x),
      Math.sign(this.y + 1 / this.y),
      Math.sign(this.z + 1 / this.z),
    );
  }

  /** Returns a vector with signs of `rhs` and the magnitudes of `this`. */
  copysign(rhs: Vec3): Vec3 {
    return new Vec3(
      rhs.x + 1 / rhs.x < 0 ? -Math.abs(this.x) : Math.abs(this.x),
      rhs.y + 1 / rhs.y < 0 ? -Math.abs(this.y) : Math.abs(this.y),
      rhs.z + 1 / rhs.z < 0 ? -Math.abs(this.z) : Math.abs(this.z),
    );
  }

  /**
   * Returns a bitmask with the lowest 3 bits set to the sign bits from the elements of `this`.
   *
   * A negative element results in a `1` bit and a positive element in a `0` bit.  Element `x` goes
   * into the first lowest bit, element `y` into the second, etc.
   *
   * An element is negative if it has a negative sign, including -0.0 and negative infinity.
   */
  isNegativeBitmask(): number {
    return (
      (this.x + 1 / this.x < 0 ? 1 : 0) +
      (this.y + 1 / this.y < 0 ? 2 : 0) +
      (this.z + 1 / this.z < 0 ? 4 : 0)
    );
  }

  /**
   * Returns a mask indicating which components are negative.
   *
   * An element is negative if it has a negative sign, including -0.0 and negative infinity.
   */
  isNegativeMask(): BVec3 {
    return new BVec3(this.x + 1 / this.x < 0, this.y + 1 / this.y < 0, this.z + 1 / this.z < 0);
  }

  /**
   * Returns `true` if, and only if, all elements are finite.  If any element is either
   * `NaN`, positive or negative infinity, this will return `false`.
   */
  isFinite(): boolean {
    return Number.isFinite(this.x) && Number.isFinite(this.y) && Number.isFinite(this.z);
  }

  /**
   * Performs `Number.isFinite` on each element of this, returning a vector mask of the results.
   *
   * In other words, this computes `[Number.isFinite(x), Number.isFinite(y), ...]`.
   */
  isFiniteMask(): BVec3 {
    return new BVec3(Number.isFinite(this.x), Number.isFinite(this.y), Number.isFinite(this.z));
  }

  /** Returns `true` if any elements are `NaN`. */
  isNan(): boolean {
    return Number.isNaN(this.x) || Number.isNaN(this.y) || Number.isNaN(this.z);
  }

  /**
   * Performs `Number.isNaN` on each element of this, returning a vector mask of the results.
   *
   * In other words, this computes `[Number.isNaN(x), Number.isNaN(y), ...]`.
   */
  isNanMask(): BVec3 {
    return new BVec3(Number.isNaN(this.x), Number.isNaN(this.y), Number.isNaN(this.z));
  }

  /** Computes the length of `this`. */
  length(): number {
    return Math.sqrt(this.dot(this));
  }

  /**
   * Computes the squared length of `this`.
   *
   * This is faster than `length()` as it avoids a square root operation.
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

  /** Computes the Euclidean distance between two points in space. */
  distance(rhs: Vec3): number {
    return Math.sqrt(this.distanceSquared(rhs));
  }

  /** Compute the squared euclidean distance between two points in space. */
  distanceSquared(rhs: Vec3): number {
    const x = this.x - rhs.x;
    const y = this.y - rhs.y;
    const z = this.z - rhs.z;

    return x * x + y * y + z * z;
  }

  /** Returns the element-wise quotient of Euclidean division of `this` by `rhs`. */
  divEuclid(rhs: Vec3): Vec3 {
    return new Vec3(
      Math.trunc(this.x / rhs.x) - (this.x % rhs.x < 0 ? Math.sign(rhs.x) : 0),
      Math.trunc(this.y / rhs.y) - (this.y % rhs.y < 0 ? Math.sign(rhs.y) : 0),
      Math.trunc(this.z / rhs.z) - (this.z % rhs.z < 0 ? Math.sign(rhs.z) : 0),
    );
  }

  /** Returns the element-wise remainder of Euclidean division of `this` by `rhs`. */
  remEuclid(rhs: Vec3): Vec3 {
    const x = this.x % rhs.x;
    const y = this.y % rhs.y;
    const z = this.z % rhs.z;

    return new Vec3(
      x < 0 ? x + Math.abs(rhs.x) : x,
      y < 0 ? y + Math.abs(rhs.y) : y,
      z < 0 ? z + Math.abs(rhs.z) : z,
    );
  }

  /**
   * Returns `this` normalized to length 1.0.
   *
   * For valid results, `this` must be finite and _not_ of length zero, nor very close to zero.
   *
   * See also `tryNormalize()` and `normalizeOrZero()`.
   */
  normalize(): Vec3 {
    return this.mul(this.lengthRecip());
  }

  /**
   * Returns `this` normalized to length 1.0 if possible, else returns `undefined`.
   *
   * In particular, if the input is zero (or very close to zero), or non-finite,
   * the result of this operation will be `undefined`.
   *
   * See also `normalizeOrZero()`.
   */
  tryNormalize(): Vec3 | undefined {
    const rcp = this.lengthRecip();

    return Number.isFinite(rcp) && rcp > 0 ? this.mul(rcp) : undefined;
  }

  /**
   * Returns `this` normalized to length 1.0 if possible, else returns a
   * fallback value.
   *
   * In particular, if the input is zero (or very close to zero), or non-finite,
   * the result of this operation will be the fallback value.
   *
   * See also `tryNormalize()`.
   */
  normalizeOr(fallback: Vec3): Vec3 {
    const rcp = this.lengthRecip();

    return Number.isFinite(rcp) && rcp > 0 ? this.mul(rcp) : fallback.clone();
  }

  /**
   * Returns `this` normalized to length 1.0 if possible, else returns zero.
   *
   * In particular, if the input is zero (or very close to zero), or non-finite,
   * the result of this operation will be zero.
   *
   * See also `tryNormalize()`.
   */
  normalizeOrZero(): Vec3 {
    const rcp = this.lengthRecip();

    return Number.isFinite(rcp) && rcp > 0 ? this.mul(rcp) : Vec3.ZERO;
  }

  /**
   * Returns `this` normalized to length 1.0 and the length of `this`.
   *
   * If `this` is zero length then `[Vec3.X, 0.0]` is returned.
   */
  normalizeAndLength(): [Vec3, number] {
    const length = this.length();
    const rcp = 1 / length;

    return Number.isFinite(rcp) && rcp > 0 ? [this.mul(rcp), length] : [Vec3.X, 0];
  }

  /**
   * Returns whether `this` is length `1.0` or not.
   *
   * Uses a precision threshold of approximately `1e-4`.
   */
  isNormalized(): boolean {
    return Math.abs(this.lengthSquared() - 1) <= 2e-4;
  }

  /**
   * Returns the vector projection of `this` onto `rhs`.
   *
   * `rhs` must be of non-zero length.
   */
  projectOnto(rhs: Vec3): Vec3 {
    return rhs.mul(this.dot(rhs) / rhs.dot(rhs));
  }

  /**
   * Returns the vector rejection of `this` from `rhs`.
   *
   * The vector rejection is the vector perpendicular to the projection of `this` onto
   * `rhs`, in rhs words the result of `this.sub(this.projectOnto(rhs))`.
   *
   * `rhs` must be of non-zero length.
   */
  rejectFrom(rhs: Vec3): Vec3 {
    const scale = this.dot(rhs) / rhs.dot(rhs);

    return new Vec3(this.x - rhs.x * scale, this.y - rhs.y * scale, this.z - rhs.z * scale);
  }

  /**
   * Returns the vector projection of `this` onto `rhs`.
   *
   * `rhs` must be normalized.
   */
  projectOntoNormalized(rhs: Vec3): Vec3 {
    return rhs.mul(this.dot(rhs));
  }

  /**
   * Returns the vector rejection of `this` from `rhs`.
   *
   * The vector rejection is the vector perpendicular to the projection of `this` onto
   * `rhs`, in rhs words the result of `this.sub(this.projectOnto(rhs))`.
   *
   * `rhs` must be normalized.
   */
  rejectFromNormalized(rhs: Vec3): Vec3 {
    const scale = this.dot(rhs);

    return new Vec3(this.x - rhs.x * scale, this.y - rhs.y * scale, this.z - rhs.z * scale);
  }

  /**
   * Returns a vector containing the nearest integer to a number for each element of `this`.
   * Round half-way cases away from 0.0.
   */
  round(): Vec3 {
    return new Vec3(
      this.x < 0 ? -Math.round(-this.x) : Math.round(this.x),
      this.y < 0 ? -Math.round(-this.y) : Math.round(this.y),
      this.z < 0 ? -Math.round(-this.z) : Math.round(this.z),
    );
  }

  /**
   * Returns a vector containing the largest integer less than or equal to a number for each
   * element of `this`.
   */
  floor(): Vec3 {
    return new Vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
  }

  /**
   * Returns a vector containing the smallest integer greater than or equal to a number for
   * each element of `this`.
   */
  ceil(): Vec3 {
    return new Vec3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
  }

  /**
   * Returns a vector containing the integer part each element of `this`. This means numbers are
   * always truncated towards zero.
   */
  trunc(): Vec3 {
    return new Vec3(Math.trunc(this.x), Math.trunc(this.y), Math.trunc(this.z));
  }

  /**
   * Returns a vector containing `0.0` if `rhs < this` and 1.0 otherwise.
   *
   * Similar to glsl's step(edge, x), which translates into edge.step(x)
   */
  step(rhs: Vec3): Vec3 {
    return new Vec3(rhs.x < this.x ? 0 : 1, rhs.y < this.y ? 0 : 1, rhs.z < this.z ? 0 : 1);
  }

  /**
   * Performs Hermite interpolation between `0.0` and `1.0` using `x` normalized to `[edge0, edge1]`.
   *
   * This is equivalent to `t * t * (3.0 - 2.0 * t)`, where `t` is clamped to `[0.0, 1.0]`.
   * Results are undefined if any element of `edge0` is greater than or equal to the corresponding
   * element of `edge1`.
   */
  smoothstep(edge0: Vec3, edge1: Vec3): Vec3 {
    const x = Math.min(Math.max((this.x - edge0.x) / (edge1.x - edge0.x), 0), 1);
    const y = Math.min(Math.max((this.y - edge0.y) / (edge1.y - edge0.y), 0), 1);
    const z = Math.min(Math.max((this.z - edge0.z) / (edge1.z - edge0.z), 0), 1);

    return new Vec3(x * x * (3 - 2 * x), y * y * (3 - 2 * y), z * z * (3 - 2 * z));
  }

  /** Returns a vector containing all elements of `this` clamped to the range of `[0, 1]`. */
  saturate(): Vec3 {
    return new Vec3(
      Math.min(Math.max(this.x, 0), 1),
      Math.min(Math.max(this.y, 0), 1),
      Math.min(Math.max(this.z, 0), 1),
    );
  }

  /**
   * Returns a vector containing the fractional part of the vector as `this.sub(this.trunc())`.
   *
   * Note that this differs from the GLSL implementation of `fract` which returns
   * `this.sub(this.floor())`.
   *
   * Note that this is fast but not precise for large numbers.
   */
  fract(): Vec3 {
    return new Vec3(
      this.x - Math.trunc(this.x),
      this.y - Math.trunc(this.y),
      this.z - Math.trunc(this.z),
    );
  }

  /**
   * Returns a vector containing the fractional part of the vector as `this.sub(this.floor())`.
   *
   * Note that this differs from the Rust implementation of `fract` which returns
   * `this.sub(this.trunc())`.
   *
   * Note that this is fast but not precise for large numbers.
   */
  fractGl(): Vec3 {
    return new Vec3(
      this.x - Math.floor(this.x),
      this.y - Math.floor(this.y),
      this.z - Math.floor(this.z),
    );
  }

  /**
   * Returns a vector containing `e^this` (the exponential function) for each element of
   * `this`.
   */
  exp(): Vec3 {
    return new Vec3(Math.exp(this.x), Math.exp(this.y), Math.exp(this.z));
  }

  /** Returns a vector containing `2^this` for each element of `this`. */
  exp2(): Vec3 {
    return new Vec3(2 ** this.x, 2 ** this.y, 2 ** this.z);
  }

  /**
   * Returns a vector containing the natural logarithm for each element of `this`.
   * This returns NaN when the element is negative and negative infinity when the element is zero.
   */
  ln(): Vec3 {
    return new Vec3(Math.log(this.x), Math.log(this.y), Math.log(this.z));
  }

  /**
   * Returns a vector containing the base 2 logarithm for each element of `this`.
   * This returns NaN when the element is negative and negative infinity when the element is zero.
   */
  log2(): Vec3 {
    return new Vec3(Math.log2(this.x), Math.log2(this.y), Math.log2(this.z));
  }

  /** Returns a vector containing each element of `this` raised to the power of `n`. */
  powf(n: number): Vec3 {
    return new Vec3(this.x ** n, this.y ** n, this.z ** n);
  }

  /**
   * Returns a vector containing the square root for each element of `this`.
   * This returns NaN when the element is negative.
   */
  sqrt(): Vec3 {
    return new Vec3(Math.sqrt(this.x), Math.sqrt(this.y), Math.sqrt(this.z));
  }

  /** Returns a vector containing the cosine for each element of `this`. */
  cos(): Vec3 {
    return new Vec3(Math.cos(this.x), Math.cos(this.y), Math.cos(this.z));
  }

  /** Returns a vector containing the sine for each element of `this`. */
  sin(): Vec3 {
    return new Vec3(Math.sin(this.x), Math.sin(this.y), Math.sin(this.z));
  }

  /** Returns a tuple of two vectors containing the sine and cosine for each element of `this`. */
  sinCos(): [Vec3, Vec3] {
    return [
      new Vec3(Math.sin(this.x), Math.sin(this.y), Math.sin(this.z)),
      new Vec3(Math.cos(this.x), Math.cos(this.y), Math.cos(this.z)),
    ];
  }

  /** Returns a vector containing the reciprocal `1.0/n` of each element of `this`. */
  recip(): Vec3 {
    return new Vec3(1 / this.x, 1 / this.y, 1 / this.z);
  }

  /**
   * Performs a linear interpolation between `this` and `rhs` based on the value `s`, using the
   * form `this.mul(1.0 - s).add(rhs.mul(s))`.
   *
   * When `s` is `0.0`, the result will be equal to `this`. When `s` is `1.0`, the result will
   * be equal to `rhs`. When `s` is outside of the range `[0, 1]`, the result is linearly
   * extrapolated.
   *
   * The result is guaranteed to be `this` at `s == 0.0` and `rhs` at `s == 1.0`, even when the
   * values differ greatly in magnitude, but it is not monotonic in `s` for nearly equal inputs
   * and may not preserve equal inputs exactly. Consider `lerpMonotonic()`
   * instead when interpolating between values that may be equal or nearly equal.
   */
  lerp(rhs: Vec3, s: number): Vec3 {
    return new Vec3(
      this.x * (1 - s) + rhs.x * s,
      this.y * (1 - s) + rhs.y * s,
      this.z * (1 - s) + rhs.z * s,
    );
  }

  /**
   * Performs a linear interpolation between `this` and `rhs` based on the value `s`, using the
   * monotonic form `this.add(rhs.sub(this).mul(s))`.
   *
   * When `s` is `0.0`, the result will be equal to `this`. When `s` is `1.0`, the result will
   * be equal to `rhs`. When `s` is outside of the range `[0, 1]`, the result is linearly
   * extrapolated.
   *
   * Prefer this over `lerp()` when interpolating between values that may be equal or
   * nearly equal: the result is monotonic in `s` and equal inputs are preserved exactly, avoiding
   * the rounding jitter that `lerp()` can introduce. The tradeoff is that
   * `rhs.sub(this)` is evaluated first, so this is less accurate than `lerp()` when
   * `this` and `rhs` differ greatly in magnitude, and overflows to infinity when they have
   * opposite signs and large magnitudes.
   */
  lerpMonotonic(rhs: Vec3, s: number): Vec3 {
    return new Vec3(
      this.x + (rhs.x - this.x) * s,
      this.y + (rhs.y - this.y) * s,
      this.z + (rhs.z - this.z) * s,
    );
  }

  /**
   * Moves towards `rhs` based on the value `d`.
   *
   * When `d` is `0.0`, the result will be equal to `this`. When `d` is equal to
   * `this.distance(rhs)`, the result will be equal to `rhs`. Will not go past `rhs`.
   */
  moveTowards(rhs: Vec3, d: number): Vec3 {
    const len = this.distance(rhs);

    if (len <= d || len <= 1e-4) {
      return rhs.clone();
    }

    return new Vec3(
      this.x + ((rhs.x - this.x) / len) * d,
      this.y + ((rhs.y - this.y) / len) * d,
      this.z + ((rhs.z - this.z) / len) * d,
    );
  }

  /**
   * Calculates the midpoint between `this` and `rhs`.
   *
   * The midpoint is the average of, or halfway point between, two vectors.
   * `a.midpoint(b)` should yield the same result as `a.lerp(b, 0.5)`
   * while being slightly cheaper to compute.
   */
  midpoint(rhs: Vec3): Vec3 {
    return new Vec3((this.x + rhs.x) * 0.5, (this.y + rhs.y) * 0.5, (this.z + rhs.z) * 0.5);
  }

  /**
   * Returns true if the absolute difference of all elements between `this` and `rhs` is
   * less than or equal to `maxAbsDiff`.
   *
   * This can be used to compare if two vectors contain similar elements. It works best when
   * comparing with a known value. The `maxAbsDiff` that should be used used depends on
   * the values being compared against.
   *
   * For more see
   * [comparing floating point numbers](https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/).
   */
  absDiffEq(rhs: Vec3, maxAbsDiff: number): boolean {
    return (
      Math.abs(this.x - rhs.x) <= maxAbsDiff &&
      Math.abs(this.y - rhs.y) <= maxAbsDiff &&
      Math.abs(this.z - rhs.z) <= maxAbsDiff
    );
  }

  /** Returns a vector with a length no less than `min` and no more than `max`. */
  clampLength(min: number, max: number): Vec3 {
    const lengthSq = this.lengthSquared();

    if (lengthSq < min * min) {
      const length = Math.sqrt(lengthSq);

      return new Vec3((this.x / length) * min, (this.y / length) * min, (this.z / length) * min);
    }

    if (lengthSq > max * max) {
      const length = Math.sqrt(lengthSq);

      return new Vec3((this.x / length) * max, (this.y / length) * max, (this.z / length) * max);
    }

    return this.clone();
  }

  /** Returns a vector with a length no more than `max`. */
  clampLengthMax(max: number): Vec3 {
    const lengthSq = this.lengthSquared();

    if (lengthSq > max * max) {
      const length = Math.sqrt(lengthSq);

      return new Vec3((this.x / length) * max, (this.y / length) * max, (this.z / length) * max);
    }

    return this.clone();
  }

  /** Returns a vector with a length no less than `min`. */
  clampLengthMin(min: number): Vec3 {
    const lengthSq = this.lengthSquared();

    if (lengthSq < min * min) {
      const length = Math.sqrt(lengthSq);

      return new Vec3((this.x / length) * min, (this.y / length) * min, (this.z / length) * min);
    }

    return this.clone();
  }

  /** Computes `(this * a) + b` element-wise. */
  mulAdd(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(this.x * a.x + b.x, this.y * a.y + b.y, this.z * a.z + b.z);
  }

  /**
   * Returns the reflection vector for a given incident vector `this` and surface normal
   * `normal`.
   *
   * `normal` must be normalized.
   */
  reflect(normal: Vec3): Vec3 {
    const scale = 2 * this.dot(normal);

    return new Vec3(
      this.x - scale * normal.x,
      this.y - scale * normal.y,
      this.z - scale * normal.z,
    );
  }

  /**
   * Returns the refraction direction for a given incident vector `this`, surface normal
   * `normal` and ratio of indices of refraction, `eta`. When total internal reflection occurs,
   * a zero vector will be returned.
   *
   * `this` and `normal` must be normalized.
   */
  refract(normal: Vec3, eta: number): Vec3 {
    const nDotI = normal.dot(this);
    const k = 1 - eta * eta * (1 - nDotI * nDotI);

    if (k >= 0) {
      const scale = eta * nDotI + Math.sqrt(k);

      return new Vec3(
        eta * this.x - scale * normal.x,
        eta * this.y - scale * normal.y,
        eta * this.z - scale * normal.z,
      );
    }

    return Vec3.ZERO;
  }

  /**
   * Returns the angle (in radians) between two vectors in the range `[0, +π]`.
   *
   * For the full rotation between two vectors as a quaternion, see
   * `Quat.fromRotationArc()`.
   *
   * The inputs do not need to be unit vectors however they must be non-zero.
   */
  angleBetween(rhs: Vec3): number {
    const cos = this.dot(rhs) / Math.sqrt(this.lengthSquared() * rhs.lengthSquared());

    return Math.acos(Math.min(Math.max(cos, -1), 1));
  }

  /**
   * Returns the signed angle (in radians) from `this` to `rhs` around `axis`
   * in the range `[-π, +π]`.
   *
   * The `axis` must be a unit vector. The angle follows the right-hand rule
   * around `axis` and can be used with `rotateAxis()`, e.g.
   * `this.rotateAxis(axis, this.angleTo(rhs, axis))` will be equal to `rhs`.
   *
   * For the unsigned angle without a reference axis, see `angleBetween()`.
   *
   * The inputs do not need to be unit vectors however they must be non-zero.
   */
  angleTo(rhs: Vec3, axis: Vec3): number {
    const x = this.y * rhs.z - rhs.y * this.z;
    const y = this.z * rhs.x - rhs.z * this.x;
    const z = this.x * rhs.y - rhs.x * this.y;

    return Math.atan2(x * axis.x + y * axis.y + z * axis.z, this.dot(rhs));
  }

  /** Rotates around the x axis by `angle` (in radians). */
  rotateX(angle: number): Vec3 {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);

    return new Vec3(this.x, this.y * cosa - this.z * sina, this.y * sina + this.z * cosa);
  }

  /** Rotates around the y axis by `angle` (in radians). */
  rotateY(angle: number): Vec3 {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);

    return new Vec3(this.x * cosa + this.z * sina, this.y, this.x * -sina + this.z * cosa);
  }

  /** Rotates around the z axis by `angle` (in radians). */
  rotateZ(angle: number): Vec3 {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);

    return new Vec3(this.x * cosa - this.y * sina, this.x * sina + this.y * cosa, this.z);
  }

  /**
   * Rotates around `axis` by `angle` (in radians).
   *
   * The axis must be a unit vector.
   */
  rotateAxis(axis: Vec3, angle: number): Vec3 {
    return Vec3.#rotateAxisAngle(this, axis.x, axis.y, axis.z, angle, 1);
  }

  /**
   * Rotates towards `rhs` up to `maxAngle` (in radians).
   *
   * When `maxAngle` is `0.0`, the result will be equal to `this`. When `maxAngle` is equal to
   * `this.angleBetween(rhs)`, the result will be parallel to `rhs`. If `maxAngle` is negative,
   * rotates towards the exact opposite of `rhs`. Will not go past the target.
   */
  rotateTowards(rhs: Vec3, maxAngle: number): Vec3 {
    const angleBetween = this.angleBetween(rhs);
    const angle = Math.min(Math.max(maxAngle, angleBetween - Math.PI), angleBetween);
    const x = this.y * rhs.z - rhs.y * this.z;
    const y = this.z * rhs.x - rhs.z * this.x;
    const z = this.x * rhs.y - rhs.x * this.y;
    const lengthSquared = x * x + y * y + z * z;
    const rcp = 1 / Math.sqrt(lengthSquared);

    if (Number.isFinite(rcp) && rcp > 0) {
      return Vec3.#rotateAxisAngle(this, x * rcp, y * rcp, z * rcp, angle, 1);
    }

    const axis = this.anyOrthogonalVector().normalize();

    return Vec3.#rotateAxisAngle(this, axis.x, axis.y, axis.z, angle, 1);
  }

  /**
   * Returns some vector that is orthogonal to the given one.
   *
   * The input vector must be finite and non-zero.
   *
   * The output vector is not necessarily unit length. For that use
   * `anyOrthonormalVector()` instead.
   */
  anyOrthogonalVector(): Vec3 {
    if (Math.abs(this.x) > Math.abs(this.y)) {
      return new Vec3(-this.z, 0, this.x);
    }

    return new Vec3(0, this.z, -this.y);
  }

  /**
   * Returns any unit vector that is orthogonal to the given one.
   *
   * The input vector must be unit length.
   */
  anyOrthonormalVector(): Vec3 {
    const sign = Math.sign(this.z + 1 / this.z);
    const a = -1 / (sign + this.z);
    const b = this.x * this.y * a;

    return new Vec3(b, sign + this.y * this.y * a, -this.y);
  }

  /**
   * Given a unit vector return two other vectors that together form a right-handed orthonormal
   * basis. That is, all three vectors are orthogonal to each other and are normalized.
   */
  anyOrthonormalPair(): [Vec3, Vec3] {
    const sign = Math.sign(this.z + 1 / this.z);
    const a = -1 / (sign + this.z);
    const b = this.x * this.y * a;

    return [
      new Vec3(1 + sign * this.x * this.x * a, sign * b, -sign * this.x),
      new Vec3(b, sign + this.y * this.y * a, -this.y),
    ];
  }

  /**
   * Performs a spherical linear interpolation between `this` and `rhs` based on the value `s`.
   *
   * When `s` is `0.0`, the result will be equal to `this`.  When `s` is `1.0`, the result
   * will be equal to `rhs`. When `s` is outside of range `[0, 1]`, the result is linearly
   * extrapolated.
   */
  slerp(rhs: Vec3, s: number): Vec3 {
    const selfLength = this.length();
    const rhsLength = rhs.length();
    const dot = this.dot(rhs) / (selfLength * rhsLength);

    if (Math.abs(dot) < 1 - 3e-7) {
      const theta = Math.acos(dot);
      const t1 = Math.sin(theta * (1 - s));
      const t2 = Math.sin(theta * s);
      const resultLength = selfLength + (rhsLength - selfLength) * s;
      const selfScale = resultLength / selfLength;
      const rhsScale = resultLength / rhsLength;
      const sinThetaRecip = 1 / Math.sin(theta);

      return new Vec3(
        (this.x * selfScale * t1 + rhs.x * rhsScale * t2) * sinThetaRecip,
        (this.y * selfScale * t1 + rhs.y * rhsScale * t2) * sinThetaRecip,
        (this.z * selfScale * t1 + rhs.z * rhsScale * t2) * sinThetaRecip,
      );
    }

    if (dot < 0) {
      const axis = this.anyOrthogonalVector().normalize();
      const resultLength = selfLength + (rhsLength - selfLength) * s;

      return Vec3.#rotateAxisAngle(
        this,
        axis.x,
        axis.y,
        axis.z,
        Math.PI * s,
        resultLength / selfLength,
      );
    }

    return this.lerp(rhs, s);
  }

  div(rhs: Vec3 | number): Vec3 {
    if (typeof rhs === "number") {
      return new Vec3(this.x / rhs, this.y / rhs, this.z / rhs);
    }

    return new Vec3(this.x / rhs.x, this.y / rhs.y, this.z / rhs.z);
  }

  mul(rhs: Vec3 | number): Vec3 {
    if (typeof rhs === "number") {
      return new Vec3(this.x * rhs, this.y * rhs, this.z * rhs);
    }

    return new Vec3(this.x * rhs.x, this.y * rhs.y, this.z * rhs.z);
  }

  add(rhs: Vec3 | number): Vec3 {
    if (typeof rhs === "number") {
      return new Vec3(this.x + rhs, this.y + rhs, this.z + rhs);
    }

    return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
  }

  sub(rhs: Vec3 | number): Vec3 {
    if (typeof rhs === "number") {
      return new Vec3(this.x - rhs, this.y - rhs, this.z - rhs);
    }

    return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
  }

  rem(rhs: Vec3 | number): Vec3 {
    if (typeof rhs === "number") {
      return new Vec3(this.x % rhs, this.y % rhs, this.z % rhs);
    }

    return new Vec3(this.x % rhs.x, this.y % rhs.y, this.z % rhs.z);
  }

  neg(): Vec3 {
    return new Vec3(-this.x, -this.y, -this.z);
  }

  addAssign(rhs: Vec3 | number): this {
    if (typeof rhs === "number") {
      this.x += rhs;
      this.y += rhs;
      this.z += rhs;

      return this;
    }

    this.x += rhs.x;
    this.y += rhs.y;
    this.z += rhs.z;

    return this;
  }

  subAssign(rhs: Vec3 | number): this {
    if (typeof rhs === "number") {
      this.x -= rhs;
      this.y -= rhs;
      this.z -= rhs;

      return this;
    }

    this.x -= rhs.x;
    this.y -= rhs.y;
    this.z -= rhs.z;

    return this;
  }

  mulAssign(rhs: Vec3 | number): this {
    if (typeof rhs === "number") {
      this.x *= rhs;
      this.y *= rhs;
      this.z *= rhs;

      return this;
    }

    this.x *= rhs.x;
    this.y *= rhs.y;
    this.z *= rhs.z;

    return this;
  }

  divAssign(rhs: Vec3 | number): this {
    if (typeof rhs === "number") {
      this.x /= rhs;
      this.y /= rhs;
      this.z /= rhs;

      return this;
    }

    this.x /= rhs.x;
    this.y /= rhs.y;
    this.z /= rhs.z;

    return this;
  }

  remAssign(rhs: Vec3 | number): this {
    if (typeof rhs === "number") {
      this.x %= rhs;
      this.y %= rhs;
      this.z %= rhs;

      return this;
    }

    this.x %= rhs.x;
    this.y %= rhs.y;
    this.z %= rhs.z;

    return this;
  }

  eq(rhs: Vec3 | number): boolean {
    if (typeof rhs === "number") {
      return this.x === rhs && this.y === rhs && this.z === rhs;
    }

    return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
  }

  ne(rhs: Vec3 | number): boolean {
    if (typeof rhs === "number") {
      return this.x !== rhs || this.y !== rhs || this.z !== rhs;
    }

    return this.x !== rhs.x || this.y !== rhs.y || this.z !== rhs.z;
  }

  approxEq(rhs: Vec3 | number): boolean {
    const threshold = 1e-6;

    if (typeof rhs === "number") {
      return (
        Math.abs(this.x - rhs) < threshold &&
        Math.abs(this.y - rhs) < threshold &&
        Math.abs(this.z - rhs) < threshold
      );
    }

    return (
      Math.abs(this.x - rhs.x) < threshold &&
      Math.abs(this.y - rhs.y) < threshold &&
      Math.abs(this.z - rhs.z) < threshold
    );
  }

  toString() {
    return `Vec3(${this.x}, ${this.y}, ${this.z})`;
  }

  static #rotateAxisAngle(
    v: Vec3,
    axisX: number,
    axisY: number,
    axisZ: number,
    angle: number,
    scale: number,
  ): Vec3 {
    const sin = Math.sin(angle * 0.5);
    const x = axisX * sin;
    const y = axisY * sin;
    const z = axisZ * sin;
    const w = Math.cos(angle * 0.5);
    const k0 = w * w - (x * x + y * y + z * z);
    const k1 = (v.x * x + v.y * y + v.z * z) * 2;
    const k2 = w * 2;

    return new Vec3(
      (v.x * k0 + x * k1 + (y * v.z - z * v.y) * k2) * scale,
      (v.y * k0 + y * k1 + (z * v.x - x * v.z) * k2) * scale,
      (v.z * k0 + z * k1 + (x * v.y - y * v.x) * k2) * scale,
    );
  }
}

/** Creates a 3-dimensional vector. */
export function vec3(x: number, y: number, z: number): Vec3 {
  return new Vec3(x, y, z);
}
