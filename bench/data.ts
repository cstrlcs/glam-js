import { BVec3, Vec3 } from "@";

/** Amount of operations each benchmark iteration performs. */
export const N = 1000;

// Small deterministic PRNG (mulberry32) so every run uses the same inputs.
let seed = 0x9e3779b9;
export const random = (): number => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), seed | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const randomRange = (min: number, max: number): number =>
	min + random() * (max - min);

export const randomVec3 = (): Vec3 =>
	new Vec3(randomRange(-10, 10), randomRange(-10, 10), randomRange(-10, 10));

export const randomBVec3 = (): BVec3 =>
	new BVec3(random() < 0.5, random() < 0.5, random() < 0.5);

export const vec3s = (): Vec3[] => Array.from({ length: N }, randomVec3);

export const bvec3s = (): BVec3[] => Array.from({ length: N }, randomBVec3);

export const numbers = (): number[] =>
	Array.from({ length: N }, () => randomRange(-10, 10));

/**
 * Preallocated output buffer. Benchmarks store their results here so the
 * engine cannot sink (eliminate) the allocations, mimicking real code where
 * results are kept around (entities, buffers, etc).
 */
export const out: unknown[] = new Array(N).fill(null);
