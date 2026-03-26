#!/usr/bin/env node
/**
 * Brand Guide — Design Token Generator
 * Generates CSS custom properties, W3C JSON tokens, and Tailwind config
 * from brand palette and typography data.
 *
 * Usage: node generate-tokens.js <brand-data.json> <output-dir>
 */

const fs = require('fs');
const path = require('path');

function generateTypeScale(baseSize = 16, ratio = 1.25) {
  const sizes = {};
  const names = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
  const baseIndex = names.indexOf('base');

  for (let i = 0; i < names.length; i++) {
    const power = i - baseIndex;
    const px = baseSize * Math.pow(ratio, power);
    const rem = px / 16;
    sizes[names[i]] = {
      px: Math.round(px * 100) / 100,
      rem: Math.round(rem * 1000) / 1000,
      value: `${Math.round(rem * 1000) / 1000}rem`
    };
  }
  return sizes;
}

function generateSpacingScale(baseUnit = 4) {
  const multipliers = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64];
  const scale = {};
  for (const m of multipliers) {
    const px = baseUnit * m;
    scale[m] = {
      px,
      rem: px / 16,
      value: px === 0 ? '0' : `${px / 16}rem`
    };
  }
  return scale;
}

function generateCSSDeclarations(brandData) {
  // Returns only the inner declarations (no :root wrapper)
  // for embedding inside an existing :root {} block.
  const lines = [];
  return _buildCSSLines(brandData, lines);
}

function generateCSS(brandData) {
  const lines = [':root {'];
  _buildCSSLines(brandData, lines);
  lines.push('}');
  lines.push('');
  lines.push(generateSemanticDarkCSS(brandData));
  return lines.join('\n');
}

