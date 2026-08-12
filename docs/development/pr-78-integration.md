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

Status: **Resolved in working tree; existing behavior is retained for SCIM,
PMSM, and SyRM, while DFIM retains Stian's base-price rule without the
efficiency-class premium**

#### 2. Cooling price coefficients contradict their documentation

The IC411/IP54 and IC416/IP54 `K14` values are swapped relative to both `main`
and the comments immediately above the function. This changes existing machine
prices.

Proposed resolution: restore the old values unless an engineering source
supports changing both the values and documentation.

Status: **Resolved in working tree; documented coefficients are retained for
existing machine types, while Stian's IC411/IP54 and IC416/IP54 coefficients are
scoped to DFIM**

#### 3. Selecting DFIM initially produces no converter candidates

The default converter is a 2Q type, while the DFIM candidate filter accepts only
4Q types. Changing the machine type to DFIM updates icons but does not update
the converter options or selected value. The selected converter is consequently
rejected until the user manually chooses a supported type.

Proposed resolution: when DFIM is selected, restrict converter options to the
supported set and replace an invalid current selection with a valid default.

Status: **Resolved in working tree; invalid selections are replaced and options
restricted**

#### 4. DFIM cable quantity is conflated with electrical cable length

The imported implementation applies the `1.33` installed-quantity factor
inconsistently and treats installed quantity as equivalent to electrical length.

Final resolution: use physical stator length for voltage drop, `1.33` for
installed quantity and price, and the explicit equal-resistance loss
approximation `1 + 0.3^2 = 1.09`. Cable weight and volume are not calculated by
the current cable model.

Status: **Resolved in working tree and documented**

#### 5. Existing saved wind systems have no migration path

The wind model replaces entered blade speed and torque with rotor diameter and
rated wind speed. Previously saved systems do not contain the new input fields,
which may produce `NaN` values during recalculation.

Final resolution: preserve the existing speed and torque inputs and make rotor
diameter and rated wind speed additive calculated fields. Compatibility with
pre-integration saved-system formats is explicitly out of scope, so no
topology-specific load migration is required.

Status: **Resolved by retaining the existing input model; migration removed**

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

Status: **Resolved in working tree; the grid-side filter uses 30% current and
the rotor-side filter retains full referred machine current. Rotor voltage
remains an explicitly documented approximation.**

### Other functional findings

#### 8. The 30% converter factor is hard-coded

The converter sizing assumes that the rotor converter always carries 30% of
machine current. It does not derive that fraction from maximum slip, operating
speed, reactive-power requirements, or topology.

Status: **Resolved in working tree; `DFIM_MAX_SLIP = 0.3` is the shared source
for converter power fraction and the 70–130% synchronous-speed envelope.**

#### 9. DFIM system efficiency uses an implicit two-path approximation

The implementation uses `0.7 + 0.3 * converterEfficiency`, then multiplies that
by the full machine, cable, gearbox, and transformer efficiencies. Whether this
is correct depends on which physical path each modeled component represents. The
implementation also uses `any` and truthiness-based fallbacks.

Status: **Resolved as a documented DFIM-only rated-point approximation; typed
efficiency access replaced `any` and truthiness fallbacks. A slip-derived
partial-load split remains a future refinement.**

#### 10. Direct-drive MATLAB export writes an invalid gearbox ratio

When a system has no gearbox, the exported CSV contains `undefined` as the
gearbox ratio.

Proposed resolution: export `1` for direct drive or omit the field according to
the MATLAB input contract.

Status: **Resolved in working tree; direct drive exports a ratio of `1`.**

#### 11. Export naming does not match its interface

The export accepts a system filename and constructs a system-name row, but the
row is unused and the file is always named `Parameters.csv`.

Status: **Resolved in working tree; the unused filename argument and dead
system-name row were removed. `Parameters.csv` remains the explicit MATLAB
contract.**

#### 12. Multiple automatic downloads may be unreliable

One click creates a CSV download and then starts asynchronous MATLAB and
Simulink downloads. Browsers may block later downloads because they no longer
occur directly within the user gesture. Fetch responses are not checked with
`response.ok`, so an error page could be saved with a MATLAB filename.

Proposed resolution: provide explicit download controls or package the files
together, and validate HTTP responses.

Status: **Resolved in working tree; parameters, MATLAB script, and Simulink
model now have separate user-initiated controls, and fetched responses are
validated before download.**

