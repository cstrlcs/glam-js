// Do not edit this file directly. Edit the template instead: `codegen/templates/vec.eta`.

import { BVec4 } from "./";

export class Vec4 {
	constructor(
		public x: number,
		public y: number,
		public z: number,
		public w: number,
	) {}

	/** All zeroes. */
	static ZERO = Vec4.splat(0);

	/** All ones. */
	static ONE = Vec4.splat(1);

	/** All negative ones. */
	static NEG_ONE = Vec4.splat(-1);

	/** All `Number.MIN_VALUE`. */
	static MIN = Vec4.splat(Number.MIN_VALUE);

	/** All `Number.MAX_VALUE`. */
	static MAX = Vec4.splat(Number.MAX_VALUE);

	/** All `NaN`. */
	static NAN = Vec4.splat(NaN);

	/** All `Infinity`. */
	static INFINITY = Vec4.splat(Infinity);

	/** All `-Infinity`. */
	static NEG_INFINITY = Vec4.splat(-Infinity);

	/** A unit vector pointing along the positive X axis. */
	static X = new Vec4(1, 0, 0, 0);

	/** A unit vector pointing along the positive Y axis. */
	static Y = new Vec4(0, 1, 0, 0);

	/** A unit vector pointing along the positive Z axis. */
	static Z = new Vec4(0, 0, 1, 0);

	/** A unit vector pointing along the positive W axis. */
	static W = new Vec4(0, 0, 0, 1);

	/** A unit vector pointing along the negative X axis. */
	static NEG_X = new Vec4(-1, 0, 0, 0);

	/** A unit vector pointing along the negative Y axis. */
	static NEG_Y = new Vec4(0, -1, 0, 0);

	/** A unit vector pointing along the negative Z axis. */
	static NEG_Z = new Vec4(0, 0, -1, 0);

	/** A unit vector pointing along the negative W axis. */
	static NEG_W = new Vec4(0, 0, 0, -1);

	/** The unit axes. */
	static AXES = [Vec4.X, Vec4.Y, Vec4.Z, Vec4.W];

	/** Creates a vector with all elements set to v. */
	static splat(v: number): Vec4 {
		return new Vec4(v, v, v, v);
	}

	/**
	 * Creates a vector from the elements in `ifTrue` and `ifFalse`, selecting which to use for each element.
	 * A true element in the mask uses the corresponding element from `ifTrue`, and false uses the element from `ifFalse`.
	 */
	static select(mask: BVec4, ifTrue: Vec4, ifFalse: Vec4): Vec4 {
		return new Vec4(
			mask.test(0) ? ifTrue.x : ifFalse.x,
			mask.test(1) ? ifTrue.y : ifFalse.y,
			mask.test(2) ? ifTrue.z : ifFalse.z,
			mask.test(3) ? ifTrue.w : ifFalse.w,
		);
	}

	/** Creates a new vector from an array. */
	static fromArray(a: [number, number, number, number]): Vec4 {
		return new Vec4(a[0], a[1], a[2], a[3]);
	}

	/** [x, y, z, w] */
	toArray(): [number, number, number, number] {
		return [this.x, this.y, this.z, this.w];
	}

	/** Computes the dot product of `Vec4` and `rhs`. */
	dot(rhs: Vec4): number {
		return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z + this.w * rhs.w;
	}

	/** Returns a vector where every component is the dot product of `Vec3` and `rhs`. */
	dotIntoVec(rhs: Vec4): Vec4 {
		return Vec4.splat(this.dot(rhs));
	}

	/**
	 * Returns a vector containing the minimum values for each element of `Vec4` and `rhs`.
	 * In other words this computes `Math.min(this.x, rhs.x), Math.min(this.y, rhs.y)..`.
	 */
	min(rhs: Vec4): Vec4 {
		return new Vec4(
			Math.min(this.x, rhs.x),
			Math.min(this.y, rhs.y),
			Math.min(this.z, rhs.z),
			Math.min(this.w, rhs.w),
		);
	}