function _buildCSSLines(brandData, lines) {

  // Colors
  if (brandData.palette) {
    lines.push('  /* Colors */');
    for (const [role, data] of Object.entries(brandData.palette)) {
      if (role.startsWith('_')) continue;
      if (data.scale) {
        for (const [stop, hex] of Object.entries(data.scale)) {
          lines.push(`  --color-${role}-${stop}: ${hex};`);
        }
      }
    }
    lines.push('');
  }

  // Typography
  lines.push('  /* Typography */');
  if (brandData.fonts) {
    if (brandData.fonts.display) lines.push(`  --font-family-display: '${brandData.fonts.display}', sans-serif;`);
    if (brandData.fonts.body) lines.push(`  --font-family-body: '${brandData.fonts.body}', sans-serif;`);
    if (brandData.fonts.mono) lines.push(`  --font-family-mono: '${brandData.fonts.mono}', monospace;`);
  }

  const typeScale = generateTypeScale(brandData.baseFontSize || 16, brandData.typeRatio || 1.25);
  for (const [name, size] of Object.entries(typeScale)) {
    lines.push(`  --font-size-${name}: ${size.value};`);
  }

  lines.push('  --line-height-tight: 1.15;');
  lines.push('  --line-height-snug: 1.3;');
  lines.push('  --line-height-normal: 1.5;');
  lines.push('  --line-height-relaxed: 1.625;');
  lines.push('  --letter-spacing-tight: -0.02em;');
  lines.push('  --letter-spacing-normal: 0;');
  lines.push('  --letter-spacing-wide: 0.05em;');
  lines.push('  --font-weight-regular: 400;');
  lines.push('  --font-weight-medium: 500;');
  lines.push('  --font-weight-semibold: 600;');
  lines.push('  --font-weight-bold: 700;');
  lines.push('');

  // Spacing
  lines.push('  /* Spacing */');
  const spacing = generateSpacingScale(brandData.baseSpacingUnit || 4);
  for (const [m, s] of Object.entries(spacing)) {
    lines.push(`  --space-${m}: ${s.value};`);
  }
  lines.push('');

  // Border Radius
  lines.push('  /* Border Radius */');
  lines.push('  --radius-none: 0;');
  lines.push('  --radius-sm: 0.25rem;');
  lines.push('  --radius-md: 0.5rem;');
  lines.push('  --radius-lg: 0.75rem;');
  lines.push('  --radius-xl: 1rem;');
  lines.push('  --radius-2xl: 1.5rem;');
  lines.push('  --radius-full: 9999px;');
  lines.push('');

  // Shadows
  lines.push('  /* Elevation */');
  lines.push('  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);');
  lines.push('  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);');
  lines.push('  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);');
  lines.push('  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);');
  lines.push('');

  // Motion
  lines.push('  /* Motion */');
  lines.push('  --duration-fast: 150ms;');
  lines.push('  --duration-normal: 300ms;');
  lines.push('  --duration-slow: 500ms;');
  lines.push('  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);');
  lines.push('  --easing-in: cubic-bezier(0.4, 0, 1, 1);');
  lines.push('  --easing-out: cubic-bezier(0, 0, 0.2, 1);');
  lines.push('');

  // Semantic tokens (light mode defaults)
  lines.push('  /* Semantic Tokens — Light Mode */');
  if (brandData.palette) {
    const primary = brandData.palette.primary ? 'primary' : Object.keys(brandData.palette).find(k => !k.startsWith('_'));
    if (primary) {
      lines.push(`  --color-action-primary: var(--color-${primary}-500);`);
      lines.push(`  --color-action-primary-hover: var(--color-${primary}-600);`);
      lines.push(`  --color-action-primary-active: var(--color-${primary}-700);`);
      lines.push(`  --color-action-primary-subtle: var(--color-${primary}-50);`);
    }
    lines.push('  --color-surface-page: var(--color-neutral-50);');
    lines.push('  --color-surface-default: #ffffff;');
    lines.push('  --color-surface-raised: #ffffff;');
    lines.push('  --color-surface-overlay: rgba(0,0,0,0.5);');
    lines.push('  --color-text-primary: var(--color-neutral-900);');
    lines.push('  --color-text-secondary: var(--color-neutral-600);');
    lines.push('  --color-text-tertiary: var(--color-neutral-500);');
    lines.push('  --color-text-disabled: var(--color-neutral-400);');
    lines.push('  --color-text-inverse: var(--color-neutral-50);');
    if (primary) {
      lines.push(`  --color-text-link: var(--color-${primary}-500);`);
      lines.push(`  --color-text-link-hover: var(--color-${primary}-600);`);
    }
    lines.push('  --color-border-default: var(--color-neutral-200);');
    lines.push('  --color-border-subtle: var(--color-neutral-100);');
    lines.push('  --color-border-strong: var(--color-neutral-400);');
    if (primary) {
      lines.push(`  --color-border-focus: var(--color-${primary}-500);`);
    }
    // Semantic status colors
    lines.push('  --color-success: var(--color-success-500);');
    lines.push('  --color-success-subtle: var(--color-success-50);');
    lines.push('  --color-warning: var(--color-warning-500);');
    lines.push('  --color-warning-subtle: var(--color-warning-50);');
    lines.push('  --color-error: var(--color-error-500);');
    lines.push('  --color-error-subtle: var(--color-error-50);');
    lines.push('  --color-info: var(--color-info-500);');
    lines.push('  --color-info-subtle: var(--color-info-50);');
  }

  return lines.join('\n');
}

