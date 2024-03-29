// Do not edit this file directly. Edit the template instead: `./codegen/templates/mat.txt`.

import { Vec3 } from "./";

export class Mat3 {
	constructor(
		public xAxis: Vec3,
		public yAxis: Vec3,
		public zAxis: Vec3,
	) {}

	/**
	 * Creates a new `Mat3` from multiple values.
	 */
	static new(
		m00: number,
		m01: number,
		m02: number,
		m10: number,
		m11: number,
		m12: number,
		m20: number,
		m21: number,
		m22: number,
	): Mat3 {
		return new Mat3(
			new Vec3(m00, m01, m02),
			new Vec3(m10, m11, m12),
			new Vec3(m20, m21, m22),
		);
	}

	/** All zeroes. (0, 0..) */
	static get ZERO() {
		return Mat3.fromCols(Vec3.ZERO, Vec3.ZERO, Vec3.ZERO);
	}

	/** All `Identity`, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
	static get IDENTITY() {
		return Mat3.fromCols(Vec3.X, Vec3.Y, Vec3.Z);
	}

	/** All `NaN`. (NaN, NaN..) */
	static get NAN() {
		return Mat3.fromCols(Vec3.NAN, Vec3.NAN, Vec3.NAN);
	}

	/**
	 * Creates a 3x3 matrix from four column vectors.
	 */
	static fromCols(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): Mat3 {
		return new Mat3(xAxis, yAxis, zAxis);
	}

	/**
	 * Creates a 3x3 matrix from four column vectors.
	 */
	static fromColsArray(m: number[]): Mat3 {
		return Mat3.new(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);
	}

	/**
	 * Creates an array storing data in column major order.
	 */
	toColsArray(): number[] {
		return [
			this.xAxis.x,
			this.xAxis.y,
			this.xAxis.z,
			this.yAxis.x,
			this.yAxis.y,
			this.yAxis.z,
			this.zAxis.x,
			this.zAxis.y,
			this.zAxis.z,
		];
	}
}
