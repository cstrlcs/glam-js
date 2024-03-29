// Do not edit this file directly. Edit the template instead: `./codegen/templates/bvec.txt`.

export class BVec3 {
	constructor(
		public x: boolean,
		public y: boolean,
		public z: boolean,
	) {}

	/** All false. (false, false..) */
	static get FALSE() {
		return BVec3.splat(false);
	}

	/** All true. (true, true..) */
	static get TRUE() {
		return BVec3.splat(true);
	}

	/** Creates a vector with all elements set to v. */
	static splat(v: boolean): BVec3 {
		return new BVec3(v, v, v);
	}

	/**
	 * Returns a bitmask with the lowest 2 bits set from the elements of BVec3.
	 * A true element results in a 1 bit and a false element in a 0 bit. Element x goes into the first lowest bit, element y into the second, etc.
	 */
	bitmask(): number {
		return Number(this.x) | (Number(this.y) << 1) | (Number(this.z) << 2);
	}

	/** Returns true if any of the elements are true, false otherwise. */
	any(): boolean {
		return this.x || this.y || this.z;
	}

	/** Returns true if all the elements are true, false otherwise. */
	all(): boolean {
		return this.x && this.y && this.z;
	}

	/** Tests the value at index. */
	test(index: 0 | 1 | 2): boolean | undefined {
		return [this.x, this.y, this.z][index];
	}

	/** Sets the element at index. */
	set(index: 0 | 1 | 2, value: boolean): void {
		const property = ["x", "y", "z"][index] as "x" | "y" | "z";
		this[property] = value;
	}

	/** Performs the & operation. */
	bitand(rhs: BVec3): BVec3 {
		return new BVec3(
			Boolean(Number(this.x) & Number(rhs.x)),
			Boolean(Number(this.y) & Number(rhs.y)),
			Boolean(Number(this.z) & Number(rhs.z)),
		);
	}

	/** Performs the | operation. */
	bitor(rhs: BVec3): BVec3 {
		return new BVec3(
			Boolean(Number(this.x) | Number(rhs.x)),
			Boolean(Number(this.y) | Number(rhs.y)),
			Boolean(Number(this.z) | Number(rhs.z)),
		);
	}

	/** Performs the ^ operation. */
	bitxor(rhs: BVec3): BVec3 {
		return new BVec3(
			Boolean(Number(this.x) ^ Number(rhs.x)),
			Boolean(Number(this.y) ^ Number(rhs.y)),
			Boolean(Number(this.z) ^ Number(rhs.z)),
		);
	}

	/** Returns the negation. */
	not(): BVec3 {
		return new BVec3(!this.x, !this.y, !this.z);
	}

	/** This method tests for self and other values to be equal, and is used by ==. */
	eq(rhs: BVec3 | boolean): boolean {
		if (rhs instanceof BVec3) {
			return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
		}

		return this.x === rhs && this.y === rhs && this.z === rhs;
	}

	/** This method tests for !=. */
	ne(rhs: BVec3 | boolean): boolean {
		if (rhs instanceof BVec3) {
			return this.x !== rhs.x || this.y !== rhs.y || this.z !== rhs.z;
		}

		return this.x !== rhs || this.y !== rhs || this.z !== rhs;
	}

	/** Prints out a formatted output of the instance. */
	toString() {
		return `BVec3(${this.x}, ${this.y}, ${this.z})`;
	}
}
