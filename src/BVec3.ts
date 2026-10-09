/** A 3-dimensional `bool` vector mask. */
export class BVec3 {
  declare x: boolean;
  declare y: boolean;
  declare z: boolean;

  constructor(x: boolean, y: boolean, z: boolean) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /** All false. */
  static get FALSE() {
    return new BVec3(false, false, false);
  }

  /** All true. */
  static get TRUE() {
    return new BVec3(true, true, true);
  }

  /** Creates a new vector mask. */
  static new(x: boolean, y: boolean, z: boolean): BVec3 {
    return new BVec3(x, y, z);
  }

  /** Creates a vector mask with all elements set to `v`. */
  static splat(v: boolean): BVec3 {
    return new BVec3(v, v, v);
  }

  /** Creates a new vector mask from a bool array. */
  static fromArray(a: [boolean, boolean, boolean]): BVec3 {
    return new BVec3(a[0], a[1], a[2]);
  }

  /**
   * Returns a bitmask with the lowest 3 bits set from the elements of `this`.
   *
   * A true element results in a `1` bit and a false element in a `0` bit.  Element `x` goes
   * into the first lowest bit, element `y` into the second, etc.
   */
  bitmask(): number {
    return (this.x ? 1 : 0) + (this.y ? 2 : 0) + (this.z ? 4 : 0);
  }

  /** Returns true if any of the elements are true, false otherwise. */
  any(): boolean {
    return this.x || this.y || this.z;
  }

  /** Returns true if all the elements are true, false otherwise. */
  all(): boolean {
    return this.x && this.y && this.z;
  }

  /**
   * Tests the value at `index`.
   *
   * Throws a `RangeError` if `index` is greater than 2.
   */
  test(index: 0 | 1 | 2): boolean {
    switch (index) {
      case 0: {
        return this.x;
      }
      case 1: {
        return this.y;
      }
      case 2: {
        return this.z;
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /**
   * Sets the element at `index`.
   *
   * Throws a `RangeError` if `index` is greater than 2.
   */
  set(index: 0 | 1 | 2, value: boolean): void {
    switch (index) {
      case 0: {
        this.x = value;

        break;
      }
      case 1: {
        this.y = value;

        break;
      }
      case 2: {
        this.z = value;

        break;
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  bitand(rhs: BVec3): BVec3 {
    return new BVec3(this.x && rhs.x, this.y && rhs.y, this.z && rhs.z);
  }

  bitor(rhs: BVec3): BVec3 {
    return new BVec3(this.x || rhs.x, this.y || rhs.y, this.z || rhs.z);
  }

  bitxor(rhs: BVec3): BVec3 {
    return new BVec3(this.x !== rhs.x, this.y !== rhs.y, this.z !== rhs.z);
  }

  bitandAssign(rhs: BVec3): this {
    this.x &&= rhs.x;
    this.y &&= rhs.y;
    this.z &&= rhs.z;

    return this;
  }

  bitorAssign(rhs: BVec3): this {
    this.x ||= rhs.x;
    this.y ||= rhs.y;
    this.z ||= rhs.z;

    return this;
  }

  bitxorAssign(rhs: BVec3): this {
    this.x = this.x !== rhs.x;
    this.y = this.y !== rhs.y;
    this.z = this.z !== rhs.z;

    return this;
  }

  not(): BVec3 {
    return new BVec3(!this.x, !this.y, !this.z);
  }

  eq(rhs: BVec3 | boolean): boolean {
    if (typeof rhs === "boolean") {
      return this.x === rhs && this.y === rhs && this.z === rhs;
    }

    return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
  }

  ne(rhs: BVec3 | boolean): boolean {
    if (typeof rhs === "boolean") {
      return this.x !== rhs || this.y !== rhs || this.z !== rhs;
    }

    return this.x !== rhs.x || this.y !== rhs.y || this.z !== rhs.z;
  }

  toString() {
    return `BVec3(${this.x}, ${this.y}, ${this.z})`;
  }
}

/** Creates a 3-dimensional `bool` vector mask. */
export function bvec3(x: boolean, y: boolean, z: boolean): BVec3 {
  return new BVec3(x, y, z);
}
