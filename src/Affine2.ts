import { Mat2 } from "./Mat2.js";
import { Mat3 } from "./Mat3.js";
import { Vec2 } from "./Vec2.js";
import { Vec3 } from "./Vec3.js";

/** A 2D affine transform, which can represent translation, rotation, scaling and shear. */
export class Affine2 {
  declare matrix2: Mat2;
  declare translation: Vec2;

  constructor(matrix2: Mat2, translation: Vec2) {
    this.matrix2 = matrix2;
    this.translation = translation;
  }

  /**
   * The degenerate zero transform.
   *
   * This transforms any finite vector and point to zero.
   * The zero transform is non-invertible.
   */
  static get ZERO() {
    return new Affine2(new Mat2(new Vec2(0, 0), new Vec2(0, 0)), new Vec2(0, 0));
  }

  /**
   * The identity transform.
   *
   * Multiplying a vector with this returns the same vector.
   */
  static get IDENTITY() {
    return new Affine2(new Mat2(new Vec2(1, 0), new Vec2(0, 1)), new Vec2(0, 0));
  }

  /** All NAN:s. */
  static get NAN() {
    return new Affine2(
      new Mat2(new Vec2(Number.NaN, Number.NaN), new Vec2(Number.NaN, Number.NaN)),
      new Vec2(Number.NaN, Number.NaN),
    );
  }

  /** Creates an affine transform from three column vectors. */
  static fromCols(xAxis: Vec2, yAxis: Vec2, zAxis: Vec2): Affine2 {
    return new Affine2(new Mat2(xAxis, yAxis), zAxis);
  }

  /** Creates an affine transform from a `[number; 6]` array stored in column major order. */
  static fromColsArray(m: [number, number, number, number, number, number]): Affine2 {
    return new Affine2(new Mat2(new Vec2(m[0], m[1]), new Vec2(m[2], m[3])), new Vec2(m[4], m[5]));
  }

  /** Creates a `[number; 6]` array storing data in column major order. */
  toColsArray(): [number, number, number, number, number, number] {
    return [
      this.matrix2.xAxis.x,
      this.matrix2.xAxis.y,
      this.matrix2.yAxis.x,
      this.matrix2.yAxis.y,
      this.translation.x,
      this.translation.y,
    ];
  }

  /**
   * Creates an affine transform from a `[[number; 2]; 3]`
   * 2D array stored in column major order.
   * If your data is in row major order you will need to `transpose` the returned
   * matrix.
   */
  static fromColsArray2d(m: [[number, number], [number, number], [number, number]]): Affine2 {
    return new Affine2(
      new Mat2(new Vec2(m[0][0], m[0][1]), new Vec2(m[1][0], m[1][1])),
      new Vec2(m[2][0], m[2][1]),
    );
  }

  /**
   * Creates a `[[number; 2]; 3]` 2D array storing data in
   * column major order.
   * If you require data in row major order `transpose` the matrix first.
   */
  toColsArray2d(): [[number, number], [number, number], [number, number]] {
    return [
      [this.matrix2.xAxis.x, this.matrix2.xAxis.y],
      [this.matrix2.yAxis.x, this.matrix2.yAxis.y],
      [this.translation.x, this.translation.y],
    ];
  }

