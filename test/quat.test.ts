import { EulerRot, Mat3, Mat4, Quat, Vec2, Vec3, Vec4, quat } from "@";

const F32_EPSILON = 1.1920929e-7;

function deg(angle: number) {
  return (angle * Math.PI) / 180;
}

const VEC3_TEST_VECTORS = [
  Vec3.X,
  Vec3.Y,
  Vec3.Z,
  Vec3.NEG_X,
  Vec3.NEG_Y,
  Vec3.NEG_Z,
  new Vec3(1, 1e-3, 0),
  new Vec3(1, 1e-4, 0),
  new Vec3(1, 1e-5, 0),
  new Vec3(1, 1e-6, 0),
  new Vec3(1, 1e-7, 0),
  new Vec3(1, 1e-14, 0),
  new Vec3(1, 1e-15, 0),
  new Vec3(1, 1e-16, 0),
  new Vec3(0.1, 0.2, 0.3),
  new Vec3(0.2, 0.3, 0.4),
  new Vec3(4, -5, 6),
  new Vec3(-2, 0.5, -1),
  new Vec3(0.00038527316, 0.00038460016, -0.99999988079),
  new Vec3(-0.00019813581, -0.00008946839, -0.99999988079),
];

const VEC2_TEST_VECTORS = [
  Vec2.X,
  Vec2.Y,
  Vec2.NEG_X,
  Vec2.NEG_Y,
  new Vec2(1, 1e-3),
  new Vec2(1, 1e-4),
  new Vec2(1, 1e-5),
  new Vec2(1, 1e-6),
  new Vec2(1, 1e-7),
  new Vec2(1, 1e-14),
  new Vec2(1, 1e-15),
  new Vec2(1, 1e-16),
  new Vec2(0.1, 0.2),
  new Vec2(0.2, 0.3),
  new Vec2(4, -5),
  new Vec2(-2, 0.5),
  new Vec2(0.00038527316, -0.99999988079),
  new Vec2(-0.00019813581, -0.99999988079),
];

function nextUp(value: number) {
  const view = new DataView(new ArrayBuffer(8));

  view.setFloat64(0, value);
  view.setBigUint64(0, view.getBigUint64(0) + 1n);

  return view.getFloat64(0);
}

