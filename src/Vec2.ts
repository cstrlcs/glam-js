// Do not edit this file directly. Edit the template instead: `codegen/templates/vec.eta`.

import { Vec3, Vec4, BVec2, BVec3, BVec4 } from "./";

export class Vec2 {
	constructor(
		public x: number,
		public y: number,
	) {}

  /** All zeroes. */
	static ZERO = Vec2.splat(0);

	/** All ones. */
	static ONE = Vec2.splat(1);

	/** All negative ones. */
	static NEG_ONE = Vec2.splat(-1);

	/** All `Number.MIN_VALUE`. */
	static MIN = Vec2.splat(Number.MIN_VALUE);

	/** All `Number.MAX_VALUE`. */
	static MAX = Vec2.splat(Number.MAX_VALUE);

	/** All `NaN`. */
	static NAN = Vec2.splat(NaN);

	/** All `Infinity`. */
	static INFINITY = Vec2.splat(Infinity);

	/** All `-Infinity`. */
	static NEG_INFINITY = Vec2.splat(-Infinity);

	/** A unit vector pointing along the positive X axis. */
	static X = new Vec2(1, 0);

	/** A unit vector pointing along the positive Y axis. */
	static Y = new Vec2(0, 1);

	/** A unit vector pointing along the negative X axis. */
	static NEG_X = new Vec2(-1, 0);

	/** A unit vector pointing along the negative Y axis. */
	static NEG_Y = new Vec2(0, -1);

	/** The unit axes. */
	static AXES = [Vec2.X, Vec2.Y];

	/** Creates a vector with all elements set to v. */
	static splat(v: number): Vec2 {
		return new Vec2(v, v);
	}

	/**
	 * Creates a vector from the elements in `ifTrue` and `ifFalse`, selecting which to use for each element.
	 * A true element in the mask uses the corresponding element from `ifTrue`, and false uses the element from `ifFalse`.
	 */
	static select(mask: BVec2, ifTrue: Vec2, ifFalse: Vec2): Vec2 {
		return new Vec2(
			mask.test(0) ? ifTrue.x : ifFalse.x,
			mask.test(1) ? ifTrue.y : ifFalse.y,
		);
	}

	/** Creates a new vector from an array. */
	static fromArray(a: [number, number]): Vec2 {
		return new Vec2(a[0], a[1]);
	}

	/** [x, y] */
	toArray(): [number, number] {
		return [this.x, this.y];
	}

	/** Creates a `Vec3` vector from `Vec2` and the given `value` value. */
	extend(value: number): Vec3 {
		return new Vec3(this.x, this.y, value);
	}

	/** Computes the dot product of `Vec2` and `rhs`. */
	dot(rhs: Vec2): number {
		return this.x * rhs.x + this.y * rhs.y;
	}

	/** Returns a vector where every component is the dot product of `Vec3` and `rhs`. */
	dotIntoVec(rhs: Vec2): Vec2 {
		return Vec2.splat(this.dot(rhs));
	}

	/** 
	 * Returns a vector containing the minimum values for each element of `Vec2` and `rhs`.
	 * In other words this computes `Math.min(this.x, rhs.x), Math.min(this.y, rhs.y)..`.
	 */
	min(rhs: Vec2): Vec2 {
		return new Vec2(Math.min(this.x, rhs.x), Math.min(this.y, rhs.y));
	}

	/** 
	 * Returns a vector containing the maximum values for each element of `Vec2` and `rhs`.
	 * In other words this computes `Math.max(this.x, rhs.x), Math.max(this.y, rhs.y)..`.
	 */
	max(rhs: Vec2): Vec2 {
		return new Vec2(Math.max(this.x, rhs.x), Math.max(this.y, rhs.y));
	}

	/** Component-wise clamping of values. */
	clamp(min: Vec2, max: Vec2): Vec2 {
		return this.max(min).min(max);
	}

	/** 
	 * Returns the horizontal minimum of `Vec2`.
	 * In other words this computes `Math.min(x, y..)`. 
	 */
	minElement(): number {
		return Math.min(this.x, this.y);
	}

	/** 
	 * Returns the horizontal maximum of `Vec2`.
	 * In other words this computes `Math.max(x, y, ..)`.
	 */
	maxElement(): number {
		return Math.max(this.x, this.y);
	}

	/** 
	 * Returns a vector mask containing the result of a `==` comparison for each element of `Vec2` and `rhs`.
	 * In other words this computes `[this.x == rhs.x, this.y == rhs.y..]` for all elements. 
	 */
	cmpeq(rhs: Vec2): BVec2 {
		return new BVec2(this.x === rhs.x, this.y === rhs.y);
	}

