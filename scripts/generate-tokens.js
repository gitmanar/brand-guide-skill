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
  const baseIndex = 2; // 'base' is at index 2

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

function generateCSS(brandData) {
  const lines = [':root {'];

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

  lines.push('}');
  return lines.join('\n');
}

function generateJSON(brandData) {
  const tokens = { color: {}, font: {}, space: {}, radius: {}, shadow: {}, motion: {} };

  // Colors
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

  return tokens;
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

  return { css: 'tokens.css', json: 'tokens.json', tailwind: 'tailwind.config.js' };
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

module.exports = { generateCSS, generateJSON, generateTailwindConfig, writeTokens, generateTypeScale, generateSpacingScale };
