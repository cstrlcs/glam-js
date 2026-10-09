import { Affine2, Mat2, Mat3, Vec2, Vec3 } from "@";

type Array2 = [number, number];
type Array6 = [number, number, number, number, number, number];

const F32_EPSILON = 1.1920929e-7;
const MIN_POSITIVE = 2.2250738585072014e-308;
const MATRIX1D: Array6 = [1, 2, 3, 4, 5, 6];

const MATRIX2D: [Array2, Array2, Array2] = [
  [1, 2],
  [3, 4],
  [5, 6],
];

function deg(angle: number) {
  return (angle * Math.PI) / 180;
}

describe(Affine2, () => {
  test("identity", () => {
    expect(Affine2.IDENTITY.eq(Affine2.IDENTITY.mul(Affine2.IDENTITY))).toBeTrue();
  });

  test("zero", () => {
    expect(Affine2.ZERO.transformPoint2(new Vec2(1, 2))).toStrictEqual(Vec2.ZERO);
  });

  test("nan", () => {
    expect(Affine2.NAN.isNan()).toBeTrue();
    expect(Affine2.NAN.isFinite()).toBeFalse();
  });

  test("constants are fresh instances", () => {
    const a = Affine2.IDENTITY;

    a.translation.x = 5;
    expect(Affine2.IDENTITY.translation.x).toBe(0);
    expect(Affine2.IDENTITY).not.toBe(Affine2.IDENTITY);
  });

  test("from cols", () => {
    const a = Affine2.fromCols(
      Vec2.fromArray(MATRIX2D[0]),
      Vec2.fromArray(MATRIX2D[1]),
      Vec2.fromArray(MATRIX2D[2]),
    );

    expect(a.toColsArray2d()).toStrictEqual(MATRIX2D);
    expect(Affine2.fromColsArray(MATRIX1D).toColsArray()).toStrictEqual(MATRIX1D);
    expect(Affine2.fromColsArray2d(MATRIX2D).toColsArray2d()).toStrictEqual(MATRIX2D);
  });

  test("deref", () => {
    const a = Affine2.fromColsArray2d(MATRIX2D);

    expect(a.xAxis.toArray()).toStrictEqual(MATRIX2D[0]);
    expect(a.yAxis.toArray()).toStrictEqual(MATRIX2D[1]);
    expect(a.zAxis.toArray()).toStrictEqual(MATRIX2D[2]);

    const b = a.clone();

    b.xAxis.mulAssign(0);
    b.yAxis.mulAssign(0);
    b.zAxis.mulAssign(0);
    expect(b.eq(Affine2.ZERO)).toBeTrue();
    expect(a.eq(Affine2.fromColsArray2d(MATRIX2D))).toBeTrue();
    b.zAxis = new Vec2(7, 8);
    expect(b.translation).toStrictEqual(new Vec2(7, 8));
  });

  test("from mat2", () => {
    const m = Mat2.fromColsArray2d([MATRIX2D[0], MATRIX2D[1]]);
    const a = Affine2.fromMat2(m);

    expect(a.matrix2.eq(m)).toBeTrue();
    expect(a.matrix2).not.toBe(m);
    expect(a.translation).toStrictEqual(Vec2.ZERO);

    const t = Vec2.fromArray(MATRIX2D[2]);

    expect(Affine2.fromMat2Translation(m, t).toColsArray2d()).toStrictEqual(MATRIX2D);
  });

  test("from mat3", () => {
    const m = Mat3.fromColsArray2d([
      [1, 2, 0],
      [3, 4, 0],
      [5, 6, 1],
    ]);

    const a = Affine2.fromMat3(m);

    expect(a.toColsArray2d()).toStrictEqual(MATRIX2D);
    expect(Mat3.fromAffine2(a).eq(m)).toBeTrue();
  });

  test("translation", () => {
    const translate = Affine2.fromTranslation(new Vec2(1, 2));

    expect(translate.translation).toStrictEqual(new Vec2(1, 2));
    expect(translate.transformPoint2(new Vec2(2, 3))).toStrictEqual(new Vec2(3, 5));
  });

  test("mul", () => {
    let m = Affine2.fromAngle(deg(90));

    expect(new Vec2(-1, 0).absDiffEq(m.transformVector2(Vec2.Y), F32_EPSILON)).toBeTrue();
    m = Affine2.fromAngleTranslation(deg(90), new Vec2(1, 2));
    expect(new Vec2(-1, 0).absDiffEq(m.transformVector2(Vec2.Y), 1e-6)).toBeTrue();
    m = Affine2.fromScaleAngleTranslation(new Vec2(0.5, 1.5), deg(90), new Vec2(1, 2));
    expect(new Vec2(-1.5, 0).absDiffEq(m.transformVector2(Vec2.Y), 1e-6)).toBeTrue();
    expect(new Vec2(-0.5, 2).absDiffEq(m.transformPoint2(Vec2.Y), 1e-6)).toBeTrue();
  });

  test("from scale", () => {
    const m = Affine2.fromScale(new Vec2(2, 4));

    expect(m.transformPoint2(new Vec2(1, 1)).absDiffEq(new Vec2(2, 4), F32_EPSILON)).toBeTrue();
  });

  test("inverse", () => {
    const identity = Affine2.IDENTITY;

    expect(identity.absDiffEq(identity.inverse(), F32_EPSILON)).toBeTrue();

    const rot = Affine2.fromAngle(deg(90));
    const rotInv = rot.inverse();

    expect(identity.absDiffEq(rot.mul(rotInv), F32_EPSILON)).toBeTrue();
    expect(identity.absDiffEq(rotInv.mul(rot), F32_EPSILON)).toBeTrue();

    const trans = Affine2.fromTranslation(new Vec2(1, 2));
    const transInv = trans.inverse();

    expect(identity.absDiffEq(trans.mul(transInv), F32_EPSILON)).toBeTrue();
    expect(identity.absDiffEq(transInv.mul(trans), F32_EPSILON)).toBeTrue();

    const scale = Affine2.fromScale(new Vec2(4, 5));
    const scaleInv = scale.inverse();

    expect(identity.absDiffEq(scale.mul(scaleInv), F32_EPSILON)).toBeTrue();
    expect(identity.absDiffEq(scaleInv.mul(scale), F32_EPSILON)).toBeTrue();

    let m = scale.mul(rot).mul(trans);
    let mInv = m.inverse();

    expect(identity.absDiffEq(m.mul(mInv), 1e-5)).toBeTrue();
    expect(identity.absDiffEq(mInv.mul(m), 1e-5)).toBeTrue();
    expect(mInv.absDiffEq(transInv.mul(rotInv).mul(scaleInv), 1e-6)).toBeTrue();

    m = Affine2.fromAngle(0.5)
      .mul(Affine2.fromScale(new Vec2(1, 0.5)))
      .mul(Affine2.fromAngle(-0.5));

    mInv = m.inverse();
    expect(identity.absDiffEq(m.mul(mInv), 1e-5)).toBeTrue();
    expect(identity.absDiffEq(mInv.mul(m), 1e-5)).toBeTrue();
    expect(Affine2.ZERO.inverse().isFinite()).toBeFalse();
  });

  test("decompose", () => {
    const [identityScale, identityAngle, identityTranslation] =
      Affine2.IDENTITY.toScaleAngleTranslation();

    expect(identityScale.absDiffEq(Vec2.ONE, F32_EPSILON)).toBeTrue();
    expect(Math.abs(identityAngle)).toBe(0);
    expect(identityTranslation.absDiffEq(Vec2.ZERO, F32_EPSILON)).toBeTrue();

    const inTranslation = new Vec2(-2, 4);
    const inRotation = deg(-45);

    for (const inScale of [Vec2.ONE, new Vec2(1, 2), new Vec2(-4, 1)]) {
      const inMat = Affine2.fromScaleAngleTranslation(inScale, inRotation, inTranslation);
      const [outScale, outRotation, outTranslation] = inMat.toScaleAngleTranslation();

      expect(outScale.absDiffEq(inScale, 1e-6)).toBeTrue();
      expect(Math.abs(outRotation - inRotation)).toBeLessThanOrEqual(F32_EPSILON);
      expect(outTranslation.absDiffEq(inTranslation, F32_EPSILON)).toBeTrue();

      expect(
        inMat.absDiffEq(
          Affine2.fromScaleAngleTranslation(outScale, outRotation, outTranslation),
          1e-5,
        ),
      ).toBeTrue();
    }

    const flipped = Affine2.fromScaleAngleTranslation(new Vec2(4, -1), inRotation, inTranslation);
    const [flippedScale, flippedRotation, flippedTranslation] = flipped.toScaleAngleTranslation();

    expect(flippedTranslation.absDiffEq(inTranslation, F32_EPSILON)).toBeTrue();

    expect(
      flipped.absDiffEq(
        Affine2.fromScaleAngleTranslation(flippedScale, flippedRotation, flippedTranslation),
        1e-6,
      ),
    ).toBeTrue();

    const [zeroScale] = Affine2.ZERO.toScaleAngleTranslation();

    expect(zeroScale).toStrictEqual(Vec2.ZERO);

    const [subnormalScale] = Affine2.fromCols(
      new Vec2(MIN_POSITIVE, 0),
      Vec2.Y,
      Vec2.ZERO,
    ).toScaleAngleTranslation();

    expect(subnormalScale.x).toBe(0);
  });

  test("decompose keeps the sign of a negative zero determinant", () => {
    const a = Affine2.fromCols(new Vec2(1, 0), new Vec2(0, -0), Vec2.ZERO);
    const [scale] = a.toScaleAngleTranslation();

    expect(a.matrix2.determinant()).toBe(-0);
    expect(scale.x).toBe(-1);
  });

  test("ops", () => {
    const m0 = Affine2.fromColsArray2d(MATRIX2D);

    expect(m0.absDiffEq(m0.mul(Affine2.IDENTITY), F32_EPSILON)).toBeTrue();
    expect(m0.absDiffEq(Affine2.IDENTITY.mul(m0), F32_EPSILON)).toBeTrue();

    const m1 = m0.clone();

    expect(m1.mulAssign(Affine2.IDENTITY)).toBe(m1);
    expect(m1.absDiffEq(m0, F32_EPSILON)).toBeTrue();

    const mat3 = Mat3.fromAffine2(m0);

    expect(mat3.absDiffEq(Affine2.IDENTITY.mul(mat3), F32_EPSILON)).toBeTrue();
    expect(mat3.absDiffEq(mat3.mul(Affine2.IDENTITY), F32_EPSILON)).toBeTrue();

    const n = mat3.clone();

    expect(n.mulAssign(Affine2.IDENTITY)).toBe(n);
    expect(mat3.absDiffEq(n, F32_EPSILON)).toBeTrue();
  });

  test("mul matches mat3", () => {
    const a = Affine2.fromScaleAngleTranslation(new Vec2(2, -3), 0.7, new Vec2(4, -5));
    const b = Affine2.fromColsArray([0.5, -1.5, 2.5, 3, -4, 6]);
    const m = Mat3.fromColsArray([1, 2, 3, -4, 5, 6, 7, -8, 9]);
    const ma = Mat3.fromAffine2(a);
    const mb = Mat3.fromAffine2(b);

    expect(Mat3.fromAffine2(a.mul(b)).absDiffEq(ma.mul(mb), 1e-12)).toBeTrue();
    expect(a.mul(m).absDiffEq(ma.mul(m), 1e-12)).toBeTrue();
    expect(m.mul(a).absDiffEq(m.mul(ma), 1e-12)).toBeTrue();
    expect(a.mul(m)).toBeInstanceOf(Mat3);
    expect(m.mul(a)).toBeInstanceOf(Mat3);

    const assigned = a.clone();

    assigned.mulAssign(b);
    expect(assigned.eq(a.mul(b))).toBeTrue();

    const self = a.clone();

    self.mulAssign(self);
    expect(self.eq(a.mul(a))).toBeTrue();

    const mat = m.clone();

    mat.mulAssign(a);
    expect(mat.eq(m.mul(a))).toBeTrue();

    const point = new Vec2(-3, 7);
    const vector = new Vec2(0.25, -2);

    expect(a.transformPoint2(point).absDiffEq(ma.transformPoint2(point), 1e-12)).toBeTrue();
    expect(a.transformVector2(vector).absDiffEq(ma.transformVector2(vector), 1e-12)).toBeTrue();

    expect(
      a.inverse().transformPoint2(a.transformPoint2(point)).absDiffEq(point, 1e-12),
    ).toBeTrue();
  });

  test("mat3 conversion", () => {
    const a = Affine2.fromColsArray2d(MATRIX2D);

    expect(Mat3.fromAffine2(a)).toStrictEqual(
      new Mat3(new Vec3(1, 2, 0), new Vec3(3, 4, 0), new Vec3(5, 6, 1)),
    );
  });

  test("fmt", () => {
    expect(Affine2.fromColsArray2d(MATRIX2D).toString()).toBe("[[1, 2], [3, 4], [5, 6]]");
  });

  test("to from slice", () => {
    const m = Affine2.fromColsSlice(MATRIX1D);

    expect(Affine2.fromColsArray(MATRIX1D).eq(m)).toBeTrue();
    expect(m.toColsArray()).toStrictEqual(MATRIX1D);
    expect(m.toColsArray2d()).toStrictEqual(MATRIX2D);

    const out = [0, 0, 0, 0, 0, 0];

    m.writeColsToSlice(out);
    expect(out).toStrictEqual(MATRIX1D);

    expect(
      m.eq(
        Affine2.fromCols(
          Vec2.fromArray(MATRIX2D[0]),
          Vec2.fromArray(MATRIX2D[1]),
          Vec2.fromArray(MATRIX2D[2]),
        ),
      ),
    ).toBeTrue();

    expect(() => Affine2.fromColsSlice([0, 0, 0, 0, 0])).toThrow(RangeError);

    expect(() => {
      Affine2.IDENTITY.writeColsToSlice([0, 0, 0, 0, 0]);
    }).toThrow(RangeError);
  });

  test("is finite", () => {
    expect(Affine2.fromScale(new Vec2(1, 1)).isFinite()).toBeTrue();
    expect(Affine2.fromScale(new Vec2(0, 1)).isFinite()).toBeTrue();
    expect(Affine2.fromScale(new Vec2(1, Number.NaN)).isFinite()).toBeFalse();
    expect(Affine2.fromScale(new Vec2(1, Number.NEGATIVE_INFINITY)).isFinite()).toBeFalse();
  });

  test("value semantics", () => {
    const m = Mat2.IDENTITY;
    const t = new Vec2(1, 2);
    const a = Affine2.fromMat2Translation(m, t);

    m.xAxis.x = 9;
    t.x = 9;
    expect(a.matrix2.xAxis.x).toBe(1);
    expect(a.translation.x).toBe(1);

    const translation = a.toScaleAngleTranslation()[2];

    translation.x = 5;
    expect(a.translation.x).toBe(1);
    expect(a.clone()).not.toBe(a);
    expect(a.ne(Affine2.IDENTITY)).toBeTrue();
    expect(a.ne(a.clone())).toBeFalse();
  });

  test("axis setters", () => {
    const a = Affine2.IDENTITY;

    a.xAxis = new Vec2(1, 2);
    a.yAxis = new Vec2(3, 4);
    a.zAxis = new Vec2(5, 6);
    expect(a.matrix2).toStrictEqual(Mat2.fromCols(new Vec2(1, 2), new Vec2(3, 4)));
    expect(a.translation).toStrictEqual(new Vec2(5, 6));
  });
});