	/** 
	 * Returns a vector mask containing the result of a `!=` comparison for each element of `Vec2` and `rhs`.
	 * In other words this computes `[this.x != rhs.x, this.y != rhs.y..]` for all elements. 
	 */
	cmpne(rhs: Vec2): BVec2 {
		return new BVec2(this.x !== rhs.x, this.y !== rhs.y);
	}

	/** 
	 * Returns a vector mask containing the result of a `>=` comparison for each element of `Vec2` and `rhs`.
	 * In other words this computes `[this.x >= rhs.x, this.y >= rhs.y..]` for all elements. 
	 */
	cmpge(rhs: Vec2): BVec2 {
		return new BVec2(this.x >= rhs.x, this.y >= rhs.y);
	}

	/** 
	 * Returns a vector mask containing the result of a `>` comparison for each element of `Vec2` and `rhs`.
	 * In other words this computes `[this.x > rhs.x, this.y > rhs.y..]` for all elements. 
	 */
	cmpgt(rhs: Vec2): BVec2 {
		return new BVec2(this.x > rhs.x, this.y > rhs.y);
	}

	/** 
	 * Returns a vector mask containing the result of a `<=` comparison for each element of `Vec2` and `rhs`.
	 * In other words this computes `[this.x <= rhs.x, this.y <= rhs.y..]` for all elements. 
	 */
	cmple(rhs: Vec2): BVec2 {
		return new BVec2(this.x <= rhs.x, this.y <= rhs.y);
	}

	/** 
	 * Returns a vector mask containing the result of a `<` comparison for each element of `Vec2` and `rhs`.
	 * In other words this computes `[this.x < rhs.x, this.y < rhs.y..]` for all elements. 
	 */
	cmplt(rhs: Vec2): BVec2 {
		return new BVec2(this.x < rhs.x, this.y < rhs.y);
	}

	/** Returns a vector containing the absolute value of each element of `Vec3`. */
	abs(): Vec2 {
		return new Vec2(Math.abs(this.x), Math.abs(this.y));
	}

	/** 
	 * Returns a vector with elements representing the sign of `Vec2`.
	 * - `1` if the number is positive, `+0` or `INFINITY`
	 * - `-1` if the number is negative, `-0` or `NEG_INFINITY`	
	 */
	signum(): Vec2 {
		return new Vec2(Math.sign(this.x), Math.sign(this.y));
	}

	/** 
	 * Returns a bitmask with the lowest 2 bits set to the sign bits from the elements of `Vec2`.
	 * A negative element results in a `1` bit and a positive element in a `0` bit.  Element `x` goes
	 * into the first lowest bit, element `y` into the second, etc.
	 */
	isNegativeBitmask(): number {
		return (Number(this.x < 0)) | (Number(this.y < 0) << 1);
	}

	/** Returns `true` if, and only if, all elements are finite. If any element is either `NaN`, positive or negative infinity, this will return `false`. */
	isFinite(): boolean {
		return Number.isFinite(this.x) && Number.isFinite(this.y);
	}

	/** Returns `true` if any elements are `NaN`. */
	isNaN(): boolean {
		return Number.isNaN(this.x) || Number.isNaN(this.y);
	}

	/** 
	 * Performs `isNaN` on each element of  returning a vector mask of the results.
	 * In other words, this computes `[Number.isNaN(x), Number.isNaN(y)..]`.
	 */
	isNaNMask(): BVec2 {
		return new BVec2(Number.isNaN(this.x), Number.isNaN(this.y));
	}

	/** Computes the length of `Vec2`. */
	length(): number {
		return Math.sqrt(this.dot(this));
	}

	/** Computes the squared length of `Vec2`.
	 * This is faster than `length()` as it avoids a square root operation.
	 */
	lengthSquared(): number {
		return this.dot(this);
	}

	/** 
	 * Computes `1 / length()`.
	 * For valid results, `Vec2` must _not_ be of length zero.
	 */
	lengthRecip(): number {
		return 1 / this.length();
	}

	/** Computes the Euclidean distance between two points in space. */
	distance(rhs: Vec2): number {
		return this.sub(rhs).length();
	}

	/** Compute the squared euclidean distance between two points in space. */
	distanceSquared(rhs: Vec2): number {
		return this.sub(rhs).lengthSquared();
	}

