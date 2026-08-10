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
- Supported verification runtime: **Node.js 24 only**, as declared by `.nvmrc`.
  Results from other Node.js major versions are out of scope.
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
4Q types. Changing the machine type to DFIM updates icons but does not update
the converter options or selected value. The selected converter is consequently
rejected until the user manually chooses a supported type.

Proposed resolution: when DFIM is selected, restrict converter options to the
supported set and replace an invalid current selection with a valid default.

Status: **Resolved in working tree; invalid selections are replaced and options
restricted**

#### 4. DFIM cable voltage drop uses a different length from losses and price

`src/model/cable-sizing.ts` calculates voltage drop before multiplying DFIM
cable length by `1.33`. Price and losses use the adjusted length, while voltage
drop uses the original length.

Proposed resolution: calculate one effective length before calculating any
derived cable properties.

Status: **Resolved in working tree; one effective length now drives all
calculations**

#### 5. Existing saved wind systems have no migration path

The wind model replaces entered blade speed and torque with rotor diameter and
rated wind speed. Previously saved systems do not contain the new input fields,
which may produce `NaN` values during recalculation.

Proposed resolution: introduce persisted-system schema versioning and a
migration, or temporarily support both representations.

Status: **Resolved in working tree; legacy speed and power are preserved by
migration**

#### 6. Direct-drive wind models expose a DFIM option that cannot produce a candidate

DFIM candidates require at least 1,000 rpm, while direct-drive turbine speed is
far below that range. The UI nevertheless exposes DFIM in wind systems without a
gearbox.

Proposed resolution: restrict DFIM to appropriate gearbox topologies, or define
and validate a direct-drive DFIM model.

Status: **Resolved in working tree; DFIM is offered only in gearbox wind
models**

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
is correct depends on which physical path each modeled component represents. The
implementation also uses `any` and truthiness-based fallbacks.

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
- A DFIM icon branch exists for a 2Q converter that the candidate filter
  rejects.
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

## DFIM engineering review

Review date: 2026-08-10

### Reference-backed design basis

Primary references reviewed:

- NREL, _Doubly Fed Induction Generator_ (`NREL/CP-5500-55573`): converter power
  is proportional to slip and stator power; converter size is determined by the
  permitted maximum slip.
- NREL, _Short-Circuit Modeling of a Wind Power Plant_ (`NREL/CP-550-47193`): a
  speed range corresponding to approximately `+/-0.3` slip permits a partial
  converter rating of approximately 30% of generator rating.
- IEEE Transactions on Industrial Electronics, DOI `10.1109/TIE.2012.2226417`:
  DFIG converters are commonly rated at 25–30% and require additional
  consideration for low-voltage ride-through currents.

The one-third converter-power approximation is therefore acceptable as a
declared nominal design assumption, provided it is explicitly tied to a `+/-30%`
slip envelope. It must not be interpreted as meaning that every rotor voltage
and current is 30% of its stator equivalent.

### Confirmed modeling problems

#### A. The DFIM slip envelope is not modeled

Candidate selection inherits the generic machine limits: maximum speed is 120%
of synchronous speed and the lower candidate bound permits operation down to 50%
of synchronous speed. This does not match the 30% converter assumption, which
implies an approximate 70–130% synchronous-speed envelope.

Recommended correction:

- introduce a named `DFIM_MAX_SLIP = 0.3`;
- use it for both lower and upper DFIM speed constraints; and
- derive the converter power fraction from the same constant.

Status: **Confirmed correction required**

#### B. Grid-side and rotor-side filter currents are conflated

The converter candidate is selected using 30% of the machine working current,
but both filters are constructed using 100% of machine current. For a simplified
30% slip-power model:

- the grid-side converter/filter operates at grid voltage and approximately 30%
  of rated power/current;
- the rotor-side converter/filter operates at slip voltage and can carry a rotor
  current comparable, after turns-ratio referral, to machine current.

Using one voltage/current pair for both sides cannot represent both correctly.

Recommended correction: pass distinct grid-side and rotor-side electrical
ratings into filter selection. As a minimum approximation, use 30% current for
the grid-side filter and full referred current for the machine-side filter, and
document that rotor voltage is not explicitly modeled.

Status: **Confirmed correction required; rotor-voltage approximation must be
documented**

#### C. The cable multiplier is applied to electrical quantities incorrectly

The added textbook says the `1.33` cable multiplier represents combined stator
and rotor cable cost and weight. The code also applies it to voltage drop and
losses. That is not physically equivalent:

