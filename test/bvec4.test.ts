import { describe, expect, test } from "bun:test";
import { BVec4 } from "@";

describe("BVec4", () => {
	test("Construct", () => {
		const v0 = BVec4.splat(true);
		const v1 = new BVec4(true, false, true, false);

		expect(v0).toEqual(new BVec4(true, true, true, true));
		expect(v1).toEqual(new BVec4(true, false, true, false));
	});

	test("Constants", () => {
		expect(BVec4.FALSE).toEqual(new BVec4(false, false, false, false));
		expect(BVec4.TRUE).toEqual(new BVec4(true, true, true, true));
	});

	test("Bitmask", () => {
		expect(new BVec4(true, false, false, false).bitmask()).toBe(1);
		expect(new BVec4(false, true, false, false).bitmask()).toBe(2);
		expect(new BVec4(false, false, true, false).bitmask()).toBe(4);
		expect(new BVec4(false, false, false, true).bitmask()).toBe(8);
		expect(new BVec4(true, true, true, true).bitmask()).toBe(15);
		expect(new BVec4(false, false, false, false).bitmask()).toBe(0);
	});

	test("Any", () => {
		expect(new BVec4(false, false, false, false).any()).toBe(false);
		expect(new BVec4(true, false, false, false).any()).toBe(true);
		expect(new BVec4(false, true, false, false).any()).toBe(true);
		expect(new BVec4(false, false, true, false).any()).toBe(true);
		expect(new BVec4(false, false, false, true).any()).toBe(true);
	});

	test("All", () => {
		expect(new BVec4(false, false, false, false).all()).toBe(false);
		expect(new BVec4(true, false, false, false).all()).toBe(false);
		expect(new BVec4(true, true, true, true).all()).toBe(true);
	});

	test("Test", () => {
		const v0 = new BVec4(true, false, true, false);
		expect(v0.test(0)).toBe(true);
		expect(v0.test(1)).toBe(false);
		expect(v0.test(2)).toBe(true);
		expect(v0.test(3)).toBe(false);
	});

	test("Set", () => {
		const v0 = new BVec4(false, false, false, false);
		v0.set(0, true);
		v0.set(1, true);
		v0.set(2, true);
		v0.set(3, true);
		expect(v0).toEqual(new BVec4(true, true, true, true));
	});

	test("Bit And", () => {
		const v0 = new BVec4(true, false, true, false);
		const v1 = new BVec4(false, true, false, true);
		expect(v0.bitand(v1)).toEqual(new BVec4(false, false, false, false));
	});

	test("Bit Or", () => {
		const v0 = new BVec4(true, false, false, false);
		const v1 = new BVec4(false, true, true, true);
		expect(v0.bitor(v1)).toEqual(new BVec4(true, true, true, true));
	});

	test("Bit Xor", () => {
		const v0 = new BVec4(true, false, true, false);
		const v1 = new BVec4(false, true, false, true);
		expect(v0.bitxor(v1)).toEqual(new BVec4(true, true, true, true));
	});

	test("Not", () => {
		expect(new BVec4(true, false, true, false).not()).toEqual(
			new BVec4(false, true, false, true),
		);
	});

	test("Equal", () => {
		expect(
			new BVec4(true, true, true, true).eq(new BVec4(true, true, true, true)),
		).toBe(true);
		expect(
			new BVec4(true, false, true, false).eq(
				new BVec4(true, false, true, false),
			),
		).toBe(true);
		expect(
			new BVec4(true, true, true, true).eq(
				new BVec4(false, false, false, false),
			),
		).toBe(false);
		expect(new BVec4(true, true, true, true).eq(true)).toBe(true);
		expect(new BVec4(true, true, true, true).eq(false)).toBe(false);
	});

	test("Not Equal", () => {
		expect(
			new BVec4(true, true, true, true).ne(new BVec4(true, true, true, true)),
		).toBe(false);

		expect(
			new BVec4(true, false, true, false).ne(
				new BVec4(true, false, true, false),
			),
		).toBe(false);

		expect(
			new BVec4(true, true, true, true).ne(
				new BVec4(false, false, false, false),
			),
		).toBe(true);

		expect(new BVec4(true, true, true, true).ne(true)).toBe(false);
		expect(new BVec4(true, true, true, true).ne(false)).toBe(true);
	});
});
