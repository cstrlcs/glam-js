import { EulerRot, Mat3, Mat4, Quat, Vec3, Vec4, mat4 } from "@";

type Array4 = [number, number, number, number];
type Array16 = [...Array4, ...Array4, ...Array4, ...Array4];

const F32_EPSILON = 1.1920929e-7;
const MIN_POSITIVE = 2.2250738585072014e-308;

const ARRAY4X4: [Array4, Array4, Array4, Array4] = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

const ARRAY1X16: Array16 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const ZEROS15 = Array.from({ length: 15 }, () => 0);

function deg(angle: number) {
  return (angle * Math.PI) / 180;
}

function reflectionScale(signs: number, magnitude: number) {
  return new Vec3(
    signs % 2 === 0 ? magnitude : -magnitude,
    Math.floor(signs / 2) % 2 === 0 ? 2 : -2,
    Math.floor(signs / 4) % 2 === 0 ? 1 / magnitude : -1 / magnitude,
  );
}

function reflectionCases() {
  const cases: [Vec3, Quat, Vec3][] = [];

  for (let i = 0; i < 32; i += 1) {
    const rotation = Quat.fromEuler(EulerRot.XYZ, (i - 16) * 0.13, (i - 7) * 0.29, (i - 23) * 0.37);

    for (let signs = 0; signs < 8; signs += 1) {
      for (const magnitude of [1e-9, 1, 1e9]) {
        cases.push([reflectionScale(signs, magnitude), rotation, new Vec3(-0, i, -1e10)]);
      }
    }
  }

  return cases;
}

function signum(value: number) {
  return value < 0 || Object.is(value, -0) ? -1 : 1;
}