	/**
	 * Returns a vector containing the maximum values for each element of `Vec4` and `rhs`.
	 * In other words this computes `Math.max(this.x, rhs.x), Math.max(this.y, rhs.y)..`.
	 */
	max(rhs: Vec4): Vec4 {
		return new Vec4(
			Math.max(this.x, rhs.x),
			Math.max(this.y, rhs.y),
			Math.max(this.z, rhs.z),
			Math.max(this.w, rhs.w),
		);
	}

	/** Component-wise clamping of values. */
	clamp(min: Vec4, max: Vec4): Vec4 {
		return this.max(min).min(max);
	}

	/**
	 * Returns the horizontal minimum of `Vec4`.
	 * In other words this computes `Math.min(x, y..)`.
	 */
	minElement(): number {
		return Math.min(this.x, this.y, this.z, this.w);
	}

	/**
	 * Returns the horizontal maximum of `Vec4`.
	 * In other words this computes `Math.max(x, y, ..)`.
	 */
	maxElement(): number {
		return Math.max(this.x, this.y, this.z, this.w);
	}

	/**
	 * Returns a vector mask containing the result of a `==` comparison for each element of `Vec4` and `rhs`.
	 * In other words this computes `[this.x == rhs.x, this.y == rhs.y..]` for all elements.
	 */
	cmpeq(rhs: Vec4): BVec4 {
		return new BVec4(
			this.x === rhs.x,
			this.y === rhs.y,
			this.z === rhs.z,
			this.w === rhs.w,
		);
	}

	/**
	 * Returns a vector mask containing the result of a `!=` comparison for each element of `Vec4` and `rhs`.
	 * In other words this computes `[this.x != rhs.x, this.y != rhs.y..]` for all elements.
	 */
	cmpne(rhs: Vec4): BVec4 {
		return new BVec4(
			this.x !== rhs.x,
			this.y !== rhs.y,
			this.z !== rhs.z,
			this.w !== rhs.w,
		);
	}

	/**
	 * Returns a vector mask containing the result of a `>=` comparison for each element of `Vec4` and `rhs`.
	 * In other words this computes `[this.x >= rhs.x, this.y >= rhs.y..]` for all elements.
	 */
	cmpge(rhs: Vec4): BVec4 {
		return new BVec4(
			this.x >= rhs.x,
			this.y >= rhs.y,
			this.z >= rhs.z,
			this.w >= rhs.w,
		);
	}

	/**
	 * Returns a vector mask containing the result of a `>` comparison for each element of `Vec4` and `rhs`.
	 * In other words this computes `[this.x > rhs.x, this.y > rhs.y..]` for all elements.
	 */
	cmpgt(rhs: Vec4): BVec4 {
		return new BVec4(
			this.x > rhs.x,
			this.y > rhs.y,
			this.z > rhs.z,
			this.w > rhs.w,
		);
	}

	/**
	 * Returns a vector mask containing the result of a `<=` comparison for each element of `Vec4` and `rhs`.
	 * In other words this computes `[this.x <= rhs.x, this.y <= rhs.y..]` for all elements.
	 */
	cmple(rhs: Vec4): BVec4 {
		return new BVec4(
			this.x <= rhs.x,
			this.y <= rhs.y,
			this.z <= rhs.z,
			this.w <= rhs.w,
		);
	}

	/**
	 * Returns a vector mask containing the result of a `<` comparison for each element of `Vec4` and `rhs`.
	 * In other words this computes `[this.x < rhs.x, this.y < rhs.y..]` for all elements.
	 */
	cmplt(rhs: Vec4): BVec4 {
		return new BVec4(
			this.x < rhs.x,
			this.y < rhs.y,
			this.z < rhs.z,
			this.w < rhs.w,
		);
	}

	/** Returns a vector containing the absolute value of each element of `Vec3`. */
	abs(): Vec4 {
		return new Vec4(
			Math.abs(this.x),
			Math.abs(this.y),
			Math.abs(this.z),
			Math.abs(this.w),
		);
	}