function generateSemanticDarkCSS(brandData) {
  const lines = [];
  lines.push('[data-theme="dark"] {');
  if (brandData.palette) {
    const primary = brandData.palette.primary ? 'primary' : Object.keys(brandData.palette).find(k => !k.startsWith('_'));
    lines.push('  /* Semantic Tokens — Dark Mode */');
    if (primary) {
      lines.push(`  --color-action-primary: var(--color-${primary}-400);`);
      lines.push(`  --color-action-primary-hover: var(--color-${primary}-300);`);
      lines.push(`  --color-action-primary-active: var(--color-${primary}-200);`);
      lines.push(`  --color-action-primary-subtle: var(--color-${primary}-950);`);
    }
    lines.push('  --color-surface-page: var(--color-neutral-950);');
    lines.push('  --color-surface-default: var(--color-neutral-900);');
    lines.push('  --color-surface-raised: var(--color-neutral-800);');
    lines.push('  --color-surface-overlay: rgba(0,0,0,0.7);');
    lines.push('  --color-text-primary: var(--color-neutral-50);');
    lines.push('  --color-text-secondary: var(--color-neutral-400);');
    lines.push('  --color-text-tertiary: var(--color-neutral-500);');
    lines.push('  --color-text-disabled: var(--color-neutral-600);');
    lines.push('  --color-text-inverse: var(--color-neutral-900);');
    if (primary) {
      lines.push(`  --color-text-link: var(--color-${primary}-400);`);
      lines.push(`  --color-text-link-hover: var(--color-${primary}-300);`);
    }
    lines.push('  --color-border-default: var(--color-neutral-700);');
    lines.push('  --color-border-subtle: var(--color-neutral-800);');
    lines.push('  --color-border-strong: var(--color-neutral-500);');
    if (primary) {
      lines.push(`  --color-border-focus: var(--color-${primary}-400);`);
    }
    lines.push('  --color-success: var(--color-success-400);');
    lines.push('  --color-success-subtle: var(--color-success-950);');
    lines.push('  --color-warning: var(--color-warning-400);');
    lines.push('  --color-warning-subtle: var(--color-warning-950);');
    lines.push('  --color-error: var(--color-error-400);');
    lines.push('  --color-error-subtle: var(--color-error-950);');
    lines.push('  --color-info: var(--color-info-400);');
    lines.push('  --color-info-subtle: var(--color-info-950);');
  }
  lines.push('}');
  return lines.join('\n');
}

