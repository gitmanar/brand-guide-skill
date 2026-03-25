# Color System Reference

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

If base color lightness ≠ ~50%, remap it to the 500 slot and interpolate around it.

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
