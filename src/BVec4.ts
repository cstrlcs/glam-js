/** A 4-dimensional `bool` vector mask. */
export class BVec4 {
  declare x: boolean;
  declare y: boolean;
  declare z: boolean;
  declare w: boolean;

  constructor(x: boolean, y: boolean, z: boolean, w: boolean) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /** All false. */
  static get FALSE() {
    return new BVec4(false, false, false, false);
  }

  /** All true. */
  static get TRUE() {
    return new BVec4(true, true, true, true);
  }

  /** Creates a new vector mask. */
  static new(x: boolean, y: boolean, z: boolean, w: boolean): BVec4 {
    return new BVec4(x, y, z, w);
  }

  /** Creates a vector mask with all elements set to `v`. */
  static splat(v: boolean): BVec4 {
    return new BVec4(v, v, v, v);
  }

  /** Creates a new vector mask from a bool array. */
  static fromArray(a: [boolean, boolean, boolean, boolean]): BVec4 {
    return new BVec4(a[0], a[1], a[2], a[3]);
  }

  /**
   * Returns a bitmask with the lowest 4 bits set from the elements of `this`.
   *
   * A true element results in a `1` bit and a false element in a `0` bit.  Element `x` goes
   * into the first lowest bit, element `y` into the second, etc.
   */
  bitmask(): number {
    return (this.x ? 1 : 0) + (this.y ? 2 : 0) + (this.z ? 4 : 0) + (this.w ? 8 : 0);
  }

  /** Returns true if any of the elements are true, false otherwise. */
  any(): boolean {
    return this.x || this.y || this.z || this.w;
  }

  /** Returns true if all the elements are true, false otherwise. */
  all(): boolean {
    return this.x && this.y && this.z && this.w;
  }

  /**
   * Tests the value at `index`.
   *
   * Throws a `RangeError` if `index` is greater than 3.
   */
  test(index: 0 | 1 | 2 | 3): boolean {
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
      case 3: {
        return this.w;
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /**
   * Sets the element at `index`.
   *
   * Throws a `RangeError` if `index` is greater than 3.
   */
  set(index: 0 | 1 | 2 | 3, value: boolean): void {
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
      case 3: {
        this.w = value;

        break;
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  bitand(rhs: BVec4): BVec4 {
    return new BVec4(this.x && rhs.x, this.y && rhs.y, this.z && rhs.z, this.w && rhs.w);
  }

  bitor(rhs: BVec4): BVec4 {
    return new BVec4(this.x || rhs.x, this.y || rhs.y, this.z || rhs.z, this.w || rhs.w);
  }

  bitxor(rhs: BVec4): BVec4 {
    return new BVec4(this.x !== rhs.x, this.y !== rhs.y, this.z !== rhs.z, this.w !== rhs.w);
  }

  bitandAssign(rhs: BVec4): this {
    this.x &&= rhs.x;
    this.y &&= rhs.y;
    this.z &&= rhs.z;
    this.w &&= rhs.w;

    return this;
  }

  bitorAssign(rhs: BVec4): this {
    this.x ||= rhs.x;
    this.y ||= rhs.y;
    this.z ||= rhs.z;
    this.w ||= rhs.w;

    return this;
  }

  bitxorAssign(rhs: BVec4): this {
    this.x = this.x !== rhs.x;
    this.y = this.y !== rhs.y;
    this.z = this.z !== rhs.z;
    this.w = this.w !== rhs.w;

    return this;
  }

  not(): BVec4 {
    return new BVec4(!this.x, !this.y, !this.z, !this.w);
  }

  eq(rhs: BVec4 | boolean): boolean {
    if (typeof rhs === "boolean") {
      return this.x === rhs && this.y === rhs && this.z === rhs && this.w === rhs;
    }

    return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z && this.w === rhs.w;
  }

  ne(rhs: BVec4 | boolean): boolean {
    if (typeof rhs === "boolean") {
      return this.x !== rhs || this.y !== rhs || this.z !== rhs || this.w !== rhs;
    }

    return this.x !== rhs.x || this.y !== rhs.y || this.z !== rhs.z || this.w !== rhs.w;
  }

  toString() {
    return `BVec4(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }
}

/** Creates a 4-dimensional `bool` vector mask. */
export function bvec4(x: boolean, y: boolean, z: boolean, w: boolean): BVec4 {
  return new BVec4(x, y, z, w);
}