	/** Returns the element-wise quotient of [Euclidean division] of `Vec2` by `rhs`. */
	divEuclid(rhs: Vec2): Vec2 {
		return new Vec2(Math.floor(this.x / rhs.x), Math.floor(this.y / rhs.y));
	}

	/** Returns the element-wise remainder of [Euclidean division] of `Vec2` by `rhs`. */
	remEuclid(rhs: Vec2): Vec2 {
		return new Vec2(this.x % rhs.x, this.y % rhs.y);
	}

	/** 
	 * Returns `Vec2` normalized to length 1.
	 * For valid results, `Vec2` must _not_ be of length zero, nor very close to zero.
	 */
	normalize(): Vec2 {
		return this.mul(this.lengthRecip());
	}

	/** 
	 * Returns `Vec2` normalized to length 1 if possible, else returns zero.
	 * In particular, if the input is zero (or very close to zero), or non-finite,
	 * the result of this operation will be zero.
	 */
	normalizeOrZero(): Vec2 {
		const rcp = this.lengthRecip();

		if (Number.isFinite(rcp) && rcp > 0) {
			return this.mul(rcp);
		}

		return Vec2.ZERO;
	}

	/** 
	 * Returns whether `Vec2` is length `1` or not.
	 * Uses a precision threshold of `1e-4`.
	 */
	isNormalized(): boolean {
		return Math.abs(this.lengthSquared() - 1) <= 1e-4;
	}

	/** 
	 * Returns the vector projection of `Vec2` onto `rhs`.
	 * `rhs` must be of non-zero length.
	 */
	projectOnto(rhs: Vec2): Vec2 {
		const otherLenSqRcp = 1 / rhs.dot(rhs);
		return rhs.mul(this.dot(rhs) * otherLenSqRcp);
	}

	/** 
	 * Returns the vector rejection of `Vec2` from `rhs`.
	 * The vector rejection is the vector perpendicular to the projection of `Vec2` onto
	 * `rhs`, in rhs words the result of `Vec2 - this.project_onto(rhs)`.
	 * `rhs` must be of non-zero length.
	 */
	rejectFrom(rhs: Vec2): Vec2 {
		return this.sub(this.projectOnto(rhs));
	}

	/** 
	 * Returns the vector projection of `Vec2` onto `rhs`.
	 * `rhs` must be normalized.
	 */
	projectOntoNormalized(rhs: Vec2): Vec2 {
		return rhs.mul(this.dot(rhs));
	}

	/** 
	 * Returns the vector rejection of `Vec2` from `rhs`.
	 * The vector rejection is the vector perpendicular to the projection of `Vec2` onto
	 * `rhs`, in rhs words the result of `Vec2.sub(this.projectOnto(rhs))`.
	 * `rhs` must be normalized.
	 */
	rejectFromNormalized(rhs: Vec2): Vec2 {
		return this.sub(this.projectOntoNormalized(rhs));
	}

	/** 
	 * Returns a vector containing the nearest integer to a number for each element of `Vec2`.
	 * Round half-way cases away from 0.
	 */
	round(): Vec2 {
		return new Vec2(Math.round(this.x), Math.round(this.y));
	}

	/** 
	 * Returns a vector containing the largest integer less than or equal to a number for each
	 * element of `Vec2`.
	 */
	floor(): Vec2 {
		return new Vec2(Math.floor(this.x), Math.floor(this.y));
	}

	/** 
	 * Returns a vector containing the smallest integer greater than or equal to a number for
	 * each element of `Vec2`.
	 */
	ceil(): Vec2 {
		return new Vec2(Math.ceil(this.x), Math.ceil(this.y));
	}

	/** 
	 * Returns a vector containing the integer part each element of `Vec2`. This means numbers are
	 * always truncated towards zero.
	 */
	trunc(): Vec2 {
		return new Vec2(Math.trunc(this.x), Math.trunc(this.y));
	}

	/** 
	 * Returns a vector containing the fractional part of the vector, e.g. `Vec2 -
	 * this.floor()`.
	 * Note that this is fast but not precise for large numbers.
	 */
	fract(): Vec2 {
		return this.sub(this.floor());
	}

	/** Returns a vector containing `e^Vec2` (the exponential function) for each element of `Vec2`. */
	exp(): Vec2 {
		return new Vec2(Math.exp(this.x), Math.exp(this.y));
	}

	/** Returns a vector containing each element of `Vec2` raised to the power of `n`. */
	powf(n: number): Vec2 {
		return new Vec2(this.x ** n, this.y ** n);
	}