  /**
   * Creates an affine transform from the first 6 values in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 6 elements long.
   */
  static fromColsSlice(slice: ArrayLike<number>): Affine2 {
    return new Affine2(
      new Mat2(
        new Vec2(Affine2.#sliceElement(slice, 0), Affine2.#sliceElement(slice, 1)),
        new Vec2(Affine2.#sliceElement(slice, 2), Affine2.#sliceElement(slice, 3)),
      ),
      new Vec2(Affine2.#sliceElement(slice, 4), Affine2.#sliceElement(slice, 5)),
    );
  }

  /**
   * Writes the columns of `this` to the first 6 elements in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 6 elements long.
   */
  writeColsToSlice(slice: { [index: number]: number; readonly length: number }): void {
    if (slice.length < 6) {
      throw new RangeError("index out of bounds");
    }

    slice[0] = this.matrix2.xAxis.x;
    slice[1] = this.matrix2.xAxis.y;
    slice[2] = this.matrix2.yAxis.x;
    slice[3] = this.matrix2.yAxis.y;
    slice[4] = this.translation.x;
    slice[5] = this.translation.y;
  }

  /**
   * Creates an affine transform that changes scale.
   * Note that if any scale is zero the transform will be non-invertible.
   */
  static fromScale(scale: Vec2): Affine2 {
    return new Affine2(new Mat2(new Vec2(scale.x, 0), new Vec2(0, scale.y)), new Vec2(0, 0));
  }

  /** Creates an affine transform from the given rotation `angle`. */
  static fromAngle(angle: number): Affine2 {
    return new Affine2(Mat2.fromAngle(angle), new Vec2(0, 0));
  }

  /** Creates an affine transformation from the given 2D `translation`. */
  static fromTranslation(translation: Vec2): Affine2 {
    return new Affine2(
      new Mat2(new Vec2(1, 0), new Vec2(0, 1)),
      new Vec2(translation.x, translation.y),
    );
  }

  /** Creates an affine transform from a 2x2 matrix (expressing scale, shear and rotation) */
  static fromMat2(matrix2: Mat2): Affine2 {
    return new Affine2(matrix2.clone(), new Vec2(0, 0));
  }

  /**
   * Creates an affine transform from a 2x2 matrix (expressing scale, shear and rotation) and a
   * translation vector.
   *
   * Equivalent to
   * `Affine2.fromTranslation(translation).mul(Affine2.fromMat2(mat2))`
   */
  static fromMat2Translation(matrix2: Mat2, translation: Vec2): Affine2 {
    return new Affine2(matrix2.clone(), translation.clone());
  }

  /**
   * Creates an affine transform from the given 2D `scale`, rotation `angle` (in radians) and
   * `translation`.
   *
   * Equivalent to `Affine2.fromTranslation(translation).mul(Affine2.fromAngle(angle)).mul(Affine2.fromScale(scale))`
   */
  static fromScaleAngleTranslation(scale: Vec2, angle: number, translation: Vec2): Affine2 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return new Affine2(
      new Mat2(new Vec2(cos * scale.x, sin * scale.x), new Vec2(-sin * scale.y, cos * scale.y)),
      translation.clone(),
    );
  }

  /**
   * Creates an affine transform from the given 2D rotation `angle` (in radians) and
   * `translation`.
   *
   * Equivalent to `Affine2.fromTranslation(translation).mul(Affine2.fromAngle(angle))`
   */
  static fromAngleTranslation(angle: number, translation: Vec2): Affine2 {
    return new Affine2(Mat2.fromAngle(angle), translation.clone());
  }

  /** The given `Mat3` must be an affine transform, */
  static fromMat3(m: Mat3): Affine2 {
    return new Affine2(
      new Mat2(new Vec2(m.xAxis.x, m.xAxis.y), new Vec2(m.yAxis.x, m.yAxis.y)),
      new Vec2(m.zAxis.x, m.zAxis.y),
    );
  }

  /**
   * Extracts `scale`, `angle` and `translation` from `this`.
   *
   * The transform is expected to be non-degenerate and without shearing, or the output
   * will be invalid.
   */
  toScaleAngleTranslation(): [Vec2, number, Vec2] {
    const { xAxis, yAxis } = this.matrix2;
    const det = this.matrix2.determinant();
    const scale = new Vec2(xAxis.length() * Math.sign(det + 1 / det), yAxis.length());

    return [scale, Math.atan2(-yAxis.x, yAxis.y), this.translation.clone()];
  }

  /** Transforms the given 2D point, applying shear, scale, rotation and translation. */
  transformPoint2(rhs: Vec2): Vec2 {
    const { xAxis, yAxis } = this.matrix2;
    const { translation } = this;

    return new Vec2(
      xAxis.x * rhs.x + yAxis.x * rhs.y + translation.x,
      xAxis.y * rhs.x + yAxis.y * rhs.y + translation.y,
    );
  }

  /**
   * Transforms the given 2D vector, applying shear, scale and rotation (but NOT
   * translation).
   *
   * To also apply translation, use `transformPoint2()` instead.
   */
  transformVector2(rhs: Vec2): Vec2 {
    const { xAxis, yAxis } = this.matrix2;

    return new Vec2(xAxis.x * rhs.x + yAxis.x * rhs.y, xAxis.y * rhs.x + yAxis.y * rhs.y);
  }

  /**
   * Returns `true` if, and only if, all elements are finite.
   *
   * If any element is either `NaN`, positive or negative infinity, this will return
   * `false`.
   */
  isFinite(): boolean {
    return (
      Number.isFinite(this.matrix2.xAxis.x) &&
      Number.isFinite(this.matrix2.xAxis.y) &&
      Number.isFinite(this.matrix2.yAxis.x) &&
      Number.isFinite(this.matrix2.yAxis.y) &&
      Number.isFinite(this.translation.x) &&
      Number.isFinite(this.translation.y)
    );
  }

  /** Returns `true` if any elements are `NaN`. */
  isNan(): boolean {
    return (
      Number.isNaN(this.matrix2.xAxis.x) ||
      Number.isNaN(this.matrix2.xAxis.y) ||
      Number.isNaN(this.matrix2.yAxis.x) ||
      Number.isNaN(this.matrix2.yAxis.y) ||
      Number.isNaN(this.translation.x) ||
      Number.isNaN(this.translation.y)
    );
  }

  /**
   * Returns true if the absolute difference of all elements between `this` and `rhs`
   * is less than or equal to `maxAbsDiff`.
   *
   * This can be used to compare if two 3x4 matrices contain similar elements. It works
   * best when comparing with a known value. The `maxAbsDiff` that should be used used
   * depends on the values being compared against.
   *
   * For more see
   * [comparing floating point numbers](https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/).
   */
  absDiffEq(rhs: Affine2, maxAbsDiff: number): boolean {
    return (
      Math.abs(this.matrix2.xAxis.x - rhs.matrix2.xAxis.x) <= maxAbsDiff &&
      Math.abs(this.matrix2.xAxis.y - rhs.matrix2.xAxis.y) <= maxAbsDiff &&
      Math.abs(this.matrix2.yAxis.x - rhs.matrix2.yAxis.x) <= maxAbsDiff &&
      Math.abs(this.matrix2.yAxis.y - rhs.matrix2.yAxis.y) <= maxAbsDiff &&
      Math.abs(this.translation.x - rhs.translation.x) <= maxAbsDiff &&
      Math.abs(this.translation.y - rhs.translation.y) <= maxAbsDiff
    );
  }

  /**
   * Return the inverse of this transform.
   *
   * Note that if the transform is not invertible the result will be invalid.
   */
  inverse(): Affine2 {
    const matrix2 = this.matrix2.inverse();
    const { xAxis, yAxis } = matrix2;
    const { translation } = this;

    return new Affine2(
      matrix2,
      new Vec2(
        -(xAxis.x * translation.x + yAxis.x * translation.y),
        -(xAxis.y * translation.x + yAxis.y * translation.y),
      ),
    );
  }

  get xAxis(): Vec2 {
    return this.matrix2.xAxis;
  }

  set xAxis(value: Vec2) {
    this.matrix2.xAxis = value;
  }

  get yAxis(): Vec2 {
    return this.matrix2.yAxis;
  }

  set yAxis(value: Vec2) {
    this.matrix2.yAxis = value;
  }

  get zAxis(): Vec2 {
    return this.translation;
  }

  set zAxis(value: Vec2) {
    this.translation = value;
  }

  clone(): Affine2 {
    return new Affine2(
      new Mat2(
        new Vec2(this.matrix2.xAxis.x, this.matrix2.xAxis.y),
        new Vec2(this.matrix2.yAxis.x, this.matrix2.yAxis.y),
      ),
      new Vec2(this.translation.x, this.translation.y),
    );
  }

  mul(rhs: Mat3): Mat3;
  mul(rhs: Affine2): Affine2;
  mul(rhs: Affine2 | Mat3): Affine2 | Mat3 {
    const { xAxis, yAxis } = this.matrix2;
    const { translation } = this;

    if (rhs instanceof Mat3) {
      return new Mat3(
        new Vec3(
          xAxis.x * rhs.xAxis.x + yAxis.x * rhs.xAxis.y + translation.x * rhs.xAxis.z,
          xAxis.y * rhs.xAxis.x + yAxis.y * rhs.xAxis.y + translation.y * rhs.xAxis.z,
          rhs.xAxis.z,
        ),
        new Vec3(
          xAxis.x * rhs.yAxis.x + yAxis.x * rhs.yAxis.y + translation.x * rhs.yAxis.z,
          xAxis.y * rhs.yAxis.x + yAxis.y * rhs.yAxis.y + translation.y * rhs.yAxis.z,
          rhs.yAxis.z,
        ),
        new Vec3(
          xAxis.x * rhs.zAxis.x + yAxis.x * rhs.zAxis.y + translation.x * rhs.zAxis.z,
          xAxis.y * rhs.zAxis.x + yAxis.y * rhs.zAxis.y + translation.y * rhs.zAxis.z,
          rhs.zAxis.z,
        ),
      );
    }

    return new Affine2(
      new Mat2(
        new Vec2(
          xAxis.x * rhs.matrix2.xAxis.x + yAxis.x * rhs.matrix2.xAxis.y,
          xAxis.y * rhs.matrix2.xAxis.x + yAxis.y * rhs.matrix2.xAxis.y,
        ),
        new Vec2(
          xAxis.x * rhs.matrix2.yAxis.x + yAxis.x * rhs.matrix2.yAxis.y,
          xAxis.y * rhs.matrix2.yAxis.x + yAxis.y * rhs.matrix2.yAxis.y,
        ),
      ),
      new Vec2(
        xAxis.x * rhs.translation.x + yAxis.x * rhs.translation.y + translation.x,
        xAxis.y * rhs.translation.x + yAxis.y * rhs.translation.y + translation.y,
      ),
    );
  }

  mulAssign(rhs: Affine2): this {
    const { xAxis, yAxis } = this.matrix2;
    const { translation } = this;
    const m00 = xAxis.x * rhs.matrix2.xAxis.x + yAxis.x * rhs.matrix2.xAxis.y;
    const m01 = xAxis.y * rhs.matrix2.xAxis.x + yAxis.y * rhs.matrix2.xAxis.y;
    const m10 = xAxis.x * rhs.matrix2.yAxis.x + yAxis.x * rhs.matrix2.yAxis.y;
    const m11 = xAxis.y * rhs.matrix2.yAxis.x + yAxis.y * rhs.matrix2.yAxis.y;
    const m20 = xAxis.x * rhs.translation.x + yAxis.x * rhs.translation.y + translation.x;
    const m21 = xAxis.y * rhs.translation.x + yAxis.y * rhs.translation.y + translation.y;

    xAxis.x = m00;
    xAxis.y = m01;
    yAxis.x = m10;
    yAxis.y = m11;
    translation.x = m20;
    translation.y = m21;

    return this;
  }

  eq(rhs: Affine2): boolean {
    return (
      this.matrix2.xAxis.x === rhs.matrix2.xAxis.x &&
      this.matrix2.xAxis.y === rhs.matrix2.xAxis.y &&
      this.matrix2.yAxis.x === rhs.matrix2.yAxis.x &&
      this.matrix2.yAxis.y === rhs.matrix2.yAxis.y &&
      this.translation.x === rhs.translation.x &&
      this.translation.y === rhs.translation.y
    );
  }

  ne(rhs: Affine2): boolean {
    return (
      this.matrix2.xAxis.x !== rhs.matrix2.xAxis.x ||
      this.matrix2.xAxis.y !== rhs.matrix2.xAxis.y ||
      this.matrix2.yAxis.x !== rhs.matrix2.yAxis.x ||
      this.matrix2.yAxis.y !== rhs.matrix2.yAxis.y ||
      this.translation.x !== rhs.translation.x ||
      this.translation.y !== rhs.translation.y
    );
  }

  toString(): string {
    return `[[${this.matrix2.xAxis.x}, ${this.matrix2.xAxis.y}], [${this.matrix2.yAxis.x}, ${this.matrix2.yAxis.y}], [${this.translation.x}, ${this.translation.y}]]`;
  }

  static #sliceElement(slice: ArrayLike<number>, index: number): number {
    const value = slice[index];

    if (value === undefined) {
      throw new RangeError("index out of bounds");
    }

    return value;
  }
}
