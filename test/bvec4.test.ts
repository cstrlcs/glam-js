import { BVec4, bvec4 } from "@";

describe(BVec4, () => {
  test("construct", () => {
    const v0 = BVec4.splat(true);
    const v1 = new BVec4(true, false, true, false);

    expect(v0).toStrictEqual(new BVec4(true, true, true, true));
    expect(v1).toStrictEqual(new BVec4(true, false, true, false));
  });

  test("constants", () => {
    expect(BVec4.FALSE).toStrictEqual(new BVec4(false, false, false, false));
    expect(BVec4.TRUE).toStrictEqual(new BVec4(true, true, true, true));
  });

  test("bitmask", () => {
    expect(new BVec4(true, false, false, false).bitmask()).toBe(1);
    expect(new BVec4(false, true, false, false).bitmask()).toBe(2);
    expect(new BVec4(false, false, true, false).bitmask()).toBe(4);
    expect(new BVec4(false, false, false, true).bitmask()).toBe(8);
    expect(new BVec4(true, true, true, true).bitmask()).toBe(15);
    expect(new BVec4(false, false, false, false).bitmask()).toBe(0);
  });

  test("any", () => {
    expect(new BVec4(false, false, false, false).any()).toBe(false);
    expect(new BVec4(true, false, false, false).any()).toBe(true);
    expect(new BVec4(false, true, false, false).any()).toBe(true);
    expect(new BVec4(false, false, true, false).any()).toBe(true);
    expect(new BVec4(false, false, false, true).any()).toBe(true);
  });

  test("all", () => {
    expect(new BVec4(false, false, false, false).all()).toBe(false);
    expect(new BVec4(true, false, false, false).all()).toBe(false);
    expect(new BVec4(true, true, true, true).all()).toBe(true);
  });

  test("get by index", () => {
    const v0 = new BVec4(true, false, true, false);

    expect(v0.test(0)).toBe(true);
    expect(v0.test(1)).toBe(false);
    expect(v0.test(2)).toBe(true);
    expect(v0.test(3)).toBe(false);
  });

  test("set", () => {
    const v0 = new BVec4(false, false, false, false);

    v0.set(0, true);
    v0.set(1, true);
    v0.set(2, true);
    v0.set(3, true);
    expect(v0).toStrictEqual(new BVec4(true, true, true, true));
  });

  test("get and set out of bounds", () => {
    const v0 = new BVec4(false, false, false, false);

    // @ts-expect-error: index is outside the declared range
    expect(() => v0.test(4)).toThrow(RangeError);

    expect(() => {
      // @ts-expect-error: index is outside the declared range
      v0.set(4, true);
    }).toThrow(RangeError);
  });

  test("bit And", () => {
    const v0 = new BVec4(true, false, true, false);
    const v1 = new BVec4(false, true, false, true);

    expect(v0.bitand(v1)).toStrictEqual(new BVec4(false, false, false, false));
  });

  test("bit Or", () => {
    const v0 = new BVec4(true, false, false, false);
    const v1 = new BVec4(false, true, true, true);

    expect(v0.bitor(v1)).toStrictEqual(new BVec4(true, true, true, true));
  });

  test("bit Xor", () => {
    const v0 = new BVec4(true, false, true, false);
    const v1 = new BVec4(false, true, false, true);

    expect(v0.bitxor(v1)).toStrictEqual(new BVec4(true, true, true, true));
  });

  test("not", () => {
    expect(new BVec4(true, false, true, false).not()).toStrictEqual(
      new BVec4(false, true, false, true),
    );
  });

  test("equal", () => {
    expect(new BVec4(true, true, true, true).eq(new BVec4(true, true, true, true))).toBe(true);
    expect(new BVec4(true, false, true, false).eq(new BVec4(true, false, true, false))).toBe(true);
    expect(new BVec4(true, true, true, true).eq(new BVec4(false, false, false, false))).toBe(false);
    expect(new BVec4(true, true, true, true).eq(true)).toBe(true);
    expect(new BVec4(true, true, true, true).eq(false)).toBe(false);
  });

  test("not Equal", () => {
    expect(new BVec4(true, true, true, true).ne(new BVec4(true, true, true, true))).toBe(false);
    expect(new BVec4(true, false, true, false).ne(new BVec4(true, false, true, false))).toBe(false);
    expect(new BVec4(true, true, true, true).ne(new BVec4(false, false, false, false))).toBe(true);
    expect(new BVec4(true, true, true, true).ne(true)).toBe(false);
    expect(new BVec4(true, true, true, true).ne(false)).toBe(true);
  });

  test("new, from array and bvec4", () => {
    expect(BVec4.new(true, false, true, false)).toStrictEqual(new BVec4(true, false, true, false));

    expect(BVec4.fromArray([true, false, true, false])).toStrictEqual(
      new BVec4(true, false, true, false),
    );

    expect(bvec4(true, false, true, false)).toStrictEqual(new BVec4(true, false, true, false));
  });

  test("assign operators", () => {
    const v = new BVec4(true, false, true, false);

    expect(v.bitandAssign(new BVec4(false, true, true, false))).toBe(v);
    expect(v).toStrictEqual(new BVec4(false, false, true, false));

    expect(
      new BVec4(true, false, true, false).bitorAssign(new BVec4(false, true, true, false)),
    ).toStrictEqual(new BVec4(true, true, true, false));

    expect(
      new BVec4(true, false, true, false).bitxorAssign(new BVec4(false, true, true, false)),
    ).toStrictEqual(new BVec4(true, true, false, false));
  });

  test("to string", () => {
    expect(new BVec4(true, false, true, false).toString()).toBe("BVec4(true, false, true, false)");
  });
});
