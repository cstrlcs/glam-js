export interface CameraHandedness {
  name: "lh" | "rh";
  isRh: boolean;
  label: string;
}

export interface CameraApi {
  name: "directx" | "opengl" | "vulkan";
  label: string;
  ndcZ: string;
  ndcY: string;
  isZo: boolean;
  yFlip: boolean;
}

export const cameraHandednesses: CameraHandedness[] = [
  { name: "rh", isRh: true, label: "right-handed" },
  { name: "lh", isRh: false, label: "left-handed" },
];

export const cameraApis: CameraApi[] = [
  { name: "opengl", label: "OpenGL", ndcZ: "[-1, 1]", ndcY: "Y-up", isZo: false, yFlip: false },
  { name: "vulkan", label: "Vulkan", ndcZ: "[0, 1]", ndcY: "Y-down", isZo: true, yFlip: true },
  {
    name: "directx",
    label: "DirectX and WebGPU",
    ndcZ: "[0, 1]",
    ndcY: "Y-up",
    isZo: true,
    yFlip: false,
  },
];
