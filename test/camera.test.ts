import { Mat3, Mat4, Vec3, Vec4, camera } from "@";

interface AxisConfig {
  forward: Vec3;
  right: Vec3;
  up: Vec3;
}

interface NdcConfig {
  zNear: number;
  zFar: number;
  yDown: boolean;
}

interface CameraCase {
  proj: typeof camera.rh.proj;
  view: typeof camera.rh.view;
  world: AxisConfig;
}

const EYE = Vec3.ZERO;
const EPS = 1e-6;
const F32_EPSILON = 1.1920929e-7;
const FOV = (90 * Math.PI) / 180;
const HEIGHT = Math.tan(0.5 * FOV);
const NDC_OPENGL: NdcConfig = { zNear: -1, zFar: 1, yDown: false };
const NDC_VULKAN: NdcConfig = { zNear: 0, zFar: 1, yDown: true };
const NDC_DIRECTX: NdcConfig = { zNear: 0, zFar: 1, yDown: false };
const RH_YUP_AXES: AxisConfig = { forward: Vec3.NEG_Z, right: Vec3.X, up: Vec3.Y };
const LH_YUP_AXES: AxisConfig = { forward: Vec3.Z, right: Vec3.X, up: Vec3.Y };
const RH_ZUP_AXES: AxisConfig = { forward: Vec3.Y, right: Vec3.X, up: Vec3.Z };
const LH_ZUP_AXES: AxisConfig = { forward: Vec3.X, right: Vec3.Y, up: Vec3.Z };
const GLTF_AXES: AxisConfig = { forward: Vec3.Z, right: Vec3.NEG_X, up: Vec3.Y };
const RH = { proj: camera.rh.proj, view: camera.rh.view };
const LH = { proj: camera.lh.proj, view: camera.lh.view };

const VIEW_CASES: [string, CameraCase][] = [
  ["rh yup", { ...RH, world: RH_YUP_AXES }],
  ["rh zup", { ...RH, world: RH_ZUP_AXES }],
  ["lh yup", { ...LH, world: LH_YUP_AXES }],
  ["lh zup", { ...LH, world: LH_ZUP_AXES }],
];

const PIPELINE_CASES: [string, CameraCase][] = [
  ...VIEW_CASES,
  ["rh gltf", { ...RH, world: GLTF_AXES }],
];

function handednessSign(axes: AxisConfig) {
  return Math.sign(axes.right.dot(axes.up.cross(axes.forward)));
}

function transform(matrix: Mat4, point: Vec3) {
  return matrix.mul(point.toHomogeneous()).project();
}

function isViewRotation(world: AxisConfig, rotate: (point: Vec3) => Vec3) {
  const expectedZ = handednessSign(world) * 5;

  return (
    rotate(world.right.mul(5)).absDiffEq(new Vec3(5, 0, 0), EPS) &&
    rotate(world.up.mul(5)).absDiffEq(new Vec3(0, 5, 0), EPS) &&
    rotate(world.forward.mul(5)).absDiffEq(new Vec3(0, 0, expectedZ), EPS) &&
    rotate(world.forward.mul(-5)).absDiffEq(new Vec3(0, 0, -expectedZ), EPS)
  );
}

function isView(world: AxisConfig, view: Mat4) {
  return (
    isViewRotation(world, (point) => transform(view, point)) &&
    transform(view, EYE).absDiffEq(Vec3.ZERO, EPS)
  );
}

function projectsDirections(world: AxisConfig, ndc: NdcConfig, viewProj: Mat4) {
  const ahead = world.forward.mul(5);
  const center = transform(viewProj, ahead);
  const up = transform(viewProj, ahead.add(world.up)).y;
  const down = transform(viewProj, ahead.sub(world.up)).y;

  return (
    Math.abs(center.x) <= EPS &&
    Math.abs(center.y) <= EPS &&
    transform(viewProj, ahead.add(world.right)).x > 0 &&
    transform(viewProj, ahead.sub(world.right)).x < 0 &&
    (ndc.yDown ? up < 0 && down > 0 : up > 0 && down < 0)
  );
}

