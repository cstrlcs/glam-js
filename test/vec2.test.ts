import { BVec2, Vec2, Vec3, vec2 } from "@";

describe(Vec2, () => {
  test("construct", () => {
    const v0 = Vec2.splat(1);
    const v1 = new Vec2(1, 2);
    const v2 = Vec2.fromArray([1, 2]);

    expect(v0).toStrictEqual(new Vec2(1, 1));
    expect(v1).toStrictEqual(new Vec2(1, 2));
    expect(v2).toStrictEqual(new Vec2(1, 2));
    expect(v2.toArray()).toStrictEqual([1, 2]);
  });

  test("constants", () => {
    expect(Vec2.ZERO).toStrictEqual(new Vec2(0, 0));
    expect(Vec2.ONE).toStrictEqual(new Vec2(1, 1));
    expect(Vec2.NEG_ONE).toStrictEqual(new Vec2(-1, -1));
    expect(Vec2.MIN).toStrictEqual(new Vec2(-Number.MAX_VALUE, -Number.MAX_VALUE));
    expect(Vec2.MAX).toStrictEqual(new Vec2(Number.MAX_VALUE, Number.MAX_VALUE));
    expect(Vec2.NAN).toStrictEqual(new Vec2(Number.NaN, Number.NaN));

    expect(Vec2.INFINITY).toStrictEqual(
      new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
    );

    expect(Vec2.NEG_INFINITY).toStrictEqual(
      new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY),
    );

    expect(Vec2.X).toStrictEqual(new Vec2(1, 0));
    expect(Vec2.Y).toStrictEqual(new Vec2(0, 1));
    expect(Vec2.NEG_X).toStrictEqual(new Vec2(-1, 0));
    expect(Vec2.NEG_Y).toStrictEqual(new Vec2(0, -1));
    expect(Vec2.AXES).toStrictEqual([new Vec2(1, 0), new Vec2(0, 1)]);
  });

  test("new", () => {
    const v = new Vec2(1, 2);

    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
  });

  test("select", () => {
    const mask = new BVec2(true, false);
    const ifTrue = new Vec2(1, 1);
    const ifFalse = new Vec2(2, 2);

    expect(Vec2.select(mask, ifTrue, ifFalse)).toStrictEqual(new Vec2(1, 2));
  });

  test("dot", () => {
    const x = new Vec2(1, 0);
    const y = new Vec2(0, 1);

    expect(x.dot(x)).toBe(1);
    expect(x.dot(y)).toBe(0);
    expect(x.dot(x.neg())).toBe(-1);
    expect(new Vec2(8, 8)).toStrictEqual(new Vec2(1, 2).dotIntoVec(new Vec2(4, 2)));
  });

  test("min/Max", () => {
    const a = new Vec2(0, 2);
    const b = new Vec2(1, 1);

    expect(new Vec2(0, 1)).toStrictEqual(a.min(b));
    expect(new Vec2(0, 1)).toStrictEqual(b.min(a));
    expect(new Vec2(1, 2)).toStrictEqual(a.max(b));
    expect(new Vec2(1, 2)).toStrictEqual(b.max(a));
  });

  test("clamp", () => {
    const min = new Vec2(1, 3);
    const max = new Vec2(6, 8);

    expect(new Vec2(0, 0).clamp(min, max)).toStrictEqual(new Vec2(1, 3));
    expect(new Vec2(2, 2).clamp(min, max)).toStrictEqual(new Vec2(2, 3));
    expect(new Vec2(4, 5).clamp(min, max)).toStrictEqual(new Vec2(4, 5));
    expect(new Vec2(6, 6).clamp(min, max)).toStrictEqual(new Vec2(6, 6));
    expect(new Vec2(7, 7).clamp(min, max)).toStrictEqual(new Vec2(6, 7));
    expect(new Vec2(9, 9).clamp(min, max)).toStrictEqual(new Vec2(6, 8));
  });

  test("hMin/HMax", () => {
    expect(new Vec2(1, 2).minElement()).toBe(1);
    expect(new Vec2(2, 1).minElement()).toBe(1);
    expect(new Vec2(1, 2).maxElement()).toBe(2);
    expect(new Vec2(2, 1).maxElement()).toBe(2);
  });

  test("cmpeq", () => {
    const v0 = new Vec2(1, 2);
    const v1 = new Vec2(1, 3);

    expect(v0.cmpeq(v1)).toStrictEqual(new BVec2(true, false));
  });

  test("cmpne", () => {
    const v0 = new Vec2(1, 2);
    const v1 = new Vec2(1, 3);

    expect(v0.cmpne(v1)).toStrictEqual(new BVec2(false, true));
  });

  test("cmpge", () => {
    const v0 = new Vec2(2, 3);
    const v1 = new Vec2(2, 2);

    expect(v0.cmpge(v1)).toStrictEqual(new BVec2(true, true));
  });

  test("cmpgt", () => {
    const v0 = new Vec2(2, 4);
    const v1 = new Vec2(2, 3);

    expect(v0.cmpgt(v1)).toStrictEqual(new BVec2(false, true));
  });

  test("cmple", () => {
    const v0 = new Vec2(1, 2);
    const v1 = new Vec2(2, 2);

    expect(v0.cmple(v1)).toStrictEqual(new BVec2(true, true));
  });

  test("cmplt", () => {
    const v0 = new Vec2(1, 3);
    const v1 = new Vec2(2, 2);

    expect(v0.cmplt(v1)).toStrictEqual(new BVec2(true, false));
  });

  test("abs", () => {
    expect(Vec2.ZERO.abs()).toStrictEqual(new Vec2(0, 0));
    expect(Vec2.ONE.abs()).toStrictEqual(new Vec2(1, 1));
    expect(new Vec2(-1, -1).abs()).toStrictEqual(new Vec2(1, 1));
  });

  test("signum", () => {
    const x = new Vec2(2, -2);

    expect(x.signum()).toStrictEqual(new Vec2(1, -1));
  });

  test("is Negative Bitmask", () => {
    const v0 = new Vec2(-1, 2);
    const v1 = new Vec2(1, -2);
    const v2 = new Vec2(-1, -2);
    const v3 = new Vec2(1, 2);

    expect(v0.isNegativeBitmask()).toBe(0b01);
    expect(v1.isNegativeBitmask()).toBe(0b10);
    expect(v2.isNegativeBitmask()).toBe(0b11);
    expect(v3.isNegativeBitmask()).toBe(0b00);
  });

  test("is Finite", () => {
    expect(new Vec2(0, 0).isFinite()).toBeTrue();
    expect(new Vec2(-1e-10, 1e10).isFinite()).toBeTrue();
    expect(new Vec2(Number.POSITIVE_INFINITY, 0).isFinite()).toBeFalse();
    expect(new Vec2(0, Number.NaN).isFinite()).toBeFalse();
    expect(new Vec2(0, Number.NEGATIVE_INFINITY).isFinite()).toBeFalse();
    expect(Vec2.INFINITY.isFinite()).toBeFalse();
    expect(Vec2.NEG_INFINITY.isFinite()).toBeFalse();
  });

  test("is nan", () => {
    expect(Vec2.NAN.isNan()).toBeTrue();
    expect(Vec2.NAN.isFinite()).toBeFalse();
  });

  test("is nan mask", () => {
    const v0 = new Vec2(Number.NaN, 1);

    expect(v0.isNanMask()).toStrictEqual(new BVec2(true, false));
  });

  test("length", () => {
    const x = new Vec2(1, 0);
    const y = new Vec2(0, 1);

    expect(x.mul(-2).length()).toBe(2);
    expect(y.mul(3).length()).toBe(3);
    expect(x.distance(y)).toStrictEqual(Math.sqrt(2));
    expect(x.mul(3).distance(y.mul(-4))).toBe(5);
    expect(x.mul(-5).distance(y.mul(12))).toBe(13);
    expect(x.mul(2).normalize()).toStrictEqual(x);
    expect(x.mul(2).normalizeOrZero()).toStrictEqual(x);
    expect(new Vec2(1, 2).dot(new Vec2(3, 4))).toStrictEqual(1 * 3 + 2 * 4);
    expect(new Vec2(2, 3).length()).toStrictEqual(Math.sqrt(13));
    expect(new Vec2(2, 3).lengthRecip()).toStrictEqual(1 / Math.sqrt(13));
    expect(new Vec2(2, 3).normalize().isNormalized()).toBeTrue();
    expect(new Vec2(2, 3).normalize()).toStrictEqual(new Vec2(2, 3).div(Math.sqrt(13)));
    expect(new Vec2(2, 4).recip()).toStrictEqual(new Vec2(0.5, 0.25));
  });

  test("length Squared", () => {
    const x = new Vec2(1, 0);
    const y = new Vec2(0, 1);

    expect(y.mul(-3).lengthSquared()).toBe(9);
    expect(x.distanceSquared(y)).toBe(2);
    expect(x.mul(2).distanceSquared(y.mul(-3))).toBe(13);
  });

  test("div Euclid", () => {
    const v0 = new Vec2(5, 9);
    const v1 = new Vec2(2, 2);

    expect(v0.divEuclid(v1)).toStrictEqual(new Vec2(2, 4));
  });

  test("rem Euclid", () => {
    const v0 = new Vec2(5, 9);
    const v1 = new Vec2(2, 2);

    expect(v0.remEuclid(v1)).toStrictEqual(new Vec2(1, 1));
  });

  test("project Reject", () => {
    const v0 = new Vec2(1, 1);
    const v1 = new Vec2(0, 2);
    const v2 = new Vec2(0, 1);

    expect(v0.projectOnto(v1)).toStrictEqual(new Vec2(0, 1));
    expect(v0.rejectFrom(v1)).toStrictEqual(new Vec2(1, 0));
    expect(v0.projectOntoNormalized(v2)).toStrictEqual(new Vec2(0, 1));
    expect(v0.rejectFromNormalized(v2)).toStrictEqual(new Vec2(1, 0));
  });

  test("round", () => {
    expect(new Vec2(1.35, 0).round().x).toBe(1);
    expect(new Vec2(0, 1.5).round().y).toBe(2);
    expect(new Vec2(0, -15.5).round().y).toBe(-16);
    expect(new Vec2(0, 0).round().y).toBe(0);
    expect(new Vec2(0, 21.1).round().y).toBe(21);
    expect(new Vec2(0, 11.123).round().y).toBe(11);
    expect(new Vec2(0, 11.499).round().y).toBe(11);

    expect(new Vec2(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY).round()).toStrictEqual(
      new Vec2(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
    );

    expect(new Vec2(Number.NaN, 0).round().x).toBeNaN();
  });

  test("floor", () => {
    expect(new Vec2(1.35, -1.5).floor()).toStrictEqual(new Vec2(1, -2));

    expect(new Vec2(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY).floor()).toStrictEqual(
      new Vec2(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY),
    );

    expect(new Vec2(Number.NaN, 0).floor().x).toBeNaN();

    expect(new Vec2(-2_000_000.123, 10_000_000.123).floor()).toStrictEqual(
      new Vec2(-2_000_001, 10_000_000),
    );
  });

  test("ceil", () => {
    expect(new Vec2(1.35, -1.5).ceil()).toStrictEqual(new Vec2(2, -1));

    expect(new Vec2(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY).ceil()).toStrictEqual(
      new Vec2(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY),
    );

    expect(new Vec2(Number.NaN, 0).ceil().x).toBeNaN();

    expect(new Vec2(-2_000_000.123, 1_000_000.123).ceil()).toStrictEqual(
      new Vec2(-2_000_000, 1_000_001),
    );
  });

  test("trunc", () => {
    expect(new Vec2(1.35, -1.5).trunc()).toStrictEqual(new Vec2(1, -1));

    expect(new Vec2(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY).trunc()).toStrictEqual(
      new Vec2(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY),
    );

    expect(new Vec2(0, Number.NaN).trunc().y).toBeNaN();
    expect(new Vec2(-0, -2_000_000.123).trunc()).toStrictEqual(new Vec2(-0, -2_000_000));
  });

  test("fract gl", () => {
    expect(new Vec2(1.35, -1.5).fractGl().approxEq(new Vec2(0.35, 0.5))).toBeTrue();

    expect(
      new Vec2(-2_000_000.123, 1_000_000.123).fractGl().approxEq(new Vec2(0.877, 0.123)),
    ).toBeTrue();
  });

  test("exp", () => {
    expect(new Vec2(1, 2).exp().approxEq(new Vec2(Math.exp(1), Math.exp(2)))).toBeTrue();
  });

  test("powf", () => {
    expect(new Vec2(2, 4).powf(2)).toStrictEqual(new Vec2(2 ** 2, 4 ** 2));
  });

  test("lerp", () => {
    const v0 = new Vec2(-1, -1);
    const v1 = new Vec2(1, 1);

    expect(v0.lerp(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.lerp(v1, 1).approxEq(v1)).toBeTrue();
    expect(v0.lerp(v1, 0.5).approxEq(Vec2.ZERO)).toBeTrue();
  });

  test("midpoint", () => {
    const v0 = new Vec2(-1, -1);
    const v1 = new Vec2(1, 1);
    const v2 = new Vec2(-1.5, 0);

    expect(v0.midpoint(v1).approxEq(new Vec2(0, 0))).toBeTrue();
    expect(v1.midpoint(v2).approxEq(new Vec2(-0.25, 0.5))).toBeTrue();
  });

  test("absDiffEq", () => {
    const v0 = new Vec2(1.0001, 2);
    const v1 = new Vec2(1, 2.0001);

    expect(v0.absDiffEq(v1, 0.0002)).toBeTrue();
  });

  test("clamp Length", () => {
    expect(new Vec2(12, 16).clampLength(7, 10)).toStrictEqual(new Vec2(6, 8));
    expect(new Vec2(2, 1).clampLength(0.5, 5)).toStrictEqual(new Vec2(2, 1));
    expect(new Vec2(0.6, 0.8).clampLength(10, 20)).toStrictEqual(new Vec2(6, 8));
  });

  test("clamp Length Max", () => {
    expect(new Vec2(12, 16).clampLengthMax(10)).toStrictEqual(new Vec2(6, 8));
    expect(new Vec2(2, 1).clampLengthMax(5)).toStrictEqual(new Vec2(2, 1));
  });

  test("clamp Length Min", () => {
    expect(new Vec2(2, 1).clampLengthMin(0.5)).toStrictEqual(new Vec2(2, 1));
    expect(new Vec2(0.6, 0.8).clampLengthMin(10)).toStrictEqual(new Vec2(6, 8));
  });

  test("mulAdd", () => {
    expect(new Vec2(1, 1).mulAdd(new Vec2(0.5, 2), new Vec2(-1, -1))).toStrictEqual(
      new Vec2(-0.5, 1),
    );
  });

  test("angle Conversion", () => {
    let angle = 0;
    let vec = Vec2.fromAngle(angle);

    expect(vec.approxEq(new Vec2(1, 0))).toBeTrue();
    expect(Math.abs(vec.toAngle() - angle) < 1e-6).toBeTrue();
    angle = Math.PI / 2;
    vec = Vec2.fromAngle(angle);
    expect(vec.approxEq(new Vec2(0, 1))).toBeTrue();
    expect(Math.abs(vec.toAngle() - angle) < 1e-6).toBeTrue();
    angle = Math.PI;
    vec = Vec2.fromAngle(angle);
    expect(vec.approxEq(new Vec2(-1, 0))).toBeTrue();
    expect(Math.abs(Math.abs(vec.toAngle()) - angle) < 1e-6).toBeTrue();
    angle = -Math.PI / 2;
    vec = Vec2.fromAngle(angle);
    expect(vec.approxEq(new Vec2(0, -1))).toBeTrue();
    expect(Math.abs(vec.toAngle() - angle) < 1e-6).toBeTrue();
  });

  test("angle to", () => {
    expect(new Vec2(1, 0).angleTo(new Vec2(0, 1))).toBeCloseTo(Math.PI / 2, 6);
    expect(new Vec2(10, 0).angleTo(new Vec2(0, 5))).toBeCloseTo(Math.PI / 2, 6);
    expect(new Vec2(-1, 0).angleTo(new Vec2(0, 1))).toBeCloseTo(-Math.PI / 2, 6);
    expect(Vec2.X.rotateAngle(Vec2.X.angleTo(Vec2.Y)).approxEq(Vec2.Y)).toBeTrue();
    expect(Vec2.X.angleTo(Vec2.NEG_X)).toBeCloseTo(Math.PI, 6);
  });

  test("negatives", () => {
    expect(new Vec2(1, 2).neg()).toStrictEqual(new Vec2(-1, -2));
    expect(new Vec2(0, 0).neg()).toStrictEqual(new Vec2(-0, -0));
    expect(new Vec2(-0, -0).neg()).toStrictEqual(new Vec2(0, 0));
  });

  test("perp", () => {
    const v0 = new Vec2(1, 2);
    const v1 = new Vec2(1, 1);
    const v0Perp = new Vec2(-2, 1);

    expect(v0Perp).toStrictEqual(v0.perp());
    expect(v0.perp().dot(v0)).toBe(0);
    expect(v1.perp().dot(v1)).toBe(0);
    expect(v0.perp().dot(v1)).toStrictEqual(v0.perpDot(v1));
  });

  test("rotate", () => {
    const v0 = new Vec2(0, 1).rotate(new Vec2(1, 1));

    expect(v0).toStrictEqual(new Vec2(-1, 1));
  });

  test("remainder", () => {
    const v0 = new Vec2(5, 10);
    const v1 = new Vec2(2, 3);

    expect(v0.rem(v1)).toStrictEqual(new Vec2(1, 1));
    expect(v0.rem(3)).toStrictEqual(new Vec2(2, 1));
  });

  test("not Equal", () => {
    const v0 = new Vec2(1, 2);
    const v1 = new Vec2(1, 3);

    expect(v0.ne(v1)).toBeTrue();
    expect(v0.ne(2)).toBeTrue();
  });

  test("assign Operators", () => {
    const v = new Vec2(1, 2);

    expect(v.addAssign(new Vec2(1, 2))).toBe(v);
    expect(v).toStrictEqual(new Vec2(2, 4));
    expect(v.addAssign(1)).toStrictEqual(new Vec2(3, 5));
    expect(v.subAssign(new Vec2(1, 1))).toStrictEqual(new Vec2(2, 4));
    expect(v.subAssign(2)).toStrictEqual(new Vec2(0, 2));
    expect(v.mulAssign(new Vec2(2, 3))).toStrictEqual(new Vec2(0, 6));
    expect(v.mulAssign(0.5)).toStrictEqual(new Vec2(0, 3));
    expect(v.divAssign(new Vec2(1, 3))).toStrictEqual(new Vec2(0, 1));
    expect(v.divAssign(2)).toStrictEqual(new Vec2(0, 0.5));
    expect(v.remAssign(new Vec2(1, 1))).toStrictEqual(new Vec2(0, 0.5));
    expect(v.remAssign(1.5)).toStrictEqual(new Vec2(0, 0.5));
  });

  test("clone", () => {
    const v = new Vec2(1, 2);
    const c = v.clone();

    expect(c).toStrictEqual(v);
    expect(c).not.toBe(v);
    c.x = 5;
    expect(v.x).toBe(1);
  });

  test("clamp Length Returns A Copy", () => {
    const v = new Vec2(2, 1);

    for (const clamped of [v.clampLength(0.5, 5), v.clampLengthMax(5), v.clampLengthMin(0.5)]) {
      expect(clamped).toStrictEqual(v);
      expect(clamped).not.toBe(v);
    }
  });

  test("new and vec2", () => {
    expect(Vec2.new(1, 2)).toStrictEqual(new Vec2(1, 2));
    expect(vec2(1, 2)).toStrictEqual(new Vec2(1, 2));
  });

  test("map", () => {
    const v = new Vec2(1, 2);

    expect(v.map((n) => n + 3)).toStrictEqual(v.add(Vec2.splat(3)));
    expect(v.map(() => 0)).toStrictEqual(Vec2.ZERO);
  });

  test("with", () => {
    expect(Vec2.ZERO.withX(1)).toStrictEqual(Vec2.X);
    expect(Vec2.ZERO.withY(1)).toStrictEqual(Vec2.Y);
  });

  test("min position and max position", () => {
    const a = new Vec2(0, 2);
    const b = new Vec2(1, 1);
    const c = new Vec2(2, 1);

    expect(a.minPosition()).toBe(0);
    expect(b.minPosition()).toBe(0);
    expect(c.minPosition()).toBe(1);
    expect(a.maxPosition()).toBe(1);
    expect(b.maxPosition()).toBe(0);
    expect(c.maxPosition()).toBe(0);
  });

  test("element sum and product", () => {
    const a = new Vec2(2, 3);

    expect(a.elementSum()).toBe(5);
    expect(a.elementProduct()).toBe(6);
  });

  test("extend", () => {
    expect(new Vec2(1, 2).extend(3)).toStrictEqual(new Vec3(1, 2, 3));
  });

  test("to and from slice", () => {
    const v = new Vec2(1, 2);
    const a = [0, 0];

    v.writeToSlice(a);
    expect(Vec2.fromSlice(a)).toStrictEqual(v);

    const b = new Float32Array(17);

    v.writeToSlice(b);
    expect(Vec2.fromSlice(b.subarray(0, 2))).toStrictEqual(v);
    expect([...b.subarray(2)]).toStrictEqual(Array.from({ length: 15 }, () => 0));

    expect(() => {
      Vec2.ONE.writeToSlice([0]);
    }).toThrow(RangeError);

    expect(() => Vec2.fromSlice([0])).toThrow(RangeError);
  });

  test("min max nan", () => {
    expect(Vec2.NAN.min(Vec2.ZERO).isNanMask().all()).toBeTrue();
    expect(Vec2.ZERO.min(Vec2.NAN).isNanMask().all()).toBeTrue();
    expect(Vec2.NAN.max(Vec2.ZERO).isNanMask().all()).toBeTrue();
    expect(Vec2.ZERO.max(Vec2.NAN).isNanMask().all()).toBeTrue();
    expect(new Vec2(2, Number.NaN).minElement()).toBeNaN();
    expect(new Vec2(2, Number.NaN).maxElement()).toBeNaN();
    expect(Vec2.NAN.clamp(Vec2.NEG_ONE, Vec2.ONE).isNanMask().all()).toBeTrue();
  });

  test("signum of zeros, infinities and nan", () => {
    expect(Vec2.ZERO.signum()).toStrictEqual(Vec2.ONE);
    expect(Vec2.ZERO.neg().signum()).toStrictEqual(Vec2.NEG_ONE);
    expect(Vec2.ONE.signum()).toStrictEqual(Vec2.ONE);
    expect(Vec2.NEG_ONE.signum()).toStrictEqual(Vec2.NEG_ONE);
    expect(Vec2.INFINITY.signum()).toStrictEqual(Vec2.ONE);
    expect(Vec2.NEG_INFINITY.signum()).toStrictEqual(Vec2.NEG_ONE);
    expect(Vec2.NAN.signum().isNanMask().all()).toBeTrue();
  });

  test("copysign", () => {
    const negZero = Vec2.ZERO.neg();

    expect(Vec2.ZERO.copysign(negZero)).toStrictEqual(negZero);
    expect(negZero.copysign(negZero)).toStrictEqual(negZero);
    expect(Vec2.ZERO.copysign(Vec2.ZERO)).toStrictEqual(Vec2.ZERO);
    expect(negZero.copysign(Vec2.ZERO)).toStrictEqual(Vec2.ZERO);
    expect(Vec2.ONE.copysign(negZero)).toStrictEqual(Vec2.NEG_ONE);
    expect(Vec2.NEG_ONE.copysign(negZero)).toStrictEqual(Vec2.NEG_ONE);
    expect(Vec2.ONE.copysign(Vec2.ZERO)).toStrictEqual(Vec2.ONE);
    expect(Vec2.NEG_ONE.copysign(Vec2.ZERO)).toStrictEqual(Vec2.ONE);
    expect(Vec2.ZERO.copysign(Vec2.NEG_ONE)).toStrictEqual(negZero);
    expect(negZero.copysign(Vec2.NEG_ONE)).toStrictEqual(negZero);
    expect(Vec2.ZERO.copysign(Vec2.ONE)).toStrictEqual(Vec2.ZERO);
    expect(negZero.copysign(Vec2.ONE)).toStrictEqual(Vec2.ZERO);
    expect(Vec2.ONE.copysign(Vec2.NEG_ONE)).toStrictEqual(Vec2.NEG_ONE);
    expect(Vec2.NEG_ONE.copysign(Vec2.NEG_ONE)).toStrictEqual(Vec2.NEG_ONE);
    expect(Vec2.ONE.copysign(Vec2.ONE)).toStrictEqual(Vec2.ONE);
    expect(Vec2.NEG_ONE.copysign(Vec2.ONE)).toStrictEqual(Vec2.ONE);
    expect(Vec2.INFINITY.copysign(Vec2.ONE)).toStrictEqual(Vec2.INFINITY);
    expect(Vec2.INFINITY.copysign(Vec2.NEG_ONE)).toStrictEqual(Vec2.NEG_INFINITY);
    expect(Vec2.NEG_INFINITY.copysign(Vec2.ONE)).toStrictEqual(Vec2.INFINITY);
    expect(Vec2.NEG_INFINITY.copysign(Vec2.NEG_ONE)).toStrictEqual(Vec2.NEG_INFINITY);
    expect(Vec2.NAN.copysign(Vec2.ONE).isNanMask().all()).toBeTrue();
    expect(Vec2.NAN.copysign(Vec2.NEG_ONE).isNanMask().all()).toBeTrue();
  });

  test("is negative bitmask and mask", () => {
    expect(Vec2.ZERO.isNegativeBitmask()).toBe(0b00);
    expect(Vec2.ZERO.neg().isNegativeBitmask()).toBe(0b11);
    expect(Vec2.ONE.isNegativeBitmask()).toBe(0b00);
    expect(Vec2.NEG_ONE.isNegativeBitmask()).toBe(0b11);
    expect(new Vec2(-1, 2).isNegativeBitmask()).toBe(0b01);
    expect(new Vec2(8, 3).isNegativeBitmask()).toBe(0b00);
    expect(new Vec2(3, -4).isNegativeBitmask()).toBe(0b10);
    expect(new Vec2(-2, -6).isNegativeBitmask()).toBe(0b11);
    expect(Vec2.ZERO.isNegativeMask()).toStrictEqual(new BVec2(false, false));
    expect(Vec2.ZERO.neg().isNegativeMask()).toStrictEqual(new BVec2(true, true));
    expect(Vec2.ONE.isNegativeMask()).toStrictEqual(new BVec2(false, false));
    expect(Vec2.NEG_ONE.isNegativeMask()).toStrictEqual(new BVec2(true, true));
    expect(new Vec2(-1, 2).isNegativeMask()).toStrictEqual(new BVec2(true, false));
    expect(new Vec2(3, -4).isNegativeMask()).toStrictEqual(new BVec2(false, true));
  });

  test("is finite mask", () => {
    expect(new Vec2(-1, 2).isFiniteMask().all()).toBeTrue();
    expect(new Vec2(Number.POSITIVE_INFINITY, 1).isFiniteMask().all()).toBeFalse();
    expect(new Vec2(Number.NaN, 1).isFiniteMask()).toStrictEqual(new BVec2(false, true));
  });

  test("div euclid and rem euclid with negatives", () => {
    const one = Vec2.ONE;
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
    expect(new Vec2(-42, 0).normalize()).toStrictEqual(new Vec2(-1, 0));
    expect(new Vec2(Math.sqrt(Number.MAX_VALUE), 0).normalize()).toStrictEqual(Vec2.X);
    expect(new Vec2(0, 0).normalize().isFinite()).toBeFalse();
    expect(new Vec2(Number.MIN_VALUE, 0).normalize().isFinite()).toBeFalse();
    expect(new Vec2(Number.POSITIVE_INFINITY, 0).normalize().isFinite()).toBeFalse();
    expect(new Vec2(Number.NaN, 0).normalize().isFinite()).toBeFalse();
  });

  test("try normalize", () => {
    expect(new Vec2(-42, 0).tryNormalize()).toStrictEqual(new Vec2(-1, 0));
    expect(new Vec2(Math.sqrt(Number.MAX_VALUE), 0).tryNormalize()).toStrictEqual(Vec2.X);
    expect(new Vec2(0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec2(Number.MIN_VALUE, 0).tryNormalize()).toBeUndefined();
    expect(new Vec2(Number.POSITIVE_INFINITY, 0).tryNormalize()).toBeUndefined();
    expect(new Vec2(Number.NaN, 0).tryNormalize()).toBeUndefined();
    expect(new Vec2(Number.MAX_VALUE, 0).tryNormalize()).toBeUndefined();
    expect(new Vec2(Number.MAX_VALUE, Number.MAX_VALUE).tryNormalize()).toBeUndefined();
  });

  test("normalize or", () => {
    expect(new Vec2(-42, 0).normalizeOr(Vec2.Y)).toStrictEqual(new Vec2(-1, 0));
    expect(new Vec2(0, 0).normalizeOr(Vec2.Y)).toStrictEqual(Vec2.Y);
    expect(new Vec2(Number.MIN_VALUE, 0).normalizeOr(Vec2.Y)).toStrictEqual(Vec2.Y);
    expect(new Vec2(Number.POSITIVE_INFINITY, 0).normalizeOr(Vec2.Y)).toStrictEqual(Vec2.Y);
    expect(new Vec2(Number.NaN, 0).normalizeOr(Vec2.Y)).toStrictEqual(Vec2.Y);
    expect(new Vec2(Number.MAX_VALUE, 0).normalizeOr(Vec2.Y)).toStrictEqual(Vec2.Y);

    const fallback = Vec2.Y;

    expect(Vec2.ZERO.normalizeOr(fallback)).not.toBe(fallback);
  });

  test("normalize or zero", () => {
    expect(new Vec2(-42, 0).normalizeOrZero()).toStrictEqual(new Vec2(-1, 0));
    expect(new Vec2(0, 0).normalizeOrZero()).toStrictEqual(Vec2.ZERO);
    expect(new Vec2(Number.MIN_VALUE, 0).normalizeOrZero()).toStrictEqual(Vec2.ZERO);
    expect(new Vec2(Number.POSITIVE_INFINITY, 0).normalizeOrZero()).toStrictEqual(Vec2.ZERO);
    expect(new Vec2(Number.NaN, 0).normalizeOrZero()).toStrictEqual(Vec2.ZERO);
    expect(new Vec2(Number.MAX_VALUE, Number.MAX_VALUE).normalizeOrZero()).toStrictEqual(Vec2.ZERO);
  });

  test("normalize and length", () => {
    expect(new Vec2(-42, 0).normalizeAndLength()).toStrictEqual([new Vec2(-1, 0), 42]);
    expect(new Vec2(0, 0).normalizeAndLength()).toStrictEqual([Vec2.X, 0]);
    expect(new Vec2(Number.MIN_VALUE, 0).normalizeAndLength()).toStrictEqual([Vec2.X, 0]);
    expect(new Vec2(Number.POSITIVE_INFINITY, 0).normalizeAndLength()).toStrictEqual([Vec2.X, 0]);
    expect(new Vec2(Number.NaN, 0).normalizeAndLength()).toStrictEqual([Vec2.X, 0]);
    expect(new Vec2(Number.MAX_VALUE, 0).normalizeAndLength()).toStrictEqual([Vec2.X, 0]);
  });

  test("project reject tiny", () => {
    const v = Vec2.splat(1e-20);
    const p = v.projectOnto(v);

    expect(p.isFinite()).toBeTrue();
    expect(p.absDiffEq(v, 1e-6)).toBeTrue();
  });

  test("round half away from zero", () => {
    expect(new Vec2(0.5, -0.5).round()).toStrictEqual(new Vec2(1, -1));
    expect(new Vec2(2.5, -2.5).round()).toStrictEqual(new Vec2(3, -3));
    expect(new Vec2(-0, -0.4).round()).toStrictEqual(new Vec2(-0, -0));
  });

  test("fract", () => {
    expect(new Vec2(1.35, -1.5).fract().approxEq(new Vec2(0.35, -0.5))).toBeTrue();

    expect(
      new Vec2(-200_000.123, 1_000_000.123).fract().absDiffEq(new Vec2(-0.123, 0.123), 0.002),
    ).toBeTrue();
  });

  test("lerp big difference", () => {
    const v0 = Vec2.splat(-1e30);
    const v1 = Vec2.splat(16);

    expect(v0.lerp(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.lerp(v1, 1).approxEq(v1)).toBeTrue();
  });

  test("lerp monotonic", () => {
    const v0 = Vec2.NEG_ONE;
    const v1 = Vec2.ONE;

    expect(v0.lerpMonotonic(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.lerpMonotonic(v1, 1).approxEq(v1)).toBeTrue();
    expect(v0.lerpMonotonic(v1, 0.5).approxEq(Vec2.ZERO)).toBeTrue();

    const a = Vec2.splat(0.1);

    expect(a.lerpMonotonic(a, 0.25)).toStrictEqual(a);

    const b = Vec2.splat(0.1 + 1e-7);
    let previous = a.lerpMonotonic(b, 0);

    for (let i = 1; i <= 100; i += 1) {
      const v = a.lerpMonotonic(b, i / 100);

      expect(v.cmpge(previous).all()).toBeTrue();
      previous = v;
    }

    expect(v0.lerpMonotonic(v1, -1).approxEq(Vec2.splat(-3))).toBeTrue();
    expect(v0.lerpMonotonic(v1, 2).approxEq(Vec2.splat(3))).toBeTrue();
    expect(Vec2.splat(-1e30).lerpMonotonic(Vec2.splat(16), 1)).toStrictEqual(Vec2.ZERO);

    const max = Vec2.MAX;

    expect(max.lerp(max.neg(), 0.5)).toStrictEqual(Vec2.ZERO);

    const overflowed = max.lerpMonotonic(max.neg(), 0.5);

    expect(overflowed.isFinite()).toBeFalse();
    expect(overflowed.isNan()).toBeFalse();
    expect(max.lerpMonotonic(max.neg(), 0).isNan()).toBeTrue();
  });

  test("move towards", () => {
    const v0 = Vec2.NEG_ONE;
    const v1 = Vec2.ONE;

    expect(v0.moveTowards(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.moveTowards(v1, v0.distance(v1)).approxEq(v1)).toBeTrue();
    expect(v0.moveTowards(v1, v0.distance(v1) + 1).approxEq(v1)).toBeTrue();
    expect(v0.moveTowards(v1, 10)).not.toBe(v1);
  });

  test("rotate towards", () => {
    const half = Math.SQRT2 / 2;

    expect(Vec2.X.rotateTowards(Vec2.X, Math.PI / 2).approxEq(Vec2.X)).toBeTrue();

    expect(
      Vec2.Y.mul(2)
        .rotateTowards(Vec2.Y, Math.PI / 2)
        .approxEq(Vec2.Y.mul(2)),
    ).toBeTrue();

    expect(Vec2.NEG_X.rotateTowards(Vec2.NEG_X, Math.PI / 2).approxEq(Vec2.NEG_X)).toBeTrue();
    expect(Vec2.X.rotateTowards(Vec2.NEG_Y, 0).approxEq(Vec2.X)).toBeTrue();

    expect(
      Vec2.X.rotateTowards(Vec2.NEG_Y, Math.PI / 4).approxEq(new Vec2(half, -half)),
    ).toBeTrue();

    expect(Vec2.X.rotateTowards(Vec2.NEG_Y, Math.PI / 2).approxEq(Vec2.NEG_Y)).toBeTrue();
    expect(Vec2.X.rotateTowards(Vec2.NEG_Y, (Math.PI / 2) * 1.5).approxEq(Vec2.NEG_Y)).toBeTrue();

    expect(
      Vec2.X.rotateTowards(Vec2.NEG_Y, -Math.PI / 4).approxEq(new Vec2(half, half)),
    ).toBeTrue();

    expect(Vec2.X.rotateTowards(Vec2.NEG_Y, -Math.PI / 2).approxEq(Vec2.Y)).toBeTrue();
    expect(Vec2.X.rotateTowards(Vec2.NEG_Y, (-Math.PI / 2) * 1.5).approxEq(Vec2.Y)).toBeTrue();

    expect(
      Vec2.X.mul(2)
        .rotateTowards(Vec2.NEG_Y, Math.PI / 2)
        .approxEq(Vec2.NEG_Y.mul(2)),
    ).toBeTrue();

    expect(Vec2.X.rotateTowards(Vec2.NEG_Y.mul(2), Math.PI / 2).approxEq(Vec2.NEG_Y)).toBeTrue();
    expect(Vec2.X.rotateTowards(Vec2.NEG_X, Math.PI / 2).approxEq(Vec2.Y)).toBeTrue();
  });

  test("rotate angle", () => {
    expect(Vec2.X.rotateAngle(Math.PI / 2).approxEq(Vec2.Y)).toBeTrue();
    expect(Vec2.X.rotateAngle(Math.PI).approxEq(Vec2.NEG_X)).toBeTrue();
    expect(Vec2.X.rotateAngle((3 * Math.PI) / 2).approxEq(Vec2.NEG_Y)).toBeTrue();
    expect(Vec2.X.rotateAngle(0).approxEq(Vec2.X)).toBeTrue();

    expect(
      Vec2.X.rotateAngle(Math.PI / 2).approxEq(Vec2.X.rotate(Vec2.fromAngle(Math.PI / 2))),
    ).toBeTrue();
  });

  test("exp2, ln, log2 and sqrt", () => {
    const v = new Vec2(1, 2);

    expect(v.exp2().absDiffEq(new Vec2(2, 4), 1e-5)).toBeTrue();
    expect(v.ln().absDiffEq(new Vec2(Math.log(1), Math.log(2)), 1e-5)).toBeTrue();
    expect(Vec2.NEG_ONE.ln().isNan()).toBeTrue();
    expect(Vec2.ZERO.ln()).toStrictEqual(Vec2.NEG_INFINITY);
    expect(v.log2().absDiffEq(new Vec2(0, 1), 1e-5)).toBeTrue();
    expect(Vec2.NEG_ONE.log2().isNan()).toBeTrue();
    expect(Vec2.ZERO.log2()).toStrictEqual(Vec2.NEG_INFINITY);
    expect(v.sqrt().absDiffEq(new Vec2(1, Math.SQRT2), 1e-5)).toBeTrue();
    expect(Vec2.NEG_ONE.sqrt().isNan()).toBeTrue();
  });

  test("sin, cos and sin cos", () => {
    const v = new Vec2(1, 2);
    const sin = new Vec2(Math.sin(1), Math.sin(2));
    const cos = new Vec2(Math.cos(1), Math.cos(2));
    const [s, c] = v.sinCos();

    expect(v.sin().absDiffEq(sin, 1e-5)).toBeTrue();
    expect(v.cos().absDiffEq(cos, 1e-5)).toBeTrue();
    expect(s.absDiffEq(sin, 1e-5)).toBeTrue();
    expect(c.absDiffEq(cos, 1e-5)).toBeTrue();
  });

  test("step, smoothstep and saturate", () => {
    expect(new Vec2(1, 3).step(Vec2.splat(2.5))).toStrictEqual(new Vec2(1, 0));

    const t = new Vec2(0, 0.25);
    const expected = t.mul(t).mul(t.mul(-2).add(3));

    expect(
      new Vec2(-2, 0).smoothstep(Vec2.splat(-1), Vec2.splat(3)).absDiffEq(expected, 1e-5),
    ).toBeTrue();

    expect(new Vec2(-1, 3).saturate()).toStrictEqual(new Vec2(0, 1));
  });

  test("reflect", () => {
    expect(new Vec2(1, -1).reflect(Vec2.Y).approxEq(Vec2.ONE)).toBeTrue();
  });

  test("refract", () => {
    let incident = Vec2.NEG_ONE.normalize();
    const normal = Vec2.ONE.normalize();

    expect(incident.refract(normal, 0.5).approxEq(incident)).toBeTrue();
    incident = new Vec2(1, -1).normalize();
    expect(incident.refract(Vec2.Y, 1.5).approxEq(Vec2.ZERO)).toBeTrue();
  });

  test("arithmetic operators", () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 8);

    expect(a.add(b)).toStrictEqual(new Vec2(5, 10));
    expect(a.add(2)).toStrictEqual(new Vec2(3, 4));
    expect(a.sub(b)).toStrictEqual(new Vec2(-3, -6));
    expect(a.sub(2)).toStrictEqual(new Vec2(-1, 0));
    expect(a.mul(b)).toStrictEqual(new Vec2(4, 16));
    expect(a.mul(2)).toStrictEqual(new Vec2(2, 4));
    expect(b.div(a)).toStrictEqual(new Vec2(4, 4));
    expect(b.div(2)).toStrictEqual(new Vec2(2, 4));
  });

  test("equality with scalars and vectors", () => {
    const a = Vec2.splat(2);

    expect(a.eq(2)).toBeTrue();
    expect(a.eq(3)).toBeFalse();
    expect(a.eq(Vec2.splat(2))).toBeTrue();
    expect(a.ne(2)).toBeFalse();
    expect(a.ne(new Vec2(1, 2))).toBeTrue();
    expect(a.approxEq(2 + 1e-7)).toBeTrue();
    expect(a.approxEq(2.1)).toBeFalse();
    expect(a.approxEq(Vec2.splat(2 + 1e-7))).toBeTrue();
    expect(a.approxEq(Vec2.splat(2.1))).toBeFalse();
  });
});