describe(Quat, () => {
  test("const", () => {
    expect(Quat.fromXyzw(1, 2, 3, 4).toArray()).toStrictEqual([1, 2, 3, 4]);
    expect(Quat.fromArray([1, 2, 3, 4]).toArray()).toStrictEqual([1, 2, 3, 4]);
    expect(Quat.new(1, 2, 3, 4).toArray()).toStrictEqual([1, 2, 3, 4]);
  });

  test("nan", () => {
    expect(Quat.NAN.isNan()).toBeTrue();
    expect(Quat.NAN.isFinite()).toBeFalse();
  });

  test("new", () => {
    const ytheta = deg(45);
    const q0 = Quat.fromRotationY(ytheta);
    const v1 = new Vec4(0, Math.sin(ytheta * 0.5), 0, Math.cos(ytheta * 0.5));

    expect(q0.toString()).toBe(Quat.fromVec4(v1).toString());
    expect(q0.toString()).toBe(quat(v1.x, v1.y, v1.z, v1.w).toString());

    const a1 = Quat.fromVec4(v1).toArray();

    expect(a1).toStrictEqual([v1.x, v1.y, v1.z, v1.w]);
    expect(Quat.fromVec4(v1).toString()).toBe(Quat.fromArray(a1).toString());
  });

  test("funcs", () => {
    const q0 = Quat.fromEuler(EulerRot.YXZ, deg(45), deg(180), deg(90));

    expect(q0.isNormalized()).toBeTrue();
    expect(Math.abs(q0.lengthSquared() - 1)).toBeLessThanOrEqual(F32_EPSILON);
    expect(Math.abs(q0.length() - 1)).toBeLessThanOrEqual(F32_EPSILON);
    expect(Math.abs(q0.lengthRecip() - 1)).toBeLessThanOrEqual(F32_EPSILON);
    expect(q0.absDiffEq(q0.normalize(), F32_EPSILON)).toBeTrue();
    expect(Math.abs(q0.dot(q0) - 1)).toBeLessThanOrEqual(F32_EPSILON);

    const q1 = q0.mul(2);

    expect(q1.isNormalized()).toBeFalse();
    expect(Math.abs(q1.lengthSquared() - 4)).toBeLessThanOrEqual(1e-6);
    expect(Math.abs(q1.length() - 2)).toBeLessThanOrEqual(F32_EPSILON);
    expect(Math.abs(q1.lengthRecip() - 0.5)).toBeLessThanOrEqual(F32_EPSILON);
    expect(q0.absDiffEq(q1.normalize(), F32_EPSILON)).toBeTrue();
    expect(Math.abs(q0.dot(q1) - 2)).toBeLessThanOrEqual(1e-6);
  });

  test("rotation", () => {
    const zero = deg(0);
    const yaw = deg(30);
    const pitch = deg(60);
    const roll = deg(90);
    const y0 = Quat.fromRotationY(yaw);

    expect(y0.isNormalized()).toBeTrue();

    let [axis, angle] = y0.toAxisAngle();

    expect(axis.absDiffEq(Vec3.Y, 1e-6)).toBeTrue();
    expect(Math.abs(angle - yaw)).toBeLessThanOrEqual(F32_EPSILON);
    expect(y0.absDiffEq(Quat.fromEuler(EulerRot.YXZ, yaw, zero, zero), F32_EPSILON)).toBeTrue();
    expect(y0.absDiffEq(Quat.fromAxisAngle(Vec3.Y, yaw), F32_EPSILON)).toBeTrue();
    expect(y0.absDiffEq(Quat.fromMat3(Mat3.fromRotationY(yaw)), F32_EPSILON)).toBeTrue();
    expect(y0.absDiffEq(Quat.fromMat3(Mat3.fromQuat(y0)), F32_EPSILON)).toBeTrue();

    const m0 = Mat3.fromQuat(y0);

    expect(
      y0.absDiffEq(Quat.fromRotationAxes(m0.xAxis, m0.yAxis, m0.zAxis), F32_EPSILON),
    ).toBeTrue();

    const x0 = Quat.fromRotationX(pitch);

    expect(x0.isNormalized()).toBeTrue();
    [axis, angle] = x0.toAxisAngle();
    expect(axis.absDiffEq(Vec3.X, F32_EPSILON)).toBeTrue();
    expect(Math.abs(angle - pitch)).toBeLessThanOrEqual(1e-6);
    expect(x0.absDiffEq(Quat.fromEuler(EulerRot.YXZ, zero, pitch, zero), F32_EPSILON)).toBeTrue();
    expect(x0.absDiffEq(Quat.fromAxisAngle(Vec3.X, pitch), F32_EPSILON)).toBeTrue();

    const x3 = Quat.fromMat4(Mat4.fromRotationX(deg(180)));

    expect(x3.isNormalized()).toBeTrue();
    expect(Quat.fromRotationX(deg(180)).absDiffEq(x3, F32_EPSILON)).toBeTrue();

    const z0 = Quat.fromRotationZ(roll);

    expect(z0.isNormalized()).toBeTrue();
    [axis, angle] = z0.toAxisAngle();
    expect(axis.absDiffEq(Vec3.Z, F32_EPSILON)).toBeTrue();
    expect(Math.abs(angle - roll)).toBeLessThanOrEqual(F32_EPSILON);
    expect(z0.absDiffEq(Quat.fromEuler(EulerRot.YXZ, zero, zero, roll), F32_EPSILON)).toBeTrue();
    expect(z0.absDiffEq(Quat.fromAxisAngle(Vec3.Z, roll), F32_EPSILON)).toBeTrue();
    expect(z0.absDiffEq(Quat.fromMat4(Mat4.fromRotationZ(roll)), F32_EPSILON)).toBeTrue();

    const yx0 = y0.mul(x0);

    expect(yx0.isNormalized()).toBeTrue();
    expect(yx0.absDiffEq(Quat.fromEuler(EulerRot.YXZ, yaw, pitch, zero), F32_EPSILON)).toBeTrue();

    const yxz0 = y0.mul(x0).mul(z0);

    expect(yxz0.isNormalized()).toBeTrue();
    expect(yxz0.absDiffEq(Quat.fromEuler(EulerRot.YXZ, yaw, pitch, roll), F32_EPSILON)).toBeTrue();
    expect(yx0.absDiffEq(yxz0.mul(z0.conjugate()), F32_EPSILON)).toBeTrue();
    expect(yxz0.mul(yxz0.conjugate()).isNearIdentity()).toBeTrue();
    expect(yx0.absDiffEq(yxz0.mul(z0.inverse()), F32_EPSILON)).toBeTrue();
    expect(yxz0.mul(yxz0.inverse()).isNearIdentity()).toBeTrue();
    expect(yxz0.absDiffEq(Quat.fromMat4(Mat4.fromQuat(yxz0)), F32_EPSILON)).toBeTrue();
    [axis, angle] = Quat.IDENTITY.toAxisAngle();
    expect(axis.toString()).toBe(Vec3.X.toString());
    expect(angle).toBe(0);

    const x1 = Quat.fromRotationX(pitch);

    x1.mulAssign(x1.clone());
    expect(x1.absDiffEq(Quat.fromRotationX(pitch * 2), F32_EPSILON)).toBeTrue();

    const x2 = Quat.fromRotationX(pitch);

    expect(x2.mulAssign(x2)).toBe(x2);
    expect(x2.absDiffEq(Quat.fromRotationX(pitch * 2), F32_EPSILON)).toBeTrue();
  });

  test("from scaled axis", () => {
    expect(Quat.fromScaledAxis(Vec3.ZERO).toString()).toBe(Quat.IDENTITY.toString());

    expect(Quat.fromScaledAxis(Vec3.Y.mul(1e-10)).toString()).toBe(
      Quat.fromAxisAngle(Vec3.Y, 1e-10).toString(),
    );

    expect(Quat.fromScaledAxis(Vec3.X.mul(1)).toString()).toBe(
      Quat.fromAxisAngle(Vec3.X, 1).toString(),
    );

    expect(Quat.fromScaledAxis(Vec3.Z.mul(2)).toString()).toBe(
      Quat.fromAxisAngle(Vec3.Z, 2).toString(),
    );

    expect(Quat.fromScaledAxis(Vec3.ZERO).toScaledAxis().toString()).toBe(Vec3.ZERO.toString());

    for (const v of VEC3_TEST_VECTORS.filter((vector) => vector.length() < Math.PI)) {
      expect(Quat.fromScaledAxis(v).toScaledAxis().sub(v).length()).toBeLessThan(1e-6);
    }
  });

  test("mul vec3", () => {
    const qrz = Quat.fromRotationZ(deg(90));

    expect(Vec3.Y.absDiffEq(qrz.mul(Vec3.X), F32_EPSILON)).toBeTrue();
    expect(Vec3.Y.absDiffEq(qrz.mulVec3(Vec3.X), F32_EPSILON)).toBeTrue();
    expect(Vec3.Y.absDiffEq(qrz.neg().mul(Vec3.X), F32_EPSILON)).toBeTrue();
    expect(Vec3.NEG_X.absDiffEq(qrz.mul(Vec3.Y), F32_EPSILON)).toBeTrue();
    expect(Vec3.NEG_X.absDiffEq(qrz.neg().mulVec3(Vec3.Y), F32_EPSILON)).toBeTrue();

    const mrz = Mat3.fromQuat(qrz);

    expect(Vec3.Y.absDiffEq(mrz.mul(Vec3.X), F32_EPSILON)).toBeTrue();
    expect(Vec3.NEG_X.absDiffEq(mrz.mulVec3(Vec3.Y), F32_EPSILON)).toBeTrue();

    const qrx = Quat.fromRotationX(deg(90));

    expect(Vec3.X.absDiffEq(qrx.mul(Vec3.X), F32_EPSILON)).toBeTrue();
    expect(Vec3.X.absDiffEq(qrx.neg().mulVec3(Vec3.X), F32_EPSILON)).toBeTrue();
    expect(Vec3.Z.absDiffEq(qrx.mul(Vec3.Y), F32_EPSILON)).toBeTrue();
    expect(Vec3.Z.absDiffEq(qrx.neg().mulVec3(Vec3.Y), F32_EPSILON)).toBeTrue();

    const mrx = Mat3.fromQuat(qrx);

    expect(Vec3.X.absDiffEq(mrx.mul(Vec3.X), F32_EPSILON)).toBeTrue();
    expect(Vec3.Z.absDiffEq(mrx.mulVec3(Vec3.Y), F32_EPSILON)).toBeTrue();

    const qrxz = qrz.mul(qrx);

    expect(Vec3.Y.absDiffEq(qrxz.mul(Vec3.X), F32_EPSILON)).toBeTrue();
    expect(Vec3.Z.absDiffEq(qrxz.mulVec3(Vec3.Y), F32_EPSILON)).toBeTrue();

    const mrxz = mrz.mul(mrx);

    expect(Vec3.Y.absDiffEq(mrxz.mul(Vec3.X), F32_EPSILON)).toBeTrue();
    expect(Vec3.Z.absDiffEq(mrxz.mulVec3(Vec3.Y), F32_EPSILON)).toBeTrue();

    const qrzx = qrx.mul(qrz);

    expect(Vec3.Z.absDiffEq(qrzx.mul(Vec3.X), F32_EPSILON)).toBeTrue();
    expect(Vec3.NEG_X.absDiffEq(qrzx.mulVec3(Vec3.Y), F32_EPSILON)).toBeTrue();
  });

  test("angle between", () => {
    const tau = 2 * Math.PI;
    const eps = 10 * Number.EPSILON;
    const q1 = Quat.fromEuler(EulerRot.YXZ, 0, 0, 0);
    const q2 = Quat.fromEuler(EulerRot.YXZ, tau * 0.25, 0, 0);
    const q3 = Quat.fromEuler(EulerRot.YXZ, tau * 0.5, 0, 0);
    const q4 = Quat.fromEuler(EulerRot.YXZ, 0, 0, tau * 0.25);
    const q5 = Quat.fromAxisAngle(new Vec3(1, 2, 3).normalize(), tau * 0.3718);
    const q6 = Quat.fromAxisAngle(new Vec3(-1, 5, 3).normalize(), tau * 0.94);

    expect(Math.abs(q1.angleBetween(q2) - tau * 0.25)).toBeLessThanOrEqual(eps);
    expect(Math.abs(q1.angleBetween(q3) - tau * 0.5)).toBeLessThanOrEqual(eps);
    expect(Math.abs(q3.angleBetween(q3))).toBeLessThanOrEqual(eps);
    expect(Math.abs(q3.angleBetween(q3.neg()))).toBeLessThanOrEqual(eps);

    expect(Math.abs(q4.mul(q2).mul(q2).angleBetween(q4.mul(q2)) - tau * 0.25)).toBeLessThanOrEqual(
      eps,
    );

    expect(Math.abs(q1.angleBetween(q5) - tau * 0.3718)).toBeLessThanOrEqual(eps);

    const q521 = q5.mul(q2).mul(q1);
    const q525 = q5.mul(q2).mul(q5);

    expect(Math.abs(q521.angleBetween(q525) - tau * 0.3718)).toBeLessThanOrEqual(eps);
    expect(Math.abs(q3.mul(q3).angleBetween(q1))).toBeLessThanOrEqual(eps);
    expect(Math.abs(q3.mul(q3).mul(q3).angleBetween(q3))).toBeLessThanOrEqual(eps);
    expect(Math.abs(q3.mul(q3).mul(q3).mul(q3).angleBetween(q1))).toBeLessThanOrEqual(eps);
    expect(Math.abs(q1.angleBetween(q6) - (tau - tau * 0.94))).toBeLessThanOrEqual(eps);

    expect(Math.abs(q5.mul(q1).angleBetween(q5.mul(q6)) - (tau - tau * 0.94))).toBeLessThanOrEqual(
      eps,
    );

    expect(Math.abs(q1.mul(q5).angleBetween(q6.mul(q5)) - (tau - tau * 0.94))).toBeLessThanOrEqual(
      eps,
    );
  });

  test("lerp", () => {
    const q0 = Quat.fromRotationY(deg(0));
    const q1 = Quat.fromRotationY(deg(90));

    expect(q0.absDiffEq(q0.slerp(q0, 0), F32_EPSILON)).toBeTrue();
    expect(q0.absDiffEq(q0.slerp(q0, 1), F32_EPSILON)).toBeTrue();
    expect(q0.absDiffEq(q0.lerp(q1, 0), F32_EPSILON)).toBeTrue();
    expect(q1.absDiffEq(q0.lerp(q1, 1), F32_EPSILON)).toBeTrue();
    expect(Quat.fromRotationY(deg(45)).absDiffEq(q0.lerp(q1, 0.5), F32_EPSILON)).toBeTrue();
  });

  test("slerp", () => {
    const q0 = Quat.fromRotationY(deg(0));
    const q1 = Quat.fromRotationY(deg(90));

    expect(q0.absDiffEq(q0.slerp(q0, 0), F32_EPSILON)).toBeTrue();
    expect(q0.absDiffEq(q0.slerp(q0, 1), F32_EPSILON)).toBeTrue();
    expect(q0.absDiffEq(q0.slerp(q1, 0), 1e-3)).toBeTrue();
    expect(q1.absDiffEq(q0.slerp(q1, 1), 1e-3)).toBeTrue();
    expect(Quat.fromRotationY(deg(45)).absDiffEq(q0.slerp(q1, 0.5), 1e-3)).toBeTrue();
  });

  test("slerp constant speed", () => {
    const q0 = Quat.fromRotationY(deg(0));
    const q1 = Quat.fromRotationY(deg(90));

    for (let s = 0; s <= 1; s += 0.01) {
      const result = q0.slerp(q1, s);
      const resultLong = q0.slerpLong(q1, s);

      expect(Quat.fromRotationY(deg(s * 90)).absDiffEq(result, 1e-3)).toBeTrue();
      expect(result.isNormalized()).toBeTrue();
      expect(Quat.fromRotationY(deg(s * 90)).absDiffEq(resultLong, 1e-3)).toBeTrue();
      expect(resultLong.isNormalized()).toBeTrue();
    }
  });

  test("slerp edge cases", () => {
    for (const angle of [2 * Math.PI, -2 * Math.PI, Math.PI, -Math.PI]) {
      const s = Quat.IDENTITY.slerp(Quat.fromRotationX(angle), 1);
      const sLong = Quat.IDENTITY.slerpLong(Quat.fromRotationX(angle), 1);

      expect(s.isFinite()).toBeTrue();
      expect(s.isNormalized()).toBeTrue();
      expect(sLong.isFinite()).toBeTrue();
      expect(sLong.isNormalized()).toBeTrue();
    }
  });

  test("slerp long", () => {
    const q0 = Quat.fromRotationY(deg(0));
    const q1 = Quat.fromRotationY(deg(90));
    const q2 = Quat.fromRotationY(deg(200));

    expect(q0.absDiffEq(q0.slerpLong(q0, 0), F32_EPSILON)).toBeTrue();
    expect(q0.absDiffEq(q0.slerpLong(q0, 1), F32_EPSILON)).toBeTrue();
    expect(q0.slerp(q1, 0.5).absDiffEq(q0.slerpLong(q1, 0.5), 1e-3)).toBeTrue();
    expect(Quat.fromRotationY(deg(45)).absDiffEq(q0.slerpLong(q1, 0.5), 1e-3)).toBeTrue();

    const midSlerp = q0.slerp(q2, 0.5);
    const midLong = q0.slerpLong(q2, 0.5);

    expect(Quat.fromRotationY(deg(100)).absDiffEq(midLong, 1e-3)).toBeTrue();
    expect(q0.angleBetween(midLong)).toBeGreaterThan(q0.angleBetween(midSlerp));
  });

  test("slerp extrapolate", () => {
    const q0 = Quat.fromRotationY(deg(0));
    const q1 = Quat.fromRotationY(deg(90));
    let result = q0.slerp(q1, -0.5);

    expect(Quat.fromRotationY(deg(-45)).absDiffEq(result, 1e-3)).toBeTrue();
    expect(result.isNormalized()).toBeTrue();
    result = q0.slerp(q1, 1.5);
    expect(Quat.fromRotationY(deg(135)).absDiffEq(result, 1e-3)).toBeTrue();
    expect(result.isNormalized()).toBeTrue();
  });

  test("slerp near parallel", () => {
    const q0 = Quat.fromRotationY(deg(0));
    const mid = q0.slerp(Quat.fromRotationY(deg(0.5)), 0.5);

    expect(Quat.fromRotationY(deg(0.25)).absDiffEq(mid, 1e-6)).toBeTrue();
    expect(mid.isNormalized()).toBeTrue();
  });

  test("slerp long near antipodal", () => {
    const q0 = Quat.IDENTITY;
    const q1 = Quat.fromRotationY(deg(354.8));
    const mid = q0.slerpLong(q1, 0.5);

    expect(mid.isFinite()).toBeTrue();
    expect(mid.isNormalized()).toBeTrue();
    expect(q0.angleBetween(mid)).toBeGreaterThan(q0.angleBetween(q0.slerp(q1, 0.5)));
  });

  test("rotate towards", () => {
    const eps = 10 * Number.EPSILON;
    const q0 = Quat.fromEuler(EulerRot.YXZ, 0, 0, 0);
    const q1 = Quat.fromEuler(EulerRot.YXZ, Math.PI / 2, 0, 0);
    const q2 = Quat.fromEuler(EulerRot.YXZ, -Math.PI / 2, 0, 0);

    expect(q0.absDiffEq(q0.rotateTowards(q1, 0), eps)).toBeTrue();

    expect(
      Quat.fromEuler(EulerRot.YXZ, Math.PI / 4, 0, 0).absDiffEq(
        q0.rotateTowards(q1, Math.PI / 4),
        eps,
      ),
    ).toBeTrue();

    expect(q1.absDiffEq(q0.rotateTowards(q1, Math.PI / 2), eps)).toBeTrue();
    expect(q1.absDiffEq(q0.rotateTowards(q1, (Math.PI / 2) * 1.5), eps)).toBeTrue();

    expect(
      Quat.fromEuler(EulerRot.YXZ, -Math.PI / 4, 0, 0).absDiffEq(
        q0.rotateTowards(q1, -Math.PI / 4),
        eps,
      ),
    ).toBeTrue();

    expect(q2.absDiffEq(q0.rotateTowards(q1, -Math.PI / 2), eps)).toBeTrue();
    expect(q2.absDiffEq(q0.rotateTowards(q1, (-Math.PI / 2) * 1.5), eps)).toBeTrue();

    const small = Quat.fromEuler(EulerRot.YXZ, 1e-4, 0, 0);

    expect(small.toString()).toBe(q0.rotateTowards(small, Math.PI / 2).toString());
    expect(q0.rotateTowards(small, Math.PI / 2)).not.toBe(small);
  });

  test("fmt", () => {
    expect(Quat.IDENTITY.toString()).toBe("[0, 0, 0, 1]");
  });

  test("identity", () => {
    const identity = Quat.IDENTITY;

    expect(identity.isNearIdentity()).toBeTrue();
    expect(identity.isNormalized()).toBeTrue();
    expect(identity.toString()).toBe(Quat.fromXyzw(0, 0, 0, 1).toString());
    expect(identity.toString()).toBe(identity.mul(identity).toString());

    const q = Quat.fromEuler(EulerRot.YXZ, deg(10), deg(-10), deg(45));

    expect(q.toString()).toBe(q.mul(identity).toString());
    expect(q.toString()).toBe(identity.mul(q).toString());
    expect(identity.toString()).toBe(identity.neg().neg().toString());
  });

  test("slice", () => {
    const a = Quat.fromEuler(EulerRot.YXZ, deg(30), deg(60), deg(90)).toArray();
    const b = Quat.fromSlice(a);

    expect(b.toArray()).toStrictEqual(a);

    const d = [0, 0, 0, 0];

    b.writeToSlice(d);
    expect(d).toStrictEqual(a);

    expect(() => {
      Quat.IDENTITY.writeToSlice([0, 0, 0]);
    }).toThrow(RangeError);

    expect(() => Quat.fromSlice([0, 0, 0])).toThrow(RangeError);
  });

  test("elements", () => {
    const a = Quat.fromXyzw(1, 2, 3, 4);

    expect(a.x).toBe(1);
    expect(a.y).toBe(2);
    expect(a.z).toBe(3);
    expect(a.w).toBe(4);
    expect(new Vec3(1, 2, 3).toString()).toBe(a.xyz().toString());
  });

  test("addition", () => {
    const a = Quat.fromXyzw(1, 2, 3, 4);
    const b = Quat.fromXyzw(5, 6, 7, -9);
    const result = Quat.fromXyzw(6, 8, 10, -5);

    expect(a.add(b).toString()).toBe(result.toString());
    expect(a.clone().addAssign(b).toString()).toBe(result.toString());
  });

  test("subtraction", () => {
    const a = Quat.fromXyzw(6, 8, 10, -5);
    const b = Quat.fromXyzw(5, 6, 7, -9);
    const result = Quat.fromXyzw(1, 2, 3, 4);

    expect(a.sub(b).toString()).toBe(result.toString());
    expect(a.clone().subAssign(b).toString()).toBe(result.toString());
  });

  test("scalar multiplication", () => {
    const a = Quat.fromXyzw(1, 2, 3, 4);
    const result = Quat.fromXyzw(2, 4, 6, 8);

    expect(a.mul(2).toString()).toBe(result.toString());
    expect(a.clone().mulAssign(2).toString()).toBe(result.toString());
  });

  test("scalar division", () => {
    const a = Quat.fromXyzw(2, 4, 6, 8);
    const result = Quat.fromXyzw(1, 2, 3, 4);

    expect(a.div(2).toString()).toBe(result.toString());
    expect(a.clone().divAssign(2).toString()).toBe(result.toString());
  });

  test("is finite", () => {
    expect(Quat.fromXyzw(0, 0, 0, 0).isFinite()).toBeTrue();
    expect(Quat.fromXyzw(-1e-10, 1, 1e10, 42).isFinite()).toBeTrue();
    expect(Quat.fromXyzw(Number.POSITIVE_INFINITY, 0, 0, 0).isFinite()).toBeFalse();
    expect(Quat.fromXyzw(0, Number.NaN, 0, 0).isFinite()).toBeFalse();
    expect(Quat.fromXyzw(0, 0, Number.NEGATIVE_INFINITY, 0).isFinite()).toBeFalse();
    expect(Quat.fromXyzw(0, 0, 0, Number.NaN).isFinite()).toBeFalse();
  });

  test("rotation arc", () => {
    const eps = 2 * Math.sqrt(Number.EPSILON);

    for (const vector of VEC3_TEST_VECTORS) {
      const from = vector.normalize();
      const negFrom = from.neg();

      expect(Quat.fromRotationArc(from, from).isNearIdentity()).toBeTrue();
      expect(Quat.fromRotationArcColinear(from, from).isNearIdentity()).toBeTrue();

      const q = Quat.fromRotationArc(from, negFrom);

      expect(q.isNormalized()).toBeTrue();
      expect(q.mul(from).sub(negFrom).length()).toBeLessThan(eps);
      expect(Quat.fromRotationArcColinear(from, negFrom).isNearIdentity()).toBeTrue();

      for (const toVector of VEC3_TEST_VECTORS) {
        const to = toVector.normalize();
        const arc = Quat.fromRotationArc(from, to);

        expect(arc.isNormalized()).toBeTrue();
        expect(arc.mul(from).sub(to).length()).toBeLessThan(eps);

        const colinear = Quat.fromRotationArcColinear(from, to);
        const transformed = colinear.mul(from);

        expect(colinear.isNormalized()).toBeTrue();

        expect(
          Math.min(transformed.sub(to).length(), transformed.neg().sub(to).length()),
        ).toBeLessThan(eps);
      }
    }

    for (const vector of VEC2_TEST_VECTORS) {
      const from = vector.normalize();
      const from3 = new Vec3(from.x, from.y, 0);

      expect(Quat.fromRotationArc2d(from, from).isNearIdentity()).toBeTrue();

      const q = Quat.fromRotationArc2d(from, from.neg());

      expect(q.isNormalized()).toBeTrue();
      expect(q.mul(from3).add(from3).length()).toBeLessThan(eps);

      for (const toVector of VEC2_TEST_VECTORS) {
        const to = toVector.normalize();
        const arc = Quat.fromRotationArc2d(from, to);

        expect(arc.isNormalized()).toBeTrue();

        expect(
          arc
            .mul(from3)
            .sub(new Vec3(to.x, to.y, 0))
            .length(),
        ).toBeLessThan(eps);
      }
    }
  });

  test("to array", () => {
    expect(Quat.new(1, 2, 3, 4).toArray()).toStrictEqual([1, 2, 3, 4]);
  });

  test("to axis angle", () => {
    for (const q of [
      Quat.fromXyzw(5.28124762e-8, -5.12559303e-3, 8.2926614e-8, 9.99986828e-1),
      Quat.IDENTITY,
      Quat.fromXyzw(0, 1, 0, 0),
    ]) {
      expect(q.isNormalized()).toBeTrue();

      const [axis, angle] = q.toAxisAngle();

      expect(axis.isNormalized()).toBeTrue();
      expect(Math.abs(q.dot(Quat.fromAxisAngle(axis, angle)) - 1)).toBeLessThan(1e-6);
    }

    const axis = Vec3.Z;
    const angle = Math.PI * 0.25;
    const [axis2, angle2] = Quat.fromAxisAngle(axis, angle).toAxisAngle();

    expect(axis.absDiffEq(axis2, F32_EPSILON)).toBeTrue();
    expect(Math.abs(angle - angle2)).toBeLessThanOrEqual(F32_EPSILON);
  });

  test("assign ops", () => {
    const q = Quat.fromXyzw(1, 2, 3, 4);
    const p = Quat.fromXyzw(5, 6, 7, 8);

    expect(p.add(q).toString()).toBe(p.clone().addAssign(q).toString());
    expect(p.sub(q).toString()).toBe(p.clone().subAssign(q).toString());
    expect(p.mul(q).toString()).toBe(p.clone().mulAssign(q).toString());
  });

  test("is near identity threshold", () => {
    const thresholdW = 0.99999999999999;
    const insideW = nextUp(thresholdW);
    const threshold = quat(Math.sqrt(1 - thresholdW * thresholdW), 0, 0, thresholdW);
    const inside = quat(Math.sqrt(1 - insideW * insideW), 0, 0, insideW);

    expect(threshold.isNormalized()).toBeTrue();
    expect(inside.isNormalized()).toBeTrue();
    expect(threshold.isNearIdentity()).toBeFalse();
    expect(inside.isNearIdentity()).toBeTrue();
    expect(threshold.neg().isNearIdentity()).toBeFalse();
    expect(inside.neg().isNearIdentity()).toBeTrue();
    expect(Quat.NAN.isNearIdentity()).toBeFalse();
  });

  test("eq", () => {
    expect(Quat.IDENTITY.eq(Quat.IDENTITY)).toBeTrue();
    expect(Quat.IDENTITY.ne(Quat.IDENTITY)).toBeFalse();
    expect(Quat.IDENTITY.ne(Quat.NAN)).toBeTrue();
  });
});
