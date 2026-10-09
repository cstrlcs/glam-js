import type { Affine2 } from "./Affine2.js";
import type { EulerRot } from "./EulerRot.js";
import type { Mat2 } from "./Mat2.js";
import type { Mat4 } from "./Mat4.js";
import type { Quat } from "./Quat.js";
import type { Vec4 } from "./Vec4.js";

import { Vec2 } from "./Vec2.js";
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
 * A 3x3 column major matrix.
 *
 * This 3x3 matrix type features convenience methods for creating and using linear and
 * affine transformations. If you are primarily dealing with 2D affine transformations the
 * `Affine2` type is much faster and more space efficient than
 * using a 3x3 matrix.
 *
 * Linear transformations including 3D rotation and scale can be created using methods
 * such as `fromDiagonal()`, `fromQuat()`, `fromAxisAngle()`,
 * `fromRotationX()`, `fromRotationY()`, or
 * `fromRotationZ()`.
 *
 * The resulting matrices can be use to transform 3D vectors using regular vector
 * multiplication.
 *
 * Affine transformations including 2D translation, rotation and scale can be created
 * using methods such as `fromTranslation()`, `fromAngle()`,
 * `fromScale()` and `fromScaleAngleTranslation()`.
 *
 * The `transformPoint2()` and `transformVector2()` convenience methods
 * are provided for performing affine transforms on 2D vectors and points. These multiply
 * 2D inputs as 3D vectors with an implicit `z` value of `1` for points and `0` for
 * vectors respectively. These methods assume that `Mat3` contains a valid affine
 * transform.
 */
export class Mat3 {
  declare xAxis: Vec3;
  declare yAxis: Vec3;
  declare zAxis: Vec3;

  constructor(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.zAxis = zAxis;
  }

  /** A 3x3 matrix with all elements set to `0.0`. */
  static get ZERO() {
    return new Mat3(new Vec3(0, 0, 0), new Vec3(0, 0, 0), new Vec3(0, 0, 0));
  }

  /** A 3x3 identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
  static get IDENTITY() {
    return new Mat3(new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1));
  }

  /** All NAN:s. */
  static get NAN() {
    return new Mat3(
      new Vec3(Number.NaN, Number.NaN, Number.NaN),
      new Vec3(Number.NaN, Number.NaN, Number.NaN),
      new Vec3(Number.NaN, Number.NaN, Number.NaN),
    );
  }

  static new(
    m00: number,
    m01: number,
    m02: number,
    m10: number,
    m11: number,
    m12: number,
    m20: number,
    m21: number,
    m22: number,
  ): Mat3 {
    return new Mat3(new Vec3(m00, m01, m02), new Vec3(m10, m11, m12), new Vec3(m20, m21, m22));
  }

  /**
   * Creates a 3x3 matrix from three column vectors.
   *
   * See also `fromRows` when the data is in row major order.
   */
  static fromCols(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): Mat3 {
    return new Mat3(xAxis, yAxis, zAxis);
  }

  /**
   * Creates a 3x3 matrix from three row vectors.
   *
   * Matrices are stored in column major order, so the given rows are permuted into
   * the matrix layout. Use `fromCols` instead when the data is already in
   * column major order.
   */
  static fromRows(row0: Vec3, row1: Vec3, row2: Vec3): Mat3 {
    return new Mat3(
      new Vec3(row0.x, row1.x, row2.x),
      new Vec3(row0.y, row1.y, row2.y),
      new Vec3(row0.z, row1.z, row2.z),
    );
  }

  /**
   * Creates a 3x3 matrix from a `[number; 9]` array stored in column major order.
   *
   * If the data is in row major order use `fromRowsArray` instead.
   */
  static fromColsArray(
    m: [number, number, number, number, number, number, number, number, number],
  ): Mat3 {
    return new Mat3(
      new Vec3(m[0], m[1], m[2]),
      new Vec3(m[3], m[4], m[5]),
      new Vec3(m[6], m[7], m[8]),
    );
  }

  /**
   * Creates a `[number; 9]` array storing data in column major order.
   *
   * If you require the data in row major order use `toRowsArray` instead.
   */
  toColsArray(): [number, number, number, number, number, number, number, number, number] {
    return [
      this.xAxis.x,
      this.xAxis.y,
      this.xAxis.z,
      this.yAxis.x,
      this.yAxis.y,
      this.yAxis.z,
      this.zAxis.x,
      this.zAxis.y,
      this.zAxis.z,
    ];
  }

  /**
   * Creates a 3x3 matrix from a `[[number; 3]; 3]` 3D array stored in column major order.
   *
   * If the data is in row major order `transpose` the returned matrix.
   */
  static fromColsArray2d(
    m: [[number, number, number], [number, number, number], [number, number, number]],
  ): Mat3 {
    return new Mat3(
      new Vec3(m[0][0], m[0][1], m[0][2]),
      new Vec3(m[1][0], m[1][1], m[1][2]),
      new Vec3(m[2][0], m[2][1], m[2][2]),
    );
  }

  /**
   * Creates a `[[number; 3]; 3]` 3D array storing data in column major order.
   *
   * If you require row major order `transpose` the matrix first.
   */
  toColsArray2d(): [[number, number, number], [number, number, number], [number, number, number]] {
    return [
      [this.xAxis.x, this.xAxis.y, this.xAxis.z],
      [this.yAxis.x, this.yAxis.y, this.yAxis.z],
      [this.zAxis.x, this.zAxis.y, this.zAxis.z],
    ];
  }

