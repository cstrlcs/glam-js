/** A 2-dimensional `bool` vector mask. */
export class BVec2 {
  declare x: boolean;
  declare y: boolean;

  constructor(x: boolean, y: boolean) {
    this.x = x;
    this.y = y;
  }

  /** All false. */
  static get FALSE() {
    return new BVec2(false, false);
  }

  /** All true. */
  static get TRUE() {
    return new BVec2(true, true);
  }

  /** Creates a new vector mask. */
  static new(x: boolean, y: boolean): BVec2 {
    return new BVec2(x, y);
  }

  /** Creates a vector mask with all elements set to `v`. */
  static splat(v: boolean): BVec2 {
    return new BVec2(v, v);
  }

  /** Creates a new vector mask from a bool array. */
  static fromArray(a: [boolean, boolean]): BVec2 {
    return new BVec2(a[0], a[1]);
  }

  /**
   * Returns a bitmask with the lowest 2 bits set from the elements of `this`.
   *
   * A true element results in a `1` bit and a false element in a `0` bit.  Element `x` goes
   * into the first lowest bit, element `y` into the second, etc.
   */
  bitmask(): number {
    return (this.x ? 1 : 0) + (this.y ? 2 : 0);
  }

  /** Returns true if any of the elements are true, false otherwise. */
  any(): boolean {
    return this.x || this.y;
  }

  /** Returns true if all the elements are true, false otherwise. */
  all(): boolean {
    return this.x && this.y;
  }

  /**
   * Tests the value at `index`.
   *
   * Throws a `RangeError` if `index` is greater than 1.
   */
  test(index: 0 | 1): boolean {
    switch (index) {
      case 0: {
        return this.x;
      }
      case 1: {
        return this.y;
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  /**
   * Sets the element at `index`.
   *
   * Throws a `RangeError` if `index` is greater than 1.
   */
  set(index: 0 | 1, value: boolean): void {
    switch (index) {
      case 0: {
        this.x = value;

        break;
      }
      case 1: {
        this.y = value;

        break;
      }
      default: {
        throw new RangeError("index out of bounds");
      }
    }
  }

  bitand(rhs: BVec2): BVec2 {
    return new BVec2(this.x && rhs.x, this.y && rhs.y);
  }

  bitor(rhs: BVec2): BVec2 {
    return new BVec2(this.x || rhs.x, this.y || rhs.y);
  }

  bitxor(rhs: BVec2): BVec2 {
    return new BVec2(this.x !== rhs.x, this.y !== rhs.y);
  }

  bitandAssign(rhs: BVec2): this {
    this.x &&= rhs.x;
    this.y &&= rhs.y;

    return this;
  }

  bitorAssign(rhs: BVec2): this {
    this.x ||= rhs.x;
    this.y ||= rhs.y;

    return this;
  }

  bitxorAssign(rhs: BVec2): this {
    this.x = this.x !== rhs.x;
    this.y = this.y !== rhs.y;

    return this;
  }

  not(): BVec2 {
    return new BVec2(!this.x, !this.y);
  }

  eq(rhs: BVec2 | boolean): boolean {
    if (typeof rhs === "boolean") {
      return this.x === rhs && this.y === rhs;
    }

    return this.x === rhs.x && this.y === rhs.y;
  }

  ne(rhs: BVec2 | boolean): boolean {
    if (typeof rhs === "boolean") {
      return this.x !== rhs || this.y !== rhs;
    }

    return this.x !== rhs.x || this.y !== rhs.y;
  }

  toString() {
    return `BVec2(${this.x}, ${this.y})`;
  }
}

/** Creates a 2-dimensional `bool` vector mask. */
export function bvec2(x: boolean, y: boolean): BVec2 {
  return new BVec2(x, y);
}
