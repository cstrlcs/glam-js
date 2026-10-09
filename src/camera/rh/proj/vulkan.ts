import { Mat4 } from "../../../Mat4.js";
import { Vec4 } from "../../../Vec4.js";

/**
 * Creates a perspective projection matrix for use with Vulkan.
 *
 * Expects a right-handed Y-up view space input.
 * Outputs NDC with Z in [0, 1] and Y-down.
 */
export function perspective(
  verticalFov: number,
  aspectRatio: number,
  near: number,
  far: number,
): Mat4 {
  const sinFov = Math.sin(0.5 * verticalFov);
  const cosFov = Math.cos(0.5 * verticalFov);
  const h = cosFov / sinFov;
  const zRangeInv = 1 / (far - near);

  return new Mat4(
    new Vec4(h / aspectRatio, 0, 0, 0),
    new Vec4(0, -h, 0, 0),
    new Vec4(0, 0, -far * zRangeInv, -1),
    new Vec4(0, 0, -near * far * zRangeInv, 0),
  );
}

/**
 * Creates an infinite perspective projection matrix for use with Vulkan.
 *
 * Like `perspective`, but with an infinite value for `far`. Points at distance
 * `near` map to depth `0`; as distance approaches infinity, depth approaches `1`.
 *
 * Expects a right-handed Y-up view space input.
 * Outputs NDC with Z in [0, 1] and Y-down.
 */
export function perspectiveInfinite(verticalFov: number, aspectRatio: number, near: number): Mat4 {
  const sinFov = Math.sin(0.5 * verticalFov);
  const cosFov = Math.cos(0.5 * verticalFov);
  const h = cosFov / sinFov;

  return new Mat4(
    new Vec4(h / aspectRatio, 0, 0, 0),
    new Vec4(0, -h, 0, 0),
    new Vec4(0, 0, -1, -1),
    new Vec4(0, 0, -near, 0),
  );
}

/**
 * Creates an infinite perspective projection matrix with reversed depth for use with
 * Vulkan.
 *
 * Maps `near` to depth `1` and infinity to depth `0`.
 *
 * Reversed Z improves depth precision when used with a floating-point depth buffer.
 *
 * Expects a right-handed Y-up view space input.
 * Outputs NDC with Z in [0, 1] and Y-down.
 */
export function perspectiveInfiniteReverse(
  verticalFov: number,
  aspectRatio: number,
  near: number,
): Mat4 {
  const sinFov = Math.sin(0.5 * verticalFov);
  const cosFov = Math.cos(0.5 * verticalFov);
  const h = cosFov / sinFov;

  return new Mat4(
    new Vec4(h / aspectRatio, 0, 0, 0),
    new Vec4(0, -h, 0, 0),
    new Vec4(0, 0, 0, -1),
    new Vec4(0, 0, near, 0),
  );
}

/**
 * Creates an orthographic projection matrix for use with Vulkan.
 *
 * Expects a right-handed Y-up view space input.
 * Outputs NDC with Z in [0, 1] and Y-down.
 */
export function orthographic(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number,
): Mat4 {
  const widthInv = 1 / (right - left);
  const heightInv = 1 / (top - bottom);
  const depthInv = 1 / (far - near);

  return new Mat4(
    new Vec4(widthInv + widthInv, 0, 0, 0),
    new Vec4(0, -(heightInv + heightInv), 0, 0),
    new Vec4(0, 0, -depthInv, 0),
    new Vec4(-(left + right) * widthInv, -(top + bottom) * heightInv, -near * depthInv, 1),
  );
}

/**
 * Creates a perspective projection from a frustum for use with Vulkan.
 *
 * Expects a right-handed Y-up view space input.
 * Outputs NDC with Z in [0, 1] and Y-down.
 */
export function frustum(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number,
): Mat4 {
  const invWidth = 1 / (right - left);
  const invHeight = 1 / (top - bottom);
  const invDepth = 1 / (far - near);
  const twoNear = 2 * near;

  return new Mat4(
    new Vec4(twoNear * invWidth, 0, 0, 0),
    new Vec4(0, -twoNear * invHeight, 0, 0),
    new Vec4((right + left) * invWidth, -(top + bottom) * invHeight, -far * invDepth, -1),
    new Vec4(0, 0, -(far * near) * invDepth, 0),
  );
}
