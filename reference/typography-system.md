# Typography System Reference

## Modular Type Scales

| Scale Name | Ratio | Character |
|-----------|-------|-----------|
| Minor Second | 1.067 | Tight, subtle |
| Major Second | 1.125 | Compact, readable |
| Minor Third | 1.200 | Balanced, versatile |
| Major Third | 1.250 | **Default recommendation** |
| Perfect Fourth | 1.333 | Strong hierarchy |
| Augmented Fourth | 1.414 | Dramatic |
| Perfect Fifth | 1.500 | Very dramatic |

### Generating a Scale

```
Base size: 16px (1rem)
Scale ratio: 1.250 (major third)

xs:   16 / 1.250²  = 10.24px → 0.64rem
sm:   16 / 1.250   = 12.80px → 0.80rem
base: 16            = 16.00px → 1.00rem
lg:   16 × 1.250   = 20.00px → 1.25rem
xl:   16 × 1.250²  = 25.00px → 1.563rem
2xl:  16 × 1.250³  = 31.25px → 1.953rem
3xl:  16 × 1.250⁴  = 39.06px → 2.441rem
4xl:  16 × 1.250⁵  = 48.83px → 3.052rem
5xl:  16 × 1.250⁶  = 61.04px → 3.815rem
```

## Line Height Rules

| Text Type | Line Height | Rationale |
|-----------|-------------|-----------|
| Body text (base-lg) | 1.5-1.6 | Optimal readability |
| Subheadings (xl-2xl) | 1.3-1.4 | Tighter for visual weight |
| Headings (3xl-5xl) | 1.1-1.2 | Tight for display type |
| Captions/labels (xs-sm) | 1.4-1.5 | Legible at small sizes |

## Letter Spacing

| Size Range | Tracking | Rationale |
|-----------|----------|-----------|
| xs-sm | +0.02em to +0.05em | Open up small text |
| base-lg | 0 (normal) | Natural spacing |
| xl-2xl | -0.01em to -0.02em | Tighten slightly |
| 3xl+ | -0.02em to -0.04em | Tighten for display |

## Font Pairing Principles

1. **Contrast**: Pair serif with sans-serif, or geometric with humanist
2. **One display, one workhorse**: Display font for headings, readable font for body
3. **Shared x-height**: Fonts pair best when their x-heights are similar
4. **Max 2-3 families**: More causes visual chaos
5. **Weight contrast**: Bold headings + regular body creates natural hierarchy

### Strong Pairings by Category
- **Modern**: Geometric sans (headings) + Humanist sans (body)
- **Editorial**: Serif (headings) + Sans-serif (body)
- **Technical**: Monospace (headings) + Sans-serif (body)
- **Luxury**: High-contrast serif (headings) + Light sans (body)

## Responsive Typography (Fluid Sizing)

Use CSS `clamp()` for fluid type that scales between breakpoints:

```css
/* Pattern: clamp(min, preferred, max) */
--font-size-base: clamp(0.875rem, 0.8rem + 0.4vw, 1rem);
--font-size-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
--font-size-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
--font-size-4xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);
```

## @font-face Template

```css
@font-face {
  font-family: 'BrandFont';
  src: url('./assets/fonts/brand-font.woff2') format('woff2'),
       url('./assets/fonts/brand-font.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

Generate one `@font-face` block per weight/style variant of each imported font file.
