#!/usr/bin/env node
/**
 * Brand Guide — Color Palette Generator
 * Generates tints, shades, and accessibility data from base colors.
 *
 * Usage: node generate-palette.js '{"primary":"#2563eb","secondary":"#7c3aed"}'
 * Output: JSON with full palette scales + contrast matrix
 */

function hexToRGB(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(c => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('');
}

function rgbToHSL(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRGB(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const c1 = hexToRGB(hex1), c2 = hexToRGB(hex2);
  const l1 = relativeLuminance(c1.r, c1.g, c1.b);
  const l2 = relativeLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagLevel(ratio) {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA-large';
  return 'Fail';
}

function generateScale(hex) {
  const rgb = hexToRGB(hex);
  const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);

  const stops = [
    { name: '50',  l: 97, sMod: 1.1 },
    { name: '100', l: 94, sMod: 1.05 },
    { name: '200', l: 86, sMod: 1.0 },
    { name: '300', l: 74, sMod: 1.0 },
    { name: '400', l: 60, sMod: 1.0 },
    { name: '500', l: hsl.l, sMod: 1.0 },
    { name: '600', l: hsl.l * 0.8, sMod: 1.0 },
    { name: '700', l: hsl.l * 0.6, sMod: 1.0 },
    { name: '800', l: hsl.l * 0.4, sMod: 1.05 },
    { name: '900', l: hsl.l * 0.25, sMod: 1.1 },
    { name: '950', l: hsl.l * 0.15, sMod: 1.2 },
  ];

  const scale = {};
  for (const stop of stops) {
    const s = Math.min(hsl.s * stop.sMod, 100);
    const { r, g, b } = hslToRGB(hsl.h, s, stop.l);
    scale[stop.name] = rgbToHex(r, g, b);
  }
  return scale;
}

function generateComplementary(hex) {
  const rgb = hexToRGB(hex);
  const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);
  const comp = hslToRGB((hsl.h + 180) % 360, hsl.s, hsl.l);
  return rgbToHex(comp.r, comp.g, comp.b);
}

function generateAnalogous(hex) {
  const rgb = hexToRGB(hex);
  const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);
  const a1 = hslToRGB((hsl.h + 30) % 360, hsl.s, hsl.l);
  const a2 = hslToRGB((hsl.h + 330) % 360, hsl.s, hsl.l);
  return [rgbToHex(a1.r, a1.g, a1.b), rgbToHex(a2.r, a2.g, a2.b)];
}

function generateNeutralScale(primaryHex) {
  const rgb = hexToRGB(primaryHex);
  const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);
  // Neutrals inherit a hint of the primary hue, very low saturation
  const neutralHue = hsl.h;
  const neutralSat = Math.min(hsl.s * 0.1, 8);

  const stops = {
    '50': 98, '100': 96, '200': 90, '300': 83, '400': 64,
    '500': 45, '600': 32, '700': 25, '800': 15, '900': 10, '950': 5
  };

  const scale = {};
  for (const [name, l] of Object.entries(stops)) {
    const { r, g, b } = hslToRGB(neutralHue, neutralSat, l);
    scale[name] = rgbToHex(r, g, b);
  }
  return scale;
}

// Main
function generateFullPalette(colors) {
  const palette = {};

  // Generate scales for each provided color
  for (const [role, hex] of Object.entries(colors)) {
    palette[role] = {
      base: hex,
      scale: generateScale(hex)
    };
  }

  // Generate neutral scale from primary
  const primaryHex = colors.primary || Object.values(colors)[0];
  palette.neutral = {
    base: '#737373',
    scale: generateNeutralScale(primaryHex)
  };

  // Generate semantic colors if not provided
  if (!colors.success) palette.success = { base: '#22c55e', scale: generateScale('#22c55e') };
  if (!colors.warning) palette.warning = { base: '#f59e0b', scale: generateScale('#f59e0b') };
  if (!colors.error) palette.error = { base: '#ef4444', scale: generateScale('#ef4444') };
  if (!colors.info) palette.info = { base: '#3b82f6', scale: generateScale('#3b82f6') };

  // Suggestions if palette is thin (fewer than 3 colors)
  if (Object.keys(colors).length < 3) {
    palette._suggestions = {
      complementary: generateComplementary(primaryHex),
      analogous: generateAnalogous(primaryHex)
    };
  }

  // Contrast matrix
  const allColors = {};
  for (const [role, data] of Object.entries(palette)) {
    if (role === '_suggestions') continue;
    allColors[`${role}-500`] = data.scale?.['500'] || data.base;
    if (data.scale) {
      allColors[`${role}-50`] = data.scale['50'];
      allColors[`${role}-900`] = data.scale['900'];
    }
  }

  const contrastMatrix = {};
  const keys = Object.keys(allColors);
  for (const k1 of keys) {
    contrastMatrix[k1] = {};
    for (const k2 of keys) {
      const ratio = contrastRatio(allColors[k1], allColors[k2]);
      contrastMatrix[k1][k2] = {
        ratio: Math.round(ratio * 100) / 100,
        level: wcagLevel(ratio)
      };
    }
  }

  palette._contrastMatrix = contrastMatrix;
  return palette;
}

// CLI entry
if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node generate-palette.js \'{"primary":"#2563eb"}\'');
    process.exit(1);
  }
  const colors = JSON.parse(input);
  console.log(JSON.stringify(generateFullPalette(colors), null, 2));
}

module.exports = { generateFullPalette, generateScale, contrastRatio, wcagLevel, hexToRGB, rgbToHex, rgbToHSL, hslToRGB, relativeLuminance };