	/** Returns a vector containing the reciprocal `1/n` of each element of `Vec2`. */
	recip(): Vec2 {
		return new Vec2(1 / this.x, 1 / this.y);
	}

	/** 
	 * Performs a linear interpolation between `Vec2` and `rhs` based on the value `s`.
	 * When `s` is `0`, the result will be equal to `Vec2`.  When `s` is `1`, the result
	 * will be equal to `rhs`. When `s` is outside of range `[0, 1]`, the result is linearly
	 * extrapolated.
	 */
	lerp(rhs: Vec2, s: number): Vec2 {
		return this.add(rhs.sub(this).mul(s));
	}

	/** 
	 * Calculates the midpoint between `Vec2` and `rhs`.
	 * The midpoint is the average of, or halfway point between, two vectors.
	 * `a.midpoint(b)` should yield the same result as `a.lerp(b, 0.5)`
	 * while being slightly cheaper to compute.
	 */
	midpoint(rhs: Vec2): Vec2 {
		return this.add(rhs).mul(0.5);
	}

	/** 
	 * Returns true if the absolute difference of all elements between `Vec2` and `rhs` is
	 * less than or equal to `maxAbsDiff`.
	 * This can be used to compare if two vectors contain similar elements. It works best when
	 * comparing with a known value. The `maxAbsDiff` that should be used used depends on
	 * the values being compared against.
	 * For more see
	 * [comparing floating point numbers](https:/**randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/).
	*/
	absDiffEq(rhs: Vec2, maxAbsDiff: number): boolean {
		return this.sub(rhs).abs().cmple(Vec2.splat(maxAbsDiff)).all();
	}

