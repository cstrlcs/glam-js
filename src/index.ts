export * from "./BVec2.js";
export * from "./BVec3.js";
export * from "./BVec4.js";
export * from "./Vec2.js";
export * from "./Vec3.js";
export * from "./Vec4.js";
export * from "./Mat2.js";
export * from "./Mat3.js";
export * from "./Mat4.js";
export * from "./Quat.js";
export * from "./EulerRot.js";
export * from "./Affine2.js";
export * from "./Affine3.js";
/**
 * View and projection transform helpers.
 *
 * This module provides view matrix (`lookAt`, `lookTo`) and projection matrix (`perspective`,
 * `orthographic`, `frustum`) constructors.
 *
 * ## Choosing a sub-module
 *
 * Pick `lh` or `rh` modules based on your world space coordinate system.
 *
 * The view functions in each sub-module transform world space points into Y-up view space while
 * preserving your world's handedness.
 *
 * Note that while the view space methods will preserve the handedness of your world's coordinate
 * systems, view space is a different coordinate system and will not necessarily be the same as
 * your world coordinate system, especially if your world up is not +Y.
 *
 * There are other possible view space coordinate systems, notably Y-down; however, glam only
 * provides view and projection functions for left- and right-handed view space coordinate systems.
 *
 * The corresponding projection functions expect Y-up view space input with the matching
 * handedness.
 *
 * Within each `proj` sub-module, pick the API-specific constructor:
 *
 * | Module     | NDC Z   | NDC Y |
 * |------------|---------|-------|
 * | `opengl`   | [-1, 1] | Up    |
 * | `directx`  | [0, 1]  | Up    |
 * | `vulkan`   | [0, 1]  | Down  |
 */
export * as camera from "./camera/index.js";
