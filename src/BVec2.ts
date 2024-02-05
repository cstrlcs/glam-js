// Do not edit this file directly. Edit the template instead: `codegen/templates/bvec.eta`.

export class BVec2 {
	constructor(
		public x: boolean,
		public y: boolean,
	) {}

	/** All false. (false, false..) */
	static get FALSE() {
		return BVec2.splat(false);
	}

	/** All true. (true, true..) */
	static get TRUE() {
		return BVec2.splat(true);
	}

	/** Creates a vector with all elements set to v. */
	static splat(v: boolean): BVec2 {
		return new BVec2(v, v);
	}

	/**
	 * Returns a bitmask with the lowest 2 bits set from the elements of BVec2.
	 * A true element results in a 1 bit and a false element in a 0 bit. Element x goes into the first lowest bit, element y into the second, etc.
	 */
	bitmask(): number {
		return Number(this.x) | (Number(this.y) << 1);
	}

	/** Returns true if any of the elements are true, false otherwise. */
	any(): boolean {
		return this.x || this.y;
	}

	/** Returns true if all the elements are true, false otherwise. */
	all(): boolean {
		return this.x && this.y;
	}

	/** Tests the value at index. */
	test(index: 0 | 1): boolean | undefined {
		return [this.x, this.y][index];
	}

	/** Sets the element at index. */
	set(index: 0 | 1, value: boolean): void {
		const property = ["x", "y"][index] as "x" | "y";
		this[property] = value;
	}

	/** Performs the & operation. */
	bitand(rhs: BVec2): BVec2 {
		return new BVec2(
			Boolean(Number(this.x) & Number(rhs.x)),
			Boolean(Number(this.y) & Number(rhs.y)),
		);
	}

	/** Performs the | operation. */
	bitor(rhs: BVec2): BVec2 {
		return new BVec2(
			Boolean(Number(this.x) | Number(rhs.x)),
			Boolean(Number(this.y) | Number(rhs.y)),
		);
	}

	/** Performs the ^ operation. */
	bitxor(rhs: BVec2): BVec2 {
		return new BVec2(
			Boolean(Number(this.x) ^ Number(rhs.x)),
			Boolean(Number(this.y) ^ Number(rhs.y)),
		);
	}

	/** Returns the negation. */
	not(): BVec2 {
		return new BVec2(!this.x, !this.y);
	}

	/** This method tests for self and other values to be equal, and is used by ==. */
	eq(rhs: BVec2 | boolean): boolean {
		if (rhs instanceof BVec2) {
			return this.x === rhs.x && this.y === rhs.y;
		}

		return this.x === rhs && this.y === rhs;
	}

	/** This method tests for !=. */
	ne(rhs: BVec2 | boolean): boolean {
		if (rhs instanceof BVec2) {
			return this.x !== rhs.x || this.y !== rhs.y;
		}

		return this.x !== rhs || this.y !== rhs;
	}

	/** Prints out a formatted output of the instance. */
	toString() {
		return `BVec2(${this.x}, ${this.y})`;
	}
}
