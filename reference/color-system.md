# Color System Reference

## 3-Tier Token Architecture

Elite design systems (Material Design, Spectrum, Polaris) use 3 tiers:

| Tier | Name | Example | Purpose |
|------|------|---------|---------|
| 1 | Primitive | `color-blue-500: #3B82F6` | Raw values, no semantic meaning |
| 2 | Semantic | `color-action-primary: {blue-500}` | Named by purpose, references primitives |
| 3 | Component | `button-bg-primary: {action-primary}` | Scoped to components |

Rebranding = change Tier 1 only. Dark mode = swap Tier 2 mappings. Component theming = override Tier 3.

Generate at minimum Tiers 1 and 2. Tier 3 is optional for brand guides (more relevant for full design systems).

### Semantic Token Categories

Generate these semantic mappings from the primitive palette:

```
color-action-primary     → primary-500
color-action-primary-hover → primary-600
color-surface-page       → neutral-50 (light) / neutral-950 (dark)
color-surface-default    → white (light) / neutral-900 (dark)
color-surface-raised     → white (light) / neutral-800 (dark)
color-text-primary       → neutral-900 (light) / neutral-50 (dark)
color-text-secondary     → neutral-600 (light) / neutral-400 (dark)
color-text-disabled      → neutral-400 (light) / neutral-600 (dark)
color-border-default     → neutral-200 (light) / neutral-700 (dark)
color-border-focus       → primary-500
```

## WCAG Accessibility Requirements

| Level | Normal Text (< 18pt) | Large Text (≥ 18pt / 14pt bold) | UI Components |
|-------|----------------------|----------------------------------|---------------|
| AA    | 4.5:1                | 3:1                              | 3:1           |
| AAA   | 7:1                  | 4.5:1                            | 3:1           |

**Contrast ratio formula:**
```
L1 = lighter color relative luminance
L2 = darker color relative luminance
ratio = (L1 + 0.05) / (L2 + 0.05)
```

**Relative luminance** from sRGB:
```js
function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
```

## Color Roles

| Role | Purpose | Typical Usage |
|------|---------|---------------|
| primary | Brand hero color | CTAs, active states, links, brand elements |
| secondary | Supporting brand color | Secondary buttons, accents, backgrounds |
| accent | High-visibility highlights | Badges, notifications, focus rings |
| neutral | Text and backgrounds | Body text, borders, cards, dividers |
| success | Positive feedback | Confirmations, completed states |
| warning | Caution states | Alerts, validation warnings |
| error | Destructive / error | Error messages, delete actions |
| info | Informational | Tips, help text, informational banners |

## Tint/Shade Generation (50-950 Scale)

Generate 11 stops per base color using HSL lightness adjustment:

```js
function generateScale(hex) {
  const hsl = hexToHSL(hex);
  return {
    50:  hslToHex(hsl.h, Math.min(hsl.s * 1.1, 100), 97),
    100: hslToHex(hsl.h, Math.min(hsl.s * 1.05, 100), 94),
    200: hslToHex(hsl.h, hsl.s, 86),
    300: hslToHex(hsl.h, hsl.s, 74),
    400: hslToHex(hsl.h, hsl.s, 60),
    500: hslToHex(hsl.h, hsl.s, hsl.l),  // base color
    600: hslToHex(hsl.h, hsl.s, hsl.l * 0.8),
    700: hslToHex(hsl.h, hsl.s, hsl.l * 0.6),
    800: hslToHex(hsl.h, hsl.s, hsl.l * 0.4),
    900: hslToHex(hsl.h, Math.min(hsl.s * 1.1, 100), hsl.l * 0.25),
    950: hslToHex(hsl.h, Math.min(hsl.s * 1.2, 100), hsl.l * 0.15),
  };
}
```

The `generate-palette.js` script normalizes the 500 stop to ~47% lightness regardless of input.

**OKLCH note:** HSL produces muddy, desaturated results at scale extremes. For highest quality, consider generating scales in OKLCH (perceptually uniform) color space. The script uses HSL for zero-dependency operation, but when quality is paramount, convert to OKLCH, adjust lightness along a perceptual curve, and slightly shift hue at extremes to maintain perceived chroma.

## Dark Mode Palette

Inversion strategy:
- Swap 50↔950, 100↔900, 200↔800, 300↔700, 400↔600
- Keep 500 as-is (it's the brand color)
- Background: neutral-950, Surface: neutral-900, Text: neutral-50
- Reduce saturation by 10-15% for dark backgrounds (prevents eye strain)
- Primary/accent colors may need lightness boost (+10-15%) for contrast on dark

## Color Harmony

| Harmony | Rule | Use Case |
|---------|------|----------|
| Complementary | 180° apart on wheel | High contrast accents |
| Analogous | 30° apart | Harmonious, calm palettes |
| Triadic | 120° apart | Vibrant, balanced |
| Split-complementary | 150° + 210° | Contrast with less tension |

Generate suggestions from primary color when user provides fewer than 3 colors.
