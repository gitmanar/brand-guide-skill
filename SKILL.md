---
name: brand-guide
description: Use when creating, consolidating, or generating brand guidelines, brand identity systems, style guides, or design systems from existing brand elements like colors, fonts, logos, screenshots, or website URLs. Triggers on mentions of brand guide, style guide, brand identity, brand book, brand standards, or design system documentation.
---

# Brand Guide Generator

Generate comprehensive, professional brand guidelines from existing brand elements. Outputs an interactive HTML brand guide, print-ready PDF, and design tokens (CSS/JSON/Tailwind).

## Input Collection

Gather these from the user. **Required** items are marked; everything else enhances the guide.

| Input | Required | Format |
|-------|----------|--------|
| Brand name | **Yes** | Text |
| Primary color(s) | **Yes** | Hex codes (e.g., `#2563eb`) |
| Primary font | **Yes** | Google Font name OR file path (`.woff2`, `.ttf`, `.otf`) |
| Secondary color(s) | No | Hex codes |
| Body font | No | Google Font name OR file path |
| Logo file(s) | No | File paths (`.svg`, `.png`, `.pdf`) — primary, alternate, icon |
| Tagline | No | Text |
| Mission / Vision | No | Text |
| Core values | No | List of value + description pairs |
| Brand personality | No | 3-5 adjectives (e.g., "Bold, Friendly, Innovative") |
| Voice & tone notes | No | Text describing communication style |
| Screenshots / website URLs | No | For reference extraction |
| Figma export files | No | `.fig` or exported JSON |
| Imagery samples | No | File paths to brand photography |
| Icon files | No | File paths to icon assets |
| Existing brand assets | No | Any partial style guides, PDFs, docs |

Use `AskUserQuestion` to collect inputs interactively. Start with required fields, then ask about optional ones in groups.

## Output Structure

All files go into a user-specified output directory (default: `./brand-guide-output/`):

```
brand-guide-output/
├── index.html            # Interactive brand guide
├── styles.css            # Guide stylesheet
├── scripts.js            # Interactive features
├── tokens.css            # CSS custom properties
├── tokens.json           # W3C Design Token format
├── tailwind.config.js    # Tailwind theme extension
└── assets/
    ├── logos/            # All logo files (copied)
    ├── fonts/            # All font files (copied)
    └── imagery/          # All imagery files (copied)
```

## Generation Workflow

```dot
digraph brand_guide {
  rankdir=TB;
  "Collect inputs" [shape=box];
  "Process assets" [shape=box];
  "Generate palette" [shape=box];
  "Generate tokens" [shape=box];
  "Build HTML sections" [shape=box];
  "Write output files" [shape=box];
  "Preview in browser" [shape=box];

  "Collect inputs" -> "Process assets";
  "Process assets" -> "Generate palette";
  "Generate palette" -> "Generate tokens";
  "Generate tokens" -> "Build HTML sections";
  "Build HTML sections" -> "Write output files";
  "Write output files" -> "Preview in browser";
}
```

### Phase 1: Process Assets

1. Create output directory and `assets/` subdirectories
2. **Logo files**: Copy to `assets/logos/`. Read SVG files to extract for inline use in HTML
3. **Font files**: Copy to `assets/fonts/`. Generate `@font-face` CSS declarations:
   ```css
   @font-face {
     font-family: 'FontName';
     src: url('./assets/fonts/filename.woff2') format('woff2');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   ```
   For Google Fonts, use: `<link href="https://fonts.googleapis.com/css2?family=FontName:wght@400;500;600;700&display=swap" rel="stylesheet">`
4. **Imagery**: Copy to `assets/imagery/`

### Phase 2: Generate Palette

Run `generate-palette.js` with the user's colors:

```bash
node ~/.claude/skills/brand-guide/scripts/generate-palette.js '{"primary":"#HEX","secondary":"#HEX"}'
```

This produces:
- Full 50-950 tint/shade scales for each color
- Neutral scale (tinted toward primary hue)
- Semantic colors (success, warning, error, info) if not provided
- WCAG contrast matrix
- Suggestions for complementary/analogous colors if palette is thin

Review the contrast matrix. Flag any common pairings that fail WCAG AA. Adjust colors if needed.

### Phase 3: Generate Tokens

Run `generate-tokens.js`:

```bash
node ~/.claude/skills/brand-guide/scripts/generate-tokens.js brand-data.json ./brand-guide-output/
```

