import { Mat4 } from "../../../Mat4.js";
import { Vec4 } from "../../../Vec4.js";

/**
 * Creates a perspective projection matrix for use with OpenGL.
 *
 * Expects a right-handed Y-up view space input.
 * Outputs NDC with Z in [-1, 1] and Y-up.
 *
 * This is the OpenGL `gluPerspective` equivalent.
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
    new Vec4(0, h, 0, 0),
    new Vec4(0, 0, -(far + near) * zRangeInv, -1),
    new Vec4(0, 0, -2 * far * near * zRangeInv, 0),
  );
}

/**
 * Creates an orthographic projection matrix for use with OpenGL.
 *
 * Expects a right-handed Y-up view space input.
 * Outputs NDC with Z in [-1, 1] and Y-up.
 *
 * This is the OpenGL `glOrtho` equivalent.
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
    new Vec4(0, heightInv + heightInv, 0, 0),
    new Vec4(0, 0, -2 * depthInv, 0),
    new Vec4(-(left + right) * widthInv, -(top + bottom) * heightInv, -(far + near) * depthInv, 1),
  );
}

/**
 * Creates a perspective projection matrix from a frustum for use with OpenGL.
 *
 * Expects a right-handed Y-up view space input.
 * Outputs NDC with Z in [-1, 1] and Y-up.
 *
 * This is the OpenGL `glFrustum` equivalent.
 * See <https://registry.khronos.org/OpenGL-Refpages/gl2.1/xhtml/glFrustum.xml>
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
    new Vec4(0, twoNear * invHeight, 0, 0),
    new Vec4((right + left) * invWidth, (top + bottom) * invHeight, -(far + near) * invDepth, -1),
    new Vec4(0, 0, -(2 * far * near) * invDepth, 0),
  );
}
