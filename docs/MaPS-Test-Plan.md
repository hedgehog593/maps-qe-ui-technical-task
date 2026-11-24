# MaPS Holiday Entitlement Calculator Test Plan

Justin Hegedus  |  24 November 2026

## Purpose

I put this suite together to check the main ways the GOV.UK holiday entitlement calculator could give someone the wrong result. That includes different working patterns, employment dates, and whether someone can go back and correct an answer. The calculator gives results in days, hours, weeks and shifts, so I wanted at least one calculation for each route rather than lots of examples of the same one.

## Quality approach

There are 11 automated tests. Most focus on one calculation or behaviour, with another test covering starting again and changing an earlier answer. For the calculation tests, I check both the entitlement and the answers shown at the end. That helps catch a result that looks right even though the calculator used the wrong inputs or took the wrong route.

## Scope

The tests cover the main journeys through the GOV.UK holiday entitlement calculator, including different working patterns and employment periods, required-field validation, and going back to change or restart a calculation.

## 1. Risk assessment

| Risk | Coverage and reasoning |
| --- | --- |
| Wrong entitlement for a working pattern. | TC02, TC03 and TC07–TC11 check the different working patterns and the result each produces. I picked one useful example for each route instead of adding lots of similar numbers. Those extra tests would still need running and maintaining, but wouldn't necessarily tell us much more. |
| Employment dates affect the result incorrectly. | TC04, TC10 and TC11 cover starting partway through a leave year and starting and leaving within one. These take different routes through the calculator, so they give us more useful coverage than repeating slightly different dates along the same route. |
| Wrong result unit or incorrect answers in the summary. | The calculation tests check the entitlement and the answers shown at the end. This checks that we're getting the right type of result — days, hours, weeks or shifts — and that the inputs shown match what was entered. |
| Users get stuck after missing or changing an answer. | TC05 checks the errors shown for missing answers, and TC06 checks starting again and changing a previous answer. These behaviours are shared across the calculator, so I haven't repeated the same checks for every working pattern. |
| The calculator or its starting journey changes. | TC01 and TC02 check that the calculator opens and that a standard calculation works. They're a quick way to spot a problem with the main journey before looking at the wider set of calculation tests. |

I chose tests that take different paths through the calculator rather than trying every possible combination of inputs. This gives us useful regression coverage without adding lots of similar tests to run in CI and maintain later.

## 2. Test coverage

| Test | Coverage / expected outcome |
| --- | --- |
| TC01 — Calculator opens | The landing page loads and the first question and its controls are shown. |
| TC02 — Five-day week | Five days per week gives 28 days for a full year. Checks the answer summary and Change link. |
| TC03 — Three-day week | Three days per week gives 16.8 days for a full year, with the expected summary. |
| TC04 — Starts partway through year | Five days per week, starting on 1 July in a leave year beginning 1 January 2026, gives 14 days. |
| TC05 — Required answers | Leaving the first question or leave-year start date blank shows a validation error. |
| TC06 — Restart and change | Start again returns to the landing page. Changing the irregular-hours answer from Yes to No takes the user to the right next question. |
| TC07 — Irregular hours | 70 hours worked in a pay period gives 8 hours of entitlement, with the expected summary. |
| TC08 — Hours per week | 40 hours across five days gives 224 hours of holiday entitlement for a full year. |
| TC09 — Shifts | Four 12-hour shifts in an eight-day pattern give 19.6 shifts of annual entitlement. |
| TC10 — Annualised hours | Employment from 1 April to 30 September 2026 gives 2.81 weeks of holiday. |
| TC11 — Compressed hours | 36 hours across four days for the same period gives 101 hours and 6 minutes, with 9 hours for each working day. |

## 3. Environment strategy

The tests run in Chromium against the live GOV.UK holiday entitlement calculator. There's no login or test account involved, and each test gets its own browser context. As this is a live service, site changes or occasional network problems could affect a test run.

## 4. Automation strategy

I used Playwright and TypeScript, keeping common page actions in Page Objects and the expected results with the test scenarios. Fixtures handle the starting page and give each test a fresh browser context. This keeps the tests readable and avoids repeating the same setup. The suite runs with two workers by default.

## 5. Regression approach

TC01 and TC02 are the smoke checks for the opening journey and a standard calculation. I run the full suite after shared changes and before submission. GitHub Actions also runs linting, TypeScript checks and the Playwright tests on pushes and pull requests to main. If something fails, I'd check the failure before rerunning it or changing an expected result. Screenshots and traces are available to help investigate.