  /**
   * Creates a 3x3 matrix from a `[number; 9]` array stored in row major order.
   *
   * Matrices are stored in column major order, so the array is permuted into the
   * matrix layout. Use `fromColsArray` instead when the data is already in
   * column major order.
   */
  static fromRowsArray(
    m: [number, number, number, number, number, number, number, number, number],
  ): Mat3 {
    return new Mat3(
      new Vec3(m[0], m[3], m[6]),
      new Vec3(m[1], m[4], m[7]),
      new Vec3(m[2], m[5], m[8]),
    );
  }

  /**
   * Creates a `[number; 9]` array storing data in row major order.
   *
   * Matrices are stored in column major order, so the array is permuted out of the
   * column major storage. Use `toColsArray` instead when you want data in
   * column major order.
   */
  toRowsArray(): [number, number, number, number, number, number, number, number, number] {
    return [
      this.xAxis.x,
      this.yAxis.x,
      this.zAxis.x,
      this.xAxis.y,
      this.yAxis.y,
      this.zAxis.y,
      this.xAxis.z,
      this.yAxis.z,
      this.zAxis.z,
    ];
  }

  /** Creates a 3x3 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
  static fromDiagonal(diagonal: Vec3): Mat3 {
    return new Mat3(
      new Vec3(diagonal.x, 0, 0),
      new Vec3(0, diagonal.y, 0),
      new Vec3(0, 0, diagonal.z),
    );
  }

  /** Creates a 3x3 matrix from a 4x4 matrix, discarding the 4th row and column. */
  static fromMat4(m: Mat4): Mat3 {
    return new Mat3(
      new Vec3(m.xAxis.x, m.xAxis.y, m.xAxis.z),
      new Vec3(m.yAxis.x, m.yAxis.y, m.yAxis.z),
      new Vec3(m.zAxis.x, m.zAxis.y, m.zAxis.z),
    );
  }

