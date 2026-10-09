import { BVec3, Quat, Vec2, Vec3, Vec4, vec3 } from "@";

describe(Vec3, () => {
  test("construct", () => {
    const v0 = Vec3.splat(1);
    const v1 = new Vec3(1, 2, 3);
    const v2 = Vec3.fromArray([1, 2, 3]);

    expect(v0).toStrictEqual(new Vec3(1, 1, 1));
    expect(v1).toStrictEqual(new Vec3(1, 2, 3));
    expect(v2).toStrictEqual(new Vec3(1, 2, 3));
    expect(v2.toArray()).toStrictEqual([1, 2, 3]);
  });

  test("constants", () => {
    expect(Vec3.ZERO).toStrictEqual(new Vec3(0, 0, 0));
    expect(Vec3.ONE).toStrictEqual(new Vec3(1, 1, 1));
    expect(Vec3.NEG_ONE).toStrictEqual(new Vec3(-1, -1, -1));

    expect(Vec3.MIN).toStrictEqual(
      new Vec3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE),
    );

    expect(Vec3.MAX).toStrictEqual(new Vec3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE));
    expect(Vec3.NAN).toStrictEqual(new Vec3(Number.NaN, Number.NaN, Number.NaN));

    expect(Vec3.INFINITY).toStrictEqual(
      new Vec3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
    );

    expect(Vec3.NEG_INFINITY).toStrictEqual(
      new Vec3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY),
    );

    expect(Vec3.X).toStrictEqual(new Vec3(1, 0, 0));
    expect(Vec3.Y).toStrictEqual(new Vec3(0, 1, 0));
    expect(Vec3.Z).toStrictEqual(new Vec3(0, 0, 1));
    expect(Vec3.NEG_X).toStrictEqual(new Vec3(-1, 0, 0));
    expect(Vec3.NEG_Y).toStrictEqual(new Vec3(0, -1, 0));
    expect(Vec3.NEG_Z).toStrictEqual(new Vec3(0, 0, -1));
    expect(Vec3.AXES).toStrictEqual([new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1)]);
  });

  test("select", () => {
    const mask = new BVec3(true, false, true);
    const ifTrue = new Vec3(1, 1, 1);
    const ifFalse = new Vec3(2, 2, 2);

    expect(Vec3.select(mask, ifTrue, ifFalse)).toStrictEqual(new Vec3(1, 2, 1));
  });

  test("new", () => {
    const v = new Vec3(1, 2, 3);

    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
    expect(v.z).toBe(3);
    expect(v.eq(3)).toBeFalse();
  });

  test("dot", () => {
    const x = new Vec3(1, 0, 0);
    const y = new Vec3(0, 1, 0);
    const z = new Vec3(0, 0, 1);

    expect(x.dot(x)).toBe(1);
    expect(x.dot(y)).toBe(0);
    expect(x.dot(z)).toBe(0);
    expect(y.dot(z)).toBe(0);
    expect(new Vec3(14, 14, 14)).toStrictEqual(new Vec3(1, 2, 3).dotIntoVec(new Vec3(4, 2, 2)));
  });

  test("min/Max", () => {
    const a = new Vec3(0, 2, 1);
    const b = new Vec3(1, 1, 3);

    expect(new Vec3(0, 1, 1)).toStrictEqual(a.min(b));
    expect(new Vec3(0, 1, 1)).toStrictEqual(b.min(a));
    expect(new Vec3(1, 2, 3)).toStrictEqual(a.max(b));
    expect(new Vec3(1, 2, 3)).toStrictEqual(b.max(a));
  });

  test("clamp", () => {
    const min = new Vec3(1, 3, 5);
    const max = new Vec3(6, 8, 10);

    expect(new Vec3(0, 0, 0).clamp(min, max)).toStrictEqual(new Vec3(1, 3, 5));
    expect(new Vec3(2, 2, 6).clamp(min, max)).toStrictEqual(new Vec3(2, 3, 6));
    expect(new Vec3(4, 5, 7).clamp(min, max)).toStrictEqual(new Vec3(4, 5, 7));
    expect(new Vec3(6, 6, 9).clamp(min, max)).toStrictEqual(new Vec3(6, 6, 9));
    expect(new Vec3(7, 7, 11).clamp(min, max)).toStrictEqual(new Vec3(6, 7, 10));
    expect(new Vec3(9, 9, 12).clamp(min, max)).toStrictEqual(new Vec3(6, 8, 10));
  });

  test("hMin/HMax", () => {
    expect(new Vec3(1, 2, 3).minElement()).toBe(1);
    expect(new Vec3(3, 1, 2).minElement()).toBe(1);
    expect(new Vec3(2, 3, 1).minElement()).toBe(1);
    expect(new Vec3(1, 2, 3).maxElement()).toBe(3);
    expect(new Vec3(3, 2, 1).maxElement()).toBe(3);
    expect(new Vec3(2, 3, 1).maxElement()).toBe(3);
  });

  test("cmpeq", () => {
    const v0 = new Vec3(1, 2, 3);
    const v1 = new Vec3(1, 3, 3);

    expect(v0.cmpeq(v1)).toStrictEqual(new BVec3(true, false, true));
  });

  test("cmpne", () => {
    const v0 = new Vec3(1, 2, 3);
    const v1 = new Vec3(1, 3, 4);

    expect(v0.cmpne(v1)).toStrictEqual(new BVec3(false, true, true));
  });

  test("cmpge", () => {
    const v0 = new Vec3(2, 3, 4);
    const v1 = new Vec3(2, 2, 4);

    expect(v0.cmpge(v1)).toStrictEqual(new BVec3(true, true, true));
  });

  test("cmpgt", () => {
    const v0 = new Vec3(2, 4, 5);
    const v1 = new Vec3(2, 3, 4);

    expect(v0.cmpgt(v1)).toStrictEqual(new BVec3(false, true, true));
  });

  test("cmple", () => {
    const v0 = new Vec3(1, 2, 3);
    const v1 = new Vec3(2, 2, 4);

    expect(v0.cmple(v1)).toStrictEqual(new BVec3(true, true, true));
  });

  test("cmplt", () => {
    const v0 = new Vec3(1, 3, 5);
    const v1 = new Vec3(2, 2, 4);

    expect(v0.cmplt(v1)).toStrictEqual(new BVec3(true, false, false));
  });

  test("abs", () => {
    expect(Vec3.ZERO.abs()).toStrictEqual(new Vec3(0, 0, 0));
    expect(Vec3.ONE.abs()).toStrictEqual(new Vec3(1, 1, 1));
    expect(new Vec3(-1, -1, -1).abs()).toStrictEqual(new Vec3(1, 1, 1));
  });

  test("signum", () => {
    const x = new Vec3(2, -2, 0);

    expect(x.signum()).toStrictEqual(new Vec3(1, -1, 1));
  });

  test("isNegativeBitmask", () => {
    const v0 = new Vec3(-1, 2, -3);
    const v1 = new Vec3(1, -2, 3);
    const v2 = new Vec3(-1, -2, -3);

    expect(v0.isNegativeBitmask()).toBe(0b101);
    expect(v1.isNegativeBitmask()).toBe(0b010);
    expect(v2.isNegativeBitmask()).toBe(0b111);
  });

  test("is Finite", () => {
    expect(new Vec3(0, 0, 0).isFinite()).toBeTrue();
    expect(new Vec3(-1e-10, 1e10, 1e5).isFinite()).toBeTrue();
    expect(new Vec3(Number.POSITIVE_INFINITY, 0, -1e5).isFinite()).toBeFalse();
    expect(new Vec3(0, Number.NaN, 1e-2).isFinite()).toBeFalse();
    expect(new Vec3(0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY).isFinite()).toBeFalse();
    expect(Vec3.INFINITY.isFinite()).toBeFalse();
    expect(Vec3.NEG_INFINITY.isFinite()).toBeFalse();
  });

  test("is nan", () => {
    expect(Vec3.NAN.isNan()).toBeTrue();
    expect(Vec3.NAN.isFinite()).toBeFalse();
  });

  test("is nan mask", () => {
    const v0 = new Vec3(Number.NaN, 1, Number.NaN);

    expect(v0.isNanMask()).toStrictEqual(new BVec3(true, false, true));
  });

  test("funcs", () => {
    const x = new Vec3(1, 0, 0);
    const y = new Vec3(0, 1, 0);
    const z = new Vec3(0, 0, 1);

    expect(z.cross(x)).toStrictEqual(y);
    expect(x.cross(y)).toStrictEqual(z);
    expect(x.div(2)).toStrictEqual(new Vec3(0.5, 0, 0));
    expect(x.add(1)).toStrictEqual(new Vec3(2, 1, 1));
    expect(x.sub(1)).toStrictEqual(new Vec3(0, -1, -1));
    expect(x.mul(-2).length()).toBe(2);
    expect(y.mul(3).length()).toBe(3);
    expect(z.mul(-4).length()).toBe(4);
    expect(x.distance(y)).toStrictEqual(Math.sqrt(2));
    expect(x.mul(3).distance(y.mul(-4))).toBe(5);
    expect(z.mul(-5).distance(y.mul(12))).toBe(13);
    expect(x.mul(2).normalize()).toStrictEqual(x);
    expect(x.mul(2).normalizeOrZero()).toStrictEqual(x);
    expect(new Vec3(2, 3, 4).normalize().isNormalized()).toBeTrue();
    expect(new Vec3(2, 4, 8).recip()).toStrictEqual(new Vec3(0.5, 0.25, 0.125));
    expect(new Vec3(1, 2, 3).dot(new Vec3(4, 5, 6))).toStrictEqual(1 * 4 + 2 * 5 + 3 * 6);
    expect(new Vec3(2, 3, 4).length()).toStrictEqual(Math.sqrt(29));
    expect(new Vec3(2, 3, 4).lengthRecip()).toStrictEqual(1 / Math.sqrt(29));
    expect(new Vec3(2, 3, 4).normalize()).toStrictEqual(new Vec3(2, 3, 4).normalize());
  });

  test("length Squared", () => {
    const x = new Vec3(1, 0, 0);
    const y = new Vec3(0, 1, 0);

    expect(y.mul(-3).lengthSquared()).toBe(9);
    expect(x.distanceSquared(y)).toBe(2);
    expect(x.mul(2).distanceSquared(y.mul(-3))).toBe(13);
  });

  test("div Euclid", () => {
    const v0 = new Vec3(5, 9, 11);
    const v1 = new Vec3(2, 2, 3);

    expect(v0.divEuclid(v1)).toStrictEqual(new Vec3(2, 4, 3));
  });

  test("rem Euclid", () => {
    const v0 = new Vec3(5, 9, 11);
    const v1 = new Vec3(2, 2, 3);

    expect(v0.remEuclid(v1)).toStrictEqual(new Vec3(1, 1, 2));
  });

  test("project Reject", () => {
    const v0 = new Vec3(1, 1, 0);
    const v1 = new Vec3(0, 2, 0);
    const v2 = new Vec3(0, 1, 0);

    expect(v0.projectOnto(v1)).toStrictEqual(new Vec3(0, 1, 0));
    expect(v0.rejectFrom(v1)).toStrictEqual(new Vec3(1, 0, 0));
    expect(v0.projectOntoNormalized(v2)).toStrictEqual(new Vec3(0, 1, 0));
    expect(v0.rejectFromNormalized(v2)).toStrictEqual(new Vec3(1, 0, 0));
  });

  test("round", () => {
    expect(new Vec3(1.35, 0, 0).round().x).toBe(1);
    expect(new Vec3(0, 1.5, 0).round().y).toBe(2);
    expect(new Vec3(0, -15.5, 0).round().y).toBe(-16);
    expect(new Vec3(0, 0, 0).round().y).toBe(0);
    expect(new Vec3(0, 21.1, 0).round().y).toBe(21);
    expect(new Vec3(0, 11.123, 0).round().y).toBe(11);
    expect(new Vec3(0, 11.499, 0).round().y).toBe(11);

    expect(new Vec3(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0).round()).toStrictEqual(
      new Vec3(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0),
    );

    expect(new Vec3(Number.NaN, 0, 0).round().x).toBeNaN();
  });

  test("floor", () => {
    expect(new Vec3(1.35, -1.5, 0).floor()).toStrictEqual(new Vec3(1, -2, 0));

    expect(new Vec3(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0).floor()).toStrictEqual(
      new Vec3(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0),
    );

    expect(new Vec3(Number.NaN, 0, 0).floor().x).toBeNaN();

    expect(new Vec3(-2_000_000.123, 10_000_000.123, 0).floor()).toStrictEqual(
      new Vec3(-2_000_001, 10_000_000, 0),
    );
  });

  test("ceil", () => {
    expect(new Vec3(1.35, -1.5, 0).ceil()).toStrictEqual(new Vec3(2, -1, 0));

    expect(new Vec3(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0).ceil()).toStrictEqual(
      new Vec3(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0),
    );

    expect(new Vec3(Number.NaN, 0, 0).ceil().x).toBeNaN();

    expect(new Vec3(-2_000_000.123, 1_000_000.123, 0).ceil()).toStrictEqual(
      new Vec3(-2_000_000, 1_000_001, 0),
    );
  });

  test("trunc", () => {
    expect(new Vec3(1.35, -1.5, 0).trunc()).toStrictEqual(new Vec3(1, -1, 0));

    expect(new Vec3(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0).trunc()).toStrictEqual(
      new Vec3(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0),
    );

    expect(new Vec3(0, Number.NaN, 0).trunc().y).toBeNaN();
    expect(new Vec3(-0, -2_000_000.123, 0).trunc()).toStrictEqual(new Vec3(-0, -2_000_000, 0));
  });

  test("fract gl", () => {
    expect(new Vec3(1.35, -1.5, 0).fractGl().approxEq(new Vec3(0.35, 0.5, 0))).toBeTrue();

    expect(
      new Vec3(-2_000_000.123, 1_000_000.123, 0).fractGl().approxEq(new Vec3(0.877, 0.123, 0)),
    ).toBeTrue();
  });

  test("exp", () => {
    expect(
      new Vec3(1, 2, 0).exp().approxEq(new Vec3(Math.exp(1), Math.exp(2), Math.exp(0))),
    ).toBeTrue();
  });

  test("powf", () => {
    expect(new Vec3(2, 4, 3).powf(2)).toStrictEqual(new Vec3(2 ** 2, 4 ** 2, 3 ** 2));
  });

  test("lerp", () => {
    const v0 = new Vec3(-1, -1, 0);
    const v1 = new Vec3(1, 1, 0);

    expect(v0.lerp(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.lerp(v1, 1).approxEq(v1)).toBeTrue();
    expect(v0.lerp(v1, 0.5).approxEq(new Vec3(0, 0, 0))).toBeTrue();
  });

  test("midpoint", () => {
    const v1 = new Vec3(1, 2, 3);
    const v2 = new Vec3(4, 6, 8);
    const expectedMidpoint = new Vec3(2.5, 4, 5.5);

    expect(v1.midpoint(v2)).toStrictEqual(expectedMidpoint);
  });

  test("absDiffEq", () => {
    const v0 = new Vec3(1.0001, 2, 3.0002);
    const v1 = new Vec3(1, 2.0001, 3);

    expect(v0.absDiffEq(v1, 0.0002)).toBeTrue();
  });

  test("clamp Length", () => {
    expect(new Vec3(12, 16, 0).clampLength(7, 10)).toStrictEqual(new Vec3(6, 8, 0));
    expect(new Vec3(2, 1, 0).clampLength(0.5, 5)).toStrictEqual(new Vec3(2, 1, 0));
    expect(new Vec3(0.6, 0.8, 0).clampLength(10, 20)).toStrictEqual(new Vec3(6, 8, 0));
  });

  test("clamp Length Max", () => {
    expect(new Vec3(12, 16, 0).clampLengthMax(10)).toStrictEqual(new Vec3(6, 8, 0));
    expect(new Vec3(2, 1, 0).clampLengthMax(5)).toStrictEqual(new Vec3(2, 1, 0));
  });

  test("clamp Length Min", () => {
    expect(new Vec3(2, 1, 0).clampLengthMin(0.5)).toStrictEqual(new Vec3(2, 1, 0));
    expect(new Vec3(0.6, 0.8, 0).clampLengthMin(10)).toStrictEqual(new Vec3(6, 8, 0));
  });

  test("mulAdd", () => {
    expect(new Vec3(1, 1, 0).mulAdd(new Vec3(0.5, 2, 0), new Vec3(-1, -1, 0))).toStrictEqual(
      new Vec3(-0.5, 1, 0),
    );
  });

  test("angle Between", () => {
    let angle = new Vec3(1, 0, 1).angleBetween(new Vec3(1, 1, 0));

    expect(Math.abs(angle - Math.PI / 3) < 1e-6).toBeTrue();
    angle = new Vec3(10, 0, 10).angleBetween(new Vec3(5, 5, 0));
    expect(Math.abs(angle - Math.PI / 3) < 1e-6).toBeTrue();
    angle = new Vec3(-1, 0, -1).angleBetween(new Vec3(1, -1, 0));
    expect(Math.abs(angle - (2 * Math.PI) / 3) < 1e-6).toBeTrue();
  });

  test("any Orthogonal and Orthonormal", () => {
    const eps = 2 * Number.EPSILON;

    const vectors = [
      new Vec3(0.1, 0.2, 0.3),
      new Vec3(0.2, 0.3, 0.4),
      new Vec3(4, -5, 6),
      new Vec3(-2, 0.5, -1),
      new Vec3(0.00038527316, 0.00038460016, -0.99999988079),
      new Vec3(-0.00019813581, -0.00008946839, -0.99999988079),
    ];

    for (const v of vectors) {
      const orthogonal = v.anyOrthogonalVector();

      expect(orthogonal).not.toStrictEqual(Vec3.ZERO);
      expect(orthogonal.isFinite()).toBeTrue();
      expect(Math.abs(v.dot(orthogonal)) < eps).toBeTrue();

      const n = v.normalize();
      const orthonormal = n.anyOrthonormalVector();

      expect(orthonormal.isNormalized()).toBeTrue();
      expect(Math.abs(n.dot(orthonormal)) < eps).toBeTrue();

      const [a, b] = n.anyOrthonormalPair();

      expect(a.isNormalized()).toBeTrue();
      expect(Math.abs(n.dot(a)) < eps).toBeTrue();
      expect(b.isNormalized()).toBeTrue();
      expect(Math.abs(n.dot(b)) < eps).toBeTrue();
    }
  });

  test("negatives", () => {
    expect(new Vec3(1, 2, 1).neg()).toStrictEqual(new Vec3(-1, -2, -1));
    expect(new Vec3(0, 0, 0).neg()).toStrictEqual(new Vec3(-0, -0, -0));
    expect(new Vec3(-0, -0, -0).neg()).toStrictEqual(new Vec3(0, 0, 0));
  });

  test("remainder", () => {
    const v0 = new Vec3(5, 10, 15);
    const v1 = new Vec3(2, 3, 4);

    expect(v0.rem(v1)).toStrictEqual(new Vec3(1, 1, 3));
    expect(v0.rem(3)).toStrictEqual(new Vec3(2, 1, 0));
  });

  test("not Equal", () => {
    const v0 = new Vec3(1, 2, 3);
    const v1 = new Vec3(1, 3, 3);

    expect(v0.ne(v1)).toBeTrue();
    expect(v0.ne(2)).toBeTrue();
  });

  test("assign Operators", () => {
    const v = new Vec3(1, 2, 3);

    expect(v.addAssign(new Vec3(1, 2, 3))).toBe(v);
    expect(v).toStrictEqual(new Vec3(2, 4, 6));
    expect(v.addAssign(1)).toStrictEqual(new Vec3(3, 5, 7));
    expect(v.subAssign(new Vec3(1, 1, 1))).toStrictEqual(new Vec3(2, 4, 6));
    expect(v.subAssign(2)).toStrictEqual(new Vec3(0, 2, 4));
    expect(v.mulAssign(new Vec3(2, 3, 4))).toStrictEqual(new Vec3(0, 6, 16));
    expect(v.mulAssign(0.5)).toStrictEqual(new Vec3(0, 3, 8));
    expect(v.divAssign(new Vec3(1, 3, 2))).toStrictEqual(new Vec3(0, 1, 4));
    expect(v.divAssign(2)).toStrictEqual(new Vec3(0, 0.5, 2));
    expect(v.remAssign(new Vec3(1, 1, 3))).toStrictEqual(new Vec3(0, 0.5, 2));
    expect(v.remAssign(1.5)).toStrictEqual(new Vec3(0, 0.5, 0.5));
  });

  test("clone", () => {
    const v = new Vec3(1, 2, 3);
    const c = v.clone();

    expect(c).toStrictEqual(v);
    expect(c).not.toBe(v);
    c.x = 5;
    expect(v.x).toBe(1);
  });

  test("clamp Length Returns A Copy", () => {
    const v = new Vec3(2, 1, 0);

    for (const clamped of [v.clampLength(0.5, 5), v.clampLengthMax(5), v.clampLengthMin(0.5)]) {
      expect(clamped).toStrictEqual(v);
      expect(clamped).not.toBe(v);
    }
  });

  test("new and vec3", () => {
    expect(Vec3.new(1, 2, 3)).toStrictEqual(new Vec3(1, 2, 3));
    expect(vec3(1, 2, 3)).toStrictEqual(new Vec3(1, 2, 3));
  });

  test("map", () => {
    const v = new Vec3(1, 2, 3);

    expect(v.map((n) => n + 3)).toStrictEqual(v.add(Vec3.splat(3)));
    expect(v.map(() => 0)).toStrictEqual(Vec3.ZERO);
  });

  test("with", () => {
    expect(Vec3.ZERO.withX(1)).toStrictEqual(Vec3.X);
    expect(Vec3.ZERO.withY(1)).toStrictEqual(Vec3.Y);
    expect(Vec3.ZERO.withZ(1)).toStrictEqual(Vec3.Z);
  });

  test("min position and max position", () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(1, 1, 1);
    const c = new Vec3(3, 2, 1);
    const d = new Vec3(1, 2, 1);
    const e = new Vec3(1, 0, 1);

    expect(a.minPosition()).toBe(0);
    expect(b.minPosition()).toBe(0);
    expect(c.minPosition()).toBe(2);
    expect(d.minPosition()).toBe(0);
    expect(e.minPosition()).toBe(1);
    expect(a.maxPosition()).toBe(2);
    expect(b.maxPosition()).toBe(0);
    expect(c.maxPosition()).toBe(0);
    expect(d.maxPosition()).toBe(1);
    expect(e.maxPosition()).toBe(0);
  });

  test("element sum and product", () => {
    const a = new Vec3(2, 3, 5);

    expect(a.elementSum()).toBe(10);
    expect(a.elementProduct()).toBe(30);
  });

  test("extend and truncate", () => {
    const a = new Vec3(1, 2, 3);
    const b = a.extend(4);

    expect(b).toStrictEqual(new Vec4(1, 2, 3, 4));
    expect(b.truncate()).toStrictEqual(a);
    expect(a.truncate()).toStrictEqual(new Vec2(1, 2));
  });

  test("homogeneous", () => {
    const v = new Vec3(1, 2, 3);

    expect(v.toHomogeneous()).toStrictEqual(new Vec4(1, 2, 3, 1));
    expect(Vec3.fromHomogeneous(v.toHomogeneous()).approxEq(v)).toBeTrue();
    expect(Vec3.fromHomogeneous(new Vec4(2, 4, 6, 2))).toStrictEqual(v);
  });

  test("to and from slice", () => {
    const v = new Vec3(1, 2, 3);
    const a = [0, 0, 0];

    v.writeToSlice(a);
    expect(Vec3.fromSlice(a)).toStrictEqual(v);

    const b = new Float32Array(17);

    v.writeToSlice(b);
    expect(Vec3.fromSlice(b.subarray(0, 3))).toStrictEqual(v);
    expect([...b.subarray(3)]).toStrictEqual(Array.from({ length: 14 }, () => 0));

    expect(() => {
      Vec3.ONE.writeToSlice([0, 0]);
    }).toThrow(RangeError);

    expect(() => Vec3.fromSlice([0, 0])).toThrow(RangeError);
  });

  test("min max nan", () => {
    expect(Vec3.NAN.min(Vec3.ZERO).isNanMask().all()).toBeTrue();
    expect(Vec3.ZERO.min(Vec3.NAN).isNanMask().all()).toBeTrue();
    expect(Vec3.NAN.max(Vec3.ZERO).isNanMask().all()).toBeTrue();
    expect(Vec3.ZERO.max(Vec3.NAN).isNanMask().all()).toBeTrue();
    expect(new Vec3(3, 2, Number.NaN).minElement()).toBeNaN();
    expect(new Vec3(3, 2, Number.NaN).maxElement()).toBeNaN();
    expect(Vec3.NAN.clamp(Vec3.NEG_ONE, Vec3.ONE).isNanMask().all()).toBeTrue();
  });

  test("signum of zeros, infinities and nan", () => {
    expect(Vec3.ZERO.signum()).toStrictEqual(Vec3.ONE);
    expect(Vec3.ZERO.neg().signum()).toStrictEqual(Vec3.NEG_ONE);
    expect(Vec3.ONE.signum()).toStrictEqual(Vec3.ONE);
    expect(Vec3.NEG_ONE.signum()).toStrictEqual(Vec3.NEG_ONE);
    expect(Vec3.INFINITY.signum()).toStrictEqual(Vec3.ONE);
    expect(Vec3.NEG_INFINITY.signum()).toStrictEqual(Vec3.NEG_ONE);
    expect(Vec3.NAN.signum().isNanMask().all()).toBeTrue();
  });

  test("copysign", () => {
    const negZero = Vec3.ZERO.neg();

    expect(Vec3.ZERO.copysign(negZero)).toStrictEqual(negZero);
    expect(negZero.copysign(negZero)).toStrictEqual(negZero);
    expect(Vec3.ZERO.copysign(Vec3.ZERO)).toStrictEqual(Vec3.ZERO);
    expect(negZero.copysign(Vec3.ZERO)).toStrictEqual(Vec3.ZERO);
    expect(Vec3.ONE.copysign(negZero)).toStrictEqual(Vec3.NEG_ONE);
    expect(Vec3.NEG_ONE.copysign(negZero)).toStrictEqual(Vec3.NEG_ONE);
    expect(Vec3.ONE.copysign(Vec3.ZERO)).toStrictEqual(Vec3.ONE);
    expect(Vec3.NEG_ONE.copysign(Vec3.ZERO)).toStrictEqual(Vec3.ONE);
    expect(Vec3.ZERO.copysign(Vec3.NEG_ONE)).toStrictEqual(negZero);
    expect(negZero.copysign(Vec3.NEG_ONE)).toStrictEqual(negZero);
    expect(Vec3.ZERO.copysign(Vec3.ONE)).toStrictEqual(Vec3.ZERO);
    expect(negZero.copysign(Vec3.ONE)).toStrictEqual(Vec3.ZERO);
    expect(Vec3.ONE.copysign(Vec3.NEG_ONE)).toStrictEqual(Vec3.NEG_ONE);
    expect(Vec3.NEG_ONE.copysign(Vec3.NEG_ONE)).toStrictEqual(Vec3.NEG_ONE);
    expect(Vec3.ONE.copysign(Vec3.ONE)).toStrictEqual(Vec3.ONE);
    expect(Vec3.NEG_ONE.copysign(Vec3.ONE)).toStrictEqual(Vec3.ONE);
    expect(Vec3.INFINITY.copysign(Vec3.ONE)).toStrictEqual(Vec3.INFINITY);
    expect(Vec3.INFINITY.copysign(Vec3.NEG_ONE)).toStrictEqual(Vec3.NEG_INFINITY);
    expect(Vec3.NEG_INFINITY.copysign(Vec3.ONE)).toStrictEqual(Vec3.INFINITY);
    expect(Vec3.NEG_INFINITY.copysign(Vec3.NEG_ONE)).toStrictEqual(Vec3.NEG_INFINITY);
    expect(Vec3.NAN.copysign(Vec3.ONE).isNanMask().all()).toBeTrue();
    expect(Vec3.NAN.copysign(Vec3.NEG_ONE).isNanMask().all()).toBeTrue();
  });

  test("is negative bitmask and mask", () => {
    expect(Vec3.ZERO.isNegativeBitmask()).toBe(0b000);
    expect(Vec3.ZERO.neg().isNegativeBitmask()).toBe(0b111);
    expect(Vec3.ONE.isNegativeBitmask()).toBe(0b000);
    expect(Vec3.NEG_ONE.isNegativeBitmask()).toBe(0b111);
    expect(new Vec3(-1, 2, 3).isNegativeBitmask()).toBe(0b001);
    expect(new Vec3(8, 3, 1).isNegativeBitmask()).toBe(0b000);
    expect(new Vec3(1, 5, -3).isNegativeBitmask()).toBe(0b100);
    expect(new Vec3(3, -4, 1).isNegativeBitmask()).toBe(0b010);
    expect(new Vec3(-2, 6, -5).isNegativeBitmask()).toBe(0b101);
    expect(Vec3.ZERO.isNegativeMask()).toStrictEqual(new BVec3(false, false, false));
    expect(Vec3.ZERO.neg().isNegativeMask()).toStrictEqual(new BVec3(true, true, true));
    expect(Vec3.ONE.isNegativeMask()).toStrictEqual(new BVec3(false, false, false));
    expect(Vec3.NEG_ONE.isNegativeMask()).toStrictEqual(new BVec3(true, true, true));
    expect(new Vec3(-1, 2, 3).isNegativeMask()).toStrictEqual(new BVec3(true, false, false));
    expect(new Vec3(1, 5, -3).isNegativeMask()).toStrictEqual(new BVec3(false, false, true));
    expect(new Vec3(3, -4, 1).isNegativeMask()).toStrictEqual(new BVec3(false, true, false));
    expect(new Vec3(-2, 6, -5).isNegativeMask()).toStrictEqual(new BVec3(true, false, true));
  });

  test("is finite mask", () => {
    expect(new Vec3(-1, 2, 3).isFiniteMask().all()).toBeTrue();
    expect(new Vec3(Number.POSITIVE_INFINITY, 1, 2).isFiniteMask().all()).toBeFalse();

    expect(new Vec3(Number.NaN, 1, Number.NEGATIVE_INFINITY).isFiniteMask()).toStrictEqual(
      new BVec3(false, true, false),
    );
  });

  test("div euclid and rem euclid with negatives", () => {
    const one = Vec3.ONE;
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
    expect(new Vec3(-42, 0, 0).normalize()).toStrictEqual(new Vec3(-1, 0, 0));
    expect(new Vec3(Math.sqrt(Number.MAX_VALUE), 0, 0).normalize()).toStrictEqual(Vec3.X);
    expect(new Vec3(0, 0, 0).normalize().isFinite()).toBeFalse();
    expect(new Vec3(Number.MIN_VALUE, 0, 0).normalize().isFinite()).toBeFalse();
    expect(new Vec3(Number.POSITIVE_INFINITY, 0, 0).normalize().isFinite()).toBeFalse();
    expect(new Vec3(Number.NaN, 0, 0).normalize().isFinite()).toBeFalse();
  });

  test("try normalize", () => {
    expect(new Vec3(-42, 0, 0).tryNormalize()).toStrictEqual(new Vec3(-1, 0, 0));
    expect(new Vec3(Math.sqrt(Number.MAX_VALUE), 0, 0).tryNormalize()).toStrictEqual(Vec3.X);
    expect(new Vec3(0, 0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec3(Number.MIN_VALUE, 0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec3(Number.POSITIVE_INFINITY, 0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec3(Number.NaN, 0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec3(Number.MAX_VALUE, 0, 0).tryNormalize()).toBeUndefined();
    expect(new Vec3(Number.MAX_VALUE, Number.MAX_VALUE, 0).tryNormalize()).toBeUndefined();
  });

  test("normalize or", () => {
    expect(new Vec3(-42, 0, 0).normalizeOr(Vec3.Y)).toStrictEqual(new Vec3(-1, 0, 0));
    expect(new Vec3(0, 0, 0).normalizeOr(Vec3.Y)).toStrictEqual(Vec3.Y);
    expect(new Vec3(Number.MIN_VALUE, 0, 0).normalizeOr(Vec3.Y)).toStrictEqual(Vec3.Y);
    expect(new Vec3(Number.POSITIVE_INFINITY, 0, 0).normalizeOr(Vec3.Y)).toStrictEqual(Vec3.Y);
    expect(new Vec3(Number.NaN, 0, 0).normalizeOr(Vec3.Y)).toStrictEqual(Vec3.Y);
    expect(new Vec3(Number.MAX_VALUE, 0, 0).normalizeOr(Vec3.Y)).toStrictEqual(Vec3.Y);

    const fallback = Vec3.Y;

    expect(Vec3.ZERO.normalizeOr(fallback)).not.toBe(fallback);
  });

  test("normalize or zero", () => {
    expect(new Vec3(-42, 0, 0).normalizeOrZero()).toStrictEqual(new Vec3(-1, 0, 0));
    expect(new Vec3(0, 0, 0).normalizeOrZero()).toStrictEqual(Vec3.ZERO);
    expect(new Vec3(Number.MIN_VALUE, 0, 0).normalizeOrZero()).toStrictEqual(Vec3.ZERO);
    expect(new Vec3(Number.POSITIVE_INFINITY, 0, 0).normalizeOrZero()).toStrictEqual(Vec3.ZERO);
    expect(new Vec3(Number.NaN, 0, 0).normalizeOrZero()).toStrictEqual(Vec3.ZERO);

    expect(new Vec3(Number.MAX_VALUE, Number.MAX_VALUE, 0).normalizeOrZero()).toStrictEqual(
      Vec3.ZERO,
    );
  });

  test("normalize and length", () => {
    expect(new Vec3(-42, 0, 0).normalizeAndLength()).toStrictEqual([new Vec3(-1, 0, 0), 42]);
    expect(new Vec3(0, 0, 0).normalizeAndLength()).toStrictEqual([Vec3.X, 0]);
    expect(new Vec3(Number.MIN_VALUE, 0, 0).normalizeAndLength()).toStrictEqual([Vec3.X, 0]);

    expect(new Vec3(Number.POSITIVE_INFINITY, 0, 0).normalizeAndLength()).toStrictEqual([
      Vec3.X,
      0,
    ]);

    expect(new Vec3(Number.NaN, 0, 0).normalizeAndLength()).toStrictEqual([Vec3.X, 0]);
    expect(new Vec3(Number.MAX_VALUE, 0, 0).normalizeAndLength()).toStrictEqual([Vec3.X, 0]);
  });

  test("project reject tiny", () => {
    const v = Vec3.splat(1e-20);
    const p = v.projectOnto(v);

    expect(p.isFinite()).toBeTrue();
    expect(p.absDiffEq(v, 1e-6)).toBeTrue();
  });

  test("round half away from zero", () => {
    expect(new Vec3(0, 0, -15.5).round().z).toBe(-16);
    expect(new Vec3(0.5, -0.5, 2.5).round()).toStrictEqual(new Vec3(1, -1, 3));
    expect(new Vec3(-2.5, 3.5, -3.5).round()).toStrictEqual(new Vec3(-3, 4, -4));
    expect(new Vec3(-0, -0.4, 0.4).round()).toStrictEqual(new Vec3(-0, -0, 0));
  });

  test("fract", () => {
    expect(new Vec3(1.35, 1.5, -1.5).fract().approxEq(new Vec3(0.35, 0.5, -0.5))).toBeTrue();

    expect(
      new Vec3(-200_000.123, 1_000_000.123, 1000.9)
        .fract()
        .absDiffEq(new Vec3(-0.123, 0.123, 0.9), 0.002),
    ).toBeTrue();
  });

  test("fract gl matches glam", () => {
    expect(new Vec3(1.35, 1.5, -1.5).fractGl().approxEq(new Vec3(0.35, 0.5, 0.5))).toBeTrue();

    expect(
      new Vec3(-200_000.123, 1_000_000.123, 1000.9)
        .fractGl()
        .absDiffEq(new Vec3(0.877, 0.123, 0.9), 0.002),
    ).toBeTrue();
  });

  test("lerp big difference", () => {
    const v0 = Vec3.splat(-1e30);
    const v1 = Vec3.splat(16);

    expect(v0.lerp(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.lerp(v1, 1).approxEq(v1)).toBeTrue();
  });

  test("lerp monotonic", () => {
    const v0 = Vec3.NEG_ONE;
    const v1 = Vec3.ONE;

    expect(v0.lerpMonotonic(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.lerpMonotonic(v1, 1).approxEq(v1)).toBeTrue();
    expect(v0.lerpMonotonic(v1, 0.5).approxEq(Vec3.ZERO)).toBeTrue();

    const a = Vec3.splat(0.1);

    expect(a.lerpMonotonic(a, 0.25)).toStrictEqual(a);

    const b = Vec3.splat(0.1 + 1e-7);
    let previous = a.lerpMonotonic(b, 0);

    for (let i = 1; i <= 100; i += 1) {
      const v = a.lerpMonotonic(b, i / 100);

      expect(v.cmpge(previous).all()).toBeTrue();
      previous = v;
    }

    expect(v0.lerpMonotonic(v1, -1).approxEq(Vec3.splat(-3))).toBeTrue();
    expect(v0.lerpMonotonic(v1, 2).approxEq(Vec3.splat(3))).toBeTrue();
    expect(Vec3.splat(-1e30).lerpMonotonic(Vec3.splat(16), 1)).toStrictEqual(Vec3.ZERO);

    const max = Vec3.MAX;

    expect(max.lerp(max.neg(), 0.5)).toStrictEqual(Vec3.ZERO);

    const overflowed = max.lerpMonotonic(max.neg(), 0.5);

    expect(overflowed.isFinite()).toBeFalse();
    expect(overflowed.isNan()).toBeFalse();
    expect(max.lerpMonotonic(max.neg(), 0).isNan()).toBeTrue();
  });

  test("move towards", () => {
    const v0 = Vec3.NEG_ONE;
    const v1 = Vec3.ONE;

    expect(v0.moveTowards(v1, 0).approxEq(v0)).toBeTrue();
    expect(v0.moveTowards(v1, v0.distance(v1)).approxEq(v1)).toBeTrue();
    expect(v0.moveTowards(v1, v0.distance(v1) + 1).approxEq(v1)).toBeTrue();
    expect(v0.moveTowards(v1, 10)).not.toBe(v1);
  });

  test("rotate x, y and z", () => {
    const half = Math.SQRT2 / 2;

    expect(Vec3.Y.rotateX(0).approxEq(Vec3.Y)).toBeTrue();
    expect(Vec3.Y.rotateX(Math.PI / 2).approxEq(Vec3.Z)).toBeTrue();
    expect(Vec3.Y.rotateX(Math.PI / 4).approxEq(new Vec3(0, half, half))).toBeTrue();
    expect(Vec3.X.rotateY(0).approxEq(Vec3.X)).toBeTrue();
    expect(Vec3.X.rotateY(Math.PI / 2).approxEq(Vec3.NEG_Z)).toBeTrue();
    expect(Vec3.X.rotateY(Math.PI / 4).approxEq(new Vec3(half, 0, -half))).toBeTrue();
    expect(Vec3.X.rotateZ(0).approxEq(Vec3.X)).toBeTrue();
    expect(Vec3.X.rotateZ(Math.PI / 2).approxEq(Vec3.Y)).toBeTrue();
    expect(Vec3.Y.rotateZ(Math.PI / 4).approxEq(new Vec3(-half, half, 0))).toBeTrue();
  });

  test("rotate axis", () => {
    const eps = 1.1920929e-7;
    const half = Math.SQRT2 / 2;
    const axis = new Vec3(1, 1, 1).normalize();

    expect(
      Quat.fromRotationX(Math.PI / 4)
        .mul(Vec3.Y)
        .absDiffEq(Vec3.Y.rotateX(Math.PI / 4), eps),
    ).toBeTrue();

    expect(
      Quat.fromRotationY(Math.PI / 4)
        .mul(Vec3.Y)
        .absDiffEq(Vec3.Y.rotateY(Math.PI / 4), eps),
    ).toBeTrue();

    expect(
      Quat.fromRotationZ(Math.PI / 4)
        .mul(Vec3.Y)
        .absDiffEq(Vec3.Y.rotateZ(Math.PI / 4), eps),
    ).toBeTrue();

    expect(Vec3.NEG_X.rotateAxis(axis, 0).absDiffEq(Vec3.NEG_X, eps)).toBeTrue();
    expect(Vec3.X.rotateAxis(axis, (Math.PI * 2) / 3).absDiffEq(Vec3.Y, eps)).toBeTrue();

    expect(
      Vec3.X.rotateAxis(Vec3.Z, Math.PI / 4).absDiffEq(new Vec3(half, half, 0), eps),
    ).toBeTrue();

    expect(
      Quat.fromAxisAngle(axis, (Math.PI * 2) / 3)
        .mul(Vec3.X)
        .absDiffEq(Vec3.X.rotateAxis(axis, (Math.PI * 2) / 3), eps),
    ).toBeTrue();

    expect(Vec3.X.rotateAxis(Vec3.ZERO, 0)).toStrictEqual(Vec3.X);
  });

  test("rotate axis matches quat", () => {
    const axis = new Vec3(0.2, -0.7, 0.4).normalize();
    const v = new Vec3(3, -1.5, 0.25);

    for (const angle of [-2.5, -0.1, 0, 0.3, 1.7, Math.PI]) {
      expect(v.rotateAxis(axis, angle)).toStrictEqual(Quat.fromAxisAngle(axis, angle).mul(v));
    }
  });

  test("rotate towards", () => {
    const eps = 1.1920929e-7;
    const half = Math.SQRT2 / 2;

    expect(Vec3.X.rotateTowards(Vec3.X, Math.PI / 2).absDiffEq(Vec3.X, eps)).toBeTrue();

    expect(
      Vec3.Y.mul(2)
        .rotateTowards(Vec3.Y, Math.PI / 2)
        .absDiffEq(Vec3.Y.mul(2), eps),
    ).toBeTrue();

    expect(Vec3.Z.rotateTowards(Vec3.Z, Math.PI / 2).absDiffEq(Vec3.Z, eps)).toBeTrue();
    expect(Vec3.X.rotateTowards(Vec3.NEG_Y, 0).absDiffEq(Vec3.X, eps)).toBeTrue();

    expect(
      Vec3.X.rotateTowards(Vec3.NEG_Y, Math.PI / 4).absDiffEq(new Vec3(half, -half, 0), eps),
    ).toBeTrue();

    expect(
      Vec3.X.rotateTowards(Vec3.Z, Math.PI / 4).absDiffEq(new Vec3(half, 0, half), eps),
    ).toBeTrue();

    expect(Vec3.X.rotateTowards(Vec3.NEG_Y, Math.PI / 2).absDiffEq(Vec3.NEG_Y, eps)).toBeTrue();
    expect(Vec3.X.rotateTowards(Vec3.NEG_Y, Math.PI).absDiffEq(Vec3.NEG_Y, eps)).toBeTrue();

    expect(
      Vec3.X.rotateTowards(Vec3.NEG_Y, -Math.PI / 4).absDiffEq(new Vec3(half, half, 0), eps),
    ).toBeTrue();

    expect(Vec3.X.rotateTowards(Vec3.NEG_Y, -Math.PI / 2).absDiffEq(Vec3.Y, eps)).toBeTrue();
    expect(Vec3.X.rotateTowards(Vec3.NEG_Y, -Math.PI).absDiffEq(Vec3.Y, 2e-7)).toBeTrue();

    expect(
      Vec3.X.mul(2)
        .rotateTowards(Vec3.NEG_Y, Math.PI / 2)
        .absDiffEq(Vec3.NEG_Y.mul(2), 2e-7),
    ).toBeTrue();

    expect(
      Vec3.X.rotateTowards(Vec3.NEG_Y.mul(2), Math.PI / 2).absDiffEq(Vec3.NEG_Y, eps),
    ).toBeTrue();

    expect(Vec3.X.rotateTowards(Vec3.NEG_X, Math.PI / 2).absDiffEq(Vec3.Y, eps)).toBeTrue();
  });

  test("slerp", () => {
    const v0 = new Vec3(1, 2, 3);
    const v1 = new Vec3(4, 5, 6);
    const eps = 1.1920929e-7;

    expect(v0.slerp(v1, 0).absDiffEq(v0, eps)).toBeTrue();
    expect(v0.slerp(v1, 1).absDiffEq(v1, eps)).toBeTrue();

    expect(
      Math.abs(v0.slerp(v1, 0.5).length() - (v0.length() + v1.length()) / 2),
    ).toBeLessThanOrEqual(5e-7);

    expect(
      Math.abs(v0.angleBetween(v0.slerp(v1, 0.5)) * 2 - v0.angleBetween(v1)),
    ).toBeLessThanOrEqual(1e-5);

    expect(
      new Vec3(5, 0, 0)
        .slerp(new Vec3(0, 5, 0), 0.5)
        .absDiffEq(new Vec3(5, 5, 0).mul(Math.SQRT1_2), 1e-5),
    ).toBeTrue();
  });

  test("slerp extrapolate", () => {
    expect(Vec3.Y.slerp(Vec3.X, -1).absDiffEq(Vec3.NEG_X, 1e-6)).toBeTrue();
    expect(Vec3.Y.slerp(Vec3.X, 2).absDiffEq(Vec3.NEG_Y, 1e-6)).toBeTrue();
    expect(Vec3.Y.slerp(Vec3.X.mul(1.5), -1).absDiffEq(Vec3.NEG_X.mul(0.5), 1e-6)).toBeTrue();
    expect(Vec3.Y.slerp(Vec3.X.mul(1.5), 2).absDiffEq(Vec3.NEG_Y.mul(2), 1e-6)).toBeTrue();
  });

  test("slerp parallel", () => {
    const eps = 1.1920929e-7;

    expect(Vec3.ONE.slerp(Vec3.splat(2), 0.5).absDiffEq(Vec3.splat(1.5), eps)).toBeTrue();
    expect(Vec3.splat(2).slerp(Vec3.ONE, 0.5).absDiffEq(Vec3.splat(1.5), eps)).toBeTrue();
    expect(Vec3.Y.slerp(Vec3.NEG_Y, 0.5).absDiffEq(Vec3.X, eps)).toBeTrue();
    expect(Vec3.Y.mul(1.5).slerp(Vec3.NEG_Y.mul(0.5), 0.5).absDiffEq(Vec3.X, eps)).toBeTrue();
    expect(Vec3.Y.mul(0.5).slerp(Vec3.NEG_Y.mul(1.5), 0.5).absDiffEq(Vec3.X, eps)).toBeTrue();
  });

  test("slerp zero length", () => {
    const eps = 1.1920929e-7;

    expect(Vec3.ZERO.slerp(Vec3.ZERO, 0.5).absDiffEq(Vec3.ZERO, eps)).toBeTrue();
    expect(Vec3.ZERO.slerp(Vec3.ONE, 0.5).absDiffEq(Vec3.splat(0.5), eps)).toBeTrue();
    expect(Vec3.ONE.slerp(Vec3.ZERO, 0.5).absDiffEq(Vec3.splat(0.5), eps)).toBeTrue();
  });

  test("angle to", () => {
    expect(Vec3.X.angleTo(Vec3.Y, Vec3.Z)).toBeCloseTo(Math.PI / 2, 6);
    expect(Vec3.X.rotateZ(Vec3.X.angleTo(Vec3.Y, Vec3.Z)).approxEq(Vec3.Y)).toBeTrue();
    expect(Vec3.Y.rotateZ(Vec3.Y.angleTo(Vec3.X, Vec3.Z)).approxEq(Vec3.X)).toBeTrue();
    expect(Vec3.X.angleTo(Vec3.Y, Vec3.NEG_Z)).toBeCloseTo(-Math.PI / 2, 6);
    expect(Vec3.X.angleTo(Vec3.X, Vec3.Z)).toBeCloseTo(0, 6);
    expect(Vec3.X.angleTo(Vec3.NEG_X, Vec3.Z)).toBeCloseTo(Math.PI, 6);
    expect(new Vec3(5, 0, 0).angleTo(new Vec3(0, 5, 0), Vec3.Z)).toBeCloseTo(Math.PI / 2, 6);
  });

  test("angle between is clamped", () => {
    const v = new Vec3(0.1, 0.2, 0.3);

    expect(v.angleBetween(v)).toBe(0);
    expect(v.angleBetween(v.neg())).toBeCloseTo(Math.PI, 6);
  });

  test("any orthonormal for axes", () => {
    const eps = 2 * Number.EPSILON;

    for (const v of [Vec3.X, Vec3.Y, Vec3.Z, Vec3.NEG_X, Vec3.NEG_Y, Vec3.NEG_Z]) {
      const orthonormal = v.anyOrthonormalVector();
      const [a, b] = v.anyOrthonormalPair();

      expect(orthonormal.isNormalized()).toBeTrue();
      expect(Math.abs(v.dot(orthonormal)) < eps).toBeTrue();
      expect(a.isNormalized()).toBeTrue();
      expect(Math.abs(v.dot(a)) < eps).toBeTrue();
      expect(b.isNormalized()).toBeTrue();
      expect(Math.abs(v.dot(b)) < eps).toBeTrue();
    }
  });

  test("exp2, ln, log2 and sqrt", () => {
    const v = new Vec3(1, 2, 3);

    expect(v.exp2().absDiffEq(new Vec3(2 ** 1, 2 ** 2, 2 ** 3), 1e-5)).toBeTrue();
    expect(v.ln().absDiffEq(new Vec3(Math.log(1), Math.log(2), Math.log(3)), 1e-5)).toBeTrue();
    expect(Vec3.NEG_ONE.ln().isNan()).toBeTrue();
    expect(Vec3.ZERO.ln()).toStrictEqual(Vec3.NEG_INFINITY);
    expect(v.log2().absDiffEq(new Vec3(Math.log2(1), Math.log2(2), Math.log2(3)), 1e-5)).toBeTrue();
    expect(Vec3.NEG_ONE.log2().isNan()).toBeTrue();
    expect(Vec3.ZERO.log2()).toStrictEqual(Vec3.NEG_INFINITY);
    expect(v.sqrt().absDiffEq(new Vec3(Math.sqrt(1), Math.sqrt(2), Math.sqrt(3)), 1e-5)).toBeTrue();
    expect(Vec3.NEG_ONE.sqrt().isNan()).toBeTrue();
  });

  test("sin, cos and sin cos", () => {
    const v = new Vec3(1, 2, 3);
    const sin = new Vec3(Math.sin(1), Math.sin(2), Math.sin(3));
    const cos = new Vec3(Math.cos(1), Math.cos(2), Math.cos(3));
    const [s, c] = v.sinCos();

    expect(v.sin().absDiffEq(sin, 1e-5)).toBeTrue();
    expect(v.cos().absDiffEq(cos, 1e-5)).toBeTrue();
    expect(s.absDiffEq(sin, 1e-5)).toBeTrue();
    expect(c.absDiffEq(cos, 1e-5)).toBeTrue();
  });

  test("step, smoothstep and saturate", () => {
    expect(new Vec3(1, 2, 3).step(Vec3.splat(2.5))).toStrictEqual(new Vec3(1, 1, 0));
    expect(new Vec3(1, 2, 3).step(Vec3.splat(2))).toStrictEqual(new Vec3(1, 1, 0));

    const t = new Vec3(0, 0.25, 1);
    const expected = t.mul(t).mul(t.mul(-2).add(3));

    expect(
      new Vec3(-2, 0, 4).smoothstep(Vec3.splat(-1), Vec3.splat(3)).absDiffEq(expected, 1e-5),
    ).toBeTrue();

    expect(new Vec3(-1, 0.5, 3).saturate()).toStrictEqual(new Vec3(0, 0.5, 1));
  });

  test("reflect", () => {
    expect(new Vec3(1, -1, 1).reflect(Vec3.Y).approxEq(Vec3.ONE)).toBeTrue();
  });

  test("refract", () => {
    let incident = Vec3.NEG_ONE.normalize();
    const normal = Vec3.ONE.normalize();

    expect(incident.refract(normal, 0.5).approxEq(incident)).toBeTrue();
    incident = new Vec3(1, -1, 0).normalize();
    expect(incident.refract(Vec3.Y, 1.5).approxEq(Vec3.ZERO)).toBeTrue();
  });

  test("arithmetic operators", () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 8, 6);

    expect(a.add(b)).toStrictEqual(new Vec3(5, 10, 9));
    expect(a.add(2)).toStrictEqual(new Vec3(3, 4, 5));
    expect(a.sub(b)).toStrictEqual(new Vec3(-3, -6, -3));
    expect(a.sub(2)).toStrictEqual(new Vec3(-1, 0, 1));
    expect(a.mul(b)).toStrictEqual(new Vec3(4, 16, 18));
    expect(a.mul(2)).toStrictEqual(new Vec3(2, 4, 6));
    expect(b.div(a)).toStrictEqual(new Vec3(4, 4, 2));
    expect(b.div(2)).toStrictEqual(new Vec3(2, 4, 3));
  });

  test("equality with scalars and vectors", () => {
    const a = Vec3.splat(2);

    expect(a.eq(2)).toBeTrue();
    expect(a.eq(3)).toBeFalse();
    expect(a.eq(Vec3.splat(2))).toBeTrue();
    expect(a.ne(2)).toBeFalse();
    expect(a.ne(new Vec3(1, 2, 3))).toBeTrue();
    expect(a.approxEq(2 + 1e-7)).toBeTrue();
    expect(a.approxEq(2.1)).toBeFalse();
    expect(a.approxEq(Vec3.splat(2 + 1e-7))).toBeTrue();
    expect(a.approxEq(Vec3.splat(2.1))).toBeFalse();
  });
});