describe(Mat4, () => {
  test("new", () => {
    const m = Mat4.new(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

    expect(m.xAxis).toStrictEqual(new Vec4(1, 2, 3, 4));
    expect(m.yAxis).toStrictEqual(new Vec4(5, 6, 7, 8));
    expect(m.zAxis).toStrictEqual(new Vec4(9, 10, 11, 12));
    expect(m.wAxis).toStrictEqual(new Vec4(13, 14, 15, 16));
  });

  test("constants", () => {
    expect(Mat4.ZERO).toStrictEqual(Mat4.new(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
    expect(Mat4.IDENTITY).toStrictEqual(Mat4.new(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));

    const nan: number[] = Mat4.NAN.toColsArray();

    expect(nan).toStrictEqual(Array.from({ length: 16 }, () => Number.NaN));
  });

  test("constants Are Fresh Instances", () => {
    const m = Mat4.IDENTITY;

    m.xAxis.x = 5;
    expect(Mat4.IDENTITY.xAxis.x).toBe(1);
    expect(Mat4.IDENTITY).not.toBe(Mat4.IDENTITY);
  });

  test("from Cols", () => {
    const x = new Vec4(1, 2, 3, 4);
    const y = new Vec4(5, 6, 7, 8);
    const z = new Vec4(9, 10, 11, 12);
    const w = new Vec4(13, 14, 15, 16);

    expect(Mat4.fromCols(x, y, z, w)).toStrictEqual(
      Mat4.new(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
    );
  });

  test("cols Array", () => {
    const cols: Parameters<typeof Mat4.fromColsArray>[0] = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ];

    const m = Mat4.fromColsArray(cols);

    expect(m).toStrictEqual(Mat4.new(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16));
    expect(m.toColsArray()).toStrictEqual(cols);
  });

  test("inverse tiny entries", () => {
    const m = Mat4.fromDiagonal(new Vec4(MIN_POSITIVE / 8, 1, 1, 1));

    expect(m.tryInverse()).toBeUndefined();
    expect(m.inverseOrZero().toString()).toBe(Mat4.ZERO.toString());
  });

  test("inverse cofactor overflow", () => {
    const a = Math.sqrt(Number.MAX_VALUE) * 2;
    const m = Mat4.fromDiagonal(new Vec4(a, a, 1 / a, 1));

    expect(Number.isFinite(m.determinant())).toBeTrue();
    expect(Number.isFinite(1 / m.determinant())).toBeTrue();
    expect(m.tryInverse()).toBeUndefined();
    expect(m.inverseOrZero().toString()).toBe(Mat4.ZERO.toString());
  });

  test("const", () => {
    const m0 = Mat4.fromCols(
      new Vec4(1, 2, 3, 4),
      new Vec4(5, 6, 7, 8),
      new Vec4(9, 10, 11, 12),
      new Vec4(13, 14, 15, 16),
    );

    expect(m0.toColsArray()).toStrictEqual(ARRAY1X16);
    expect(Mat4.fromColsArray(ARRAY1X16).toColsArray()).toStrictEqual(ARRAY1X16);
    expect(Mat4.fromColsArray2d(ARRAY4X4).toColsArray()).toStrictEqual(ARRAY1X16);
  });

  test("identity", () => {
    const identity = Mat4.IDENTITY;

    const identity2d: [Array4, Array4, Array4, Array4] = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    expect(identity.toString()).toBe(
      Mat4.fromColsArray([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]).toString(),
    );

    expect(identity.toColsArray2d()).toStrictEqual(identity2d);
    expect(Mat4.fromColsArray2d(identity2d).toString()).toBe(identity.toString());
    expect(identity.toString()).toBe(identity.mul(identity).toString());
    expect(identity.toString()).toBe(Mat4.fromDiagonal(Vec4.ONE).toString());
  });

  test("zero", () => {
    expect(Mat4.ZERO.toString()).toBe(
      Mat4.fromColsArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).toString(),
    );
  });

  test("nan", () => {
    expect(Mat4.NAN.isNan()).toBeTrue();
    expect(Mat4.NAN.isFinite()).toBeFalse();
  });

  test("accessors", () => {
    const m = Mat4.ZERO;

    m.xAxis = new Vec4(1, 2, 3, 4);
    m.yAxis = new Vec4(5, 6, 7, 8);
    m.zAxis = new Vec4(9, 10, 11, 12);
    m.wAxis = new Vec4(13, 14, 15, 16);
    expect(Mat4.fromColsArray2d(ARRAY4X4).toString()).toBe(m.toString());
    expect(new Vec4(1, 2, 3, 4).toString()).toBe(m.col(0).toString());
    expect(new Vec4(5, 6, 7, 8).toString()).toBe(m.col(1).toString());
    expect(new Vec4(9, 10, 11, 12).toString()).toBe(m.col(2).toString());
    expect(new Vec4(13, 14, 15, 16).toString()).toBe(m.col(3).toString());
    expect(new Vec4(1, 5, 9, 13).toString()).toBe(m.row(0).toString());
    expect(new Vec4(2, 6, 10, 14).toString()).toBe(m.row(1).toString());
    expect(new Vec4(3, 7, 11, 15).toString()).toBe(m.row(2).toString());
    expect(new Vec4(4, 8, 12, 16).toString()).toBe(m.row(3).toString());

    for (let index = 0; index < 4; index += 1) {
      const col = m.colMut(index);
      const { x, y, z, w } = col;

      col.x = w;
      col.y = z;
      col.z = y;
      col.w = x;
    }

    expect(new Vec4(4, 3, 2, 1).toString()).toBe(m.col(0).toString());
    expect(new Vec4(8, 7, 6, 5).toString()).toBe(m.col(1).toString());
    expect(new Vec4(12, 11, 10, 9).toString()).toBe(m.col(2).toString());
    expect(new Vec4(16, 15, 14, 13).toString()).toBe(m.col(3).toString());
    expect(() => Mat4.ZERO.col(4)).toThrow(RangeError);
    expect(() => Mat4.ZERO.colMut(4)).toThrow(RangeError);
    expect(() => Mat4.ZERO.row(4)).toThrow(RangeError);
  });

  test("rows", () => {
    const rowMajor: Array16 = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16];
    const m = Mat4.fromColsArray(ARRAY1X16);

    expect(m.toRowsArray()).toStrictEqual(rowMajor);
    expect(m.toString()).toBe(Mat4.fromRowsArray(rowMajor).toString());
    expect(m.toString()).toBe(Mat4.fromRowsSlice(rowMajor).toString());
    expect(m.toString()).toBe(Mat4.fromRows(m.row(0), m.row(1), m.row(2), m.row(3)).toString());
    expect(m.toRowsArray()).toStrictEqual(m.transpose().toColsArray());

    expect(Mat4.fromRowsArray(ARRAY1X16).toString()).toBe(
      Mat4.fromColsArray(ARRAY1X16).transpose().toString(),
    );

    const m2 = Mat4.ZERO;

    for (let index = 0; index < 4; index += 1) {
      m2.setRow(index, m.row(index));
    }

    expect(m.toString()).toBe(m2.toString());

    expect(() => {
      Mat4.ZERO.setRow(4, Vec4.ZERO);
    }).toThrow(RangeError);

    expect(() => Mat4.fromRowsSlice(ZEROS15)).toThrow(RangeError);
  });

  test("from axes", () => {
    const a = Mat4.fromColsArray2d(ARRAY4X4);

    expect(a.toColsArray2d()).toStrictEqual(ARRAY4X4);

    const b = Mat4.fromCols(
      new Vec4(1, 2, 3, 4),
      new Vec4(5, 6, 7, 8),
      new Vec4(9, 10, 11, 12),
      new Vec4(13, 14, 15, 16),
    );

    expect(a.toString()).toBe(b.toString());

    expect(a.toString()).toBe(
      mat4(
        new Vec4(1, 2, 3, 4),
        new Vec4(5, 6, 7, 8),
        new Vec4(9, 10, 11, 12),
        new Vec4(13, 14, 15, 16),
      ).toString(),
    );

    expect(b.toString()).toBe(Mat4.fromColsArray(b.toColsArray()).toString());
  });

  test("translation", () => {
    expect(
      Mat4.fromCols(
        new Vec4(1, 0, 0, 0),
        new Vec4(0, 1, 0, 0),
        new Vec4(0, 0, 1, 0),
        new Vec4(1, 2, 3, 1),
      ).toString(),
    ).toBe(Mat4.fromTranslation(new Vec3(1, 2, 3)).toString());
  });

  test("from rotation", () => {
    expect(
      Mat4.fromRotationX(deg(180)).absDiffEq(Mat4.fromAxisAngle(Vec3.X, deg(180)), F32_EPSILON),
    ).toBeTrue();

    expect(
      Mat4.fromRotationY(deg(180)).absDiffEq(Mat4.fromAxisAngle(Vec3.Y, deg(180)), F32_EPSILON),
    ).toBeTrue();

    expect(
      Mat4.fromRotationZ(deg(180)).absDiffEq(Mat4.fromAxisAngle(Vec3.Z, deg(180)), F32_EPSILON),
    ).toBeTrue();

    expect(Mat4.IDENTITY.absDiffEq(Mat4.fromQuat(Quat.IDENTITY), F32_EPSILON)).toBeTrue();
  });

  test("from mat3", () => {
    const m3 = Mat3.fromColsArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    expect(
      Mat4.fromColsArray2d([
        [1, 2, 3, 0],
        [4, 5, 6, 0],
        [7, 8, 9, 0],
        [0, 0, 0, 1],
      ]).toString(),
    ).toBe(Mat4.fromMat3(m3).toString());

    expect(
      Mat4.fromColsArray2d([
        [1, 2, 3, 0],
        [4, 5, 6, 0],
        [7, 8, 9, 0],
        [10, 11, 12, 1],
      ]).toString(),
    ).toBe(Mat4.fromMat3Translation(m3, new Vec3(10, 11, 12)).toString());
  });

  test("diagonal", () => {
    expect(new Vec4(1, 6, 11, 16).toString()).toBe(
      Mat4.fromColsArray(ARRAY1X16).diagonal().toString(),
    );
  });

  test("mul vec4", () => {
    const m = Mat4.fromAxisAngle(Vec3.Z, deg(90));

    expect(Vec4.NEG_X.absDiffEq(m.mul(Vec4.Y), F32_EPSILON)).toBeTrue();
    expect(Vec4.NEG_X.absDiffEq(m.mulVec4(Vec4.Y), F32_EPSILON)).toBeTrue();
  });

  test("mul transpose vec4", () => {
    const v = new Vec4(1, 2, 3, 4);
    const m = Mat4.fromColsArray(ARRAY1X16);

    expect(m.transpose().mulVec4(v).toString()).toBe(m.mulTransposeVec4(v).toString());
  });

  test("mul diagonal", () => {
    const v = new Vec4(1, 2, 3, 4);

    expect(Mat4.IDENTITY.mul(Mat4.fromDiagonal(v)).toString()).toBe(
      Mat4.IDENTITY.mulDiagonalScale(v).toString(),
    );
  });

  test("transform3d", () => {
    let m = Mat4.fromAxisAngle(Vec3.Z, deg(90));
    let result3 = m.transformVector3(Vec3.Y);
    let result4 = m.mul(new Vec4(0, 1, 0, 0));

    expect(new Vec3(-1, 0, 0).absDiffEq(result3, F32_EPSILON)).toBeTrue();
    expect(result3.absDiffEq(new Vec3(result4.x, result4.y, result4.z), F32_EPSILON)).toBeTrue();
    expect(new Vec4(-1, 0, 0, 0).absDiffEq(m.mul(Vec4.Y), F32_EPSILON)).toBeTrue();

    m = Mat4.fromScaleRotationTranslation(
      new Vec3(0.5, 1.5, 2),
      Quat.fromRotationX(deg(90)),
      new Vec3(1, 2, 3),
    );

    result3 = m.transformVector3(Vec3.Y);
    result4 = m.mul(new Vec4(0, 1, 0, 0));
    expect(new Vec3(0, 0, 1.5).absDiffEq(result3, 1e-6)).toBeTrue();
    expect(result3.absDiffEq(new Vec3(result4.x, result4.y, result4.z), F32_EPSILON)).toBeTrue();
    result3 = m.transformPoint3(Vec3.Y);
    result4 = m.mul(new Vec4(0, 1, 0, 1));
    expect(new Vec3(1, 2, 4.5).absDiffEq(result3, 1e-6)).toBeTrue();
    expect(result3.absDiffEq(new Vec3(result4.x, result4.y, result4.z), F32_EPSILON)).toBeTrue();

    m = Mat4.fromCols(
      new Vec4(8, 0, 0, 0),
      new Vec4(0, 4, 0, 0),
      new Vec4(0, 0, 2, 2),
      new Vec4(0, 0, 0, 0),
    );

    expect(new Vec3(4, 2, 1).absDiffEq(m.projectPoint3(new Vec3(2, 2, 2)), F32_EPSILON)).toBeTrue();
  });

  test("from ypr", () => {
    const zero = deg(0);
    const yaw = deg(30);
    const pitch = deg(60);
    const roll = deg(90);
    const y0 = Mat4.fromRotationY(yaw);
    const x0 = Mat4.fromRotationX(pitch);
    const z0 = Mat4.fromRotationZ(roll);

    expect(y0.absDiffEq(Mat4.fromEuler(EulerRot.YXZ, yaw, zero, zero), F32_EPSILON)).toBeTrue();
    expect(x0.absDiffEq(Mat4.fromEuler(EulerRot.YXZ, zero, pitch, zero), F32_EPSILON)).toBeTrue();
    expect(z0.absDiffEq(Mat4.fromEuler(EulerRot.YXZ, zero, zero, roll), F32_EPSILON)).toBeTrue();
    expect(y0.mul(x0).absDiffEq(Mat4.fromEuler(EulerRot.YXZ, yaw, pitch, zero), 1e-6)).toBeTrue();

    expect(
      y0
        .mul(x0)
        .mul(z0)
        .absDiffEq(Mat4.fromEuler(EulerRot.YXZ, yaw, pitch, roll), 1e-6),
    ).toBeTrue();
  });

  test("from scale", () => {
    const m = Mat4.fromScale(new Vec3(2, 4, 8));

    expect(Vec4.X.mul(2).absDiffEq(m.xAxis, F32_EPSILON)).toBeTrue();
    expect(Vec4.Y.mul(4).absDiffEq(m.yAxis, F32_EPSILON)).toBeTrue();
    expect(Vec4.Z.mul(8).absDiffEq(m.zAxis, F32_EPSILON)).toBeTrue();
    expect(Vec4.W.absDiffEq(m.wAxis, F32_EPSILON)).toBeTrue();

    expect(
      m.transformPoint3(new Vec3(1, 1, 1)).absDiffEq(new Vec3(2, 4, 8), F32_EPSILON),
    ).toBeTrue();
  });

  test("transpose", () => {
    const mt = mat4(
      new Vec4(1, 2, 3, 4),
      new Vec4(5, 6, 7, 8),
      new Vec4(9, 10, 11, 12),
      new Vec4(13, 14, 15, 16),
    ).transpose();

    expect(new Vec4(1, 5, 9, 13).toString()).toBe(mt.xAxis.toString());
    expect(new Vec4(2, 6, 10, 14).toString()).toBe(mt.yAxis.toString());
    expect(new Vec4(3, 7, 11, 15).toString()).toBe(mt.zAxis.toString());
    expect(new Vec4(4, 8, 12, 16).toString()).toBe(mt.wAxis.toString());
  });

  test("det", () => {
    expect(Mat4.ZERO.determinant()).toBe(0);
    expect(Mat4.IDENTITY.determinant()).toBe(1);
    expect(Mat4.fromRotationX(deg(90)).determinant()).toBe(1);
    expect(Mat4.fromRotationY(deg(180)).determinant()).toBe(1);
    expect(Mat4.fromRotationZ(deg(270)).determinant()).toBe(1);
    expect(Mat4.fromScale(new Vec3(2, 2, 2)).determinant()).toBe(8);

    expect(
      mat4(
        new Vec4(0, 0, 0, 1),
        new Vec4(1, 0, 0, 0),
        new Vec4(0, 0, 1, 0),
        new Vec4(0, 1, 0, 0),
      ).determinant(),
    ).toBe(1);
  });

  test("inverse", () => {
    expect(Mat4.ZERO.tryInverse()).toBeUndefined();
    expect(Mat4.ZERO.toString()).toBe(Mat4.ZERO.inverseOrZero().toString());
    expect(Mat4.IDENTITY.tryInverse()?.toString()).toBe(Mat4.IDENTITY.toString());
    expect(Mat4.IDENTITY.toString()).toBe(Mat4.IDENTITY.inverseOrZero().toString());
    expect(Mat4.IDENTITY.toString()).toBe(Mat4.IDENTITY.inverse().toString());

    const rotz = Mat4.fromRotationZ(deg(90));
    const rotzInv = rotz.inverse();

    expect(rotz.tryInverse()).toBeDefined();
    expect(Mat4.IDENTITY.absDiffEq(rotz.mul(rotzInv), F32_EPSILON)).toBeTrue();
    expect(Mat4.IDENTITY.absDiffEq(rotzInv.mul(rotz), F32_EPSILON)).toBeTrue();

    const trans = Mat4.fromTranslation(new Vec3(1, 2, 3));
    const transInv = trans.inverse();

    expect(trans.tryInverse()).toBeDefined();
    expect(Mat4.IDENTITY.absDiffEq(trans.mul(transInv), F32_EPSILON)).toBeTrue();
    expect(Mat4.IDENTITY.absDiffEq(transInv.mul(trans), F32_EPSILON)).toBeTrue();

    const scale = Mat4.fromScale(new Vec3(4, 5, 6));
    const scaleInv = scale.inverse();

    expect(scale.tryInverse()).toBeDefined();
    expect(Mat4.IDENTITY.absDiffEq(scale.mul(scaleInv), F32_EPSILON)).toBeTrue();
    expect(Mat4.IDENTITY.absDiffEq(scaleInv.mul(scale), F32_EPSILON)).toBeTrue();

    let m = scale.mul(rotz).mul(trans);
    let mInv = m.inverse();

    expect(m.tryInverse()).toBeDefined();
    expect(Mat4.IDENTITY.absDiffEq(m.mul(mInv), 1e-5)).toBeTrue();
    expect(Mat4.IDENTITY.absDiffEq(mInv.mul(m), 1e-5)).toBeTrue();
    expect(mInv.absDiffEq(transInv.mul(rotzInv).mul(scaleInv), 1e-6)).toBeTrue();

    m = Mat4.fromCols(
      new Vec4(1, -0.3, 1, 1),
      new Vec4(0.5, 0.6, 0.7, 0.8),
      new Vec4(-0.9, -0.3, 0, 12),
      new Vec4(0.13, 0.14, 0.15, 0.16),
    );

    mInv = m.inverse();
    expect(Mat4.IDENTITY.absDiffEq(m.mul(mInv), 1e-5)).toBeTrue();
    expect(Mat4.IDENTITY.absDiffEq(mInv.mul(m), 1e-5)).toBeTrue();
  });

  test("decompose reflections", () => {
    for (const [scale, rotation, translation] of reflectionCases()) {
      const matrix = Mat4.fromScaleRotationTranslation(scale, rotation, translation);
      const [s, r, t] = matrix.toScaleRotationTranslation();
      const rebuilt = Mat4.fromScaleRotationTranslation(s, r, t);

      expect(signum(s.x)).toBe(signum(matrix.determinant()));
      expect(signum(s.x)).toBe(signum(scale.x * scale.y * scale.z));
      expect(s.y).toBeGreaterThan(0);
      expect(s.z).toBeGreaterThan(0);
      expect(r.isNormalized()).toBeTrue();
      expect(t.toArray()).toStrictEqual(translation.toArray());

      for (const [column, value] of scale.toArray().entries()) {
        const tolerance = 32 * Number.EPSILON * Math.abs(value);

        expect(rebuilt.col(column).absDiffEq(matrix.col(column), tolerance)).toBeTrue();
      }
    }
  });

  test("decompose small determinant", () => {
    const small = Math.cbrt(Number.MIN_VALUE);
    const scale = Vec3.splat(small);

    const matrices = Array.from({ length: 64 }, (_, i) =>
      Mat4.fromScaleRotationTranslation(
        scale,
        Quat.fromEuler(EulerRot.XYZ, i * 0.13, i * 0.29, i * 0.37),
        Vec3.ZERO,
      ),
    ).filter((matrix) => Mat3.fromMat4(matrix).determinant() !== 0);

    expect(matrices.length).toBeGreaterThan(0);

    for (const matrix of matrices) {
      const [s, r, t] = matrix.toScaleRotationTranslation();

      expect(s.absDiffEq(scale, 32 * Number.EPSILON * small)).toBeTrue();
      expect(r.isNormalized()).toBeTrue();
      expect(t.eq(Vec3.ZERO)).toBeTrue();
    }
  });

  test("decompose", () => {
    const [identityScale, identityRotation, identityTranslation] =
      Mat4.IDENTITY.toScaleRotationTranslation();

    const inTranslation = new Vec3(-2, 4, -0.125);
    const inRotation = Quat.fromEuler(EulerRot.YXZ, deg(-45), deg(180), deg(270));

    expect(identityScale.absDiffEq(Vec3.ONE, F32_EPSILON)).toBeTrue();
    expect(identityRotation.isNearIdentity()).toBeTrue();
    expect(identityTranslation.absDiffEq(Vec3.ZERO, F32_EPSILON)).toBeTrue();

    for (const [inScale, eps, expectedScale] of [
      [Vec3.ONE, 1e-6, Vec3.ONE],
      [new Vec3(1, 2, 4), 1e-5, new Vec3(1, 2, 4)],
      [new Vec3(-4, 1, 2), 1e-5, new Vec3(-4, 1, 2)],
      [new Vec3(4, -1, -2), 1e-6, new Vec3(4, 1, 2)],
    ] as const) {
      const inMat = Mat4.fromScaleRotationTranslation(inScale, inRotation, inTranslation);
      const [outScale, outRotation, outTranslation] = inMat.toScaleRotationTranslation();
      const rebuilt = Mat4.fromScaleRotationTranslation(outScale, outRotation, outTranslation);

      expect(outScale.absDiffEq(expectedScale, 1e-6)).toBeTrue();
      expect(outTranslation.absDiffEq(inTranslation, F32_EPSILON)).toBeTrue();
      expect(inMat.absDiffEq(rebuilt, eps)).toBeTrue();
    }
  });

  test("ops", () => {
    const m0 = Mat4.fromColsArray2d(ARRAY4X4);
    const m0x2 = Mat4.fromColsSlice(ARRAY1X16.map((value) => value * 2));
    const m0Neg = Mat4.fromColsSlice(ARRAY1X16.map((value) => -value));
    const m0Recip = Mat4.fromColsSlice(ARRAY1X16.map((value) => 1 / value));

    expect(m0x2.toString()).toBe(m0.mul(2).toString());
    expect(m0x2.toString()).toBe(m0.mulScalar(2).toString());
    expect(m0.toString()).toBe(m0x2.div(2).toString());
    expect(m0.toString()).toBe(m0x2.divScalar(2).toString());
    expect(m0Recip.toString()).toBe(m0.recip().toString());
    expect(m0x2.toString()).toBe(m0.addMat4(m0).toString());
    expect(m0x2.toString()).toBe(m0.add(m0).toString());
    expect(Mat4.ZERO.toString()).toBe(m0.subMat4(m0).toString());
    expect(Mat4.ZERO.toString()).toBe(m0.sub(m0).toString());
    expect(m0Neg.toString()).toBe(m0.neg().toString());
    expect(m0.absDiffEq(m0.mulMat4(Mat4.IDENTITY), F32_EPSILON)).toBeTrue();
    expect(m0.absDiffEq(m0.mul(Mat4.IDENTITY), F32_EPSILON)).toBeTrue();
    expect(m0.absDiffEq(Mat4.IDENTITY.mul(m0), F32_EPSILON)).toBeTrue();
    expect(m0x2.toString()).toBe(m0.clone().mulAssign(2).toString());
    expect(m0.toString()).toBe(m0x2.clone().divAssign(2).toString());
    expect(m0x2.toString()).toBe(m0.clone().addAssign(m0).toString());
    expect(Mat4.ZERO.toString()).toBe(m0.clone().subAssign(m0).toString());
    expect(m0.toString()).toBe(Mat4.IDENTITY.mulAssign(m0).toString());
    expect(m0.mul(m0).toString()).toBe(m0.clone().mulAssign(m0).toString());
    expect(m0.eq(m0.clone())).toBeTrue();
    expect(m0.ne(m0x2)).toBeTrue();
  });

  test("fmt", () => {
    expect(Mat4.fromColsArray2d(ARRAY4X4).toString()).toBe(
      "[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]",
    );
  });

  test("to from slice", () => {
    const m = Mat4.fromColsSlice(ARRAY1X16);

    expect(Mat4.fromColsArray(ARRAY1X16).toString()).toBe(m.toString());

    const out = Array.from({ length: 16 }, () => 0);

    m.writeColsToSlice(out);
    expect(out).toStrictEqual(ARRAY1X16);
    expect(() => Mat4.fromColsSlice(ZEROS15)).toThrow(RangeError);

    expect(() => {
      Mat4.IDENTITY.writeColsToSlice(ZEROS15);
    }).toThrow(RangeError);
  });

  test("is finite", () => {
    expect(Mat4.IDENTITY.isFinite()).toBeTrue();
    expect(Mat4.IDENTITY.mul(Number.POSITIVE_INFINITY).isFinite()).toBeFalse();
    expect(Mat4.IDENTITY.mul(Number.NEGATIVE_INFINITY).isFinite()).toBeFalse();
    expect(Mat4.IDENTITY.mul(Number.NaN).isFinite()).toBeFalse();
  });

  test("abs", () => {
    expect(Mat4.IDENTITY.mul(-1).abs().toString()).toBe(Mat4.IDENTITY.toString());

    expect(
      Mat4.fromColsArray2d([
        [1, -2, 3, -4],
        [-5, 6, -7, 8],
        [-9, 10, 11, -12],
        [13, -14, -15, 16],
      ])
        .abs()
        .toString(),
    ).toBe(Mat4.fromColsArray2d(ARRAY4X4).toString());
  });

  test("from rotation translation", () => {
    const rotation = Quat.fromRotationY(deg(90));
    const translation = new Vec3(1, 2, 3);
    const m = Mat4.fromRotationTranslation(rotation, translation);

    expect(
      m.absDiffEq(Mat4.fromTranslation(translation).mul(Mat4.fromQuat(rotation)), 1e-12),
    ).toBeTrue();

    expect(m.transformPoint3(Vec3.X).absDiffEq(new Vec3(1, 2, 2), 1e-12)).toBeTrue();
  });
});
