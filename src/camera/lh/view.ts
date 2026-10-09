import { Affine3 } from "../../Affine3.js";
import { Mat3 } from "../../Mat3.js";
import { Mat4 } from "../../Mat4.js";
import { Quat } from "../../Quat.js";
import { Vec3 } from "../../Vec3.js";
import { Vec4 } from "../../Vec4.js";

/**
 * Returns a `Mat4` view matrix from eye, focal point, and up.
 *
 * Transforms left-handed world space points into left-handed Y-up view space.
 */
export function lookAtMat4(eye: Vec3, center: Vec3, up: Vec3): Mat4 {
  const dx = center.x - eye.x;
  const dy = center.y - eye.y;
  const dz = center.z - eye.z;
  const dLengthSquared = dx * dx + dy * dy + dz * dz;
  const dRcp = 1 / Math.sqrt(dLengthSquared);
  const fx = -dx * dRcp;
  const fy = -dy * dRcp;
  const fz = -dz * dRcp;
  const cx = fy * up.z - up.y * fz;
  const cy = fz * up.x - up.z * fx;
  const cz = fx * up.y - up.x * fy;
  const sLengthSquared = cx * cx + cy * cy + cz * cz;
  const sRcp = 1 / Math.sqrt(sLengthSquared);
  const sx = cx * sRcp;
  const sy = cy * sRcp;
  const sz = cz * sRcp;
  const ux = sy * fz - fy * sz;
  const uy = sz * fx - fz * sx;
  const uz = sx * fy - fx * sy;

  return new Mat4(
    new Vec4(sx, ux, -fx, 0),
    new Vec4(sy, uy, -fy, 0),
    new Vec4(sz, uz, -fz, 0),
    new Vec4(
      -(eye.x * sx + eye.y * sy + eye.z * sz),
      -(eye.x * ux + eye.y * uy + eye.z * uz),
      eye.x * fx + eye.y * fy + eye.z * fz,
      1,
    ),
  );
}

/**
 * Returns a `Mat4` view matrix from eye, forward direction, and up.
 *
 * Transforms left-handed world space points into left-handed Y-up view space.
 */
export function lookToMat4(eye: Vec3, dir: Vec3, up: Vec3): Mat4 {
  const fx = -dir.x;
  const fy = -dir.y;
  const fz = -dir.z;
  const cx = fy * up.z - up.y * fz;
  const cy = fz * up.x - up.z * fx;
  const cz = fx * up.y - up.x * fy;
  const sLengthSquared = cx * cx + cy * cy + cz * cz;
  const sRcp = 1 / Math.sqrt(sLengthSquared);
  const sx = cx * sRcp;
  const sy = cy * sRcp;
  const sz = cz * sRcp;
  const ux = sy * fz - fy * sz;
  const uy = sz * fx - fz * sx;
  const uz = sx * fy - fx * sy;

  return new Mat4(
    new Vec4(sx, ux, -fx, 0),
    new Vec4(sy, uy, -fy, 0),
    new Vec4(sz, uz, -fz, 0),
    new Vec4(
      -(eye.x * sx + eye.y * sy + eye.z * sz),
      -(eye.x * ux + eye.y * uy + eye.z * uz),
      eye.x * fx + eye.y * fy + eye.z * fz,
      1,
    ),
  );
}

/**
 * Returns an `Affine3` view transform from eye, focal point, and up.
 *
 * Transforms left-handed world space points into left-handed Y-up view space.
 */
export function lookAtAffine3(eye: Vec3, center: Vec3, up: Vec3): Affine3 {
  const dx = center.x - eye.x;
  const dy = center.y - eye.y;
  const dz = center.z - eye.z;
  const dLengthSquared = dx * dx + dy * dy + dz * dz;
  const dRcp = 1 / Math.sqrt(dLengthSquared);
  const fx = -dx * dRcp;
  const fy = -dy * dRcp;
  const fz = -dz * dRcp;
  const cx = fy * up.z - up.y * fz;
  const cy = fz * up.x - up.z * fx;
  const cz = fx * up.y - up.x * fy;
  const sLengthSquared = cx * cx + cy * cy + cz * cz;
  const sRcp = 1 / Math.sqrt(sLengthSquared);
  const sx = cx * sRcp;
  const sy = cy * sRcp;
  const sz = cz * sRcp;
  const ux = sy * fz - fy * sz;
  const uy = sz * fx - fz * sx;
  const uz = sx * fy - fx * sy;

  return new Affine3(
    new Mat3(new Vec3(sx, ux, -fx), new Vec3(sy, uy, -fy), new Vec3(sz, uz, -fz)),
    new Vec3(
      -(eye.x * sx + eye.y * sy + eye.z * sz),
      -(eye.x * ux + eye.y * uy + eye.z * uz),
      eye.x * fx + eye.y * fy + eye.z * fz,
    ),
  );
}

/**
 * Returns an `Affine3` view transform from eye, forward direction, and up.
 *
 * Transforms left-handed world space points into left-handed Y-up view space.
 */
