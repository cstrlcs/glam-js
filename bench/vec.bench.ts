import { type BVec3, Vec3 } from "@";
import { bench, do_not_optimize, group } from "mitata";
import { N, bvec3s, numbers, out, vec3s } from "./data";

const a = vec3s();
const b = vec3s();
const c = vec3s();
const s = numbers();
const masks = bvec3s();
const arrays = a.map((v) => v.toArray());
const min = Vec3.splat(-5);
const max = Vec3.splat(5);

group("Vec3 construction", () => {
	bench("new Vec3(x, y, z)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = new Vec3(s[i] as number, s[i] as number, s[i] as number);
		}
		do_not_optimize(out);
	});

	bench("Vec3.splat(v)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = Vec3.splat(s[i] as number);
		}
		do_not_optimize(out);
	});

	bench("Vec3.fromArray(a)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = Vec3.fromArray(arrays[i] as [number, number, number]);
		}
		do_not_optimize(out);
	});

	bench("Vec3.ZERO", () => {
		for (let i = 0; i < N; i++) {
			out[i] = Vec3.ZERO;
		}
		do_not_optimize(out);
	});

	bench("Vec3.AXES", () => {
		for (let i = 0; i < N; i++) {
			out[i] = Vec3.AXES;
		}
		do_not_optimize(out);
	});
});

group("Vec3 arithmetic", () => {
	bench("a.add(b)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).add(b[i] as Vec3);
		}
		do_not_optimize(out);
	});

	bench("a.mul(scalar)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).mul(s[i] as number);
		}
		do_not_optimize(out);
	});

	bench("a.add(b | scalar) (mixed call site)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).add(i & 1 ? (b[i] as Vec3) : (s[i] as number));
		}
		do_not_optimize(out);
	});

	bench("a.cross(b)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).cross(b[i] as Vec3);
		}
		do_not_optimize(out);
	});

	bench("a.normalize()", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).normalize();
		}
		do_not_optimize(out);
	});

	bench("a.eq(b)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).eq(b[i] as Vec3);
		}
		do_not_optimize(out);
	});
});

group("Vec3 composite", () => {
	bench("a.lerp(b, t)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).lerp(b[i] as Vec3, 0.25);
		}
		do_not_optimize(out);
	});

	bench("a.midpoint(b)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).midpoint(b[i] as Vec3);
		}
		do_not_optimize(out);
	});

	bench("a.mulAdd(b, c)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).mulAdd(b[i] as Vec3, c[i] as Vec3);
		}
		do_not_optimize(out);
	});

	bench("a.clamp(min, max)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).clamp(min, max);
		}
		do_not_optimize(out);
	});

	bench("a.clampLength(1, 5)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).clampLength(1, 5);
		}
		do_not_optimize(out);
	});

	bench("a.rejectFrom(b)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).rejectFrom(b[i] as Vec3);
		}
		do_not_optimize(out);
	});

	bench("a.fract()", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).fract();
		}
		do_not_optimize(out);
	});

	bench("a.distance(b)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).distance(b[i] as Vec3);
		}
		do_not_optimize(out);
	});

	bench("a.absDiffEq(b, eps)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = (a[i] as Vec3).absDiffEq(b[i] as Vec3, 0.5);
		}
		do_not_optimize(out);
	});

	bench("Vec3.select(mask, a, b)", () => {
		for (let i = 0; i < N; i++) {
			out[i] = Vec3.select(masks[i] as BVec3, a[i] as Vec3, b[i] as Vec3);
		}
		do_not_optimize(out);
	});
});
