import { BVec3, bvec3 } from "@";

describe(BVec3, () => {
  test("construct", () => {
    const v0 = BVec3.splat(true);
    const v1 = new BVec3(true, false, true);

    expect(v0).toStrictEqual(new BVec3(true, true, true));
    expect(v1).toStrictEqual(new BVec3(true, false, true));
  });

  test("constants", () => {
    expect(BVec3.FALSE).toStrictEqual(new BVec3(false, false, false));
    expect(BVec3.TRUE).toStrictEqual(new BVec3(true, true, true));
  });

  test("bitmask", () => {
    expect(new BVec3(true, false, false).bitmask()).toBe(1);
    expect(new BVec3(false, true, false).bitmask()).toBe(2);
    expect(new BVec3(false, false, true).bitmask()).toBe(4);
    expect(new BVec3(true, true, true).bitmask()).toBe(7);
    expect(new BVec3(false, false, false).bitmask()).toBe(0);
  });

  test("any", () => {
    expect(new BVec3(false, false, false).any()).toBe(false);
    expect(new BVec3(true, false, false).any()).toBe(true);
    expect(new BVec3(false, true, false).any()).toBe(true);
    expect(new BVec3(false, false, true).any()).toBe(true);
  });

  test("all", () => {
    expect(new BVec3(false, false, false).all()).toBe(false);
    expect(new BVec3(true, false, false).all()).toBe(false);
    expect(new BVec3(true, true, true).all()).toBe(true);
  });

  test("get by index", () => {
    const v0 = new BVec3(true, false, true);

    expect(v0.test(0)).toBe(true);
    expect(v0.test(1)).toBe(false);
    expect(v0.test(2)).toBe(true);
  });

  test("set", () => {
    const v0 = new BVec3(false, false, false);

    v0.set(0, true);
    v0.set(1, true);
    v0.set(2, true);
    expect(v0).toStrictEqual(new BVec3(true, true, true));
  });

  test("get and set out of bounds", () => {
    const v0 = new BVec3(false, false, false);

    // @ts-expect-error: index is outside the declared range
    expect(() => v0.test(3)).toThrow(RangeError);

    expect(() => {
      // @ts-expect-error: index is outside the declared range
      v0.set(3, true);
    }).toThrow(RangeError);
  });

  test("bit And", () => {
    const v0 = new BVec3(true, false, true);
    const v1 = new BVec3(false, true, false);

    expect(v0.bitand(v1)).toStrictEqual(new BVec3(false, false, false));
  });

  test("bit Or", () => {
    const v0 = new BVec3(true, false, false);
    const v1 = new BVec3(false, true, true);

    expect(v0.bitor(v1)).toStrictEqual(new BVec3(true, true, true));
  });

  test("bit Xor", () => {
    const v0 = new BVec3(true, false, true);
    const v1 = new BVec3(false, true, false);

    expect(v0.bitxor(v1)).toStrictEqual(new BVec3(true, true, true));
  });

  test("not", () => {
    expect(new BVec3(true, false, true).not()).toStrictEqual(new BVec3(false, true, false));
  });

  test("equal", () => {
    expect(new BVec3(true, true, true).eq(new BVec3(true, true, true))).toBe(true);
    expect(new BVec3(true, false, true).eq(new BVec3(true, false, true))).toBe(true);
    expect(new BVec3(true, true, true).eq(new BVec3(false, false, false))).toBe(false);
    expect(new BVec3(true, true, true).eq(true)).toBe(true);
    expect(new BVec3(true, true, true).eq(false)).toBe(false);
  });

  test("not Equal", () => {
    expect(new BVec3(true, true, true).ne(new BVec3(true, true, true))).toBe(false);
    expect(new BVec3(true, false, true).ne(new BVec3(true, false, true))).toBe(false);
    expect(new BVec3(true, true, true).ne(new BVec3(false, false, false))).toBe(true);
    expect(new BVec3(true, true, true).ne(true)).toBe(false);
    expect(new BVec3(true, true, true).ne(false)).toBe(true);
  });

  test("new, from array and bvec3", () => {
    expect(BVec3.new(true, false, true)).toStrictEqual(new BVec3(true, false, true));
    expect(BVec3.fromArray([true, false, true])).toStrictEqual(new BVec3(true, false, true));
    expect(bvec3(true, false, true)).toStrictEqual(new BVec3(true, false, true));
  });

  test("assign operators", () => {
    const v = new BVec3(true, false, true);

    expect(v.bitandAssign(new BVec3(false, true, true))).toBe(v);
    expect(v).toStrictEqual(new BVec3(false, false, true));

    expect(new BVec3(true, false, true).bitorAssign(new BVec3(false, true, true))).toStrictEqual(
      new BVec3(true, true, true),
    );

    expect(new BVec3(true, false, true).bitxorAssign(new BVec3(false, true, true))).toStrictEqual(
      new BVec3(true, true, false),
    );
  });

  test("to string", () => {
    expect(new BVec3(true, false, true).toString()).toBe("BVec3(true, false, true)");
  });
});