### Cleanup findings

- The duplicate DFIM converter option was removed.
- Unsupported DFIM converter icon branches were removed or made unreachable by
  the supported converter list.
- PR debug logs, unused imports, and obsolete commented code were removed from
  the touched sizing paths.
- DFIM now uses its partial-efficiency curve consistently at 25%, 50%, and 75%.
- The pre-PR IP21/23 coefficient was restored.
- Focused model and documentation regression tests were added.

Status: **Resolved**

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

Status: **Resolved in working tree and covered by boundary tests**

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

Status: **Resolved in working tree; rotor-voltage limitation documented**

#### C. The cable multiplier is applied to electrical quantities incorrectly

The added textbook says the `1.33` cable multiplier represents combined stator
and rotor cable cost and weight. The code also applies it to voltage drop and
losses. That is not physically equivalent:

- stator voltage drop is based on the physical stator cable length;
- rotor voltage drop belongs to a separate lower-voltage circuit;
- if rotor current is approximated as 30%, its resistive loss contribution is
  proportional to `0.3^2`, not `0.3`.

Recommended correction: retain `1.33` only for the approximated installed cable
quantity and price. Keep stator voltage drop based on physical length. Either
model rotor losses separately or document and use an explicit loss multiplier
such as `1 + 0.3^2` under the equal-resistance approximation. Weight and volume
can use installed quantity if those cable properties are introduced later.

Status: **Resolved in working tree and documented in the cable chapter**

#### D. DFIM efficiency at 25% load is inconsistent

DFIM has a dedicated partial-load curve at 50% and 75%, but at 25% it receives
the SCIM constant (`0.931 * efficiency100`) instead of the DFIM curve. The DFIM
curve evaluated at 25% gives a materially different result.

Recommended correction: use the same typed partial-efficiency function at 25%,
50%, and 75% load.

Status: **Resolved in working tree with a PMSM compatibility regression test**

#### E. MATLAB base resistance contains a factor-of-three inconsistency

The MATLAB script calculates line current as `P / (sqrt(3) * V)` but calculates
three-phase base impedance as `V^2 / P / 3`. With line-to-line voltage and total
three-phase power, the conventional base impedance is `V^2 / P`; the extra
division by three makes every exported per-unit resistance and reactance three
times too large.

Recommended correction: confirm the Simulink block's expected base convention,
then change `Rbase` to `Vm * Vm / Pm` if it uses conventional three-phase
per-unit bases.

Status: **Resolved in working tree using the conventional line-to-line voltage
and total three-phase power base, `Rbase = Vm^2 / Pm`**

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
3. Apply the DFIM `1.33` cable factor only to installed quantity and price. Use
   physical stator length for voltage drop. Model rotor loss separately or,
   until that is possible, use and clearly name the equal-resistance
   approximation `1 + DFIM_MAX_SLIP^2 = 1.09`. Non-DFIM cable calculations
   remain unchanged.
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

## MATLAB and Simulink expert-review observations

Review date: 2026-08-11

This section records a static inspection of `dfim_vindturbin_script.m`, the
generated `Parameters.csv` contract, and the unpacked contents of
`DFIM_vindturbin_model.slx`. MATLAB is not installed in the integration
environment, so the model has not been loaded or simulated. These observations
are questions for Stian and the domain experts; no code or model changes were
made as part of this review.

### Overall model structure

The Simulink model has the expected high-level structure for a wind turbine
using a doubly-fed induction machine as a generator: turbine input,
gearbox-referred inertia, wound-rotor machine, rotor-side and grid-side
converters, DC link, transformer, grid connection, controls, and measurements.
The use of "DFIG" in the MathWorks block description is compatible with the
application's "DFIM" machine terminology: DFIM describes the machine, while DFIG
describes its generator operation.

The model was saved with MATLAB/Simulink R2024b and uses Specialized Power
Systems/Simscape Electrical blocks. The required MATLAB release, products, and
any compatibility expectations should be documented for users.

### Likely CSV import defect

The application exports fifteen headerless `name,value` rows, while the MATLAB
script calls `readtable('Parameters.csv')` without explicitly setting
`ReadVariableNames=false` and then accesses `Var2` by row number. MATLAB may
interpret the first row (`R_s,...`) as column headings. Depending on import
detection, this can remove the first parameter from the data, make `Var2`
unavailable, shift all assignments, or leave only fourteen data rows for the
fifteen accesses.

