import { describe, expect, test } from "bun:test";
import { Mat4, Vec4 } from "@";

describe("Mat4", () => {
	test("New", () => {
		const m = Mat4.new(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

		expect(m.xAxis).toEqual(new Vec4(1, 2, 3, 4));
		expect(m.yAxis).toEqual(new Vec4(5, 6, 7, 8));
		expect(m.zAxis).toEqual(new Vec4(9, 10, 11, 12));
		expect(m.wAxis).toEqual(new Vec4(13, 14, 15, 16));
	});

	test("Constants", () => {
		expect(Mat4.ZERO).toEqual(
			Mat4.new(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
		);
		expect(Mat4.IDENTITY).toEqual(
			Mat4.new(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1),
		);
		expect(Mat4.NAN).toEqual(
			Mat4.new(
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
				Number.NaN,
			),
		);
	});

	test("Constants Are Fresh Instances", () => {
		const m = Mat4.IDENTITY;
		m.xAxis.x = 5;

		expect(Mat4.IDENTITY.xAxis.x).toEqual(1);
		expect(Mat4.IDENTITY).not.toBe(Mat4.IDENTITY);
	});

	test("From Cols", () => {
		const x = new Vec4(1, 2, 3, 4);
		const y = new Vec4(5, 6, 7, 8);
		const z = new Vec4(9, 10, 11, 12);
		const w = new Vec4(13, 14, 15, 16);

		expect(Mat4.fromCols(x, y, z, w)).toEqual(
			Mat4.new(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
		);
	});

	test("Cols Array", () => {
		const cols: Parameters<typeof Mat4.fromColsArray>[0] = [
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
		];
		const m = Mat4.fromColsArray(cols);

		expect(m).toEqual(
			Mat4.new(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
		);
		expect(m.toColsArray()).toEqual(cols);
	});
});
