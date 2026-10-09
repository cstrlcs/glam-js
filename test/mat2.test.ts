import { Mat2, Mat3, Vec2, mat2 } from "@";

const F32_EPSILON = 1.1920929e-7;
const MIN_POSITIVE = 2.2250738585072014e-308;

const ARRAY2X2: [[number, number], [number, number]] = [
  [1, 2],
  [3, 4],
];

const ARRAY1X4: [number, number, number, number] = [1, 2, 3, 4];

function minorOf(input: number[][], i: number, j: number) {
  return input.filter((_, x) => x !== i).map((column) => column.filter((_, y) => y !== j));
}

function deg(angle: number) {
  return (angle * Math.PI) / 180;
}

describe(Mat2, () => {
  test("new", () => {
    const m = Mat2.new(1, 2, 3, 4);

    expect(m.xAxis).toStrictEqual(new Vec2(1, 2));
    expect(m.yAxis).toStrictEqual(new Vec2(3, 4));
  });

  test("constants", () => {
    expect(Mat2.ZERO).toStrictEqual(Mat2.new(0, 0, 0, 0));
    expect(Mat2.IDENTITY).toStrictEqual(Mat2.new(1, 0, 0, 1));
    expect(Mat2.NAN).toStrictEqual(Mat2.new(Number.NaN, Number.NaN, Number.NaN, Number.NaN));
  });

  test("constants Are Fresh Instances", () => {
    const m = Mat2.IDENTITY;

    m.xAxis.x = 5;
    expect(Mat2.IDENTITY.xAxis.x).toBe(1);
    expect(Mat2.IDENTITY).not.toBe(Mat2.IDENTITY);
  });

  test("from Cols", () => {
    const x = new Vec2(1, 2);
    const y = new Vec2(3, 4);

    expect(Mat2.fromCols(x, y)).toStrictEqual(Mat2.new(1, 2, 3, 4));
  });

  test("cols Array", () => {
    const cols: Parameters<typeof Mat2.fromColsArray>[0] = [1, 2, 3, 4];
    const m = Mat2.fromColsArray(cols);

    expect(m).toStrictEqual(Mat2.new(1, 2, 3, 4));
    expect(m.toColsArray()).toStrictEqual(cols);
  });

  test("inverse tiny entries", () => {
    const m = Mat2.fromDiagonal(new Vec2(MIN_POSITIVE / 8, 1));

    expect(m.tryInverse()).toBeUndefined();
    expect(m.inverseOrZero().toString()).toBe(Mat2.ZERO.toString());
  });

  test("const", () => {
    const m0 = Mat2.fromCols(new Vec2(1, 2), new Vec2(3, 4));
    const m1 = Mat2.fromColsArray(ARRAY1X4);
    const m2 = Mat2.fromColsArray2d(ARRAY2X2);

    expect(m0.toColsArray()).toStrictEqual(ARRAY1X4);
    expect(m1.toColsArray()).toStrictEqual(ARRAY1X4);
    expect(m2.toColsArray()).toStrictEqual(ARRAY1X4);
  });

  test("identity", () => {
    const identity = Mat2.IDENTITY;

    expect(identity.toString()).toBe(Mat2.fromColsArray([1, 0, 0, 1]).toString());

    expect(identity.toColsArray2d()).toStrictEqual([
      [1, 0],
      [0, 1],
    ]);

    expect(
      Mat2.fromColsArray2d([
        [1, 0],
        [0, 1],
      ]).toString(),
    ).toBe(identity.toString());

    expect(identity.toString()).toBe(identity.mul(identity).toString());
    expect(identity.toString()).toBe(Mat2.fromDiagonal(Vec2.ONE).toString());
  });

  test("zero", () => {
    expect(Mat2.ZERO.toString()).toBe(Mat2.fromColsArray([0, 0, 0, 0]).toString());
  });

  test("nan", () => {
    expect(Mat2.NAN.isNan()).toBeTrue();
    expect(Mat2.NAN.isFinite()).toBeFalse();
  });

  test("accessors", () => {
    const m = Mat2.ZERO;

    m.xAxis = new Vec2(1, 2);
    m.yAxis = new Vec2(3, 4);
    expect(Mat2.fromColsArray2d(ARRAY2X2).toString()).toBe(m.toString());
    expect(new Vec2(1, 2).toString()).toBe(m.col(0).toString());
    expect(new Vec2(3, 4).toString()).toBe(m.col(1).toString());
    expect(new Vec2(1, 3).toString()).toBe(m.row(0).toString());
    expect(new Vec2(2, 4).toString()).toBe(m.row(1).toString());

    const col = m.colMut(0);

    col.x = 2;
    col.y = 1;
    m.colMut(1).x = 4;
    m.colMut(1).y = 3;
    expect(new Vec2(2, 1).toString()).toBe(m.col(0).toString());
    expect(new Vec2(4, 3).toString()).toBe(m.col(1).toString());

    const copy = m.col(0);

    copy.x = 100;
    expect(m.xAxis.x).toBe(2);
    expect(() => Mat2.ZERO.col(2)).toThrow(RangeError);
    expect(() => Mat2.ZERO.colMut(2)).toThrow(RangeError);
    expect(() => Mat2.ZERO.row(2)).toThrow(RangeError);
  });

  test("rows", () => {
    const rowMajor: [number, number, number, number] = [1, 3, 2, 4];
    const m = Mat2.fromColsArray(ARRAY1X4);

    expect(m.toRowsArray()).toStrictEqual(rowMajor);
    expect(m.toString()).toBe(Mat2.fromRowsArray(rowMajor).toString());
    expect(m.toString()).toBe(Mat2.fromRowsSlice(rowMajor).toString());
    expect(m.toString()).toBe(Mat2.fromRows(m.row(0), m.row(1)).toString());
    expect(m.toRowsArray()).toStrictEqual(m.transpose().toColsArray());

    expect(Mat2.fromRowsArray(ARRAY1X4).toString()).toBe(
      Mat2.fromColsArray(ARRAY1X4).transpose().toString(),
    );

    const m2 = Mat2.ZERO;

    m2.setRow(0, m.row(0));
    m2.setRow(1, m.row(1));
    expect(m.toString()).toBe(m2.toString());
    expect(Mat2.fromRows(new Vec2(1, 3), new Vec2(2, 4)).toColsArray()).toStrictEqual(ARRAY1X4);

    expect(() => {
      Mat2.ZERO.setRow(2, Vec2.ZERO);
    }).toThrow(RangeError);

    expect(() => Mat2.fromRowsSlice([0, 0, 0])).toThrow(RangeError);
  });

  test("from axes", () => {
    const a = Mat2.fromColsArray2d(ARRAY2X2);

    expect(a.toColsArray2d()).toStrictEqual(ARRAY2X2);

    const b = Mat2.fromCols(new Vec2(1, 2), new Vec2(3, 4));

    expect(a.toString()).toBe(b.toString());
    expect(a.toString()).toBe(mat2(new Vec2(1, 2), new Vec2(3, 4)).toString());
    expect(b.toString()).toBe(Mat2.fromColsArray(b.toColsArray()).toString());
  });

  test("diagonal", () => {
    expect(new Vec2(1, 4).toString()).toBe(Mat2.fromColsArray(ARRAY1X4).diagonal().toString());
  });

  test("mul", () => {
    const matA = Mat2.fromAngle(deg(90));

    expect(new Vec2(-1, 0).absDiffEq(matA.mul(Vec2.Y), F32_EPSILON)).toBeTrue();
    expect(new Vec2(0, 1).absDiffEq(matA.mul(Vec2.X), F32_EPSILON)).toBeTrue();
  });

  test("mul vec2", () => {
    const m = Mat2.fromAngle(deg(90));

    expect(Vec2.NEG_X.absDiffEq(m.mul(Vec2.Y), F32_EPSILON)).toBeTrue();
    expect(Vec2.NEG_X.absDiffEq(m.mulVec2(Vec2.Y), F32_EPSILON)).toBeTrue();
  });

  test("mul transpose vec2", () => {
    const v = new Vec2(1, 2);
    const m = Mat2.fromColsArray(ARRAY1X4);

    expect(m.transpose().mulVec2(v).toString()).toBe(m.mulTransposeVec2(v).toString());
  });

  test("mul diagonal", () => {
    const v = new Vec2(1, 2);

    expect(Mat2.IDENTITY.mul(Mat2.fromDiagonal(v)).toString()).toBe(
      Mat2.IDENTITY.mulDiagonalScale(v).toString(),
    );
  });

  test("from scale angle", () => {
    const rot = Mat2.fromScaleAngle(new Vec2(4, 2), deg(180));

    expect(Vec2.X.mul(-4).absDiffEq(rot.mul(Vec2.X), 1e-6)).toBeTrue();
    expect(Vec2.Y.mul(-2).absDiffEq(rot.mul(Vec2.Y), 1e-6)).toBeTrue();
  });

  test("from diagonal", () => {
    const m = Mat2.fromDiagonal(new Vec2(2, 4));

    expect(
      Mat2.fromColsArray2d([
        [2, 0],
        [0, 4],
      ]).toString(),
    ).toBe(m.toString());

    expect(m.mul(new Vec2(1, 1)).absDiffEq(new Vec2(2, 4), F32_EPSILON)).toBeTrue();
    expect(Vec2.X.mul(2).absDiffEq(m.xAxis, F32_EPSILON)).toBeTrue();
    expect(Vec2.Y.mul(4).absDiffEq(m.yAxis, F32_EPSILON)).toBeTrue();
  });

  test("from mat3", () => {
    const m3 = Mat3.fromColsArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    expect(
      Mat2.fromColsArray2d([
        [1, 2],
        [4, 5],
      ]).toString(),
    ).toBe(Mat2.fromMat3(m3).toString());
  });

  test("from mat3 minor", () => {
    const m3 = Mat3.fromColsArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const input = m3.toColsArray2d();

    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        const minor: number[][] = Mat2.fromMat3Minor(m3, i, j).toColsArray2d();
        const expected = minorOf(input, i, j);

        expect(minor).toStrictEqual(expected);
      }
    }

    expect(() => Mat2.fromMat3Minor(m3, 3, 0)).toThrow(RangeError);
    expect(() => Mat2.fromMat3Minor(m3, 0, 3)).toThrow(RangeError);
  });

  test("transpose", () => {
    const mt = mat2(new Vec2(1, 2), new Vec2(3, 4)).transpose();

    expect(new Vec2(1, 3).toString()).toBe(mt.xAxis.toString());
    expect(new Vec2(2, 4).toString()).toBe(mt.yAxis.toString());
  });

  test("det", () => {
    expect(Mat2.ZERO.determinant()).toBe(0);
    expect(Mat2.IDENTITY.determinant()).toBe(1);
    expect(Mat2.fromAngle(deg(90)).determinant()).toBe(1);
    expect(Mat2.fromAngle(deg(180)).determinant()).toBe(1);
    expect(Mat2.fromAngle(deg(270)).determinant()).toBe(1);
    expect(Mat2.fromDiagonal(new Vec2(2, 2)).determinant()).toBe(4);
    expect(Mat2.fromColsArray(ARRAY1X4).determinant()).toBe(1 * 4 - 2 * 3);
  });

  test("inverse", () => {
    expect(Mat2.ZERO.tryInverse()).toBeUndefined();
    expect(Mat2.ZERO.toString()).toBe(Mat2.ZERO.inverseOrZero().toString());
    expect(Mat2.IDENTITY.tryInverse()?.toString()).toBe(Mat2.IDENTITY.toString());
    expect(Mat2.IDENTITY.toString()).toBe(Mat2.IDENTITY.inverseOrZero().toString());
    expect(Mat2.IDENTITY.toString()).toBe(Mat2.IDENTITY.inverse().toString());

    const rot = Mat2.fromAngle(deg(90));

    expect(rot.tryInverse()).toBeDefined();

    const rotInv = rot.inverse();

    expect(Mat2.IDENTITY.absDiffEq(rot.mul(rotInv), F32_EPSILON)).toBeTrue();
    expect(Mat2.IDENTITY.absDiffEq(rotInv.mul(rot), F32_EPSILON)).toBeTrue();

    const scale = Mat2.fromDiagonal(new Vec2(4, 5));

    expect(scale.tryInverse()).toBeDefined();

    const scaleInv = scale.inverse();

    expect(Mat2.IDENTITY.absDiffEq(scale.mul(scaleInv), F32_EPSILON)).toBeTrue();
    expect(Mat2.IDENTITY.absDiffEq(scaleInv.mul(scale), F32_EPSILON)).toBeTrue();

    const m = scale.mul(rot);

    expect(m.tryInverse()).toBeDefined();

    const mInv = m.inverse();

    expect(Mat2.IDENTITY.absDiffEq(m.mul(mInv), F32_EPSILON)).toBeTrue();
    expect(Mat2.IDENTITY.absDiffEq(mInv.mul(m), F32_EPSILON)).toBeTrue();
    expect(mInv.absDiffEq(rotInv.mul(scaleInv), F32_EPSILON)).toBeTrue();
  });

  test("ops", () => {
    const m0 = Mat2.fromColsArray2d(ARRAY2X2);

    const m0x2 = Mat2.fromColsArray2d([
      [2, 4],
      [6, 8],
    ]);

    const m0Neg = Mat2.fromColsArray2d([
      [-1, -2],
      [-3, -4],
    ]);

    const m0Recip = Mat2.fromColsArray2d([
      [1 / 1, 1 / 2],
      [1 / 3, 1 / 4],
    ]);

    expect(m0x2.toString()).toBe(m0.mul(2).toString());
    expect(m0x2.toString()).toBe(m0.mulScalar(2).toString());
    expect(m0.toString()).toBe(m0x2.div(2).toString());
    expect(m0.toString()).toBe(m0x2.divScalar(2).toString());
    expect(m0Recip.toString()).toBe(m0.recip().toString());
    expect(m0x2.toString()).toBe(m0.addMat2(m0).toString());
    expect(m0x2.toString()).toBe(m0.add(m0).toString());
    expect(Mat2.ZERO.toString()).toBe(m0.subMat2(m0).toString());
    expect(Mat2.ZERO.toString()).toBe(m0.sub(m0).toString());
    expect(m0Neg.toString()).toBe(m0.neg().toString());
    expect(m0.absDiffEq(m0.mulMat2(Mat2.IDENTITY), F32_EPSILON)).toBeTrue();
    expect(m0.absDiffEq(m0.mul(Mat2.IDENTITY), F32_EPSILON)).toBeTrue();
    expect(m0.absDiffEq(Mat2.IDENTITY.mul(m0), F32_EPSILON)).toBeTrue();
    expect(m0x2.toString()).toBe(m0.clone().mulAssign(2).toString());
    expect(m0.toString()).toBe(m0x2.clone().divAssign(2).toString());
    expect(m0x2.toString()).toBe(m0.clone().addAssign(m0).toString());
    expect(Mat2.ZERO.toString()).toBe(m0.clone().subAssign(m0).toString());
    expect(m0.toString()).toBe(Mat2.IDENTITY.mulAssign(m0).toString());
    expect(m0.mul(m0).toString()).toBe(m0.clone().mulAssign(m0).toString());
    expect(m0.toString()).toBe(m0.neg().abs().toString());

    const m1 = m0.clone();

    expect(m1.addAssign(m0)).toBe(m1);
    expect(m0.eq(m0.clone())).toBeTrue();
    expect(m0.ne(m0.clone())).toBeFalse();
    expect(m0.ne(m0x2)).toBeTrue();
  });

  test("fmt", () => {
    expect(Mat2.fromColsArray2d(ARRAY2X2).toString()).toBe("[[1, 2], [3, 4]]");
  });

  test("to from slice", () => {
    const m = Mat2.fromColsSlice(ARRAY1X4);

    expect(Mat2.fromColsArray(ARRAY1X4).toString()).toBe(m.toString());

    const out = [0, 0, 0, 0];

    m.writeColsToSlice(out);
    expect(out).toStrictEqual(ARRAY1X4);
    expect(m.toString()).toBe(Mat2.fromColsSlice(new Float32Array(ARRAY1X4)).toString());
    expect(() => Mat2.fromColsSlice([0, 0, 0])).toThrow(RangeError);

    expect(() => {
      Mat2.IDENTITY.writeColsToSlice([0, 0, 0]);
    }).toThrow(RangeError);
  });

  test("is finite", () => {
    expect(Mat2.IDENTITY.isFinite()).toBeTrue();
    expect(Mat2.IDENTITY.mul(Number.POSITIVE_INFINITY).isFinite()).toBeFalse();
    expect(Mat2.IDENTITY.mul(Number.NEGATIVE_INFINITY).isFinite()).toBeFalse();
    expect(Mat2.IDENTITY.mul(Number.NaN).isFinite()).toBeFalse();
  });
});
