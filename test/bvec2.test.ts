import { BVec2, bvec2 } from "@";

describe(BVec2, () => {
  test("construct", () => {
    const v0 = BVec2.splat(true);
    const v1 = new BVec2(true, false);

    expect(v0).toStrictEqual(new BVec2(true, true));
    expect(v1).toStrictEqual(new BVec2(true, false));
  });

  test("constants", () => {
    expect(BVec2.FALSE).toStrictEqual(new BVec2(false, false));
    expect(BVec2.TRUE).toStrictEqual(new BVec2(true, true));
  });

  test("bitmask", () => {
    expect(new BVec2(true, false).bitmask()).toBe(1);
    expect(new BVec2(false, true).bitmask()).toBe(2);
    expect(new BVec2(true, true).bitmask()).toBe(3);
    expect(new BVec2(false, false).bitmask()).toBe(0);
  });

  test("any", () => {
    expect(new BVec2(false, false).any()).toBe(false);
    expect(new BVec2(true, false).any()).toBe(true);
    expect(new BVec2(false, true).any()).toBe(true);
  });

  test("all", () => {
    expect(new BVec2(false, false).all()).toBe(false);
    expect(new BVec2(true, false).all()).toBe(false);
    expect(new BVec2(true, true).all()).toBe(true);
  });

  test("get by index", () => {
    const v0 = new BVec2(true, false);

    expect(v0.test(0)).toBe(true);
    expect(v0.test(1)).toBe(false);
  });

  test("set", () => {
    const v0 = new BVec2(false, false);

    v0.set(0, true);
    v0.set(1, true);
    expect(v0).toStrictEqual(new BVec2(true, true));
  });

  test("get and set out of bounds", () => {
    const v0 = new BVec2(false, false);

    // @ts-expect-error: index is outside the declared range
    expect(() => v0.test(2)).toThrow(RangeError);

    expect(() => {
      // @ts-expect-error: index is outside the declared range
      v0.set(2, true);
    }).toThrow(RangeError);
  });

  test("bit And", () => {
    const v0 = new BVec2(true, false);
    const v1 = new BVec2(false, true);

    expect(v0.bitand(v1)).toStrictEqual(new BVec2(false, false));
  });

  test("bit Or", () => {
    const v0 = new BVec2(true, false);
    const v1 = new BVec2(false, true);

    expect(v0.bitor(v1)).toStrictEqual(new BVec2(true, true));
  });

  test("bit Xor", () => {
    const v0 = new BVec2(true, false);
    const v1 = new BVec2(false, true);

    expect(v0.bitxor(v1)).toStrictEqual(new BVec2(true, true));
  });

  test("not", () => {
    expect(new BVec2(true, false).not()).toStrictEqual(new BVec2(false, true));
  });

  test("equal", () => {
    expect(new BVec2(true, true).eq(new BVec2(true, true))).toBe(true);
    expect(new BVec2(true, false).eq(new BVec2(true, false))).toBe(true);
    expect(new BVec2(true, true).eq(new BVec2(false, false))).toBe(false);
    expect(new BVec2(true, true).eq(true)).toBe(true);
    expect(new BVec2(true, true).eq(false)).toBe(false);
  });

  test("not Equal", () => {
    expect(new BVec2(true, true).ne(new BVec2(true, true))).toBe(false);
    expect(new BVec2(true, false).ne(new BVec2(true, false))).toBe(false);
    expect(new BVec2(true, true).ne(new BVec2(false, false))).toBe(true);
    expect(new BVec2(true, true).ne(true)).toBe(false);
    expect(new BVec2(true, true).ne(false)).toBe(true);
  });

  test("new, from array and bvec2", () => {
    expect(BVec2.new(true, false)).toStrictEqual(new BVec2(true, false));
    expect(BVec2.fromArray([true, false])).toStrictEqual(new BVec2(true, false));
    expect(bvec2(true, false)).toStrictEqual(new BVec2(true, false));
  });

  test("assign operators", () => {
    const v = new BVec2(true, false);

    expect(v.bitandAssign(new BVec2(false, true))).toBe(v);
    expect(v).toStrictEqual(new BVec2(false, false));

    expect(new BVec2(true, false).bitorAssign(new BVec2(false, true))).toStrictEqual(
      new BVec2(true, true),
    );

    expect(new BVec2(true, false).bitxorAssign(new BVec2(false, true))).toStrictEqual(
      new BVec2(true, true),
    );
  });

  test("to string", () => {
    expect(new BVec2(true, false).toString()).toBe("BVec2(true, false)");
  });
});
