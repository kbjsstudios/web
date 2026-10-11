# Ticket: Improve mobile navigation drawer

## 1. Ticket Metadata

| Field | Value |
|---|---|
| Ticket ID | KBJS-2026-014 |
| Task type | ui-ux |
| Priority | p2-normal |
| Status | open |
| Assigned agent | <paste into your agent of choice> |
| Repository | https://github.com/kbjsstudios/web |
| Branch | main |

## 2. Objective

- **What:** Make the mobile navigation drawer faster to scan and easier to
  close, without changing the desktop mega-menu.
- **Why:** On phones the drawer is the only way to reach pages; current
  feedback says it feels long and easy to get stuck in.
- **Done looks like:** A phone user opens the menu, reaches "Resource Packs"
  in one glance, and closes the menu with a tap anywhere outside it.

## 3. Current State

- Existing behavior: hamburger toggles a full-height drawer listing every
  site link in one flat column (`tools/common.py` generates the markup;
  drawer styles live in `styles.css`; toggle logic in `script.js`).
- Problem / limitation: long flat list, no obvious close affordance, no
  outside-tap dismissal.
- Relevant files: `styles.css` (drawer rules), `script.js` (drawer module),
  `tools/common.py` (shared nav markup used by all pages).

## 4. Requirements

### Functional

- [ ] Tapping outside the open drawer closes it.
- [ ] Pressing Escape closes it.
- [ ] The hamburger button toggles open/closed and exposes correct
      `aria-expanded` state.

### UI / UX

- [ ] Group links under the existing nav categories (Services, Games,
      Resources, Company) with small headings.
- [ ] Visible close (×) button at the top of the drawer.
- [ ] Match the existing light design system: soft surfaces, gradient
      accents already defined as CSS variables in `styles.css`.

### Technical

- [ ] Markup changes go in `tools/common.py`, then regenerate all pages with
      the build scripts in the documented order.
- [ ] No new dependencies; no build step.

### Responsive / accessibility

- [ ] Usable at 360 px width; tap targets ≥ 44 px.
- [ ] Drawer traps focus while open and restores it to the hamburger on close.

### Must remain unchanged

- Desktop (≥ 900 px) mega-menu appearance and behavior.
- All existing routes and their URLs.
- Light theme default and `prefers-color-scheme` dark support.

## 5. Agent Execution Instructions

Follow the standard execution steps (inspect repo → plan → implement →
verify). Key repo facts: shared markup is generated — never hand-edit nav in
every HTML file; edit `tools/common.py` and regenerate. Read `tools/README.md`
for the build order.

## 6. Acceptance Criteria

- [ ] Drawer shows grouped links with headings at 360 px.
- [ ] Outside-tap and Escape both close the drawer.
- [ ] Desktop mega-menu at 1280 px is pixel-identical to before.
- [ ] `aria-expanded="true"` on hamburger while open, `false` when closed.
- [ ] All 19 site pages regenerated; no page lost its nav or footer.

## 7. Testing and Verification

- [ ] Re-ran the `tools/*.py` build scripts; regenerated HTML diff shows only
      intended nav changes.
- [ ] Loaded index, contact and mini-games at 360 px and 1280 px in a
      browser; no console errors.
- [ ] Keyboard-only pass: Tab to hamburger, Enter to open, Escape to close.

## 8. Completion Report

*(Agent fills this in.)*

- **Final status:**
- **Summary of changes:**
- **Files created / modified / deleted:**
- **Important implementation details:**
- **Tests performed and results:**
- **Known issues / limitations:**
- **Screenshots or preview links:**
- **Git commit(s):**
- **Deployment status:**
- **Recommended next steps:**

## 9. Scope and Safety

- **In scope:** drawer markup, drawer styles, drawer JS only.
- **Out of scope:** redesigning the desktop mega-menu, changing site content,
  touching game pages' logic, refactoring `script.js` beyond the drawer
  module.
- Preserve existing features and user data; no scope creep.

## 10. Definition of Done

- [ ] All acceptance criteria checked.
- [ ] Verification actually executed and results reported.
- [ ] Existing functionality not knowingly broken.
- [ ] Limitations documented.
- [ ] Completion Report filled in.