	/** Returns a vector with a length no less than `min` and no more than `max`. */
	clampLength(min: number, max: number): Vec2 {
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
	clampLengthMax(max: number): Vec2 {
		const lengthSq = this.lengthSquared();

		if (lengthSq > max * max) {
			return this.div(Math.sqrt(lengthSq)).mul(max);
		}

		return this;
	}

	/** Returns a vector with a length no less than `min`.  */
	clampLengthMin(min: number): Vec2 {
		const lengthSq = this.lengthSquared();

		if (lengthSq < min * min) {
			return this.div(Math.sqrt(lengthSq)).mul(min);
		}

		return this;
	}

	/** 
	 * Fused multiply-add. Computes `(Vec2 * a) + b` element-wise with only one rounding
	 * error, yielding a more accurate result than an unfused multiply-add.
	 */
	mulAdd(a: Vec2, b: Vec2): Vec2 {
		return this.mul(a).add(b);
	}

	/** 
	 * Creates a 2D vector containing `[Math.cos(angle), Math.sin(angle)]`. This can be used in
	 * conjunction with the [`rotate()`][Vec2.rotate()] method, e.g.
	 * `Vec2.fromAngle(PI).rotate(Vector.Y)` will create the vector `[-1, 0]`
	 * and rotate [`Vector.Y`] around it returning `Vector.Y.neg()`.
	 */
	static fromAngle(angle: number): Vec2 {
		const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
		return new Vec2(cos, sin);
	}

	/** 
	 * Returns the angle (in radians) of this vector in the range `[-π, +π]`.
	 * The input does not need to be a unit vector however it must be non-zero.
	 */
	toAngle(): number {
		return Math.atan2(this.y, this.x);
	}

	/** 
	 * Returns the angle (in radians) between `Vec2` and `rhs` in the range `[-π, +π]`.
	 * The inputs do not need to be unit vectors however they must be non-zero.
	 */
	angleBetween(rhs: Vec2): number {
		const angle = Math.acos(
			this.dot(rhs) / Math.sqrt(this.lengthSquared() * rhs.lengthSquared()),
		);

		return angle * Math.sign(this.perpDot(rhs));
	}

	/** Returns a vector that is equal to `Vec2` rotated by 90 degrees. */
	perp(): Vec2 {
		return new Vec2(-this.y, this.x);
	}

	/** 
	 * The perpendicular dot product of `Vec2` and `rhs`.
	 * Also known as the wedge product, 2D cross product, and determinant.
	 */
	perpDot(rhs: Vec2): number {
		return this.x * rhs.y - this.y * rhs.x;
	}

	/** 
	 * Returns `rhs` rotated by the angle of `Vec2`. If `Vec2` is normalized,
	 * then this just rotation. This is what you usually want. Otherwise,
	 * it will be like a rotation with a multiplication by `Vec2`'s length.
	 */
	rotate(rhs: Vec2): Vec2 {
		return new Vec2(
			this.x * rhs.x - this.y * rhs.y,
			this.y * rhs.x + this.x * rhs.y,
		);
	}

	/** 
	 * Divides a Vec2 by another Vector, or by a number
	 * (this.x / rhs.x, this.y / rhs.y) or (this.x / rhs, this.y / rhs).
	 */
	div(rhs: Vec2 | number): Vec2 {
		if (rhs instanceof Vec2) {
			return new Vec2(this.x / rhs.x, this.y / rhs.y);
		}

		return new Vec2(this.x / rhs, this.y / rhs);
	}

	/**
	 * Multiplies a Vec2 by another Vector, or by a number
	 * (this.x * rhs.x, this.y * rhs.y..) or (this.x * rhs, this.y * rhs..).
	 */
	mul(rhs: Vec2 | number): Vec2 {
		if (rhs instanceof Vec2) {
			return new Vec2(this.x * rhs.x, this.y * rhs.y);
		}

		return new Vec2(this.x * rhs, this.y * rhs);
	}

	/** 
	 * Sums a Vec2 by another Vector, or by a number
	 * (this.x + rhs.x, this.y + rhs.y..) or (this.x + rhs, this.y + rhs..)
	 */
	add(rhs: Vec2 | number): Vec2 {
		if (rhs instanceof Vec2) {
			return new Vec2(this.x + rhs.x, this.y + rhs.y);
		}

		return new Vec2(this.x + rhs, this.y + rhs);
	}

	/**
	 * Subtracts a Vec2 by another Vector, or by a number
	 * (this.x - rhs.x, this.y - rhs.y..) or (this.x - rhs, this.y - rhs..)
	 */
	sub(rhs: Vec2 | number): Vec2 {
		if (rhs instanceof Vec2) {
			return new Vec2(this.x - rhs.x, this.y - rhs.y);
		}

		return new Vec2(this.x - rhs, this.y - rhs);
	}

	/**
	 * Divides a Vec2 by another Vector, or by a number and return its remainder
	 * (this.x % rhs.x, this.y % rhs.y..) or (this.x % rhs, this.y % rhs..)
	 */
	rem(rhs: Vec2 | number): Vec2 {
		if (rhs instanceof Vec2) {
			return new Vec2(this.x % rhs.x, this.y % rhs.y);
		}

		return new Vec2(this.x % rhs, this.y % rhs);
	}

	/** Returns (-this.x, -this.y..) */
	neg(): Vec2 {
		return new Vec2(-this.x, -this.y);
	}

	/** Compares if the vector is equal to another. */
	eq(rhs: Vec2 | number): boolean {
		if (rhs instanceof Vec2) {
			return this.x === rhs.x && this.y === rhs.y;
		}

		return this.x === rhs && this.y === rhs;
	}

	/** Compares if the vector is not equal to another. */
	ne(rhs: Vec2 | number): boolean {
		if (rhs instanceof Vec2) {
			return this.x !== rhs.x || this.y !== rhs.y;
		}

		return this.x !== rhs || this.y !== rhs;
	}

	/** Compares if the vector is approximately equal to another, by the threshold of 1e-6. */
	approxEq(rhs: Vec2 | number): boolean {
		const threshold = 1e-6;

		if (rhs instanceof Vec2) {
			return Math.abs(this.x - rhs.x) < threshold && Math.abs(this.y - rhs.y) < threshold;
		}

		return Math.abs(this.x - rhs) < threshold && Math.abs(this.y - rhs) < threshold;
	}

	/** Applies a swizzle to the vector. Example: "v0._`xyxy` => Vec4(this.x, this.y, this.x, this.y)" */
	_(value: TemplateStringsArray): Vec2 | Vec3 | Vec4 {
		const properties = ["x", "y", "z", "w"];
		const params = value[0].trim().split("");
		const values = [this.x, this.y];

		if (params.some((param) => !properties.slice(0, 2).includes(param))) {
			throw new Error("Invalid parameters. Only [x, y] are allowed.");
		}

		const coordinates = params.map(
			(param) => values[properties.indexOf(param)],
		);

		switch (params.length) {
			case 2:
				return new Vec2(coordinates[0], coordinates[1]);
			case 3:
				return new Vec3(coordinates[0], coordinates[1], coordinates[2]);
			case 4:
				return new Vec4(
					coordinates[0],
					coordinates[1],
					coordinates[2],
					coordinates[3],
				);
			default:
				throw new Error("Invalid number of parameters.");
		}
	}
}
