import { Affine3, EulerRot, Mat3, Mat4, Quat, Vec3, Vec4 } from "@";

type Array3 = [number, number, number];
type Array12 = [...Array3, ...Array3, ...Array3, ...Array3];

const F32_EPSILON = 1.1920929e-7;
const MIN_POSITIVE = 2.2250738585072014e-308;
const MATRIX1D: Array12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const MATRIX2D: [Array3, Array3, Array3, Array3] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
];

function deg(angle: number) {
  return (angle * Math.PI) / 180;
}

describe(Affine3, () => {
  test("identity", () => {
    expect(Affine3.IDENTITY.eq(Affine3.IDENTITY.mul(Affine3.IDENTITY))).toBeTrue();
  });

  test("zero", () => {
    expect(Affine3.ZERO.transformPoint3(new Vec3(1, 2, 3))).toStrictEqual(Vec3.ZERO);
  });

  test("nan", () => {
    expect(Affine3.NAN.isNan()).toBeTrue();
    expect(Affine3.NAN.isFinite()).toBeFalse();
  });

  test("constants are fresh instances", () => {
    const a = Affine3.IDENTITY;

    a.matrix3.xAxis.x = 5;
    expect(Affine3.IDENTITY.matrix3.xAxis.x).toBe(1);
    expect(Affine3.IDENTITY).not.toBe(Affine3.IDENTITY);
  });

  test("from cols", () => {
    const a = Affine3.fromCols(
      Vec3.fromArray(MATRIX2D[0]),
      Vec3.fromArray(MATRIX2D[1]),
      Vec3.fromArray(MATRIX2D[2]),
      Vec3.fromArray(MATRIX2D[3]),
    );

    expect(a.toColsArray2d()).toStrictEqual(MATRIX2D);
    expect(Affine3.fromColsArray(MATRIX1D).toColsArray()).toStrictEqual(MATRIX1D);
    expect(Affine3.fromColsArray2d(MATRIX2D).toColsArray2d()).toStrictEqual(MATRIX2D);
  });

  test("deref", () => {
    const a = Affine3.fromColsArray2d(MATRIX2D);

    expect(a.xAxis.toArray()).toStrictEqual(MATRIX2D[0]);
    expect(a.yAxis.toArray()).toStrictEqual(MATRIX2D[1]);
    expect(a.zAxis.toArray()).toStrictEqual(MATRIX2D[2]);
    expect(a.wAxis.toArray()).toStrictEqual(MATRIX2D[3]);

    const b = a.clone();

    b.xAxis.mulAssign(0);
    b.yAxis.mulAssign(0);
    b.zAxis.mulAssign(0);
    b.wAxis.mulAssign(0);
    expect(b.eq(Affine3.ZERO)).toBeTrue();
    expect(a.eq(Affine3.fromColsArray2d(MATRIX2D))).toBeTrue();
    b.wAxis = new Vec3(7, 8, 9);
    expect(b.translation).toStrictEqual(new Vec3(7, 8, 9));
  });

  test("from mat3", () => {
    const m = Mat3.fromColsArray2d([MATRIX2D[0], MATRIX2D[1], MATRIX2D[2]]);
    const a = Affine3.fromMat3(m);

    expect(a.matrix3.eq(m)).toBeTrue();
    expect(a.matrix3).not.toBe(m);
    expect(a.translation).toStrictEqual(Vec3.ZERO);

    const t = Vec3.fromArray(MATRIX2D[3]);

    expect(Affine3.fromMat3Translation(m, t).toColsArray2d()).toStrictEqual(MATRIX2D);
  });

  test("from mat4", () => {
    const m = Mat4.fromColsArray2d([
      [1, 2, 3, 0],
      [4, 5, 6, 0],
      [7, 8, 9, 0],
      [10, 11, 12, 1],
    ]);

    const a = Affine3.fromMat4(m);

    expect(a.toColsArray2d()).toStrictEqual(MATRIX2D);
    expect(Mat4.fromAffine3(a).eq(m)).toBeTrue();
  });

  test("translation", () => {
    const translate = Affine3.fromTranslation(new Vec3(1, 2, 3));

    expect(translate.translation).toStrictEqual(new Vec3(1, 2, 3));
    expect(translate.transformPoint3(new Vec3(2, 3, 4))).toStrictEqual(new Vec3(3, 5, 7));
  });

  test("from rotation", () => {
    const eps = 2 * F32_EPSILON;

    expect(
      Affine3.fromRotationX(deg(180)).absDiffEq(Affine3.fromAxisAngle(Vec3.X, deg(180)), eps),
    ).toBeTrue();

    expect(
      Affine3.fromRotationY(deg(180)).absDiffEq(Affine3.fromAxisAngle(Vec3.Y, deg(180)), eps),
    ).toBeTrue();

    expect(
      Affine3.fromRotationZ(deg(180)).absDiffEq(Affine3.fromAxisAngle(Vec3.Z, deg(180)), eps),
    ).toBeTrue();

    const rotationX = Affine3.fromRotationX(deg(180));
    const quatX = Quat.fromRotationX(deg(180));

    expect(rotationX.absDiffEq(Affine3.fromQuat(quatX), F32_EPSILON)).toBeTrue();

    expect(
      Quat.fromAffine3(rotationX).absDiffEq(Quat.fromRotationX(deg(180)), F32_EPSILON),
    ).toBeTrue();

    const m = Affine3.fromRotationTranslation(Quat.fromRotationX(deg(90)), new Vec3(1, 2, 3));

    expect(m.transformVector3(Vec3.Y).absDiffEq(new Vec3(0, 0, 1), 1e-6)).toBeTrue();
  });

  test("mul", () => {
    let m = Affine3.fromAxisAngle(Vec3.Z, deg(90));

    expect(m.transformVector3(Vec3.Y).absDiffEq(new Vec3(-1, 0, 0), F32_EPSILON)).toBeTrue();

    m = Affine3.fromScaleRotationTranslation(
      new Vec3(0.5, 1.5, 2),
      Quat.fromRotationX(deg(90)),
      new Vec3(1, 2, 3),
    );

    expect(m.transformVector3(Vec3.Y).absDiffEq(new Vec3(0, 0, 1.5), 1e-6)).toBeTrue();
    expect(m.transformPoint3(Vec3.Y).absDiffEq(new Vec3(1, 2, 4.5), 1e-6)).toBeTrue();
  });

  test("from scale", () => {
    const m = Affine3.fromScale(new Vec3(2, 4, 8));

    expect(
      m.transformPoint3(new Vec3(1, 1, 1)).absDiffEq(new Vec3(2, 4, 8), F32_EPSILON),
    ).toBeTrue();
  });

  test("inverse", () => {
    const identity = Affine3.IDENTITY;

    expect(identity.absDiffEq(identity.inverse(), F32_EPSILON)).toBeTrue();

    const rotz = Affine3.fromRotationZ(deg(90));
    const rotzInv = rotz.inverse();

    expect(identity.absDiffEq(rotz.mul(rotzInv), F32_EPSILON)).toBeTrue();
    expect(identity.absDiffEq(rotzInv.mul(rotz), F32_EPSILON)).toBeTrue();

    const trans = Affine3.fromTranslation(new Vec3(1, 2, 3));
    const transInv = trans.inverse();

    expect(identity.absDiffEq(trans.mul(transInv), F32_EPSILON)).toBeTrue();
    expect(identity.absDiffEq(transInv.mul(trans), F32_EPSILON)).toBeTrue();

    const scale = Affine3.fromScale(new Vec3(4, 5, 6));
    const scaleInv = scale.inverse();

    expect(identity.absDiffEq(scale.mul(scaleInv), F32_EPSILON)).toBeTrue();
    expect(identity.absDiffEq(scaleInv.mul(scale), F32_EPSILON)).toBeTrue();

    let m = scale.mul(rotz).mul(trans);
    let mInv = m.inverse();

    expect(identity.absDiffEq(m.mul(mInv), 1e-5)).toBeTrue();
    expect(identity.absDiffEq(mInv.mul(m), 1e-5)).toBeTrue();
    expect(mInv.absDiffEq(transInv.mul(rotzInv).mul(scaleInv), 1e-6)).toBeTrue();

    m = Affine3.fromAxisAngle(Vec3.X, 0.5)
      .mul(Affine3.fromScale(new Vec3(1, 0.5, 2)))
      .mul(Affine3.fromAxisAngle(Vec3.X, -0.5));

    mInv = m.inverse();
    expect(identity.absDiffEq(m.mul(mInv), 1e-5)).toBeTrue();
    expect(identity.absDiffEq(mInv.mul(m), 1e-5)).toBeTrue();
    expect(Affine3.ZERO.inverse().isFinite()).toBeFalse();
  });

  test("decompose", () => {
    const [identityScale, identityRotation, identityTranslation] =
      Affine3.IDENTITY.toScaleRotationTranslation();

    expect(identityScale.absDiffEq(Vec3.ONE, F32_EPSILON)).toBeTrue();
    expect(identityRotation.isNearIdentity()).toBeTrue();
    expect(identityTranslation.absDiffEq(Vec3.ZERO, F32_EPSILON)).toBeTrue();

    const inTranslation = new Vec3(-2, 4, -0.125);
    const inRotation = Quat.fromEuler(EulerRot.YXZ, deg(-45), deg(180), deg(270));

    for (const [inScale, eps] of [
      [Vec3.ONE, 1e-6],
      [new Vec3(1, 2, 4), 1e-5],
      [new Vec3(-4, 1, 2), 1e-5],
    ] as const) {
      const inMat = Affine3.fromScaleRotationTranslation(inScale, inRotation, inTranslation);
      const [outScale, outRotation, outTranslation] = inMat.toScaleRotationTranslation();

      expect(outScale.absDiffEq(inScale, 1e-6)).toBeTrue();
      expect(outTranslation.absDiffEq(inTranslation, F32_EPSILON)).toBeTrue();

      expect(
        inMat.absDiffEq(
          Affine3.fromScaleRotationTranslation(outScale, outRotation, outTranslation),
          eps,
        ),
      ).toBeTrue();
    }

    const flipped = Affine3.fromScaleRotationTranslation(
      new Vec3(4, -1, -2),
      inRotation,
      inTranslation,
    );

    const [flippedScale, flippedRotation, flippedTranslation] =
      flipped.toScaleRotationTranslation();

    expect(flippedTranslation.absDiffEq(inTranslation, F32_EPSILON)).toBeTrue();

    expect(
      flipped.absDiffEq(
        Affine3.fromScaleRotationTranslation(flippedScale, flippedRotation, flippedTranslation),
        1e-6,
      ),
    ).toBeTrue();

    const [subnormalScale] = Affine3.fromScale(
      new Vec3(MIN_POSITIVE, 1, 1),
    ).toScaleRotationTranslation();

    expect(subnormalScale.x).toBe(0);
  });

  test("ops", () => {
    const m0 = Affine3.fromColsArray2d(MATRIX2D);

    expect(m0.absDiffEq(m0.mul(Affine3.IDENTITY), F32_EPSILON)).toBeTrue();
    expect(m0.absDiffEq(Affine3.IDENTITY.mul(m0), F32_EPSILON)).toBeTrue();

    const m1 = m0.clone();

    expect(m1.mulAssign(Affine3.IDENTITY)).toBe(m1);
    expect(m1.absDiffEq(m0, F32_EPSILON)).toBeTrue();

    const mat4 = Mat4.fromAffine3(m0);

    expect(mat4.absDiffEq(Affine3.IDENTITY.mul(mat4), F32_EPSILON)).toBeTrue();
    expect(mat4.absDiffEq(mat4.mul(Affine3.IDENTITY), F32_EPSILON)).toBeTrue();

    const n = mat4.clone();

    expect(n.mulAssign(Affine3.IDENTITY)).toBe(n);
    expect(mat4.absDiffEq(n, F32_EPSILON)).toBeTrue();
  });

  test("mul matches mat4", () => {
    const a = Affine3.fromScaleRotationTranslation(
      new Vec3(2, -3, 0.5),
      Quat.fromEuler(EulerRot.XYZ, 0.3, -1.1, 2.4),
      new Vec3(4, -5, 6),
    );

    const b = Affine3.fromColsArray([0.5, -1.5, 2.5, 3, -4, 6, 1, 2, -3, 7, -8, 9]);
    const m = Mat4.fromColsArray([1, 2, 3, 4, -5, 6, 7, 8, 9, -10, 11, 12, 13, 14, -15, 16]);
    const ma = Mat4.fromAffine3(a);
    const mb = Mat4.fromAffine3(b);

    expect(Mat4.fromAffine3(a.mul(b)).absDiffEq(ma.mul(mb), 1e-12)).toBeTrue();
    expect(a.mul(m).absDiffEq(ma.mul(m), 1e-12)).toBeTrue();
    expect(m.mul(a).absDiffEq(m.mul(ma), 1e-12)).toBeTrue();
    expect(a.mul(m)).toBeInstanceOf(Mat4);
    expect(m.mul(a)).toBeInstanceOf(Mat4);

    const assigned = a.clone();

    assigned.mulAssign(b);
    expect(assigned.eq(a.mul(b))).toBeTrue();

    const self = a.clone();

    self.mulAssign(self);
    expect(self.eq(a.mul(a))).toBeTrue();

    const mat = m.clone();

    mat.mulAssign(a);
    expect(mat.eq(m.mul(a))).toBeTrue();

    const point = new Vec3(-3, 7, 0.5);
    const vector = new Vec3(0.25, -2, 3);

    expect(a.transformPoint3(point).absDiffEq(ma.transformPoint3(point), 1e-12)).toBeTrue();
    expect(a.transformVector3(vector).absDiffEq(ma.transformVector3(vector), 1e-12)).toBeTrue();

    expect(
      a.inverse().transformPoint3(a.transformPoint3(point)).absDiffEq(point, 1e-12),
    ).toBeTrue();
  });

  test("mat4 conversion", () => {
    expect(Mat4.fromAffine3(Affine3.fromColsArray2d(MATRIX2D))).toStrictEqual(
      new Mat4(
        new Vec4(1, 2, 3, 0),
        new Vec4(4, 5, 6, 0),
        new Vec4(7, 8, 9, 0),
        new Vec4(10, 11, 12, 1),
      ),
    );
  });

  test("fmt", () => {
    expect(Affine3.fromColsArray2d(MATRIX2D).toString()).toBe(
      "[[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]",
    );
  });

  test("to from slice", () => {
    const m = Affine3.fromColsSlice(MATRIX1D);

    expect(Affine3.fromColsArray(MATRIX1D).eq(m)).toBeTrue();
    expect(m.toColsArray()).toStrictEqual(MATRIX1D);
    expect(m.toColsArray2d()).toStrictEqual(MATRIX2D);

    const out = Array.from({ length: 12 }, () => 0);

    m.writeColsToSlice(out);
    expect(out).toStrictEqual(MATRIX1D);

    expect(
      m.eq(
        Affine3.fromCols(
          Vec3.fromArray(MATRIX2D[0]),
          Vec3.fromArray(MATRIX2D[1]),
          Vec3.fromArray(MATRIX2D[2]),
          Vec3.fromArray(MATRIX2D[3]),
        ),
      ),
    ).toBeTrue();

    const short = Array.from({ length: 11 }, () => 0);

    expect(() => Affine3.fromColsSlice(short)).toThrow(RangeError);

    expect(() => {
      Affine3.IDENTITY.writeColsToSlice(short);
    }).toThrow(RangeError);
  });

  test("is finite", () => {
    expect(Affine3.fromScale(new Vec3(1, 1, 1)).isFinite()).toBeTrue();
    expect(Affine3.fromScale(new Vec3(0, 1, 1)).isFinite()).toBeTrue();
    expect(Affine3.fromScale(new Vec3(1, Number.NaN, 1)).isFinite()).toBeFalse();
    expect(Affine3.fromScale(new Vec3(1, 1, Number.NEGATIVE_INFINITY)).isFinite()).toBeFalse();
  });

  test("value semantics", () => {
    const m = Mat3.IDENTITY;
    const t = new Vec3(1, 2, 3);
    const a = Affine3.fromMat3Translation(m, t);

    m.xAxis.x = 9;
    t.x = 9;
    expect(a.matrix3.xAxis.x).toBe(1);
    expect(a.translation.x).toBe(1);

    const translation = a.toScaleRotationTranslation()[2];

    translation.x = 5;
    expect(a.translation.x).toBe(1);
    expect(a.ne(Affine3.IDENTITY)).toBeTrue();
    expect(a.ne(a.clone())).toBeFalse();
  });

  test("axis setters", () => {
    const a = Affine3.IDENTITY;

    a.xAxis = new Vec3(1, 2, 3);
    a.yAxis = new Vec3(4, 5, 6);
    a.zAxis = new Vec3(7, 8, 9);
    a.wAxis = new Vec3(10, 11, 12);

    expect(a.matrix3).toStrictEqual(
      Mat3.fromCols(new Vec3(1, 2, 3), new Vec3(4, 5, 6), new Vec3(7, 8, 9)),
    );

    expect(a.translation).toStrictEqual(new Vec3(10, 11, 12));
  });
});
