# Brand Guide Sections Reference

## Section Order & Content

### 1. Cover / Hero
- Brand name, tagline, version date
- Primary brand color as background, logo centered
- "Brand Guidelines" or "Brand Identity System" title

### 2. Brand Story
- Mission statement (1-2 sentences: why the company exists)
- Vision statement (1-2 sentences: the future state)
- Core values (3-5 values with 1-line descriptions)
- Brand personality (3-5 adjectives: e.g., "Bold, Approachable, Innovative")
- If user provides none, prompt for at minimum: brand name + 1-line description

### 3. Logo Usage
- **Primary logo**: full-color on light/dark backgrounds
- **Alternate marks**: horizontal, stacked, icon-only, wordmark-only
- **Clear space**: minimum padding = height of a defining letter (e.g., "x-height" of the logotype)
- **Minimum sizes**: print (25mm wide) and digital (80px wide)
- **Color variations**: full-color, single-color, reversed (white), monochrome (black)
- **Misuse examples**: stretch, rotate, recolor, add effects, crop, low contrast placement
- Show DO and DON'T side-by-side

### 4. Color System
Read `color-system.md` for detailed algorithms.
- **Primary palette**: 1-3 hero colors with hex, RGB, HSL, CMYK
- **Secondary palette**: supporting colors
- **Accent palette**: call-to-action, highlights
- **Neutral palette**: grays, backgrounds, text colors
- **Semantic colors**: success (green), warning (amber), error (red), info (blue)
- **Tints & shades**: 50-950 scale per color (like Tailwind)
- **Accessibility matrix**: show contrast ratios between common pairings
- **Dark mode palette**: inverted assignments
- Display each color as a large swatch with all format values

### 5. Typography
Read `typography-system.md` for scale calculations.
- **Primary font**: headlines, hero text — show specimen (Aa Bb Cc ... 0-9)
- **Secondary font**: body text — show specimen
- **Monospace font** (optional): code blocks
- **Type scale**: display all sizes from xs to 5xl with actual rendered examples
- **Weight scale**: show all available weights
- **Line height & letter spacing**: per size
- **Pairing rules**: which font for which context
- **Web loading**: `@font-face` declarations, `font-display: swap`

### 6. Spacing & Layout
- **Base unit**: typically 4px or 8px
- **Spacing scale**: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 (× base unit)
- **Grid system**: 12-column, gutter width, max content width
- **Breakpoints**: mobile (375), tablet (768), desktop (1024), wide (1440)
- **Border radius tokens**: none, sm, md, lg, xl, full
- Show visual spacing blocks

### 7. Imagery & Photography
- **Style direction**: mood, lighting, composition preferences
- **Color treatment**: filters, overlays, saturation level
- **Subject matter**: people, products, abstract, lifestyle
- **Composition rules**: rule of thirds, focal points, negative space
- **Do/Don't**: examples of on-brand vs off-brand imagery
- If user provides sample images, display them as reference

### 8. Iconography
- **Style**: outlined, filled, duotone, or custom
- **Grid**: icon base size (24px), padding, stroke width
- **Color rules**: when to use brand colors vs neutral
- **Sizing**: sm (16), md (20), lg (24), xl (32)
- If user provides icon files, showcase them

### 9. Voice & Tone
- **Brand personality** in writing: 3-5 descriptors
- **Tone spectrum**: formal ←→ casual, serious ←→ playful, etc.
- **Do/Don't word lists**: preferred terms vs avoided terms
- **Example copy**: headlines, CTAs, error messages, empty states
- **Audience awareness**: how tone shifts for different contexts

### 10. UI Components
- **Buttons**: primary, secondary, ghost, destructive — with hover/active/disabled states
- **Form inputs**: text field, select, checkbox, radio — with focus/error states
- **Cards**: content container with image, title, description
- **Badges/tags**: status indicators
- All rendered using the brand's actual colors, fonts, and spacing tokens

### 11. Design Tokens Reference
- Complete token list in a scannable table
- Organized by category: color, typography, spacing, elevation, border, motion
- Code snippets: CSS custom properties, JSON, Tailwind config
- Copy buttons for each value

## Section Completeness

**Minimum viable guide** (brand name + colors + font):
Sections 1, 4, 5, 11 — cover, colors, typography, tokens

**Standard guide** (+ logo + personality):
Add sections 2, 3, 6, 9, 10

**Comprehensive guide** (+ imagery + icons):
All 11 sections
