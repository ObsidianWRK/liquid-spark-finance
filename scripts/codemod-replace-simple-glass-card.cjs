#!/usr/bin/env node
/*
  Replace SimpleGlassCard with Card from '@/components/ui'.
  1. Rewrites import lines.
  2. Renames JSX usage <SimpleGlassCard ...> to <Card ...>.
  Usage:  node scripts/codemod-replace-simple-glass-card.js
*/

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const projectRoot = path.resolve(__dirname, '..');
const pattern = 'src/**/*.{ts,tsx}';

const files = glob.sync(pattern, { cwd: projectRoot, absolute: true });
let edited = 0;

files.forEach((file) => {
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes('SimpleGlassCard')) return;

  // Replace import line
  text = text.replace(/import\s+SimpleGlassCard\s+from\s+(['"])(.*?)SimpleGlassCard['"];?/g,
    "import { Card } from '@/components/ui';");

  // Replace JSX tags
  text = text.replace(/<SimpleGlassCard(.*?)>/g, '<Card$1>');
  text = text.replace(/<\/SimpleGlassCard>/g, '</Card>');

  fs.writeFileSync(file, text, 'utf8');
  edited++;
});

console.log(`Codemod complete. Updated ${edited} file(s).`); 