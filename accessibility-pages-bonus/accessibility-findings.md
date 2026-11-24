# Accessibility Findings — MaPS Technical Exercise

I tested the supplied page in Chrome, including keyboard navigation, zoom and different device sizes in DevTools. I also checked the HTML and CSS to see what might be causing the issues.

## Issues found

| ID | Issue | Severity |
| --- | --- | --- |
| A11Y-001 | Form fields don't have proper labels | High |
| A11Y-002 | Content gets cut off when zooming, with no way to scroll to it | High |
| A11Y-003 | Page language isn't set | Medium |
| A11Y-004 | Page has no title | Medium |
| A11Y-005 | Robot image has no `alt` attribute | Medium |
| A11Y-006 | Placeholder text is too light | Medium |
| A11Y-007 | Keyboard focus isn't clearly visible on the Done button | Medium |

## Bug reports

### A11Y-001 — Form fields don't have proper labels

**Severity:** High  

**Steps to reproduce**
1. Open the contact form.
2. Look at the Full name, Email and Your message fields.
3. Inspect the inputs and textarea in DevTools.

**Actual result**

The fields only have placeholder text. There are no associated `<label>` elements, and the visible hints disappear once you start typing.

**Expected result**

Each field should have a label that stays visible and is linked to the correct input.


---

### A11Y-002 — Content gets cut off when the page is zoomed

**Severity:** High  

**Steps to reproduce**
1. Open the page in Chrome.
2. Increase the zoom using Ctrl + Plus.
3. Once content extends beyond the visible area, try scrolling to reach it.
4. Try different viewport sizes in DevTools.

**Actual result**

When I zoomed in, parts of the page went outside the visible area and I couldn't scroll to reach them. I also saw scaling and clipping problems using the iPhone 16 Pro Max (440 × 956) and Nest Hub Max (1280 × 800) presets.

**Expected result**

The page should adjust to the available space, or at least allow scrolling so no content is lost.


---

### A11Y-003 — Page language isn't set

**Severity:** Medium  

**Steps to reproduce**
1. Open the page.
2. Inspect the root `<html>` element.

**Actual result**

The page uses `<html>` without a `lang` attribute.

**Expected result**

The language should be declared so assistive technology knows how to read the text.


---

### A11Y-004 — Page has no title

**Severity:** Medium  

**Steps to reproduce**
1. Open the page in Chrome and check its browser tab.
2. Inspect the `<head>` section in DevTools.

**Actual result**

There is no `<title>` element in the HTML.

**Expected result**

The page should have a title that describes what it is.


---

### A11Y-005 — Robot image has no alternative text

**Severity:** Medium  

**Steps to reproduce**
1. Open the page.
2. Inspect the robot image element.

**Actual result**

The `<img>` element has no `alt` attribute.

**Expected result**

The image should have appropriate alternative text, or an empty `alt` if it's just decorative.


---

### A11Y-006 — Placeholder text is too light

**Severity:** Medium  

**Steps to reproduce**
1. Open the form and look at the placeholder text.
2. Inspect the placeholder colour in `index.css`.
3. Compare it with the white input background.

**Actual result**

The placeholder colour is `#AAAAAA` on white, giving a contrast ratio of around **2.32:1**.

**Expected result**

Normal-sized text should meet at least **4.5:1** contrast.


---

### A11Y-007 — Done button doesn't show a clear keyboard focus indicator

**Severity:** Medium  

**Steps to reproduce**
1. Open the form in Chrome.
2. Use Tab to move through the fields.
3. Press Tab again to move to the Done button.
4. Watch the focus indicator.

**Actual result**

At first I thought Tab was skipping the button. After checking again, including in DevTools mobile emulation, I could see focus moving to it. The problem is that the button itself doesn't show a clear visual change, so it looks as though focus has disappeared.

**Expected result**

It should be obvious when the Done button has keyboard focus.


## Other areas worth nothing during my testing

- **Heading level:** The main heading is an `<h2>` rather than an `<h1>`. A clear top-level heading would make the page structure easier to follow. This is a structural improvement rather than a standalone bug.
- **Image spacing:** The robot image sits too close to the right edge at some screen sizes. More breathing room would make the layout look better. This is a visual issue rather than an accessibility bug.

