import { describe, expect, test } from "bun:test";
import { Mat2, Vec2 } from "@";

describe("Mat2", () => {
	test("New", () => {
		const m = Mat2.new(1, 2, 3, 4);

		expect(m.xAxis).toEqual(new Vec2(1, 2));
		expect(m.yAxis).toEqual(new Vec2(3, 4));
	});

	test("Constants", () => {
		expect(Mat2.ZERO).toEqual(Mat2.new(0, 0, 0, 0));
		expect(Mat2.IDENTITY).toEqual(Mat2.new(1, 0, 0, 1));
		expect(Mat2.NAN).toEqual(
			Mat2.new(Number.NaN, Number.NaN, Number.NaN, Number.NaN),
		);
	});

	test("Constants Are Fresh Instances", () => {
		const m = Mat2.IDENTITY;
		m.xAxis.x = 5;

		expect(Mat2.IDENTITY.xAxis.x).toEqual(1);
		expect(Mat2.IDENTITY).not.toBe(Mat2.IDENTITY);
	});

	test("From Cols", () => {
		const x = new Vec2(1, 2);
		const y = new Vec2(3, 4);

		expect(Mat2.fromCols(x, y)).toEqual(Mat2.new(1, 2, 3, 4));
	});

	test("Cols Array", () => {
		const cols: Parameters<typeof Mat2.fromColsArray>[0] = [1, 2, 3, 4];
		const m = Mat2.fromColsArray(cols);

		expect(m).toEqual(Mat2.new(1, 2, 3, 4));
		expect(m.toColsArray()).toEqual(cols);
	});
});
