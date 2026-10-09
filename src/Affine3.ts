import { Mat3 } from "./Mat3.js";
import { Mat4 } from "./Mat4.js";
import { Quat } from "./Quat.js";
import { Vec3 } from "./Vec3.js";
import { Vec4 } from "./Vec4.js";

/** A 3D affine transform, which can represent translation, rotation, scaling and shear. */
export class Affine3 {
  declare matrix3: Mat3;
  declare translation: Vec3;

  constructor(matrix3: Mat3, translation: Vec3) {
    this.matrix3 = matrix3;
    this.translation = translation;
  }

  /**
   * The degenerate zero transform.
   *
   * This transforms any finite vector and point to zero.
   * The zero transform is non-invertible.
   */
  static get ZERO() {
    return new Affine3(
      new Mat3(new Vec3(0, 0, 0), new Vec3(0, 0, 0), new Vec3(0, 0, 0)),
      new Vec3(0, 0, 0),
    );
  }

  /**
   * The identity transform.
   *
   * Multiplying a vector with this returns the same vector.
   */
  static get IDENTITY() {
    return new Affine3(
      new Mat3(new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1)),
      new Vec3(0, 0, 0),
    );
  }

  /** All NAN:s. */
  static get NAN() {
    return new Affine3(
      new Mat3(
        new Vec3(Number.NaN, Number.NaN, Number.NaN),
        new Vec3(Number.NaN, Number.NaN, Number.NaN),
        new Vec3(Number.NaN, Number.NaN, Number.NaN),
      ),
      new Vec3(Number.NaN, Number.NaN, Number.NaN),
    );
  }

  /** Creates an affine transform from three column vectors. */
  static fromCols(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3, wAxis: Vec3): Affine3 {
    return new Affine3(new Mat3(xAxis, yAxis, zAxis), wAxis);
  }

  /** Creates an affine transform from a `[number; 12]` array stored in column major order. */
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
    ],
  ): Affine3 {
    return new Affine3(
      new Mat3(new Vec3(m[0], m[1], m[2]), new Vec3(m[3], m[4], m[5]), new Vec3(m[6], m[7], m[8])),
      new Vec3(m[9], m[10], m[11]),
    );
  }

  /** Creates a `[number; 12]` array storing data in column major order. */
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
  ] {
    return [
      this.matrix3.xAxis.x,
      this.matrix3.xAxis.y,
      this.matrix3.xAxis.z,
      this.matrix3.yAxis.x,
      this.matrix3.yAxis.y,
      this.matrix3.yAxis.z,
      this.matrix3.zAxis.x,
      this.matrix3.zAxis.y,
      this.matrix3.zAxis.z,
      this.translation.x,
      this.translation.y,
      this.translation.z,
    ];
  }

  /**
   * Creates an affine transform from a `[[number; 3]; 4]`
   * 3D array stored in column major order.
   * If your data is in row major order you will need to `transpose` the returned
   * matrix.
   */
  static fromColsArray2d(
    m: [
      [number, number, number],
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ],
  ): Affine3 {
    return new Affine3(
      new Mat3(
        new Vec3(m[0][0], m[0][1], m[0][2]),
        new Vec3(m[1][0], m[1][1], m[1][2]),
        new Vec3(m[2][0], m[2][1], m[2][2]),
      ),
      new Vec3(m[3][0], m[3][1], m[3][2]),
    );
  }

  /**
   * Creates a `[[number; 3]; 4]` 3D array storing data in
   * column major order.
   * If you require data in row major order `transpose` the matrix first.
   */
  toColsArray2d(): [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ] {
    return [
      [this.matrix3.xAxis.x, this.matrix3.xAxis.y, this.matrix3.xAxis.z],
      [this.matrix3.yAxis.x, this.matrix3.yAxis.y, this.matrix3.yAxis.z],
      [this.matrix3.zAxis.x, this.matrix3.zAxis.y, this.matrix3.zAxis.z],
      [this.translation.x, this.translation.y, this.translation.z],
    ];
  }

  /**
   * Creates an affine transform from the first 12 values in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 12 elements long.
   */
  static fromColsSlice(slice: ArrayLike<number>): Affine3 {
    return new Affine3(
      new Mat3(
        new Vec3(
          Affine3.#sliceElement(slice, 0),
          Affine3.#sliceElement(slice, 1),
          Affine3.#sliceElement(slice, 2),
        ),
        new Vec3(
          Affine3.#sliceElement(slice, 3),
          Affine3.#sliceElement(slice, 4),
          Affine3.#sliceElement(slice, 5),
        ),
        new Vec3(
          Affine3.#sliceElement(slice, 6),
          Affine3.#sliceElement(slice, 7),
          Affine3.#sliceElement(slice, 8),
        ),
      ),
      new Vec3(
        Affine3.#sliceElement(slice, 9),
        Affine3.#sliceElement(slice, 10),
        Affine3.#sliceElement(slice, 11),
      ),
    );
  }

  /**
   * Writes the columns of `this` to the first 12 elements in `slice`.
   *
   * Throws a `RangeError` if `slice` is less than 12 elements long.
   */
  writeColsToSlice(slice: { [index: number]: number; readonly length: number }): void {
    if (slice.length < 12) {
      throw new RangeError("index out of bounds");
    }

    slice[0] = this.matrix3.xAxis.x;
    slice[1] = this.matrix3.xAxis.y;
    slice[2] = this.matrix3.xAxis.z;
    slice[3] = this.matrix3.yAxis.x;
    slice[4] = this.matrix3.yAxis.y;
    slice[5] = this.matrix3.yAxis.z;
    slice[6] = this.matrix3.zAxis.x;
    slice[7] = this.matrix3.zAxis.y;
    slice[8] = this.matrix3.zAxis.z;
    slice[9] = this.translation.x;
    slice[10] = this.translation.y;
    slice[11] = this.translation.z;
  }

  /**
   * Creates an affine transform that changes scale.
   * Note that if any scale is zero the transform will be non-invertible.
   */
  static fromScale(scale: Vec3): Affine3 {
    return new Affine3(
      new Mat3(new Vec3(scale.x, 0, 0), new Vec3(0, scale.y, 0), new Vec3(0, 0, scale.z)),
      new Vec3(0, 0, 0),
    );
  }

  /** Creates an affine transform from the given `rotation` quaternion. */
  static fromQuat(rotation: Quat): Affine3 {
    return new Affine3(Mat3.fromQuat(rotation), new Vec3(0, 0, 0));
  }

  /**
   * Creates an affine transform containing a 3D rotation around a normalized
   * rotation `axis` of `angle` (in radians).
   */
  static fromAxisAngle(axis: Vec3, angle: number): Affine3 {
    return new Affine3(Mat3.fromAxisAngle(axis, angle), new Vec3(0, 0, 0));
  }

  /**
   * Creates an affine transform containing a 3D rotation around the x axis of
   * `angle` (in radians).
   */
  static fromRotationX(angle: number): Affine3 {
    return new Affine3(Mat3.fromRotationX(angle), new Vec3(0, 0, 0));
  }

  /**
   * Creates an affine transform containing a 3D rotation around the y axis of
   * `angle` (in radians).
   */
  static fromRotationY(angle: number): Affine3 {
    return new Affine3(Mat3.fromRotationY(angle), new Vec3(0, 0, 0));
  }

  /**
   * Creates an affine transform containing a 3D rotation around the z axis of
   * `angle` (in radians).
   */
  static fromRotationZ(angle: number): Affine3 {
    return new Affine3(Mat3.fromRotationZ(angle), new Vec3(0, 0, 0));
  }

  /** Creates an affine transformation from the given 3D `translation`. */
  static fromTranslation(translation: Vec3): Affine3 {
    return new Affine3(
      new Mat3(new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1)),
      new Vec3(translation.x, translation.y, translation.z),
    );
  }

  /**
   * Creates an affine transform from a 3x3 matrix (expressing scale, shear and
   * rotation)
   */
  static fromMat3(mat3: Mat3): Affine3 {
    return new Affine3(mat3.clone(), new Vec3(0, 0, 0));
  }

  /**
   * Creates an affine transform from a 3x3 matrix (expressing scale, shear and rotation)
   * and a translation vector.
   *
   * Equivalent to `Affine3.fromTranslation(translation).mul(Affine3.fromMat3(mat3))`
   */
  static fromMat3Translation(mat3: Mat3, translation: Vec3): Affine3 {
    return new Affine3(mat3.clone(), translation.clone());
  }

  /**
   * Creates an affine transform from the given 3D `scale`, `rotation` and
   * `translation`.
   *
   * Equivalent to `Affine3.fromTranslation(translation).mul(Affine3.fromQuat(rotation)).mul(Affine3.fromScale(scale))`
   */
  static fromScaleRotationTranslation(scale: Vec3, rotation: Quat, translation: Vec3): Affine3 {
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

    return new Affine3(
      new Mat3(
        new Vec3((1 - (yy + zz)) * scale.x, (xy + wz) * scale.x, (xz - wy) * scale.x),
        new Vec3((xy - wz) * scale.y, (1 - (xx + zz)) * scale.y, (yz + wx) * scale.y),
        new Vec3((xz + wy) * scale.z, (yz - wx) * scale.z, (1 - (xx + yy)) * scale.z),
      ),
      translation.clone(),
    );
  }

  /**
   * Creates an affine transform from the given 3D `rotation` and `translation`.
   *
   * Equivalent to `Affine3.fromTranslation(translation).mul(Affine3.fromQuat(rotation))`
   */
  static fromRotationTranslation(rotation: Quat, translation: Vec3): Affine3 {
    return new Affine3(Mat3.fromQuat(rotation), translation.clone());
  }

  /**
   * The given `Mat4` must be an affine transform,
   * i.e. contain no perspective transform.
   */
  static fromMat4(m: Mat4): Affine3 {
    return new Affine3(
      new Mat3(
        new Vec3(m.xAxis.x, m.xAxis.y, m.xAxis.z),
        new Vec3(m.yAxis.x, m.yAxis.y, m.yAxis.z),
        new Vec3(m.zAxis.x, m.zAxis.y, m.zAxis.z),
      ),
      new Vec3(m.wAxis.x, m.wAxis.y, m.wAxis.z),
    );
  }

  /**
   * Extracts `scale`, `rotation` and `translation` from `this`.
   *
   * The transform is expected to be non-degenerate and without shearing, or the output
   * will be invalid.
   */
  toScaleRotationTranslation(): [Vec3, Quat, Vec3] {
    const { xAxis, yAxis, zAxis } = this.matrix3;
    const det = this.matrix3.determinant();

    const scale = new Vec3(
      xAxis.length() * Math.sign(det + 1 / det),
      yAxis.length(),
      zAxis.length(),
    );

    const invX = 1 / scale.x;
    const invY = 1 / scale.y;
    const invZ = 1 / scale.z;

    const rotation = Quat.fromRotationAxes(
      new Vec3(xAxis.x * invX, xAxis.y * invX, xAxis.z * invX),
      new Vec3(yAxis.x * invY, yAxis.y * invY, yAxis.z * invY),
      new Vec3(zAxis.x * invZ, zAxis.y * invZ, zAxis.z * invZ),
    );

    return [scale, rotation, this.translation.clone()];
  }

  /** Transforms the given 3D points, applying shear, scale, rotation and translation. */
  transformPoint3(rhs: Vec3): Vec3 {
    const { xAxis, yAxis, zAxis } = this.matrix3;
    const { translation } = this;

    return new Vec3(
      xAxis.x * rhs.x + yAxis.x * rhs.y + zAxis.x * rhs.z + translation.x,
      xAxis.y * rhs.x + yAxis.y * rhs.y + zAxis.y * rhs.z + translation.y,
      xAxis.z * rhs.x + yAxis.z * rhs.y + zAxis.z * rhs.z + translation.z,
    );
  }

  /**
   * Transforms the given 3D vector, applying shear, scale and rotation (but NOT
   * translation).
   *
   * To also apply translation, use `transformPoint3()` instead.
   */
  transformVector3(rhs: Vec3): Vec3 {
    const { xAxis, yAxis, zAxis } = this.matrix3;

    return new Vec3(
      xAxis.x * rhs.x + yAxis.x * rhs.y + zAxis.x * rhs.z,
      xAxis.y * rhs.x + yAxis.y * rhs.y + zAxis.y * rhs.z,
      xAxis.z * rhs.x + yAxis.z * rhs.y + zAxis.z * rhs.z,
    );
  }

  /**
   * Returns `true` if, and only if, all elements are finite.
   *
   * If any element is either `NaN`, positive or negative infinity, this will return
   * `false`.
   */
  isFinite(): boolean {
    return (
      Number.isFinite(this.matrix3.xAxis.x) &&
      Number.isFinite(this.matrix3.xAxis.y) &&
      Number.isFinite(this.matrix3.xAxis.z) &&
      Number.isFinite(this.matrix3.yAxis.x) &&
      Number.isFinite(this.matrix3.yAxis.y) &&
      Number.isFinite(this.matrix3.yAxis.z) &&
      Number.isFinite(this.matrix3.zAxis.x) &&
      Number.isFinite(this.matrix3.zAxis.y) &&
      Number.isFinite(this.matrix3.zAxis.z) &&
      Number.isFinite(this.translation.x) &&
      Number.isFinite(this.translation.y) &&
      Number.isFinite(this.translation.z)
    );
  }

  /** Returns `true` if any elements are `NaN`. */
  isNan(): boolean {
    return (
      Number.isNaN(this.matrix3.xAxis.x) ||
      Number.isNaN(this.matrix3.xAxis.y) ||
      Number.isNaN(this.matrix3.xAxis.z) ||
      Number.isNaN(this.matrix3.yAxis.x) ||
      Number.isNaN(this.matrix3.yAxis.y) ||
      Number.isNaN(this.matrix3.yAxis.z) ||
      Number.isNaN(this.matrix3.zAxis.x) ||
      Number.isNaN(this.matrix3.zAxis.y) ||
      Number.isNaN(this.matrix3.zAxis.z) ||
      Number.isNaN(this.translation.x) ||
      Number.isNaN(this.translation.y) ||
      Number.isNaN(this.translation.z)
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
  absDiffEq(rhs: Affine3, maxAbsDiff: number): boolean {
    return (
      Math.abs(this.matrix3.xAxis.x - rhs.matrix3.xAxis.x) <= maxAbsDiff &&
      Math.abs(this.matrix3.xAxis.y - rhs.matrix3.xAxis.y) <= maxAbsDiff &&
      Math.abs(this.matrix3.xAxis.z - rhs.matrix3.xAxis.z) <= maxAbsDiff &&
      Math.abs(this.matrix3.yAxis.x - rhs.matrix3.yAxis.x) <= maxAbsDiff &&
      Math.abs(this.matrix3.yAxis.y - rhs.matrix3.yAxis.y) <= maxAbsDiff &&
      Math.abs(this.matrix3.yAxis.z - rhs.matrix3.yAxis.z) <= maxAbsDiff &&
      Math.abs(this.matrix3.zAxis.x - rhs.matrix3.zAxis.x) <= maxAbsDiff &&
      Math.abs(this.matrix3.zAxis.y - rhs.matrix3.zAxis.y) <= maxAbsDiff &&
      Math.abs(this.matrix3.zAxis.z - rhs.matrix3.zAxis.z) <= maxAbsDiff &&
      Math.abs(this.translation.x - rhs.translation.x) <= maxAbsDiff &&
      Math.abs(this.translation.y - rhs.translation.y) <= maxAbsDiff &&
      Math.abs(this.translation.z - rhs.translation.z) <= maxAbsDiff
    );
  }

  /**
   * Return the inverse of this transform.
   *
   * Note that if the transform is not invertible the result will be invalid.
   */
  inverse(): Affine3 {
    const matrix3 = this.matrix3.inverse();
    const { xAxis, yAxis, zAxis } = matrix3;
    const { translation } = this;

    return new Affine3(
      matrix3,
      new Vec3(
        -(xAxis.x * translation.x + yAxis.x * translation.y + zAxis.x * translation.z),
        -(xAxis.y * translation.x + yAxis.y * translation.y + zAxis.y * translation.z),
        -(xAxis.z * translation.x + yAxis.z * translation.y + zAxis.z * translation.z),
      ),
    );
  }

  get xAxis(): Vec3 {
    return this.matrix3.xAxis;
  }

  set xAxis(value: Vec3) {
    this.matrix3.xAxis = value;
  }

  get yAxis(): Vec3 {
    return this.matrix3.yAxis;
  }

  set yAxis(value: Vec3) {
    this.matrix3.yAxis = value;
  }

  get zAxis(): Vec3 {
    return this.matrix3.zAxis;
  }

  set zAxis(value: Vec3) {
    this.matrix3.zAxis = value;
  }

  get wAxis(): Vec3 {
    return this.translation;
  }

  set wAxis(value: Vec3) {
    this.translation = value;
  }

  clone(): Affine3 {
    return new Affine3(
      new Mat3(
        new Vec3(this.matrix3.xAxis.x, this.matrix3.xAxis.y, this.matrix3.xAxis.z),
        new Vec3(this.matrix3.yAxis.x, this.matrix3.yAxis.y, this.matrix3.yAxis.z),
        new Vec3(this.matrix3.zAxis.x, this.matrix3.zAxis.y, this.matrix3.zAxis.z),
      ),
      new Vec3(this.translation.x, this.translation.y, this.translation.z),
    );
  }

  mul(rhs: Mat4): Mat4;
  mul(rhs: Affine3): Affine3;
  mul(rhs: Affine3 | Mat4): Affine3 | Mat4 {
    const { xAxis, yAxis, zAxis } = this.matrix3;
    const { translation } = this;

    if (rhs instanceof Mat4) {
      return new Mat4(
        new Vec4(
          xAxis.x * rhs.xAxis.x +
            yAxis.x * rhs.xAxis.y +
            zAxis.x * rhs.xAxis.z +
            translation.x * rhs.xAxis.w,
          xAxis.y * rhs.xAxis.x +
            yAxis.y * rhs.xAxis.y +
            zAxis.y * rhs.xAxis.z +
            translation.y * rhs.xAxis.w,
          xAxis.z * rhs.xAxis.x +
            yAxis.z * rhs.xAxis.y +
            zAxis.z * rhs.xAxis.z +
            translation.z * rhs.xAxis.w,
          rhs.xAxis.w,
        ),
        new Vec4(
          xAxis.x * rhs.yAxis.x +
            yAxis.x * rhs.yAxis.y +
            zAxis.x * rhs.yAxis.z +
            translation.x * rhs.yAxis.w,
          xAxis.y * rhs.yAxis.x +
            yAxis.y * rhs.yAxis.y +
            zAxis.y * rhs.yAxis.z +
            translation.y * rhs.yAxis.w,
          xAxis.z * rhs.yAxis.x +
            yAxis.z * rhs.yAxis.y +
            zAxis.z * rhs.yAxis.z +
            translation.z * rhs.yAxis.w,
          rhs.yAxis.w,
        ),
        new Vec4(
          xAxis.x * rhs.zAxis.x +
            yAxis.x * rhs.zAxis.y +
            zAxis.x * rhs.zAxis.z +
            translation.x * rhs.zAxis.w,
          xAxis.y * rhs.zAxis.x +
            yAxis.y * rhs.zAxis.y +
            zAxis.y * rhs.zAxis.z +
            translation.y * rhs.zAxis.w,
          xAxis.z * rhs.zAxis.x +
            yAxis.z * rhs.zAxis.y +
            zAxis.z * rhs.zAxis.z +
            translation.z * rhs.zAxis.w,
          rhs.zAxis.w,
        ),
        new Vec4(
          xAxis.x * rhs.wAxis.x +
            yAxis.x * rhs.wAxis.y +
            zAxis.x * rhs.wAxis.z +
            translation.x * rhs.wAxis.w,
          xAxis.y * rhs.wAxis.x +
            yAxis.y * rhs.wAxis.y +
            zAxis.y * rhs.wAxis.z +
            translation.y * rhs.wAxis.w,
          xAxis.z * rhs.wAxis.x +
            yAxis.z * rhs.wAxis.y +
            zAxis.z * rhs.wAxis.z +
            translation.z * rhs.wAxis.w,
          rhs.wAxis.w,
        ),
      );
    }

    return new Affine3(
      new Mat3(
        new Vec3(
          xAxis.x * rhs.matrix3.xAxis.x +
            yAxis.x * rhs.matrix3.xAxis.y +
            zAxis.x * rhs.matrix3.xAxis.z,
          xAxis.y * rhs.matrix3.xAxis.x +
            yAxis.y * rhs.matrix3.xAxis.y +
            zAxis.y * rhs.matrix3.xAxis.z,
          xAxis.z * rhs.matrix3.xAxis.x +
            yAxis.z * rhs.matrix3.xAxis.y +
            zAxis.z * rhs.matrix3.xAxis.z,
        ),
        new Vec3(
          xAxis.x * rhs.matrix3.yAxis.x +
            yAxis.x * rhs.matrix3.yAxis.y +
            zAxis.x * rhs.matrix3.yAxis.z,
          xAxis.y * rhs.matrix3.yAxis.x +
            yAxis.y * rhs.matrix3.yAxis.y +
            zAxis.y * rhs.matrix3.yAxis.z,
          xAxis.z * rhs.matrix3.yAxis.x +
            yAxis.z * rhs.matrix3.yAxis.y +
            zAxis.z * rhs.matrix3.yAxis.z,
        ),
        new Vec3(
          xAxis.x * rhs.matrix3.zAxis.x +
            yAxis.x * rhs.matrix3.zAxis.y +
            zAxis.x * rhs.matrix3.zAxis.z,
          xAxis.y * rhs.matrix3.zAxis.x +
            yAxis.y * rhs.matrix3.zAxis.y +
            zAxis.y * rhs.matrix3.zAxis.z,
          xAxis.z * rhs.matrix3.zAxis.x +
            yAxis.z * rhs.matrix3.zAxis.y +
            zAxis.z * rhs.matrix3.zAxis.z,
        ),
      ),
      new Vec3(
        xAxis.x * rhs.translation.x +
          yAxis.x * rhs.translation.y +
          zAxis.x * rhs.translation.z +
          translation.x,
        xAxis.y * rhs.translation.x +
          yAxis.y * rhs.translation.y +
          zAxis.y * rhs.translation.z +
          translation.y,
        xAxis.z * rhs.translation.x +
          yAxis.z * rhs.translation.y +
          zAxis.z * rhs.translation.z +
          translation.z,
      ),
    );
  }

  mulAssign(rhs: Affine3): this {
    const { xAxis, yAxis, zAxis } = this.matrix3;
    const { translation } = this;

    const m00 =
      xAxis.x * rhs.matrix3.xAxis.x + yAxis.x * rhs.matrix3.xAxis.y + zAxis.x * rhs.matrix3.xAxis.z;

    const m01 =
      xAxis.y * rhs.matrix3.xAxis.x + yAxis.y * rhs.matrix3.xAxis.y + zAxis.y * rhs.matrix3.xAxis.z;

    const m02 =
      xAxis.z * rhs.matrix3.xAxis.x + yAxis.z * rhs.matrix3.xAxis.y + zAxis.z * rhs.matrix3.xAxis.z;

    const m10 =
      xAxis.x * rhs.matrix3.yAxis.x + yAxis.x * rhs.matrix3.yAxis.y + zAxis.x * rhs.matrix3.yAxis.z;

    const m11 =
      xAxis.y * rhs.matrix3.yAxis.x + yAxis.y * rhs.matrix3.yAxis.y + zAxis.y * rhs.matrix3.yAxis.z;

    const m12 =
      xAxis.z * rhs.matrix3.yAxis.x + yAxis.z * rhs.matrix3.yAxis.y + zAxis.z * rhs.matrix3.yAxis.z;

    const m20 =
      xAxis.x * rhs.matrix3.zAxis.x + yAxis.x * rhs.matrix3.zAxis.y + zAxis.x * rhs.matrix3.zAxis.z;

    const m21 =
      xAxis.y * rhs.matrix3.zAxis.x + yAxis.y * rhs.matrix3.zAxis.y + zAxis.y * rhs.matrix3.zAxis.z;

    const m22 =
      xAxis.z * rhs.matrix3.zAxis.x + yAxis.z * rhs.matrix3.zAxis.y + zAxis.z * rhs.matrix3.zAxis.z;

    const m30 =
      xAxis.x * rhs.translation.x +
      yAxis.x * rhs.translation.y +
      zAxis.x * rhs.translation.z +
      translation.x;

    const m31 =
      xAxis.y * rhs.translation.x +
      yAxis.y * rhs.translation.y +
      zAxis.y * rhs.translation.z +
      translation.y;

    const m32 =
      xAxis.z * rhs.translation.x +
      yAxis.z * rhs.translation.y +
      zAxis.z * rhs.translation.z +
      translation.z;

    xAxis.x = m00;
    xAxis.y = m01;
    xAxis.z = m02;
    yAxis.x = m10;
    yAxis.y = m11;
    yAxis.z = m12;
    zAxis.x = m20;
    zAxis.y = m21;
    zAxis.z = m22;
    translation.x = m30;
    translation.y = m31;
    translation.z = m32;

    return this;
  }

  eq(rhs: Affine3): boolean {
    return (
      this.matrix3.xAxis.x === rhs.matrix3.xAxis.x &&
      this.matrix3.xAxis.y === rhs.matrix3.xAxis.y &&
      this.matrix3.xAxis.z === rhs.matrix3.xAxis.z &&
      this.matrix3.yAxis.x === rhs.matrix3.yAxis.x &&
      this.matrix3.yAxis.y === rhs.matrix3.yAxis.y &&
      this.matrix3.yAxis.z === rhs.matrix3.yAxis.z &&
      this.matrix3.zAxis.x === rhs.matrix3.zAxis.x &&
      this.matrix3.zAxis.y === rhs.matrix3.zAxis.y &&
      this.matrix3.zAxis.z === rhs.matrix3.zAxis.z &&
      this.translation.x === rhs.translation.x &&
      this.translation.y === rhs.translation.y &&
      this.translation.z === rhs.translation.z
    );
  }

  ne(rhs: Affine3): boolean {
    return (
      this.matrix3.xAxis.x !== rhs.matrix3.xAxis.x ||
      this.matrix3.xAxis.y !== rhs.matrix3.xAxis.y ||
      this.matrix3.xAxis.z !== rhs.matrix3.xAxis.z ||
      this.matrix3.yAxis.x !== rhs.matrix3.yAxis.x ||
      this.matrix3.yAxis.y !== rhs.matrix3.yAxis.y ||
      this.matrix3.yAxis.z !== rhs.matrix3.yAxis.z ||
      this.matrix3.zAxis.x !== rhs.matrix3.zAxis.x ||
      this.matrix3.zAxis.y !== rhs.matrix3.zAxis.y ||
      this.matrix3.zAxis.z !== rhs.matrix3.zAxis.z ||
      this.translation.x !== rhs.translation.x ||
      this.translation.y !== rhs.translation.y ||
      this.translation.z !== rhs.translation.z
    );
  }

  toString(): string {
    return `[[${this.matrix3.xAxis.x}, ${this.matrix3.xAxis.y}, ${this.matrix3.xAxis.z}], [${this.matrix3.yAxis.x}, ${this.matrix3.yAxis.y}, ${this.matrix3.yAxis.z}], [${this.matrix3.zAxis.x}, ${this.matrix3.zAxis.y}, ${this.matrix3.zAxis.z}], [${this.translation.x}, ${this.translation.y}, ${this.translation.z}]]`;
  }

  static #sliceElement(slice: ArrayLike<number>, index: number): number {
    const value = slice[index];

    if (value === undefined) {
      throw new RangeError("index out of bounds");
    }

    return value;
  }
}