function projectsDepth(viewProj: Mat4, point: Vec3, z: number) {
  return transform(viewProj, point).absDiffEq(new Vec3(0, 0, z), EPS);
}

function isPipeline(world: AxisConfig, view: Mat4, projections: [NdcConfig, Mat4, number][]) {
  return (
    isView(world, view) &&
    projections.every(([ndc, proj, nearZ]) => {
      const viewProj = proj.mul(view);

      return (
        projectsDirections(world, ndc, viewProj) && projectsDepth(viewProj, world.forward, nearZ)
      );
    })
  );
}

function reachesFarPlane(world: AxisConfig, view: Mat4, projections: [NdcConfig, Mat4, number][]) {
  return projections.every(([ndc, proj]) =>
    projectsDepth(proj.mul(view), world.forward.mul(10), ndc.zFar),
  );
}

describe("camera module", () => {
  test.each(VIEW_CASES)("%s look at and look to mat4", (_, { view, world }) => {
    expect(isView(world, view.lookAtMat4(EYE, world.forward.mul(5), world.up))).toBeTrue();
    expect(isView(world, view.lookToMat4(EYE, world.forward, world.up))).toBeTrue();
  });

  test.each(VIEW_CASES)("%s look at and look to affine3", (_, { view, world }) => {
    const lookAt = view.lookAtAffine3(EYE, world.forward.mul(5), world.up);
    const lookTo = view.lookToAffine3(EYE, world.forward, world.up);

    expect(isView(world, Mat4.fromAffine3(lookAt))).toBeTrue();
    expect(isView(world, Mat4.fromAffine3(lookTo))).toBeTrue();
  });

  test.each(VIEW_CASES)("%s look at and look to mat3", (_, { view, world }) => {
    const lookAt = view.lookAtMat3(EYE, world.forward.mul(5), world.up);
    const lookTo = view.lookToMat3(world.forward, world.up);

    expect(isViewRotation(world, (point) => lookAt.mul(point))).toBeTrue();
    expect(isViewRotation(world, (point) => lookTo.mul(point))).toBeTrue();
  });

  test.each(VIEW_CASES)("%s look at and look to quat", (_, { view, world }) => {
    const lookAt = view.lookAtQuat(EYE, world.forward.mul(5), world.up);
    const lookTo = view.lookToQuat(world.forward, world.up);

    expect(isViewRotation(world, (point) => lookAt.mul(point))).toBeTrue();
    expect(isViewRotation(world, (point) => lookTo.mul(point))).toBeTrue();
  });

  test.each(PIPELINE_CASES)("%s perspective pipelines", (_, { proj, view, world }) => {
    const v = view.lookAtMat4(EYE, world.forward.mul(5), world.up);

    const projections: [NdcConfig, Mat4, number][] = [
      [NDC_OPENGL, proj.opengl.perspective(FOV, 1, 1, 10), NDC_OPENGL.zNear],
      [NDC_VULKAN, proj.vulkan.perspective(FOV, 1, 1, 10), NDC_VULKAN.zNear],
      [NDC_DIRECTX, proj.directx.perspective(FOV, 1, 1, 10), NDC_DIRECTX.zNear],
    ];

    expect(isPipeline(world, v, projections)).toBeTrue();
    expect(reachesFarPlane(world, v, projections)).toBeTrue();
  });

  test.each(PIPELINE_CASES)("%s orthographic pipelines", (_, { proj, view, world }) => {
    const v = view.lookAtMat4(EYE, world.forward.mul(5), world.up);

    const projections: [NdcConfig, Mat4, number][] = [
      [NDC_OPENGL, proj.opengl.orthographic(-5, 5, -5, 5, 1, 10), NDC_OPENGL.zNear],
      [NDC_VULKAN, proj.vulkan.orthographic(-5, 5, -5, 5, 1, 10), NDC_VULKAN.zNear],
      [NDC_DIRECTX, proj.directx.orthographic(-5, 5, -5, 5, 1, 10), NDC_DIRECTX.zNear],
    ];

    expect(isPipeline(world, v, projections)).toBeTrue();
    expect(reachesFarPlane(world, v, projections)).toBeTrue();
  });

  test.each(PIPELINE_CASES)("%s frustum pipelines", (_, { proj, view, world }) => {
    const v = view.lookAtMat4(EYE, world.forward.mul(5), world.up);

    const projections: [NdcConfig, Mat4, number][] = [
      [NDC_OPENGL, proj.opengl.frustum(-HEIGHT, HEIGHT, -HEIGHT, HEIGHT, 1, 10), NDC_OPENGL.zNear],
      [NDC_VULKAN, proj.vulkan.frustum(-HEIGHT, HEIGHT, -HEIGHT, HEIGHT, 1, 10), NDC_VULKAN.zNear],
      [
        NDC_DIRECTX,
        proj.directx.frustum(-HEIGHT, HEIGHT, -HEIGHT, HEIGHT, 1, 10),
        NDC_DIRECTX.zNear,
      ],
    ];

    expect(isPipeline(world, v, projections)).toBeTrue();
    expect(reachesFarPlane(world, v, projections)).toBeTrue();
  });

  test.each(PIPELINE_CASES)("%s infinite pipelines", (_, { proj, view, world }) => {
    const v = view.lookAtMat4(EYE, world.forward.mul(5), world.up);

    expect(
      isPipeline(world, v, [
        [NDC_VULKAN, proj.vulkan.perspectiveInfinite(FOV, 1, 1), NDC_VULKAN.zNear],
        [NDC_DIRECTX, proj.directx.perspectiveInfinite(FOV, 1, 1), NDC_DIRECTX.zNear],
        [NDC_VULKAN, proj.vulkan.perspectiveInfiniteReverse(FOV, 1, 1), NDC_VULKAN.zFar],
        [NDC_DIRECTX, proj.directx.perspectiveInfiniteReverse(FOV, 1, 1), NDC_DIRECTX.zFar],
      ]),
    ).toBeTrue();
  });

  test("rh transform perspective", () => {
    const original = new Vec4(5, 5, -15, 1);
    const { opengl, vulkan, directx } = camera.rh.proj;

    expect(
      opengl
        .perspective(FOV, 2, 5, 15)
        .mul(original)
        .absDiffEq(new Vec4(2.5, 5, 15, 15), EPS),
    ).toBeTrue();

    expect(
      vulkan
        .perspective(FOV, 2, 5, 15)
        .mul(original)
        .absDiffEq(new Vec4(2.5, -5, 15, 15), EPS),
    ).toBeTrue();

    expect(
      directx
        .perspective(FOV, 2, 5, 15)
        .mul(original)
        .absDiffEq(new Vec4(2.5, 5, 15, 15), EPS),
    ).toBeTrue();
  });

  test("lh transform perspective", () => {
    const original = new Vec4(5, 5, 15, 1);
    const { opengl, vulkan, directx } = camera.lh.proj;

    expect(
      opengl
        .perspective(FOV, 2, 5, 15)
        .mul(original)
        .absDiffEq(new Vec4(2.5, 5, 15, 15), EPS),
    ).toBeTrue();

    expect(
      vulkan
        .perspective(FOV, 2, 5, 15)
        .mul(original)
        .absDiffEq(new Vec4(2.5, -5, 15, 15), EPS),
    ).toBeTrue();

    expect(
      directx
        .perspective(FOV, 2, 5, 15)
        .mul(original)
        .absDiffEq(new Vec4(2.5, 5, 15, 15), EPS),
    ).toBeTrue();
  });

  test("lh perspective opengl", () => {
    const p = camera.lh.proj.opengl.perspective(FOV, 2, 5, 15);

    expect(p.xAxis.absDiffEq(new Vec4(0.5, 0, 0, 0), F32_EPSILON)).toBeTrue();
    expect(p.yAxis.absDiffEq(new Vec4(0, 1, 0, 0), F32_EPSILON)).toBeTrue();
    expect(p.zAxis.absDiffEq(new Vec4(0, 0, 2, 1), F32_EPSILON)).toBeTrue();
    expect(p.wAxis.absDiffEq(new Vec4(0, 0, -15, 0), F32_EPSILON)).toBeTrue();
  });

  test("lh orthographic opengl", () => {
    const p = camera.lh.proj.opengl.orthographic(-10, 10, -5, 5, -10, 10);

    expect(p.zAxis.absDiffEq(new Vec4(0, 0, 0.1, 0), F32_EPSILON)).toBeTrue();
    expect(p.wAxis.absDiffEq(new Vec4(0, 0, 0, 1), F32_EPSILON)).toBeTrue();
    expect(camera.lh.proj.opengl.orthographic(1, -1, 1, -1, 1, 2).isFinite()).toBeTrue();
  });

  test("lh frustum opengl", () => {
    const height = 5 * HEIGHT;
    const width = height * 2;
    const p = camera.lh.proj.opengl.frustum(-width, width, -height, height, 5, 15);

    expect(p.xAxis.absDiffEq(new Vec4(0.5, 0, 0, 0), F32_EPSILON)).toBeTrue();
    expect(p.yAxis.absDiffEq(new Vec4(0, 1, 0, 0), F32_EPSILON)).toBeTrue();
    expect(p.zAxis.absDiffEq(new Vec4(0, 0, 2, 1), F32_EPSILON)).toBeTrue();
    expect(p.wAxis.absDiffEq(new Vec4(0, 0, -15, 0), F32_EPSILON)).toBeTrue();
  });

  test("look at affine3", () => {
    const eye = new Vec3(0, 0, -5);
    const dir = new Vec3(0, 0, 1);
    const up = new Vec3(1, 0, 0);
    const point = new Vec3(1, 0, 0);
    const { rh, lh } = camera;
    const rhLookAt = rh.view.lookAtAffine3(eye, Vec3.ZERO, up);
    const lhLookAt = lh.view.lookAtAffine3(eye, Vec3.ZERO, up);

    expect(rhLookAt.transformPoint3(point).absDiffEq(new Vec3(0, 1, -5), EPS)).toBeTrue();

    expect(
      rh.view
        .lookToAffine3(eye, dir, up)
        .transformPoint3(point)
        .absDiffEq(new Vec3(0, 1, -5), EPS),
    ).toBeTrue();

    expect(lhLookAt.transformPoint3(point).absDiffEq(new Vec3(0, 1, 5), EPS)).toBeTrue();

    expect(
      lh.view
        .lookToAffine3(eye, dir, up)
        .transformPoint3(point)
        .absDiffEq(new Vec3(0, 1, 5), EPS),
    ).toBeTrue();
  });

  test("look at mat3", () => {
    const eye = new Vec3(0, 0, -5);
    const dir = new Vec3(0, 0, 1);
    const up = new Vec3(1, 0, 0);
    const { rh, lh } = camera;

    for (const rotation of [
      rh.view.lookAtMat3(eye, Vec3.ZERO, up),
      rh.view.lookToMat3(dir, up),
      lh.view.lookAtMat3(eye, Vec3.ZERO, up),
      lh.view.lookToMat3(dir, up),
    ]) {
      expect(rotation.mul(Vec3.X).absDiffEq(new Vec3(0, 1, 0), EPS)).toBeTrue();
    }
  });

  test.each(VIEW_CASES)("%s view variants agree", (_, { view }) => {
    const eye = new Vec3(1, -2, 3);
    const center = new Vec3(-4, 5, 0.5);
    const up = new Vec3(0.3, 0.9, -0.1).normalize();
    const dir = center.sub(eye).normalize();
    const m = view.lookAtMat4(eye, center, up);
    const rotation = Mat4.fromMat3(view.lookAtMat3(eye, center, up));

    expect(m.absDiffEq(view.lookToMat4(eye, dir, up), EPS)).toBeTrue();
    expect(Mat4.fromAffine3(view.lookAtAffine3(eye, center, up)).absDiffEq(m, EPS)).toBeTrue();
    expect(rotation.absDiffEq(Mat4.fromQuat(view.lookAtQuat(eye, center, up)), EPS)).toBeTrue();
    expect(Mat3.fromMat4(m).absDiffEq(view.lookToMat3(dir, up), EPS)).toBeTrue();
  });
});
