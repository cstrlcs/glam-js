import { describe, expect, test } from "bun:test";
import { Mat3, Vec3 } from "@";

describe("Mat3", () => {
	test("New", () => {
		const m = Mat3.new(1, 2, 3, 4, 5, 6, 7, 8, 9);

		expect(m.xAxis).toEqual(new Vec3(1, 2, 3));
		expect(m.yAxis).toEqual(new Vec3(4, 5, 6));
		expect(m.zAxis).toEqual(new Vec3(7, 8, 9));
	});

	test("Constants", () => {
		expect(Mat3.ZERO).toEqual(Mat3.new(0, 0, 0, 0, 0, 0, 0, 0, 0));
		expect(Mat3.IDENTITY).toEqual(Mat3.new(1, 0, 0, 0, 1, 0, 0, 0, 1));
		expect(Mat3.NAN).toEqual(
			Mat3.new(
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
		const m = Mat3.IDENTITY;
		m.xAxis.x = 5;

		expect(Mat3.IDENTITY.xAxis.x).toEqual(1);
		expect(Mat3.IDENTITY).not.toBe(Mat3.IDENTITY);
	});

	test("From Cols", () => {
		const x = new Vec3(1, 2, 3);
		const y = new Vec3(4, 5, 6);
		const z = new Vec3(7, 8, 9);

		expect(Mat3.fromCols(x, y, z)).toEqual(Mat3.new(1, 2, 3, 4, 5, 6, 7, 8, 9));
	});

	test("Cols Array", () => {
		const cols: Parameters<typeof Mat3.fromColsArray>[0] = [
			1, 2, 3, 4, 5, 6, 7, 8, 9,
		];
		const m = Mat3.fromColsArray(cols);

		expect(m).toEqual(Mat3.new(1, 2, 3, 4, 5, 6, 7, 8, 9));
		expect(m.toColsArray()).toEqual(cols);
	});
});