	/**
	 * Returns a vector with elements representing the sign of `Vec4`.
	 * - `1` if the number is positive, `+0` or `INFINITY`
	 * - `-1` if the number is negative, `-0` or `NEG_INFINITY`
	 */
	signum(): Vec4 {
		return new Vec4(
			Math.sign(this.x),
			Math.sign(this.y),
			Math.sign(this.z),
			Math.sign(this.w),
		);
	}

	/**
	 * Returns a bitmask with the lowest 2 bits set to the sign bits from the elements of `Vec4`.
	 * A negative element results in a `1` bit and a positive element in a `0` bit.  Element `x` goes
	 * into the first lowest bit, element `y` into the second, etc.
	 */
	isNegativeBitmask(): number {
		return (
			Number(this.x < 0) |
			(Number(this.y < 0) << 1) |
			(Number(this.z < 0) << 2) |
			(Number(this.w < 0) << 3)
		);
	}

	/** Returns `true` if, and only if, all elements are finite. If any element is either `NaN`, positive or negative infinity, this will return `false`. */
	isFinite(): boolean {
		return (
			Number.isFinite(this.x) &&
			Number.isFinite(this.y) &&
			Number.isFinite(this.z) &&
			Number.isFinite(this.w)
		);
	}

	/** Returns `true` if any elements are `NaN`. */
	isNaN(): boolean {
		return (
			Number.isNaN(this.x) ||
			Number.isNaN(this.y) ||
			Number.isNaN(this.z) ||
			Number.isNaN(this.w)
		);
	}

	/**
	 * Performs `isNaN` on each element of  returning a vector mask of the results.
	 * In other words, this computes `[Number.isNaN(x), Number.isNaN(y)..]`.
	 */
	isNaNMask(): BVec4 {
		return new BVec4(
			Number.isNaN(this.x),
			Number.isNaN(this.y),
			Number.isNaN(this.z),
			Number.isNaN(this.w),
		);
	}

	/** Computes the length of `Vec4`. */
	length(): number {
		return Math.sqrt(this.dot(this));
	}

	/** Computes the squared length of `Vec4`.
	 * This is faster than `length()` as it avoids a square root operation.
	 */
	lengthSquared(): number {
		return this.dot(this);
	}

	/**
	 * Computes `1 / length()`.
	 * For valid results, `Vec4` must _not_ be of length zero.
	 */
	lengthRecip(): number {
		return 1 / this.length();
	}

	/** Computes the Euclidean distance between two points in space. */
	distance(rhs: Vec4): number {
		return this.sub(rhs).length();
	}

	/** Compute the squared euclidean distance between two points in space. */
	distanceSquared(rhs: Vec4): number {
		return this.sub(rhs).lengthSquared();
	}

	/** Returns the element-wise quotient of [Euclidean division] of `Vec4` by `rhs`. */
	divEuclid(rhs: Vec4): Vec4 {
		return new Vec4(
			Math.floor(this.x / rhs.x),
			Math.floor(this.y / rhs.y),
			Math.floor(this.z / rhs.z),
			Math.floor(this.w / rhs.w),
		);
	}

	/** Returns the element-wise remainder of [Euclidean division] of `Vec4` by `rhs`. */
	remEuclid(rhs: Vec4): Vec4 {
		return new Vec4(
			this.x % rhs.x,
			this.y % rhs.y,
			this.z % rhs.z,
			this.w % rhs.w,
		);
	}

	/**
	 * Returns `Vec4` normalized to length 1.
	 * For valid results, `Vec4` must _not_ be of length zero, nor very close to zero.
	 */
	normalize(): Vec4 {
		return this.mul(this.lengthRecip());
	}

