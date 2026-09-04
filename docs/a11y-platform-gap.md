# Platform gap: `aria-hidden-focus` in `vtex.minicart`

## Summary

Accessibility scans on [storetheme.vtex.com](https://storetheme.vtex.com) report **axe `aria-hidden-focus` (serious)** for:

| CSS handle | Fingerprint |
| --- | --- |
| `.vtex-minicart-2-x-openIconContainer` | `vtex.minicart\|aria-hidden-focus\|vtex-minicart-2-x-openIconContainer` |
| `.vtex-minicart-2-x-drawer` | `vtex.minicart\|aria-hidden-focus\|vtex-minicart-2-x-drawer` |

## Root cause (platform dependency)

Both violations come from **`vtex.store-drawer`**, which `vtex.minicart` uses for the drawer variation:

1. **`openIconContainer`** — upstream drawer marks the trigger wrapper with `aria-hidden="true"` (and historically `role="presentation"`) while `vtex.minicart` renders a focusable `ButtonWithIcon` inside it.
2. **`drawer`** — upstream `Swipable` sets `aria-hidden="true"` when the panel is closed, but checkout buttons, product-list controls, and the close button remain in the DOM and stay focusable.

Theme-level CSS overrides (`styles/css/vtex.*.css`) **cannot** remove `aria-hidden` or change focus order. This is a **React markup issue in platform apps**, not a styling gap.

## Correction scope

| Store setup | Recommended action |
| --- | --- |
| Default `vtex.minicart` dependency | Report to VTEX platform (`vtex.store-drawer` / `vtex.minicart`) or replace the block with a forked app |
| `acctglobal.poc-traction-minicart` (this repo) | Local vendored drawer without `aria-hidden` anti-patterns; closed panel uses `inert` instead |
| Store theme only | Document gap; swap minicart block to the POC app in `manifest.json` + `store/blocks.json` |

## POC app fix (this repository)

- `react/components/openIconContainer` — trigger wrapper without `aria-hidden` / `role="presentation"`.
- `react/components/Drawer/*` — vendored fork of `vtex.store-drawer` with:
  - accessible `OpenIconContainer` trigger
  - closed drawer panel marked `inert` (not `aria-hidden`) so focusable descendants are removed from the tab order

## Store theme integration

To consume the fix on `acctglobal`:

```json
"dependencies": {
  "acctglobal.poc-traction-minicart": "0.x"
}
```

Replace `minicart.v2` references with the POC block name defined in this app's `store/interfaces.json`.

## References

- [Deque: aria-hidden-focus](https://dequeuniversity.com/rules/axe/4.10/aria-hidden-focus?application=axeAPI)
- Jira: **TA-77**
- Scan: `campanha-2026-09-04T18-30Z`
