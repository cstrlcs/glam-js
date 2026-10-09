/**
 * OpenGL NDC convention: Z range **[-1, 1]**, Y-up.
 *
 * Expects a left-handed Y-up view space input.
 */
export * as opengl from "./opengl.js";
/**
 * Vulkan NDC convention: Z range **[0, 1]**, Y-down.
 *
 * Expects a left-handed Y-up view space input.
 *
 * Includes standard, infinite-far, and reverse-depth variants.
 */
export * as vulkan from "./vulkan.js";
/**
 * DirectX and WebGPU NDC convention: Z range **[0, 1]**, Y-up.
 *
 * Expects a left-handed Y-up view space input.
 *
 * Includes standard, infinite-far, and reverse-depth variants.
 */
export * as directx from "./directx.js";
