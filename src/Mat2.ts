import type { Mat3 } from "./Mat3.js";
import type { Vec3 } from "./Vec3.js";

import { Vec2 } from "./Vec2.js";

/** A 2x2 column major matrix. */
export class Mat2 {
  declare xAxis: Vec2;
  declare yAxis: Vec2;

  constructor(xAxis: Vec2, yAxis: Vec2) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }

  /** A 2x2 matrix with all elements set to `0.0`. */
  static get ZERO() {
    return new Mat2(new Vec2(0, 0), new Vec2(0, 0));
  }

  /** A 2x2 identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
  static get IDENTITY() {
    return new Mat2(new Vec2(1, 0), new Vec2(0, 1));
  }

  /** All NAN:s. */
  static get NAN() {
    return new Mat2(new Vec2(Number.NaN, Number.NaN), new Vec2(Number.NaN, Number.NaN));
  }

  static new(m00: number, m01: number, m10: number, m11: number): Mat2 {
    return new Mat2(new Vec2(m00, m01), new Vec2(m10, m11));
  }

  /**
   * Creates a 2x2 matrix from two column vectors.
   *
   * See also `fromRows` when the data is in row major order.
   */
  static fromCols(xAxis: Vec2, yAxis: Vec2): Mat2 {
    return new Mat2(xAxis, yAxis);
  }

  /**
   * Creates a 2x2 matrix from two row vectors.
   *
   * Matrices are stored in column major order, so the given rows are permuted into
   * the matrix layout. Use `fromCols` instead when the data is already in
   * column major order.
   */
  static fromRows(row0: Vec2, row1: Vec2): Mat2 {
    return new Mat2(new Vec2(row0.x, row1.x), new Vec2(row0.y, row1.y));
  }

  /**
   * Creates a 2x2 matrix from a `[number; 4]` array stored in column major order.
   *
   * If the data is in row major order use `fromRowsArray` instead.
   */
  static fromColsArray(m: [number, number, number, number]): Mat2 {
    return new Mat2(new Vec2(m[0], m[1]), new Vec2(m[2], m[3]));
  }

  /**
   * Creates a `[number; 4]` array storing data in column major order.
   *
   * If you require the data in row major order use `toRowsArray` instead.
   */
  toColsArray(): [number, number, number, number] {
    return [this.xAxis.x, this.xAxis.y, this.yAxis.x, this.yAxis.y];
  }

  /**
   * Creates a 2x2 matrix from a `[[number; 2]; 2]` 2D array stored in column major order.
   *
   * If the data is in row major order `transpose` the returned matrix.
   */
  static fromColsArray2d(m: [[number, number], [number, number]]): Mat2 {
    return new Mat2(new Vec2(m[0][0], m[0][1]), new Vec2(m[1][0], m[1][1]));
  }

  /**
   * Creates a `[[number; 2]; 2]` 2D array storing data in column major order.
   *
   * If you require row major order `transpose` the matrix first.
   */
  toColsArray2d(): [[number, number], [number, number]] {
    return [
      [this.xAxis.x, this.xAxis.y],
      [this.yAxis.x, this.yAxis.y],
    ];
  }

  /**
   * Creates a 2x2 matrix from a `[number; 4]` array stored in row major order.
   *
   * Matrices are stored in column major order, so the array is permuted into the
   * matrix layout. Use `fromColsArray` instead when the data is already in
   * column major order.
   */
  static fromRowsArray(m: [number, number, number, number]): Mat2 {
    return new Mat2(new Vec2(m[0], m[2]), new Vec2(m[1], m[3]));
  }

  /**
   * Creates a `[number; 4]` array storing data in row major order.
   *
   * Matrices are stored in column major order, so the array is permuted out of the
   * column major storage. Use `toColsArray` instead when you want data in
   * column major order.
   */
  toRowsArray(): [number, number, number, number] {
    return [this.xAxis.x, this.yAxis.x, this.xAxis.y, this.yAxis.y];
  }

  /** Creates a 2x2 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
  static fromDiagonal(diagonal: Vec2): Mat2 {
    return new Mat2(new Vec2(diagonal.x, 0), new Vec2(0, diagonal.y));
  }

  /**
   * Creates a 2x2 matrix containing the combining non-uniform `scale` and rotation of
   * `angle` (in radians).
   */
  static fromScaleAngle(scale: Vec2, angle: number): Mat2 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return new Mat2(
      new Vec2(cos * scale.x, sin * scale.x),
      new Vec2(-sin * scale.y, cos * scale.y),
    );
  }

  /** Creates a 2x2 matrix containing a rotation of `angle` (in radians). */
  static fromAngle(angle: number): Mat2 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return new Mat2(new Vec2(cos, sin), new Vec2(-sin, cos));
  }

  /** Creates a 2x2 matrix from a 3x3 matrix, discarding the 2nd row and column. */
  static fromMat3(m: Mat3): Mat2 {
    return new Mat2(new Vec2(m.xAxis.x, m.xAxis.y), new Vec2(m.yAxis.x, m.yAxis.y));
  }

  /**
   * Creates a 2x2 matrix from the minor of the given 3x3 matrix, discarding the `i`th column
   * and `j`th row.
   *
   * Throws a `RangeError` if `i` or `j` is greater than 2.
   */
  static fromMat3Minor(m: Mat3, i: number, j: number): Mat2 {
    switch (i) {
      case 0: {
        return Mat2.#minor(m.yAxis, m.zAxis, j);
      }
      case 1: {
        return Mat2.#minor(m.xAxis, m.zAxis, j);
      }
      case 2: {
        return Mat2.#minor(m.xAxis, m.yAxis, j);
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /**
   * Creates a 2x2 matrix from the first 4 values in `slice`.
   *
   * See also `fromRowsSlice` when the slice is in row major order.
   *
   * Throws a `RangeError` if `slice` is less than 4 elements long.
   */
  static fromColsSlice(slice: ArrayLike<number>): Mat2 {
    return new Mat2(
      new Vec2(Mat2.#sliceElement(slice, 0), Mat2.#sliceElement(slice, 1)),
      new Vec2(Mat2.#sliceElement(slice, 2), Mat2.#sliceElement(slice, 3)),
    );
  }

  /**
   * Writes the columns of `this` to the first 4 elements in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 4 elements long.
   */
  writeColsToSlice(slice: { [index: number]: number; readonly length: number }): void {
    if (slice.length < 4) {
      throw new RangeError("index out of bounds");
    }

    slice[0] = this.xAxis.x;
    slice[1] = this.xAxis.y;
    slice[2] = this.yAxis.x;
    slice[3] = this.yAxis.y;
  }

  /**
   * Creates a 2x2 matrix from the first 4 values in `slice`, stored in row
   * major order.
   *
   * Matrices are stored in column major order, so the slice is permuted into the
   * matrix layout. Use `fromColsSlice` instead when the slice is already in
   * column major order.
   *
   * Throws a `RangeError` if `slice` is less than 4 elements long.
   */
  static fromRowsSlice(slice: ArrayLike<number>): Mat2 {
    return new Mat2(
      new Vec2(Mat2.#sliceElement(slice, 0), Mat2.#sliceElement(slice, 2)),
      new Vec2(Mat2.#sliceElement(slice, 1), Mat2.#sliceElement(slice, 3)),
    );
  }

  /**
   * Returns the matrix column for the given `index`.
   *
   * Throws a `RangeError` if `index` is greater than 1.
   */
  col(index: number): Vec2 {
    switch (index) {
      case 0: {
        return new Vec2(this.xAxis.x, this.xAxis.y);
      }
      case 1: {
        return new Vec2(this.yAxis.x, this.yAxis.y);
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /**
   * Returns a mutable reference to the matrix column for the given `index`.
   *
   * Throws a `RangeError` if `index` is greater than 1.
   */
  colMut(index: number): Vec2 {
    switch (index) {
      case 0: {
        return this.xAxis;
      }
      case 1: {
        return this.yAxis;
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /**
   * Returns the matrix row for the given `index`.
   *
   * See also `setRow` when you need to change the row.
   *
   * Throws a `RangeError` if `index` is greater than 1.
   */
  row(index: number): Vec2 {
    switch (index) {
      case 0: {
        return new Vec2(this.xAxis.x, this.yAxis.x);
      }
      case 1: {
        return new Vec2(this.xAxis.y, this.yAxis.y);
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /**
   * Sets the matrix row for the given `index`.
   *
   * Matrices are stored in column major order, so the row is spread across all
   * 2 columns and writing it touches every column. Use `colMut`
   * instead when you can work with columns. See also `row`.
   *
   * Throws a `RangeError` if `index` is greater than 1.
   */
  setRow(index: number, row: Vec2): void {
    switch (index) {
      case 0: {
        this.xAxis.x = row.x;
        this.yAxis.x = row.y;

        break;
      }
      case 1: {
        this.xAxis.y = row.x;
        this.yAxis.y = row.y;

        break;
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /**
   * Returns `true` if, and only if, all elements are finite.
   * If any element is either `NaN`, positive or negative infinity, this will return `false`.
   */
  isFinite(): boolean {
    return (
      Number.isFinite(this.xAxis.x) &&
      Number.isFinite(this.xAxis.y) &&
      Number.isFinite(this.yAxis.x) &&
      Number.isFinite(this.yAxis.y)
    );
  }

  /** Returns `true` if any elements are `NaN`. */
  isNan(): boolean {
    return (
      Number.isNaN(this.xAxis.x) ||
      Number.isNaN(this.xAxis.y) ||
      Number.isNaN(this.yAxis.x) ||
      Number.isNaN(this.yAxis.y)
    );
  }

  /** Returns the transpose of `this`. */
  transpose(): Mat2 {
    return new Mat2(new Vec2(this.xAxis.x, this.yAxis.x), new Vec2(this.xAxis.y, this.yAxis.y));
  }

  /** Returns the diagonal of `this`. */
  diagonal(): Vec2 {
    return new Vec2(this.xAxis.x, this.yAxis.y);
  }

  /** Returns the determinant of `this`. */
  determinant(): number {
    return this.xAxis.x * this.yAxis.y - this.xAxis.y * this.yAxis.x;
  }

  /**
   * Returns the inverse of `this`.
   *
   * If the matrix is not invertible the returned matrix will be invalid. The
   * returned matrix will also be invalid if the inverse is not finite, which can
   * happen when `this` contains very large or very small values. Use
   * `tryInverse` or `inverseOrZero` to detect these cases.
   */
  inverse(): Mat2 {
    const invDet = 1 / this.determinant();

    return new Mat2(
      new Vec2(this.yAxis.y * invDet, this.xAxis.y * -invDet),
      new Vec2(this.yAxis.x * -invDet, this.xAxis.x * invDet),
    );
  }

  /**
   * Returns the inverse of `this` or `undefined` if the matrix is not invertible, or if
   * the inverse is not finite.
   */
  tryInverse(): Mat2 | undefined {
    const inverse = this.inverse();

    return inverse.isFinite() ? inverse : undefined;
  }

  /**
   * Returns the inverse of `this` or `Mat2.ZERO` if the matrix is not
   * invertible, or if the inverse is not finite.
   */
  inverseOrZero(): Mat2 {
    const inverse = this.inverse();

    return inverse.isFinite() ? inverse : Mat2.ZERO;
  }

  /** Transforms a 2D vector. */
  mulVec2(rhs: Vec2): Vec2 {
    const { xAxis, yAxis } = this;

    return new Vec2(xAxis.x * rhs.x + yAxis.x * rhs.y, xAxis.y * rhs.x + yAxis.y * rhs.y);
  }

  /** Transforms a 2D vector by the transpose of `this`. */
  mulTransposeVec2(rhs: Vec2): Vec2 {
    const { xAxis, yAxis } = this;

    return new Vec2(xAxis.x * rhs.x + xAxis.y * rhs.y, yAxis.x * rhs.x + yAxis.y * rhs.y);
  }

  /** Multiplies two 2x2 matrices. */
  mulMat2(rhs: Mat2): Mat2 {
    const { xAxis, yAxis } = this;

    return new Mat2(
      new Vec2(
        xAxis.x * rhs.xAxis.x + yAxis.x * rhs.xAxis.y,
        xAxis.y * rhs.xAxis.x + yAxis.y * rhs.xAxis.y,
      ),
      new Vec2(
        xAxis.x * rhs.yAxis.x + yAxis.x * rhs.yAxis.y,
        xAxis.y * rhs.yAxis.x + yAxis.y * rhs.yAxis.y,
      ),
    );
  }

  /** Adds two 2x2 matrices. */
  addMat2(rhs: Mat2): Mat2 {
    return new Mat2(
      new Vec2(this.xAxis.x + rhs.xAxis.x, this.xAxis.y + rhs.xAxis.y),
      new Vec2(this.yAxis.x + rhs.yAxis.x, this.yAxis.y + rhs.yAxis.y),
    );
  }

  /** Subtracts two 2x2 matrices. */
  subMat2(rhs: Mat2): Mat2 {
    return new Mat2(
      new Vec2(this.xAxis.x - rhs.xAxis.x, this.xAxis.y - rhs.xAxis.y),
      new Vec2(this.yAxis.x - rhs.yAxis.x, this.yAxis.y - rhs.yAxis.y),
    );
  }

  /** Multiplies a 2x2 matrix by a scalar. */
  mulScalar(rhs: number): Mat2 {
    return new Mat2(
      new Vec2(this.xAxis.x * rhs, this.xAxis.y * rhs),
      new Vec2(this.yAxis.x * rhs, this.yAxis.y * rhs),
    );
  }

  /**
   * Multiply `this` by a scaling vector `scale`.
   * This is faster than creating a whole diagonal scaling matrix and then multiplying that.
   * This operation is commutative.
   */
  mulDiagonalScale(scale: Vec2): Mat2 {
    return new Mat2(
      new Vec2(this.xAxis.x * scale.x, this.xAxis.y * scale.x),
      new Vec2(this.yAxis.x * scale.y, this.yAxis.y * scale.y),
    );
  }

  /** Divides a 2x2 matrix by a scalar. */
  divScalar(rhs: number): Mat2 {
    return new Mat2(
      new Vec2(this.xAxis.x / rhs, this.xAxis.y / rhs),
      new Vec2(this.yAxis.x / rhs, this.yAxis.y / rhs),
    );
  }

  /** Returns a matrix containing the reciprocal `1.0/n` of each element of `this`. */
  recip(): Mat2 {
    return new Mat2(
      new Vec2(1 / this.xAxis.x, 1 / this.xAxis.y),
      new Vec2(1 / this.yAxis.x, 1 / this.yAxis.y),
    );
  }

  /**
   * Returns true if the absolute difference of all elements between `this` and `rhs`
   * is less than or equal to `maxAbsDiff`.
   *
   * This can be used to compare if two matrices contain similar elements. It works best
   * when comparing with a known value. The `maxAbsDiff` that should be used used
   * depends on the values being compared against.
   *
   * For more see
   * [comparing floating point numbers](https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/).
   */
  absDiffEq(rhs: Mat2, maxAbsDiff: number): boolean {
    return (
      Math.abs(this.xAxis.x - rhs.xAxis.x) <= maxAbsDiff &&
      Math.abs(this.xAxis.y - rhs.xAxis.y) <= maxAbsDiff &&
      Math.abs(this.yAxis.x - rhs.yAxis.x) <= maxAbsDiff &&
      Math.abs(this.yAxis.y - rhs.yAxis.y) <= maxAbsDiff
    );
  }

  /** Takes the absolute value of each element in `this` */
  abs(): Mat2 {
    return new Mat2(
      new Vec2(Math.abs(this.xAxis.x), Math.abs(this.xAxis.y)),
      new Vec2(Math.abs(this.yAxis.x), Math.abs(this.yAxis.y)),
    );
  }

  clone(): Mat2 {
    return new Mat2(new Vec2(this.xAxis.x, this.xAxis.y), new Vec2(this.yAxis.x, this.yAxis.y));
  }

  add(rhs: Mat2): Mat2 {
    return this.addMat2(rhs);
  }

  sub(rhs: Mat2): Mat2 {
    return this.subMat2(rhs);
  }

  neg(): Mat2 {
    return new Mat2(new Vec2(-this.xAxis.x, -this.xAxis.y), new Vec2(-this.yAxis.x, -this.yAxis.y));
  }

  mul(rhs: Vec2): Vec2;
  mul(rhs: Mat2 | number): Mat2;
  mul(rhs: Mat2 | Vec2 | number): Mat2 | Vec2 {
    if (typeof rhs === "number") {
      return this.mulScalar(rhs);
    }

    if (rhs instanceof Vec2) {
      return this.mulVec2(rhs);
    }

    return this.mulMat2(rhs);
  }

  div(rhs: number): Mat2 {
    return this.divScalar(rhs);
  }

  addAssign(rhs: Mat2): this {
    this.xAxis.x += rhs.xAxis.x;
    this.xAxis.y += rhs.xAxis.y;
    this.yAxis.x += rhs.yAxis.x;
    this.yAxis.y += rhs.yAxis.y;

    return this;
  }

  subAssign(rhs: Mat2): this {
    this.xAxis.x -= rhs.xAxis.x;
    this.xAxis.y -= rhs.xAxis.y;
    this.yAxis.x -= rhs.yAxis.x;
    this.yAxis.y -= rhs.yAxis.y;

    return this;
  }

  mulAssign(rhs: Mat2 | number): this {
    if (typeof rhs === "number") {
      this.xAxis.x *= rhs;
      this.xAxis.y *= rhs;
      this.yAxis.x *= rhs;
      this.yAxis.y *= rhs;

      return this;
    }

    const { xAxis, yAxis } = this;
    const m00 = xAxis.x * rhs.xAxis.x + yAxis.x * rhs.xAxis.y;
    const m01 = xAxis.y * rhs.xAxis.x + yAxis.y * rhs.xAxis.y;
    const m10 = xAxis.x * rhs.yAxis.x + yAxis.x * rhs.yAxis.y;
    const m11 = xAxis.y * rhs.yAxis.x + yAxis.y * rhs.yAxis.y;

    this.xAxis.x = m00;
    this.xAxis.y = m01;
    this.yAxis.x = m10;
    this.yAxis.y = m11;

    return this;
  }

  divAssign(rhs: number): this {
    this.xAxis.x /= rhs;
    this.xAxis.y /= rhs;
    this.yAxis.x /= rhs;
    this.yAxis.y /= rhs;

    return this;
  }

  eq(rhs: Mat2): boolean {
    return (
      this.xAxis.x === rhs.xAxis.x &&
      this.xAxis.y === rhs.xAxis.y &&
      this.yAxis.x === rhs.yAxis.x &&
      this.yAxis.y === rhs.yAxis.y
    );
  }

  ne(rhs: Mat2): boolean {
    return (
      this.xAxis.x !== rhs.xAxis.x ||
      this.xAxis.y !== rhs.xAxis.y ||
      this.yAxis.x !== rhs.yAxis.x ||
      this.yAxis.y !== rhs.yAxis.y
    );
  }

  toString(): string {
    return `[[${this.xAxis.x}, ${this.xAxis.y}], [${this.yAxis.x}, ${this.yAxis.y}]]`;
  }

  static #minor(a: Vec3, b: Vec3, j: number): Mat2 {
    switch (j) {
      case 0: {
        return new Mat2(new Vec2(a.y, a.z), new Vec2(b.y, b.z));
      }
      case 1: {
        return new Mat2(new Vec2(a.x, a.z), new Vec2(b.x, b.z));
      }
      case 2: {
        return new Mat2(new Vec2(a.x, a.y), new Vec2(b.x, b.y));
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  static #sliceElement(slice: ArrayLike<number>, index: number): number {
    const value = slice[index];

    if (value === undefined) {
      throw new RangeError("index out of bounds");
    }

    return value;
  }
}

/** Creates a 2x2 matrix from two column vectors. */
export function mat2(xAxis: Vec2, yAxis: Vec2): Mat2 {
  return new Mat2(xAxis, yAxis);
}
