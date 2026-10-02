// Every benchmark iteration runs the measured operation `N` (1000) times,
// so the reported `µs/iter` reads directly as `ns/op`.
//
// Usage:
//   bun bench              # Bun (JavaScriptCore)
//   bun bench:node         # Node.js (V8, same engine as Chrome)
//   bun bench <regex>      # only run benchmarks whose name matches
import { run } from "mitata";
import "./bvec.bench";
import "./mat.bench";
import "./scenario.bench";
import "./vec.bench";

const filter = process.argv[2];

await run(filter ? { filter: new RegExp(filter, "i") } : {});
