/**
 * Projection matrix constructors.
 *
 * Expects right-handed Y-up view space input.
 *
 * Each sub-module targets a specific graphics API convention:
 *
 * * `opengl` - NDC Z range **[-1, 1]**, Y-up
 * * `directx` - NDC Z range **[0, 1]**, Y-up
 * * `vulkan` - NDC Z range **[0, 1]**, Y-down
 */
export * as proj from "./proj/index.js";
/**
 * View (camera) constructors for right-handed world coordinate systems.
 *
 * Every function transforms world space points into a right-handed Y-up
 * view space with X-right and -Z-forward.
 *
 * * `lookAt*` targets a focal point (`center`)
 * * `lookTo*` targets a forward direction (`dir`)
 *
 * Functions returning `Mat4`, `Affine3`, or
 * similar return a full view transform (rotation and translation).
 * Functions returning `Mat3`, or `Quat` return
 * only the view rotation.
 */
export * as view from "./view.js";
