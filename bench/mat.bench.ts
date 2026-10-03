import { Mat4 } from "@";
import { bench, do_not_optimize, group } from "mitata";
import { N, numbers, out } from "./data";

type ColsArray = Parameters<typeof Mat4.fromColsArray>[0];

const values = Array.from(
	{ length: N },
	() => numbers().slice(0, 16) as ColsArray,
);

group("Mat4 construction", () => {
	bench("Mat4.IDENTITY", () => {
		for (let i = 0; i < N; i++) {
			out[i] = Mat4.IDENTITY;
		}
		do_not_optimize(out);
	});

	bench("Mat4.fromColsArray(m)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = Mat4.fromColsArray(values[i] as ColsArray);
		}
		do_not_optimize(out);
	});
});
