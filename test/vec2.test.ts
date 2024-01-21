import { describe, expect, test } from "bun:test";
import { BVec2, Vec2 } from "@";

describe("Vec2", () => {
	test("Construct", () => {
		const v0 = Vec2.splat(1);
		const v1 = new Vec2(1, 2);
		const v2 = Vec2.fromArray([1, 2]);

		expect(v0).toEqual(new Vec2(1, 1));
		expect(v1).toEqual(new Vec2(1, 2));
		expect(v2).toEqual(new Vec2(1, 2));
		expect(v2.toArray()).toEqual([1, 2]);
	});

	test("Constants", () => {
		expect(Vec2.ZERO).toEqual(new Vec2(0, 0));
		expect(Vec2.ONE).toEqual(new Vec2(1, 1));
		expect(Vec2.NEG_ONE).toEqual(new Vec2(-1, -1));
		expect(Vec2.MIN).toEqual(new Vec2(Number.MIN_VALUE, Number.MIN_VALUE));
		expect(Vec2.MAX).toEqual(new Vec2(Number.MAX_VALUE, Number.MAX_VALUE));
		expect(Vec2.NAN).toEqual(new Vec2(Number.NaN, Number.NaN));
		expect(Vec2.INFINITY).toEqual(new Vec2(Infinity, Infinity));
		expect(Vec2.NEG_INFINITY).toEqual(new Vec2(-Infinity, -Infinity));
		expect(Vec2.X).toEqual(new Vec2(1, 0));
		expect(Vec2.Y).toEqual(new Vec2(0, 1));
		expect(Vec2.NEG_X).toEqual(new Vec2(-1, 0));
		expect(Vec2.NEG_Y).toEqual(new Vec2(0, -1));
		expect(Vec2.AXES).toEqual([new Vec2(1, 0), new Vec2(0, 1)]);
	});

	test("New", () => {
		const v = new Vec2(1, 2);

		expect(v.x).toEqual(1);
		expect(v.y).toEqual(2);
	});

	test("Select", () => {
		const mask = new BVec2(true, false);
		const ifTrue = new Vec2(1, 1);
		const ifFalse = new Vec2(2, 2);
		expect(Vec2.select(mask, ifTrue, ifFalse)).toEqual(new Vec2(1, 2));
	});

	test("Dot", () => {
		const x = new Vec2(1, 0);
		const y = new Vec2(0, 1);

		expect(x.dot(x)).toEqual(1);
		expect(x.dot(y)).toEqual(0);
		expect(x.dot(x.neg())).toEqual(-1);

		expect(new Vec2(8, 8)).toEqual(new Vec2(1, 2).dotIntoVec(new Vec2(4, 2)));
	});

	test("Min/Max", () => {
		const a = new Vec2(0, 2);
		const b = new Vec2(1, 1);

		expect(new Vec2(0, 1)).toEqual(a.min(b));
		expect(new Vec2(0, 1)).toEqual(b.min(a));
		expect(new Vec2(1, 2)).toEqual(a.max(b));
		expect(new Vec2(1, 2)).toEqual(b.max(a));
	});

	test("Clamp", () => {
		const min = new Vec2(1, 3);
		const max = new Vec2(6, 8);

		expect(new Vec2(0, 0).clamp(min, max)).toEqual(new Vec2(1, 3));
		expect(new Vec2(2, 2).clamp(min, max)).toEqual(new Vec2(2, 3));
		expect(new Vec2(4, 5).clamp(min, max)).toEqual(new Vec2(4, 5));
		expect(new Vec2(6, 6).clamp(min, max)).toEqual(new Vec2(6, 6));
		expect(new Vec2(7, 7).clamp(min, max)).toEqual(new Vec2(6, 7));
		expect(new Vec2(9, 9).clamp(min, max)).toEqual(new Vec2(6, 8));
	});

	test("HMin/HMax", () => {
		expect(new Vec2(1, 2).minElement()).toEqual(1);
		expect(new Vec2(2, 1).minElement()).toEqual(1);
		expect(new Vec2(1, 2).maxElement()).toEqual(2);
		expect(new Vec2(2, 1).maxElement()).toEqual(2);
	});

	test("Cmpeq", () => {
		const v0 = new Vec2(1, 2);
		const v1 = new Vec2(1, 3);
		expect(v0.cmpeq(v1)).toEqual(new BVec2(true, false));
	});

	test("Cmpne", () => {
		const v0 = new Vec2(1, 2);
		const v1 = new Vec2(1, 3);
		expect(v0.cmpne(v1)).toEqual(new BVec2(false, true));
	});

	test("Cmpge", () => {
		const v0 = new Vec2(2, 3);
		const v1 = new Vec2(2, 2);
		expect(v0.cmpge(v1)).toEqual(new BVec2(true, true));
	});

	test("Cmpgt", () => {
		const v0 = new Vec2(2, 4);
		const v1 = new Vec2(2, 3);
		expect(v0.cmpgt(v1)).toEqual(new BVec2(false, true));
	});

	test("Cmple", () => {
		const v0 = new Vec2(1, 2);
		const v1 = new Vec2(2, 2);
		expect(v0.cmple(v1)).toEqual(new BVec2(true, true));
	});

	test("Cmplt", () => {
		const v0 = new Vec2(1, 3);
		const v1 = new Vec2(2, 2);
		expect(v0.cmplt(v1)).toEqual(new BVec2(true, false));
	});

	test("Abs", () => {
		expect(Vec2.ZERO.abs()).toEqual(new Vec2(0, 0));
		expect(Vec2.ONE.abs()).toEqual(new Vec2(1, 1));
		expect(new Vec2(-1, -1).abs()).toEqual(new Vec2(1, 1));
	});

	test("Signum", () => {
		const x = new Vec2(2, -2);

		expect(x.signum()).toEqual(new Vec2(1, -1));
	});

	test("Is Negative Bitmask", () => {
		const v0 = new Vec2(-1, 2);
		const v1 = new Vec2(1, -2);
		const v2 = new Vec2(-1, -2);
		const v3 = new Vec2(1, 2);

		expect(v0.isNegativeBitmask()).toBe(0b01);
		expect(v1.isNegativeBitmask()).toBe(0b10);
		expect(v2.isNegativeBitmask()).toBe(0b11);
		expect(v3.isNegativeBitmask()).toBe(0b00);
	});

	test("Is Finite", () => {
		expect(new Vec2(0, 0).isFinite()).toBeTrue();
		expect(new Vec2(-1e-10, 1e10).isFinite()).toBeTrue();
		expect(new Vec2(Infinity, 0).isFinite()).toBeFalse();
		expect(new Vec2(0, Number.NaN).isFinite()).toBeFalse();
		expect(new Vec2(0, -Infinity).isFinite()).toBeFalse();
		expect(Vec2.INFINITY.isFinite()).toBeFalse();
		expect(Vec2.NEG_INFINITY.isFinite()).toBeFalse();
	});

	test("Is NaN", () => {
		expect(Vec2.NAN.isNaN()).toBeTrue();
		expect(Vec2.NAN.isFinite()).toBeFalse();
	});

	test("Is NaN Mask", () => {
		const v0 = new Vec2(NaN, 1);
		expect(v0.isNaNMask()).toEqual(new BVec2(true, false));
	});

	test("Length", () => {
		const x = new Vec2(1, 0);
		const y = new Vec2(0, 1);

		expect(x.mul(-2).length()).toEqual(2);
		expect(y.mul(3).length()).toEqual(3);
		expect(x.distance(y)).toEqual(Math.sqrt(2));
		expect(x.mul(3).distance(y.mul(-4))).toEqual(5);
		expect(x.mul(-5).distance(y.mul(12))).toEqual(13);
		expect(x.mul(2).normalize()).toEqual(x);
		expect(x.mul(2).normalizeOrZero()).toEqual(x);
		expect(new Vec2(1, 2).dot(new Vec2(3, 4))).toEqual(1 * 3 + 2 * 4);
		expect(new Vec2(2, 3).length()).toEqual(Math.sqrt(2 * 2 + 3 * 3));
		expect(new Vec2(2, 3).lengthRecip()).toEqual(1 / Math.sqrt(2 * 2 + 3 * 3));
		expect(new Vec2(2, 3).normalize().isNormalized()).toBeTrue();
		expect(new Vec2(2, 3).normalize()).toEqual(
			new Vec2(2, 3).div(Math.sqrt(2 * 2 + 3 * 3)),
		);
		expect(new Vec2(2, 4).recip()).toEqual(new Vec2(0.5, 0.25));
	});

	test("Length Squared", () => {
		const x = new Vec2(1, 0);
		const y = new Vec2(0, 1);

		expect(y.mul(-3).lengthSquared()).toEqual(9);
		expect(x.distanceSquared(y)).toEqual(2);
		expect(x.mul(2).distanceSquared(y.mul(-3))).toEqual(13);
	});

	test("Div Euclid", () => {
		const v0 = new Vec2(5, 9);
		const v1 = new Vec2(2, 2);
		expect(v0.divEuclid(v1)).toEqual(new Vec2(2, 4));
	});

	test("Rem Euclid", () => {
		const v0 = new Vec2(5, 9);
		const v1 = new Vec2(2, 2);
		expect(v0.remEuclid(v1)).toEqual(new Vec2(1, 1));
	});

	test("Project Reject", () => {
		const v0 = new Vec2(1, 1);
		const v1 = new Vec2(0, 2);
		const v2 = new Vec2(0, 1);

		expect(v0.projectOnto(v1)).toEqual(new Vec2(0, 1));
		expect(v0.rejectFrom(v1)).toEqual(new Vec2(1, 0));
		expect(v0.projectOntoNormalized(v2)).toEqual(new Vec2(0, 1));
		expect(v0.rejectFromNormalized(v2)).toEqual(new Vec2(1, 0));
	});

	test("Round", () => {
		expect(new Vec2(1.35, 0).round().x).toEqual(1);
		expect(new Vec2(0, 1.5).round().y).toEqual(2);
		expect(new Vec2(0, -15.5).round().y).toEqual(-15);
		expect(new Vec2(0, 0).round().y).toEqual(0);
		expect(new Vec2(0, 21.1).round().y).toEqual(21);
		expect(new Vec2(0, 11.123).round().y).toEqual(11);
		expect(new Vec2(0, 11.499).round().y).toEqual(11);

		expect(new Vec2(-Infinity, Infinity).round()).toEqual(
			new Vec2(-Infinity, Infinity),
		);

		expect(new Vec2(NaN, 0).round().x).toBeNaN();
	});

	test("Floor", () => {
		expect(new Vec2(1.35, -1.5).floor()).toEqual(new Vec2(1, -2));
		expect(new Vec2(Infinity, -Infinity).floor()).toEqual(
			new Vec2(Infinity, -Infinity),
		);
		expect(new Vec2(NaN, 0).floor().x).toBeNaN();
		expect(new Vec2(-2000000.123, 10000000.123).floor()).toEqual(
			new Vec2(-2000001, 10000000),
		);
	});

	test("Ceil", () => {
		expect(new Vec2(1.35, -1.5).ceil()).toEqual(new Vec2(2, -1));
		expect(new Vec2(Infinity, -Infinity).ceil()).toEqual(
			new Vec2(Infinity, -Infinity),
		);
		expect(new Vec2(NaN, 0).ceil().x).toBeNaN();
		expect(new Vec2(-2000000.123, 1000000.123).ceil()).toEqual(
			new Vec2(-2000000, 1000001),
		);
	});

	test("Trunc", () => {
		expect(new Vec2(1.35, -1.5).trunc()).toEqual(new Vec2(1, -1));
		expect(new Vec2(Infinity, -Infinity).trunc()).toEqual(
			new Vec2(Infinity, -Infinity),
		);
		expect(new Vec2(0, NaN).trunc().y).toBeNaN();
		expect(new Vec2(-0, -2000000.123).trunc()).toEqual(new Vec2(-0, -2000000));
	});

	test("Fract", () => {
		expect(
			new Vec2(1.35, -1.5).fract().approxEq(new Vec2(0.35, 0.5)),
		).toBeTrue();
		expect(
			new Vec2(-2000000.123, 1000000.123)
				.fract()
				.approxEq(new Vec2(0.877, 0.123)),
		).toBeTrue();
	});

	test("Exp", () => {
		expect(
			new Vec2(1, 2).exp().approxEq(new Vec2(Math.exp(1), Math.exp(2))),
		).toBeTrue();
	});

	test("Powf", () => {
		expect(new Vec2(2, 4).powf(2)).toEqual(new Vec2(2 ** 2, 4 ** 2));
	});

	test("Lerp", () => {
		const v0 = new Vec2(-1, -1);
		const v1 = new Vec2(1, 1);

		expect(v0.lerp(v1, 0).approxEq(v0)).toBeTrue();
		expect(v0.lerp(v1, 1).approxEq(v1)).toBeTrue();
		expect(v0.lerp(v1, 0.5).approxEq(Vec2.ZERO)).toBeTrue();
	});

	test("Midpoint", () => {
		const v0 = new Vec2(-1, -1);
		const v1 = new Vec2(1, 1);
		const v2 = new Vec2(-1.5, 0);

		expect(v0.midpoint(v1).approxEq(new Vec2(0, 0))).toBeTrue();
		expect(v1.midpoint(v2).approxEq(new Vec2(-0.25, 0.5))).toBeTrue();
	});

	test("AbsDiffEq", () => {
		const v0 = new Vec2(1.0001, 2);
		const v1 = new Vec2(1, 2.0001);
		expect(v0.absDiffEq(v1, 0.0002)).toBeTrue();
	});

	test("Clamp Length", () => {
		expect(new Vec2(12, 16).clampLength(7, 10)).toEqual(new Vec2(6, 8));
		expect(new Vec2(2, 1).clampLength(0.5, 5)).toEqual(new Vec2(2, 1));
		expect(new Vec2(0.6, 0.8).clampLength(10, 20)).toEqual(new Vec2(6, 8));
	});

	test("Clamp Length Max", () => {
		expect(new Vec2(12, 16).clampLengthMax(10)).toEqual(new Vec2(6, 8));
		expect(new Vec2(2, 1).clampLengthMax(5)).toEqual(new Vec2(2, 1));
	});

	test("Clamp Length Min", () => {
		expect(new Vec2(2, 1).clampLengthMin(0.5)).toEqual(new Vec2(2, 1));
		expect(new Vec2(0.6, 0.8).clampLengthMin(10)).toEqual(new Vec2(6, 8));
	});

	test("MulAdd", () => {
		expect(new Vec2(1, 1).mulAdd(new Vec2(0.5, 2), new Vec2(-1, -1))).toEqual(
			new Vec2(-0.5, 1),
		);
	});

	test("Angle Conversion", () => {
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
		expect(Math.abs(vec.toAngle() - angle) < 1e-6).toBeTrue();

		angle = -Math.PI / 2;
		vec = Vec2.fromAngle(angle);
		expect(vec.approxEq(new Vec2(0, -1))).toBeTrue();
		expect(Math.abs(vec.toAngle() - angle) < 1e-6).toBeTrue();
	});

	test("Angle Between", () => {
		let angle = new Vec2(1, 0).angleBetween(new Vec2(0, 1));
		expect(Math.abs(angle - Math.PI / 2) < 1e-6).toBeTrue();

		angle = new Vec2(10, 0).angleBetween(new Vec2(0, 5));
		expect(Math.abs(angle - Math.PI / 2) < 1e-6).toBeTrue();

		angle = new Vec2(-1, 0).angleBetween(new Vec2(0, 1));
		expect(Math.abs(angle + Math.PI / 2) < 1e-6).toBeTrue();
	});

	test("Negatives", () => {
		expect(new Vec2(1, 2).neg()).toEqual(new Vec2(-1, -2));
		expect(new Vec2(0, 0).neg()).toEqual(new Vec2(-0, -0));
		expect(new Vec2(-0, -0).neg()).toEqual(new Vec2(0, 0));
	});

	test("Perp", () => {
		const v0 = new Vec2(1, 2);
		const v1 = new Vec2(1, 1);
		const v0Perp = new Vec2(-2, 1);

		expect(v0Perp).toEqual(v0.perp());
		expect(v0.perp().dot(v0)).toEqual(0);
		expect(v1.perp().dot(v1)).toEqual(0);
		expect(v0.perp().dot(v1)).toEqual(v0.perpDot(v1));
	});

	test("Rotate", () => {
		const v0 = new Vec2(0, 1).rotate(new Vec2(1, 1));
		expect(v0).toEqual(new Vec2(-1, 1));
	});

	test("Remainder", () => {
		const v0 = new Vec2(5, 10);
		const v1 = new Vec2(2, 3);
		expect(v0.rem(v1)).toEqual(new Vec2(1, 1));
		expect(v0.rem(3)).toEqual(new Vec2(2, 1));
	});

	test("Not Equal", () => {
		const v0 = new Vec2(1, 2);
		const v1 = new Vec2(1, 3);
		expect(v0.ne(v1)).toBeTrue();
		expect(v0.ne(2)).toBeTrue();
	});
});
