import { BVec2 } from "./BVec2.js";
import { Vec3 } from "./Vec3.js";

/** A 2-dimensional vector. */
export class Vec2 {
  declare x: number;
  declare y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /** All zeroes. */
  static get ZERO() {
    return new Vec2(0, 0);
  }

  /** All ones. */
  static get ONE() {
    return new Vec2(1, 1);
  }

  /** All negative ones. */
  static get NEG_ONE() {
    return new Vec2(-1, -1);
  }

  /** All `-Number.MAX_VALUE`. */
  static get MIN() {
    return new Vec2(-Number.MAX_VALUE, -Number.MAX_VALUE);
  }

  /** All `Number.MAX_VALUE`. */
  static get MAX() {
    return new Vec2(Number.MAX_VALUE, Number.MAX_VALUE);
  }

  /** All `NaN`. */
  static get NAN() {
    return new Vec2(Number.NaN, Number.NaN);
  }

  /** All `Infinity`. */
  static get INFINITY() {
    return new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  }

  /** All `-Infinity`. */
  static get NEG_INFINITY() {
    return new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
  }

  /** A unit vector pointing along the positive X axis. */
  static get X() {
    return new Vec2(1, 0);
  }

  /** A unit vector pointing along the positive Y axis. */
  static get Y() {
    return new Vec2(0, 1);
  }

  /** A unit vector pointing along the negative X axis. */
  static get NEG_X() {
    return new Vec2(-1, 0);
  }

  /** A unit vector pointing along the negative Y axis. */
  static get NEG_Y() {
    return new Vec2(0, -1);
  }

  /** The unit axes. */
  static get AXES() {
    return [new Vec2(1, 0), new Vec2(0, 1)];
  }

  /** Creates a new vector. */
  static new(x: number, y: number): Vec2 {
    return new Vec2(x, y);
  }

  /** Creates a vector with all elements set to `v`. */
  static splat(v: number): Vec2 {
    return new Vec2(v, v);
  }

  /** Returns a vector containing each element of `this` modified by a mapping function `f`. */
  map(f: (value: number) => number): Vec2 {
    return new Vec2(f(this.x), f(this.y));
  }

  /**
   * Creates a vector from the elements in `ifTrue` and `ifFalse`, selecting which to use
   * for each element of `this`.
   *
   * A true element in the mask uses the corresponding element from `ifTrue`, and false
   * uses the element from `ifFalse`.
   */
  static select(mask: BVec2, ifTrue: Vec2, ifFalse: Vec2): Vec2 {
    return new Vec2(mask.x ? ifTrue.x : ifFalse.x, mask.y ? ifTrue.y : ifFalse.y);
  }