This should be reproduced in the supported MATLAB release before validation. The
preferred eventual contract is an explicit header such as `Name,Value,Unit`,
with parameters retrieved and validated by name. The minimum possible correction
would be an explicit headerless import, but that would retain the fragile
dependence on row order.

### Units and parameter contract

The exported `L_s`, `L_r`, and `L_m` formulas produce quantities dimensionally
equivalent to impedance/reactance in ohms. The MATLAB script divides them by
`Rbase`, while the Simulink mask calls the resulting inputs per-unit leakage and
magnetizing inductances. This may be numerically intentional under the selected
per-unit convention, but the names and units are ambiguous.

The experts should decide whether the export represents:

- reactances at 50 Hz, which should be named and documented accordingly; or
- physical inductances in henries, which should be converted using angular
  frequency and base impedance.

The schema should eventually state a unit for every value, include a version,
and reject missing, duplicated, nonfinite, or physically invalid parameters.

### Engineering formulas requiring confirmation

The following assumptions are structurally plausible but lack an adjacent
source, derivation, calibration case, or applicability range:

- the 1% copper-loss assumption and equal split between stator and rotor;
- leakage and magnetizing coefficients used to estimate the machine model;
- the `1.634` DC-link-voltage multiplier;
- aerodynamic constants `Cp = 0.4` and air density `1.225 kg/m^3` in the MATLAB
  cut-in calculation;
- the empirical cut-out wind-speed formula;
- the turbine-inertia scaling formula;
- fixed machine friction `0.01 pu`;
- fixed transformer resistance/reactance `[0.002, 0.08] pu`;
- the `0.3 pu` converter rating, coupling inductor, DC capacitor, and fixed
  controller gains embedded in the model.

In particular, the cut-in wind-speed expression treats rated system losses,
`(1 - efficiency) * Pm`, as the power threshold defining cut-in speed. The
experts should confirm that this is the intended physical model rather than
exporting a turbine cut-in speed directly.

The inertia expression correctly appears to refer turbine inertia through the
square of the gearbox ratio to the generator shaft. However, its inertia
constant uses shaft power `Pw` as the denominator while the electrical machine
uses rated power `Pm` as its nominal base. The intended power base for `H`
requires confirmation.

### Workflow and maintainability observations

- `Parameters.csv` is resolved from MATLAB's current working directory, so the
  workflow can fail when the three browser downloads are stored or opened from
  different locations.
- The MATLAB script uses `clear`, `clc`, and the base workspace, and prints the
  imported table. A future loader function returning a parameter structure, or a
  `Simulink.SimulationInput`, would be safer and testable.
- The script only loads parameters; it does not locate, open, configure, or run
  the Simulink model. The expected user sequence should be documented.
- The model display labels `Te [kN]` and `Q [kW]` appear dimensionally wrong.
  Given their signals and scaling, they likely should be `Te [kNm]` and
  `Q [kvar]`, respectively.
- The model's origin and any derivation from a MathWorks example should be
  recorded so attribution and redistribution terms can be checked.

### Suggested expert validation sequence

1. Reproduce the CSV import using an actual browser export and MATLAB R2024b.
2. Confirm every exported quantity's meaning, unit, and per-unit base.
3. Confirm the cut-in-speed and inertia-constant derivations.
4. Identify sources or calibration cases for the embedded empirical constants
   and controller settings.
5. Simulate representative DFIM systems from both supported application
   topologies and compare steady-state power, speed, torque, DC voltage,
   reactive power, and startup behavior with hand calculations or trusted
   references.
6. Confirm the MATLAB/Simulink product requirements, model provenance, and
   corrected display units.

Status: **Awaiting review by Stian and domain experts; code and model assets are
unchanged**

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

Status: **Functionally complete; canonical directory routes and navigation are
working, all local links/assets were checked, and five affected chapters render
in Chromium and Firefox. The former flat `index_*` URLs do not require backward
compatibility. An asset-provenance audit found that all new files originate in
Stian's authored PR commit, but the raster diagrams contain no source/license
metadata; their originality or reuse permission still requires confirmation from
the contributor.**

### Stage 3: Introduce the DFIM domain model

- Add the DFIM type, icons, and topology presentation.
- Define explicit stator/rotor/grid-side quantities.
- Restrict DFIM availability to supported system topologies.
- Preserve existing-machine behavior with regression tests.