export function lookToAffine3(eye: Vec3, dir: Vec3, up: Vec3): Affine3 {
  const fx = -dir.x;
  const fy = -dir.y;
  const fz = -dir.z;
  const cx = fy * up.z - up.y * fz;
  const cy = fz * up.x - up.z * fx;
  const cz = fx * up.y - up.x * fy;
  const sLengthSquared = cx * cx + cy * cy + cz * cz;
  const sRcp = 1 / Math.sqrt(sLengthSquared);
  const sx = cx * sRcp;
  const sy = cy * sRcp;
  const sz = cz * sRcp;
  const ux = sy * fz - fy * sz;
  const uy = sz * fx - fz * sx;
  const uz = sx * fy - fx * sy;

  return new Affine3(
    new Mat3(new Vec3(sx, ux, -fx), new Vec3(sy, uy, -fy), new Vec3(sz, uz, -fz)),
    new Vec3(
      -(eye.x * sx + eye.y * sy + eye.z * sz),
      -(eye.x * ux + eye.y * uy + eye.z * uz),
      eye.x * fx + eye.y * fy + eye.z * fz,
    ),
  );
}

/**
 * Returns a `Mat3` view rotation (no translation) from eye, focal point, and up.
 *
 * Transforms left-handed world space points into left-handed Y-up view space.
 */
export function lookAtMat3(eye: Vec3, center: Vec3, up: Vec3): Mat3 {
  const dx = center.x - eye.x;
  const dy = center.y - eye.y;
  const dz = center.z - eye.z;
  const dLengthSquared = dx * dx + dy * dy + dz * dz;
  const dRcp = 1 / Math.sqrt(dLengthSquared);
  const fx = -dx * dRcp;
  const fy = -dy * dRcp;
  const fz = -dz * dRcp;
  const cx = fy * up.z - up.y * fz;
  const cy = fz * up.x - up.z * fx;
  const cz = fx * up.y - up.x * fy;
  const sLengthSquared = cx * cx + cy * cy + cz * cz;
  const sRcp = 1 / Math.sqrt(sLengthSquared);
  const sx = cx * sRcp;
  const sy = cy * sRcp;
  const sz = cz * sRcp;
  const ux = sy * fz - fy * sz;
  const uy = sz * fx - fz * sx;
  const uz = sx * fy - fx * sy;

  return new Mat3(new Vec3(sx, ux, -fx), new Vec3(sy, uy, -fy), new Vec3(sz, uz, -fz));
}

/**
 * Returns a `Mat3` view rotation (no translation) from direction and up.
 *
 * Transforms left-handed world space points into left-handed Y-up view space.
 */
export function lookToMat3(dir: Vec3, up: Vec3): Mat3 {
  const fx = -dir.x;
  const fy = -dir.y;
  const fz = -dir.z;
  const cx = fy * up.z - up.y * fz;
  const cy = fz * up.x - up.z * fx;
  const cz = fx * up.y - up.x * fy;
  const sLengthSquared = cx * cx + cy * cy + cz * cz;
  const sRcp = 1 / Math.sqrt(sLengthSquared);
  const sx = cx * sRcp;
  const sy = cy * sRcp;
  const sz = cz * sRcp;
  const ux = sy * fz - fy * sz;
  const uy = sz * fx - fz * sx;
  const uz = sx * fy - fx * sy;

  return new Mat3(new Vec3(sx, ux, -fx), new Vec3(sy, uy, -fy), new Vec3(sz, uz, -fz));
}

/**
 * Returns a `Quat` view rotation from eye, focal point, and up.
 *
 * Transforms left-handed world space points into left-handed Y-up view space.
 */
export function lookAtQuat(eye: Vec3, center: Vec3, up: Vec3): Quat {
  const dx = center.x - eye.x;
  const dy = center.y - eye.y;
  const dz = center.z - eye.z;
  const dLengthSquared = dx * dx + dy * dy + dz * dz;
  const dRcp = 1 / Math.sqrt(dLengthSquared);
  const fx = -dx * dRcp;
  const fy = -dy * dRcp;
  const fz = -dz * dRcp;
  const cx = fy * up.z - up.y * fz;
  const cy = fz * up.x - up.z * fx;
  const cz = fx * up.y - up.x * fy;
  const sLengthSquared = cx * cx + cy * cy + cz * cz;
  const sRcp = 1 / Math.sqrt(sLengthSquared);
  const sx = cx * sRcp;
  const sy = cy * sRcp;
  const sz = cz * sRcp;
  const ux = sy * fz - fy * sz;
  const uy = sz * fx - fz * sx;
  const uz = sx * fy - fx * sy;

  return Quat.fromRotationAxes(new Vec3(sx, ux, -fx), new Vec3(sy, uy, -fy), new Vec3(sz, uz, -fz));
}

/**
 * Returns a `Quat` view rotation from direction and up.
 *
 * Transforms left-handed world space points into left-handed Y-up view space.
 */
export function lookToQuat(dir: Vec3, up: Vec3): Quat {
  const fx = -dir.x;
  const fy = -dir.y;
  const fz = -dir.z;
  const cx = fy * up.z - up.y * fz;
  const cy = fz * up.x - up.z * fx;
  const cz = fx * up.y - up.x * fy;
  const sLengthSquared = cx * cx + cy * cy + cz * cz;
  const sRcp = 1 / Math.sqrt(sLengthSquared);
  const sx = cx * sRcp;
  const sy = cy * sRcp;
  const sz = cz * sRcp;
  const ux = sy * fz - fy * sz;
  const uy = sz * fx - fz * sx;
  const uz = sx * fy - fx * sy;

  return Quat.fromRotationAxes(new Vec3(sx, ux, -fx), new Vec3(sy, uy, -fy), new Vec3(sz, uz, -fz));
}