	/**
	 * Returns `Vec4` normalized to length 1 if possible, else returns zero.
	 * In particular, if the input is zero (or very close to zero), or non-finite,
	 * the result of this operation will be zero.
	 */
	normalizeOrZero(): Vec4 {
		const rcp = this.lengthRecip();

		if (Number.isFinite(rcp) && rcp > 0) {
			return this.mul(rcp);
		}

		return Vec4.ZERO;
	}

	/**
	 * Returns whether `Vec4` is length `1` or not.
	 * Uses a precision threshold of `1e-4`.
	 */
	isNormalized(): boolean {
		return Math.abs(this.lengthSquared() - 1) <= 1e-4;
	}

	/**
	 * Returns the vector projection of `Vec4` onto `rhs`.
	 * `rhs` must be of non-zero length.
	 */
	projectOnto(rhs: Vec4): Vec4 {
		const otherLenSqRcp = 1 / rhs.dot(rhs);
		return rhs.mul(this.dot(rhs) * otherLenSqRcp);
	}

	/**
	 * Returns the vector rejection of `Vec4` from `rhs`.
	 * The vector rejection is the vector perpendicular to the projection of `Vec4` onto
	 * `rhs`, in rhs words the result of `Vec4 - this.project_onto(rhs)`.
	 * `rhs` must be of non-zero length.
	 */
	rejectFrom(rhs: Vec4): Vec4 {
		return this.sub(this.projectOnto(rhs));
	}

	/**
	 * Returns the vector projection of `Vec4` onto `rhs`.
	 * `rhs` must be normalized.
	 */
	projectOntoNormalized(rhs: Vec4): Vec4 {
		return rhs.mul(this.dot(rhs));
	}

	/**
	 * Returns the vector rejection of `Vec4` from `rhs`.
	 * The vector rejection is the vector perpendicular to the projection of `Vec4` onto
	 * `rhs`, in rhs words the result of `Vec4.sub(this.projectOnto(rhs))`.
	 * `rhs` must be normalized.
	 */
	rejectFromNormalized(rhs: Vec4): Vec4 {
		return this.sub(this.projectOntoNormalized(rhs));
	}

	/**
	 * Returns a vector containing the nearest integer to a number for each element of `Vec4`.
	 * Round half-way cases away from 0.
	 */
	round(): Vec4 {
		return new Vec4(
			Math.round(this.x),
			Math.round(this.y),
			Math.round(this.z),
			Math.round(this.w),
		);
	}

	/**
	 * Returns a vector containing the largest integer less than or equal to a number for each
	 * element of `Vec4`.
	 */
	floor(): Vec4 {
		return new Vec4(
			Math.floor(this.x),
			Math.floor(this.y),
			Math.floor(this.z),
			Math.floor(this.w),
		);
	}

	/**
	 * Returns a vector containing the smallest integer greater than or equal to a number for
	 * each element of `Vec4`.
	 */
	ceil(): Vec4 {
		return new Vec4(
			Math.ceil(this.x),
			Math.ceil(this.y),
			Math.ceil(this.z),
			Math.ceil(this.w),
		);
	}

	/**
	 * Returns a vector containing the integer part each element of `Vec4`. This means numbers are
	 * always truncated towards zero.
	 */
	trunc(): Vec4 {
		return new Vec4(
			Math.trunc(this.x),
			Math.trunc(this.y),
			Math.trunc(this.z),
			Math.trunc(this.w),
		);
	}

	/**
	 * Returns a vector containing the fractional part of the vector, e.g. `Vec4 -
	 * this.floor()`.
	 * Note that this is fast but not precise for large numbers.
	 */
	fract(): Vec4 {
		return this.sub(this.floor());
	}

	/** Returns a vector containing `e^Vec4` (the exponential function) for each element of `Vec4`. */
	exp(): Vec4 {
		return new Vec4(
			Math.exp(this.x),
			Math.exp(this.y),
			Math.exp(this.z),
			Math.exp(this.w),
		);
	}

	/** Returns a vector containing each element of `Vec4` raised to the power of `n`. */
	powf(n: number): Vec4 {
		return new Vec4(this.x ** n, this.y ** n, this.z ** n, this.w ** n);
	}