  /**
   * Creates a 3x3 matrix from the minor of the given 4x4 matrix, discarding the `i`th column
   * and `j`th row.
   *
   * Throws a `RangeError` if `i` or `j` is greater than 3.
   */
  static fromMat4Minor(m: Mat4, i: number, j: number): Mat3 {
    switch (i) {
      case 0: {
        return Mat3.#minor(m.yAxis, m.zAxis, m.wAxis, j);
      }
      case 1: {
        return Mat3.#minor(m.xAxis, m.zAxis, m.wAxis, j);
      }
      case 2: {
        return Mat3.#minor(m.xAxis, m.yAxis, m.wAxis, j);
      }
      case 3: {
        return Mat3.#minor(m.xAxis, m.yAxis, m.zAxis, j);
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /** Creates a 3D rotation matrix from the given quaternion. */
  static fromQuat(rotation: Quat): Mat3 {
    const { x, y, z, w } = rotation;
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;

    return new Mat3(
      new Vec3(1 - (yy + zz), xy + wz, xz - wy),
      new Vec3(xy - wz, 1 - (xx + zz), yz + wx),
      new Vec3(xz + wy, yz - wx, 1 - (xx + yy)),
    );
  }

  /**
   * Creates a 3D rotation matrix from a normalized rotation `axis` and `angle` (in
   * radians).
   */
  static fromAxisAngle(axis: Vec3, angle: number): Mat3 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const { x, y, z } = axis;
    const xsin = x * sin;
    const ysin = y * sin;
    const zsin = z * sin;
    const omc = 1 - cos;
    const xyomc = x * y * omc;
    const xzomc = x * z * omc;
    const yzomc = y * z * omc;

    return new Mat3(
      new Vec3(x * x * omc + cos, xyomc + zsin, xzomc - ysin),
      new Vec3(xyomc - zsin, y * y * omc + cos, yzomc + xsin),
      new Vec3(xzomc + ysin, yzomc - xsin, z * z * omc + cos),
    );
  }

  /**
   * Creates a 3D rotation matrix from the given euler rotation sequence and the angles (in
   * radians).
   */
  static fromEuler(order: EulerRot, a: number, b: number, c: number): Mat3 {
    const [i, j, k, parityEven, initialRepeated, frameStatic] = EULER_ORDERS[order];
    const sign = parityEven ? -1 : 1;
    const si = Math.sin((frameStatic ? a : c) * sign);
    const ci = Math.cos((frameStatic ? a : c) * sign);
    const sj = Math.sin(b * sign);
    const cj = Math.cos(b * sign);
    const sh = Math.sin((frameStatic ? c : a) * sign);
    const ch = Math.cos((frameStatic ? c : a) * sign);
    const cc = ci * ch;
    const cs = ci * sh;
    const sc = si * ch;
    const ss = si * sh;

    const m: [number, number, number, number, number, number, number, number, number] = [
      0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    if (initialRepeated) {
      m[i * 3 + i] = cj;
      m[i * 3 + j] = sj * si;
      m[i * 3 + k] = sj * ci;
      m[j * 3 + i] = sj * sh;
      m[j * 3 + j] = -cj * ss + cc;
      m[j * 3 + k] = -cj * cs - sc;
      m[k * 3 + i] = -sj * ch;
      m[k * 3 + j] = cj * sc + cs;
      m[k * 3 + k] = cj * cc - ss;
    } else {
      m[i * 3 + i] = cj * ch;
      m[i * 3 + j] = sj * sc - cs;
      m[i * 3 + k] = sj * cc + ss;
      m[j * 3 + i] = cj * sh;
      m[j * 3 + j] = sj * ss + cc;
      m[j * 3 + k] = sj * cs - sc;
      m[k * 3 + i] = -sj;
      m[k * 3 + j] = cj * si;
      m[k * 3 + k] = cj * ci;
    }

    return Mat3.fromColsArray(m);
  }

  /**
   * Extract Euler angles with the given Euler rotation order.
   *
   * Note if the input matrix contains scales, shears, or other non-rotation transformations then
   * the resulting Euler angles will be ill-defined.
   */
  toEuler(order: EulerRot): [number, number, number] {
    const [i, j, k, parityEven, initialRepeated, frameStatic] = EULER_ORDERS[order];
    const sign = parityEven ? -1 : 1;
    let x: number;
    let y: number;
    let z = 0;

    if (initialRepeated) {
      const sy = Math.hypot(Mat3.#element(this, i, j), Mat3.#element(this, i, k));

      y = Math.atan2(sy, Mat3.#element(this, i, i));

      if (sy > 16 * Number.EPSILON) {
        x = Math.atan2(Mat3.#element(this, i, j), Mat3.#element(this, i, k));
        z = Math.atan2(Mat3.#element(this, j, i), -Mat3.#element(this, k, i));
      } else {
        x = Math.atan2(-Mat3.#element(this, j, k), Mat3.#element(this, j, j));
      }
    } else {
      const cy = Math.hypot(Mat3.#element(this, i, i), Mat3.#element(this, j, i));

      y = Math.atan2(-Mat3.#element(this, k, i), cy);

      if (cy > 16 * Number.EPSILON) {
        x = Math.atan2(Mat3.#element(this, k, j), Mat3.#element(this, k, k));
        z = Math.atan2(Mat3.#element(this, j, i), Mat3.#element(this, i, i));
      } else {
        x = Math.atan2(-Mat3.#element(this, j, k), Mat3.#element(this, j, j));
      }
    }

    return frameStatic ? [x * sign, y * sign, z * sign] : [z * sign, y * sign, x * sign];
  }

  /** Creates a 3D rotation matrix from `angle` (in radians) around the x axis. */
  static fromRotationX(angle: number): Mat3 {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);

    return new Mat3(Vec3.X, new Vec3(0, cosa, sina), new Vec3(0, -sina, cosa));
  }

  /** Creates a 3D rotation matrix from `angle` (in radians) around the y axis. */
  static fromRotationY(angle: number): Mat3 {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);

    return new Mat3(new Vec3(cosa, 0, -sina), Vec3.Y, new Vec3(sina, 0, cosa));
  }

  /** Creates a 3D rotation matrix from `angle` (in radians) around the z axis. */
  static fromRotationZ(angle: number): Mat3 {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);

    return new Mat3(new Vec3(cosa, sina, 0), new Vec3(-sina, cosa, 0), Vec3.Z);
  }

  /**
   * Creates an affine transformation matrix from the given 2D `translation`.
   *
   * The resulting matrix can be used to transform 2D points and vectors. See
   * `transformPoint2()` and `transformVector2()`.
   */
  static fromTranslation(translation: Vec2): Mat3 {
    return new Mat3(
      new Vec3(1, 0, 0),
      new Vec3(0, 1, 0),
      new Vec3(translation.x, translation.y, 1),
    );
  }

  /**
   * Creates an affine transformation matrix from the given 2D rotation `angle` (in
   * radians).
   *
   * The resulting matrix can be used to transform 2D points and vectors. See
   * `transformPoint2()` and `transformVector2()`.
   */
  static fromAngle(angle: number): Mat3 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return new Mat3(new Vec3(cos, sin, 0), new Vec3(-sin, cos, 0), new Vec3(0, 0, 1));
  }

  /**
   * Creates an affine transformation matrix from the given 2D `scale`, rotation `angle` (in
   * radians) and `translation`.
   *
   * The resulting matrix can be used to transform 2D points and vectors. See
   * `transformPoint2()` and `transformVector2()`.
   */
  static fromScaleAngleTranslation(scale: Vec2, angle: number, translation: Vec2): Mat3 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return new Mat3(
      new Vec3(cos * scale.x, sin * scale.x, 0),
      new Vec3(-sin * scale.y, cos * scale.y, 0),
      new Vec3(translation.x, translation.y, 1),
    );
  }

  /**
   * Creates an affine transformation matrix from the given non-uniform 2D `scale`.
   *
   * The resulting matrix can be used to transform 2D points and vectors. See
   * `transformPoint2()` and `transformVector2()`.
   */
  static fromScale(scale: Vec2): Mat3 {
    return new Mat3(new Vec3(scale.x, 0, 0), new Vec3(0, scale.y, 0), new Vec3(0, 0, 1));
  }

  /**
   * Creates an affine transformation matrix from the given 2x2 matrix.
   *
   * The resulting matrix can be used to transform 2D points and vectors. See
   * `transformPoint2()` and `transformVector2()`.
   */
  static fromMat2(m: Mat2): Mat3 {
    return new Mat3(
      new Vec3(m.xAxis.x, m.xAxis.y, 0),
      new Vec3(m.yAxis.x, m.yAxis.y, 0),
      new Vec3(0, 0, 1),
    );
  }

  static fromAffine2(m: Affine2): Mat3 {
    return new Mat3(
      new Vec3(m.matrix2.xAxis.x, m.matrix2.xAxis.y, 0),
      new Vec3(m.matrix2.yAxis.x, m.matrix2.yAxis.y, 0),
      new Vec3(m.translation.x, m.translation.y, 1),
    );
  }

  /**
   * Creates a 3x3 matrix from the first 9 values in `slice`.
   *
   * See also `fromRowsSlice` when the slice is in row major order.
   *
   * Throws a `RangeError` if `slice` is less than 9 elements long.
   */
  static fromColsSlice(slice: ArrayLike<number>): Mat3 {
    return new Mat3(
      new Vec3(
        Mat3.#sliceElement(slice, 0),
        Mat3.#sliceElement(slice, 1),
        Mat3.#sliceElement(slice, 2),
      ),
      new Vec3(
        Mat3.#sliceElement(slice, 3),
        Mat3.#sliceElement(slice, 4),
        Mat3.#sliceElement(slice, 5),
      ),
      new Vec3(
        Mat3.#sliceElement(slice, 6),
        Mat3.#sliceElement(slice, 7),
        Mat3.#sliceElement(slice, 8),
      ),
    );
  }

  /**
   * Writes the columns of `this` to the first 9 elements in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 9 elements long.
   */
  writeColsToSlice(slice: { [index: number]: number; readonly length: number }): void {
    if (slice.length < 9) {
      throw new RangeError("index out of bounds");
    }

    slice[0] = this.xAxis.x;
    slice[1] = this.xAxis.y;
    slice[2] = this.xAxis.z;
    slice[3] = this.yAxis.x;
    slice[4] = this.yAxis.y;
    slice[5] = this.yAxis.z;
    slice[6] = this.zAxis.x;
    slice[7] = this.zAxis.y;
    slice[8] = this.zAxis.z;
  }

  /**
   * Creates a 3x3 matrix from the first 9 values in `slice`, stored in row
   * major order.
   *
   * Matrices are stored in column major order, so the slice is permuted into the
   * matrix layout. Use `fromColsSlice` instead when the slice is already in
   * column major order.
   *
   * Throws a `RangeError` if `slice` is less than 9 elements long.
   */
  static fromRowsSlice(slice: ArrayLike<number>): Mat3 {
    return new Mat3(
      new Vec3(
        Mat3.#sliceElement(slice, 0),
        Mat3.#sliceElement(slice, 3),
        Mat3.#sliceElement(slice, 6),
      ),
      new Vec3(
        Mat3.#sliceElement(slice, 1),
        Mat3.#sliceElement(slice, 4),
        Mat3.#sliceElement(slice, 7),
      ),
      new Vec3(
        Mat3.#sliceElement(slice, 2),
        Mat3.#sliceElement(slice, 5),
        Mat3.#sliceElement(slice, 8),
      ),
    );
  }

  /**
   * Returns the matrix column for the given `index`.
   *
   * Throws a `RangeError` if `index` is greater than 2.
   */
  col(index: number): Vec3 {
    switch (index) {
      case 0: {
        return new Vec3(this.xAxis.x, this.xAxis.y, this.xAxis.z);
      }
      case 1: {
        return new Vec3(this.yAxis.x, this.yAxis.y, this.yAxis.z);
      }
      case 2: {
        return new Vec3(this.zAxis.x, this.zAxis.y, this.zAxis.z);
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /**
   * Returns a mutable reference to the matrix column for the given `index`.
   *
   * Throws a `RangeError` if `index` is greater than 2.
   */
  colMut(index: number): Vec3 {
    switch (index) {
      case 0: {
        return this.xAxis;
      }
      case 1: {
        return this.yAxis;
      }
      case 2: {
        return this.zAxis;
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
   * Throws a `RangeError` if `index` is greater than 2.
   */
  row(index: number): Vec3 {
    switch (index) {
      case 0: {
        return new Vec3(this.xAxis.x, this.yAxis.x, this.zAxis.x);
      }
      case 1: {
        return new Vec3(this.xAxis.y, this.yAxis.y, this.zAxis.y);
      }
      case 2: {
        return new Vec3(this.xAxis.z, this.yAxis.z, this.zAxis.z);
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
   * 3 columns and writing it touches every column. Use `colMut`
   * instead when you can work with columns. See also `row`.
   *
   * Throws a `RangeError` if `index` is greater than 2.
   */
  setRow(index: number, row: Vec3): void {
    switch (index) {
      case 0: {
        this.xAxis.x = row.x;
        this.yAxis.x = row.y;
        this.zAxis.x = row.z;

        break;
      }
      case 1: {
        this.xAxis.y = row.x;
        this.yAxis.y = row.y;
        this.zAxis.y = row.z;

        break;
      }
      case 2: {
        this.xAxis.z = row.x;
        this.yAxis.z = row.y;
        this.zAxis.z = row.z;

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
      Number.isFinite(this.xAxis.z) &&
      Number.isFinite(this.yAxis.x) &&
      Number.isFinite(this.yAxis.y) &&
      Number.isFinite(this.yAxis.z) &&
      Number.isFinite(this.zAxis.x) &&
      Number.isFinite(this.zAxis.y) &&
      Number.isFinite(this.zAxis.z)
    );
  }

  /** Returns `true` if any elements are `NaN`. */
  isNan(): boolean {
    return (
      Number.isNaN(this.xAxis.x) ||
      Number.isNaN(this.xAxis.y) ||
      Number.isNaN(this.xAxis.z) ||
      Number.isNaN(this.yAxis.x) ||
      Number.isNaN(this.yAxis.y) ||
      Number.isNaN(this.yAxis.z) ||
      Number.isNaN(this.zAxis.x) ||
      Number.isNaN(this.zAxis.y) ||
      Number.isNaN(this.zAxis.z)
    );
  }

  /** Returns the transpose of `this`. */
  transpose(): Mat3 {
    return new Mat3(
      new Vec3(this.xAxis.x, this.yAxis.x, this.zAxis.x),
      new Vec3(this.xAxis.y, this.yAxis.y, this.zAxis.y),
      new Vec3(this.xAxis.z, this.yAxis.z, this.zAxis.z),
    );
  }

  /** Returns the diagonal of `this`. */
  diagonal(): Vec3 {
    return new Vec3(this.xAxis.x, this.yAxis.y, this.zAxis.z);
  }

  /** Returns the determinant of `this`. */
  determinant(): number {
    const { xAxis, yAxis, zAxis } = this;

    return (
      xAxis.x * (yAxis.y * zAxis.z - yAxis.z * zAxis.y) +
      xAxis.y * (yAxis.z * zAxis.x - yAxis.x * zAxis.z) +
      xAxis.z * (yAxis.x * zAxis.y - yAxis.y * zAxis.x)
    );
  }

  /**
   * Returns the inverse of `this`.
   *
   * If the matrix is not invertible the returned matrix will be invalid. The
   * returned matrix will also be invalid if the inverse is not finite, which can
   * happen when `this` contains very large or very small values. Use
   * `tryInverse` or `inverseOrZero` to detect these cases.
   */
  inverse(): Mat3 {
    const { xAxis, yAxis, zAxis } = this;
    const tmp0x = yAxis.y * zAxis.z - yAxis.z * zAxis.y;
    const tmp0y = yAxis.z * zAxis.x - yAxis.x * zAxis.z;
    const tmp0z = yAxis.x * zAxis.y - yAxis.y * zAxis.x;
    const tmp1x = zAxis.y * xAxis.z - zAxis.z * xAxis.y;
    const tmp1y = zAxis.z * xAxis.x - zAxis.x * xAxis.z;
    const tmp1z = zAxis.x * xAxis.y - zAxis.y * xAxis.x;
    const tmp2x = xAxis.y * yAxis.z - xAxis.z * yAxis.y;
    const tmp2y = xAxis.z * yAxis.x - xAxis.x * yAxis.z;
    const tmp2z = xAxis.x * yAxis.y - xAxis.y * yAxis.x;
    const invDet = 1 / (xAxis.x * tmp0x + xAxis.y * tmp0y + xAxis.z * tmp0z);

    return new Mat3(
      new Vec3(tmp0x * invDet, tmp1x * invDet, tmp2x * invDet),
      new Vec3(tmp0y * invDet, tmp1y * invDet, tmp2y * invDet),
      new Vec3(tmp0z * invDet, tmp1z * invDet, tmp2z * invDet),
    );
  }

  /**
   * Returns the inverse of `this` or `undefined` if the matrix is not invertible, or if
   * the inverse is not finite.
   */
  tryInverse(): Mat3 | undefined {
    const inverse = this.inverse();

    return inverse.isFinite() ? inverse : undefined;
  }

  /**
   * Returns the inverse of `this` or `Mat3.ZERO` if the matrix is not
   * invertible, or if the inverse is not finite.
   */
  inverseOrZero(): Mat3 {
    const inverse = this.inverse();

    return inverse.isFinite() ? inverse : Mat3.ZERO;
  }

  /**
   * Transforms the given 2D vector as a point.
   *
   * This is the equivalent of multiplying `rhs` as a 3D vector where `z` is `1`.
   *
   * This method assumes that `this` contains a valid affine transform.
   */
  transformPoint2(rhs: Vec2): Vec2 {
    const { xAxis, yAxis, zAxis } = this;

    return new Vec2(
      xAxis.x * rhs.x + yAxis.x * rhs.y + zAxis.x,
      xAxis.y * rhs.x + yAxis.y * rhs.y + zAxis.y,
    );
  }

  /**
   * Rotates the given 2D vector.
   *
   * This is the equivalent of multiplying `rhs` as a 3D vector where `z` is `0`.
   *
   * This method assumes that `this` contains a valid affine transform.
   */
  transformVector2(rhs: Vec2): Vec2 {
    const { xAxis, yAxis } = this;

    return new Vec2(xAxis.x * rhs.x + yAxis.x * rhs.y, xAxis.y * rhs.x + yAxis.y * rhs.y);
  }

  /** Transforms a 3D vector. */
  mulVec3(rhs: Vec3): Vec3 {
    const { xAxis, yAxis, zAxis } = this;

    return new Vec3(
      xAxis.x * rhs.x + yAxis.x * rhs.y + zAxis.x * rhs.z,
      xAxis.y * rhs.x + yAxis.y * rhs.y + zAxis.y * rhs.z,
      xAxis.z * rhs.x + yAxis.z * rhs.y + zAxis.z * rhs.z,
    );
  }

  /** Transforms a 3D vector by the transpose of `this`. */
  mulTransposeVec3(rhs: Vec3): Vec3 {
    const { xAxis, yAxis, zAxis } = this;

    return new Vec3(
      xAxis.x * rhs.x + xAxis.y * rhs.y + xAxis.z * rhs.z,
      yAxis.x * rhs.x + yAxis.y * rhs.y + yAxis.z * rhs.z,
      zAxis.x * rhs.x + zAxis.y * rhs.y + zAxis.z * rhs.z,
    );
  }

  /** Multiplies two 3x3 matrices. */
  mulMat3(rhs: Mat3): Mat3 {
    const { xAxis, yAxis, zAxis } = this;

    return new Mat3(
      new Vec3(
        xAxis.x * rhs.xAxis.x + yAxis.x * rhs.xAxis.y + zAxis.x * rhs.xAxis.z,
        xAxis.y * rhs.xAxis.x + yAxis.y * rhs.xAxis.y + zAxis.y * rhs.xAxis.z,
        xAxis.z * rhs.xAxis.x + yAxis.z * rhs.xAxis.y + zAxis.z * rhs.xAxis.z,
      ),
      new Vec3(
        xAxis.x * rhs.yAxis.x + yAxis.x * rhs.yAxis.y + zAxis.x * rhs.yAxis.z,
        xAxis.y * rhs.yAxis.x + yAxis.y * rhs.yAxis.y + zAxis.y * rhs.yAxis.z,
        xAxis.z * rhs.yAxis.x + yAxis.z * rhs.yAxis.y + zAxis.z * rhs.yAxis.z,
      ),
      new Vec3(
        xAxis.x * rhs.zAxis.x + yAxis.x * rhs.zAxis.y + zAxis.x * rhs.zAxis.z,
        xAxis.y * rhs.zAxis.x + yAxis.y * rhs.zAxis.y + zAxis.y * rhs.zAxis.z,
        xAxis.z * rhs.zAxis.x + yAxis.z * rhs.zAxis.y + zAxis.z * rhs.zAxis.z,
      ),
    );
  }

  /** Adds two 3x3 matrices. */
  addMat3(rhs: Mat3): Mat3 {
    return new Mat3(
      new Vec3(this.xAxis.x + rhs.xAxis.x, this.xAxis.y + rhs.xAxis.y, this.xAxis.z + rhs.xAxis.z),
      new Vec3(this.yAxis.x + rhs.yAxis.x, this.yAxis.y + rhs.yAxis.y, this.yAxis.z + rhs.yAxis.z),
      new Vec3(this.zAxis.x + rhs.zAxis.x, this.zAxis.y + rhs.zAxis.y, this.zAxis.z + rhs.zAxis.z),
    );
  }

  /** Subtracts two 3x3 matrices. */
  subMat3(rhs: Mat3): Mat3 {
    return new Mat3(
      new Vec3(this.xAxis.x - rhs.xAxis.x, this.xAxis.y - rhs.xAxis.y, this.xAxis.z - rhs.xAxis.z),
      new Vec3(this.yAxis.x - rhs.yAxis.x, this.yAxis.y - rhs.yAxis.y, this.yAxis.z - rhs.yAxis.z),
      new Vec3(this.zAxis.x - rhs.zAxis.x, this.zAxis.y - rhs.zAxis.y, this.zAxis.z - rhs.zAxis.z),
    );
  }

  /** Multiplies a 3x3 matrix by a scalar. */
  mulScalar(rhs: number): Mat3 {
    return new Mat3(
      new Vec3(this.xAxis.x * rhs, this.xAxis.y * rhs, this.xAxis.z * rhs),
      new Vec3(this.yAxis.x * rhs, this.yAxis.y * rhs, this.yAxis.z * rhs),
      new Vec3(this.zAxis.x * rhs, this.zAxis.y * rhs, this.zAxis.z * rhs),
    );
  }

  /**
   * Multiply `this` by a scaling vector `scale`.
   * This is faster than creating a whole diagonal scaling matrix and then multiplying that.
   * This operation is commutative.
   */
  mulDiagonalScale(scale: Vec3): Mat3 {
    return new Mat3(
      new Vec3(this.xAxis.x * scale.x, this.xAxis.y * scale.x, this.xAxis.z * scale.x),
      new Vec3(this.yAxis.x * scale.y, this.yAxis.y * scale.y, this.yAxis.z * scale.y),
      new Vec3(this.zAxis.x * scale.z, this.zAxis.y * scale.z, this.zAxis.z * scale.z),
    );
  }

  /** Divides a 3x3 matrix by a scalar. */
  divScalar(rhs: number): Mat3 {
    return new Mat3(
      new Vec3(this.xAxis.x / rhs, this.xAxis.y / rhs, this.xAxis.z / rhs),
      new Vec3(this.yAxis.x / rhs, this.yAxis.y / rhs, this.yAxis.z / rhs),
      new Vec3(this.zAxis.x / rhs, this.zAxis.y / rhs, this.zAxis.z / rhs),
    );
  }

  /** Returns a matrix containing the reciprocal `1.0/n` of each element of `this`. */
  recip(): Mat3 {
    return new Mat3(
      new Vec3(1 / this.xAxis.x, 1 / this.xAxis.y, 1 / this.xAxis.z),
      new Vec3(1 / this.yAxis.x, 1 / this.yAxis.y, 1 / this.yAxis.z),
      new Vec3(1 / this.zAxis.x, 1 / this.zAxis.y, 1 / this.zAxis.z),
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
  absDiffEq(rhs: Mat3, maxAbsDiff: number): boolean {
    return (
      Math.abs(this.xAxis.x - rhs.xAxis.x) <= maxAbsDiff &&
      Math.abs(this.xAxis.y - rhs.xAxis.y) <= maxAbsDiff &&
      Math.abs(this.xAxis.z - rhs.xAxis.z) <= maxAbsDiff &&
      Math.abs(this.yAxis.x - rhs.yAxis.x) <= maxAbsDiff &&
      Math.abs(this.yAxis.y - rhs.yAxis.y) <= maxAbsDiff &&
      Math.abs(this.yAxis.z - rhs.yAxis.z) <= maxAbsDiff &&
      Math.abs(this.zAxis.x - rhs.zAxis.x) <= maxAbsDiff &&
      Math.abs(this.zAxis.y - rhs.zAxis.y) <= maxAbsDiff &&
      Math.abs(this.zAxis.z - rhs.zAxis.z) <= maxAbsDiff
    );
  }

  /** Takes the absolute value of each element in `this` */
  abs(): Mat3 {
    return new Mat3(
      new Vec3(Math.abs(this.xAxis.x), Math.abs(this.xAxis.y), Math.abs(this.xAxis.z)),
      new Vec3(Math.abs(this.yAxis.x), Math.abs(this.yAxis.y), Math.abs(this.yAxis.z)),
      new Vec3(Math.abs(this.zAxis.x), Math.abs(this.zAxis.y), Math.abs(this.zAxis.z)),
    );
  }

  clone(): Mat3 {
    return new Mat3(
      new Vec3(this.xAxis.x, this.xAxis.y, this.xAxis.z),
      new Vec3(this.yAxis.x, this.yAxis.y, this.yAxis.z),
      new Vec3(this.zAxis.x, this.zAxis.y, this.zAxis.z),
    );
  }

  add(rhs: Mat3): Mat3 {
    return this.addMat3(rhs);
  }

  sub(rhs: Mat3): Mat3 {
    return this.subMat3(rhs);
  }

  neg(): Mat3 {
    return new Mat3(
      new Vec3(-this.xAxis.x, -this.xAxis.y, -this.xAxis.z),
      new Vec3(-this.yAxis.x, -this.yAxis.y, -this.yAxis.z),
      new Vec3(-this.zAxis.x, -this.zAxis.y, -this.zAxis.z),
    );
  }

  mul(rhs: Vec3): Vec3;
  mul(rhs: Mat3 | Affine2 | number): Mat3;
  mul(rhs: Mat3 | Affine2 | Vec3 | number): Mat3 | Vec3 {
    if (typeof rhs === "number") {
      return this.mulScalar(rhs);
    }

    if (rhs instanceof Vec3) {
      return this.mulVec3(rhs);
    }

    if (rhs instanceof Mat3) {
      return this.mulMat3(rhs);
    }

    const { xAxis, yAxis, zAxis } = this;

    return new Mat3(
      new Vec3(
        xAxis.x * rhs.matrix2.xAxis.x + yAxis.x * rhs.matrix2.xAxis.y,
        xAxis.y * rhs.matrix2.xAxis.x + yAxis.y * rhs.matrix2.xAxis.y,
        xAxis.z * rhs.matrix2.xAxis.x + yAxis.z * rhs.matrix2.xAxis.y,
      ),
      new Vec3(
        xAxis.x * rhs.matrix2.yAxis.x + yAxis.x * rhs.matrix2.yAxis.y,
        xAxis.y * rhs.matrix2.yAxis.x + yAxis.y * rhs.matrix2.yAxis.y,
        xAxis.z * rhs.matrix2.yAxis.x + yAxis.z * rhs.matrix2.yAxis.y,
      ),
      new Vec3(
        xAxis.x * rhs.translation.x + yAxis.x * rhs.translation.y + zAxis.x,
        xAxis.y * rhs.translation.x + yAxis.y * rhs.translation.y + zAxis.y,
        xAxis.z * rhs.translation.x + yAxis.z * rhs.translation.y + zAxis.z,
      ),
    );
  }

  div(rhs: number): Mat3 {
    return this.divScalar(rhs);
  }

  addAssign(rhs: Mat3): this {
    this.xAxis.x += rhs.xAxis.x;
    this.xAxis.y += rhs.xAxis.y;
    this.xAxis.z += rhs.xAxis.z;
    this.yAxis.x += rhs.yAxis.x;
    this.yAxis.y += rhs.yAxis.y;
    this.yAxis.z += rhs.yAxis.z;
    this.zAxis.x += rhs.zAxis.x;
    this.zAxis.y += rhs.zAxis.y;
    this.zAxis.z += rhs.zAxis.z;

    return this;
  }

  subAssign(rhs: Mat3): this {
    this.xAxis.x -= rhs.xAxis.x;
    this.xAxis.y -= rhs.xAxis.y;
    this.xAxis.z -= rhs.xAxis.z;
    this.yAxis.x -= rhs.yAxis.x;
    this.yAxis.y -= rhs.yAxis.y;
    this.yAxis.z -= rhs.yAxis.z;
    this.zAxis.x -= rhs.zAxis.x;
    this.zAxis.y -= rhs.zAxis.y;
    this.zAxis.z -= rhs.zAxis.z;

    return this;
  }

  mulAssign(rhs: Mat3 | Affine2 | number): this {
    if (typeof rhs === "number") {
      this.xAxis.x *= rhs;
      this.xAxis.y *= rhs;
      this.xAxis.z *= rhs;
      this.yAxis.x *= rhs;
      this.yAxis.y *= rhs;
      this.yAxis.z *= rhs;
      this.zAxis.x *= rhs;
      this.zAxis.y *= rhs;
      this.zAxis.z *= rhs;

      return this;
    }

    const { xAxis, yAxis, zAxis } = this;

    if (!(rhs instanceof Mat3)) {
      const a00 = xAxis.x * rhs.matrix2.xAxis.x + yAxis.x * rhs.matrix2.xAxis.y;
      const a01 = xAxis.y * rhs.matrix2.xAxis.x + yAxis.y * rhs.matrix2.xAxis.y;
      const a02 = xAxis.z * rhs.matrix2.xAxis.x + yAxis.z * rhs.matrix2.xAxis.y;
      const a10 = xAxis.x * rhs.matrix2.yAxis.x + yAxis.x * rhs.matrix2.yAxis.y;
      const a11 = xAxis.y * rhs.matrix2.yAxis.x + yAxis.y * rhs.matrix2.yAxis.y;
      const a12 = xAxis.z * rhs.matrix2.yAxis.x + yAxis.z * rhs.matrix2.yAxis.y;
      const a20 = xAxis.x * rhs.translation.x + yAxis.x * rhs.translation.y + zAxis.x;
      const a21 = xAxis.y * rhs.translation.x + yAxis.y * rhs.translation.y + zAxis.y;
      const a22 = xAxis.z * rhs.translation.x + yAxis.z * rhs.translation.y + zAxis.z;

      this.xAxis.x = a00;
      this.xAxis.y = a01;
      this.xAxis.z = a02;
      this.yAxis.x = a10;
      this.yAxis.y = a11;
      this.yAxis.z = a12;
      this.zAxis.x = a20;
      this.zAxis.y = a21;
      this.zAxis.z = a22;

      return this;
    }

    const m00 = xAxis.x * rhs.xAxis.x + yAxis.x * rhs.xAxis.y + zAxis.x * rhs.xAxis.z;
    const m01 = xAxis.y * rhs.xAxis.x + yAxis.y * rhs.xAxis.y + zAxis.y * rhs.xAxis.z;
    const m02 = xAxis.z * rhs.xAxis.x + yAxis.z * rhs.xAxis.y + zAxis.z * rhs.xAxis.z;
    const m10 = xAxis.x * rhs.yAxis.x + yAxis.x * rhs.yAxis.y + zAxis.x * rhs.yAxis.z;
    const m11 = xAxis.y * rhs.yAxis.x + yAxis.y * rhs.yAxis.y + zAxis.y * rhs.yAxis.z;
    const m12 = xAxis.z * rhs.yAxis.x + yAxis.z * rhs.yAxis.y + zAxis.z * rhs.yAxis.z;
    const m20 = xAxis.x * rhs.zAxis.x + yAxis.x * rhs.zAxis.y + zAxis.x * rhs.zAxis.z;
    const m21 = xAxis.y * rhs.zAxis.x + yAxis.y * rhs.zAxis.y + zAxis.y * rhs.zAxis.z;
    const m22 = xAxis.z * rhs.zAxis.x + yAxis.z * rhs.zAxis.y + zAxis.z * rhs.zAxis.z;

    this.xAxis.x = m00;
    this.xAxis.y = m01;
    this.xAxis.z = m02;
    this.yAxis.x = m10;
    this.yAxis.y = m11;
    this.yAxis.z = m12;
    this.zAxis.x = m20;
    this.zAxis.y = m21;
    this.zAxis.z = m22;

    return this;
  }

  divAssign(rhs: number): this {
    this.xAxis.x /= rhs;
    this.xAxis.y /= rhs;
    this.xAxis.z /= rhs;
    this.yAxis.x /= rhs;
    this.yAxis.y /= rhs;
    this.yAxis.z /= rhs;
    this.zAxis.x /= rhs;
    this.zAxis.y /= rhs;
    this.zAxis.z /= rhs;

    return this;
  }

  eq(rhs: Mat3): boolean {
    return (
      this.xAxis.x === rhs.xAxis.x &&
      this.xAxis.y === rhs.xAxis.y &&
      this.xAxis.z === rhs.xAxis.z &&
      this.yAxis.x === rhs.yAxis.x &&
      this.yAxis.y === rhs.yAxis.y &&
      this.yAxis.z === rhs.yAxis.z &&
      this.zAxis.x === rhs.zAxis.x &&
      this.zAxis.y === rhs.zAxis.y &&
      this.zAxis.z === rhs.zAxis.z
    );
  }

  ne(rhs: Mat3): boolean {
    return (
      this.xAxis.x !== rhs.xAxis.x ||
      this.xAxis.y !== rhs.xAxis.y ||
      this.xAxis.z !== rhs.xAxis.z ||
      this.yAxis.x !== rhs.yAxis.x ||
      this.yAxis.y !== rhs.yAxis.y ||
      this.yAxis.z !== rhs.yAxis.z ||
      this.zAxis.x !== rhs.zAxis.x ||
      this.zAxis.y !== rhs.zAxis.y ||
      this.zAxis.z !== rhs.zAxis.z
    );
  }

  toString(): string {
    return `[[${this.xAxis.x}, ${this.xAxis.y}, ${this.xAxis.z}], [${this.yAxis.x}, ${this.yAxis.y}, ${this.yAxis.z}], [${this.zAxis.x}, ${this.zAxis.y}, ${this.zAxis.z}]]`;
  }

  static #axis(m: Mat3, index: number): Vec3 {
    switch (index) {
      case 0: {
        return m.xAxis;
      }
      case 1: {
        return m.yAxis;
      }
      default: {
        return m.zAxis;
      }
    }
  }

  static #component(v: Vec3, index: number): number {
    switch (index) {
      case 0: {
        return v.x;
      }
      case 1: {
        return v.y;
      }
      default: {
        return v.z;
      }
    }
  }

  static #element(m: Mat3, col: number, row: number): number {
    return Mat3.#component(Mat3.#axis(m, col), row);
  }

  static #minor(a: Vec4, b: Vec4, c: Vec4, j: number): Mat3 {
    switch (j) {
      case 0: {
        return new Mat3(new Vec3(a.y, a.z, a.w), new Vec3(b.y, b.z, b.w), new Vec3(c.y, c.z, c.w));
      }
      case 1: {
        return new Mat3(new Vec3(a.x, a.z, a.w), new Vec3(b.x, b.z, b.w), new Vec3(c.x, c.z, c.w));
      }
      case 2: {
        return new Mat3(new Vec3(a.x, a.y, a.w), new Vec3(b.x, b.y, b.w), new Vec3(c.x, c.y, c.w));
      }
      case 3: {
        return new Mat3(new Vec3(a.x, a.y, a.z), new Vec3(b.x, b.y, b.z), new Vec3(c.x, c.y, c.z));
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

/** Creates a 3x3 matrix from three column vectors. */
export function mat3(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): Mat3 {
  return new Mat3(xAxis, yAxis, zAxis);
}