Status: **Complete**

### Stage 4: Add DFIM sizing

- Implement machine candidate rules.
- Implement converter and filter sizing from documented slip/current rules.
- Implement cable and system-efficiency calculations from explicit power paths.
- Validate calculations against reference designs.

Status: **Implemented; coefficient provenance and a manufacturer-calibrated
reference design remain validation follow-ups**

### Stage 5: Integrate revised wind inputs

- Add rotor diameter and rated wind speed.
- Decide whether old speed/torque inputs remain supported.
- Decide whether migration of previously saved systems is required.
- Add formula and boundary tests.

Status: **Complete; existing speed/torque behavior is preserved, derived wind
dimensions are additive, and legacy saved-format compatibility is out of scope**

### Stage 6: Add MATLAB/Simulink export

- Define and document the export schema and units.
- Handle systems with and without gearboxes.
- Validate generated parameters against the MATLAB model.
- Implement reliable file delivery.

Status: **Implemented; schema, units, and Simulink numerical validation remain
follow-ups requiring the external model/tool**

### Stage 7: Final verification

- Run formatting checks without mixing broad formatting changes into logic
  commits.
- Run unit tests and production build.
- Run all existing E2E scenarios.
- Run new DFIM and wind scenarios.
- Manually verify reports, save/load behavior, downloads, and textbook pages.

Status: **In progress; Node.js 24 type checks and the complete current-source
E2E suite pass. The maintainer reports that the production build passes under
the supported Node.js 24 environment. Numerical reference tests and
MATLAB/Simulink validation are intentionally deferred until the engineering
model has been validated by humans.**

## Required automated coverage

The boundary, isolation, candidate-generation, documentation, and
responsive-layout tests added during integration are useful software regression
coverage. The following list remains the target for final engineering coverage.
Golden numerical assertions and additional export tests will be added only after
human validation establishes trusted expected values; unvalidated formulas must
not be frozen into tests merely because the current implementation produces
them.

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

| Date       | Decision                                                          | Rationale / evidence                                                                                                        | Status              |
| ---------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 2026-08-10 | Keep current dependency versions rather than PR #78's versions    | The dependency work is newer and independent of the feature                                                                 | Proposed            |
| 2026-08-10 | Do not merge PR #78 unchanged                                     | Static review found correctness defects and unvalidated shared-model changes                                                | Proposed            |
| 2026-08-10 | Preserve the original wind inputs, defaults, and topology results | Existing machine types retain this behavior; superseded for explicitly selected DFIM by the 2026-08-12 decision             | Superseded for DFIM |
| 2026-08-11 | Apply a complete DFIM starter case when DFIM is selected          | This follows the existing dependent-default pattern and gives both supported topologies valid candidates                    | Accepted            |
| 2026-08-11 | Keep the planned 7100 kW DFIM catalogue rating                    | The rating was intentionally added; the candidate boundary was aligned from 7000 to 7100 kW                                 | Implemented         |
| 2026-08-11 | Defer numerical golden and export tests until human validation    | Current empirical coefficients and the external MATLAB/Simulink contract do not yet provide trusted expected values         | Accepted            |
| 2026-08-11 | Do not preserve the former flat component-documentation URLs      | The canonical directory routes are working and backward-compatible redirects are not required                               | Accepted            |
| 2026-08-12 | Use Stian's aerodynamic wind calculation direction for DFIM       | The thesis simulation starts from rotor diameter and rated wind speed; a 75 m, 12 m/s turbine produces approximately 2.1 MW | Implemented         |

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
- Initially added migration of persisted legacy wind inputs while preserving
  their blade speed and shaft power; this was later removed when legacy-format
  compatibility was declared out of scope.
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

### 2026-08-11 — Engineering, compatibility, and documentation correction batch

- Introduced `DFIM_MAX_SLIP = 0.3` and used it for both converter sizing and the
  70–130% DFIM synchronous-speed envelope.
- Sized the DFIM grid-side filter at the simplified 30% current while retaining
  full referred current for the rotor-side filter.
- Separated cable installed quantity and price (`1.33`) from stator voltage drop
  (physical length) and the documented equal-resistance loss approximation
  (`1.09`).
- Applied the DFIM partial-efficiency curve consistently at 25%, 50%, and 75%.
- Replaced the DFIM efficiency calculation's `any` and truthiness fallbacks with
  typed, nullish-safe access.