	/** Returns a vector containing the reciprocal `1/n` of each element of `Vec4`. */
	recip(): Vec4 {
		return new Vec4(1 / this.x, 1 / this.y, 1 / this.z, 1 / this.w);
	}

	/**
	 * Performs a linear interpolation between `Vec4` and `rhs` based on the value `s`.
	 * When `s` is `0`, the result will be equal to `Vec4`.  When `s` is `1`, the result
	 * will be equal to `rhs`. When `s` is outside of range `[0, 1]`, the result is linearly
	 * extrapolated.
	 */
	lerp(rhs: Vec4, s: number): Vec4 {
		return this.add(rhs.sub(this).mul(s));
	}

	/**
	 * Calculates the midpoint between `Vec4` and `rhs`.
	 * The midpoint is the average of, or halfway point between, two vectors.
	 * `a.midpoint(b)` should yield the same result as `a.lerp(b, 0.5)`
	 * while being slightly cheaper to compute.
	 */
	midpoint(rhs: Vec4): Vec4 {
		return this.add(rhs).mul(0.5);
	}

	/**
	 * Returns true if the absolute difference of all elements between `Vec4` and `rhs` is
	 * less than or equal to `maxAbsDiff`.
	 * This can be used to compare if two vectors contain similar elements. It works best when
	 * comparing with a known value. The `maxAbsDiff` that should be used used depends on
	 * the values being compared against.
	 * For more see
	 * [comparing floating point numbers](https:/**randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/).
	 */
	absDiffEq(rhs: Vec4, maxAbsDiff: number): boolean {
		return this.sub(rhs).abs().cmple(Vec4.splat(maxAbsDiff)).all();
	}

	/** Returns a vector with a length no less than `min` and no more than `max`. */
	clampLength(min: number, max: number): Vec4 {
		const lengthSq = this.lengthSquared();

		if (lengthSq < min * min) {
			return this.div(Math.sqrt(lengthSq)).mul(min);
		}

		if (lengthSq > max * max) {
			return this.div(Math.sqrt(lengthSq)).mul(max);
		}

		return this;
	}

	/** Returns a vector with a length no more than `max`. */
	clampLengthMax(max: number): Vec4 {
		const lengthSq = this.lengthSquared();

		if (lengthSq > max * max) {
			return this.div(Math.sqrt(lengthSq)).mul(max);
		}

		return this;
	}

	/** Returns a vector with a length no less than `min`.  */
	clampLengthMin(min: number): Vec4 {
		const lengthSq = this.lengthSquared();

		if (lengthSq < min * min) {
			return this.div(Math.sqrt(lengthSq)).mul(min);
		}

		return this;
	}

	/**
	 * Fused multiply-add. Computes `(Vec4 * a) + b` element-wise with only one rounding
	 * error, yielding a more accurate result than an unfused multiply-add.
	 */
	mulAdd(a: Vec4, b: Vec4): Vec4 {
		return this.mul(a).add(b);
	}

	/**
	 * Returns the angle (in radians) between `Vec4` and `rhs` in the range `[-π, +π]`.
	 * The inputs do not need to be unit vectors however they must be non-zero.
	 */
	angleBetween(rhs: Vec4): number {
		const angle = Math.acos(
			this.dot(rhs) / Math.sqrt(this.lengthSquared() * rhs.lengthSquared()),
		);

		return angle;
	}

	/**
	 * Divides a Vec4 by another Vector, or by a number
	 * (this.x / rhs.x, this.y / rhs.y) or (this.x / rhs, this.y / rhs).
	 */
	div(rhs: Vec4 | number): Vec4 {
		if (rhs instanceof Vec4) {
			return new Vec4(
				this.x / rhs.x,
				this.y / rhs.y,
				this.z / rhs.z,
				this.w / rhs.w,
			);
		}

		return new Vec4(this.x / rhs, this.y / rhs, this.z / rhs, this.w / rhs);
	}