Input `brand-data.json` structure:
```json
{
  "palette": { /* output from generate-palette.js */ },
  "fonts": { "display": "FontName", "body": "FontName" },
  "baseFontSize": 16,
  "typeRatio": 1.25,
  "baseSpacingUnit": 4
}
```

Produces `tokens.css`, `tokens.json`, `tailwind.config.js`.

### Phase 4: Build HTML

Read the template from `~/.claude/skills/brand-guide/templates/html-template.html`.

Replace all `{{PLACEHOLDER}}` tokens with generated content. Key replacements:

| Placeholder | Content |
|-------------|---------|
| `{{BRAND_NAME}}` | Brand name |
| `{{BRAND_TAGLINE}}` | Tagline or empty |
| `{{FONT_IMPORTS}}` | `@font-face` blocks or Google Fonts `<link>` |
| `{{PRIMARY_COLOR}}` | Primary hex for guide accent |
| `{{CSS_TOKENS}}` | Full CSS custom properties from tokens.css |
| `{{COLOR_PALETTES}}` | Generated color swatch HTML for each palette |
| `{{FONT_SPECIMENS}}` | Typography specimen blocks |
| `{{TYPE_SCALE_DISPLAY}}` | Type scale items rendered at each size |
| `{{TOKENS_CSS}}` | Raw CSS token content for code display |
| `{{TOKENS_JSON}}` | Raw JSON token content for code display |
| `{{TOKENS_TAILWIND}}` | Raw Tailwind config for code display |

For each **color palette**, generate swatch HTML:
```html
<div class="color-palette">
  <h3 class="color-palette-title">Primary</h3>
  <div class="color-scale">
    <div class="color-swatch" style="background:#hex" data-hex="#hex" data-light-text>
      <span class="color-swatch-label">50</span>
      <span class="color-swatch-hex">#hex</span>
    </div>
    <!-- ... 50 through 950 ... -->
  </div>
</div>
```
Add `data-light-text` attribute on swatches darker than 50% lightness.

For **type scale**, generate:
```html
<div class="type-scale-item">
  <span class="type-scale-label">2xl</span>
  <span class="type-scale-size">1.953rem</span>
  <span class="type-scale-sample" style="font-size:1.953rem">The quick brown fox</span>
</div>
```

For **spacing scale**, generate visual bars:
```html
<div class="spacing-item">
  <span class="spacing-label">4</span>
  <div class="spacing-bar" style="width:16px"></div>
  <span class="spacing-value">1rem / 16px</span>
</div>
```

### Phase 5: Write Output

1. Copy `html-styles.css` → `styles.css` (replace `{{PRIMARY_COLOR}}` and `{{CSS_TOKENS}}`)
2. Copy `html-scripts.js` → `scripts.js`
3. Write the assembled HTML → `index.html`
4. Token files already written by generate-tokens.js

### Phase 6: Preview

If preview tools are available, open the HTML file in browser. Otherwise, tell the user:
> Brand guide generated at `./brand-guide-output/index.html`. Open in a browser to view.
> Print to PDF using browser's print dialog (Ctrl/Cmd+P) for the PDF version.

## Section Content Guide

Read `reference/brand-guide-sections.md` for detailed content requirements per section.

**Minimum viable guide** (just name + colors + font): Sections 1, 4, 5, 11
**Standard guide** (+ logo + personality): Add sections 2, 3, 6, 9, 10
**Comprehensive guide** (+ imagery + icons): All 11 sections

Only include sections for which the user has provided relevant inputs. Don't generate empty placeholder sections.

## Reference Files

For detailed specifications, read these as needed:
- `reference/color-system.md` — WCAG standards, tint/shade algorithms, color harmony
- `reference/typography-system.md` — Type scales, font pairing, responsive typography
- `reference/design-tokens-spec.md` — Token formats, naming conventions
- `reference/brand-guide-sections.md` — Section content requirements and best practices

## Quality Checklist

Before delivering, verify:
- [ ] All color pairings pass WCAG AA (4.5:1 for text, 3:1 for large text/UI)
- [ ] Typography scale follows a consistent modular ratio
- [ ] All imported files (logos, fonts, images) are copied to assets/
- [ ] HTML renders correctly and navigation works
- [ ] Dark mode toggle functions
- [ ] Click-to-copy works on color swatches
- [ ] Token files (CSS, JSON, Tailwind) are valid and complete
- [ ] Print stylesheet produces clean PDF output
- [ ] No empty or placeholder sections in the final output