- Detected and restored the pre-PR PMSM partial-efficiency behavior.
- Scoped the extended gearbox torque catalog to explicitly selected DFIM
  systems; existing systems retain the original catalog.
- Retained four-times floor-converter oversizing only for DFIM and two-times for
  all existing machine types.
- Restored the four canonical component chapter routes and navigation entries;
  checked all local MDX links and assets with zero missing targets.
- Corrected new DFIM chapter prose, cable assumptions, and figure references.
- Split CSV, MATLAB, and Simulink downloads into explicit controls with HTTP
  response validation; direct drive exports gearbox ratio `1`.
- Corrected MATLAB base impedance to `Vm^2 / Pm` for line-to-line voltage and
  total three-phase power.
- Node.js 24 TypeScript compilation and formatting checks pass.
- Current-source Playwright verification passes all 12 focused checks in
  Chromium and Firefox: two existing wind-default scenarios and ten chapter
  render scenarios covering electric machines, frequency converters, gearboxes,
  transformers, and power cables.
- The full current-source Playwright run exposed a crash in the interim
  saved-system migration when a matching local-storage entry lacked `input`.
  That topology-specific migration was subsequently removed from the generic
  store after legacy-format compatibility was declared out of scope.
- Added missing `await` operations to two existing reload steps in the
  saved-system browser tests.
- Final full current-source Playwright result: **43 passed, 3 intentionally
  skipped, 0 failed** across Chromium and Firefox.
- Selecting DFIM in either supported geared-wind topology now applies a
  DFIM-only starter case: `400 kNm` turbine torque, two `8:1` helical stages,
  `IP54/55` machine protection, and a compatible `4Q-2L-VSC` filter setup.
  Existing defaults are unchanged until DFIM is explicitly selected.
- Browser verification confirms both `wind-gb-fc` and `wind-gb-fc-tr` produce
  matching gearbox, DFIM machine, cable, converter, and (where applicable)
  transformer candidates in Chromium and Firefox: **4 passed, 0 failed**.
- Moved the three DFIM export actions out of the crowded general action row and
  into a labelled responsive panel. They render as three equal columns where
  space permits and stack vertically below the small-screen breakpoint.
- Desktop and `390 x 844` phone-layout checks pass in Chromium and Firefox; all
  export controls remain visible and inside their panel and viewport: **6
  passed, 0 failed**.

### 2026-08-11 — Full change and documentation review

- Compared the complete integration working tree with dependency-updated `main`
  (`1f4ebd5`) and with Stian's PR source.
- Found no evident unintended numerical change in the existing SCIM, PMSM, or
  SyRM sizing paths. DFIM-only gearbox torque, cable factors, converter power
  fraction, and four-times floor-converter oversizing remain correctly scoped.
- Confirmed that the multi-parameter DFIM starter case is consistent with the
  application's existing dependent-default behavior. It is accepted behavior,
  not an open defect: it runs only after an explicit DFIM selection and only in
  the two supported geared-wind topologies.
- Found one concrete catalogue inconsistency: `7100 kW` was present in the
  machine catalogue and textbook while the DFIM candidate filter stopped at
  `7000 kW`. The planned rating remains, and the candidate filter has now been
  corrected to include `7100 kW`.
- Reviewed the relocated component chapters, navigation metadata, internal
  links, and assets. The new directory routes render correctly and the internal
  navigation targets them.
- Confirmed that the former flat routes (`index_electric-machines`,
  `index_frequency-converters`, `index_gearboxes`, and `index_transformers`) do
  not require redirects or compatibility pages.
- Identified two legacy wording errors (`inventor scheme` should be
  `inverter scheme`) in the frequency-converter chapter and corrected both
  occurrences.
- Audited the new DFIM asset provenance. All new DFIM PNG, SVG, MATLAB, and
  Simulink files first appear in Stian Skevig's single authored PR commit
  `d19dd3423`. The Simulink package metadata identifies `stianske` as creator
  and `stian` as last modifier, while the SVG headers identify Microsoft Visio
  as the export tool. The PNG files contain no useful creator, copyright,
  source, or license metadata, and neither the commit nor PR description
  provides separate attribution. The repository is Apache-2.0 licensed, but this
  audit cannot establish whether the raster diagrams are original work or
  cleared third-party material. Obtain a brief contributor confirmation before
  publication; add source attribution only if that confirmation identifies
  external material.