	/**
	 * Multiplies a Vec4 by another Vector, or by a number
	 * (this.x * rhs.x, this.y * rhs.y..) or (this.x * rhs, this.y * rhs..).
	 */
	mul(rhs: Vec4 | number): Vec4 {
		if (rhs instanceof Vec4) {
			return new Vec4(
				this.x * rhs.x,
				this.y * rhs.y,
				this.z * rhs.z,
				this.w * rhs.w,
			);
		}

		return new Vec4(this.x * rhs, this.y * rhs, this.z * rhs, this.w * rhs);
	}

	/**
	 * Sums a Vec4 by another Vector, or by a number
	 * (this.x + rhs.x, this.y + rhs.y..) or (this.x + rhs, this.y + rhs..)
	 */
	add(rhs: Vec4 | number): Vec4 {
		if (rhs instanceof Vec4) {
			return new Vec4(
				this.x + rhs.x,
				this.y + rhs.y,
				this.z + rhs.z,
				this.w + rhs.w,
			);
		}

		return new Vec4(this.x + rhs, this.y + rhs, this.z + rhs, this.w + rhs);
	}

	/**
	 * Subtracts a Vec4 by another Vector, or by a number
	 * (this.x - rhs.x, this.y - rhs.y..) or (this.x - rhs, this.y - rhs..)
	 */
	sub(rhs: Vec4 | number): Vec4 {
		if (rhs instanceof Vec4) {
			return new Vec4(
				this.x - rhs.x,
				this.y - rhs.y,
				this.z - rhs.z,
				this.w - rhs.w,
			);
		}

		return new Vec4(this.x - rhs, this.y - rhs, this.z - rhs, this.w - rhs);
	}

	/**
	 * Divides a Vec4 by another Vector, or by a number and return its remainder
	 * (this.x % rhs.x, this.y % rhs.y..) or (this.x % rhs, this.y % rhs..)
	 */
	rem(rhs: Vec4 | number): Vec4 {
		if (rhs instanceof Vec4) {
			return new Vec4(
				this.x % rhs.x,
				this.y % rhs.y,
				this.z % rhs.z,
				this.w % rhs.w,
			);
		}

		return new Vec4(this.x % rhs, this.y % rhs, this.z % rhs, this.w % rhs);
	}

	/** Returns (-this.x, -this.y..) */
	neg(): Vec4 {
		return new Vec4(-this.x, -this.y, -this.z, -this.w);
	}

	/** Compares if the vector is equal to another. */
	eq(rhs: Vec4 | number): boolean {
		if (rhs instanceof Vec4) {
			return (
				this.x === rhs.x &&
				this.y === rhs.y &&
				this.z === rhs.z &&
				this.w === rhs.w
			);
		}

		return this.x === rhs && this.y === rhs && this.z === rhs && this.w === rhs;
	}

	/** Compares if the vector is not equal to another. */
	ne(rhs: Vec4 | number): boolean {
		if (rhs instanceof Vec4) {
			return (
				this.x !== rhs.x ||
				this.y !== rhs.y ||
				this.z !== rhs.z ||
				this.w !== rhs.w
			);
		}

		return this.x !== rhs || this.y !== rhs || this.z !== rhs || this.w !== rhs;
	}

	/** Compares if the vector is approximately equal to another, by the threshold of 1e-6. */
	approxEq(rhs: Vec4 | number): boolean {
		const threshold = 1e-6;

		if (rhs instanceof Vec4) {
			return (
				Math.abs(this.x - rhs.x) < threshold &&
				Math.abs(this.y - rhs.y) < threshold &&
				Math.abs(this.z - rhs.z) < threshold &&
				Math.abs(this.w - rhs.w) < threshold
			);
		}

		return (
			Math.abs(this.x - rhs) < threshold &&
			Math.abs(this.y - rhs) < threshold &&
			Math.abs(this.z - rhs) < threshold &&
			Math.abs(this.w - rhs) < threshold
		);
	}
}
