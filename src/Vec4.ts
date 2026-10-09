import { BVec4 } from "./BVec4.js";
import { Vec3 } from "./Vec3.js";

/** A 4-dimensional vector. */
export class Vec4 {
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

  /** All zeroes. */
  static get ZERO() {
    return new Vec4(0, 0, 0, 0);
  }

  /** All ones. */
  static get ONE() {
    return new Vec4(1, 1, 1, 1);
  }

  /** All negative ones. */
  static get NEG_ONE() {
    return new Vec4(-1, -1, -1, -1);
  }

  /** All `-Number.MAX_VALUE`. */
  static get MIN() {
    return new Vec4(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
  }

  /** All `Number.MAX_VALUE`. */
  static get MAX() {
    return new Vec4(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  }

  /** All `NaN`. */
  static get NAN() {
    return new Vec4(Number.NaN, Number.NaN, Number.NaN, Number.NaN);
  }

  /** All `Infinity`. */
  static get INFINITY() {
    return new Vec4(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    );
  }

  /** All `-Infinity`. */
  static get NEG_INFINITY() {
    return new Vec4(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    );
  }

  /** A unit vector pointing along the positive X axis. */
  static get X() {
    return new Vec4(1, 0, 0, 0);
  }

  /** A unit vector pointing along the positive Y axis. */
  static get Y() {
    return new Vec4(0, 1, 0, 0);
  }

  /** A unit vector pointing along the positive Z axis. */
  static get Z() {
    return new Vec4(0, 0, 1, 0);
  }

  /** A unit vector pointing along the positive W axis. */
  static get W() {
    return new Vec4(0, 0, 0, 1);
  }

  /** A unit vector pointing along the negative X axis. */
  static get NEG_X() {
    return new Vec4(-1, 0, 0, 0);
  }

  /** A unit vector pointing along the negative Y axis. */
  static get NEG_Y() {
    return new Vec4(0, -1, 0, 0);
  }

  /** A unit vector pointing along the negative Z axis. */
  static get NEG_Z() {
    return new Vec4(0, 0, -1, 0);
  }

  /** A unit vector pointing along the negative W axis. */
  static get NEG_W() {
    return new Vec4(0, 0, 0, -1);
  }

  /** The unit axes. */
  static get AXES() {
    return [new Vec4(1, 0, 0, 0), new Vec4(0, 1, 0, 0), new Vec4(0, 0, 1, 0), new Vec4(0, 0, 0, 1)];
  }

  /** Creates a new vector. */
  static new(x: number, y: number, z: number, w: number): Vec4 {
    return new Vec4(x, y, z, w);
  }

  /** Creates a vector with all elements set to `v`. */
  static splat(v: number): Vec4 {
    return new Vec4(v, v, v, v);
  }

  /** Returns a vector containing each element of `this` modified by a mapping function `f`. */
  map(f: (value: number) => number): Vec4 {
    return new Vec4(f(this.x), f(this.y), f(this.z), f(this.w));
  }

  /**
   * Creates a vector from the elements in `ifTrue` and `ifFalse`, selecting which to use
   * for each element of `this`.
   *
   * A true element in the mask uses the corresponding element from `ifTrue`, and false
   * uses the element from `ifFalse`.
   */
  static select(mask: BVec4, ifTrue: Vec4, ifFalse: Vec4): Vec4 {
    return new Vec4(
      mask.x ? ifTrue.x : ifFalse.x,
      mask.y ? ifTrue.y : ifFalse.y,
      mask.z ? ifTrue.z : ifFalse.z,
      mask.w ? ifTrue.w : ifFalse.w,
    );
  }

  /** Creates a new vector from an array. */
  static fromArray(a: [number, number, number, number]): Vec4 {
    return new Vec4(a[0], a[1], a[2], a[3]);
  }

  clone(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  /** Converts `this` to `[x, y, z, w]` */
  toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }

  /**
   * Creates a vector from the first 4 values in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 4 elements long.
   */
  static fromSlice(slice: ArrayLike<number>): Vec4 {
    if (slice.length < 4) {
      throw new RangeError("slice is less than 4 elements long");
    }

    return new Vec4(
      slice[0] ?? Number.NaN,
      slice[1] ?? Number.NaN,
      slice[2] ?? Number.NaN,
      slice[3] ?? Number.NaN,
    );
  }

  /**
   * Writes the elements of `this` to the first 4 elements in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 4 elements long.
   */
  writeToSlice(slice: { [index: number]: number; readonly length: number }): void {
    if (slice.length < 4) {
      throw new RangeError("slice is less than 4 elements long");
    }

    slice[0] = this.x;
    slice[1] = this.y;
    slice[2] = this.z;
    slice[3] = this.w;
  }

  /** Creates a 3D vector from the `x`, `y` and `z` elements of `this`, discarding `w`. */
  truncate(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /** Projects a homogeneous coordinate to 3D space by performing perspective divide. */
  project(): Vec3 {
    return Vec3.fromHomogeneous(this);
  }

  /** Creates a 4D vector from `this` with the given value of `x`. */
  withX(x: number): Vec4 {
    return new Vec4(x, this.y, this.z, this.w);
  }

  /** Creates a 4D vector from `this` with the given value of `y`. */
  withY(y: number): Vec4 {
    return new Vec4(this.x, y, this.z, this.w);
  }

  /** Creates a 4D vector from `this` with the given value of `z`. */
  withZ(z: number): Vec4 {
    return new Vec4(this.x, this.y, z, this.w);
  }

  /** Creates a 4D vector from `this` with the given value of `w`. */
  withW(w: number): Vec4 {
    return new Vec4(this.x, this.y, this.z, w);
  }

  /** Computes the dot product of `this` and `rhs`. */
  dot(rhs: Vec4): number {
    return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z + this.w * rhs.w;
  }

  /** Returns a vector where every component is the dot product of `this` and `rhs`. */
  dotIntoVec(rhs: Vec4): Vec4 {
    return Vec4.splat(this.dot(rhs));
  }

  /**
   * Returns a vector containing the minimum values for each element of `this` and `rhs`.
   *
   * In other words this computes `[min(x, rhs.x), min(this.y, rhs.y), ..]`.
   */
  min(rhs: Vec4): Vec4 {
    return new Vec4(
      Math.min(this.x, rhs.x),
      Math.min(this.y, rhs.y),
      Math.min(this.z, rhs.z),
      Math.min(this.w, rhs.w),
    );
  }

  /**
   * Returns a vector containing the maximum values for each element of `this` and `rhs`.
   *
   * In other words this computes `[max(this.x, rhs.x), max(this.y, rhs.y), ..]`.
   */
  max(rhs: Vec4): Vec4 {
    return new Vec4(
      Math.max(this.x, rhs.x),
      Math.max(this.y, rhs.y),
      Math.max(this.z, rhs.z),
      Math.max(this.w, rhs.w),
    );
  }

  /**
   * Component-wise clamping of values, similar to `Math.min(Math.max(value, min), max)`.
   *
   * Each element in `min` must be less-or-equal to the corresponding element in `max`.
   */
  clamp(min: Vec4, max: Vec4): Vec4 {
    return new Vec4(
      Math.min(Math.max(this.x, min.x), max.x),
      Math.min(Math.max(this.y, min.y), max.y),
      Math.min(Math.max(this.z, min.z), max.z),
      Math.min(Math.max(this.w, min.w), max.w),
    );
  }

  /**
   * Returns the horizontal minimum of `this`.
   *
   * In other words this computes `min(x, y, ..)`.
   */
  minElement(): number {
    return Math.min(this.x, this.y, this.z, this.w);
  }

  /**
   * Returns the horizontal maximum of `this`.
   *
   * In other words this computes `max(x, y, ..)`.
   */
  maxElement(): number {
    return Math.max(this.x, this.y, this.z, this.w);
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
      min = this.z;
      index = 2;
    }

    if (this.w < min) {
      index = 3;
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
      max = this.z;
      index = 2;
    }

    if (this.w > max) {
      index = 3;
    }

    return index;
  }

  /**
   * Returns the sum of all elements of `this`.
   *
   * In other words, this computes `this.x + this.y + ..`.
   */
  elementSum(): number {
    return this.x + this.y + this.z + this.w;
  }

  /**
   * Returns the product of all elements of `this`.
   *
   * In other words, this computes `this.x * this.y * ..`.
   */
  elementProduct(): number {
    return this.x * this.y * this.z * this.w;
  }

  /**
   * Returns a vector mask containing the result of a `==` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words, this computes `[this.x == rhs.x, this.y == rhs.y, ..]` for all
   * elements.
   */
  cmpeq(rhs: Vec4): BVec4 {
    return new BVec4(this.x === rhs.x, this.y === rhs.y, this.z === rhs.z, this.w === rhs.w);
  }

  /**
   * Returns a vector mask containing the result of a `!=` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x != rhs.x, this.y != rhs.y, ..]` for all
   * elements.
   */
  cmpne(rhs: Vec4): BVec4 {
    return new BVec4(this.x !== rhs.x, this.y !== rhs.y, this.z !== rhs.z, this.w !== rhs.w);
  }

  /**
   * Returns a vector mask containing the result of a `>=` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x >= rhs.x, this.y >= rhs.y, ..]` for all
   * elements.
   */
  cmpge(rhs: Vec4): BVec4 {
    return new BVec4(this.x >= rhs.x, this.y >= rhs.y, this.z >= rhs.z, this.w >= rhs.w);
  }

  /**
   * Returns a vector mask containing the result of a `>` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x > rhs.x, this.y > rhs.y, ..]` for all
   * elements.
   */
  cmpgt(rhs: Vec4): BVec4 {
    return new BVec4(this.x > rhs.x, this.y > rhs.y, this.z > rhs.z, this.w > rhs.w);
  }

  /**
   * Returns a vector mask containing the result of a `<=` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x <= rhs.x, this.y <= rhs.y, ..]` for all
   * elements.
   */
  cmple(rhs: Vec4): BVec4 {
    return new BVec4(this.x <= rhs.x, this.y <= rhs.y, this.z <= rhs.z, this.w <= rhs.w);
  }

  /**
   * Returns a vector mask containing the result of a `<` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x < rhs.x, this.y < rhs.y, ..]` for all
   * elements.
   */
  cmplt(rhs: Vec4): BVec4 {
    return new BVec4(this.x < rhs.x, this.y < rhs.y, this.z < rhs.z, this.w < rhs.w);
  }

  /** Returns a vector containing the absolute value of each element of `this`. */
  abs(): Vec4 {
    return new Vec4(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z), Math.abs(this.w));
  }

  /**
   * Returns a vector with elements representing the sign of `this`.
   *
   * - `1.0` if the number is positive, `+0.0` or `Infinity`
   * - `-1.0` if the number is negative, `-0.0` or `-Infinity`
   * - `NaN` if the number is `NaN`
   */
  signum(): Vec4 {
    return new Vec4(
      Math.sign(this.x + 1 / this.x),
      Math.sign(this.y + 1 / this.y),
      Math.sign(this.z + 1 / this.z),
      Math.sign(this.w + 1 / this.w),
    );
  }

  /** Returns a vector with signs of `rhs` and the magnitudes of `this`. */
  copysign(rhs: Vec4): Vec4 {
    return new Vec4(
      rhs.x + 1 / rhs.x < 0 ? -Math.abs(this.x) : Math.abs(this.x),
      rhs.y + 1 / rhs.y < 0 ? -Math.abs(this.y) : Math.abs(this.y),
      rhs.z + 1 / rhs.z < 0 ? -Math.abs(this.z) : Math.abs(this.z),
      rhs.w + 1 / rhs.w < 0 ? -Math.abs(this.w) : Math.abs(this.w),
    );
  }

  /**
   * Returns a bitmask with the lowest 4 bits set to the sign bits from the elements of `this`.
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
      (this.z + 1 / this.z < 0 ? 4 : 0) +
      (this.w + 1 / this.w < 0 ? 8 : 0)
    );
  }

  /**
   * Returns a mask indicating which components are negative.
   *
   * An element is negative if it has a negative sign, including -0.0 and negative infinity.
   */
  isNegativeMask(): BVec4 {
    return new BVec4(
      this.x + 1 / this.x < 0,
      this.y + 1 / this.y < 0,
      this.z + 1 / this.z < 0,
      this.w + 1 / this.w < 0,
    );
  }

  /**
   * Returns `true` if, and only if, all elements are finite.  If any element is either
   * `NaN`, positive or negative infinity, this will return `false`.
   */
  isFinite(): boolean {
    return (
      Number.isFinite(this.x) &&
      Number.isFinite(this.y) &&
      Number.isFinite(this.z) &&
      Number.isFinite(this.w)
    );
  }

  /**
   * Performs `Number.isFinite` on each element of this, returning a vector mask of the results.
   *
   * In other words, this computes `[Number.isFinite(x), Number.isFinite(y), ...]`.
   */
  isFiniteMask(): BVec4 {
    return new BVec4(
      Number.isFinite(this.x),
      Number.isFinite(this.y),
      Number.isFinite(this.z),
      Number.isFinite(this.w),
    );
  }

  /** Returns `true` if any elements are `NaN`. */
  isNan(): boolean {
    return (
      Number.isNaN(this.x) || Number.isNaN(this.y) || Number.isNaN(this.z) || Number.isNaN(this.w)
    );
  }

  /**
   * Performs `Number.isNaN` on each element of this, returning a vector mask of the results.
   *
   * In other words, this computes `[Number.isNaN(x), Number.isNaN(y), ...]`.
   */
  isNanMask(): BVec4 {
    return new BVec4(
      Number.isNaN(this.x),
      Number.isNaN(this.y),
      Number.isNaN(this.z),
      Number.isNaN(this.w),
    );
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
  distance(rhs: Vec4): number {
    return Math.sqrt(this.distanceSquared(rhs));
  }

  /** Compute the squared euclidean distance between two points in space. */
  distanceSquared(rhs: Vec4): number {
    const x = this.x - rhs.x;
    const y = this.y - rhs.y;
    const z = this.z - rhs.z;
    const w = this.w - rhs.w;

    return x * x + y * y + z * z + w * w;
  }

  /** Returns the element-wise quotient of Euclidean division of `this` by `rhs`. */
  divEuclid(rhs: Vec4): Vec4 {
    return new Vec4(
      Math.trunc(this.x / rhs.x) - (this.x % rhs.x < 0 ? Math.sign(rhs.x) : 0),
      Math.trunc(this.y / rhs.y) - (this.y % rhs.y < 0 ? Math.sign(rhs.y) : 0),
      Math.trunc(this.z / rhs.z) - (this.z % rhs.z < 0 ? Math.sign(rhs.z) : 0),
      Math.trunc(this.w / rhs.w) - (this.w % rhs.w < 0 ? Math.sign(rhs.w) : 0),
    );
  }

  /** Returns the element-wise remainder of Euclidean division of `this` by `rhs`. */
  remEuclid(rhs: Vec4): Vec4 {
    const x = this.x % rhs.x;
    const y = this.y % rhs.y;
    const z = this.z % rhs.z;
    const w = this.w % rhs.w;

    return new Vec4(
      x < 0 ? x + Math.abs(rhs.x) : x,
      y < 0 ? y + Math.abs(rhs.y) : y,
      z < 0 ? z + Math.abs(rhs.z) : z,
      w < 0 ? w + Math.abs(rhs.w) : w,
    );
  }

  /**
   * Returns `this` normalized to length 1.0.
   *
   * For valid results, `this` must be finite and _not_ of length zero, nor very close to zero.
   *
   * See also `tryNormalize()` and `normalizeOrZero()`.
   */
  normalize(): Vec4 {
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
  tryNormalize(): Vec4 | undefined {
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
  normalizeOr(fallback: Vec4): Vec4 {
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
  normalizeOrZero(): Vec4 {
    const rcp = this.lengthRecip();

    return Number.isFinite(rcp) && rcp > 0 ? this.mul(rcp) : Vec4.ZERO;
  }

  /**
   * Returns `this` normalized to length 1.0 and the length of `this`.
   *
   * If `this` is zero length then `[Vec4.X, 0.0]` is returned.
   */
  normalizeAndLength(): [Vec4, number] {
    const length = this.length();
    const rcp = 1 / length;

    return Number.isFinite(rcp) && rcp > 0 ? [this.mul(rcp), length] : [Vec4.X, 0];
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
  projectOnto(rhs: Vec4): Vec4 {
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
  rejectFrom(rhs: Vec4): Vec4 {
    const scale = this.dot(rhs) / rhs.dot(rhs);

    return new Vec4(
      this.x - rhs.x * scale,
      this.y - rhs.y * scale,
      this.z - rhs.z * scale,
      this.w - rhs.w * scale,
    );
  }

  /**
   * Returns the vector projection of `this` onto `rhs`.
   *
   * `rhs` must be normalized.
   */
  projectOntoNormalized(rhs: Vec4): Vec4 {
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
  rejectFromNormalized(rhs: Vec4): Vec4 {
    const scale = this.dot(rhs);

    return new Vec4(
      this.x - rhs.x * scale,
      this.y - rhs.y * scale,
      this.z - rhs.z * scale,
      this.w - rhs.w * scale,
    );
  }

  /**
   * Returns a vector containing the nearest integer to a number for each element of `this`.
   * Round half-way cases away from 0.0.
   */
  round(): Vec4 {
    return new Vec4(
      this.x < 0 ? -Math.round(-this.x) : Math.round(this.x),
      this.y < 0 ? -Math.round(-this.y) : Math.round(this.y),
      this.z < 0 ? -Math.round(-this.z) : Math.round(this.z),
      this.w < 0 ? -Math.round(-this.w) : Math.round(this.w),
    );
  }

  /**
   * Returns a vector containing the largest integer less than or equal to a number for each
   * element of `this`.
   */
  floor(): Vec4 {
    return new Vec4(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z), Math.floor(this.w));
  }

  /**
   * Returns a vector containing the smallest integer greater than or equal to a number for
   * each element of `this`.
   */
  ceil(): Vec4 {
    return new Vec4(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z), Math.ceil(this.w));
  }

  /**
   * Returns a vector containing the integer part each element of `this`. This means numbers are
   * always truncated towards zero.
   */
  trunc(): Vec4 {
    return new Vec4(Math.trunc(this.x), Math.trunc(this.y), Math.trunc(this.z), Math.trunc(this.w));
  }

  /**
   * Returns a vector containing `0.0` if `rhs < this` and 1.0 otherwise.
   *
   * Similar to glsl's step(edge, x), which translates into edge.step(x)
   */
  step(rhs: Vec4): Vec4 {
    return new Vec4(
      rhs.x < this.x ? 0 : 1,
      rhs.y < this.y ? 0 : 1,
      rhs.z < this.z ? 0 : 1,
      rhs.w < this.w ? 0 : 1,
    );
  }

  /**
   * Performs Hermite interpolation between `0.0` and `1.0` using `x` normalized to `[edge0, edge1]`.
   *
   * This is equivalent to `t * t * (3.0 - 2.0 * t)`, where `t` is clamped to `[0.0, 1.0]`.
   * Results are undefined if any element of `edge0` is greater than or equal to the corresponding
   * element of `edge1`.
   */
  smoothstep(edge0: Vec4, edge1: Vec4): Vec4 {
    const x = Math.min(Math.max((this.x - edge0.x) / (edge1.x - edge0.x), 0), 1);
    const y = Math.min(Math.max((this.y - edge0.y) / (edge1.y - edge0.y), 0), 1);
    const z = Math.min(Math.max((this.z - edge0.z) / (edge1.z - edge0.z), 0), 1);
    const w = Math.min(Math.max((this.w - edge0.w) / (edge1.w - edge0.w), 0), 1);

    return new Vec4(
      x * x * (3 - 2 * x),
      y * y * (3 - 2 * y),
      z * z * (3 - 2 * z),
      w * w * (3 - 2 * w),
    );
  }

  /** Returns a vector containing all elements of `this` clamped to the range of `[0, 1]`. */
  saturate(): Vec4 {
    return new Vec4(
      Math.min(Math.max(this.x, 0), 1),
      Math.min(Math.max(this.y, 0), 1),
      Math.min(Math.max(this.z, 0), 1),
      Math.min(Math.max(this.w, 0), 1),
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
  fract(): Vec4 {
    return new Vec4(
      this.x - Math.trunc(this.x),
      this.y - Math.trunc(this.y),
      this.z - Math.trunc(this.z),
      this.w - Math.trunc(this.w),
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
  fractGl(): Vec4 {
    return new Vec4(
      this.x - Math.floor(this.x),
      this.y - Math.floor(this.y),
      this.z - Math.floor(this.z),
      this.w - Math.floor(this.w),
    );
  }

  /**
   * Returns a vector containing `e^this` (the exponential function) for each element of
   * `this`.
   */
  exp(): Vec4 {
    return new Vec4(Math.exp(this.x), Math.exp(this.y), Math.exp(this.z), Math.exp(this.w));
  }

  /** Returns a vector containing `2^this` for each element of `this`. */
  exp2(): Vec4 {
    return new Vec4(2 ** this.x, 2 ** this.y, 2 ** this.z, 2 ** this.w);
  }

  /**
   * Returns a vector containing the natural logarithm for each element of `this`.
   * This returns NaN when the element is negative and negative infinity when the element is zero.
   */
  ln(): Vec4 {
    return new Vec4(Math.log(this.x), Math.log(this.y), Math.log(this.z), Math.log(this.w));
  }

  /**
   * Returns a vector containing the base 2 logarithm for each element of `this`.
   * This returns NaN when the element is negative and negative infinity when the element is zero.
   */
  log2(): Vec4 {
    return new Vec4(Math.log2(this.x), Math.log2(this.y), Math.log2(this.z), Math.log2(this.w));
  }

  /** Returns a vector containing each element of `this` raised to the power of `n`. */
  powf(n: number): Vec4 {
    return new Vec4(this.x ** n, this.y ** n, this.z ** n, this.w ** n);
  }

  /**
   * Returns a vector containing the square root for each element of `this`.
   * This returns NaN when the element is negative.
   */
  sqrt(): Vec4 {
    return new Vec4(Math.sqrt(this.x), Math.sqrt(this.y), Math.sqrt(this.z), Math.sqrt(this.w));
  }

  /** Returns a vector containing the cosine for each element of `this`. */
  cos(): Vec4 {
    return new Vec4(Math.cos(this.x), Math.cos(this.y), Math.cos(this.z), Math.cos(this.w));
  }

  /** Returns a vector containing the sine for each element of `this`. */
  sin(): Vec4 {
    return new Vec4(Math.sin(this.x), Math.sin(this.y), Math.sin(this.z), Math.sin(this.w));
  }

  /** Returns a tuple of two vectors containing the sine and cosine for each element of `this`. */
  sinCos(): [Vec4, Vec4] {
    return [
      new Vec4(Math.sin(this.x), Math.sin(this.y), Math.sin(this.z), Math.sin(this.w)),
      new Vec4(Math.cos(this.x), Math.cos(this.y), Math.cos(this.z), Math.cos(this.w)),
    ];
  }

  /** Returns a vector containing the reciprocal `1.0/n` of each element of `this`. */
  recip(): Vec4 {
    return new Vec4(1 / this.x, 1 / this.y, 1 / this.z, 1 / this.w);
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
  lerp(rhs: Vec4, s: number): Vec4 {
    return new Vec4(
      this.x * (1 - s) + rhs.x * s,
      this.y * (1 - s) + rhs.y * s,
      this.z * (1 - s) + rhs.z * s,
      this.w * (1 - s) + rhs.w * s,
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
  lerpMonotonic(rhs: Vec4, s: number): Vec4 {
    return new Vec4(
      this.x + (rhs.x - this.x) * s,
      this.y + (rhs.y - this.y) * s,
      this.z + (rhs.z - this.z) * s,
      this.w + (rhs.w - this.w) * s,
    );
  }

  /**
   * Moves towards `rhs` based on the value `d`.
   *
   * When `d` is `0.0`, the result will be equal to `this`. When `d` is equal to
   * `this.distance(rhs)`, the result will be equal to `rhs`. Will not go past `rhs`.
   */
  moveTowards(rhs: Vec4, d: number): Vec4 {
    const len = this.distance(rhs);

    if (len <= d || len <= 1e-4) {
      return rhs.clone();
    }

    return new Vec4(
      this.x + ((rhs.x - this.x) / len) * d,
      this.y + ((rhs.y - this.y) / len) * d,
      this.z + ((rhs.z - this.z) / len) * d,
      this.w + ((rhs.w - this.w) / len) * d,
    );
  }

  /**
   * Calculates the midpoint between `this` and `rhs`.
   *
   * The midpoint is the average of, or halfway point between, two vectors.
   * `a.midpoint(b)` should yield the same result as `a.lerp(b, 0.5)`
   * while being slightly cheaper to compute.
   */
  midpoint(rhs: Vec4): Vec4 {
    return new Vec4(
      (this.x + rhs.x) * 0.5,
      (this.y + rhs.y) * 0.5,
      (this.z + rhs.z) * 0.5,
      (this.w + rhs.w) * 0.5,
    );
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
  absDiffEq(rhs: Vec4, maxAbsDiff: number): boolean {
    return (
      Math.abs(this.x - rhs.x) <= maxAbsDiff &&
      Math.abs(this.y - rhs.y) <= maxAbsDiff &&
      Math.abs(this.z - rhs.z) <= maxAbsDiff &&
      Math.abs(this.w - rhs.w) <= maxAbsDiff
    );
  }

  /** Returns a vector with a length no less than `min` and no more than `max`. */
  clampLength(min: number, max: number): Vec4 {
    const lengthSq = this.lengthSquared();

    if (lengthSq < min * min) {
      const length = Math.sqrt(lengthSq);

      return new Vec4(
        (this.x / length) * min,
        (this.y / length) * min,
        (this.z / length) * min,
        (this.w / length) * min,
      );
    }

    if (lengthSq > max * max) {
      const length = Math.sqrt(lengthSq);

      return new Vec4(
        (this.x / length) * max,
        (this.y / length) * max,
        (this.z / length) * max,
        (this.w / length) * max,
      );
    }

    return this.clone();
  }

  /** Returns a vector with a length no more than `max`. */
  clampLengthMax(max: number): Vec4 {
    const lengthSq = this.lengthSquared();

    if (lengthSq > max * max) {
      const length = Math.sqrt(lengthSq);

      return new Vec4(
        (this.x / length) * max,
        (this.y / length) * max,
        (this.z / length) * max,
        (this.w / length) * max,
      );
    }

    return this.clone();
  }

  /** Returns a vector with a length no less than `min`. */
  clampLengthMin(min: number): Vec4 {
    const lengthSq = this.lengthSquared();

    if (lengthSq < min * min) {
      const length = Math.sqrt(lengthSq);

      return new Vec4(
        (this.x / length) * min,
        (this.y / length) * min,
        (this.z / length) * min,
        (this.w / length) * min,
      );
    }

    return this.clone();
  }

  /** Computes `(this * a) + b` element-wise. */
  mulAdd(a: Vec4, b: Vec4): Vec4 {
    return new Vec4(this.x * a.x + b.x, this.y * a.y + b.y, this.z * a.z + b.z, this.w * a.w + b.w);
  }

  /**
   * Returns the reflection vector for a given incident vector `this` and surface normal
   * `normal`.
   *
   * `normal` must be normalized.
   */
  reflect(normal: Vec4): Vec4 {
    const scale = 2 * this.dot(normal);

    return new Vec4(
      this.x - scale * normal.x,
      this.y - scale * normal.y,
      this.z - scale * normal.z,
      this.w - scale * normal.w,
    );
  }

  /**
   * Returns the refraction direction for a given incident vector `this`, surface normal
   * `normal` and ratio of indices of refraction, `eta`. When total internal reflection occurs,
   * a zero vector will be returned.
   *
   * `this` and `normal` must be normalized.
   */
  refract(normal: Vec4, eta: number): Vec4 {
    const nDotI = normal.dot(this);
    const k = 1 - eta * eta * (1 - nDotI * nDotI);

    if (k >= 0) {
      const scale = eta * nDotI + Math.sqrt(k);

      return new Vec4(
        eta * this.x - scale * normal.x,
        eta * this.y - scale * normal.y,
        eta * this.z - scale * normal.z,
        eta * this.w - scale * normal.w,
      );
    }

    return Vec4.ZERO;
  }

  angleBetween(rhs: Vec4): number {
    const cos = this.dot(rhs) / Math.sqrt(this.lengthSquared() * rhs.lengthSquared());

    return Math.acos(Math.min(Math.max(cos, -1), 1));
  }

  div(rhs: Vec4 | number): Vec4 {
    if (typeof rhs === "number") {
      return new Vec4(this.x / rhs, this.y / rhs, this.z / rhs, this.w / rhs);
    }

    return new Vec4(this.x / rhs.x, this.y / rhs.y, this.z / rhs.z, this.w / rhs.w);
  }

  mul(rhs: Vec4 | number): Vec4 {
    if (typeof rhs === "number") {
      return new Vec4(this.x * rhs, this.y * rhs, this.z * rhs, this.w * rhs);
    }

    return new Vec4(this.x * rhs.x, this.y * rhs.y, this.z * rhs.z, this.w * rhs.w);
  }

  add(rhs: Vec4 | number): Vec4 {
    if (typeof rhs === "number") {
      return new Vec4(this.x + rhs, this.y + rhs, this.z + rhs, this.w + rhs);
    }

    return new Vec4(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, this.w + rhs.w);
  }

  sub(rhs: Vec4 | number): Vec4 {
    if (typeof rhs === "number") {
      return new Vec4(this.x - rhs, this.y - rhs, this.z - rhs, this.w - rhs);
    }

    return new Vec4(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z, this.w - rhs.w);
  }

  rem(rhs: Vec4 | number): Vec4 {
    if (typeof rhs === "number") {
      return new Vec4(this.x % rhs, this.y % rhs, this.z % rhs, this.w % rhs);
    }

    return new Vec4(this.x % rhs.x, this.y % rhs.y, this.z % rhs.z, this.w % rhs.w);
  }

  neg(): Vec4 {
    return new Vec4(-this.x, -this.y, -this.z, -this.w);
  }

  addAssign(rhs: Vec4 | number): this {
    if (typeof rhs === "number") {
      this.x += rhs;
      this.y += rhs;
      this.z += rhs;
      this.w += rhs;

      return this;
    }

    this.x += rhs.x;
    this.y += rhs.y;
    this.z += rhs.z;
    this.w += rhs.w;

    return this;
  }

  subAssign(rhs: Vec4 | number): this {
    if (typeof rhs === "number") {
      this.x -= rhs;
      this.y -= rhs;
      this.z -= rhs;
      this.w -= rhs;

      return this;
    }

    this.x -= rhs.x;
    this.y -= rhs.y;
    this.z -= rhs.z;
    this.w -= rhs.w;

    return this;
  }

  mulAssign(rhs: Vec4 | number): this {
    if (typeof rhs === "number") {
      this.x *= rhs;
      this.y *= rhs;
      this.z *= rhs;
      this.w *= rhs;

      return this;
    }

    this.x *= rhs.x;
    this.y *= rhs.y;
    this.z *= rhs.z;
    this.w *= rhs.w;

    return this;
  }

  divAssign(rhs: Vec4 | number): this {
    if (typeof rhs === "number") {
      this.x /= rhs;
      this.y /= rhs;
      this.z /= rhs;
      this.w /= rhs;

      return this;
    }

    this.x /= rhs.x;
    this.y /= rhs.y;
    this.z /= rhs.z;
    this.w /= rhs.w;

    return this;
  }

  remAssign(rhs: Vec4 | number): this {
    if (typeof rhs === "number") {
      this.x %= rhs;
      this.y %= rhs;
      this.z %= rhs;
      this.w %= rhs;

      return this;
    }

    this.x %= rhs.x;
    this.y %= rhs.y;
    this.z %= rhs.z;
    this.w %= rhs.w;

    return this;
  }

  eq(rhs: Vec4 | number): boolean {
    if (typeof rhs === "number") {
      return this.x === rhs && this.y === rhs && this.z === rhs && this.w === rhs;
    }

    return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z && this.w === rhs.w;
  }

  ne(rhs: Vec4 | number): boolean {
    if (typeof rhs === "number") {
      return this.x !== rhs || this.y !== rhs || this.z !== rhs || this.w !== rhs;
    }

    return this.x !== rhs.x || this.y !== rhs.y || this.z !== rhs.z || this.w !== rhs.w;
  }

  approxEq(rhs: Vec4 | number): boolean {
    const threshold = 1e-6;

    if (typeof rhs === "number") {
      return (
        Math.abs(this.x - rhs) < threshold &&
        Math.abs(this.y - rhs) < threshold &&
        Math.abs(this.z - rhs) < threshold &&
        Math.abs(this.w - rhs) < threshold
      );
    }

    return (
      Math.abs(this.x - rhs.x) < threshold &&
      Math.abs(this.y - rhs.y) < threshold &&
      Math.abs(this.z - rhs.z) < threshold &&
      Math.abs(this.w - rhs.w) < threshold
    );
  }

  toString() {
    return `Vec4(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }
}

/** Creates a 4-dimensional vector. */
export function vec4(x: number, y: number, z: number, w: number): Vec4 {
  return new Vec4(x, y, z, w);
}