- stator voltage drop is based on the physical stator cable length;
- rotor voltage drop belongs to a separate lower-voltage circuit;
- if rotor current is approximated as 30%, its resistive loss contribution is
  proportional to `0.3^2`, not `0.3`.

Recommended correction: retain `1.33` only for the approximated installed cable
quantity, price, weight, and volume. Keep stator voltage drop based on physical
length. Either model rotor losses separately or document and use an explicit
loss multiplier such as `1 + 0.3^2` under the equal-resistance approximation.

Status: **Confirmed correction required**

#### D. DFIM efficiency at 25% load is inconsistent

DFIM has a dedicated partial-load curve at 50% and 75%, but at 25% it receives
the SCIM constant (`0.931 * efficiency100`) instead of the DFIM curve. The DFIM
curve evaluated at 25% gives a materially different result.

Recommended correction: use the same typed partial-efficiency function at 25%,
50%, and 75% load.

Status: **Confirmed correction required**

#### E. MATLAB base resistance contains a factor-of-three inconsistency

The MATLAB script calculates line current as `P / (sqrt(3) * V)` but calculates
three-phase base impedance as `V^2 / P / 3`. With line-to-line voltage and total
three-phase power, the conventional base impedance is `V^2 / P`; the extra
division by three makes every exported per-unit resistance and reactance three
times too large.

Recommended correction: confirm the Simulink block's expected base convention,
then change `Rbase` to `Vm * Vm / Pm` if it uses conventional three-phase
per-unit bases.

Status: **Likely defect; verify against the Simulink block before changing**

#### F. Converter floor oversizing was changed globally

The PR changes the generic floor-mounted converter oversizing ceiling from two
times to four times rated current. This is not conditional on DFIM and can
therefore alter converter selection for every existing topology. No DFIM
engineering requirement or source was found for this global change.

Recommended correction: restore the existing two-times ceiling for generic
converter selection. Following the integration decision, retain the PR's
four-times ceiling as an explicit DFIM-only rule with focused regression tests.
Its engineering basis remains to be documented.

Status: **Implemented: two times generally, four times only for DFIM**

### Acceptable approximations with limitations

#### Fixed 30% converter rating

Acceptable for a conceptual/catalog sizing tool if the design is explicitly a
`+/-30%` slip machine. It should be a named parameter shared by speed and power
calculations, not repeated literals.

#### Rated system efficiency split

At a fixed 70/30 power split, `0.7 + 0.3 * converterEfficiency` is a reasonable
rated-point approximation for the two parallel power paths. It is not generally
valid at every partial-load point because slip power varies with operating
speed. Partial-load results should either derive the split from slip or be
labelled as an approximation.

#### Four-quadrant converters

Restricting DFIM to 4Q converter types is consistent with bidirectional rotor
power flow in sub-synchronous and super-synchronous operation.

### Unsubstantiated coefficients

The PR provides no cited basis for the following DFIM constants:

- machine efficiency coefficients (`0.943`, `0.941`, and partial-load terms);
- power factor `0.9`;
- weight factor `1.5`;
- price factor `1.05`;
- torque overload `2.4`;
- cable installed-quantity factor `1.33`; and
- estimated machine resistance and inductance values for MATLAB.

These may be thesis assumptions, but each should be linked to a thesis section,
manufacturer data, or calibration case before being treated as validated
engineering output.

### Required DFIM reference tests

Add at least one 1–3 MW reference system with a documented synchronous speed and
verify:

- accepted mechanical speed range is 70–130% of synchronous speed;
- converter rated power is approximately 30% of machine power;
- grid-side and rotor-side filter ratings use their intended currents;
- cable price and electrical losses use separate assumptions;
- rated and partial-load system efficiencies match hand calculations; and
- exported per-unit MATLAB parameters match the Simulink base convention.

### Proposed implementation scope

The corrections must be scoped so that adding DFIM does not change results for
existing machine types and topologies.

#### DFIM-only behavior changes

1. Define one named `DFIM_MAX_SLIP = 0.3` engineering assumption. Derive both
   the DFIM converter power fraction and the DFIM 70–130% synchronous-speed
   envelope from it. Other machine speed rules remain unchanged.
2. Give DFIM grid-side and rotor-side filters separate electrical ratings. Use
   approximately 30% current for the grid side and full referred current for the
   rotor side as the initial approximation. Document that rotor voltage is not
   modeled explicitly. Existing full-converter filter sizing remains unchanged.
