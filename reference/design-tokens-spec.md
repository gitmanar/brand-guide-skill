# Design Tokens Specification

## CSS Custom Properties Format

Naming convention: `--{category}-{item}-{variant}`

```css
:root {
  /* Colors */
  --color-primary-50: #fef2f2;
  --color-primary-500: #ef4444;
  --color-primary-900: #7f1d1d;
  --color-secondary-500: #3b82f6;
  --color-neutral-50: #fafafa;
  --color-neutral-900: #171717;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Typography */
  --font-family-display: 'BrandDisplay', sans-serif;
  --font-family-body: 'BrandBody', sans-serif;
  --font-family-mono: 'BrandMono', monospace;
  --font-size-xs: 0.64rem;
  --font-size-sm: 0.8rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.563rem;
  --font-size-2xl: 1.953rem;
  --font-size-3xl: 2.441rem;
  --font-size-4xl: 3.052rem;
  --font-size-5xl: 3.815rem;
  --line-height-tight: 1.15;
  --line-height-snug: 1.3;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.05em;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing (base unit: 4px) */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Elevation / Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-out: cubic-bezier(0, 0, 0.2, 1);
}
```

## W3C Design Token JSON Format

```json
{
  "color": {
    "primary": {
      "50": { "$value": "#fef2f2", "$type": "color" },
      "500": { "$value": "#ef4444", "$type": "color" },
      "900": { "$value": "#7f1d1d", "$type": "color" }
    }
  },
  "font": {
    "family": {
      "display": { "$value": "BrandDisplay, sans-serif", "$type": "fontFamily" },
      "body": { "$value": "BrandBody, sans-serif", "$type": "fontFamily" }
    },
    "size": {
      "base": { "$value": "1rem", "$type": "dimension" }
    }
  },
  "space": {
    "4": { "$value": "1rem", "$type": "dimension" }
  }
}
```

## Tailwind Config Extension

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          // ... all stops
        },
        secondary: { /* ... */ },
      },
      fontFamily: {
        display: ['BrandDisplay', 'sans-serif'],
        body: ['BrandBody', 'sans-serif'],
      },
      fontSize: { /* from type scale */ },
      spacing: { /* from spacing scale */ },
      borderRadius: { /* from radius tokens */ },
      boxShadow: { /* from shadow tokens */ },
    },
  },
};
```

## Token Categories Checklist

When generating tokens, always include:
- [ ] Color: all palette colors with full tint/shade scales
- [ ] Typography: families, sizes, weights, line heights, letter spacing
- [ ] Spacing: complete spacing scale
- [ ] Border radius: all radius values
- [ ] Elevation: shadow scale
- [ ] Motion: durations and easings
