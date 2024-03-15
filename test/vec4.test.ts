import { describe, expect, test } from "bun:test";
import { BVec4, Vec4 } from "@";

describe("Vec4", () => {
	test("Construct", () => {
		const v0 = Vec4.splat(1);
		const v1 = new Vec4(1, 2, 3, 4);
		const v2 = Vec4.fromArray([1, 2, 3, 4]);

		expect(v0).toEqual(new Vec4(1, 1, 1, 1));
		expect(v1).toEqual(new Vec4(1, 2, 3, 4));
		expect(v2).toEqual(new Vec4(1, 2, 3, 4));
		expect(v2.toArray()).toEqual([1, 2, 3, 4]);
	});

	test("Constants", () => {
		expect(Vec4.ZERO).toEqual(new Vec4(0, 0, 0, 0));
		expect(Vec4.ONE).toEqual(new Vec4(1, 1, 1, 1));
		expect(Vec4.NEG_ONE).toEqual(new Vec4(-1, -1, -1, -1));
		expect(Vec4.MIN).toEqual(
			new Vec4(
				Number.MIN_VALUE,
				Number.MIN_VALUE,
				Number.MIN_VALUE,
				Number.MIN_VALUE,
			),
		);

		expect(Vec4.MAX).toEqual(
			new Vec4(
				Number.MAX_VALUE,
				Number.MAX_VALUE,
				Number.MAX_VALUE,
				Number.MAX_VALUE,
			),
		);

		expect(Vec4.NAN).toEqual(
			new Vec4(Number.NaN, Number.NaN, Number.NaN, Number.NaN),
		);

		expect(Vec4.INFINITY).toEqual(
			new Vec4(
				Number.POSITIVE_INFINITY,
				Number.POSITIVE_INFINITY,
				Number.POSITIVE_INFINITY,
				Number.POSITIVE_INFINITY,
			),
		);

		expect(Vec4.NEG_INFINITY).toEqual(
			new Vec4(
				Number.NEGATIVE_INFINITY,
				Number.NEGATIVE_INFINITY,
				Number.NEGATIVE_INFINITY,
				Number.NEGATIVE_INFINITY,
			),
		);

		expect(Vec4.X).toEqual(new Vec4(1, 0, 0, 0));
		expect(Vec4.Y).toEqual(new Vec4(0, 1, 0, 0));
		expect(Vec4.Z).toEqual(new Vec4(0, 0, 1, 0));
		expect(Vec4.W).toEqual(new Vec4(0, 0, 0, 1));
		expect(Vec4.NEG_X).toEqual(new Vec4(-1, 0, 0, 0));
		expect(Vec4.NEG_Y).toEqual(new Vec4(0, -1, 0, 0));
		expect(Vec4.NEG_Z).toEqual(new Vec4(0, 0, -1, 0));
		expect(Vec4.NEG_W).toEqual(new Vec4(0, 0, 0, -1));
		expect(Vec4.AXES).toEqual([
			new Vec4(1, 0, 0, 0),
			new Vec4(0, 1, 0, 0),
			new Vec4(0, 0, 1, 0),
			new Vec4(0, 0, 0, 1),
		]);
	});

	test("Select", () => {
		const mask = new BVec4(true, false, true, false);
		const ifTrue = new Vec4(1, 1, 1, 1);
		const ifFalse = new Vec4(2, 2, 2, 2);
		expect(Vec4.select(mask, ifTrue, ifFalse)).toEqual(new Vec4(1, 2, 1, 2));
	});

	test("New", () => {
		const v = new Vec4(1, 2, 3, 0);

		expect(v.x).toEqual(1);
		expect(v.y).toEqual(2);
		expect(v.z).toEqual(3);
		expect(v.w).toEqual(0);
		expect(new Vec4(1, 2, 3, 4).eq(4)).toBeFalse();
	});

	test("Dot", () => {
		const x = new Vec4(1, 0, 0, 0);
		const y = new Vec4(0, 1, 0, 0);
		const z = new Vec4(0, 0, 1, 0);

		expect(x.dot(x)).toEqual(1);
		expect(x.dot(y)).toEqual(0);
		expect(x.dot(z)).toEqual(0);
		expect(y.dot(z)).toEqual(0);

		expect(new Vec4(30, 30, 30, 30)).toEqual(
			new Vec4(1, 2, 3, 4).dotIntoVec(new Vec4(1, 2, 3, 4)),
		);
	});

	test("Min/Max", () => {
		const a = new Vec4(0, 2, 1, 0);
		const b = new Vec4(1, 1, 3, 0);

		expect(new Vec4(0, 1, 1, 0)).toEqual(a.min(b));
		expect(new Vec4(0, 1, 1, 0)).toEqual(b.min(a));
		expect(new Vec4(1, 2, 3, 0)).toEqual(a.max(b));
		expect(new Vec4(1, 2, 3, 0)).toEqual(b.max(a));
	});

	test("Clamp", () => {
		const min = new Vec4(1, 3, 5, 0);
		const max = new Vec4(6, 8, 10, 0);

		expect(new Vec4(0, 0, 0, 0).clamp(min, max)).toEqual(new Vec4(1, 3, 5, 0));
		expect(new Vec4(2, 2, 6, 0).clamp(min, max)).toEqual(new Vec4(2, 3, 6, 0));
		expect(new Vec4(4, 5, 7, 0).clamp(min, max)).toEqual(new Vec4(4, 5, 7, 0));
		expect(new Vec4(6, 6, 9, 0).clamp(min, max)).toEqual(new Vec4(6, 6, 9, 0));

		expect(new Vec4(7, 7, 11, 0).clamp(min, max)).toEqual(
			new Vec4(6, 7, 10, 0),
		);

		expect(new Vec4(9, 9, 12, 0).clamp(min, max)).toEqual(
			new Vec4(6, 8, 10, 0),
		);
	});

	test("HMin/HMax", () => {
		expect(new Vec4(1, 2, 3, 0).minElement()).toEqual(0);
		expect(new Vec4(3, 1, 2, 4).minElement()).toEqual(1);
		expect(new Vec4(2, 3, 1, 2).minElement()).toEqual(1);
		expect(new Vec4(1, 2, 3, 4).maxElement()).toEqual(4);
		expect(new Vec4(3, 2, 1, 0).maxElement()).toEqual(3);
		expect(new Vec4(2, 3, 1, 0).maxElement()).toEqual(3);
	});

	test("Cmpeq", () => {
		const v0 = new Vec4(1, 2, 3, 0);
		const v1 = new Vec4(1, 3, 3, 0);
		expect(v0.cmpeq(v1)).toEqual(new BVec4(true, false, true, true));
	});

	test("Cmpne", () => {
		const v0 = new Vec4(1, 2, 3, 0);
		const v1 = new Vec4(1, 3, 4, 0);
		expect(v0.cmpne(v1)).toEqual(new BVec4(false, true, true, false));
	});

	test("Cmpge", () => {
		const v0 = new Vec4(2, 3, 4, 0);
		const v1 = new Vec4(2, 2, 4, 0);
		expect(v0.cmpge(v1)).toEqual(new BVec4(true, true, true, true));
	});

	test("Cmpgt", () => {
		const v0 = new Vec4(2, 4, 5, 0);
		const v1 = new Vec4(2, 3, 4, 1);
		expect(v0.cmpgt(v1)).toEqual(new BVec4(false, true, true, false));
	});

	test("Cmple", () => {
		const v0 = new Vec4(1, 2, 3, 0);
		const v1 = new Vec4(2, 2, 4, 1);
		expect(v0.cmple(v1)).toEqual(new BVec4(true, true, true, true));
	});

	test("Cmplt", () => {
		const v0 = new Vec4(1, 3, 5, 0);
		const v1 = new Vec4(2, 2, 4, 0);
		expect(v0.cmplt(v1)).toEqual(new BVec4(true, false, false, false));
	});

	test("Abs", () => {
		expect(Vec4.ZERO.abs()).toEqual(new Vec4(0, 0, 0, 0));
		expect(Vec4.ONE.abs()).toEqual(new Vec4(1, 1, 1, 1));
		expect(new Vec4(-1, -1, -1, -1).abs()).toEqual(new Vec4(1, 1, 1, 1));
	});

	test("Signum", () => {
		const x = new Vec4(2, -2, 0, 0);

		expect(x.signum()).toEqual(new Vec4(1, -1, 0, 0));
	});

	test("isNegativeBitmask", () => {
		const v0 = new Vec4(-1, 2, -3, 0);
		const v1 = new Vec4(1, -2, 3, 0);
		const v2 = new Vec4(-1, -2, -3, 0);

		expect(v0.isNegativeBitmask()).toBe(0b101);
		expect(v1.isNegativeBitmask()).toBe(0b010);
		expect(v2.isNegativeBitmask()).toBe(0b111);
	});

	test("Is Finite", () => {
		expect(new Vec4(0, 0, 0, 0).isFinite()).toBeTrue();
		expect(new Vec4(-1e-10, 1e10, 1e5, 0).isFinite()).toBeTrue();
		expect(
			new Vec4(Number.POSITIVE_INFINITY, 0, -1e5, 0).isFinite(),
		).toBeFalse();
		expect(new Vec4(0, Number.NaN, 1e-2, 0).isFinite()).toBeFalse();
		expect(
			new Vec4(
				0,
				Number.NEGATIVE_INFINITY,
				Number.POSITIVE_INFINITY,
				0,
			).isFinite(),
		).toBeFalse();
		expect(Vec4.INFINITY.isFinite()).toBeFalse();
		expect(Vec4.NEG_INFINITY.isFinite()).toBeFalse();
	});

	test("Is NaN", () => {
		expect(Vec4.NAN.isNaN()).toBeTrue();
		expect(Vec4.NAN.isFinite()).toBeFalse();
	});

	test("Is NaN Mask", () => {
		const v0 = new Vec4(Number.NaN, 1, Number.NaN, 0);
		expect(v0.isNaNMask()).toEqual(new BVec4(true, false, true, false));
	});

	test("Funcs", () => {
		const x = new Vec4(1, 0, 0, 0);
		const y = new Vec4(0, 1, 0, 0);
		const z = new Vec4(0, 0, 1, 0);
		const w = new Vec4(0, 0, 0, 1);

		expect(x.mul(-2).length()).toEqual(2);
		expect(y.mul(3).length()).toEqual(3);
		expect(z.mul(-4).length()).toEqual(4);
		expect(w.mul(5).length()).toEqual(5);
		expect(x.distance(y)).toEqual(Math.sqrt(2));
		expect(x.mul(3).distance(y.mul(-4))).toEqual(5);
		expect(z.mul(-5).distance(y.mul(12))).toEqual(13);
		expect(w.mul(7).distance(x.mul(-8))).toEqual(Math.sqrt(113)); // Corrected for Vec4 distance calculation
		expect(x.mul(2).normalize()).toEqual(x);
		expect(x.mul(2).normalizeOrZero()).toEqual(x);
		expect(new Vec4(2, 3, 4, 5).normalize().isNormalized()).toBeTrue();
		expect(new Vec4(2, 4, 8, 16).recip()).toEqual(
			new Vec4(0.5, 0.25, 0.125, 1 / 16),
		);

		expect(new Vec4(1, 2, 3, 4).dot(new Vec4(4, 5, 6, 7))).toEqual(
			1 * 4 + 2 * 5 + 3 * 6 + 4 * 7,
		);

		expect(new Vec4(2, 3, 4, 5).length()).toEqual(
			Math.sqrt(2 * 2 + 3 * 3 + 4 * 4 + 5 * 5),
		);

		expect(new Vec4(2, 3, 4, 5).lengthRecip()).toEqual(
			1 / Math.sqrt(2 * 2 + 3 * 3 + 4 * 4 + 5 * 5),
		);

		expect(new Vec4(2, 3, 4, 5).normalize()).toEqual(
			new Vec4(2, 3, 4, 5).normalize(),
		);
	});

	test("Length Squared", () => {
		const x = new Vec4(1, 0, 0, 0);
		const y = new Vec4(0, 1, 0, 0);

		expect(y.mul(-3).lengthSquared()).toEqual(9);
		expect(x.distanceSquared(y)).toEqual(2);
		expect(x.mul(2).distanceSquared(y.mul(-3))).toEqual(13);
	});

	test("Div Euclid", () => {
		const v0 = new Vec4(5, 9, 11, 4);
		const v1 = new Vec4(2, 2, 3, 3);
		expect(v0.divEuclid(v1)).toEqual(new Vec4(2, 4, 3, 1));
	});

	test("Rem Euclid", () => {
		const v0 = new Vec4(5, 9, 11, 5);
		const v1 = new Vec4(2, 2, 3, 3);
		expect(v0.remEuclid(v1)).toEqual(new Vec4(1, 1, 2, 2));
	});

	test("Project Reject", () => {
		const v0 = new Vec4(1, 1, 0, 0);
		const v1 = new Vec4(0, 2, 0, 0);
		const v2 = new Vec4(0, 1, 0, 0);

		expect(v0.projectOnto(v1)).toEqual(new Vec4(0, 1, 0, 0));
		expect(v0.rejectFrom(v1)).toEqual(new Vec4(1, 0, 0, 0));
		expect(v0.projectOntoNormalized(v2)).toEqual(new Vec4(0, 1, 0, 0));
		expect(v0.rejectFromNormalized(v2)).toEqual(new Vec4(1, 0, 0, 0));
	});

	test("Round", () => {
		expect(new Vec4(1.35, 0, 0, 0).round().x).toEqual(1);
		expect(new Vec4(0, 1.5, 0, 0).round().y).toEqual(2);
		expect(new Vec4(0, -15.5, 0, 0).round().y).toEqual(-15);
		expect(new Vec4(0, 0, 0, 0).round().y).toEqual(0);
		expect(new Vec4(0, 21.1, 0, 0).round().y).toEqual(21);
		expect(new Vec4(0, 11.123, 0, 0).round().y).toEqual(11);
		expect(new Vec4(0, 11.499, 0, 0).round().y).toEqual(11);

		expect(
			new Vec4(
				Number.NEGATIVE_INFINITY,
				Number.POSITIVE_INFINITY,
				0,
				0,
			).round(),
		).toEqual(
			new Vec4(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, 0),
		);

		expect(new Vec4(Number.NaN, 0, 0, 0).round().x).toBeNaN();
	});

	test("Floor", () => {
		expect(new Vec4(1.35, -1.5, 0, 0).floor()).toEqual(new Vec4(1, -2, 0, 0));
		expect(
			new Vec4(
				Number.POSITIVE_INFINITY,
				Number.NEGATIVE_INFINITY,
				0,
				0,
			).floor(),
		).toEqual(
			new Vec4(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, 0),
		);
		expect(new Vec4(Number.NaN, 0, 0, 0).floor().x).toBeNaN();
		expect(new Vec4(-2000000.123, 10000000.123, 0, 0).floor()).toEqual(
			new Vec4(-2000001, 10000000, 0, 0),
		);
	});

	test("Ceil", () => {
		expect(new Vec4(1.35, -1.5, 0, 0).ceil()).toEqual(new Vec4(2, -1, 0, 0));
		expect(
			new Vec4(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, 0).ceil(),
		).toEqual(
			new Vec4(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, 0),
		);

		expect(new Vec4(Number.NaN, 0, 0, 0).ceil().x).toBeNaN();

		expect(new Vec4(-2000000.123, 1000000.123, 0, 0).ceil()).toEqual(
			new Vec4(-2000000, 1000001, 0, 0),
		);
	});

	test("Trunc", () => {
		expect(new Vec4(1.35, -1.5, 0, 0).trunc()).toEqual(new Vec4(1, -1, 0, 0));

		expect(
			new Vec4(
				Number.POSITIVE_INFINITY,
				Number.NEGATIVE_INFINITY,
				0,
				0,
			).trunc(),
		).toEqual(
			new Vec4(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, 0),
		);

		expect(new Vec4(0, Number.NaN, 0, 0).trunc().y).toBeNaN();

		expect(new Vec4(-0, -2000000.123, 0, 0).trunc()).toEqual(
			new Vec4(-0, -2000000, 0, 0),
		);
	});

	test("Fract", () => {
		expect(
			new Vec4(1.35, -1.5, 0, 0).fract().approxEq(new Vec4(0.35, 0.5, 0, 0)),
		).toBeTrue();

		expect(
			new Vec4(-2000000.123, 1000000.123, 0, 0)
				.fract()
				.approxEq(new Vec4(0.877, 0.123, 0, 0)),
		).toBeTrue();
	});

	test("Exp", () => {
		expect(
			new Vec4(1, 2, 0, 0)
				.exp()
				.approxEq(new Vec4(Math.exp(1), Math.exp(2), Math.exp(0), Math.exp(0))),
		).toBeTrue();
	});

	test("Powf", () => {
		expect(new Vec4(2, 4, 3, 0).powf(2)).toEqual(
			new Vec4(2 ** 2, 4 ** 2, 3 ** 2, 0),
		);
	});

	test("Lerp", () => {
		const v0 = new Vec4(-1, -1, 0, 0);
		const v1 = new Vec4(1, 1, 0, 0);

		expect(v0.lerp(v1, 0).approxEq(v0)).toBeTrue();
		expect(v0.lerp(v1, 1).approxEq(v1)).toBeTrue();
		expect(v0.lerp(v1, 0.5).approxEq(new Vec4(0, 0, 0, 0))).toBeTrue();
	});

	test("Midpoint", () => {
		const v1 = new Vec4(1, 2, 3, 0);
		const v2 = new Vec4(4, 6, 8, 0);
		const expectedMidpoint = new Vec4(2.5, 4, 5.5, 0);

		expect(v1.midpoint(v2)).toEqual(expectedMidpoint);
	});

	test("AbsDiffEq", () => {
		const v0 = new Vec4(1.0001, 2, 3.0002, 0);
		const v1 = new Vec4(1, 2.0001, 3, 0);
		expect(v0.absDiffEq(v1, 0.0002)).toBeTrue();
	});

	test("Clamp Length", () => {
		expect(new Vec4(12, 16, 0, 0).clampLength(7, 10)).toEqual(
			new Vec4(6, 8, 0, 0),
		);

		expect(new Vec4(2, 1, 0, 0).clampLength(0.5, 5)).toEqual(
			new Vec4(2, 1, 0, 0),
		);

		expect(new Vec4(0.6, 0.8, 0, 0).clampLength(10, 20)).toEqual(
			new Vec4(6, 8, 0, 0),
		);
	});

	test("Clamp Length Max", () => {
		expect(new Vec4(12, 16, 0, 0).clampLengthMax(10)).toEqual(
			new Vec4(6, 8, 0, 0),
		);
		expect(new Vec4(2, 1, 0, 0).clampLengthMax(5)).toEqual(
			new Vec4(2, 1, 0, 0),
		);
	});

	test("Clamp Length Min", () => {
		expect(new Vec4(2, 1, 0, 0).clampLengthMin(0.5)).toEqual(
			new Vec4(2, 1, 0, 0),
		);

		expect(new Vec4(0.6, 0.8, 0, 0).clampLengthMin(10)).toEqual(
			new Vec4(6, 8, 0, 0),
		);
	});

	test("MulAdd", () => {
		expect(
			new Vec4(1, 1, 0, 0).mulAdd(
				new Vec4(0.5, 2, 0, 0),
				new Vec4(-1, -1, 0, 0),
			),
		).toEqual(new Vec4(-0.5, 1, 0, 0));
	});

	test("Angle Between", () => {
		let angle = new Vec4(1, 0, 1, 0).angleBetween(new Vec4(1, 1, 0, 0));
		expect(Math.abs(angle - Math.PI / 3) < 1e-6).toBeTrue();

		angle = new Vec4(10, 0, 10, 0).angleBetween(new Vec4(5, 5, 0, 0));
		expect(Math.abs(angle - Math.PI / 3) < 1e-6).toBeTrue();

		angle = new Vec4(-1, 0, -1, 0).angleBetween(new Vec4(1, -1, 0, 0));
		expect(Math.abs(angle - (2 * Math.PI) / 3) < 1e-6).toBeTrue();
	});

	test("Negatives", () => {
		expect(new Vec4(1, 2, 1, 2).neg()).toEqual(new Vec4(-1, -2, -1, -2));
		expect(new Vec4(0, 0, 0, 0).neg()).toEqual(new Vec4(-0, -0, -0, -0));
		expect(new Vec4(-0, -0, -0, -0).neg()).toEqual(new Vec4(0, 0, 0, 0));
	});

	test("Remainder", () => {
		const v0 = new Vec4(5, 10, 15, 3);
		const v1 = new Vec4(2, 3, 4, 3);
		expect(v0.rem(v1)).toEqual(new Vec4(1, 1, 3, 0));
		expect(v0.rem(3)).toEqual(new Vec4(2, 1, 0, 0));
	});

	test("Not Equal", () => {
		const v0 = new Vec4(1, 2, 3, 0);
		const v1 = new Vec4(1, 3, 3, 0);
		expect(v0.ne(v1)).toBeTrue();
		expect(v0.ne(2)).toBeTrue();
	});
});
