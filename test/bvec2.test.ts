import { describe, expect, test } from "bun:test";
import { BVec2 } from "@";

describe("BVec2", () => {
	test("Construct", () => {
		const v0 = BVec2.splat(true);
		const v1 = new BVec2(true, false);

		expect(v0).toEqual(new BVec2(true, true));
		expect(v1).toEqual(new BVec2(true, false));
	});

	test("Constants", () => {
		expect(BVec2.FALSE).toEqual(new BVec2(false, false));
		expect(BVec2.TRUE).toEqual(new BVec2(true, true));
	});

	test("Bitmask", () => {
		expect(new BVec2(true, false).bitmask()).toBe(1);
		expect(new BVec2(false, true).bitmask()).toBe(2);
		expect(new BVec2(true, true).bitmask()).toBe(3);
		expect(new BVec2(false, false).bitmask()).toBe(0);
	});

	test("Any", () => {
		expect(new BVec2(false, false).any()).toBe(false);
		expect(new BVec2(true, false).any()).toBe(true);
		expect(new BVec2(false, true).any()).toBe(true);
	});

	test("All", () => {
		expect(new BVec2(false, false).all()).toBe(false);
		expect(new BVec2(true, false).all()).toBe(false);
		expect(new BVec2(true, true).all()).toBe(true);
	});

	test("Test", () => {
		const v0 = new BVec2(true, false);
		expect(v0.test(0)).toBe(true);
		expect(v0.test(1)).toBe(false);
	});

	test("Set", () => {
		const v0 = new BVec2(false, false);
		v0.set(0, true);
		v0.set(1, true);
		expect(v0).toEqual(new BVec2(true, true));
	});

	test("Bit And", () => {
		const v0 = new BVec2(true, false);
		const v1 = new BVec2(false, true);
		expect(v0.bitand(v1)).toEqual(new BVec2(false, false));
	});

	test("Bit Or", () => {
		const v0 = new BVec2(true, false);
		const v1 = new BVec2(false, true);
		expect(v0.bitor(v1)).toEqual(new BVec2(true, true));
	});

	test("Bit Xor", () => {
		const v0 = new BVec2(true, false);
		const v1 = new BVec2(false, true);
		expect(v0.bitxor(v1)).toEqual(new BVec2(true, true));
	});

	test("Not", () => {
		expect(new BVec2(true, false).not()).toEqual(new BVec2(false, true));
	});

	test("Equal", () => {
		expect(new BVec2(true, true).eq(new BVec2(true, true))).toBe(true);
		expect(new BVec2(true, false).eq(new BVec2(true, false))).toBe(true);
		expect(new BVec2(true, true).eq(new BVec2(false, false))).toBe(false);
		expect(new BVec2(true, true).eq(true)).toBe(true);
		expect(new BVec2(true, true).eq(false)).toBe(false);
	});

	test("Not Equal", () => {
		expect(new BVec2(true, true).ne(new BVec2(true, true))).toBe(false);
		expect(new BVec2(true, false).ne(new BVec2(true, false))).toBe(false);
		expect(new BVec2(true, true).ne(new BVec2(false, false))).toBe(true);
		expect(new BVec2(true, true).ne(true)).toBe(false);
		expect(new BVec2(true, true).ne(false)).toBe(true);
	});
});
