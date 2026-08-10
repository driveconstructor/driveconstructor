# PR #78 Integration Working Document

This document tracks the review and integration of
[PR #78: Stians Master Changes](https://github.com/driveconstructor/driveconstructor/pull/78).
It is intended to remain useful across multiple working sessions. Update the
status, decisions, findings, and session log as the integration progresses.

## Objective

Integrate Stian's DFIM and wind-power work into the current `main` branch while:

- preserving current dependency and framework upgrades;
- preventing regressions in existing drive-system calculations;
- validating the new engineering assumptions;
- adding appropriate automated coverage; and
- keeping the resulting history reviewable.

## Current status

- Integration state: **Imported on integration branch; correcting and testing**
- Source PR: `driveconstructor/driveconstructor#78`
- Source branch: `StianMasterThesis`
- Source commit: `d19dd3423ded9adbdb67706068235056a27a4366`
- Base branch: `main`
- PR state observed on 2026-08-10: conflicting, with no reviews or CI results
- Integration branch: `integrate/pr-78`
- Conflict files retained from `main`: `package.json`, `package-lock.json`, and
  `next-env.d.ts`

## PR inventory

The PR is a single large commit containing:

- 130 changed files;
- 2,057 additions and 336 deletions;
- DFIM electric-machine support;
- DFIM converter selection and sizing;
- revised wind-turbine inputs and calculations;
- CSV, MATLAB, and Simulink export;
- new DFIM SVG, PNG, MATLAB, and Simulink assets;
- expanded gearbox torque ranges;
- textbook restructuring and image relocation; and
- unrelated dependency updates.

Most of the file count comes from moving existing textbook images. The
application changes are smaller but affect shared sizing and pricing logic.

## Known merge conflicts

The following files conflict with the current `main` branch:

- `next-env.d.ts`
- `package.json`
- `package-lock.json`

Planned resolution:

- Keep the dependency versions from the updated `main` branch.
- Discard the dependency changes from PR #78.
- Regenerate `package-lock.json`; do not merge it manually.
- Keep or regenerate the `next-env.d.ts` form required by the current Next.js
  version.

## Confirmed correctness findings

These findings are based on a static review of source commit
`d19dd3423ded9adbdb67706068235056a27a4366`.

### Blockers

#### 1. Existing machine pricing changes unintentionally

`src/model/emachine-sizing.ts` applies the efficiency-class price premium only
to SCIM machines. Previously it applied to all machine types. This silently
changes PMSM and SyRM prices and is not inherently related to adding DFIM.

Proposed resolution: restore existing behavior for current machine types and
introduce an explicit DFIM rule if its pricing differs.

Status: **Resolved in working tree; existing behavior restored**

#### 2. Cooling price coefficients contradict their documentation

The IC411/IP54 and IC416/IP54 `K14` values are swapped relative to both `main`
and the comments immediately above the function. This changes existing machine
prices.

Proposed resolution: restore the old values unless an engineering source
supports changing both the values and documentation.

Status: **Resolved in working tree; documented coefficients restored**

#### 3. Selecting DFIM initially produces no converter candidates

The default converter is a 2Q type, while the DFIM candidate filter accepts only
4Q types. Changing the machine type to DFIM updates icons but does not update the
converter options or selected value. The selected converter is consequently
rejected until the user manually chooses a supported type.

Proposed resolution: when DFIM is selected, restrict converter options to the
supported set and replace an invalid current selection with a valid default.

Status: **Resolved in working tree; invalid selections are replaced and options restricted**

#### 4. DFIM cable voltage drop uses a different length from losses and price

`src/model/cable-sizing.ts` calculates voltage drop before multiplying DFIM
cable length by `1.33`. Price and losses use the adjusted length, while voltage
drop uses the original length.

Proposed resolution: calculate one effective length before calculating any
derived cable properties.

Status: **Resolved in working tree; one effective length now drives all calculations**

#### 5. Existing saved wind systems have no migration path

The wind model replaces entered blade speed and torque with rotor diameter and
rated wind speed. Previously saved systems do not contain the new input fields,
which may produce `NaN` values during recalculation.

Proposed resolution: introduce persisted-system schema versioning and a
migration, or temporarily support both representations.

Status: **Resolved in working tree; legacy speed and power are preserved by migration**

#### 6. Direct-drive wind models expose a DFIM option that cannot produce a candidate

DFIM candidates require at least 1,000 rpm, while direct-drive turbine speed is
far below that range. The UI nevertheless exposes DFIM in wind systems without
a gearbox.

Proposed resolution: restrict DFIM to appropriate gearbox topologies, or define
and validate a direct-drive DFIM model.

Status: **Resolved in working tree; DFIM is offered only in gearbox wind models**

#### 7. DFIM converter and filter currents are inconsistent

The converter is selected using 30% of machine current, but machine-side and
grid-side filters are sized using 100% of machine current. This can make filter
price, weight, volume, and losses inconsistent with the converter model.

Proposed resolution: model stator, rotor, and grid-side currents explicitly and
use the appropriate current for each component.

Status: **Open**

### Other functional findings

#### 8. The 30% converter factor is hard-coded

The converter sizing assumes that the rotor converter always carries 30% of
machine current. It does not derive that fraction from maximum slip, operating
speed, reactive-power requirements, or topology.

Status: **Requires engineering validation**

#### 9. DFIM system efficiency uses an implicit two-path approximation

The implementation uses `0.7 + 0.3 * converterEfficiency`, then multiplies that
by the full machine, cable, gearbox, and transformer efficiencies. Whether this
is correct depends on which physical path each modeled component represents.
The implementation also uses `any` and truthiness-based fallbacks.

Status: **Requires engineering validation and refactoring**

#### 10. Direct-drive MATLAB export writes an invalid gearbox ratio

When a system has no gearbox, the exported CSV contains `undefined` as the
gearbox ratio.

Proposed resolution: export `1` for direct drive or omit the field according to
the MATLAB input contract.

Status: **Open**

#### 11. Export naming does not match its interface

The export accepts a system filename and constructs a system-name row, but the
row is unused and the file is always named `Parameters.csv`.

Status: **Open**

#### 12. Multiple automatic downloads may be unreliable

One click creates a CSV download and then starts asynchronous MATLAB and
Simulink downloads. Browsers may block later downloads because they no longer
occur directly within the user gesture. Fetch responses are not checked with
`response.ok`, so an error page could be saved with a MATLAB filename.

Proposed resolution: provide explicit download controls or package the files
together, and validate HTTP responses.

Status: **Open**

### Cleanup findings

- The DFIM converter option list contains `4Q-2L-VSC` twice.
- A DFIM icon branch exists for a 2Q converter that the candidate filter rejects.
- A debug `console.log` remains in converter sizing.
- `emachine-utils.ts` imports `log` from `console` but does not use it.
- Commented-out code and imports remain throughout the changes.
- DFIM partial-efficiency behavior is special at 50% and 75% load, while 25%
  load uses a separate inherited constant.
- The machine weight coefficient for IP21/23 changes from `0.8` to `0.9` for all
  machine types without an explanation.
- No automated tests were added for the new behavior.

## Engineering questions

The following questions require a documented source or confirmation from a
domain expert:

1. What maximum positive and negative slip range should DFIM support?
2. Should converter rating be derived directly from maximum slip?
3. Which current should size the rotor-side converter and each filter?
4. Does the modeled cable represent the stator path, rotor path, or both?
5. Is a fixed 70/30 power split appropriate at every operating point?
6. What are the sources for the new DFIM efficiency, weight, price, and power
   factor coefficients?
7. Are the resistance and inductance approximations exported to MATLAB valid
   over the full 1–7 MW range?
8. Should DFIM be available only for wind systems with a gearbox?
9. What should the MATLAB contract contain for direct-drive systems?
10. Are `Cp = 0.45` and `TSR = 7` fixed design assumptions or user inputs?

Record answers and sources in the decision log below.

## Proposed integration stages

### Stage 1: Establish a clean base

- Finish and commit the dependency update independently.
- Verify unit tests, production build, and E2E tests on that commit.
- Create an integration branch from the verified `main` branch.

Status: **Complete**

### Stage 2: Import assets and textbook changes

- Import image relocations separately from application logic.
- Verify all MDX routes and image references.
- Review newly added images and their attribution/licensing where applicable.

Status: **Imported; link and content review pending**

### Stage 3: Introduce the DFIM domain model

- Add the DFIM type, icons, and topology presentation.
- Define explicit stator/rotor/grid-side quantities.
- Restrict DFIM availability to supported system topologies.
- Preserve existing-machine behavior with regression tests.

Status: **In progress**

### Stage 4: Add DFIM sizing

- Implement machine candidate rules.
- Implement converter and filter sizing from documented slip/current rules.
- Implement cable and system-efficiency calculations from explicit power paths.
- Validate calculations against reference designs.

Status: **Pending**

### Stage 5: Integrate revised wind inputs

- Add rotor diameter and rated wind speed.
- Decide whether old speed/torque inputs remain supported.
- Implement migration for saved systems.
- Add formula and boundary tests.

Status: **Pending**

### Stage 6: Add MATLAB/Simulink export

- Define and document the export schema and units.
- Handle systems with and without gearboxes.
- Validate generated parameters against the MATLAB model.
- Implement reliable file delivery.

Status: **Pending**

### Stage 7: Final verification

- Run formatting checks without mixing broad formatting changes into logic
  commits.
- Run unit tests and production build.
- Run all existing E2E scenarios.
- Run new DFIM and wind scenarios.
- Manually verify reports, save/load behavior, downloads, and textbook pages.

Status: **Pending**

## Required automated coverage

- DFIM candidate generation for valid and invalid topologies.
- DFIM converter option customization and candidate selection.
- Converter and filter current sizing at slip boundaries.
- Cable voltage drop, losses, price, and effective length.
- DFIM efficiency at 25%, 50%, 75%, and 100% load.
- Known-reference wind power, speed, and torque calculations.
- Very large gearbox torque with graceful no-candidate behavior.
- Regression cases for SCIM, PMSM, and SyRM pricing and sizing.
- Migration of previously saved wind systems.
- CSV schema, units, filenames, and direct-drive handling.
- Successful and failed MATLAB/Simulink asset downloads.
- At least one complete DFIM Playwright workflow.

## Verification commands

Run the appropriate subset after each integration stage and the complete set
before merging:

```sh
npm ci
npm test
npm run build
npm run test:e2e
git diff --check
```

## Decision log

Add durable decisions here. Include the date, decision, rationale, source or
evidence, and participants when relevant.

| Date | Decision | Rationale / evidence | Status |
| --- | --- | --- | --- |
| 2026-08-10 | Keep current dependency versions rather than PR #78's versions | The dependency work is newer and independent of the feature | Proposed |
| 2026-08-10 | Do not merge PR #78 unchanged | Static review found correctness defects and unvalidated shared-model changes | Proposed |
| 2026-08-10 | Preserve the original wind inputs, defaults, and topology results | Stian's scope is adding DFIM, not changing existing topologies; rotor diameter and wind speed are derived for export | Accepted |

## Session log

### 2026-08-10 — Initial review

- Inspected PR metadata, commit, files, checks, and merge state.
- Identified the three conflicting files.
- Separated dependency conflicts from feature integration.
- Reviewed the changed machine, converter, cable, wind, system-efficiency, and
  export code.
- Recorded confirmed defects and engineering questions above.
- Attempted isolated TypeScript and Jest verification. The PR could not be
  reliably verified against the currently installed, newer dependency set;
  failures were toolchain/generated-source mismatches rather than useful model
  test results.
- No integration changes were made.

### 2026-08-10 — Initial import and correction batch

- Verified dependency-updated `main` with Node.js 24: 7 tests and the production
  build passed.
- Created `integrate/pr-78` and imported `origin/StianMasterThesis` with a merge.
- Retained the current `main` versions of `package.json`, `package-lock.json`,
  and `next-env.d.ts`; no PR dependency changes were accepted.
- Confirmed that the uncorrected imported source compiled with the current
  dependency set and passed the existing tests.
- Restored existing machine pricing, cooling-price coefficients, and the IP21/23
  weight coefficient to prevent non-DFIM regressions.
- Made DFIM converter options self-consistent and restricted DFIM to supported
  gearbox wind topologies.
- Corrected DFIM cable calculations to use one effective length.
- Added migration of persisted legacy wind inputs while preserving their blade
  speed and shaft power.
- Added four focused integration tests. Current result: 11 tests pass and the
  production build succeeds.
- Ran the 36-test Playwright suite. Thirty-three tests passed. The wind default
  scenario failed in both browsers because the PR defaults (`50 m`, `12 m/s`)
  produce about 32 rpm and no direct-drive machine candidate. One Firefox
  my-systems scenario also failed after the browser displayed its generic page
  load failure; this appears independent and needs a focused rerun.
- Confirmed that existing topology behavior is an explicit compatibility
  requirement. Restored the original wind speed/torque inputs and defaults,
  while retaining equivalent rotor diameter and rated wind speed as calculated
  advanced values for DFIM export. The focused wind E2E scenario now passes in
  Chromium and Firefox without changing its expectations.
- Left converter/filter current paths and the 70/30 efficiency model unresolved
  pending engineering validation.

## Notes for future sessions

- Start by reading this document and checking the current branch and working
  tree.
- Update statuses rather than deleting historical findings.
- Add links to commits or tests as findings are resolved.
- Keep engineering assumptions separate from confirmed software defects.
- Do not resolve uncertain engineering behavior solely to make tests pass.