3. Apply the DFIM `1.33` cable factor only to installed quantity, price, weight,
   and volume. Use physical stator length for voltage drop. Model rotor loss
   separately or, until that is possible, use and clearly name the equal-
   resistance approximation `1 + DFIM_MAX_SLIP^2 = 1.09`. Non-DFIM cable
   calculations remain unchanged.
4. Use the DFIM partial-load efficiency curve consistently at 25%, 50%, and 75%
   load. Do not change SCIM, PMSM, or SynRM efficiency curves.
5. Keep the fixed 70/30 rated-efficiency split as a declared DFIM-only
   approximation. A future slip-derived partial-load split is an enhancement,
   not required for the initial integration.

#### Shared-code changes that must preserve non-DFIM behavior

6. Filter- and converter-sizing APIs may need shared structural changes to pass
   separate side ratings, but all non-DFIM inputs and outputs must remain
   identical. Add regression tests to enforce this.
7. Restore the generic floor-converter oversizing ceiling from the PR's four
   times value to the pre-PR two times value. Retain four times only when the
   machine type is DFIM. This preserves existing behavior while isolating the
   new rule; its engineering basis still needs evidence.
8. Remove the new converter-sizing debug log. This is global cleanup with no
   engineering effect.

#### Deferred pending verification

9. Verify the Simulink block's per-unit base convention before removing `/ 3`
   from MATLAB `Rbase`. This export correction would be DFIM-specific because
   the script is DFIM-specific, but it must not be made from convention alone.
10. Keep the PR's DFIM price, weight, power-factor, overload, efficiency, and
    exported equivalent-circuit coefficients unchanged until their thesis or
    manufacturer sources are found. Record them as assumptions rather than
    validated values.

#### Verification boundary

Add a hand-calculated 1–3 MW DFIM reference case covering speed, converter,
filters, cable, efficiency, and export. In parallel, snapshot representative
existing non-DFIM systems before corrections and assert that their candidates,
prices, losses, voltage drops, and efficiencies do not change. The only global
numeric difference expected is restoration of converter selection where the PR's
unintended four-times ceiling had changed a result.

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

| Date       | Decision                                                          | Rationale / evidence                                                                                                 | Status   |
| ---------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------- |
| 2026-08-10 | Keep current dependency versions rather than PR #78's versions    | The dependency work is newer and independent of the feature                                                          | Proposed |
| 2026-08-10 | Do not merge PR #78 unchanged                                     | Static review found correctness defects and unvalidated shared-model changes                                         | Proposed |
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
- Created `integrate/pr-78` and imported `origin/StianMasterThesis` with a
  merge.
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

### 2026-08-10 — DFIM engineering review

- Confirmed that a 30% converter rating is a defensible approximation when it is
  tied to a `+/-30%` slip range.
- Found that machine selection does not enforce that slip range.
- Found that grid-side and rotor-side filter ratings are represented by one
  conflated current/voltage model.
- Superseded the earlier cable effective-length correction: `1.33` is an
  installed-quantity approximation and must not be applied identically to
  voltage drop and resistive loss.
- Found an inconsistent DFIM efficiency calculation at 25% load.
- Identified a likely factor-of-three error in the MATLAB per-unit base
  resistance, pending verification of the Simulink block convention.
- Found a global converter oversizing change that can affect non-DFIM topologies
  and should be restored or isolated behind a documented DFIM rule.
- No engineering behavior was changed during this review.

### 2026-08-10 — DFIM-only converter oversizing

- Restored the original two-times floor-converter oversizing ceiling for all
  existing machine types and for calls without a selected machine type.
- Retained the four-times ceiling only when the machine type is explicitly DFIM.
- Preserved the existing behavior for wall-mounted converters, which are not
  governed by the floor oversizing ceiling.
- Removed the converter-sizing debug log.
- Added boundary tests for DFIM, SCIM, PMSM, an unspecified machine type, and
  wall mounting.
- TypeScript compilation passes under Node.js 24. The automated agent shell
  could not start Jest because its Next.js adapter received unparsable
  TypeScript `--showConfig` output, although `npm run build` succeeds in the
  maintainer's Node.js 24 terminal. Treat this as a session-specific
  verification limitation, not a repository or test failure.

## Notes for future sessions

- Start by reading this document and checking the current branch and working
  tree.
- Run all project commands under Node.js 24 (`nvm use`); do not use results from
  another Node.js major version as integration evidence.
- Update statuses rather than deleting historical findings.
- Add links to commits or tests as findings are resolved.
- Keep engineering assumptions separate from confirmed software defects.
- Do not resolve uncertain engineering behavior solely to make tests pass.
