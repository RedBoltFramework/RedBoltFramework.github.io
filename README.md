# RedBoltFramework.github.io

Landing page and deployed WebAssembly samples for the RedBolt framework.

Run `../monorepo.cs publish-samples --build` from the monorepo helper to build one unified WebAssembly bundle, replace `samples/` with fresh Release output, and refresh `catalog.json`. Add `--build-config Debug` for a local pass.

The `Publish Pages` workflow performs the same full Release publish and deploys the result as a GitHub Pages artifact, so generated sample binaries do not need to remain in the repository indefinitely.
