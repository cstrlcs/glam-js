import { BVec4, Vec3, Vec4, vec4 } from "@";

describe(Vec4, () => {
  test("construct", () => {
    const v0 = Vec4.splat(1);
    const v1 = new Vec4(1, 2, 3, 4);
    const v2 = Vec4.fromArray([1, 2, 3, 4]);

    expect(v0).toStrictEqual(new Vec4(1, 1, 1, 1));
    expect(v1).toStrictEqual(new Vec4(1, 2, 3, 4));
    expect(v2).toStrictEqual(new Vec4(1, 2, 3, 4));
    expect(v2.toArray()).toStrictEqual([1, 2, 3, 4]);
  });

  test("constants", () => {
    expect(Vec4.ZERO).toStrictEqual(new Vec4(0, 0, 0, 0));
    expect(Vec4.ONE).toStrictEqual(new Vec4(1, 1, 1, 1));
    expect(Vec4.NEG_ONE).toStrictEqual(new Vec4(-1, -1, -1, -1));

    expect(Vec4.MIN).toStrictEqual(
      new Vec4(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE),
    );

    expect(Vec4.MAX).toStrictEqual(
      new Vec4(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE),
    );

    expect(Vec4.NAN).toStrictEqual(new Vec4(Number.NaN, Number.NaN, Number.NaN, Number.NaN));

    expect(Vec4.INFINITY).toStrictEqual(
      new Vec4(
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
      ),
    );

    expect(Vec4.NEG_INFINITY).toStrictEqual(
      new Vec4(
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
      ),
    );

    expect(Vec4.X).toStrictEqual(new Vec4(1, 0, 0, 0));
    expect(Vec4.Y).toStrictEqual(new Vec4(0, 1, 0, 0));
    expect(Vec4.Z).toStrictEqual(new Vec4(0, 0, 1, 0));
    expect(Vec4.W).toStrictEqual(new Vec4(0, 0, 0, 1));
    expect(Vec4.NEG_X).toStrictEqual(new Vec4(-1, 0, 0, 0));
    expect(Vec4.NEG_Y).toStrictEqual(new Vec4(0, -1, 0, 0));
    expect(Vec4.NEG_Z).toStrictEqual(new Vec4(0, 0, -1, 0));
    expect(Vec4.NEG_W).toStrictEqual(new Vec4(0, 0, 0, -1));

    expect(Vec4.AXES).toStrictEqual([
      new Vec4(1, 0, 0, 0),
      new Vec4(0, 1, 0, 0),
      new Vec4(0, 0, 1, 0),
      new Vec4(0, 0, 0, 1),
    ]);
  });

  test("select", () => {
    const mask = new BVec4(true, false, true, false);
    const ifTrue = new Vec4(1, 1, 1, 1);
    const ifFalse = new Vec4(2, 2, 2, 2);

    expect(Vec4.select(mask, ifTrue, ifFalse)).toStrictEqual(new Vec4(1, 2, 1, 2));
  });

  test("new", () => {
    const v = new Vec4(1, 2, 3, 0);

    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
    expect(v.z).toBe(3);
    expect(v.w).toBe(0);
    expect(new Vec4(1, 2, 3, 4).eq(4)).toBeFalse();
  });

  test("dot", () => {
    const x = new Vec4(1, 0, 0, 0);
    const y = new Vec4(0, 1, 0, 0);
    const z = new Vec4(0, 0, 1, 0);

    expect(x.dot(x)).toBe(1);
    expect(x.dot(y)).toBe(0);
    expect(x.dot(z)).toBe(0);
    expect(y.dot(z)).toBe(0);

    expect(new Vec4(30, 30, 30, 30)).toStrictEqual(
      new Vec4(1, 2, 3, 4).dotIntoVec(new Vec4(1, 2, 3, 4)),
    );
  });

  test("min/Max", () => {
    const a = new Vec4(0, 2, 1, 0);
    const b = new Vec4(1, 1, 3, 0);

    expect(new Vec4(0, 1, 1, 0)).toStrictEqual(a.min(b));
    expect(new Vec4(0, 1, 1, 0)).toStrictEqual(b.min(a));
    expect(new Vec4(1, 2, 3, 0)).toStrictEqual(a.max(b));
    expect(new Vec4(1, 2, 3, 0)).toStrictEqual(b.max(a));
  });

  test("clamp", () => {
    const min = new Vec4(1, 3, 5, 0);
    const max = new Vec4(6, 8, 10, 0);

    expect(new Vec4(0, 0, 0, 0).clamp(min, max)).toStrictEqual(new Vec4(1, 3, 5, 0));
    expect(new Vec4(2, 2, 6, 0).clamp(min, max)).toStrictEqual(new Vec4(2, 3, 6, 0));
    expect(new Vec4(4, 5, 7, 0).clamp(min, max)).toStrictEqual(new Vec4(4, 5, 7, 0));
    expect(new Vec4(6, 6, 9, 0).clamp(min, max)).toStrictEqual(new Vec4(6, 6, 9, 0));
    expect(new Vec4(7, 7, 11, 0).clamp(min, max)).toStrictEqual(new Vec4(6, 7, 10, 0));
    expect(new Vec4(9, 9, 12, 0).clamp(min, max)).toStrictEqual(new Vec4(6, 8, 10, 0));
  });

  test("hMin/HMax", () => {
    expect(new Vec4(1, 2, 3, 0).minElement()).toBe(0);
    expect(new Vec4(3, 1, 2, 4).minElement()).toBe(1);
    expect(new Vec4(2, 3, 1, 2).minElement()).toBe(1);
    expect(new Vec4(1, 2, 3, 4).maxElement()).toBe(4);
    expect(new Vec4(3, 2, 1, 0).maxElement()).toBe(3);
    expect(new Vec4(2, 3, 1, 0).maxElement()).toBe(3);
  });

  test("cmpeq", () => {
    const v0 = new Vec4(1, 2, 3, 0);
    const v1 = new Vec4(1, 3, 3, 0);

    expect(v0.cmpeq(v1)).toStrictEqual(new BVec4(true, false, true, true));
  });

  test("cmpne", () => {
    const v0 = new Vec4(1, 2, 3, 0);
    const v1 = new Vec4(1, 3, 4, 0);

    expect(v0.cmpne(v1)).toStrictEqual(new BVec4(false, true, true, false));
  });

  test("cmpge", () => {
    const v0 = new Vec4(2, 3, 4, 0);
    const v1 = new Vec4(2, 2, 4, 0);

    expect(v0.cmpge(v1)).toStrictEqual(new BVec4(true, true, true, true));
  });

  test("cmpgt", () => {
    const v0 = new Vec4(2, 4, 5, 0);
    const v1 = new Vec4(2, 3, 4, 1);

    expect(v0.cmpgt(v1)).toStrictEqual(new BVec4(false, true, true, false));
  });

  test("cmple", () => {
    const v0 = new Vec4(1, 2, 3, 0);
    const v1 = new Vec4(2, 2, 4, 1);

    expect(v0.cmple(v1)).toStrictEqual(new BVec4(true, true, true, true));
  });

  test("cmplt", () => {
    const v0 = new Vec4(1, 3, 5, 0);
    const v1 = new Vec4(2, 2, 4, 0);

    expect(v0.cmplt(v1)).toStrictEqual(new BVec4(true, false, false, false));
  });

  test("abs", () => {
    expect(Vec4.ZERO.abs()).toStrictEqual(new Vec4(0, 0, 0, 0));
    expect(Vec4.ONE.abs()).toStrictEqual(new Vec4(1, 1, 1, 1));
    expect(new Vec4(-1, -1, -1, -1).abs()).toStrictEqual(new Vec4(1, 1, 1, 1));
  });

  test("signum", () => {
    const x = new Vec4(2, -2, 0, 0);

    expect(x.signum()).toStrictEqual(new Vec4(1, -1, 1, 1));
  });

  test("isNegativeBitmask", () => {
    const v0 = new Vec4(-1, 2, -3, 0);
    const v1 = new Vec4(1, -2, 3, 0);
    const v2 = new Vec4(-1, -2, -3, 0);

    expect(v0.isNegativeBitmask()).toBe(0b101);
    expect(v1.isNegativeBitmask()).toBe(0b010);
    expect(v2.isNegativeBitmask()).toBe(0b111);
  });

  test("is Finite", () => {
    expect(new Vec4(0, 0, 0, 0).isFinite()).toBeTrue();
    expect(new Vec4(-1e-10, 1e10, 1e5, 0).isFinite()).toBeTrue();
    expect(new Vec4(Number.POSITIVE_INFINITY, 0, -1e5, 0).isFinite()).toBeFalse();
    expect(new Vec4(0, Number.NaN, 1e-2, 0).isFinite()).toBeFalse();

    expect(
      new Vec4(0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0).isFinite(),
    ).toBeFalse();

    expect(Vec4.INFINITY.isFinite()).toBeFalse();
    expect(Vec4.NEG_INFINITY.isFinite()).toBeFalse();
  });

  test("is nan", () => {
    expect(Vec4.NAN.isNan()).toBeTrue();
    expect(Vec4.NAN.isFinite()).toBeFalse();
  });

  test("is nan mask", () => {
    const v0 = new Vec4(Number.NaN, 1, Number.NaN, 0);

    expect(v0.isNanMask()).toStrictEqual(new BVec4(true, false, true, false));
  });

  test("funcs", () => {
    const x = new Vec4(1, 0, 0, 0);
    const y = new Vec4(0, 1, 0, 0);
    const z = new Vec4(0, 0, 1, 0);
    const w = new Vec4(0, 0, 0, 1);

    expect(x.mul(-2).length()).toBe(2);
    expect(y.mul(3).length()).toBe(3);
    expect(z.mul(-4).length()).toBe(4);
    expect(w.mul(5).length()).toBe(5);
    expect(x.distance(y)).toStrictEqual(Math.sqrt(2));
    expect(x.mul(3).distance(y.mul(-4))).toBe(5);
    expect(z.mul(-5).distance(y.mul(12))).toBe(13);
    expect(w.mul(7).distance(x.mul(-8))).toStrictEqual(Math.sqrt(113));
    expect(x.mul(2).normalize()).toStrictEqual(x);
    expect(x.mul(2).normalizeOrZero()).toStrictEqual(x);
    expect(new Vec4(2, 3, 4, 5).normalize().isNormalized()).toBeTrue();
    expect(new Vec4(2, 4, 8, 16).recip()).toStrictEqual(new Vec4(0.5, 0.25, 0.125, 1 / 16));

    expect(new Vec4(1, 2, 3, 4).dot(new Vec4(4, 5, 6, 7))).toStrictEqual(
      1 * 4 + 2 * 5 + 3 * 6 + 4 * 7,
    );

    expect(new Vec4(2, 3, 4, 5).length()).toStrictEqual(Math.sqrt(54));
    expect(new Vec4(2, 3, 4, 5).lengthRecip()).toStrictEqual(1 / Math.sqrt(54));
    expect(new Vec4(2, 3, 4, 5).normalize()).toStrictEqual(new Vec4(2, 3, 4, 5).normalize());
  });

  test("length Squared", () => {
    const x = new Vec4(1, 0, 0, 0);
    const y = new Vec4(0, 1, 0, 0);

    expect(y.mul(-3).lengthSquared()).toBe(9);
    expect(x.distanceSquared(y)).toBe(2);
    expect(x.mul(2).distanceSquared(y.mul(-3))).toBe(13);
  });

  test("div Euclid", () => {
    const v0 = new Vec4(5, 9, 11, 4);
    const v1 = new Vec4(2, 2, 3, 3);

    expect(v0.divEuclid(v1)).toStrictEqual(new Vec4(2, 4, 3, 1));
  });

  test("rem Euclid", () => {
    const v0 = new Vec4(5, 9, 11, 5);
    const v1 = new Vec4(2, 2, 3, 3);

    expect(v0.remEuclid(v1)).toStrictEqual(new Vec4(1, 1, 2, 2));
  });

  test("project Reject", () => {
    const v0 = new Vec4(1, 1, 0, 0);
    const v1 = new Vec4(0, 2, 0, 0);
    const v2 = new Vec4(0, 1, 0, 0);

    expect(v0.projectOnto(v1)).toStrictEqual(new Vec4(0, 1, 0, 0));
    expect(v0.rejectFrom(v1)).toStrictEqual(new Vec4(1, 0, 0, 0));
    expect(v0.projectOntoNormalized(v2)).toStrictEqual(new Vec4(0, 1, 0, 0));
    expect(v0.rejectFromNormalized(v2)).toStrictEqual(new Vec4(1, 0, 0, 0));
  });

  test("round", () => {
    expect(new Vec4(1.35, 0, 0, 0).round().x).toBe(1);
    expect(new Vec4(0, 1.5, 0, 0).round().y).toBe(2);
    expect(new Vec4(0, -15.5, 0, 0).round().y).toBe(-16);
    expect(new Vec4(0, 0, 0, 0).round().y).toBe(0);
    expect(new Vec4(0, 21.1, 0, 0).round().y).toBe(21);
    expect(new Vec4(0, 11.123, 0, 0).round().y).toBe(11);
    expect(new Vec4(0, 11.499, 0, 0).round().y).toBe(11);

    expect(
      new Vec4(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, 0).round(),
    ).toStrictEqual(new Vec4(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, 0));

    expect(new Vec4(Number.NaN, 0, 0, 0).round().x).toBeNaN();
  });

  test("floor", () => {
    expect(new Vec4(1.35, -1.5, 0, 0).floor()).toStrictEqual(new Vec4(1, -2, 0, 0));

    expect(
      new Vec4(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, 0).floor(),
    ).toStrictEqual(new Vec4(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, 0));

    expect(new Vec4(Number.NaN, 0, 0, 0).floor().x).toBeNaN();

    expect(new Vec4(-2_000_000.123, 10_000_000.123, 0, 0).floor()).toStrictEqual(
      new Vec4(-2_000_001, 10_000_000, 0, 0),
    );
  });

  test("ceil", () => {
    expect(new Vec4(1.35, -1.5, 0, 0).ceil()).toStrictEqual(new Vec4(2, -1, 0, 0));

    expect(new Vec4(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, 0).ceil()).toStrictEqual(
      new Vec4(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, 0),
    );

    expect(new Vec4(Number.NaN, 0, 0, 0).ceil().x).toBeNaN();

    expect(new Vec4(-2_000_000.123, 1_000_000.123, 0, 0).ceil()).toStrictEqual(
      new Vec4(-2_000_000, 1_000_001, 0, 0),
    );
  });

  test("trunc", () => {
    expect(new Vec4(1.35, -1.5, 0, 0).trunc()).toStrictEqual(new Vec4(1, -1, 0, 0));

    expect(
      new Vec4(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, 0).trunc(),
    ).toStrictEqual(new Vec4(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, 0));

    expect(new Vec4(0, Number.NaN, 0, 0).trunc().y).toBeNaN();

    expect(new Vec4(-0, -2_000_000.123, 0, 0).trunc()).toStrictEqual(
      new Vec4(-0, -2_000_000, 0, 0),
    );
  });

  test("fract gl", () => {
    expect(new Vec4(1.35, -1.5, 0, 0).fractGl().approxEq(new Vec4(0.35, 0.5, 0, 0))).toBeTrue();

    expect(
      new Vec4(-2_000_000.123, 1_000_000.123, 0, 0)
        .fractGl()
        .approxEq(new Vec4(0.877, 0.123, 0, 0)),
    ).toBeTrue();
  });

  test("exp", () => {
    expect(
      new Vec4(1, 2, 0, 0)
        .exp()
        .approxEq(new Vec4(Math.exp(1), Math.exp(2), Math.exp(0), Math.exp(0))),
    ).toBeTrue();
  });

  test("powf", () => {
    expect(new Vec4(2, 4, 3, 0).powf(2)).toStrictEqual(new Vec4(2 ** 2, 4 ** 2, 3 ** 2, 0));
  });

  test("lerp", () => {
    const v0 = new Vec4(-1, -1, 0, 0);
    const v1 = new Vec4(1, 1, 0, 0);

    expect(v0.lerp(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.lerp(v1, 1).approxEq(v1)).toBeTrue();
    expect(v0.lerp(v1, 0.5).approxEq(new Vec4(0, 0, 0, 0))).toBeTrue();
  });

  test("midpoint", () => {
    const v1 = new Vec4(1, 2, 3, 0);
    const v2 = new Vec4(4, 6, 8, 0);
    const expectedMidpoint = new Vec4(2.5, 4, 5.5, 0);

    expect(v1.midpoint(v2)).toStrictEqual(expectedMidpoint);
  });

  test("absDiffEq", () => {
    const v0 = new Vec4(1.0001, 2, 3.0002, 0);
    const v1 = new Vec4(1, 2.0001, 3, 0);

    expect(v0.absDiffEq(v1, 0.0002)).toBeTrue();
  });

  test("clamp Length", () => {
    expect(new Vec4(12, 16, 0, 0).clampLength(7, 10)).toStrictEqual(new Vec4(6, 8, 0, 0));
    expect(new Vec4(2, 1, 0, 0).clampLength(0.5, 5)).toStrictEqual(new Vec4(2, 1, 0, 0));
    expect(new Vec4(0.6, 0.8, 0, 0).clampLength(10, 20)).toStrictEqual(new Vec4(6, 8, 0, 0));
  });

  test("clamp Length Max", () => {
    expect(new Vec4(12, 16, 0, 0).clampLengthMax(10)).toStrictEqual(new Vec4(6, 8, 0, 0));
    expect(new Vec4(2, 1, 0, 0).clampLengthMax(5)).toStrictEqual(new Vec4(2, 1, 0, 0));
  });

  test("clamp Length Min", () => {
    expect(new Vec4(2, 1, 0, 0).clampLengthMin(0.5)).toStrictEqual(new Vec4(2, 1, 0, 0));
    expect(new Vec4(0.6, 0.8, 0, 0).clampLengthMin(10)).toStrictEqual(new Vec4(6, 8, 0, 0));
  });

  test("mulAdd", () => {
    expect(
      new Vec4(1, 1, 0, 0).mulAdd(new Vec4(0.5, 2, 0, 0), new Vec4(-1, -1, 0, 0)),
    ).toStrictEqual(new Vec4(-0.5, 1, 0, 0));
  });

  test("angle Between", () => {
    let angle = new Vec4(1, 0, 1, 0).angleBetween(new Vec4(1, 1, 0, 0));

    expect(Math.abs(angle - Math.PI / 3) < 1e-6).toBeTrue();
    angle = new Vec4(10, 0, 10, 0).angleBetween(new Vec4(5, 5, 0, 0));
    expect(Math.abs(angle - Math.PI / 3) < 1e-6).toBeTrue();
    angle = new Vec4(-1, 0, -1, 0).angleBetween(new Vec4(1, -1, 0, 0));
    expect(Math.abs(angle - (2 * Math.PI) / 3) < 1e-6).toBeTrue();
  });

  test("negatives", () => {
    expect(new Vec4(1, 2, 1, 2).neg()).toStrictEqual(new Vec4(-1, -2, -1, -2));
    expect(new Vec4(0, 0, 0, 0).neg()).toStrictEqual(new Vec4(-0, -0, -0, -0));
    expect(new Vec4(-0, -0, -0, -0).neg()).toStrictEqual(new Vec4(0, 0, 0, 0));
  });

  test("remainder", () => {
    const v0 = new Vec4(5, 10, 15, 3);
    const v1 = new Vec4(2, 3, 4, 3);

    expect(v0.rem(v1)).toStrictEqual(new Vec4(1, 1, 3, 0));
    expect(v0.rem(3)).toStrictEqual(new Vec4(2, 1, 0, 0));
  });

  test("not Equal", () => {
    const v0 = new Vec4(1, 2, 3, 0);
    const v1 = new Vec4(1, 3, 3, 0);

    expect(v0.ne(v1)).toBeTrue();
    expect(v0.ne(2)).toBeTrue();
  });

  test("assign Operators", () => {
    const v = new Vec4(1, 2, 3, 4);

    expect(v.addAssign(new Vec4(1, 2, 3, 4))).toBe(v);
    expect(v).toStrictEqual(new Vec4(2, 4, 6, 8));
    expect(v.addAssign(1)).toStrictEqual(new Vec4(3, 5, 7, 9));
    expect(v.subAssign(new Vec4(1, 1, 1, 1))).toStrictEqual(new Vec4(2, 4, 6, 8));
    expect(v.subAssign(2)).toStrictEqual(new Vec4(0, 2, 4, 6));
    expect(v.mulAssign(new Vec4(2, 3, 4, 5))).toStrictEqual(new Vec4(0, 6, 16, 30));
    expect(v.mulAssign(0.5)).toStrictEqual(new Vec4(0, 3, 8, 15));
    expect(v.divAssign(new Vec4(1, 3, 2, 5))).toStrictEqual(new Vec4(0, 1, 4, 3));
    expect(v.divAssign(2)).toStrictEqual(new Vec4(0, 0.5, 2, 1.5));
    expect(v.remAssign(new Vec4(1, 1, 3, 1))).toStrictEqual(new Vec4(0, 0.5, 2, 0.5));
    expect(v.remAssign(1.5)).toStrictEqual(new Vec4(0, 0.5, 0.5, 0.5));
  });

  test("clone", () => {
    const v = new Vec4(1, 2, 3, 4);
    const c = v.clone();

    expect(c).toStrictEqual(v);
    expect(c).not.toBe(v);
    c.x = 5;
    expect(v.x).toBe(1);
  });

  test("clamp Length Returns A Copy", () => {
    const v = new Vec4(2, 1, 0, 0);

    for (const clamped of [v.clampLength(0.5, 5), v.clampLengthMax(5), v.clampLengthMin(0.5)]) {
      expect(clamped).toStrictEqual(v);
      expect(clamped).not.toBe(v);
    }
  });

  test("new and vec4", () => {
    expect(Vec4.new(1, 2, 3, 4)).toStrictEqual(new Vec4(1, 2, 3, 4));
    expect(vec4(1, 2, 3, 4)).toStrictEqual(new Vec4(1, 2, 3, 4));
  });

  test("map", () => {
    const v = new Vec4(1, 2, 3, 4);

    expect(v.map((n) => n + 3)).toStrictEqual(v.add(Vec4.splat(3)));
    expect(v.map(() => 0)).toStrictEqual(Vec4.ZERO);
  });

  test("with", () => {
    expect(Vec4.ZERO.withX(1)).toStrictEqual(Vec4.X);
    expect(Vec4.ZERO.withY(1)).toStrictEqual(Vec4.Y);
    expect(Vec4.ZERO.withZ(1)).toStrictEqual(Vec4.Z);
    expect(Vec4.ZERO.withW(1)).toStrictEqual(Vec4.W);
  });

  test("min position and max position", () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(1, 1, 1, 1);
    const c = new Vec4(4, 3, 2, 1);
    const d = new Vec4(1, 2, 0, 1);
    const e = new Vec4(1, 0, 2, 1);

    expect(a.minPosition()).toBe(0);
    expect(b.minPosition()).toBe(0);
    expect(c.minPosition()).toBe(3);
    expect(d.minPosition()).toBe(2);
    expect(e.minPosition()).toBe(1);
    expect(a.maxPosition()).toBe(3);
    expect(b.maxPosition()).toBe(0);
    expect(c.maxPosition()).toBe(0);
    expect(d.maxPosition()).toBe(1);
    expect(e.maxPosition()).toBe(2);
  });

  test("element sum and product", () => {
    const a = new Vec4(2, 3, 4, 5);

    expect(a.elementSum()).toBe(14);
    expect(a.elementProduct()).toBe(120);
  });

  test("truncate", () => {
    expect(new Vec4(1, 2, 3, 4).truncate()).toStrictEqual(new Vec3(1, 2, 3));
  });

  test("homogeneous", () => {
    const v = new Vec4(1, 2, 3, 1);

    expect(v.project().toHomogeneous().approxEq(v)).toBeTrue();
    expect(new Vec4(2, 4, 6, 2).project()).toStrictEqual(new Vec3(1, 2, 3));
  });

  test("to and from slice", () => {
    const v = new Vec4(1, 2, 3, 4);
    const a = [0, 0, 0, 0];

    v.writeToSlice(a);
    expect(Vec4.fromSlice(a)).toStrictEqual(v);
    expect(a).toStrictEqual([1, 2, 3, 4]);

    const b = new Float32Array(17);

    v.writeToSlice(b);
    expect(Vec4.fromSlice(b.subarray(0, 4))).toStrictEqual(v);
    expect([...b.subarray(4)]).toStrictEqual(Array.from({ length: 13 }, () => 0));

    expect(() => {
      Vec4.ONE.writeToSlice([0, 0, 0]);
    }).toThrow(RangeError);

    expect(() => Vec4.fromSlice([0, 0, 0])).toThrow(RangeError);
  });

  test("min max nan", () => {
    expect(Vec4.NAN.min(Vec4.ZERO).isNanMask().all()).toBeTrue();
    expect(Vec4.ZERO.min(Vec4.NAN).isNanMask().all()).toBeTrue();
    expect(Vec4.NAN.max(Vec4.ZERO).isNanMask().all()).toBeTrue();
    expect(Vec4.ZERO.max(Vec4.NAN).isNanMask().all()).toBeTrue();
    expect(new Vec4(4, 3, 2, Number.NaN).minElement()).toBeNaN();
    expect(new Vec4(4, 3, 2, Number.NaN).maxElement()).toBeNaN();
    expect(Vec4.NAN.clamp(Vec4.NEG_ONE, Vec4.ONE).isNanMask().all()).toBeTrue();
  });

  test("signum of zeros, infinities and nan", () => {
    expect(Vec4.ZERO.signum()).toStrictEqual(Vec4.ONE);
    expect(Vec4.ZERO.neg().signum()).toStrictEqual(Vec4.NEG_ONE);
    expect(Vec4.ONE.signum()).toStrictEqual(Vec4.ONE);
    expect(Vec4.NEG_ONE.signum()).toStrictEqual(Vec4.NEG_ONE);
    expect(Vec4.INFINITY.signum()).toStrictEqual(Vec4.ONE);
    expect(Vec4.NEG_INFINITY.signum()).toStrictEqual(Vec4.NEG_ONE);
    expect(Vec4.NAN.signum().isNanMask().all()).toBeTrue();
  });

  test("copysign", () => {
    const negZero = Vec4.ZERO.neg();

    expect(Vec4.ZERO.copysign(negZero)).toStrictEqual(negZero);
    expect(negZero.copysign(negZero)).toStrictEqual(negZero);
    expect(Vec4.ZERO.copysign(Vec4.ZERO)).toStrictEqual(Vec4.ZERO);
    expect(negZero.copysign(Vec4.ZERO)).toStrictEqual(Vec4.ZERO);
    expect(Vec4.ONE.copysign(negZero)).toStrictEqual(Vec4.NEG_ONE);
    expect(Vec4.NEG_ONE.copysign(negZero)).toStrictEqual(Vec4.NEG_ONE);
    expect(Vec4.ONE.copysign(Vec4.ZERO)).toStrictEqual(Vec4.ONE);
    expect(Vec4.NEG_ONE.copysign(Vec4.ZERO)).toStrictEqual(Vec4.ONE);
    expect(Vec4.ZERO.copysign(Vec4.NEG_ONE)).toStrictEqual(negZero);
    expect(negZero.copysign(Vec4.NEG_ONE)).toStrictEqual(negZero);
    expect(Vec4.ZERO.copysign(Vec4.ONE)).toStrictEqual(Vec4.ZERO);
    expect(negZero.copysign(Vec4.ONE)).toStrictEqual(Vec4.ZERO);
    expect(Vec4.ONE.copysign(Vec4.NEG_ONE)).toStrictEqual(Vec4.NEG_ONE);
    expect(Vec4.NEG_ONE.copysign(Vec4.NEG_ONE)).toStrictEqual(Vec4.NEG_ONE);
    expect(Vec4.ONE.copysign(Vec4.ONE)).toStrictEqual(Vec4.ONE);
    expect(Vec4.NEG_ONE.copysign(Vec4.ONE)).toStrictEqual(Vec4.ONE);
    expect(Vec4.INFINITY.copysign(Vec4.ONE)).toStrictEqual(Vec4.INFINITY);
    expect(Vec4.INFINITY.copysign(Vec4.NEG_ONE)).toStrictEqual(Vec4.NEG_INFINITY);
    expect(Vec4.NEG_INFINITY.copysign(Vec4.ONE)).toStrictEqual(Vec4.INFINITY);
    expect(Vec4.NEG_INFINITY.copysign(Vec4.NEG_ONE)).toStrictEqual(Vec4.NEG_INFINITY);
    expect(Vec4.NAN.copysign(Vec4.ONE).isNanMask().all()).toBeTrue();
    expect(Vec4.NAN.copysign(Vec4.NEG_ONE).isNanMask().all()).toBeTrue();
  });

  test("div euclid and rem euclid with negatives", () => {
    const one = Vec4.ONE;
    const two = one.add(one);
    const three = two.add(one);
    const four = three.add(one);

    expect(three.divEuclid(two)).toStrictEqual(one);
    expect(three.neg().divEuclid(two)).toStrictEqual(two.neg());
    expect(three.divEuclid(two.neg())).toStrictEqual(one.neg());
    expect(three.neg().divEuclid(two.neg())).toStrictEqual(two);
    expect(four.remEuclid(three)).toStrictEqual(one);
    expect(four.neg().remEuclid(three)).toStrictEqual(two);
    expect(four.remEuclid(three.neg())).toStrictEqual(one);
    expect(four.neg().remEuclid(three.neg())).toStrictEqual(two);
  });

  test("normalize", () => {
    expect(new Vec4(-42, 0, 0, 0).normalize()).toStrictEqual(new Vec4(-1, 0, 0, 0));
    expect(new Vec4(Math.sqrt(Number.MAX_VALUE), 0, 0, 0).normalize()).toStrictEqual(Vec4.X);
    expect(new Vec4(0, 0, 0, 0).normalize().isFinite()).toBeFalse();
    expect(new Vec4(Number.MIN_VALUE, 0, 0, 0).normalize().isFinite()).toBeFalse();
    expect(new Vec4(Number.POSITIVE_INFINITY, 0, 0, 0).normalize().isFinite()).toBeFalse();
    expect(new Vec4(Number.NaN, 0, 0, 0).normalize().isFinite()).toBeFalse();
  });

  test("try normalize", () => {
    expect(new Vec4(-42, 0, 0, 0).tryNormalize()).toStrictEqual(new Vec4(-1, 0, 0, 0));
    expect(new Vec4(Math.sqrt(Number.MAX_VALUE), 0, 0, 0).tryNormalize()).toStrictEqual(Vec4.X);
    expect(new Vec4(0, 0, 0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec4(Number.MIN_VALUE, 0, 0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec4(Number.POSITIVE_INFINITY, 0, 0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec4(Number.NaN, 0, 0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec4(Number.MAX_VALUE, 0, 0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec4(Number.MAX_VALUE, Number.MAX_VALUE, 0, 0).tryNormalize()).toBeUndefined();
  });

  test("normalize or", () => {
    expect(new Vec4(-42, 0, 0, 0).normalizeOr(Vec4.Y)).toStrictEqual(new Vec4(-1, 0, 0, 0));
    expect(new Vec4(0, 0, 0, 0).normalizeOr(Vec4.Y)).toStrictEqual(Vec4.Y);
    expect(new Vec4(Number.MIN_VALUE, 0, 0, 0).normalizeOr(Vec4.Y)).toStrictEqual(Vec4.Y);
    expect(new Vec4(Number.POSITIVE_INFINITY, 0, 0, 0).normalizeOr(Vec4.Y)).toStrictEqual(Vec4.Y);
    expect(new Vec4(Number.NaN, 0, 0, 0).normalizeOr(Vec4.Y)).toStrictEqual(Vec4.Y);
    expect(new Vec4(Number.MAX_VALUE, 0, 0, 0).normalizeOr(Vec4.Y)).toStrictEqual(Vec4.Y);

    const fallback = Vec4.Y;

    expect(Vec4.ZERO.normalizeOr(fallback)).not.toBe(fallback);
  });

  test("normalize or zero", () => {
    expect(new Vec4(-42, 0, 0, 0).normalizeOrZero()).toStrictEqual(new Vec4(-1, 0, 0, 0));
    expect(new Vec4(0, 0, 0, 0).normalizeOrZero()).toStrictEqual(Vec4.ZERO);
    expect(new Vec4(Number.MIN_VALUE, 0, 0, 0).normalizeOrZero()).toStrictEqual(Vec4.ZERO);
    expect(new Vec4(Number.POSITIVE_INFINITY, 0, 0, 0).normalizeOrZero()).toStrictEqual(Vec4.ZERO);
    expect(new Vec4(Number.NaN, 0, 0, 0).normalizeOrZero()).toStrictEqual(Vec4.ZERO);

    expect(new Vec4(Number.MAX_VALUE, Number.MAX_VALUE, 0, 0).normalizeOrZero()).toStrictEqual(
      Vec4.ZERO,
    );
  });

  test("normalize and length", () => {
    expect(new Vec4(-42, 0, 0, 0).normalizeAndLength()).toStrictEqual([new Vec4(-1, 0, 0, 0), 42]);
    expect(new Vec4(0, 0, 0, 0).normalizeAndLength()).toStrictEqual([Vec4.X, 0]);
    expect(new Vec4(Number.MIN_VALUE, 0, 0, 0).normalizeAndLength()).toStrictEqual([Vec4.X, 0]);

    expect(new Vec4(Number.POSITIVE_INFINITY, 0, 0, 0).normalizeAndLength()).toStrictEqual([
      Vec4.X,
      0,
    ]);

    expect(new Vec4(Number.NaN, 0, 0, 0).normalizeAndLength()).toStrictEqual([Vec4.X, 0]);
    expect(new Vec4(Number.MAX_VALUE, 0, 0, 0).normalizeAndLength()).toStrictEqual([Vec4.X, 0]);
  });

  test("project reject tiny", () => {
    const v = Vec4.splat(1e-20);
    const p = v.projectOnto(v);

    expect(p.isFinite()).toBeTrue();
    expect(p.absDiffEq(v, 1e-6)).toBeTrue();
  });

  test("lerp big difference", () => {
    const v0 = Vec4.splat(-1e30);
    const v1 = Vec4.splat(16);

    expect(v0.lerp(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.lerp(v1, 1).approxEq(v1)).toBeTrue();
  });

  test("lerp monotonic", () => {
    const v0 = Vec4.NEG_ONE;
    const v1 = Vec4.ONE;

    expect(v0.lerpMonotonic(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.lerpMonotonic(v1, 1).approxEq(v1)).toBeTrue();
    expect(v0.lerpMonotonic(v1, 0.5).approxEq(Vec4.ZERO)).toBeTrue();

    const a = Vec4.splat(0.1);

    expect(a.lerpMonotonic(a, 0.25)).toStrictEqual(a);

    const b = Vec4.splat(0.1 + 1e-7);
    let previous = a.lerpMonotonic(b, 0);

    for (let i = 1; i <= 100; i += 1) {
      const v = a.lerpMonotonic(b, i / 100);

      expect(v.cmpge(previous).all()).toBeTrue();
      previous = v;
    }

    expect(v0.lerpMonotonic(v1, -1).approxEq(Vec4.splat(-3))).toBeTrue();
    expect(v0.lerpMonotonic(v1, 2).approxEq(Vec4.splat(3))).toBeTrue();
    expect(Vec4.splat(-1e30).lerpMonotonic(Vec4.splat(16), 1)).toStrictEqual(Vec4.ZERO);

    const max = Vec4.MAX;

    expect(max.lerp(max.neg(), 0.5)).toStrictEqual(Vec4.ZERO);

    const overflowed = max.lerpMonotonic(max.neg(), 0.5);

    expect(overflowed.isFinite()).toBeFalse();
    expect(overflowed.isNan()).toBeFalse();
    expect(max.lerpMonotonic(max.neg(), 0).isNan()).toBeTrue();
  });

  test("move towards", () => {
    const v0 = Vec4.NEG_ONE;
    const v1 = Vec4.ONE;

    expect(v0.moveTowards(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.moveTowards(v1, v0.distance(v1)).approxEq(v1)).toBeTrue();
    expect(v0.moveTowards(v1, v0.distance(v1) + 1).approxEq(v1)).toBeTrue();
    expect(v0.moveTowards(v1, 10)).not.toBe(v1);
  });

  test("sin, cos and sin cos", () => {
    const v = new Vec4(1, 2, 3, 4);
    const sin = new Vec4(Math.sin(1), Math.sin(2), Math.sin(3), Math.sin(4));
    const cos = new Vec4(Math.cos(1), Math.cos(2), Math.cos(3), Math.cos(4));
    const [s, c] = v.sinCos();

    expect(v.sin().absDiffEq(sin, 1e-5)).toBeTrue();
    expect(v.cos().absDiffEq(cos, 1e-5)).toBeTrue();
    expect(s.absDiffEq(sin, 1e-5)).toBeTrue();
    expect(c.absDiffEq(cos, 1e-5)).toBeTrue();
  });

  test("is negative bitmask and mask", () => {
    expect(Vec4.ZERO.isNegativeBitmask()).toBe(0b0000);
    expect(Vec4.ZERO.neg().isNegativeBitmask()).toBe(0b1111);
    expect(Vec4.ONE.isNegativeBitmask()).toBe(0b0000);
    expect(Vec4.NEG_ONE.isNegativeBitmask()).toBe(0b1111);
    expect(new Vec4(-1, 2, 3, 4).isNegativeBitmask()).toBe(0b0001);
    expect(new Vec4(1, 5, -3, 7).isNegativeBitmask()).toBe(0b0100);
    expect(new Vec4(3, -4, 1, -6).isNegativeBitmask()).toBe(0b1010);
    expect(new Vec4(-2, 6, -5, -0).isNegativeBitmask()).toBe(0b1101);
    expect(Vec4.ZERO.isNegativeMask()).toStrictEqual(new BVec4(false, false, false, false));
    expect(Vec4.ZERO.neg().isNegativeMask()).toStrictEqual(new BVec4(true, true, true, true));

    expect(new Vec4(-1, 2, 3, -4).isNegativeMask()).toStrictEqual(
      new BVec4(true, false, false, true),
    );

    expect(new Vec4(3, -4, 1, 0).isNegativeMask()).toStrictEqual(
      new BVec4(false, true, false, false),
    );
  });

  test("is finite mask", () => {
    expect(new Vec4(-1, 2, 3, 4).isFiniteMask().all()).toBeTrue();
    expect(new Vec4(Number.POSITIVE_INFINITY, 1, 2, 3).isFiniteMask().all()).toBeFalse();

    expect(new Vec4(Number.NaN, 1, Number.NEGATIVE_INFINITY, 2).isFiniteMask()).toStrictEqual(
      new BVec4(false, true, false, true),
    );
  });

  test("round half away from zero", () => {
    expect(new Vec4(0, 0, -15.5, 0).round().z).toBe(-16);
    expect(new Vec4(0, 0, 11.501, 0).round().z).toBe(12);
    expect(new Vec4(0.5, -0.5, 2.5, -2.5).round()).toStrictEqual(new Vec4(1, -1, 3, -3));
    expect(new Vec4(3.5, -3.5, 4.5, -4.5).round()).toStrictEqual(new Vec4(4, -4, 5, -5));
    expect(new Vec4(-0, -0.4, 0.4, 0).round()).toStrictEqual(new Vec4(-0, -0, 0, 0));
  });

  test("fract", () => {
    expect(new Vec4(1.35, 1.5, -1.5, 0).fract().approxEq(new Vec4(0.35, 0.5, -0.5, 0))).toBeTrue();

    expect(
      new Vec4(-200_000.123, 1_000_000.123, 1000.9, 0)
        .fract()
        .absDiffEq(new Vec4(-0.123, 0.123, 0.9, 0), 0.002),
    ).toBeTrue();
  });

  test("exp2, ln, log2 and sqrt", () => {
    const v = new Vec4(1, 2, 3, 4);

    expect(v.exp2().absDiffEq(new Vec4(2, 4, 8, 16), 1e-5)).toBeTrue();

    expect(
      v.ln().absDiffEq(new Vec4(Math.log(1), Math.log(2), Math.log(3), Math.log(4)), 1e-5),
    ).toBeTrue();

    expect(Vec4.NEG_ONE.ln().isNan()).toBeTrue();
    expect(Vec4.ZERO.ln()).toStrictEqual(Vec4.NEG_INFINITY);
    expect(v.log2().absDiffEq(new Vec4(0, 1, Math.log2(3), 2), 1e-5)).toBeTrue();
    expect(Vec4.NEG_ONE.log2().isNan()).toBeTrue();
    expect(Vec4.ZERO.log2()).toStrictEqual(Vec4.NEG_INFINITY);
    expect(v.sqrt().absDiffEq(new Vec4(1, Math.SQRT2, Math.sqrt(3), 2), 1e-5)).toBeTrue();
    expect(Vec4.NEG_ONE.sqrt().isNan()).toBeTrue();
  });

  test("step, smoothstep and saturate", () => {
    expect(new Vec4(1, 2, 3, 4).step(Vec4.splat(2.5))).toStrictEqual(new Vec4(1, 1, 0, 0));

    const t = new Vec4(0, 0.25, 1, 0.5);
    const expected = t.mul(t).mul(t.mul(-2).add(3));

    expect(
      new Vec4(-2, 0, 4, 1).smoothstep(Vec4.splat(-1), Vec4.splat(3)).absDiffEq(expected, 1e-5),
    ).toBeTrue();

    expect(new Vec4(-1, 0.5, 3, 1).saturate()).toStrictEqual(new Vec4(0, 0.5, 1, 1));
  });

  test("reflect", () => {
    expect(new Vec4(1, -1, 1, 1).reflect(Vec4.Y).approxEq(Vec4.ONE)).toBeTrue();
  });

  test("refract", () => {
    let incident = Vec4.NEG_ONE.normalize();
    const normal = Vec4.ONE.normalize();

    expect(incident.refract(normal, 0.5).approxEq(incident)).toBeTrue();
    incident = new Vec4(1, -1, 0, 0).normalize();
    expect(incident.refract(Vec4.Y, 1.5).approxEq(Vec4.ZERO)).toBeTrue();
  });

  test("arithmetic operators", () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 8, 6, 2);

    expect(a.add(b)).toStrictEqual(new Vec4(5, 10, 9, 6));
    expect(a.add(2)).toStrictEqual(new Vec4(3, 4, 5, 6));
    expect(a.sub(b)).toStrictEqual(new Vec4(-3, -6, -3, 2));
    expect(a.sub(2)).toStrictEqual(new Vec4(-1, 0, 1, 2));
    expect(a.mul(b)).toStrictEqual(new Vec4(4, 16, 18, 8));
    expect(a.mul(2)).toStrictEqual(new Vec4(2, 4, 6, 8));
    expect(b.div(a)).toStrictEqual(new Vec4(4, 4, 2, 0.5));
    expect(b.div(2)).toStrictEqual(new Vec4(2, 4, 3, 1));
  });

  test("equality with scalars and vectors", () => {
    const a = Vec4.splat(2);

    expect(a.eq(2)).toBeTrue();
    expect(a.eq(3)).toBeFalse();
    expect(a.eq(Vec4.splat(2))).toBeTrue();
    expect(a.ne(2)).toBeFalse();
    expect(a.ne(new Vec4(1, 2, 3, 4))).toBeTrue();
    expect(a.approxEq(2 + 1e-7)).toBeTrue();
    expect(a.approxEq(2.1)).toBeFalse();
    expect(a.approxEq(Vec4.splat(2 + 1e-7))).toBeTrue();
    expect(a.approxEq(Vec4.splat(2.1))).toBeFalse();
  });
});