- Confirmed that numerical validation remains outside the current software-only
  review: coefficient provenance, a trusted complete DFIM reference case, CSV
  schema/units, and the Simulink per-unit convention require human or external
  tool validation. Additional golden tests will follow that validation.
- Noted that the relocated documentation directories, DFIM helper, and new test
  files are still untracked in the current working tree. They must be staged
  together with deletion of the old flat chapter files to avoid an incomplete
  commit.

### 2026-08-11 — Export component and download coverage

- Extracted the DFIM export panel from the general system `Input` component into
  a focused `DfimExportActions` client component. The parent now supplies only
  the current system and an error callback; visibility rules, filenames, and
  download handlers remain encapsulated with the panel.
- Added a browser test that clicks all three DFIM export actions in Chromium and
  Firefox. It verifies the expected CSV, MATLAB, and Simulink filenames,
  successful browser downloads, and non-empty files without asserting
  unvalidated numerical values.
- Documented the units, compatibility boundary, and validation status of the
  extended DFIM gearbox torque catalogue in `gearbox-sizing.ts`.
- Removed `migrateLegacyWindInput` and its focused tests. The shared store is
  topology-agnostic again, and compatibility with pre-integration saved-system
  formats is explicitly out of scope. New and updated systems calculate the two
  additive wind export fields through the normal model lifecycle.
- Node.js 24 TypeScript compilation and the direct Next.js production build
  pass. The focused DFIM browser suite passes all **8 tests** across Chromium
  and Firefox, including both download tests.

### 2026-08-12 — Restore Stian's DFIM wind calculation direction

- Traced the quoted thesis 2.1 MW simulation case to the wind calculation
  direction introduced by Stian's PR.
- Added a DFIM-specific wind model that accepts rotor diameter and rated wind
  speed, then derives shaft power, blade speed, overspeed, and rated torque
  using Stian's formulas and constants.
- Kept the original blade-speed and torque inputs unchanged for SCIM, PMSM,
  SyRM, and every topology where DFIM is unavailable.
- Scoped Stian's DFIM machine-price rules to DFIM: its base price omits the
  efficiency-class premium and uses the PR's IC411/IP54 and IC416/IP54 cooling
  coefficients. Existing machine types retain their previous pricing rules.
- Made parameter updates resolve the model for the new state before evaluating
  calculated fields. Selecting DFIM now installs the 75 m, 12 m/s reference
  case atomically, and later gearbox or converter edits do not change its wind
  torque.
- Added a reference regression for a 75 m rotor at 12 m/s: approximately 2104.1
  kW shaft power, 21.39 rpm blade speed, and 939.42 kNm rated torque.
- Added a browser regression that verifies the same values through the user
  interface in Chromium and Firefox.
- Extended the browser regression to the complete thesis rotor reference in the
  transformer topology: 75 m rotor, 12 m/s rated wind, 1.2 overspeed, 2104.1 kW,
  21 rpm rated speed, 26 rpm overspeed, 939 kNm, and a 2.5 MW DFIM candidate.
- The aggregate values in thesis Figure 6.6.2 are not used as golden assertions.
  The figure comes from a saved system whose component selections are not
  recorded in the thesis or final PR; selecting the current matching candidates
  does not reproduce its price, efficiency, volume, footprint, or weight. Do not
  change calculations to fit those totals without the original saved system.
- Node.js 24 TypeScript validation and all 20 Jest tests pass. All 12 focused
  wind and DFIM browser tests pass across Chromium and Firefox.

## Next-session checklist

1. Ask Stian to confirm that the newly added raster diagrams are original work
   or otherwise licensed for inclusion under the repository's terms; record any
   external sources he identifies.
2. After human engineering validation, add a trusted end-to-end numerical DFIM
   reference case and validate the CSV/MATLAB/Simulink contract.
3. Before committing, review `git status`, stage tracked deletions and all
   replacement/untracked files together, run `git diff --check`, and perform the
   supported Node.js 24 verification set.

## Notes for future sessions

- Start by reading this document and checking the current branch and working
  tree.
- Run all project commands under Node.js 24 (`nvm use`); do not use results from
  another Node.js major version as integration evidence.
- Update statuses rather than deleting historical findings.
- Add links to commits or tests as findings are resolved.
- Keep engineering assumptions separate from confirmed software defects.
- Do not resolve uncertain engineering behavior solely to make tests pass.
