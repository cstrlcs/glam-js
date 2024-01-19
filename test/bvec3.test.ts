import { describe, expect, test } from "bun:test";
import { BVec3, BVec2, BVec4 } from "@";

describe("BVec3", () => {
	test("Construct", () => {
		const v0 = BVec3.splat(true);
		const v1 = new BVec3(true, false, true);

		expect(v0).toEqual(new BVec3(true, true, true));
		expect(v1).toEqual(new BVec3(true, false, true));
	});

	test("Constants", () => {
		expect(BVec3.FALSE).toEqual(new BVec3(false, false, false));
		expect(BVec3.TRUE).toEqual(new BVec3(true, true, true));
	});

	test("Bitmask", () => {
		expect(new BVec3(true, false, false).bitmask()).toBe(1);
		expect(new BVec3(false, true, false).bitmask()).toBe(2);
		expect(new BVec3(false, false, true).bitmask()).toBe(4);
		expect(new BVec3(true, true, true).bitmask()).toBe(7);
		expect(new BVec3(false, false, false).bitmask()).toBe(0);
	});

	test("Any", () => {
		expect(new BVec3(false, false, false).any()).toBe(false);
		expect(new BVec3(true, false, false).any()).toBe(true);
		expect(new BVec3(false, true, false).any()).toBe(true);
		expect(new BVec3(false, false, true).any()).toBe(true);
	});

	test("All", () => {
		expect(new BVec3(false, false, false).all()).toBe(false);
		expect(new BVec3(true, false, false).all()).toBe(false);
		expect(new BVec3(true, true, true).all()).toBe(true);
	});

	test("Test", () => {
		const v0 = new BVec3(true, false, true);
		expect(v0.test(0)).toBe(true);
		expect(v0.test(1)).toBe(false);
		expect(v0.test(2)).toBe(true);
	});

	test("Set", () => {
		const v0 = new BVec3(false, false, false);
		v0.set(0, true);
		v0.set(1, true);
		v0.set(2, true);
		expect(v0).toEqual(new BVec3(true, true, true));
	});

	test("Bit And", () => {
		const v0 = new BVec3(true, false, true);
		const v1 = new BVec3(false, true, false);
		expect(v0.bitand(v1)).toEqual(new BVec3(false, false, false));
	});

	test("Bit Or", () => {
		const v0 = new BVec3(true, false, false);
		const v1 = new BVec3(false, true, true);
		expect(v0.bitor(v1)).toEqual(new BVec3(true, true, true));
	});

	test("Bit Xor", () => {
		const v0 = new BVec3(true, false, true);
		const v1 = new BVec3(false, true, false);
		expect(v0.bitxor(v1)).toEqual(new BVec3(true, true, true));
	});

	test("Not", () => {
		expect(new BVec3(true, false, true).not()).toEqual(
			new BVec3(false, true, false),
		);
	});

	test("Equal", () => {
		expect(new BVec3(true, true, true).eq(new BVec3(true, true, true))).toBe(
			true,
		);
		expect(new BVec3(true, false, true).eq(new BVec3(true, false, true))).toBe(
			true,
		);
		expect(new BVec3(true, true, true).eq(new BVec3(false, false, false))).toBe(
			false,
		);
		expect(new BVec3(true, true, true).eq(true)).toBe(true);
		expect(new BVec3(true, true, true).eq(false)).toBe(false);
	});

	test("Not Equal", () => {
		expect(new BVec3(true, true, true).ne(new BVec3(true, true, true))).toBe(
			false,
		);
		expect(new BVec3(true, false, true).ne(new BVec3(true, false, true))).toBe(
			false,
		);
		expect(new BVec3(true, true, true).ne(new BVec3(false, false, false))).toBe(
			true,
		);
		expect(new BVec3(true, true, true).ne(true)).toBe(false);
		expect(new BVec3(true, true, true).ne(false)).toBe(true);
	});

	test("Swizzle", () => {
		const vec = new BVec3(true, false, true);

		expect(vec._`xy`).toEqual(new BVec2(true, false));
		expect(vec._`yx`).toEqual(new BVec2(false, true));
		expect(vec._`yxz`).toEqual(new BVec3(false, true, true));
		expect(vec._`yxyz`).toEqual(new BVec4(false, true, false, true));

		expect(() => vec._`xywz`).toThrow(
			"Invalid parameters. Only [x, y, z] are allowed.",
		);

		expect(() => vec._`y`).toThrow("Invalid number of parameters.");
		expect(() => vec._`yyyyy`).toThrow("Invalid number of parameters.");
	});
});
