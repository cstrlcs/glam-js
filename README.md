# glam-js

<span align="center">

</span>

A simple and fast 3D math library for games and graphics.


## Development status

`glam-js` is currently in active development and is not yet suitable for production use. While some types are still missing, the Vector types have already been ported.


## Introduction

`glam-js` is a TypeScript port of the incredible [glam-rs](https://github.com/bitshifter/glam-rs) library. Its primary objective is to provide a straightforward and efficient 3D math library for game development and computer graphics, written entirely in TypeScript.

Although some features specific to Rust are not available in TypeScript, `glam-js` aims to offer a similar API and performance.

Notable Changes:
* Unified types for number and boolean vectors
* Removal of Rust-specific methods related to the borrow checker
* Elimination of SIMD support
* Transition from `snake_case` to `camelCase` for naming conventions


## Features

* ✨ Simple to use: since the code is generated, the API is super simple to understand
* 📋 100% test coverage
* 📦 0 dependencies
* 🔢 `number` types
  * vectors: `Vec2`, `Vec3` and `Vec4`
  * ~~square matrices: `Mat2`, `Mat3`, `Mat3A` and `Mat4`~~ (⚠️ WIP)
  * ~~a quaternion type: `Quat`~~ (⚠️ WIP)
  * ~~affine transformation types: `Affine2` and `Affine3A`~~ (⚠️ WIP)
* ☑️ `boolean` types
  * vectors: `BVec2`, `BVec3` and `BVec4`


## Motivation

The goal of this port is to provide a faithful port of the original Rust library, allowing for easy and quick prototyping in pure JavaScript environments. This enables developers to quickly incorporate `glam-js` into projects by simply importing it from a CDN, such as [CodePen](https://codepen.io/) or [JSFiddle](https://jsfiddle.net/).


## Design Philosophy

The design of this library is guided by a desire for simplicity and good
performance.

* No generics and minimal type complexity in the public API for simplicity of usage
* Aiming for 100% test [coverage]


## Inspirations

The code in `glam-js` is a direct port of the Rust library [glam-rs](https://github.com/bitshifter/glam-rs), which in turn has inspirations for the interface and internals of glam from the
Rust and C++ worlds. In particular:

* [How to write a maths library in 2016](http://www.codersnotes.com/notes/maths-lib-2016/) inspired the initial `Vec3A`
  implementation
* [Realtime Math](https://github.com/nfrechette/rtm) - header only C++11 with SSE and NEON SIMD intrinsic support
* [DirectXMath](https://docs.microsoft.com/en-us/windows/desktop/dxmath/directxmath-portal) - header only SIMD C++ linear algebra library for use in games
  and graphics apps
* `glam` is a play on the name of the popular C++ library [GLM](https://glm.g-truc.net)


## License

Licensed under either of

* Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE)
  or http://www.apache.org/licenses/LICENSE-2.0)
* MIT license ([LICENSE-MIT](LICENSE-MIT)
  or http://opensource.org/licenses/MIT)

at your option.


## Contribution

Contributions in any form (issues, pull requests, etc.) to this project must
adhere to Rust's [Code of Conduct](https://www.rust-lang.org/en-US/conduct.html) and NPM's [Code of Conduct](https://docs.npmjs.com/policies/conduct).

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.

If you are interested in contributing or have a request or suggestion
[start a discussion] on GitHub. See [CONTRIBUTING.md] (TBA) for more information for
contributors.

Most code in `glam-js` is generated, see the [codegen README] (TBA) for details.


## Attribution

`glam` contains code ported from the following C++ libraries:

* [DirectXMath](https://docs.microsoft.com/en-us/windows/desktop/dxmath/directxmath-portal) - MIT License - Copyright (c) 2011-2020 Microsoft Corp
* [Realtime Math](https://github.com/nfrechette/rtm) - MIT License - Copyright (c) 2018 Nicholas Frechette
* [GLM](https://glm.g-truc.net) - MIT License - Copyright (c) 2005 - G-Truc Creation

See [ATTRIBUTION.md] for details.
