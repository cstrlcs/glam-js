import { Vec3 } from "@";
import { bench, do_not_optimize, group, summary } from "mitata";
import { N, vec3s } from "./data";

// A typical game-loop workload: integrate gravity into velocity and velocity
// into position for every particle, once per frame.
const DT = 1 / 60;
const GRAVITY_DT = new Vec3(0, -9.8 * DT, 0);

group("Scenario: 1000 particles, one frame", () => {
	summary(() => {
		const positions = vec3s();
		const velocities = vec3s();

		bench("immutable: p = p.add(v.mul(dt))", () => {
			for (let i = 0; i < N; i++) {
				const v = (velocities[i] as Vec3).add(GRAVITY_DT);
				velocities[i] = v;
				positions[i] = (positions[i] as Vec3).add(v.mul(DT));
			}
			do_not_optimize(positions);
		});

		const positions2 = vec3s();
		const velocities2 = vec3s();

		bench("in-place: p.addAssign(v.mul(dt))", () => {
			for (let i = 0; i < N; i++) {
				const v = (velocities2[i] as Vec3).addAssign(GRAVITY_DT);
				(positions2[i] as Vec3).addAssign(v.mul(DT));
			}
			do_not_optimize(positions2);
		});

		const positions3 = vec3s();
		const velocities3 = vec3s();

		bench("field writes: p.x += v.x * dt", () => {
			for (let i = 0; i < N; i++) {
				const v = velocities3[i] as Vec3;
				const p = positions3[i] as Vec3;
				v.x += GRAVITY_DT.x;
				v.y += GRAVITY_DT.y;
				v.z += GRAVITY_DT.z;
				p.x += v.x * DT;
				p.y += v.y * DT;
				p.z += v.z * DT;
			}
			do_not_optimize(positions3);
		});
	});
});