function generateJSON(brandData) {
  const tokens = { color: {}, semantic: { light: {}, dark: {} }, font: {}, space: {}, radius: {}, shadow: {}, motion: {} };

  // Primitive colors
  if (brandData.palette) {
    for (const [role, data] of Object.entries(brandData.palette)) {
      if (role.startsWith('_')) continue;
      tokens.color[role] = {};
      if (data.scale) {
        for (const [stop, hex] of Object.entries(data.scale)) {
          tokens.color[role][stop] = { $value: hex, $type: 'color' };
        }
      }
    }

    // Semantic tokens
    const primary = brandData.palette.primary ? 'primary' : Object.keys(brandData.palette).find(k => !k.startsWith('_'));
    if (primary) {
      tokens.semantic.light = {
        'action-primary': { $value: `{color.${primary}.500}`, $type: 'color' },
        'surface-page': { $value: '{color.neutral.50}', $type: 'color' },
        'surface-default': { $value: '#ffffff', $type: 'color' },
        'text-primary': { $value: '{color.neutral.900}', $type: 'color' },
        'text-secondary': { $value: '{color.neutral.600}', $type: 'color' },
        'border-default': { $value: '{color.neutral.200}', $type: 'color' },
      };
      tokens.semantic.dark = {
        'action-primary': { $value: `{color.${primary}.400}`, $type: 'color' },
        'surface-page': { $value: '{color.neutral.950}', $type: 'color' },
        'surface-default': { $value: '{color.neutral.900}', $type: 'color' },
        'text-primary': { $value: '{color.neutral.50}', $type: 'color' },
        'text-secondary': { $value: '{color.neutral.400}', $type: 'color' },
        'border-default': { $value: '{color.neutral.700}', $type: 'color' },
      };
    }
  }

  // Typography
  tokens.font.family = {};
  if (brandData.fonts) {
    if (brandData.fonts.display) tokens.font.family.display = { $value: `${brandData.fonts.display}, sans-serif`, $type: 'fontFamily' };
    if (brandData.fonts.body) tokens.font.family.body = { $value: `${brandData.fonts.body}, sans-serif`, $type: 'fontFamily' };
    if (brandData.fonts.mono) tokens.font.family.mono = { $value: `${brandData.fonts.mono}, monospace`, $type: 'fontFamily' };
  }

  tokens.font.size = {};
  const typeScale = generateTypeScale(brandData.baseFontSize || 16, brandData.typeRatio || 1.25);
  for (const [name, size] of Object.entries(typeScale)) {
    tokens.font.size[name] = { $value: size.value, $type: 'dimension' };
  }

  // Spacing
  const spacing = generateSpacingScale(brandData.baseSpacingUnit || 4);
  for (const [m, s] of Object.entries(spacing)) {
    tokens.space[m] = { $value: s.value, $type: 'dimension' };
  }

  // Radius
  tokens.radius = {
    none: { $value: '0', $type: 'dimension' },
    sm: { $value: '0.25rem', $type: 'dimension' },
    md: { $value: '0.5rem', $type: 'dimension' },
    lg: { $value: '0.75rem', $type: 'dimension' },
    xl: { $value: '1rem', $type: 'dimension' },
    '2xl': { $value: '1.5rem', $type: 'dimension' },
    full: { $value: '9999px', $type: 'dimension' },
  };

  // Shadows
  tokens.shadow = {
    sm: { $value: '0 1px 2px rgba(0,0,0,0.05)', $type: 'shadow' },
    md: { $value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)', $type: 'shadow' },
    lg: { $value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', $type: 'shadow' },
    xl: { $value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', $type: 'shadow' },
  };

  // Motion
  tokens.motion = {
    'duration-fast': { $value: '150ms', $type: 'duration' },
    'duration-normal': { $value: '300ms', $type: 'duration' },
    'duration-slow': { $value: '500ms', $type: 'duration' },
    'easing-default': { $value: 'cubic-bezier(0.4, 0, 0.2, 1)', $type: 'cubicBezier' },
    'easing-in': { $value: 'cubic-bezier(0.4, 0, 1, 1)', $type: 'cubicBezier' },
    'easing-out': { $value: 'cubic-bezier(0, 0, 0.2, 1)', $type: 'cubicBezier' },
  };

  return tokens;
}

function generateSCSS(brandData) {
  const lines = ['// Brand Design Tokens — SCSS Variables', '// Generated by brand-guide skill', ''];

  // Colors
  if (brandData.palette) {
    lines.push('// Colors');
    for (const [role, data] of Object.entries(brandData.palette)) {
      if (role.startsWith('_')) continue;
      if (data.scale) {
        for (const [stop, hex] of Object.entries(data.scale)) {
          lines.push(`$color-${role}-${stop}: ${hex};`);
        }
      }
    }
    lines.push('');

    // Color maps for programmatic access
    for (const [role, data] of Object.entries(brandData.palette)) {
      if (role.startsWith('_') || !data.scale) continue;
      const entries = Object.entries(data.scale).map(([stop, hex]) => `  ${stop}: ${hex}`).join(',\n');
      lines.push(`$${role}-colors: (\n${entries}\n);`);
    }
    lines.push('');
  }

  // Typography
  lines.push('// Typography');
  if (brandData.fonts) {
    if (brandData.fonts.display) lines.push(`$font-family-display: '${brandData.fonts.display}', sans-serif;`);
    if (brandData.fonts.body) lines.push(`$font-family-body: '${brandData.fonts.body}', sans-serif;`);
    if (brandData.fonts.mono) lines.push(`$font-family-mono: '${brandData.fonts.mono}', monospace;`);
  }
  const typeScale = generateTypeScale(brandData.baseFontSize || 16, brandData.typeRatio || 1.25);
  for (const [name, size] of Object.entries(typeScale)) {
    lines.push(`$font-size-${name}: ${size.value};`);
  }
  lines.push('');

  // Spacing
  lines.push('// Spacing');
  const spacing = generateSpacingScale(brandData.baseSpacingUnit || 4);
  for (const [m, s] of Object.entries(spacing)) {
    lines.push(`$space-${m}: ${s.value};`);
  }
  lines.push('');

  // Radius
  lines.push('// Border Radius');
  lines.push('$radius-none: 0;');
  lines.push('$radius-sm: 0.25rem;');
  lines.push('$radius-md: 0.5rem;');
  lines.push('$radius-lg: 0.75rem;');
  lines.push('$radius-xl: 1rem;');
  lines.push('$radius-2xl: 1.5rem;');
  lines.push('$radius-full: 9999px;');

  return lines.join('\n');
}

function generateTailwindConfig(brandData) {
  const config = {
    colors: {},
    fontFamily: {},
    fontSize: {},
    spacing: {},
    borderRadius: {},
    boxShadow: {}
  };

  // Colors
  if (brandData.palette) {
    for (const [role, data] of Object.entries(brandData.palette)) {
      if (role.startsWith('_')) continue;
      config.colors[role] = {};
      if (data.scale) {
        for (const [stop, hex] of Object.entries(data.scale)) {
          config.colors[role][stop] = `var(--color-${role}-${stop})`;
        }
      }
    }
  }

  // Fonts
  if (brandData.fonts) {
    if (brandData.fonts.display) config.fontFamily.display = [`'${brandData.fonts.display}'`, 'sans-serif'];
    if (brandData.fonts.body) config.fontFamily.body = [`'${brandData.fonts.body}'`, 'sans-serif'];
    if (brandData.fonts.mono) config.fontFamily.mono = [`'${brandData.fonts.mono}'`, 'monospace'];
  }

  // Type scale
  const typeScale = generateTypeScale(brandData.baseFontSize || 16, brandData.typeRatio || 1.25);
  for (const [name, size] of Object.entries(typeScale)) {
    config.fontSize[name] = size.value;
  }

  // Spacing
  const spacing = generateSpacingScale(brandData.baseSpacingUnit || 4);
  for (const [m, s] of Object.entries(spacing)) {
    config.spacing[m] = s.value;
  }

  // Border radius
  config.borderRadius = { none: '0', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.5rem', full: '9999px' };

  // Shadows
  config.boxShadow = {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
  };

  const lines = [
    '/** @type {import("tailwindcss").Config} */',
    'module.exports = {',
    '  theme: {',
    '    extend: ' + JSON.stringify(config, null, 6).replace(/^/gm, '    ').trim(),
    '  },',
    '};'
  ];

  return lines.join('\n');
}

function writeTokens(brandData, outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });

  const cssContent = generateCSS(brandData);
  fs.writeFileSync(path.join(outputDir, 'tokens.css'), cssContent);

  const jsonContent = generateJSON(brandData);
  fs.writeFileSync(path.join(outputDir, 'tokens.json'), JSON.stringify(jsonContent, null, 2));

  const tailwindContent = generateTailwindConfig(brandData);
  fs.writeFileSync(path.join(outputDir, 'tailwind.config.js'), tailwindContent);

  const scssContent = generateSCSS(brandData);
  fs.writeFileSync(path.join(outputDir, 'tokens.scss'), scssContent);

  return { css: 'tokens.css', json: 'tokens.json', tailwind: 'tailwind.config.js', scss: 'tokens.scss' };
}

// CLI entry
if (require.main === module) {
  const [,, inputFile, outputDir] = process.argv;
  if (!inputFile || !outputDir) {
    console.error('Usage: node generate-tokens.js <brand-data.json> <output-dir>');
    process.exit(1);
  }
  const brandData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const files = writeTokens(brandData, outputDir);
  console.log('Generated:', JSON.stringify(files));
}

module.exports = { generateCSS, generateCSSDeclarations, generateSemanticDarkCSS, generateJSON, generateTailwindConfig, generateSCSS, writeTokens, generateTypeScale, generateSpacingScale };