  /** Creates a new vector from an array. */
  static fromArray(a: [number, number]): Vec2 {
    return new Vec2(a[0], a[1]);
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /** Converts `this` to `[x, y]` */
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * Creates a vector from the first 2 values in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 2 elements long.
   */
  static fromSlice(slice: ArrayLike<number>): Vec2 {
    if (slice.length < 2) {
      throw new RangeError("slice is less than 2 elements long");
    }

    return new Vec2(slice[0] ?? Number.NaN, slice[1] ?? Number.NaN);
  }

  /**
   * Writes the elements of `this` to the first 2 elements in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 2 elements long.
   */
  writeToSlice(slice: { [index: number]: number; readonly length: number }): void {
    if (slice.length < 2) {
      throw new RangeError("slice is less than 2 elements long");
    }

    slice[0] = this.x;
    slice[1] = this.y;
  }

  /** Creates a 3D vector from `this` and the given `z` value. */
  extend(z: number): Vec3 {
    return new Vec3(this.x, this.y, z);
  }

  /** Creates a 2D vector from `this` with the given value of `x`. */
  withX(x: number): Vec2 {
    return new Vec2(x, this.y);
  }

  /** Creates a 2D vector from `this` with the given value of `y`. */
  withY(y: number): Vec2 {
    return new Vec2(this.x, y);
  }

  /** Computes the dot product of `this` and `rhs`. */
  dot(rhs: Vec2): number {
    return this.x * rhs.x + this.y * rhs.y;
  }

  /** Returns a vector where every component is the dot product of `this` and `rhs`. */
  dotIntoVec(rhs: Vec2): Vec2 {
    return Vec2.splat(this.dot(rhs));
  }

  /**
   * Returns a vector containing the minimum values for each element of `this` and `rhs`.
   *
   * In other words this computes `[min(x, rhs.x), min(this.y, rhs.y), ..]`.
   */
  min(rhs: Vec2): Vec2 {
    return new Vec2(Math.min(this.x, rhs.x), Math.min(this.y, rhs.y));
  }

  /**
   * Returns a vector containing the maximum values for each element of `this` and `rhs`.
   *
   * In other words this computes `[max(this.x, rhs.x), max(this.y, rhs.y), ..]`.
   */
  max(rhs: Vec2): Vec2 {
    return new Vec2(Math.max(this.x, rhs.x), Math.max(this.y, rhs.y));
  }

  /**
   * Component-wise clamping of values, similar to `Math.min(Math.max(value, min), max)`.
   *
   * Each element in `min` must be less-or-equal to the corresponding element in `max`.
   */
  clamp(min: Vec2, max: Vec2): Vec2 {
    return new Vec2(
      Math.min(Math.max(this.x, min.x), max.x),
      Math.min(Math.max(this.y, min.y), max.y),
    );
  }

  /**
   * Returns the horizontal minimum of `this`.
   *
   * In other words this computes `min(x, y, ..)`.
   */
  minElement(): number {
    return Math.min(this.x, this.y);
  }

  /**
   * Returns the horizontal maximum of `this`.
   *
   * In other words this computes `max(x, y, ..)`.
   */
  maxElement(): number {
    return Math.max(this.x, this.y);
  }

  /** Returns the index of the first minimum element of `this`. */
  minPosition(): number {
    return this.x <= this.y ? 0 : 1;
  }

  /** Returns the index of the first maximum element of `this`. */
  maxPosition(): number {
    return this.x >= this.y ? 0 : 1;
  }

  /**
   * Returns the sum of all elements of `this`.
   *
   * In other words, this computes `this.x + this.y + ..`.
   */
  elementSum(): number {
    return this.x + this.y;
  }

  /**
   * Returns the product of all elements of `this`.
   *
   * In other words, this computes `this.x * this.y * ..`.
   */
  elementProduct(): number {
    return this.x * this.y;
  }

  /**
   * Returns a vector mask containing the result of a `==` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words, this computes `[this.x == rhs.x, this.y == rhs.y, ..]` for all
   * elements.
   */
  cmpeq(rhs: Vec2): BVec2 {
    return new BVec2(this.x === rhs.x, this.y === rhs.y);
  }

  /**
   * Returns a vector mask containing the result of a `!=` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x != rhs.x, this.y != rhs.y, ..]` for all
   * elements.
   */
  cmpne(rhs: Vec2): BVec2 {
    return new BVec2(this.x !== rhs.x, this.y !== rhs.y);
  }

  /**
   * Returns a vector mask containing the result of a `>=` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x >= rhs.x, this.y >= rhs.y, ..]` for all
   * elements.
   */
  cmpge(rhs: Vec2): BVec2 {
    return new BVec2(this.x >= rhs.x, this.y >= rhs.y);
  }

  /**
   * Returns a vector mask containing the result of a `>` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x > rhs.x, this.y > rhs.y, ..]` for all
   * elements.
   */
  cmpgt(rhs: Vec2): BVec2 {
    return new BVec2(this.x > rhs.x, this.y > rhs.y);
  }

  /**
   * Returns a vector mask containing the result of a `<=` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x <= rhs.x, this.y <= rhs.y, ..]` for all
   * elements.
   */
  cmple(rhs: Vec2): BVec2 {
    return new BVec2(this.x <= rhs.x, this.y <= rhs.y);
  }

  /**
   * Returns a vector mask containing the result of a `<` comparison for each element of
   * `this` and `rhs`.
   *
   * In other words this computes `[this.x < rhs.x, this.y < rhs.y, ..]` for all
   * elements.
   */
  cmplt(rhs: Vec2): BVec2 {
    return new BVec2(this.x < rhs.x, this.y < rhs.y);
  }

  /** Returns a vector containing the absolute value of each element of `this`. */
  abs(): Vec2 {
    return new Vec2(Math.abs(this.x), Math.abs(this.y));
  }

  /**
   * Returns a vector with elements representing the sign of `this`.
   *
   * - `1.0` if the number is positive, `+0.0` or `Infinity`
   * - `-1.0` if the number is negative, `-0.0` or `-Infinity`
   * - `NaN` if the number is `NaN`
   */
  signum(): Vec2 {
    return new Vec2(Math.sign(this.x + 1 / this.x), Math.sign(this.y + 1 / this.y));
  }

  /** Returns a vector with signs of `rhs` and the magnitudes of `this`. */
  copysign(rhs: Vec2): Vec2 {
    return new Vec2(
      rhs.x + 1 / rhs.x < 0 ? -Math.abs(this.x) : Math.abs(this.x),
      rhs.y + 1 / rhs.y < 0 ? -Math.abs(this.y) : Math.abs(this.y),
    );
  }

  /**
   * Returns a bitmask with the lowest 2 bits set to the sign bits from the elements of `this`.
   *
   * A negative element results in a `1` bit and a positive element in a `0` bit.  Element `x` goes
   * into the first lowest bit, element `y` into the second, etc.
   *
   * An element is negative if it has a negative sign, including -0.0 and negative infinity.
   */
  isNegativeBitmask(): number {
    return (this.x + 1 / this.x < 0 ? 1 : 0) + (this.y + 1 / this.y < 0 ? 2 : 0);
  }

  /**
   * Returns a mask indicating which components are negative.
   *
   * An element is negative if it has a negative sign, including -0.0 and negative infinity.
   */
  isNegativeMask(): BVec2 {
    return new BVec2(this.x + 1 / this.x < 0, this.y + 1 / this.y < 0);
  }

  /**
   * Returns `true` if, and only if, all elements are finite.  If any element is either
   * `NaN`, positive or negative infinity, this will return `false`.
   */
  isFinite(): boolean {
    return Number.isFinite(this.x) && Number.isFinite(this.y);
  }

  /**
   * Performs `Number.isFinite` on each element of this, returning a vector mask of the results.
   *
   * In other words, this computes `[Number.isFinite(x), Number.isFinite(y), ...]`.
   */
  isFiniteMask(): BVec2 {
    return new BVec2(Number.isFinite(this.x), Number.isFinite(this.y));
  }

  /** Returns `true` if any elements are `NaN`. */
  isNan(): boolean {
    return Number.isNaN(this.x) || Number.isNaN(this.y);
  }

  /**
   * Performs `Number.isNaN` on each element of this, returning a vector mask of the results.
   *
   * In other words, this computes `[Number.isNaN(x), Number.isNaN(y), ...]`.
   */
  isNanMask(): BVec2 {
    return new BVec2(Number.isNaN(this.x), Number.isNaN(this.y));
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
  distance(rhs: Vec2): number {
    return Math.sqrt(this.distanceSquared(rhs));
  }

  /** Compute the squared euclidean distance between two points in space. */
  distanceSquared(rhs: Vec2): number {
    const x = this.x - rhs.x;
    const y = this.y - rhs.y;

    return x * x + y * y;
  }

  /** Returns the element-wise quotient of Euclidean division of `this` by `rhs`. */
  divEuclid(rhs: Vec2): Vec2 {
    return new Vec2(
      Math.trunc(this.x / rhs.x) - (this.x % rhs.x < 0 ? Math.sign(rhs.x) : 0),
      Math.trunc(this.y / rhs.y) - (this.y % rhs.y < 0 ? Math.sign(rhs.y) : 0),
    );
  }

  /** Returns the element-wise remainder of Euclidean division of `this` by `rhs`. */
  remEuclid(rhs: Vec2): Vec2 {
    const x = this.x % rhs.x;
    const y = this.y % rhs.y;

    return new Vec2(x < 0 ? x + Math.abs(rhs.x) : x, y < 0 ? y + Math.abs(rhs.y) : y);
  }

  /**
   * Returns `this` normalized to length 1.0.
   *
   * For valid results, `this` must be finite and _not_ of length zero, nor very close to zero.
   *
   * See also `tryNormalize()` and `normalizeOrZero()`.
   */
  normalize(): Vec2 {
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
  tryNormalize(): Vec2 | undefined {
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
  normalizeOr(fallback: Vec2): Vec2 {
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
  normalizeOrZero(): Vec2 {
    const rcp = this.lengthRecip();

    return Number.isFinite(rcp) && rcp > 0 ? this.mul(rcp) : Vec2.ZERO;
  }

  /**
   * Returns `this` normalized to length 1.0 and the length of `this`.
   *
   * If `this` is zero length then `[Vec2.X, 0.0]` is returned.
   */
  normalizeAndLength(): [Vec2, number] {
    const length = this.length();
    const rcp = 1 / length;

    return Number.isFinite(rcp) && rcp > 0 ? [this.mul(rcp), length] : [Vec2.X, 0];
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
  projectOnto(rhs: Vec2): Vec2 {
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
  rejectFrom(rhs: Vec2): Vec2 {
    const scale = this.dot(rhs) / rhs.dot(rhs);

    return new Vec2(this.x - rhs.x * scale, this.y - rhs.y * scale);
  }

  /**
   * Returns the vector projection of `this` onto `rhs`.
   *
   * `rhs` must be normalized.
   */
  projectOntoNormalized(rhs: Vec2): Vec2 {
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
  rejectFromNormalized(rhs: Vec2): Vec2 {
    const scale = this.dot(rhs);

    return new Vec2(this.x - rhs.x * scale, this.y - rhs.y * scale);
  }

  /**
   * Returns a vector containing the nearest integer to a number for each element of `this`.
   * Round half-way cases away from 0.0.
   */
  round(): Vec2 {
    return new Vec2(
      this.x < 0 ? -Math.round(-this.x) : Math.round(this.x),
      this.y < 0 ? -Math.round(-this.y) : Math.round(this.y),
    );
  }

  /**
   * Returns a vector containing the largest integer less than or equal to a number for each
   * element of `this`.
   */
  floor(): Vec2 {
    return new Vec2(Math.floor(this.x), Math.floor(this.y));
  }

  /**
   * Returns a vector containing the smallest integer greater than or equal to a number for
   * each element of `this`.
   */
  ceil(): Vec2 {
    return new Vec2(Math.ceil(this.x), Math.ceil(this.y));
  }

  /**
   * Returns a vector containing the integer part each element of `this`. This means numbers are
   * always truncated towards zero.
   */
  trunc(): Vec2 {
    return new Vec2(Math.trunc(this.x), Math.trunc(this.y));
  }

  /**
   * Returns a vector containing `0.0` if `rhs < this` and 1.0 otherwise.
   *
   * Similar to glsl's step(edge, x), which translates into edge.step(x)
   */
  step(rhs: Vec2): Vec2 {
    return new Vec2(rhs.x < this.x ? 0 : 1, rhs.y < this.y ? 0 : 1);
  }

  /**
   * Performs Hermite interpolation between `0.0` and `1.0` using `x` normalized to `[edge0, edge1]`.
   *
   * This is equivalent to `t * t * (3.0 - 2.0 * t)`, where `t` is clamped to `[0.0, 1.0]`.
   * Results are undefined if any element of `edge0` is greater than or equal to the corresponding
   * element of `edge1`.
   */
  smoothstep(edge0: Vec2, edge1: Vec2): Vec2 {
    const x = Math.min(Math.max((this.x - edge0.x) / (edge1.x - edge0.x), 0), 1);
    const y = Math.min(Math.max((this.y - edge0.y) / (edge1.y - edge0.y), 0), 1);

    return new Vec2(x * x * (3 - 2 * x), y * y * (3 - 2 * y));
  }

  /** Returns a vector containing all elements of `this` clamped to the range of `[0, 1]`. */
  saturate(): Vec2 {
    return new Vec2(Math.min(Math.max(this.x, 0), 1), Math.min(Math.max(this.y, 0), 1));
  }

  /**
   * Returns a vector containing the fractional part of the vector as `this.sub(this.trunc())`.
   *
   * Note that this differs from the GLSL implementation of `fract` which returns
   * `this.sub(this.floor())`.
   *
   * Note that this is fast but not precise for large numbers.
   */
  fract(): Vec2 {
    return new Vec2(this.x - Math.trunc(this.x), this.y - Math.trunc(this.y));
  }

  /**
   * Returns a vector containing the fractional part of the vector as `this.sub(this.floor())`.
   *
   * Note that this differs from the Rust implementation of `fract` which returns
   * `this.sub(this.trunc())`.
   *
   * Note that this is fast but not precise for large numbers.
   */
  fractGl(): Vec2 {
    return new Vec2(this.x - Math.floor(this.x), this.y - Math.floor(this.y));
  }

  /**
   * Returns a vector containing `e^this` (the exponential function) for each element of
   * `this`.
   */
  exp(): Vec2 {
    return new Vec2(Math.exp(this.x), Math.exp(this.y));
  }

  /** Returns a vector containing `2^this` for each element of `this`. */
  exp2(): Vec2 {
    return new Vec2(2 ** this.x, 2 ** this.y);
  }

  /**
   * Returns a vector containing the natural logarithm for each element of `this`.
   * This returns NaN when the element is negative and negative infinity when the element is zero.
   */
  ln(): Vec2 {
    return new Vec2(Math.log(this.x), Math.log(this.y));
  }

  /**
   * Returns a vector containing the base 2 logarithm for each element of `this`.
   * This returns NaN when the element is negative and negative infinity when the element is zero.
   */
  log2(): Vec2 {
    return new Vec2(Math.log2(this.x), Math.log2(this.y));
  }

  /** Returns a vector containing each element of `this` raised to the power of `n`. */
  powf(n: number): Vec2 {
    return new Vec2(this.x ** n, this.y ** n);
  }

  /**
   * Returns a vector containing the square root for each element of `this`.
   * This returns NaN when the element is negative.
   */
  sqrt(): Vec2 {
    return new Vec2(Math.sqrt(this.x), Math.sqrt(this.y));
  }

  /** Returns a vector containing the cosine for each element of `this`. */
  cos(): Vec2 {
    return new Vec2(Math.cos(this.x), Math.cos(this.y));
  }

  /** Returns a vector containing the sine for each element of `this`. */
  sin(): Vec2 {
    return new Vec2(Math.sin(this.x), Math.sin(this.y));
  }

  /** Returns a tuple of two vectors containing the sine and cosine for each element of `this`. */
  sinCos(): [Vec2, Vec2] {
    return [
      new Vec2(Math.sin(this.x), Math.sin(this.y)),
      new Vec2(Math.cos(this.x), Math.cos(this.y)),
    ];
  }

  /** Returns a vector containing the reciprocal `1.0/n` of each element of `this`. */
  recip(): Vec2 {
    return new Vec2(1 / this.x, 1 / this.y);
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
  lerp(rhs: Vec2, s: number): Vec2 {
    return new Vec2(this.x * (1 - s) + rhs.x * s, this.y * (1 - s) + rhs.y * s);
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
  lerpMonotonic(rhs: Vec2, s: number): Vec2 {
    return new Vec2(this.x + (rhs.x - this.x) * s, this.y + (rhs.y - this.y) * s);
  }

  /**
   * Moves towards `rhs` based on the value `d`.
   *
   * When `d` is `0.0`, the result will be equal to `this`. When `d` is equal to
   * `this.distance(rhs)`, the result will be equal to `rhs`. Will not go past `rhs`.
   */
  moveTowards(rhs: Vec2, d: number): Vec2 {
    const len = this.distance(rhs);

    if (len <= d || len <= 1e-4) {
      return rhs.clone();
    }

    return new Vec2(this.x + ((rhs.x - this.x) / len) * d, this.y + ((rhs.y - this.y) / len) * d);
  }

  /**
   * Calculates the midpoint between `this` and `rhs`.
   *
   * The midpoint is the average of, or halfway point between, two vectors.
   * `a.midpoint(b)` should yield the same result as `a.lerp(b, 0.5)`
   * while being slightly cheaper to compute.
   */
  midpoint(rhs: Vec2): Vec2 {
    return new Vec2((this.x + rhs.x) * 0.5, (this.y + rhs.y) * 0.5);
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
  absDiffEq(rhs: Vec2, maxAbsDiff: number): boolean {
    return Math.abs(this.x - rhs.x) <= maxAbsDiff && Math.abs(this.y - rhs.y) <= maxAbsDiff;
  }

  /** Returns a vector with a length no less than `min` and no more than `max`. */
  clampLength(min: number, max: number): Vec2 {
    const lengthSq = this.lengthSquared();

    if (lengthSq < min * min) {
      const length = Math.sqrt(lengthSq);

      return new Vec2((this.x / length) * min, (this.y / length) * min);
    }

    if (lengthSq > max * max) {
      const length = Math.sqrt(lengthSq);

      return new Vec2((this.x / length) * max, (this.y / length) * max);
    }

    return this.clone();
  }

  /** Returns a vector with a length no more than `max`. */
  clampLengthMax(max: number): Vec2 {
    const lengthSq = this.lengthSquared();

    if (lengthSq > max * max) {
      const length = Math.sqrt(lengthSq);

      return new Vec2((this.x / length) * max, (this.y / length) * max);
    }

    return this.clone();
  }

  /** Returns a vector with a length no less than `min`. */
  clampLengthMin(min: number): Vec2 {
    const lengthSq = this.lengthSquared();

    if (lengthSq < min * min) {
      const length = Math.sqrt(lengthSq);

      return new Vec2((this.x / length) * min, (this.y / length) * min);
    }

    return this.clone();
  }

  /** Computes `(this * a) + b` element-wise. */
  mulAdd(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(this.x * a.x + b.x, this.y * a.y + b.y);
  }

  /**
   * Returns the reflection vector for a given incident vector `this` and surface normal
   * `normal`.
   *
   * `normal` must be normalized.
   */
  reflect(normal: Vec2): Vec2 {
    const scale = 2 * this.dot(normal);

    return new Vec2(this.x - scale * normal.x, this.y - scale * normal.y);
  }

  /**
   * Returns the refraction direction for a given incident vector `this`, surface normal
   * `normal` and ratio of indices of refraction, `eta`. When total internal reflection occurs,
   * a zero vector will be returned.
   *
   * `this` and `normal` must be normalized.
   */
  refract(normal: Vec2, eta: number): Vec2 {
    const nDotI = normal.dot(this);
    const k = 1 - eta * eta * (1 - nDotI * nDotI);

    if (k >= 0) {
      const scale = eta * nDotI + Math.sqrt(k);

      return new Vec2(eta * this.x - scale * normal.x, eta * this.y - scale * normal.y);
    }

    return Vec2.ZERO;
  }

  /**
   * Creates a 2D vector containing `[Math.cos(angle), Math.sin(angle)]`. This can be used in
   * conjunction with the `rotate()` method, e.g.
   * `Vec2.fromAngle(Math.PI).rotate(Vec2.Y)` will create the vector `[-1, 0]`
   * and rotate `Vec2.Y` around it returning `Vec2.Y.neg()`.
   */
  static fromAngle(angle: number): Vec2 {
    return new Vec2(Math.cos(angle), Math.sin(angle));
  }

  /**
   * Returns the angle (in radians) of this vector in the range `[-π, +π]`.
   *
   * The input does not need to be a unit vector however it must be non-zero.
   */
  toAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Returns the angle of rotation (in radians) from `this` to `rhs` in the range `[-π, +π]`.
   *
   * The inputs do not need to be unit vectors however they must be non-zero.
   *
   * The returned angle can be used with `rotateAngle()`, e.g.
   * `this.rotateAngle(this.angleTo(rhs))` will be equal to `rhs`.
   */
  angleTo(rhs: Vec2): number {
    const cos = this.dot(rhs) / Math.sqrt(this.lengthSquared() * rhs.lengthSquared());
    const perpDot = this.perpDot(rhs);

    return Math.acos(Math.min(Math.max(cos, -1), 1)) * Math.sign(perpDot + 1 / perpDot);
  }

  /** Returns a vector that is equal to `this` rotated by 90 degrees. */
  perp(): Vec2 {
    return new Vec2(-this.y, this.x);
  }

  /**
   * The perpendicular dot product of `this` and `rhs`.
   * Also known as the wedge product, 2D cross product, and determinant.
   */
  perpDot(rhs: Vec2): number {
    return this.x * rhs.y - this.y * rhs.x;
  }

  /**
   * Returns `rhs` rotated by the angle of `this`. If `this` is normalized,
   * then this just rotation. This is what you usually want. Otherwise,
   * it will be like a rotation with a multiplication by `this`'s length.
   *
   * This can be used in conjunction with the `fromAngle()` method, e.g.
   * `Vec2.fromAngle(Math.PI).rotate(Vec2.Y)` will create the vector `[-1, 0]`
   * and rotate `Vec2.Y` around it returning `Vec2.Y.neg()`.
   */
  rotate(rhs: Vec2): Vec2 {
    return new Vec2(this.x * rhs.x - this.y * rhs.y, this.y * rhs.x + this.x * rhs.y);
  }

  /**
   * Rotates `this` by `angle` (in radians), equivalent to
   * `this.rotate(Vec2.fromAngle(angle))`.
   */
  rotateAngle(angle: number): Vec2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return new Vec2(this.x * cos - this.y * sin, this.y * cos + this.x * sin);
  }

  /**
   * Rotates towards `rhs` up to `maxAngle` (in radians).
   *
   * When `maxAngle` is `0.0`, the result will be equal to `this`. When `maxAngle` is equal to
   * `Math.abs(this.angleTo(rhs))`, the result will be parallel to `rhs`. If `maxAngle` is negative,
   * rotates towards the exact opposite of `rhs`. Will not go past the target.
   */
  rotateTowards(rhs: Vec2, maxAngle: number): Vec2 {
    const a = this.angleTo(rhs);
    const absA = Math.abs(a);
    const angle = Math.min(Math.max(maxAngle, absA - Math.PI), absA) * Math.sign(a + 1 / a);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return new Vec2(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
  }

  div(rhs: Vec2 | number): Vec2 {
    if (typeof rhs === "number") {
      return new Vec2(this.x / rhs, this.y / rhs);
    }

    return new Vec2(this.x / rhs.x, this.y / rhs.y);
  }

  mul(rhs: Vec2 | number): Vec2 {
    if (typeof rhs === "number") {
      return new Vec2(this.x * rhs, this.y * rhs);
    }

    return new Vec2(this.x * rhs.x, this.y * rhs.y);
  }

  add(rhs: Vec2 | number): Vec2 {
    if (typeof rhs === "number") {
      return new Vec2(this.x + rhs, this.y + rhs);
    }

    return new Vec2(this.x + rhs.x, this.y + rhs.y);
  }

  sub(rhs: Vec2 | number): Vec2 {
    if (typeof rhs === "number") {
      return new Vec2(this.x - rhs, this.y - rhs);
    }

    return new Vec2(this.x - rhs.x, this.y - rhs.y);
  }

  rem(rhs: Vec2 | number): Vec2 {
    if (typeof rhs === "number") {
      return new Vec2(this.x % rhs, this.y % rhs);
    }

    return new Vec2(this.x % rhs.x, this.y % rhs.y);
  }

  neg(): Vec2 {
    return new Vec2(-this.x, -this.y);
  }

  addAssign(rhs: Vec2 | number): this {
    if (typeof rhs === "number") {
      this.x += rhs;
      this.y += rhs;

      return this;
    }

    this.x += rhs.x;
    this.y += rhs.y;

    return this;
  }

  subAssign(rhs: Vec2 | number): this {
    if (typeof rhs === "number") {
      this.x -= rhs;
      this.y -= rhs;

      return this;
    }

    this.x -= rhs.x;
    this.y -= rhs.y;

    return this;
  }

  mulAssign(rhs: Vec2 | number): this {
    if (typeof rhs === "number") {
      this.x *= rhs;
      this.y *= rhs;

      return this;
    }

    this.x *= rhs.x;
    this.y *= rhs.y;

    return this;
  }

  divAssign(rhs: Vec2 | number): this {
    if (typeof rhs === "number") {
      this.x /= rhs;
      this.y /= rhs;

      return this;
    }

    this.x /= rhs.x;
    this.y /= rhs.y;

    return this;
  }

  remAssign(rhs: Vec2 | number): this {
    if (typeof rhs === "number") {
      this.x %= rhs;
      this.y %= rhs;

      return this;
    }

    this.x %= rhs.x;
    this.y %= rhs.y;

    return this;
  }

  eq(rhs: Vec2 | number): boolean {
    if (typeof rhs === "number") {
      return this.x === rhs && this.y === rhs;
    }

    return this.x === rhs.x && this.y === rhs.y;
  }

  ne(rhs: Vec2 | number): boolean {
    if (typeof rhs === "number") {
      return this.x !== rhs || this.y !== rhs;
    }

    return this.x !== rhs.x || this.y !== rhs.y;
  }

  approxEq(rhs: Vec2 | number): boolean {
    const threshold = 1e-6;

    if (typeof rhs === "number") {
      return Math.abs(this.x - rhs) < threshold && Math.abs(this.y - rhs) < threshold;
    }

    return Math.abs(this.x - rhs.x) < threshold && Math.abs(this.y - rhs.y) < threshold;
  }

  toString() {
    return `Vec2(${this.x}, ${this.y})`;
  }
}

/** Creates a 2-dimensional vector. */
export function vec2(x: number, y: number): Vec2 {
  return new Vec2(x, y);
}
