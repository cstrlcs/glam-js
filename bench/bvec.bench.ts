import type { BVec3 } from "@";
import { bench, do_not_optimize, group } from "mitata";
import { N, bvec3s, out } from "./data";

const a = bvec3s();
const b = bvec3s();

group("BVec3", () => {
	bench("a.test(i)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as BVec3).test((i % 3) as 0 | 1 | 2);
		}
		do_not_optimize(out);
	});

	bench("a.set(i, v)", () => {
		for (let i = 0; i < N; i++) {
			(a[i] as BVec3).set((i % 3) as 0 | 1 | 2, (i & 1) === 0);
		}
		do_not_optimize(a);
	});

	bench("a.bitand(b)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as BVec3).bitand(b[i] as BVec3);
		}
		do_not_optimize(out);
	});

	bench("a.bitmask()", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as BVec3).bitmask();
		}
		do_not_optimize(out);
	});
});
