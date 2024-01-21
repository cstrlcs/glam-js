// Do not edit this file directly. Edit the template instead: `codegen/templates/bvec.eta`.

export class BVec4 {
	constructor(
		public x: boolean,
		public y: boolean,
		public z: boolean,
		public w: boolean,
	) {}

	/** All false. */
	static FALSE = BVec4.splat(false);

	/** All true. */
	static TRUE = BVec4.splat(true);

	/** Creates a vector with all elements set to v. */
	static splat(v: boolean): BVec4 {
		return new BVec4(v, v, v, v);
	}

	/**
	 * Returns a bitmask with the lowest 2 bits set from the elements of BVec4.
	 * A true element results in a 1 bit and a false element in a 0 bit. Element x goes into the first lowest bit, element y into the second, etc.
	 */
	bitmask(): number {
		return (
			Number(this.x) |
			(Number(this.y) << 1) |
			(Number(this.z) << 2) |
			(Number(this.w) << 3)
		);
	}

	/** Returns true if any of the elements are true, false otherwise. */
	any(): boolean {
		return this.x || this.y || this.z || this.w;
	}

	/** Returns true if all the elements are true, false otherwise. */
	all(): boolean {
		return this.x && this.y && this.z && this.w;
	}

	/** Tests the value at index. */
	test(index: 0 | 1 | 2 | 3): boolean {
		return [this.x, this.y, this.z, this.w][index];
	}

	/** Sets the element at index. */
	set(index: 0 | 1 | 2 | 3, value: boolean): void {
		const property = ["x", "y", "z", "w"][index] as "x" | "y" | "z" | "w";
		this[property] = value;
	}

	/** Performs the & operation. */
	bitand(rhs: BVec4): BVec4 {
		return new BVec4(
			Boolean(Number(this.x) & Number(rhs.x)),
			Boolean(Number(this.y) & Number(rhs.y)),
			Boolean(Number(this.z) & Number(rhs.z)),
			Boolean(Number(this.w) & Number(rhs.w)),
		);
	}

	/** Performs the | operation. */
	bitor(rhs: BVec4): BVec4 {
		return new BVec4(
			Boolean(Number(this.x) | Number(rhs.x)),
			Boolean(Number(this.y) | Number(rhs.y)),
			Boolean(Number(this.z) | Number(rhs.z)),
			Boolean(Number(this.w) | Number(rhs.w)),
		);
	}

	/** Performs the ^ operation. */
	bitxor(rhs: BVec4): BVec4 {
		return new BVec4(
			Boolean(Number(this.x) ^ Number(rhs.x)),
			Boolean(Number(this.y) ^ Number(rhs.y)),
			Boolean(Number(this.z) ^ Number(rhs.z)),
			Boolean(Number(this.w) ^ Number(rhs.w)),
		);
	}

	/** Returns the negation. */
	not(): BVec4 {
		return new BVec4(!this.x, !this.y, !this.z, !this.w);
	}

	/** This method tests for self and other values to be equal, and is used by ==. */
	eq(rhs: BVec4 | boolean): boolean {
		if (rhs instanceof BVec4) {
			return (
				this.x === rhs.x &&
				this.y === rhs.y &&
				this.z === rhs.z &&
				this.w === rhs.w
			);
		}

		return this.x === rhs && this.y === rhs && this.z === rhs && this.w === rhs;
	}

	/** This method tests for !=. */
	ne(rhs: BVec4 | boolean): boolean {
		if (rhs instanceof BVec4) {
			return (
				this.x !== rhs.x ||
				this.y !== rhs.y ||
				this.z !== rhs.z ||
				this.w !== rhs.w
			);
		}

		return this.x !== rhs || this.y !== rhs || this.z !== rhs || this.w !== rhs;
	}
}
