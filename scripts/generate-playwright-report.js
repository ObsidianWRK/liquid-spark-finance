import fs from 'fs';
import path from 'path';

const resultsPath = path.resolve('test-results/test-results.json');
if (!fs.existsSync(resultsPath)) {
  console.error('❌ No Playwright JSON results found at', resultsPath);
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const reportJson = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

// Collect failed tests across projects.
const failures = [];
for (const suite of reportJson.suites ?? []) {
  traverseSuite(suite);
}

function traverseSuite(suite) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      for (const result of test.results ?? []) {
        if (result.status !== 'passed') {
          failures.push({
            project: test.projectName,
            title: spec.title,
            error: result.errors?.map((e) => e.message).join('\n') || 'Unknown error',
            screenshot: findScreenshot(result.attachments || []),
          });
        }
      }
    }
  }
  for (const child of suite.suites ?? []) traverseSuite(child);
}

function findScreenshot(attachments) {
  const shot = attachments.find((a) => a.name === 'screenshot' || a.contentType === 'image/png');
  return shot?.path || '';
}

// Build markdown summary.
const lines = [];
lines.push('## 🚨 Playwright Audit Summary');
lines.push('');
if (failures.length === 0) {
  lines.push('🎉 **All tests passed without errors across all viewports!**');
} else {
  lines.push('| Viewport | Test | Error | Screenshot |');
  lines.push('|----------|------|-------|------------|');
  for (const f of failures) {
    const shot = f.screenshot ? `![](${f.screenshot})` : '—';
    lines.push(`| ${f.project} | ${f.title} | ${escapePipe(f.error)} | ${shot} |`);
  }
}
lines.push('');
lines.push(`_Generated: ${new Date().toUTCString()}_`);

function escapePipe(text) {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

const markdown = lines.join('\n');
const outPath = '/tmp/playwright-audit.md';
fs.writeFileSync(outPath, markdown);
console.log(`📄 Audit report written to ${outPath}`);
console.log('\n' + markdown + '\n'); 