import { describe, expect, test } from "bun:test";
import { Vec2, Vec3, BVec3, Vec4 } from "@";

describe("Vec3", () => {
	test("Construct", () => {
		const v0 = Vec3.splat(1);
		const v1 = new Vec3(1, 2, 3);
		const v2 = Vec3.fromArray([1, 2, 3]);

		expect(v0).toEqual(new Vec3(1, 1, 1));
		expect(v1).toEqual(new Vec3(1, 2, 3));
		expect(v2).toEqual(new Vec3(1, 2, 3));
		expect(v2.toArray()).toEqual([1, 2, 3]);
	});

	test("Constants", () => {
		expect(Vec3.ZERO).toEqual(new Vec3(0, 0, 0));
		expect(Vec3.ONE).toEqual(new Vec3(1, 1, 1));
		expect(Vec3.NEG_ONE).toEqual(new Vec3(-1, -1, -1));
		expect(Vec3.MIN).toEqual(
			new Vec3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE),
		);
		expect(Vec3.MAX).toEqual(
			new Vec3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE),
		);
		expect(Vec3.NAN).toEqual(new Vec3(Number.NaN, Number.NaN, Number.NaN));
		expect(Vec3.INFINITY).toEqual(new Vec3(Infinity, Infinity, Infinity));
		expect(Vec3.NEG_INFINITY).toEqual(
			new Vec3(-Infinity, -Infinity, -Infinity),
		);
		expect(Vec3.X).toEqual(new Vec3(1, 0, 0));
		expect(Vec3.Y).toEqual(new Vec3(0, 1, 0));
		expect(Vec3.Z).toEqual(new Vec3(0, 0, 1));
		expect(Vec3.NEG_X).toEqual(new Vec3(-1, 0, 0));
		expect(Vec3.NEG_Y).toEqual(new Vec3(0, -1, 0));
		expect(Vec3.NEG_Z).toEqual(new Vec3(0, 0, -1));
		expect(Vec3.AXES).toEqual([
			new Vec3(1, 0, 0),
			new Vec3(0, 1, 0),
			new Vec3(0, 0, 1),
		]);
	});

	test("Select", () => {
		const mask = new BVec3(true, false, true);
		const ifTrue = new Vec3(1, 1, 1);
		const ifFalse = new Vec3(2, 2, 2);
		expect(Vec3.select(mask, ifTrue, ifFalse)).toEqual(new Vec3(1, 2, 1));
	});

	test("New", () => {
		const v = new Vec3(1, 2, 3);

		expect(v.x).toEqual(1);
		expect(v.y).toEqual(2);
		expect(v.z).toEqual(3);
		expect(v.truncate().eq(new Vec2(1, 2))).toBeTrue();
		expect(v.extend(4).eq(new Vec4(1, 2, 3, 4))).toBeTrue();
		expect(v.eq(3)).toBeFalse();
	});

	test("Dot", () => {
		const x = new Vec3(1, 0, 0);
		const y = new Vec3(0, 1, 0);
		const z = new Vec3(0, 0, 1);

		expect(x.dot(x)).toEqual(1);
		expect(x.dot(y)).toEqual(0);
		expect(x.dot(z)).toEqual(0);
		expect(y.dot(z)).toEqual(0);
		expect(new Vec3(14, 14, 14)).toEqual(
			new Vec3(1, 2, 3).dotIntoVec(new Vec3(4, 2, 2)),
		);
	});

	test("Min/Max", () => {
		const a = new Vec3(0, 2, 1);
		const b = new Vec3(1, 1, 3);

		expect(new Vec3(0, 1, 1)).toEqual(a.min(b));
		expect(new Vec3(0, 1, 1)).toEqual(b.min(a));
		expect(new Vec3(1, 2, 3)).toEqual(a.max(b));
		expect(new Vec3(1, 2, 3)).toEqual(b.max(a));
	});

	test("Clamp", () => {
		const min = new Vec3(1, 3, 5);
		const max = new Vec3(6, 8, 10);

		expect(new Vec3(0, 0, 0).clamp(min, max)).toEqual(new Vec3(1, 3, 5));
		expect(new Vec3(2, 2, 6).clamp(min, max)).toEqual(new Vec3(2, 3, 6));
		expect(new Vec3(4, 5, 7).clamp(min, max)).toEqual(new Vec3(4, 5, 7));
		expect(new Vec3(6, 6, 9).clamp(min, max)).toEqual(new Vec3(6, 6, 9));
		expect(new Vec3(7, 7, 11).clamp(min, max)).toEqual(new Vec3(6, 7, 10));
		expect(new Vec3(9, 9, 12).clamp(min, max)).toEqual(new Vec3(6, 8, 10));
	});

	test("HMin/HMax", () => {
		expect(new Vec3(1, 2, 3).minElement()).toEqual(1);
		expect(new Vec3(3, 1, 2).minElement()).toEqual(1);
		expect(new Vec3(2, 3, 1).minElement()).toEqual(1);
		expect(new Vec3(1, 2, 3).maxElement()).toEqual(3);
		expect(new Vec3(3, 2, 1).maxElement()).toEqual(3);
		expect(new Vec3(2, 3, 1).maxElement()).toEqual(3);
	});

	test("Cmpeq", () => {
		const v0 = new Vec3(1, 2, 3);
		const v1 = new Vec3(1, 3, 3);
		expect(v0.cmpeq(v1)).toEqual(new BVec3(true, false, true));
	});

	test("Cmpne", () => {
		const v0 = new Vec3(1, 2, 3);
		const v1 = new Vec3(1, 3, 4);
		expect(v0.cmpne(v1)).toEqual(new BVec3(false, true, true));
	});

	test("Cmpge", () => {
		const v0 = new Vec3(2, 3, 4);
		const v1 = new Vec3(2, 2, 4);
		expect(v0.cmpge(v1)).toEqual(new BVec3(true, true, true));
	});

	test("Cmpgt", () => {
		const v0 = new Vec3(2, 4, 5);
		const v1 = new Vec3(2, 3, 4);
		expect(v0.cmpgt(v1)).toEqual(new BVec3(false, true, true));
	});

	test("Cmple", () => {
		const v0 = new Vec3(1, 2, 3);
		const v1 = new Vec3(2, 2, 4);
		expect(v0.cmple(v1)).toEqual(new BVec3(true, true, true));
	});

	test("Cmplt", () => {
		const v0 = new Vec3(1, 3, 5);
		const v1 = new Vec3(2, 2, 4);
		expect(v0.cmplt(v1)).toEqual(new BVec3(true, false, false));
	});

	test("Abs", () => {
		expect(Vec3.ZERO.abs()).toEqual(new Vec3(0, 0, 0));
		expect(Vec3.ONE.abs()).toEqual(new Vec3(1, 1, 1));
		expect(new Vec3(-1, -1, -1).abs()).toEqual(new Vec3(1, 1, 1));
	});

	test("Signum", () => {
		const x = new Vec3(2, -2, 0);

		expect(x.signum()).toEqual(new Vec3(1, -1, 0));
	});

	test("isNegativeBitmask", () => {
		const v0 = new Vec3(-1, 2, -3);
		const v1 = new Vec3(1, -2, 3);
		const v2 = new Vec3(-1, -2, -3);

		expect(v0.isNegativeBitmask()).toBe(0b101);
		expect(v1.isNegativeBitmask()).toBe(0b010);
		expect(v2.isNegativeBitmask()).toBe(0b111);
	});

	test("Is Finite", () => {
		expect(new Vec3(0, 0, 0).isFinite()).toBeTrue();
		expect(new Vec3(-1e-10, 1e10, 1e5).isFinite()).toBeTrue();
		expect(new Vec3(Infinity, 0, -1e5).isFinite()).toBeFalse();
		expect(new Vec3(0, Number.NaN, 1e-2).isFinite()).toBeFalse();
		expect(new Vec3(0, -Infinity, Infinity).isFinite()).toBeFalse();
		expect(Vec3.INFINITY.isFinite()).toBeFalse();
		expect(Vec3.NEG_INFINITY.isFinite()).toBeFalse();
	});

	test("Is NaN", () => {
		expect(Vec3.NAN.isNaN()).toBeTrue();
		expect(Vec3.NAN.isFinite()).toBeFalse();
	});

	test("Is NaN Mask", () => {
		const v0 = new Vec3(NaN, 1, NaN);
		expect(v0.isNaNMask()).toEqual(new BVec3(true, false, true));
	});

	test("Funcs", () => {
		const x = new Vec3(1, 0, 0);
		const y = new Vec3(0, 1, 0);
		const z = new Vec3(0, 0, 1);

		expect(z.cross(x)).toEqual(y);
		expect(x.cross(y)).toEqual(z);
		expect(x.div(2)).toEqual(new Vec3(0.5, 0, 0));
		expect(x.add(1)).toEqual(new Vec3(2, 1, 1));
		expect(x.sub(1)).toEqual(new Vec3(0, -1, -1));
		expect(x.mul(-2).length()).toEqual(2);
		expect(y.mul(3).length()).toEqual(3);
		expect(z.mul(-4).length()).toEqual(4);
		expect(x.distance(y)).toEqual(Math.sqrt(2));
		expect(x.mul(3).distance(y.mul(-4))).toEqual(5);
		expect(z.mul(-5).distance(y.mul(12))).toEqual(13);
		expect(x.mul(2).normalize()).toEqual(x);
		expect(x.mul(2).normalizeOrZero()).toEqual(x);
		expect(new Vec3(2, 3, 4).normalize().isNormalized()).toBeTrue();
		expect(new Vec3(2, 4, 8).recip()).toEqual(new Vec3(0.5, 0.25, 0.125));

		expect(new Vec3(1, 2, 3).dot(new Vec3(4, 5, 6))).toEqual(
			1 * 4 + 2 * 5 + 3 * 6,
		);

		expect(new Vec3(2, 3, 4).length()).toEqual(
			Math.sqrt(2 * 2 + 3 * 3 + 4 * 4),
		);

		expect(new Vec3(2, 3, 4).lengthRecip()).toEqual(
			1 / Math.sqrt(2 * 2 + 3 * 3 + 4 * 4),
		);

		expect(new Vec3(2, 3, 4).normalize()).toEqual(
			new Vec3(2, 3, 4).normalize(),
		);
	});

	test("Length Squared", () => {
		const x = new Vec3(1, 0, 0);
		const y = new Vec3(0, 1, 0);

		expect(y.mul(-3).lengthSquared()).toEqual(9);
		expect(x.distanceSquared(y)).toEqual(2);
		expect(x.mul(2).distanceSquared(y.mul(-3))).toEqual(13);
	});

	test("Div Euclid", () => {
		const v0 = new Vec3(5, 9, 11);
		const v1 = new Vec3(2, 2, 3);
		expect(v0.divEuclid(v1)).toEqual(new Vec3(2, 4, 3));
	});

	test("Rem Euclid", () => {
		const v0 = new Vec3(5, 9, 11);
		const v1 = new Vec3(2, 2, 3);
		expect(v0.remEuclid(v1)).toEqual(new Vec3(1, 1, 2));
	});

	test("Project Reject", () => {
		const v0 = new Vec3(1, 1, 0);
		const v1 = new Vec3(0, 2, 0);
		const v2 = new Vec3(0, 1, 0);

		expect(v0.projectOnto(v1)).toEqual(new Vec3(0, 1, 0));
		expect(v0.rejectFrom(v1)).toEqual(new Vec3(1, 0, 0));
		expect(v0.projectOntoNormalized(v2)).toEqual(new Vec3(0, 1, 0));
		expect(v0.rejectFromNormalized(v2)).toEqual(new Vec3(1, 0, 0));
	});

	test("Round", () => {
		expect(new Vec3(1.35, 0, 0).round().x).toEqual(1);
		expect(new Vec3(0, 1.5, 0).round().y).toEqual(2);
		expect(new Vec3(0, -15.5, 0).round().y).toEqual(-15);
		expect(new Vec3(0, 0, 0).round().y).toEqual(0);
		expect(new Vec3(0, 21.1, 0).round().y).toEqual(21);
		expect(new Vec3(0, 11.123, 0).round().y).toEqual(11);
		expect(new Vec3(0, 11.499, 0).round().y).toEqual(11);

		expect(new Vec3(-Infinity, Infinity, 0).round()).toEqual(
			new Vec3(-Infinity, Infinity, 0),
		);

		expect(new Vec3(NaN, 0, 0).round().x).toBeNaN();
	});

	test("Floor", () => {
		expect(new Vec3(1.35, -1.5, 0).floor()).toEqual(new Vec3(1, -2, 0));
		expect(new Vec3(Infinity, -Infinity, 0).floor()).toEqual(
			new Vec3(Infinity, -Infinity, 0),
		);
		expect(new Vec3(NaN, 0, 0).floor().x).toBeNaN();
		expect(new Vec3(-2000000.123, 10000000.123, 0).floor()).toEqual(
			new Vec3(-2000001, 10000000, 0),
		);
	});

	test("Ceil", () => {
		expect(new Vec3(1.35, -1.5, 0).ceil()).toEqual(new Vec3(2, -1, 0));
		expect(new Vec3(Infinity, -Infinity, 0).ceil()).toEqual(
			new Vec3(Infinity, -Infinity, 0),
		);
		expect(new Vec3(NaN, 0, 0).ceil().x).toBeNaN();
		expect(new Vec3(-2000000.123, 1000000.123, 0).ceil()).toEqual(
			new Vec3(-2000000, 1000001, 0),
		);
	});

	test("Trunc", () => {
		expect(new Vec3(1.35, -1.5, 0).trunc()).toEqual(new Vec3(1, -1, 0));
		expect(new Vec3(Infinity, -Infinity, 0).trunc()).toEqual(
			new Vec3(Infinity, -Infinity, 0),
		);
		expect(new Vec3(0, NaN, 0).trunc().y).toBeNaN();
		expect(new Vec3(-0, -2000000.123, 0).trunc()).toEqual(
			new Vec3(-0, -2000000, 0),
		);
	});

	test("Fract", () => {
		expect(
			new Vec3(1.35, -1.5, 0).fract().approxEq(new Vec3(0.35, 0.5, 0)),
		).toBeTrue();

		expect(
			new Vec3(-2000000.123, 1000000.123, 0)
				.fract()
				.approxEq(new Vec3(0.877, 0.123, 0)),
		).toBeTrue();
	});

	test("Exp", () => {
		expect(
			new Vec3(1, 2, 0)
				.exp()
				.approxEq(new Vec3(Math.exp(1), Math.exp(2), Math.exp(0))),
		).toBeTrue();
	});

	test("Powf", () => {
		expect(new Vec3(2, 4, 3).powf(2)).toEqual(new Vec3(2 ** 2, 4 ** 2, 3 ** 2));
	});

	test("Lerp", () => {
		const v0 = new Vec3(-1, -1, 0);
		const v1 = new Vec3(1, 1, 0);

		expect(v0.lerp(v1, 0).approxEq(v0)).toBeTrue();
		expect(v0.lerp(v1, 1).approxEq(v1)).toBeTrue();
		expect(v0.lerp(v1, 0.5).approxEq(new Vec3(0, 0, 0))).toBeTrue();
	});

	test("Midpoint", () => {
		const v1 = new Vec3(1, 2, 3);
		const v2 = new Vec3(4, 6, 8);
		const expectedMidpoint = new Vec3(2.5, 4, 5.5);

		expect(v1.midpoint(v2)).toEqual(expectedMidpoint);
	});

	test("AbsDiffEq", () => {
		const v0 = new Vec3(1.0001, 2, 3.0002);
		const v1 = new Vec3(1, 2.0001, 3);
		expect(v0.absDiffEq(v1, 0.0002)).toBeTrue();
	});

	test("Clamp Length", () => {
		expect(new Vec3(12, 16, 0).clampLength(7, 10)).toEqual(new Vec3(6, 8, 0));
		expect(new Vec3(2, 1, 0).clampLength(0.5, 5)).toEqual(new Vec3(2, 1, 0));
		expect(new Vec3(0.6, 0.8, 0).clampLength(10, 20)).toEqual(
			new Vec3(6, 8, 0),
		);
	});

	test("Clamp Length Max", () => {
		expect(new Vec3(12, 16, 0).clampLengthMax(10)).toEqual(new Vec3(6, 8, 0));
		expect(new Vec3(2, 1, 0).clampLengthMax(5)).toEqual(new Vec3(2, 1, 0));
	});

	test("Clamp Length Min", () => {
		expect(new Vec3(2, 1, 0).clampLengthMin(0.5)).toEqual(new Vec3(2, 1, 0));
		expect(new Vec3(0.6, 0.8, 0).clampLengthMin(10)).toEqual(new Vec3(6, 8, 0));
	});

	test("MulAdd", () => {
		expect(
			new Vec3(1, 1, 0).mulAdd(new Vec3(0.5, 2, 0), new Vec3(-1, -1, 0)),
		).toEqual(new Vec3(-0.5, 1, 0));
	});

	test("Angle Between", () => {
		let angle = new Vec3(1, 0, 1).angleBetween(new Vec3(1, 1, 0));
		expect(Math.abs(angle - Math.PI / 3) < 1e-6).toBeTrue();

		angle = new Vec3(10, 0, 10).angleBetween(new Vec3(5, 5, 0));
		expect(Math.abs(angle - Math.PI / 3) < 1e-6).toBeTrue();

		angle = new Vec3(-1, 0, -1).angleBetween(new Vec3(1, -1, 0));
		expect(Math.abs(angle - (2 * Math.PI) / 3) < 1e-6).toBeTrue();
	});

	test("Any Orthogonal and Orthonormal", () => {
		const eps = 2 * Number.EPSILON;

		const vectors = [
			new Vec3(0.1, 0.2, 0.3),
			new Vec3(0.2, 0.3, 0.4),
			new Vec3(4, -5, 6),
			new Vec3(-2, 0.5, -1),
			// Pathalogical cases from <https://graphics.pixar.com/library/OrthonormalB/paper.pdf>:
			new Vec3(0.00038527316, 0.00038460016, -0.99999988079),
			new Vec3(-0.00019813581, -0.00008946839, -0.99999988079),
		];

		for (const v of vectors) {
			const orthogonal = v.anyOrthogonalVector();

			expect(orthogonal).not.toEqual(Vec3.ZERO);
			expect(orthogonal.isFinite()).toBeTrue();
			expect(Math.abs(v.dot(orthogonal)) < eps).toBeTrue();

			const n = v.normalize();

			const orthonormal = n.anyOrthonormalVector();
			expect(orthonormal.isNormalized()).toBeTrue();
			expect(Math.abs(n.dot(orthonormal)) < eps).toBeTrue();

			const [a, b] = n.anyOrthonormalPair();
			expect(a.isNormalized() && Math.abs(n.dot(a)) < eps).toBeTrue();
			expect(b.isNormalized() && Math.abs(n.dot(b)) < eps).toBeTrue();
		}
	});

	test("Negatives", () => {
		expect(new Vec3(1, 2, 1).neg()).toEqual(new Vec3(-1, -2, -1));
		expect(new Vec3(0, 0, 0).neg()).toEqual(new Vec3(-0, -0, -0));
		expect(new Vec3(-0, -0, -0).neg()).toEqual(new Vec3(0, 0, 0));
	});

	test("Remainder", () => {
		const v0 = new Vec3(5, 10, 15);
		const v1 = new Vec3(2, 3, 4);
		expect(v0.rem(v1)).toEqual(new Vec3(1, 1, 3));
		expect(v0.rem(3)).toEqual(new Vec3(2, 1, 0));
	});

	test("Not Equal", () => {
		const v0 = new Vec3(1, 2, 3);
		const v1 = new Vec3(1, 3, 3);
		expect(v0.ne(v1)).toBeTrue();
		expect(v0.ne(2)).toBeTrue();
	});

	test("Swizzle", () => {
		const vec = new Vec3(1, 2, 3);

		expect(vec._`xy`).toEqual(new Vec2(1, 2));
		expect(vec._`yx`).toEqual(new Vec2(2, 1));
		expect(vec._`yxz`).toEqual(new Vec3(2, 1, 3));
		expect(vec._`yxyz`).toEqual(new Vec4(2, 1, 2, 3));

		expect(() => vec._`xywz`).toThrow(
			"Invalid parameters. Only [x, y, z] are allowed.",
		);

		expect(() => vec._`y`).toThrow("Invalid number of parameters.");
		expect(() => vec._`yyyyy`).toThrow("Invalid number of parameters.");
	});
});
