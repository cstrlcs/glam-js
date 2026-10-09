import { EulerRot, Mat2, Mat3, Mat4, Quat, Vec2, Vec3, mat3 } from "@";

type Array3x3 = [[number, number, number], [number, number, number], [number, number, number]];

const F32_EPSILON = 1.1920929e-7;
const MIN_POSITIVE = 2.2250738585072014e-308;

const ARRAY3X3: Array3x3 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const ARRAY1X9: [number, number, number, number, number, number, number, number, number] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
];

function minorOf(input: number[][], i: number, j: number) {
  return input.filter((_, x) => x !== i).map((column) => column.filter((_, y) => y !== j));
}

function deg(angle: number) {
  return (angle * Math.PI) / 180;
}

describe(Mat3, () => {
  test("new", () => {
    const m = Mat3.new(1, 2, 3, 4, 5, 6, 7, 8, 9);

    expect(m.xAxis).toStrictEqual(new Vec3(1, 2, 3));
    expect(m.yAxis).toStrictEqual(new Vec3(4, 5, 6));
    expect(m.zAxis).toStrictEqual(new Vec3(7, 8, 9));
  });

  test("constants", () => {
    expect(Mat3.ZERO).toStrictEqual(Mat3.new(0, 0, 0, 0, 0, 0, 0, 0, 0));
    expect(Mat3.IDENTITY).toStrictEqual(Mat3.new(1, 0, 0, 0, 1, 0, 0, 0, 1));

    expect(Mat3.NAN).toStrictEqual(
      Mat3.new(
        Number.NaN,
        Number.NaN,
        Number.NaN,
        Number.NaN,
        Number.NaN,
        Number.NaN,
        Number.NaN,
        Number.NaN,
        Number.NaN,
      ),
    );
  });

  test("constants Are Fresh Instances", () => {
    const m = Mat3.IDENTITY;

    m.xAxis.x = 5;
    expect(Mat3.IDENTITY.xAxis.x).toBe(1);
    expect(Mat3.IDENTITY).not.toBe(Mat3.IDENTITY);
  });

  test("from Cols", () => {
    const x = new Vec3(1, 2, 3);
    const y = new Vec3(4, 5, 6);
    const z = new Vec3(7, 8, 9);

    expect(Mat3.fromCols(x, y, z)).toStrictEqual(Mat3.new(1, 2, 3, 4, 5, 6, 7, 8, 9));
  });

  test("cols Array", () => {
    const cols: Parameters<typeof Mat3.fromColsArray>[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const m = Mat3.fromColsArray(cols);

    expect(m).toStrictEqual(Mat3.new(1, 2, 3, 4, 5, 6, 7, 8, 9));
    expect(m.toColsArray()).toStrictEqual(cols);
  });

  test("inverse tiny entries", () => {
    const m = Mat3.fromDiagonal(new Vec3(MIN_POSITIVE / 8, 1, 1));

    expect(m.tryInverse()).toBeUndefined();
    expect(m.inverseOrZero().toString()).toBe(Mat3.ZERO.toString());
  });

  test("inverse cofactor overflow", () => {
    const a = Math.sqrt(Number.MAX_VALUE) * 2;
    const m = Mat3.fromDiagonal(new Vec3(a, a, 1 / a));

    expect(Number.isFinite(m.determinant())).toBeTrue();
    expect(Number.isFinite(1 / m.determinant())).toBeTrue();
    expect(m.tryInverse()).toBeUndefined();
    expect(m.inverseOrZero().toString()).toBe(Mat3.ZERO.toString());
  });

  test("const", () => {
    const m0 = Mat3.fromCols(new Vec3(1, 2, 3), new Vec3(4, 5, 6), new Vec3(7, 8, 9));

    expect(m0.toColsArray()).toStrictEqual(ARRAY1X9);
    expect(Mat3.fromColsArray(ARRAY1X9).toColsArray()).toStrictEqual(ARRAY1X9);
    expect(Mat3.fromColsArray2d(ARRAY3X3).toColsArray()).toStrictEqual(ARRAY1X9);
  });

  test("identity", () => {
    const identity = Mat3.IDENTITY;

    const identity2d: Array3x3 = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];

    expect(identity.toString()).toBe(Mat3.fromColsArray([1, 0, 0, 0, 1, 0, 0, 0, 1]).toString());
    expect(identity.toColsArray2d()).toStrictEqual(identity2d);
    expect(Mat3.fromColsArray2d(identity2d).toString()).toBe(identity.toString());
    expect(identity.toString()).toBe(identity.mul(identity).toString());
    expect(identity.toString()).toBe(Mat3.fromDiagonal(Vec3.ONE).toString());
  });

  test("zero", () => {
    expect(Mat3.ZERO.toString()).toBe(Mat3.fromColsArray([0, 0, 0, 0, 0, 0, 0, 0, 0]).toString());
  });

  test("nan", () => {
    expect(Mat3.NAN.isNan()).toBeTrue();
    expect(Mat3.NAN.isFinite()).toBeFalse();
  });

  test("accessors", () => {
    const m = Mat3.ZERO;

    m.xAxis = new Vec3(1, 2, 3);
    m.yAxis = new Vec3(4, 5, 6);
    m.zAxis = new Vec3(7, 8, 9);
    expect(Mat3.fromColsArray2d(ARRAY3X3).toString()).toBe(m.toString());
    expect(new Vec3(1, 2, 3).toString()).toBe(m.col(0).toString());
    expect(new Vec3(4, 5, 6).toString()).toBe(m.col(1).toString());
    expect(new Vec3(7, 8, 9).toString()).toBe(m.col(2).toString());
    expect(new Vec3(1, 4, 7).toString()).toBe(m.row(0).toString());
    expect(new Vec3(2, 5, 8).toString()).toBe(m.row(1).toString());
    expect(new Vec3(3, 6, 9).toString()).toBe(m.row(2).toString());

    for (let index = 0; index < 3; index += 1) {
      const col = m.colMut(index);
      const { x, z } = col;

      col.x = z;
      col.z = x;
    }

    expect(new Vec3(3, 2, 1).toString()).toBe(m.col(0).toString());
    expect(new Vec3(6, 5, 4).toString()).toBe(m.col(1).toString());
    expect(new Vec3(9, 8, 7).toString()).toBe(m.col(2).toString());
    expect(() => Mat3.ZERO.col(3)).toThrow(RangeError);
    expect(() => Mat3.ZERO.colMut(3)).toThrow(RangeError);
    expect(() => Mat3.ZERO.row(3)).toThrow(RangeError);
  });

  test("rows", () => {
    const rowMajor: typeof ARRAY1X9 = [1, 4, 7, 2, 5, 8, 3, 6, 9];
    const m = Mat3.fromColsArray(ARRAY1X9);

    expect(m.toRowsArray()).toStrictEqual(rowMajor);
    expect(m.toString()).toBe(Mat3.fromRowsArray(rowMajor).toString());
    expect(m.toString()).toBe(Mat3.fromRowsSlice(rowMajor).toString());
    expect(m.toString()).toBe(Mat3.fromRows(m.row(0), m.row(1), m.row(2)).toString());
    expect(m.toRowsArray()).toStrictEqual(m.transpose().toColsArray());

    expect(Mat3.fromRowsArray(ARRAY1X9).toString()).toBe(
      Mat3.fromColsArray(ARRAY1X9).transpose().toString(),
    );

    const m2 = Mat3.ZERO;

    m2.setRow(0, m.row(0));
    m2.setRow(1, m.row(1));
    m2.setRow(2, m.row(2));
    expect(m.toString()).toBe(m2.toString());

    const m0 = Mat3.fromRows(new Vec3(1, 4, 7), new Vec3(2, 5, 8), new Vec3(3, 6, 9));

    expect(m0.toColsArray()).toStrictEqual(ARRAY1X9);
    expect(m0.toRowsArray()).toStrictEqual(rowMajor);

    expect(() => {
      Mat3.ZERO.setRow(3, Vec3.ZERO);
    }).toThrow(RangeError);

    expect(() => Mat3.fromRowsSlice([0, 0, 0, 0, 0, 0, 0, 0])).toThrow(RangeError);
  });

  test("from axes", () => {
    const a = Mat3.fromColsArray2d(ARRAY3X3);

    expect(a.toColsArray2d()).toStrictEqual(ARRAY3X3);

    const b = Mat3.fromCols(new Vec3(1, 2, 3), new Vec3(4, 5, 6), new Vec3(7, 8, 9));

    expect(a.toString()).toBe(b.toString());

    expect(a.toString()).toBe(
      mat3(new Vec3(1, 2, 3), new Vec3(4, 5, 6), new Vec3(7, 8, 9)).toString(),
    );

    expect(b.toString()).toBe(Mat3.fromColsArray(b.toColsArray()).toString());
  });

  test("from rotation", () => {
    const rotX1 = Mat3.fromRotationX(deg(180));

    expect(rotX1.absDiffEq(Mat3.fromAxisAngle(Vec3.X, deg(180)), F32_EPSILON)).toBeTrue();

    const rotX3 = Mat3.fromQuat(Quat.fromRotationX(deg(180)));

    expect(rotX1.absDiffEq(rotX3, F32_EPSILON)).toBeTrue();

    const rotY1 = Mat3.fromRotationY(deg(180));

    expect(rotY1.absDiffEq(Mat3.fromAxisAngle(Vec3.Y, deg(180)), F32_EPSILON)).toBeTrue();

    const rotY3 = Mat3.fromQuat(Quat.fromRotationY(deg(180)));

    expect(rotY1.absDiffEq(rotY3, F32_EPSILON)).toBeTrue();

    const rotZ1 = Mat3.fromRotationZ(deg(180));

    expect(rotZ1.absDiffEq(Mat3.fromAxisAngle(Vec3.Z, deg(180)), F32_EPSILON)).toBeTrue();

    const rotZ3 = Mat3.fromQuat(Quat.fromRotationZ(deg(180)));

    expect(rotZ1.absDiffEq(rotZ3, F32_EPSILON)).toBeTrue();
  });

  test("diagonal", () => {
    expect(new Vec3(1, 5, 9).toString()).toBe(Mat3.fromColsArray(ARRAY1X9).diagonal().toString());
  });

  test("mul vec3", () => {
    const m = Mat3.fromAxisAngle(Vec3.Z, deg(90));

    expect(Vec3.NEG_X.absDiffEq(m.mul(Vec3.Y), F32_EPSILON)).toBeTrue();
    expect(Vec3.NEG_X.absDiffEq(m.mulVec3(Vec3.Y), F32_EPSILON)).toBeTrue();
  });

  test("mul transpose vec3", () => {
    const v = new Vec3(1, 2, 3);
    const m = Mat3.fromColsArray(ARRAY1X9);

    expect(m.transpose().mulVec3(v).toString()).toBe(m.mulTransposeVec3(v).toString());
  });

  test("mul diagonal", () => {
    const v = new Vec3(1, 2, 3);

    expect(Mat3.IDENTITY.mul(Mat3.fromDiagonal(v)).toString()).toBe(
      Mat3.IDENTITY.mulDiagonalScale(v).toString(),
    );
  });

  test("transform2d", () => {
    let m = Mat3.fromTranslation(new Vec2(2, 4));

    expect(Vec2.ZERO.toString()).toBe(m.transformVector2(Vec2.ZERO).toString());
    expect(new Vec2(2, 4).toString()).toBe(m.transformPoint2(Vec2.ZERO).toString());
    expect(Vec2.ZERO.toString()).toBe(m.transformPoint2(new Vec2(-2, -4)).toString());
    m = Mat3.fromAngle(deg(90));
    expect(Vec2.Y.absDiffEq(m.transformVector2(Vec2.X), 1e-7)).toBeTrue();
    expect(Vec2.Y.absDiffEq(m.transformPoint2(Vec2.X), 1e-7)).toBeTrue();
    m = Mat3.fromScale(new Vec2(2, 4));
    expect(new Vec2(2, 0).toString()).toBe(m.transformVector2(Vec2.X).toString());
    expect(new Vec2(0, 4).toString()).toBe(m.transformVector2(Vec2.Y).toString());
    expect(new Vec2(2, 0).toString()).toBe(m.transformPoint2(Vec2.X).toString());
    expect(new Vec2(0, 4).toString()).toBe(m.transformPoint2(Vec2.Y).toString());
    m = Mat3.fromScaleAngleTranslation(new Vec2(0.5, 1.5), deg(90), new Vec2(1, 2));

    let result2 = m.transformVector2(Vec2.Y);
    let result3 = m.mul(new Vec3(0, 1, 0));

    expect(new Vec2(-1.5, 0).absDiffEq(result2, 1e-6)).toBeTrue();
    expect(result2.absDiffEq(new Vec2(result3.x, result3.y), F32_EPSILON)).toBeTrue();
    result2 = m.transformPoint2(Vec2.Y);
    result3 = m.mul(new Vec3(0, 1, 1));
    expect(new Vec2(-0.5, 2).absDiffEq(result2, 1e-6)).toBeTrue();
    expect(result2.absDiffEq(new Vec2(result3.x, result3.y), F32_EPSILON)).toBeTrue();
  });

  test("from ypr", () => {
    const zero = deg(0);
    const yaw = deg(30);
    const pitch = deg(60);
    const roll = deg(90);
    const y0 = Mat3.fromRotationY(yaw);
    const x0 = Mat3.fromRotationX(pitch);
    const z0 = Mat3.fromRotationZ(roll);

    expect(y0.absDiffEq(Mat3.fromEuler(EulerRot.YXZ, yaw, zero, zero), F32_EPSILON)).toBeTrue();
    expect(x0.absDiffEq(Mat3.fromEuler(EulerRot.YXZ, zero, pitch, zero), F32_EPSILON)).toBeTrue();
    expect(z0.absDiffEq(Mat3.fromEuler(EulerRot.YXZ, zero, zero, roll), F32_EPSILON)).toBeTrue();
    expect(y0.mul(x0).absDiffEq(Mat3.fromEuler(EulerRot.YXZ, yaw, pitch, zero), 1e-6)).toBeTrue();

    expect(
      y0
        .mul(x0)
        .mul(z0)
        .absDiffEq(Mat3.fromEuler(EulerRot.YXZ, yaw, pitch, roll), 1e-6),
    ).toBeTrue();
  });

  test("from diagonal", () => {
    const m = Mat3.fromDiagonal(new Vec3(2, 4, 8));

    expect(m.mul(new Vec3(1, 1, 1)).absDiffEq(new Vec3(2, 4, 8), F32_EPSILON)).toBeTrue();
    expect(new Vec3(2, 0, 0).absDiffEq(m.xAxis, F32_EPSILON)).toBeTrue();
    expect(new Vec3(0, 4, 0).absDiffEq(m.yAxis, F32_EPSILON)).toBeTrue();
    expect(new Vec3(0, 0, 8).absDiffEq(m.zAxis, F32_EPSILON)).toBeTrue();
  });

  test("from mat2", () => {
    const m2 = Mat2.fromColsArray2d([
      [1, 2],
      [3, 4],
    ]);

    expect(
      Mat3.fromColsArray2d([
        [1, 2, 0],
        [3, 4, 0],
        [0, 0, 1],
      ]).toString(),
    ).toBe(Mat3.fromMat2(m2).toString());
  });

  test("from mat4", () => {
    const m4 = Mat4.fromColsArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

    expect(
      Mat3.fromColsArray2d([
        [1, 2, 3],
        [5, 6, 7],
        [9, 10, 11],
      ]).toString(),
    ).toBe(Mat3.fromMat4(m4).toString());
  });

  test("from mat4 minor", () => {
    const m4 = Mat4.fromColsArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const input = m4.toColsArray2d();

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const expected = minorOf(input, i, j);
        const minor: number[][] = Mat3.fromMat4Minor(m4, i, j).toColsArray2d();

        expect(minor).toStrictEqual(expected);
      }
    }

    expect(() => Mat3.fromMat4Minor(m4, 4, 0)).toThrow(RangeError);
    expect(() => Mat3.fromMat4Minor(m4, 0, 4)).toThrow(RangeError);
  });

  test("transpose", () => {
    const mt = mat3(new Vec3(1, 2, 3), new Vec3(4, 5, 6), new Vec3(7, 8, 9)).transpose();

    expect(new Vec3(1, 4, 7).toString()).toBe(mt.xAxis.toString());
    expect(new Vec3(2, 5, 8).toString()).toBe(mt.yAxis.toString());
    expect(new Vec3(3, 6, 9).toString()).toBe(mt.zAxis.toString());
  });

  test("det", () => {
    expect(Mat3.ZERO.determinant()).toBe(0);
    expect(Mat3.IDENTITY.determinant()).toBe(1);
    expect(Mat3.fromRotationX(deg(90)).determinant()).toBe(1);
    expect(Mat3.fromRotationY(deg(180)).determinant()).toBe(1);
    expect(Mat3.fromRotationZ(deg(270)).determinant()).toBe(1);
    expect(Mat3.fromDiagonal(new Vec3(2, 2, 2)).determinant()).toBe(8);
  });

  test("inverse", () => {
    expect(Mat3.ZERO.tryInverse()).toBeUndefined();
    expect(Mat3.ZERO.toString()).toBe(Mat3.ZERO.inverseOrZero().toString());
    expect(Mat3.IDENTITY.tryInverse()?.toString()).toBe(Mat3.IDENTITY.toString());
    expect(Mat3.IDENTITY.toString()).toBe(Mat3.IDENTITY.inverseOrZero().toString());
    expect(Mat3.IDENTITY.toString()).toBe(Mat3.IDENTITY.inverse().toString());

    const rotz = Mat3.fromRotationZ(deg(90));

    expect(rotz.tryInverse()).toBeDefined();

    const rotzInv = rotz.inverse();

    expect(Mat3.IDENTITY.absDiffEq(rotz.mul(rotzInv), F32_EPSILON)).toBeTrue();
    expect(Mat3.IDENTITY.absDiffEq(rotzInv.mul(rotz), F32_EPSILON)).toBeTrue();

    const scale = Mat3.fromDiagonal(new Vec3(4, 5, 6));

    expect(scale.tryInverse()).toBeDefined();

    const scaleInv = scale.inverse();

    expect(Mat3.IDENTITY.absDiffEq(scale.mul(scaleInv), F32_EPSILON)).toBeTrue();
    expect(Mat3.IDENTITY.absDiffEq(scaleInv.mul(scale), F32_EPSILON)).toBeTrue();

    const m = scale.mul(rotz);

    expect(m.tryInverse()).toBeDefined();

    const mInv = m.inverse();

    expect(Mat3.IDENTITY.absDiffEq(m.mul(mInv), F32_EPSILON)).toBeTrue();
    expect(Mat3.IDENTITY.absDiffEq(mInv.mul(m), F32_EPSILON)).toBeTrue();
    expect(mInv.absDiffEq(rotzInv.mul(scaleInv), F32_EPSILON)).toBeTrue();
  });

  test("ops", () => {
    const m0 = Mat3.fromColsArray2d(ARRAY3X3);

    const m0x2 = Mat3.fromColsArray2d([
      [2, 4, 6],
      [8, 10, 12],
      [14, 16, 18],
    ]);

    const m0Neg = Mat3.fromColsArray2d([
      [-1, -2, -3],
      [-4, -5, -6],
      [-7, -8, -9],
    ]);

    const m0Recip = Mat3.fromColsArray2d([
      [1 / 1, 1 / 2, 1 / 3],
      [1 / 4, 1 / 5, 1 / 6],
      [1 / 7, 1 / 8, 1 / 9],
    ]);

    expect(m0x2.toString()).toBe(m0.mul(2).toString());
    expect(m0x2.toString()).toBe(m0.mulScalar(2).toString());
    expect(m0.toString()).toBe(m0x2.div(2).toString());
    expect(m0.toString()).toBe(m0x2.divScalar(2).toString());
    expect(m0Recip.toString()).toBe(m0.recip().toString());
    expect(m0x2.toString()).toBe(m0.addMat3(m0).toString());
    expect(m0x2.toString()).toBe(m0.add(m0).toString());
    expect(Mat3.ZERO.toString()).toBe(m0.subMat3(m0).toString());
    expect(Mat3.ZERO.toString()).toBe(m0.sub(m0).toString());
    expect(m0Neg.toString()).toBe(m0.neg().toString());
    expect(m0.absDiffEq(m0.mulMat3(Mat3.IDENTITY), F32_EPSILON)).toBeTrue();
    expect(m0.absDiffEq(m0.mul(Mat3.IDENTITY), F32_EPSILON)).toBeTrue();
    expect(m0.absDiffEq(Mat3.IDENTITY.mul(m0), F32_EPSILON)).toBeTrue();
    expect(m0x2.toString()).toBe(m0.clone().mulAssign(2).toString());
    expect(m0.toString()).toBe(m0x2.clone().divAssign(2).toString());
    expect(m0x2.toString()).toBe(m0.clone().addAssign(m0).toString());
    expect(Mat3.ZERO.toString()).toBe(m0.clone().subAssign(m0).toString());
    expect(m0.toString()).toBe(Mat3.IDENTITY.mulAssign(m0).toString());
    expect(m0.mul(m0).toString()).toBe(m0.clone().mulAssign(m0).toString());
    expect(m0.eq(m0.clone())).toBeTrue();
    expect(m0.ne(m0x2)).toBeTrue();
  });

  test("abs", () => {
    const a = Mat3.fromColsArray2d(ARRAY3X3);

    expect(a.toString()).toBe(a.neg().abs().toString());
  });

  test("fmt", () => {
    expect(Mat3.fromColsArray2d(ARRAY3X3).toString()).toBe("[[1, 2, 3], [4, 5, 6], [7, 8, 9]]");
  });

  test("to from slice", () => {
    const m = Mat3.fromColsSlice(ARRAY1X9);

    expect(Mat3.fromColsArray(ARRAY1X9).toString()).toBe(m.toString());

    const out = new Float64Array(9);

    m.writeColsToSlice(out);
    expect([...out]).toStrictEqual(ARRAY1X9);
    expect(() => Mat3.fromColsSlice([0, 0, 0, 0, 0, 0, 0, 0])).toThrow(RangeError);

    expect(() => {
      Mat3.IDENTITY.writeColsToSlice(new Float64Array(8));
    }).toThrow(RangeError);
  });

  test("is finite", () => {
    expect(Mat3.IDENTITY.isFinite()).toBeTrue();
    expect(Mat3.IDENTITY.mul(Number.POSITIVE_INFINITY).isFinite()).toBeFalse();
    expect(Mat3.IDENTITY.mul(Number.NEGATIVE_INFINITY).isFinite()).toBeFalse();
    expect(Mat3.IDENTITY.mul(Number.NaN).isFinite()).toBeFalse();
  });
});
