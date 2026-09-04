# A11y platform gap: vtex.minicart aria-hidden-focus (TA-84)

## Summary

Axe rule `aria-hidden-focus` (serious) was detected on `storetheme.vtex.com` for two CSS handles from the native `vtex.minicart@2.x` app:

| CSS handle | Block | Violation |
| --- | --- | --- |
| `vtex-minicart-2-x-openIconContainer` | `openIconContainer` | Wrapper uses `role="presentation"` and `aria-hidden="true"` while the inner cart button stays keyboard-focusable |
| `vtex-minicart-2-x-drawer` | `drawer` | Closed drawer panel uses `aria-hidden="true"` while focusable children (links, buttons) remain in the tab order |

## Root cause (platform)

The drawer variation of `vtex.minicart` delegates rendering to `vtex.store-drawer`. That app:

1. Wraps the trigger icon in `openIconContainer` with `aria-hidden="true"` and `role="presentation"`.
2. Sets `aria-hidden="true"` on the drawer panel (`Swipable`) when closed, without disabling focus on interactive descendants.

This is a **platform dependency gap** — not fixable via store-theme CSS alone. CSS cannot remove `aria-hidden` or change focus order.

## Correction scope

| Scope | Action |
| --- | --- |
| **Native `vtex.minicart`** | Report to VTEX platform; do not open PRs in `vtex-apps/minicart` from customer repos |
| **Store theme** | Replace `vtex.minicart` dependency with a forked app (e.g. `acctglobal.poc-traction-minicart`) that inlines an accessible Drawer |
| **Theme CSS (`styles/css/vtex.*.css`)** | Cannot resolve `aria-hidden-focus`; use only for visual overrides |

## Fix in `acctglobal.poc-traction-minicart`

This POC app applies the following changes:

- **`OpenIconContainer`**: local component without `aria-hidden` / `role="presentation"`.
- **Local `Drawer` fork**: replaces `vtex.store-drawer` for drawer mode; closed panel uses `visibility: hidden` instead of `aria-hidden="true"`.
- **Unit tests**: regression coverage in `react/components/openIconContainer/__tests__/` and `react/components/Drawer/__tests__/Drawer.a11y.test.tsx`.

## Theme integration

To use the fix on `acctglobal.myvtex.com`:

1. In the store theme `manifest.json`, replace `"vtex.minicart": "2.x"` with `"acctglobal.poc-traction-minicart": "0.x"`.
2. Keep existing `minicart.v2` block configuration — block names are unchanged.
3. Link the fork in a development workspace and re-run axe `aria-hidden-focus` on the minicart trigger and drawer.

## References

- [Deque: aria-hidden-focus](https://dequeuniversity.com/rules/axe/4.10/aria-hidden-focus?application=axeAPI)
- Scan: `campanha-2026-09-04T18-59Z-mobile`
- Jira: [TA-84](https://qualitydigital.atlassian.net/browse/TA-84)
