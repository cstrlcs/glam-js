import type { Affine3 } from "./Affine3.js";
import type { EulerRot } from "./EulerRot.js";

import { Mat3 } from "./Mat3.js";
import { Quat } from "./Quat.js";
import { Vec3 } from "./Vec3.js";
import { Vec4 } from "./Vec4.js";

/**
 * A 4x4 column major matrix.
 *
 * If you are primarily dealing with 3D affine transformations
 * considering using `Affine3` which is faster than a 4x4 matrix
 * for some affine operations.
 *
 * Affine transformations including 3D translation, rotation and scale can be created
 * using methods such as `fromTranslation()`, `fromQuat()`,
 * `fromScale()` and `fromScaleRotationTranslation()`.
 *
 * The `transformPoint3()` and `transformVector3()` convenience methods
 * are provided for performing affine transformations on 3D vectors and points. These
 * multiply 3D inputs as 4D vectors with an implicit `w` value of `1` for points and `0`
 * for vectors respectively. These methods assume that `Mat4` contains a valid affine
 * transform.
 */
export class Mat4 {
  declare xAxis: Vec4;
  declare yAxis: Vec4;
  declare zAxis: Vec4;
  declare wAxis: Vec4;

  constructor(xAxis: Vec4, yAxis: Vec4, zAxis: Vec4, wAxis: Vec4) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.zAxis = zAxis;
    this.wAxis = wAxis;
  }

  /** A 4x4 matrix with all elements set to `0.0`. */
  static get ZERO() {
    return new Mat4(
      new Vec4(0, 0, 0, 0),
      new Vec4(0, 0, 0, 0),
      new Vec4(0, 0, 0, 0),
      new Vec4(0, 0, 0, 0),
    );
  }

  /** A 4x4 identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
  static get IDENTITY() {
    return new Mat4(
      new Vec4(1, 0, 0, 0),
      new Vec4(0, 1, 0, 0),
      new Vec4(0, 0, 1, 0),
      new Vec4(0, 0, 0, 1),
    );
  }

  /** All NAN:s. */
  static get NAN() {
    return new Mat4(
      new Vec4(Number.NaN, Number.NaN, Number.NaN, Number.NaN),
      new Vec4(Number.NaN, Number.NaN, Number.NaN, Number.NaN),
      new Vec4(Number.NaN, Number.NaN, Number.NaN, Number.NaN),
      new Vec4(Number.NaN, Number.NaN, Number.NaN, Number.NaN),
    );
  }

  static new(
    m00: number,
    m01: number,
    m02: number,
    m03: number,
    m10: number,
    m11: number,
    m12: number,
    m13: number,
    m20: number,
    m21: number,
    m22: number,
    m23: number,
    m30: number,
    m31: number,
    m32: number,
    m33: number,
  ): Mat4 {
    return new Mat4(
      new Vec4(m00, m01, m02, m03),
      new Vec4(m10, m11, m12, m13),
      new Vec4(m20, m21, m22, m23),
      new Vec4(m30, m31, m32, m33),
    );
  }

  /**
   * Creates a 4x4 matrix from four column vectors.
   *
   * See also `fromRows` when the data is in row major order.
   */
  static fromCols(xAxis: Vec4, yAxis: Vec4, zAxis: Vec4, wAxis: Vec4): Mat4 {
    return new Mat4(xAxis, yAxis, zAxis, wAxis);
  }

  /**
   * Creates a 4x4 matrix from four row vectors.
   *
   * Matrices are stored in column major order, so the given rows are permuted into
   * the matrix layout. Use `fromCols` instead when the data is already in
   * column major order.
   */
  static fromRows(row0: Vec4, row1: Vec4, row2: Vec4, row3: Vec4): Mat4 {
    return new Mat4(
      new Vec4(row0.x, row1.x, row2.x, row3.x),
      new Vec4(row0.y, row1.y, row2.y, row3.y),
      new Vec4(row0.z, row1.z, row2.z, row3.z),
      new Vec4(row0.w, row1.w, row2.w, row3.w),
    );
  }

  /**
   * Creates a 4x4 matrix from a `[number; 16]` array stored in column major order.
   *
   * If the data is in row major order use `fromRowsArray` instead.
   */
  static fromColsArray(
    m: [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ],
  ): Mat4 {
    return new Mat4(
      new Vec4(m[0], m[1], m[2], m[3]),
      new Vec4(m[4], m[5], m[6], m[7]),
      new Vec4(m[8], m[9], m[10], m[11]),
      new Vec4(m[12], m[13], m[14], m[15]),
    );
  }

  /**
   * Creates a `[number; 16]` array storing data in column major order.
   *
   * If you require the data in row major order use `toRowsArray` instead.
   */
  toColsArray(): [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ] {
    return [
      this.xAxis.x,
      this.xAxis.y,
      this.xAxis.z,
      this.xAxis.w,
      this.yAxis.x,
      this.yAxis.y,
      this.yAxis.z,
      this.yAxis.w,
      this.zAxis.x,
      this.zAxis.y,
      this.zAxis.z,
      this.zAxis.w,
      this.wAxis.x,
      this.wAxis.y,
      this.wAxis.z,
      this.wAxis.w,
    ];
  }

  /**
   * Creates a 4x4 matrix from a `[[number; 4]; 4]` 4D array stored in column major order.
   *
   * If the data is in row major order `transpose` the returned matrix.
   */
  static fromColsArray2d(
    m: [
      [number, number, number, number],
      [number, number, number, number],
      [number, number, number, number],
      [number, number, number, number],
    ],
  ): Mat4 {
    return new Mat4(
      new Vec4(m[0][0], m[0][1], m[0][2], m[0][3]),
      new Vec4(m[1][0], m[1][1], m[1][2], m[1][3]),
      new Vec4(m[2][0], m[2][1], m[2][2], m[2][3]),
      new Vec4(m[3][0], m[3][1], m[3][2], m[3][3]),
    );
  }

  /**
   * Creates a `[[number; 4]; 4]` 4D array storing data in column major order.
   *
   * If you require row major order `transpose` the matrix first.
   */
  toColsArray2d(): [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
  ] {
    return [
      [this.xAxis.x, this.xAxis.y, this.xAxis.z, this.xAxis.w],
      [this.yAxis.x, this.yAxis.y, this.yAxis.z, this.yAxis.w],
      [this.zAxis.x, this.zAxis.y, this.zAxis.z, this.zAxis.w],
      [this.wAxis.x, this.wAxis.y, this.wAxis.z, this.wAxis.w],
    ];
  }

  /**
   * Creates a 4x4 matrix from a `[number; 16]` array stored in row major order.
   *
   * Matrices are stored in column major order, so the array is permuted into the
   * matrix layout. Use `fromColsArray` instead when the data is already in
   * column major order.
   */
  static fromRowsArray(
    m: [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ],
  ): Mat4 {
    return new Mat4(
      new Vec4(m[0], m[4], m[8], m[12]),
      new Vec4(m[1], m[5], m[9], m[13]),
      new Vec4(m[2], m[6], m[10], m[14]),
      new Vec4(m[3], m[7], m[11], m[15]),
    );
  }

  /**
   * Creates a `[number; 16]` array storing data in row major order.
   *
   * Matrices are stored in column major order, so the array is permuted out of the
   * column major storage. Use `toColsArray` instead when you want data in
   * column major order.
   */
  toRowsArray(): [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ] {
    return [
      this.xAxis.x,
      this.yAxis.x,
      this.zAxis.x,
      this.wAxis.x,
      this.xAxis.y,
      this.yAxis.y,
      this.zAxis.y,
      this.wAxis.y,
      this.xAxis.z,
      this.yAxis.z,
      this.zAxis.z,
      this.wAxis.z,
      this.xAxis.w,
      this.yAxis.w,
      this.zAxis.w,
      this.wAxis.w,
    ];
  }

  /** Creates a 4x4 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
  static fromDiagonal(diagonal: Vec4): Mat4 {
    return new Mat4(
      new Vec4(diagonal.x, 0, 0, 0),
      new Vec4(0, diagonal.y, 0, 0),
      new Vec4(0, 0, diagonal.z, 0),
      new Vec4(0, 0, 0, diagonal.w),
    );
  }

  /**
   * Creates an affine transformation matrix from the given 3D `scale`, `rotation` and
   * `translation`.
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromScaleRotationTranslation(scale: Vec3, rotation: Quat, translation: Vec3): Mat4 {
    return Mat4.#fromQuatScaleTranslation(
      rotation,
      scale,
      new Vec4(translation.x, translation.y, translation.z, 1),
    );
  }

  /**
   * Creates an affine transformation matrix from the given 3D `translation`.
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromRotationTranslation(rotation: Quat, translation: Vec3): Mat4 {
    return Mat4.#fromQuatScaleTranslation(
      rotation,
      new Vec3(1, 1, 1),
      new Vec4(translation.x, translation.y, translation.z, 1),
    );
  }

  /**
   * Extracts `scale`, `rotation` and `translation` from `this`. The input matrix is
   * expected to be a 3D affine transformation matrix otherwise the output will be invalid.
   */
  toScaleRotationTranslation(): [Vec3, Quat, Vec3] {
    const r = Mat3.fromMat4(this);
    const det = r.determinant();

    const scale = new Vec3(
      r.xAxis.length() * (det < 0 || Object.is(det, -0) ? -1 : 1),
      r.yAxis.length(),
      r.zAxis.length(),
    );

    const rotation = Quat.fromRotationAxes(
      r.xAxis.mul(1 / scale.x),
      r.yAxis.mul(1 / scale.y),
      r.zAxis.mul(1 / scale.z),
    );

    return [scale, rotation, new Vec3(this.wAxis.x, this.wAxis.y, this.wAxis.z)];
  }

  /**
   * Creates an affine transformation matrix from the given `rotation` quaternion.
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromQuat(rotation: Quat): Mat4 {
    return Mat4.#fromQuatScaleTranslation(rotation, new Vec3(1, 1, 1), new Vec4(0, 0, 0, 1));
  }

  /**
   * Creates an affine transformation matrix from the given 3x3 linear transformation
   * matrix.
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromMat3(m: Mat3): Mat4 {
    return new Mat4(
      new Vec4(m.xAxis.x, m.xAxis.y, m.xAxis.z, 0),
      new Vec4(m.yAxis.x, m.yAxis.y, m.yAxis.z, 0),
      new Vec4(m.zAxis.x, m.zAxis.y, m.zAxis.z, 0),
      new Vec4(0, 0, 0, 1),
    );
  }

  /**
   * Creates an affine transformation matrics from a 3x3 matrix (expressing scale, shear and
   * rotation) and a translation vector.
   *
   * Equivalent to `Mat4.fromTranslation(translation).mul(Mat4.fromMat3(mat3))`
   */
  static fromMat3Translation(mat3: Mat3, translation: Vec3): Mat4 {
    return new Mat4(
      new Vec4(mat3.xAxis.x, mat3.xAxis.y, mat3.xAxis.z, 0),
      new Vec4(mat3.yAxis.x, mat3.yAxis.y, mat3.yAxis.z, 0),
      new Vec4(mat3.zAxis.x, mat3.zAxis.y, mat3.zAxis.z, 0),
      new Vec4(translation.x, translation.y, translation.z, 1),
    );
  }

  static fromAffine3(m: Affine3): Mat4 {
    return new Mat4(
      new Vec4(m.matrix3.xAxis.x, m.matrix3.xAxis.y, m.matrix3.xAxis.z, 0),
      new Vec4(m.matrix3.yAxis.x, m.matrix3.yAxis.y, m.matrix3.yAxis.z, 0),
      new Vec4(m.matrix3.zAxis.x, m.matrix3.zAxis.y, m.matrix3.zAxis.z, 0),
      new Vec4(m.translation.x, m.translation.y, m.translation.z, 1),
    );
  }

  /**
   * Creates an affine transformation matrix from the given 3D `translation`.
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromTranslation(translation: Vec3): Mat4 {
    return new Mat4(
      new Vec4(1, 0, 0, 0),
      new Vec4(0, 1, 0, 0),
      new Vec4(0, 0, 1, 0),
      new Vec4(translation.x, translation.y, translation.z, 1),
    );
  }

  /**
   * Creates an affine transformation matrix containing a 3D rotation around a normalized
   * rotation `axis` of `angle` (in radians).
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromAxisAngle(axis: Vec3, angle: number): Mat4 {
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

    return new Mat4(
      new Vec4(x * x * omc + cos, xyomc + zsin, xzomc - ysin, 0),
      new Vec4(xyomc - zsin, y * y * omc + cos, yzomc + xsin, 0),
      new Vec4(xzomc + ysin, yzomc - xsin, z * z * omc + cos, 0),
      new Vec4(0, 0, 0, 1),
    );
  }

  /**
   * Creates a affine transformation matrix containing a rotation from the given euler
   * rotation sequence and angles (in radians).
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromEuler(order: EulerRot, a: number, b: number, c: number): Mat4 {
    return Mat4.fromMat3(Mat3.fromEuler(order, a, b, c));
  }

  /**
   * Extract Euler angles with the given Euler rotation order.
   *
   * Note if the upper 3x3 matrix contain scales, shears, or other non-rotation transformations
   * then the resulting Euler angles will be ill-defined.
   */
  toEuler(order: EulerRot): [number, number, number] {
    return Mat3.fromMat4(this).toEuler(order);
  }

  /**
   * Creates an affine transformation matrix containing a 3D rotation around the x axis of
   * `angle` (in radians).
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromRotationX(angle: number): Mat4 {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);

    return new Mat4(
      new Vec4(1, 0, 0, 0),
      new Vec4(0, cosa, sina, 0),
      new Vec4(0, -sina, cosa, 0),
      new Vec4(0, 0, 0, 1),
    );
  }

  /**
   * Creates an affine transformation matrix containing a 3D rotation around the y axis of
   * `angle` (in radians).
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromRotationY(angle: number): Mat4 {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);

    return new Mat4(
      new Vec4(cosa, 0, -sina, 0),
      new Vec4(0, 1, 0, 0),
      new Vec4(sina, 0, cosa, 0),
      new Vec4(0, 0, 0, 1),
    );
  }

  /**
   * Creates an affine transformation matrix containing a 3D rotation around the z axis of
   * `angle` (in radians).
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromRotationZ(angle: number): Mat4 {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);

    return new Mat4(
      new Vec4(cosa, sina, 0, 0),
      new Vec4(-sina, cosa, 0, 0),
      new Vec4(0, 0, 1, 0),
      new Vec4(0, 0, 0, 1),
    );
  }

  /**
   * Creates an affine transformation matrix containing the given 3D non-uniform `scale`.
   *
   * The resulting matrix can be used to transform 3D points and vectors. See
   * `transformPoint3()` and `transformVector3()`.
   */
  static fromScale(scale: Vec3): Mat4 {
    return new Mat4(
      new Vec4(scale.x, 0, 0, 0),
      new Vec4(0, scale.y, 0, 0),
      new Vec4(0, 0, scale.z, 0),
      new Vec4(0, 0, 0, 1),
    );
  }

  /**
   * Creates a 4x4 matrix from the first 16 values in `slice`.
   *
   * See also `fromRowsSlice` when the slice is in row major order.
   *
   * Throws a `RangeError` if `slice` is less than 16 elements long.
   */
  static fromColsSlice(slice: ArrayLike<number>): Mat4 {
    return new Mat4(
      new Vec4(
        Mat4.#sliceElement(slice, 0),
        Mat4.#sliceElement(slice, 1),
        Mat4.#sliceElement(slice, 2),
        Mat4.#sliceElement(slice, 3),
      ),
      new Vec4(
        Mat4.#sliceElement(slice, 4),
        Mat4.#sliceElement(slice, 5),
        Mat4.#sliceElement(slice, 6),
        Mat4.#sliceElement(slice, 7),
      ),
      new Vec4(
        Mat4.#sliceElement(slice, 8),
        Mat4.#sliceElement(slice, 9),
        Mat4.#sliceElement(slice, 10),
        Mat4.#sliceElement(slice, 11),
      ),
      new Vec4(
        Mat4.#sliceElement(slice, 12),
        Mat4.#sliceElement(slice, 13),
        Mat4.#sliceElement(slice, 14),
        Mat4.#sliceElement(slice, 15),
      ),
    );
  }

  /**
   * Writes the columns of `this` to the first 16 elements in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 16 elements long.
   */
  writeColsToSlice(slice: { [index: number]: number; readonly length: number }): void {
    if (slice.length < 16) {
      throw new RangeError("index out of bounds");
    }

    slice[0] = this.xAxis.x;
    slice[1] = this.xAxis.y;
    slice[2] = this.xAxis.z;
    slice[3] = this.xAxis.w;
    slice[4] = this.yAxis.x;
    slice[5] = this.yAxis.y;
    slice[6] = this.yAxis.z;
    slice[7] = this.yAxis.w;
    slice[8] = this.zAxis.x;
    slice[9] = this.zAxis.y;
    slice[10] = this.zAxis.z;
    slice[11] = this.zAxis.w;
    slice[12] = this.wAxis.x;
    slice[13] = this.wAxis.y;
    slice[14] = this.wAxis.z;
    slice[15] = this.wAxis.w;
  }

  /**
   * Creates a 4x4 matrix from the first 16 values in `slice`, stored in row
   * major order.
   *
   * Matrices are stored in column major order, so the slice is permuted into the
   * matrix layout. Use `fromColsSlice` instead when the slice is already in
   * column major order.
   *
   * Throws a `RangeError` if `slice` is less than 16 elements long.
   */
  static fromRowsSlice(slice: ArrayLike<number>): Mat4 {
    return new Mat4(
      new Vec4(
        Mat4.#sliceElement(slice, 0),
        Mat4.#sliceElement(slice, 4),
        Mat4.#sliceElement(slice, 8),
        Mat4.#sliceElement(slice, 12),
      ),
      new Vec4(
        Mat4.#sliceElement(slice, 1),
        Mat4.#sliceElement(slice, 5),
        Mat4.#sliceElement(slice, 9),
        Mat4.#sliceElement(slice, 13),
      ),
      new Vec4(
        Mat4.#sliceElement(slice, 2),
        Mat4.#sliceElement(slice, 6),
        Mat4.#sliceElement(slice, 10),
        Mat4.#sliceElement(slice, 14),
      ),
      new Vec4(
        Mat4.#sliceElement(slice, 3),
        Mat4.#sliceElement(slice, 7),
        Mat4.#sliceElement(slice, 11),
        Mat4.#sliceElement(slice, 15),
      ),
    );
  }

  /**
   * Returns the matrix column for the given `index`.
   *
   * Throws a `RangeError` if `index` is greater than 3.
   */
  col(index: number): Vec4 {
    switch (index) {
      case 0: {
        return new Vec4(this.xAxis.x, this.xAxis.y, this.xAxis.z, this.xAxis.w);
      }
      case 1: {
        return new Vec4(this.yAxis.x, this.yAxis.y, this.yAxis.z, this.yAxis.w);
      }
      case 2: {
        return new Vec4(this.zAxis.x, this.zAxis.y, this.zAxis.z, this.zAxis.w);
      }
      case 3: {
        return new Vec4(this.wAxis.x, this.wAxis.y, this.wAxis.z, this.wAxis.w);
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /**
   * Returns a mutable reference to the matrix column for the given `index`.
   *
   * Throws a `RangeError` if `index` is greater than 3.
   */
  colMut(index: number): Vec4 {
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
      case 3: {
        return this.wAxis;
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
   * Throws a `RangeError` if `index` is greater than 3.
   */
  row(index: number): Vec4 {
    switch (index) {
      case 0: {
        return new Vec4(this.xAxis.x, this.yAxis.x, this.zAxis.x, this.wAxis.x);
      }
      case 1: {
        return new Vec4(this.xAxis.y, this.yAxis.y, this.zAxis.y, this.wAxis.y);
      }
      case 2: {
        return new Vec4(this.xAxis.z, this.yAxis.z, this.zAxis.z, this.wAxis.z);
      }
      case 3: {
        return new Vec4(this.xAxis.w, this.yAxis.w, this.zAxis.w, this.wAxis.w);
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
   * 4 columns and writing it touches every column. Use `colMut`
   * instead when you can work with columns. See also `row`.
   *
   * Throws a `RangeError` if `index` is greater than 3.
   */
  setRow(index: number, row: Vec4): void {
    switch (index) {
      case 0: {
        this.xAxis.x = row.x;
        this.yAxis.x = row.y;
        this.zAxis.x = row.z;
        this.wAxis.x = row.w;

        break;
      }
      case 1: {
        this.xAxis.y = row.x;
        this.yAxis.y = row.y;
        this.zAxis.y = row.z;
        this.wAxis.y = row.w;

        break;
      }
      case 2: {
        this.xAxis.z = row.x;
        this.yAxis.z = row.y;
        this.zAxis.z = row.z;
        this.wAxis.z = row.w;

        break;
      }
      case 3: {
        this.xAxis.w = row.x;
        this.yAxis.w = row.y;
        this.zAxis.w = row.z;
        this.wAxis.w = row.w;

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
      Number.isFinite(this.xAxis.w) &&
      Number.isFinite(this.yAxis.x) &&
      Number.isFinite(this.yAxis.y) &&
      Number.isFinite(this.yAxis.z) &&
      Number.isFinite(this.yAxis.w) &&
      Number.isFinite(this.zAxis.x) &&
      Number.isFinite(this.zAxis.y) &&
      Number.isFinite(this.zAxis.z) &&
      Number.isFinite(this.zAxis.w) &&
      Number.isFinite(this.wAxis.x) &&
      Number.isFinite(this.wAxis.y) &&
      Number.isFinite(this.wAxis.z) &&
      Number.isFinite(this.wAxis.w)
    );
  }

  /** Returns `true` if any elements are `NaN`. */
  isNan(): boolean {
    return (
      Number.isNaN(this.xAxis.x) ||
      Number.isNaN(this.xAxis.y) ||
      Number.isNaN(this.xAxis.z) ||
      Number.isNaN(this.xAxis.w) ||
      Number.isNaN(this.yAxis.x) ||
      Number.isNaN(this.yAxis.y) ||
      Number.isNaN(this.yAxis.z) ||
      Number.isNaN(this.yAxis.w) ||
      Number.isNaN(this.zAxis.x) ||
      Number.isNaN(this.zAxis.y) ||
      Number.isNaN(this.zAxis.z) ||
      Number.isNaN(this.zAxis.w) ||
      Number.isNaN(this.wAxis.x) ||
      Number.isNaN(this.wAxis.y) ||
      Number.isNaN(this.wAxis.z) ||
      Number.isNaN(this.wAxis.w)
    );
  }

  /** Returns the transpose of `this`. */
  transpose(): Mat4 {
    return new Mat4(
      new Vec4(this.xAxis.x, this.yAxis.x, this.zAxis.x, this.wAxis.x),
      new Vec4(this.xAxis.y, this.yAxis.y, this.zAxis.y, this.wAxis.y),
      new Vec4(this.xAxis.z, this.yAxis.z, this.zAxis.z, this.wAxis.z),
      new Vec4(this.xAxis.w, this.yAxis.w, this.zAxis.w, this.wAxis.w),
    );
  }

  /** Returns the diagonal of `this`. */
  diagonal(): Vec4 {
    return new Vec4(this.xAxis.x, this.yAxis.y, this.zAxis.z, this.wAxis.w);
  }

  /** Returns the determinant of `this`. */
  determinant(): number {
    const { x: m00, y: m01, z: m02, w: m03 } = this.xAxis;
    const { x: m10, y: m11, z: m12, w: m13 } = this.yAxis;
    const { x: m20, y: m21, z: m22, w: m23 } = this.zAxis;
    const { x: m30, y: m31, z: m32, w: m33 } = this.wAxis;
    const a2323 = m22 * m33 - m23 * m32;
    const a1323 = m21 * m33 - m23 * m31;
    const a1223 = m21 * m32 - m22 * m31;
    const a0323 = m20 * m33 - m23 * m30;
    const a0223 = m20 * m32 - m22 * m30;
    const a0123 = m20 * m31 - m21 * m30;

    return (
      m00 * (m11 * a2323 - m12 * a1323 + m13 * a1223) -
      m01 * (m10 * a2323 - m12 * a0323 + m13 * a0223) +
      m02 * (m10 * a1323 - m11 * a0323 + m13 * a0123) -
      m03 * (m10 * a1223 - m11 * a0223 + m12 * a0123)
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
  inverse(): Mat4 {
    const { x: m00, y: m01, z: m02, w: m03 } = this.xAxis;
    const { x: m10, y: m11, z: m12, w: m13 } = this.yAxis;
    const { x: m20, y: m21, z: m22, w: m23 } = this.zAxis;
    const { x: m30, y: m31, z: m32, w: m33 } = this.wAxis;
    const coef00 = m22 * m33 - m32 * m23;
    const coef02 = m12 * m33 - m32 * m13;
    const coef03 = m12 * m23 - m22 * m13;
    const coef04 = m21 * m33 - m31 * m23;
    const coef06 = m11 * m33 - m31 * m13;
    const coef07 = m11 * m23 - m21 * m13;
    const coef08 = m21 * m32 - m31 * m22;
    const coef10 = m11 * m32 - m31 * m12;
    const coef11 = m11 * m22 - m21 * m12;
    const coef12 = m20 * m33 - m30 * m23;
    const coef14 = m10 * m33 - m30 * m13;
    const coef15 = m10 * m23 - m20 * m13;
    const coef16 = m20 * m32 - m30 * m22;
    const coef18 = m10 * m32 - m30 * m12;
    const coef19 = m10 * m22 - m20 * m12;
    const coef20 = m20 * m31 - m30 * m21;
    const coef22 = m10 * m31 - m30 * m11;
    const coef23 = m10 * m21 - m20 * m11;
    const i00 = m11 * coef00 - m12 * coef04 + m13 * coef08;
    const i01 = -(m01 * coef00 - m02 * coef04 + m03 * coef08);
    const i02 = m01 * coef02 - m02 * coef06 + m03 * coef10;
    const i03 = -(m01 * coef03 - m02 * coef07 + m03 * coef11);
    const i10 = -(m10 * coef00 - m12 * coef12 + m13 * coef16);
    const i11 = m00 * coef00 - m02 * coef12 + m03 * coef16;
    const i12 = -(m00 * coef02 - m02 * coef14 + m03 * coef18);
    const i13 = m00 * coef03 - m02 * coef15 + m03 * coef19;
    const i20 = m10 * coef04 - m11 * coef12 + m13 * coef20;
    const i21 = -(m00 * coef04 - m01 * coef12 + m03 * coef20);
    const i22 = m00 * coef06 - m01 * coef14 + m03 * coef22;
    const i23 = -(m00 * coef07 - m01 * coef15 + m03 * coef23);
    const i30 = -(m10 * coef08 - m11 * coef16 + m12 * coef20);
    const i31 = m00 * coef08 - m01 * coef16 + m02 * coef20;
    const i32 = -(m00 * coef10 - m01 * coef18 + m02 * coef22);
    const i33 = m00 * coef11 - m01 * coef19 + m02 * coef23;
    const rcp = 1 / (m00 * i00 + m01 * i10 + m02 * i20 + m03 * i30);

    return new Mat4(
      new Vec4(i00 * rcp, i01 * rcp, i02 * rcp, i03 * rcp),
      new Vec4(i10 * rcp, i11 * rcp, i12 * rcp, i13 * rcp),
      new Vec4(i20 * rcp, i21 * rcp, i22 * rcp, i23 * rcp),
      new Vec4(i30 * rcp, i31 * rcp, i32 * rcp, i33 * rcp),
    );
  }

  /**
   * Returns the inverse of `this` or `undefined` if the matrix is not invertible, or if
   * the inverse is not finite.
   */
  tryInverse(): Mat4 | undefined {
    const inverse = this.inverse();

    return inverse.isFinite() ? inverse : undefined;
  }

  /**
   * Returns the inverse of `this` or `Mat4.ZERO` if the matrix is not
   * invertible, or if the inverse is not finite.
   */
  inverseOrZero(): Mat4 {
    const inverse = this.inverse();

    return inverse.isFinite() ? inverse : Mat4.ZERO;
  }

  /**
   * Transforms the given 3D vector as a point, applying perspective correction.
   *
   * This is the equivalent of multiplying the 3D vector as a 4D vector where `w` is `1.0`.
   * The perspective divide is performed meaning the resulting 3D vector is divided by `w`.
   *
   * This method assumes that `this` contains a projective transform.
   */
  projectPoint3(rhs: Vec3): Vec3 {
    const { xAxis, yAxis, zAxis, wAxis } = this;
    const w = xAxis.w * rhs.x + yAxis.w * rhs.y + zAxis.w * rhs.z + wAxis.w;

    return new Vec3(
      (xAxis.x * rhs.x + yAxis.x * rhs.y + zAxis.x * rhs.z + wAxis.x) / w,
      (xAxis.y * rhs.x + yAxis.y * rhs.y + zAxis.y * rhs.z + wAxis.y) / w,
      (xAxis.z * rhs.x + yAxis.z * rhs.y + zAxis.z * rhs.z + wAxis.z) / w,
    );
  }

  /**
   * Transforms the given 3D vector as a point.
   *
   * This is the equivalent of multiplying the 3D vector as a 4D vector where `w` is
   * `1.0`.
   *
   * This method assumes that `this` contains a valid affine transform. It does not perform
   * a perspective divide, if `this` contains a perspective transform, or if you are unsure,
   * the `projectPoint3()` method should be used instead.
   */
  transformPoint3(rhs: Vec3): Vec3 {
    const { xAxis, yAxis, zAxis, wAxis } = this;

    return new Vec3(
      xAxis.x * rhs.x + yAxis.x * rhs.y + zAxis.x * rhs.z + wAxis.x,
      xAxis.y * rhs.x + yAxis.y * rhs.y + zAxis.y * rhs.z + wAxis.y,
      xAxis.z * rhs.x + yAxis.z * rhs.y + zAxis.z * rhs.z + wAxis.z,
    );
  }

  /**
   * Transforms the given 3D vector as a direction.
   *
   * This is the equivalent of multiplying the 3D vector as a 4D vector where `w` is
   * `0.0`.
   *
   * This method assumes that `this` contains a valid affine transform.
   */
  transformVector3(rhs: Vec3): Vec3 {
    const { xAxis, yAxis, zAxis } = this;

    return new Vec3(
      xAxis.x * rhs.x + yAxis.x * rhs.y + zAxis.x * rhs.z,
      xAxis.y * rhs.x + yAxis.y * rhs.y + zAxis.y * rhs.z,
      xAxis.z * rhs.x + yAxis.z * rhs.y + zAxis.z * rhs.z,
    );
  }

  /** Transforms a 4D vector. */
  mulVec4(rhs: Vec4): Vec4 {
    const { xAxis, yAxis, zAxis, wAxis } = this;

    return new Vec4(
      xAxis.x * rhs.x + yAxis.x * rhs.y + zAxis.x * rhs.z + wAxis.x * rhs.w,
      xAxis.y * rhs.x + yAxis.y * rhs.y + zAxis.y * rhs.z + wAxis.y * rhs.w,
      xAxis.z * rhs.x + yAxis.z * rhs.y + zAxis.z * rhs.z + wAxis.z * rhs.w,
      xAxis.w * rhs.x + yAxis.w * rhs.y + zAxis.w * rhs.z + wAxis.w * rhs.w,
    );
  }

  /** Transforms a 4D vector by the transpose of `this`. */
  mulTransposeVec4(rhs: Vec4): Vec4 {
    const { xAxis, yAxis, zAxis, wAxis } = this;

    return new Vec4(
      xAxis.x * rhs.x + xAxis.y * rhs.y + xAxis.z * rhs.z + xAxis.w * rhs.w,
      yAxis.x * rhs.x + yAxis.y * rhs.y + yAxis.z * rhs.z + yAxis.w * rhs.w,
      zAxis.x * rhs.x + zAxis.y * rhs.y + zAxis.z * rhs.z + zAxis.w * rhs.w,
      wAxis.x * rhs.x + wAxis.y * rhs.y + wAxis.z * rhs.z + wAxis.w * rhs.w,
    );
  }

  /** Multiplies two 4x4 matrices. */
  mulMat4(rhs: Mat4): Mat4 {
    const { xAxis, yAxis, zAxis, wAxis } = this;

    return new Mat4(
      new Vec4(
        xAxis.x * rhs.xAxis.x +
          yAxis.x * rhs.xAxis.y +
          zAxis.x * rhs.xAxis.z +
          wAxis.x * rhs.xAxis.w,
        xAxis.y * rhs.xAxis.x +
          yAxis.y * rhs.xAxis.y +
          zAxis.y * rhs.xAxis.z +
          wAxis.y * rhs.xAxis.w,
        xAxis.z * rhs.xAxis.x +
          yAxis.z * rhs.xAxis.y +
          zAxis.z * rhs.xAxis.z +
          wAxis.z * rhs.xAxis.w,
        xAxis.w * rhs.xAxis.x +
          yAxis.w * rhs.xAxis.y +
          zAxis.w * rhs.xAxis.z +
          wAxis.w * rhs.xAxis.w,
      ),
      new Vec4(
        xAxis.x * rhs.yAxis.x +
          yAxis.x * rhs.yAxis.y +
          zAxis.x * rhs.yAxis.z +
          wAxis.x * rhs.yAxis.w,
        xAxis.y * rhs.yAxis.x +
          yAxis.y * rhs.yAxis.y +
          zAxis.y * rhs.yAxis.z +
          wAxis.y * rhs.yAxis.w,
        xAxis.z * rhs.yAxis.x +
          yAxis.z * rhs.yAxis.y +
          zAxis.z * rhs.yAxis.z +
          wAxis.z * rhs.yAxis.w,
        xAxis.w * rhs.yAxis.x +
          yAxis.w * rhs.yAxis.y +
          zAxis.w * rhs.yAxis.z +
          wAxis.w * rhs.yAxis.w,
      ),
      new Vec4(
        xAxis.x * rhs.zAxis.x +
          yAxis.x * rhs.zAxis.y +
          zAxis.x * rhs.zAxis.z +
          wAxis.x * rhs.zAxis.w,
        xAxis.y * rhs.zAxis.x +
          yAxis.y * rhs.zAxis.y +
          zAxis.y * rhs.zAxis.z +
          wAxis.y * rhs.zAxis.w,
        xAxis.z * rhs.zAxis.x +
          yAxis.z * rhs.zAxis.y +
          zAxis.z * rhs.zAxis.z +
          wAxis.z * rhs.zAxis.w,
        xAxis.w * rhs.zAxis.x +
          yAxis.w * rhs.zAxis.y +
          zAxis.w * rhs.zAxis.z +
          wAxis.w * rhs.zAxis.w,
      ),
      new Vec4(
        xAxis.x * rhs.wAxis.x +
          yAxis.x * rhs.wAxis.y +
          zAxis.x * rhs.wAxis.z +
          wAxis.x * rhs.wAxis.w,
        xAxis.y * rhs.wAxis.x +
          yAxis.y * rhs.wAxis.y +
          zAxis.y * rhs.wAxis.z +
          wAxis.y * rhs.wAxis.w,
        xAxis.z * rhs.wAxis.x +
          yAxis.z * rhs.wAxis.y +
          zAxis.z * rhs.wAxis.z +
          wAxis.z * rhs.wAxis.w,
        xAxis.w * rhs.wAxis.x +
          yAxis.w * rhs.wAxis.y +
          zAxis.w * rhs.wAxis.z +
          wAxis.w * rhs.wAxis.w,
      ),
    );
  }

  /** Adds two 4x4 matrices. */
  addMat4(rhs: Mat4): Mat4 {
    return new Mat4(
      new Vec4(
        this.xAxis.x + rhs.xAxis.x,
        this.xAxis.y + rhs.xAxis.y,
        this.xAxis.z + rhs.xAxis.z,
        this.xAxis.w + rhs.xAxis.w,
      ),
      new Vec4(
        this.yAxis.x + rhs.yAxis.x,
        this.yAxis.y + rhs.yAxis.y,
        this.yAxis.z + rhs.yAxis.z,
        this.yAxis.w + rhs.yAxis.w,
      ),
      new Vec4(
        this.zAxis.x + rhs.zAxis.x,
        this.zAxis.y + rhs.zAxis.y,
        this.zAxis.z + rhs.zAxis.z,
        this.zAxis.w + rhs.zAxis.w,
      ),
      new Vec4(
        this.wAxis.x + rhs.wAxis.x,
        this.wAxis.y + rhs.wAxis.y,
        this.wAxis.z + rhs.wAxis.z,
        this.wAxis.w + rhs.wAxis.w,
      ),
    );
  }

  /** Subtracts two 4x4 matrices. */
  subMat4(rhs: Mat4): Mat4 {
    return new Mat4(
      new Vec4(
        this.xAxis.x - rhs.xAxis.x,
        this.xAxis.y - rhs.xAxis.y,
        this.xAxis.z - rhs.xAxis.z,
        this.xAxis.w - rhs.xAxis.w,
      ),
      new Vec4(
        this.yAxis.x - rhs.yAxis.x,
        this.yAxis.y - rhs.yAxis.y,
        this.yAxis.z - rhs.yAxis.z,
        this.yAxis.w - rhs.yAxis.w,
      ),
      new Vec4(
        this.zAxis.x - rhs.zAxis.x,
        this.zAxis.y - rhs.zAxis.y,
        this.zAxis.z - rhs.zAxis.z,
        this.zAxis.w - rhs.zAxis.w,
      ),
      new Vec4(
        this.wAxis.x - rhs.wAxis.x,
        this.wAxis.y - rhs.wAxis.y,
        this.wAxis.z - rhs.wAxis.z,
        this.wAxis.w - rhs.wAxis.w,
      ),
    );
  }

  /** Multiplies a 4x4 matrix by a scalar. */
  mulScalar(rhs: number): Mat4 {
    return new Mat4(
      new Vec4(this.xAxis.x * rhs, this.xAxis.y * rhs, this.xAxis.z * rhs, this.xAxis.w * rhs),
      new Vec4(this.yAxis.x * rhs, this.yAxis.y * rhs, this.yAxis.z * rhs, this.yAxis.w * rhs),
      new Vec4(this.zAxis.x * rhs, this.zAxis.y * rhs, this.zAxis.z * rhs, this.zAxis.w * rhs),
      new Vec4(this.wAxis.x * rhs, this.wAxis.y * rhs, this.wAxis.z * rhs, this.wAxis.w * rhs),
    );
  }

  /**
   * Multiply `this` by a scaling vector `scale`.
   * This is faster than creating a whole diagonal scaling matrix and then multiplying that.
   * This operation is commutative.
   */
  mulDiagonalScale(scale: Vec4): Mat4 {
    return new Mat4(
      new Vec4(
        this.xAxis.x * scale.x,
        this.xAxis.y * scale.x,
        this.xAxis.z * scale.x,
        this.xAxis.w * scale.x,
      ),
      new Vec4(
        this.yAxis.x * scale.y,
        this.yAxis.y * scale.y,
        this.yAxis.z * scale.y,
        this.yAxis.w * scale.y,
      ),
      new Vec4(
        this.zAxis.x * scale.z,
        this.zAxis.y * scale.z,
        this.zAxis.z * scale.z,
        this.zAxis.w * scale.z,
      ),
      new Vec4(
        this.wAxis.x * scale.w,
        this.wAxis.y * scale.w,
        this.wAxis.z * scale.w,
        this.wAxis.w * scale.w,
      ),
    );
  }

  /** Divides a 4x4 matrix by a scalar. */
  divScalar(rhs: number): Mat4 {
    return new Mat4(
      new Vec4(this.xAxis.x / rhs, this.xAxis.y / rhs, this.xAxis.z / rhs, this.xAxis.w / rhs),
      new Vec4(this.yAxis.x / rhs, this.yAxis.y / rhs, this.yAxis.z / rhs, this.yAxis.w / rhs),
      new Vec4(this.zAxis.x / rhs, this.zAxis.y / rhs, this.zAxis.z / rhs, this.zAxis.w / rhs),
      new Vec4(this.wAxis.x / rhs, this.wAxis.y / rhs, this.wAxis.z / rhs, this.wAxis.w / rhs),
    );
  }

  /** Returns a matrix containing the reciprocal `1.0/n` of each element of `this`. */
  recip(): Mat4 {
    return new Mat4(
      new Vec4(1 / this.xAxis.x, 1 / this.xAxis.y, 1 / this.xAxis.z, 1 / this.xAxis.w),
      new Vec4(1 / this.yAxis.x, 1 / this.yAxis.y, 1 / this.yAxis.z, 1 / this.yAxis.w),
      new Vec4(1 / this.zAxis.x, 1 / this.zAxis.y, 1 / this.zAxis.z, 1 / this.zAxis.w),
      new Vec4(1 / this.wAxis.x, 1 / this.wAxis.y, 1 / this.wAxis.z, 1 / this.wAxis.w),
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
  absDiffEq(rhs: Mat4, maxAbsDiff: number): boolean {
    return (
      Math.abs(this.xAxis.x - rhs.xAxis.x) <= maxAbsDiff &&
      Math.abs(this.xAxis.y - rhs.xAxis.y) <= maxAbsDiff &&
      Math.abs(this.xAxis.z - rhs.xAxis.z) <= maxAbsDiff &&
      Math.abs(this.xAxis.w - rhs.xAxis.w) <= maxAbsDiff &&
      Math.abs(this.yAxis.x - rhs.yAxis.x) <= maxAbsDiff &&
      Math.abs(this.yAxis.y - rhs.yAxis.y) <= maxAbsDiff &&
      Math.abs(this.yAxis.z - rhs.yAxis.z) <= maxAbsDiff &&
      Math.abs(this.yAxis.w - rhs.yAxis.w) <= maxAbsDiff &&
      Math.abs(this.zAxis.x - rhs.zAxis.x) <= maxAbsDiff &&
      Math.abs(this.zAxis.y - rhs.zAxis.y) <= maxAbsDiff &&
      Math.abs(this.zAxis.z - rhs.zAxis.z) <= maxAbsDiff &&
      Math.abs(this.zAxis.w - rhs.zAxis.w) <= maxAbsDiff &&
      Math.abs(this.wAxis.x - rhs.wAxis.x) <= maxAbsDiff &&
      Math.abs(this.wAxis.y - rhs.wAxis.y) <= maxAbsDiff &&
      Math.abs(this.wAxis.z - rhs.wAxis.z) <= maxAbsDiff &&
      Math.abs(this.wAxis.w - rhs.wAxis.w) <= maxAbsDiff
    );
  }

  /** Takes the absolute value of each element in `this` */
  abs(): Mat4 {
    return new Mat4(
      new Vec4(
        Math.abs(this.xAxis.x),
        Math.abs(this.xAxis.y),
        Math.abs(this.xAxis.z),
        Math.abs(this.xAxis.w),
      ),
      new Vec4(
        Math.abs(this.yAxis.x),
        Math.abs(this.yAxis.y),
        Math.abs(this.yAxis.z),
        Math.abs(this.yAxis.w),
      ),
      new Vec4(
        Math.abs(this.zAxis.x),
        Math.abs(this.zAxis.y),
        Math.abs(this.zAxis.z),
        Math.abs(this.zAxis.w),
      ),
      new Vec4(
        Math.abs(this.wAxis.x),
        Math.abs(this.wAxis.y),
        Math.abs(this.wAxis.z),
        Math.abs(this.wAxis.w),
      ),
    );
  }

  clone(): Mat4 {
    return new Mat4(
      new Vec4(this.xAxis.x, this.xAxis.y, this.xAxis.z, this.xAxis.w),
      new Vec4(this.yAxis.x, this.yAxis.y, this.yAxis.z, this.yAxis.w),
      new Vec4(this.zAxis.x, this.zAxis.y, this.zAxis.z, this.zAxis.w),
      new Vec4(this.wAxis.x, this.wAxis.y, this.wAxis.z, this.wAxis.w),
    );
  }

  add(rhs: Mat4): Mat4 {
    return this.addMat4(rhs);
  }

  sub(rhs: Mat4): Mat4 {
    return this.subMat4(rhs);
  }

  neg(): Mat4 {
    return new Mat4(
      new Vec4(-this.xAxis.x, -this.xAxis.y, -this.xAxis.z, -this.xAxis.w),
      new Vec4(-this.yAxis.x, -this.yAxis.y, -this.yAxis.z, -this.yAxis.w),
      new Vec4(-this.zAxis.x, -this.zAxis.y, -this.zAxis.z, -this.zAxis.w),
      new Vec4(-this.wAxis.x, -this.wAxis.y, -this.wAxis.z, -this.wAxis.w),
    );
  }

  mul(rhs: Vec4): Vec4;
  mul(rhs: Mat4 | Affine3 | number): Mat4;
  mul(rhs: Mat4 | Affine3 | Vec4 | number): Mat4 | Vec4 {
    if (typeof rhs === "number") {
      return this.mulScalar(rhs);
    }

    if (rhs instanceof Vec4) {
      return this.mulVec4(rhs);
    }

    if (rhs instanceof Mat4) {
      return this.mulMat4(rhs);
    }

    const { xAxis, yAxis, zAxis, wAxis } = this;

    return new Mat4(
      new Vec4(
        xAxis.x * rhs.matrix3.xAxis.x +
          yAxis.x * rhs.matrix3.xAxis.y +
          zAxis.x * rhs.matrix3.xAxis.z,
        xAxis.y * rhs.matrix3.xAxis.x +
          yAxis.y * rhs.matrix3.xAxis.y +
          zAxis.y * rhs.matrix3.xAxis.z,
        xAxis.z * rhs.matrix3.xAxis.x +
          yAxis.z * rhs.matrix3.xAxis.y +
          zAxis.z * rhs.matrix3.xAxis.z,
        xAxis.w * rhs.matrix3.xAxis.x +
          yAxis.w * rhs.matrix3.xAxis.y +
          zAxis.w * rhs.matrix3.xAxis.z,
      ),
      new Vec4(
        xAxis.x * rhs.matrix3.yAxis.x +
          yAxis.x * rhs.matrix3.yAxis.y +
          zAxis.x * rhs.matrix3.yAxis.z,
        xAxis.y * rhs.matrix3.yAxis.x +
          yAxis.y * rhs.matrix3.yAxis.y +
          zAxis.y * rhs.matrix3.yAxis.z,
        xAxis.z * rhs.matrix3.yAxis.x +
          yAxis.z * rhs.matrix3.yAxis.y +
          zAxis.z * rhs.matrix3.yAxis.z,
        xAxis.w * rhs.matrix3.yAxis.x +
          yAxis.w * rhs.matrix3.yAxis.y +
          zAxis.w * rhs.matrix3.yAxis.z,
      ),
      new Vec4(
        xAxis.x * rhs.matrix3.zAxis.x +
          yAxis.x * rhs.matrix3.zAxis.y +
          zAxis.x * rhs.matrix3.zAxis.z,
        xAxis.y * rhs.matrix3.zAxis.x +
          yAxis.y * rhs.matrix3.zAxis.y +
          zAxis.y * rhs.matrix3.zAxis.z,
        xAxis.z * rhs.matrix3.zAxis.x +
          yAxis.z * rhs.matrix3.zAxis.y +
          zAxis.z * rhs.matrix3.zAxis.z,
        xAxis.w * rhs.matrix3.zAxis.x +
          yAxis.w * rhs.matrix3.zAxis.y +
          zAxis.w * rhs.matrix3.zAxis.z,
      ),
      new Vec4(
        xAxis.x * rhs.translation.x +
          yAxis.x * rhs.translation.y +
          zAxis.x * rhs.translation.z +
          wAxis.x,
        xAxis.y * rhs.translation.x +
          yAxis.y * rhs.translation.y +
          zAxis.y * rhs.translation.z +
          wAxis.y,
        xAxis.z * rhs.translation.x +
          yAxis.z * rhs.translation.y +
          zAxis.z * rhs.translation.z +
          wAxis.z,
        xAxis.w * rhs.translation.x +
          yAxis.w * rhs.translation.y +
          zAxis.w * rhs.translation.z +
          wAxis.w,
      ),
    );
  }

  div(rhs: number): Mat4 {
    return this.divScalar(rhs);
  }

  addAssign(rhs: Mat4): this {
    this.xAxis.x += rhs.xAxis.x;
    this.xAxis.y += rhs.xAxis.y;
    this.xAxis.z += rhs.xAxis.z;
    this.xAxis.w += rhs.xAxis.w;
    this.yAxis.x += rhs.yAxis.x;
    this.yAxis.y += rhs.yAxis.y;
    this.yAxis.z += rhs.yAxis.z;
    this.yAxis.w += rhs.yAxis.w;
    this.zAxis.x += rhs.zAxis.x;
    this.zAxis.y += rhs.zAxis.y;
    this.zAxis.z += rhs.zAxis.z;
    this.zAxis.w += rhs.zAxis.w;
    this.wAxis.x += rhs.wAxis.x;
    this.wAxis.y += rhs.wAxis.y;
    this.wAxis.z += rhs.wAxis.z;
    this.wAxis.w += rhs.wAxis.w;

    return this;
  }

  subAssign(rhs: Mat4): this {
    this.xAxis.x -= rhs.xAxis.x;
    this.xAxis.y -= rhs.xAxis.y;
    this.xAxis.z -= rhs.xAxis.z;
    this.xAxis.w -= rhs.xAxis.w;
    this.yAxis.x -= rhs.yAxis.x;
    this.yAxis.y -= rhs.yAxis.y;
    this.yAxis.z -= rhs.yAxis.z;
    this.yAxis.w -= rhs.yAxis.w;
    this.zAxis.x -= rhs.zAxis.x;
    this.zAxis.y -= rhs.zAxis.y;
    this.zAxis.z -= rhs.zAxis.z;
    this.zAxis.w -= rhs.zAxis.w;
    this.wAxis.x -= rhs.wAxis.x;
    this.wAxis.y -= rhs.wAxis.y;
    this.wAxis.z -= rhs.wAxis.z;
    this.wAxis.w -= rhs.wAxis.w;

    return this;
  }

  mulAssign(rhs: Mat4 | Affine3 | number): this {
    if (typeof rhs === "number") {
      this.xAxis.x *= rhs;
      this.xAxis.y *= rhs;
      this.xAxis.z *= rhs;
      this.xAxis.w *= rhs;
      this.yAxis.x *= rhs;
      this.yAxis.y *= rhs;
      this.yAxis.z *= rhs;
      this.yAxis.w *= rhs;
      this.zAxis.x *= rhs;
      this.zAxis.y *= rhs;
      this.zAxis.z *= rhs;
      this.zAxis.w *= rhs;
      this.wAxis.x *= rhs;
      this.wAxis.y *= rhs;
      this.wAxis.z *= rhs;
      this.wAxis.w *= rhs;

      return this;
    }

    const { xAxis, yAxis, zAxis, wAxis } = this;

    if (!(rhs instanceof Mat4)) {
      const a00 =
        xAxis.x * rhs.matrix3.xAxis.x +
        yAxis.x * rhs.matrix3.xAxis.y +
        zAxis.x * rhs.matrix3.xAxis.z;

      const a01 =
        xAxis.y * rhs.matrix3.xAxis.x +
        yAxis.y * rhs.matrix3.xAxis.y +
        zAxis.y * rhs.matrix3.xAxis.z;

      const a02 =
        xAxis.z * rhs.matrix3.xAxis.x +
        yAxis.z * rhs.matrix3.xAxis.y +
        zAxis.z * rhs.matrix3.xAxis.z;

      const a03 =
        xAxis.w * rhs.matrix3.xAxis.x +
        yAxis.w * rhs.matrix3.xAxis.y +
        zAxis.w * rhs.matrix3.xAxis.z;

      const a10 =
        xAxis.x * rhs.matrix3.yAxis.x +
        yAxis.x * rhs.matrix3.yAxis.y +
        zAxis.x * rhs.matrix3.yAxis.z;

      const a11 =
        xAxis.y * rhs.matrix3.yAxis.x +
        yAxis.y * rhs.matrix3.yAxis.y +
        zAxis.y * rhs.matrix3.yAxis.z;

      const a12 =
        xAxis.z * rhs.matrix3.yAxis.x +
        yAxis.z * rhs.matrix3.yAxis.y +
        zAxis.z * rhs.matrix3.yAxis.z;

      const a13 =
        xAxis.w * rhs.matrix3.yAxis.x +
        yAxis.w * rhs.matrix3.yAxis.y +
        zAxis.w * rhs.matrix3.yAxis.z;

      const a20 =
        xAxis.x * rhs.matrix3.zAxis.x +
        yAxis.x * rhs.matrix3.zAxis.y +
        zAxis.x * rhs.matrix3.zAxis.z;

      const a21 =
        xAxis.y * rhs.matrix3.zAxis.x +
        yAxis.y * rhs.matrix3.zAxis.y +
        zAxis.y * rhs.matrix3.zAxis.z;

      const a22 =
        xAxis.z * rhs.matrix3.zAxis.x +
        yAxis.z * rhs.matrix3.zAxis.y +
        zAxis.z * rhs.matrix3.zAxis.z;

      const a23 =
        xAxis.w * rhs.matrix3.zAxis.x +
        yAxis.w * rhs.matrix3.zAxis.y +
        zAxis.w * rhs.matrix3.zAxis.z;

      const a30 =
        xAxis.x * rhs.translation.x +
        yAxis.x * rhs.translation.y +
        zAxis.x * rhs.translation.z +
        wAxis.x;

      const a31 =
        xAxis.y * rhs.translation.x +
        yAxis.y * rhs.translation.y +
        zAxis.y * rhs.translation.z +
        wAxis.y;

      const a32 =
        xAxis.z * rhs.translation.x +
        yAxis.z * rhs.translation.y +
        zAxis.z * rhs.translation.z +
        wAxis.z;

      const a33 =
        xAxis.w * rhs.translation.x +
        yAxis.w * rhs.translation.y +
        zAxis.w * rhs.translation.z +
        wAxis.w;

      this.xAxis.x = a00;
      this.xAxis.y = a01;
      this.xAxis.z = a02;
      this.xAxis.w = a03;
      this.yAxis.x = a10;
      this.yAxis.y = a11;
      this.yAxis.z = a12;
      this.yAxis.w = a13;
      this.zAxis.x = a20;
      this.zAxis.y = a21;
      this.zAxis.z = a22;
      this.zAxis.w = a23;
      this.wAxis.x = a30;
      this.wAxis.y = a31;
      this.wAxis.z = a32;
      this.wAxis.w = a33;

      return this;
    }

    const m00 =
      xAxis.x * rhs.xAxis.x + yAxis.x * rhs.xAxis.y + zAxis.x * rhs.xAxis.z + wAxis.x * rhs.xAxis.w;

    const m01 =
      xAxis.y * rhs.xAxis.x + yAxis.y * rhs.xAxis.y + zAxis.y * rhs.xAxis.z + wAxis.y * rhs.xAxis.w;

    const m02 =
      xAxis.z * rhs.xAxis.x + yAxis.z * rhs.xAxis.y + zAxis.z * rhs.xAxis.z + wAxis.z * rhs.xAxis.w;

    const m03 =
      xAxis.w * rhs.xAxis.x + yAxis.w * rhs.xAxis.y + zAxis.w * rhs.xAxis.z + wAxis.w * rhs.xAxis.w;

    const m10 =
      xAxis.x * rhs.yAxis.x + yAxis.x * rhs.yAxis.y + zAxis.x * rhs.yAxis.z + wAxis.x * rhs.yAxis.w;

    const m11 =
      xAxis.y * rhs.yAxis.x + yAxis.y * rhs.yAxis.y + zAxis.y * rhs.yAxis.z + wAxis.y * rhs.yAxis.w;

    const m12 =
      xAxis.z * rhs.yAxis.x + yAxis.z * rhs.yAxis.y + zAxis.z * rhs.yAxis.z + wAxis.z * rhs.yAxis.w;

    const m13 =
      xAxis.w * rhs.yAxis.x + yAxis.w * rhs.yAxis.y + zAxis.w * rhs.yAxis.z + wAxis.w * rhs.yAxis.w;

    const m20 =
      xAxis.x * rhs.zAxis.x + yAxis.x * rhs.zAxis.y + zAxis.x * rhs.zAxis.z + wAxis.x * rhs.zAxis.w;

    const m21 =
      xAxis.y * rhs.zAxis.x + yAxis.y * rhs.zAxis.y + zAxis.y * rhs.zAxis.z + wAxis.y * rhs.zAxis.w;

    const m22 =
      xAxis.z * rhs.zAxis.x + yAxis.z * rhs.zAxis.y + zAxis.z * rhs.zAxis.z + wAxis.z * rhs.zAxis.w;

    const m23 =
      xAxis.w * rhs.zAxis.x + yAxis.w * rhs.zAxis.y + zAxis.w * rhs.zAxis.z + wAxis.w * rhs.zAxis.w;

    const m30 =
      xAxis.x * rhs.wAxis.x + yAxis.x * rhs.wAxis.y + zAxis.x * rhs.wAxis.z + wAxis.x * rhs.wAxis.w;

    const m31 =
      xAxis.y * rhs.wAxis.x + yAxis.y * rhs.wAxis.y + zAxis.y * rhs.wAxis.z + wAxis.y * rhs.wAxis.w;

    const m32 =
      xAxis.z * rhs.wAxis.x + yAxis.z * rhs.wAxis.y + zAxis.z * rhs.wAxis.z + wAxis.z * rhs.wAxis.w;

    const m33 =
      xAxis.w * rhs.wAxis.x + yAxis.w * rhs.wAxis.y + zAxis.w * rhs.wAxis.z + wAxis.w * rhs.wAxis.w;

    this.xAxis.x = m00;
    this.xAxis.y = m01;
    this.xAxis.z = m02;
    this.xAxis.w = m03;
    this.yAxis.x = m10;
    this.yAxis.y = m11;
    this.yAxis.z = m12;
    this.yAxis.w = m13;
    this.zAxis.x = m20;
    this.zAxis.y = m21;
    this.zAxis.z = m22;
    this.zAxis.w = m23;
    this.wAxis.x = m30;
    this.wAxis.y = m31;
    this.wAxis.z = m32;
    this.wAxis.w = m33;

    return this;
  }

  divAssign(rhs: number): this {
    this.xAxis.x /= rhs;
    this.xAxis.y /= rhs;
    this.xAxis.z /= rhs;
    this.xAxis.w /= rhs;
    this.yAxis.x /= rhs;
    this.yAxis.y /= rhs;
    this.yAxis.z /= rhs;
    this.yAxis.w /= rhs;
    this.zAxis.x /= rhs;
    this.zAxis.y /= rhs;
    this.zAxis.z /= rhs;
    this.zAxis.w /= rhs;
    this.wAxis.x /= rhs;
    this.wAxis.y /= rhs;
    this.wAxis.z /= rhs;
    this.wAxis.w /= rhs;

    return this;
  }

  eq(rhs: Mat4): boolean {
    return (
      this.xAxis.x === rhs.xAxis.x &&
      this.xAxis.y === rhs.xAxis.y &&
      this.xAxis.z === rhs.xAxis.z &&
      this.xAxis.w === rhs.xAxis.w &&
      this.yAxis.x === rhs.yAxis.x &&
      this.yAxis.y === rhs.yAxis.y &&
      this.yAxis.z === rhs.yAxis.z &&
      this.yAxis.w === rhs.yAxis.w &&
      this.zAxis.x === rhs.zAxis.x &&
      this.zAxis.y === rhs.zAxis.y &&
      this.zAxis.z === rhs.zAxis.z &&
      this.zAxis.w === rhs.zAxis.w &&
      this.wAxis.x === rhs.wAxis.x &&
      this.wAxis.y === rhs.wAxis.y &&
      this.wAxis.z === rhs.wAxis.z &&
      this.wAxis.w === rhs.wAxis.w
    );
  }

  ne(rhs: Mat4): boolean {
    return (
      this.xAxis.x !== rhs.xAxis.x ||
      this.xAxis.y !== rhs.xAxis.y ||
      this.xAxis.z !== rhs.xAxis.z ||
      this.xAxis.w !== rhs.xAxis.w ||
      this.yAxis.x !== rhs.yAxis.x ||
      this.yAxis.y !== rhs.yAxis.y ||
      this.yAxis.z !== rhs.yAxis.z ||
      this.yAxis.w !== rhs.yAxis.w ||
      this.zAxis.x !== rhs.zAxis.x ||
      this.zAxis.y !== rhs.zAxis.y ||
      this.zAxis.z !== rhs.zAxis.z ||
      this.zAxis.w !== rhs.zAxis.w ||
      this.wAxis.x !== rhs.wAxis.x ||
      this.wAxis.y !== rhs.wAxis.y ||
      this.wAxis.z !== rhs.wAxis.z ||
      this.wAxis.w !== rhs.wAxis.w
    );
  }

  toString(): string {
    return `[[${this.xAxis.x}, ${this.xAxis.y}, ${this.xAxis.z}, ${this.xAxis.w}], [${this.yAxis.x}, ${this.yAxis.y}, ${this.yAxis.z}, ${this.yAxis.w}], [${this.zAxis.x}, ${this.zAxis.y}, ${this.zAxis.z}, ${this.zAxis.w}], [${this.wAxis.x}, ${this.wAxis.y}, ${this.wAxis.z}, ${this.wAxis.w}]]`;
  }

  static #fromQuatScaleTranslation(rotation: Quat, scale: Vec3, wAxis: Vec4): Mat4 {
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

    return new Mat4(
      new Vec4((1 - (yy + zz)) * scale.x, (xy + wz) * scale.x, (xz - wy) * scale.x, 0),
      new Vec4((xy - wz) * scale.y, (1 - (xx + zz)) * scale.y, (yz + wx) * scale.y, 0),
      new Vec4((xz + wy) * scale.z, (yz - wx) * scale.z, (1 - (xx + yy)) * scale.z, 0),
      wAxis,
    );
  }

  static #sliceElement(slice: ArrayLike<number>, index: number): number {
    const value = slice[index];

    if (value === undefined) {
      throw new RangeError("index out of bounds");
    }

    return value;
  }
}

/** Creates a 4x4 matrix from four column vectors. */
export function mat4(xAxis: Vec4, yAxis: Vec4, zAxis: Vec4, wAxis: Vec4): Mat4 {
  return new Mat4(xAxis, yAxis, zAxis, wAxis);
}
