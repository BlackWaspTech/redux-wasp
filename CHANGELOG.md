# Changelog

## v0.2.2 beta

- Fixed accidental usage of ES6 syntax
- Updated dev packages
  - Skipped updating `jest-fetch-mock` due to its newest update breaking our tests
- Removed Node v6 build from Travis CI for now; not sure why our integration tests have started to break there, but we're working on a different strategy for integration testing anyway
- Added Github templates
- Minor update to Jest settings (now ignoring node_modules code path)
- Minor update to Travis build (now caches node_modules)
- Added slight clarification to LICENSE (still MIT)

## v0.2.1 beta

- Hotfix; previous version was published without a necessary `pre-release` update
- Updated docs & tests

## v0.2.0 beta

- Significant revision of the API
- Imports from `wasp-graphql` package as opposed to internal code
- Disabled `subscription`; waiting on further testing

## v0.1.0 beta

MVP Release

---

View our [Contributing Guide](CONTRIBUTING.md)

Return to [README](README.md)
