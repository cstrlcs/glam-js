const AXES = ["X", "Y", "Z"] as const;

type Axis = (typeof AXES)[number];

interface Order {
  initialAxis: Axis;
  parityEven: boolean;
  initialRepeated: boolean;
  frameStatic: boolean;
}

export interface EulerOrder {
  name: string;
  i: number;
  j: number;
  k: number;
  parityEven: boolean;
  initialRepeated: boolean;
  frameStatic: boolean;
}

function order(name: string) {
  const extrinsic = name.endsWith("Ex");
  const letters = [0, 1, 2].map((index) => name.charAt(extrinsic ? 2 - index : index));
  const initialAxis = AXES.find((axis) => axis === letters[0]) ?? "X";
  const next = AXES[(AXES.indexOf(initialAxis) + 1) % 3];

  return {
    initialAxis,
    parityEven: letters[1] === next,
    initialRepeated: letters[2] === letters[0],
    frameStatic: !extrinsic,
  };
}

function angleOrder({ initialAxis, parityEven }: Order) {
  const i = AXES.indexOf(initialAxis);
  const next = (i + 1) % 3;
  const previous = (i + 2) % 3;

  return parityEven ? ([i, next, previous] as const) : ([i, previous, next] as const);
}

const NAMES = [
  "ZYX",
  "ZXY",
  "YXZ",
  "YZX",
  "XYZ",
  "XZY",
  "ZYZ",
  "ZXZ",
  "YXY",
  "YZY",
  "XYX",
  "XZX",
  "ZYXEx",
  "ZXYEx",
  "YXZEx",
  "YZXEx",
  "XYZEx",
  "XZYEx",
  "ZYZEx",
  "ZXZEx",
  "YXYEx",
  "YZYEx",
  "XYXEx",
  "XZXEx",
];

export const eulerOrders: EulerOrder[] = NAMES.map((name) => {
  const resolved = order(name);
  const [i, j, k] = angleOrder(resolved);

  return {
    name,
    i,
    j,
    k,
    parityEven: resolved.parityEven,
    initialRepeated: resolved.initialRepeated,
    frameStatic: resolved.frameStatic,
  };
});
