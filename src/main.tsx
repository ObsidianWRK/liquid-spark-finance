// Process polyfill for browser compatibility
declare global {
  interface Window {
    process?: {
      env: Record<string, string | undefined>;
      browser: boolean;
      version: string;
      platform: string;
      nextTick: (fn: (...args: unknown[]) => void) => void;
    };
    global?: typeof globalThis;
  }
}

if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
  (window as any).process = {
    env: {},
    browser: true,
    version: '',
    platform: 'browser',
    nextTick: (fn: (...args: unknown[]) => void) => setTimeout(fn, 0),
  };
}
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './app/styles/scroll-fix.css'; // WHY: Critical fix for double scroll issue - must load after index.css
import { SecurityEnvValidator } from './shared/utils/envValidation';
import './telemetry/vitals.ts'; // Initialize performance monitoring

// Validate security environment before app startup
try {
  SecurityEnvValidator.validateSecurityEnvironment();
  SecurityEnvValidator.logSecurityStatus();
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('CRITICAL SECURITY ERROR:', errorMessage);
  // In development, show a helpful error message
  if (import.meta.env.DEV) {
    document.body.innerHTML = `
      <div style="background: #1a1a1a; color: #ff6b6b; padding: 2rem; font-family: monospace; line-height: 1.6;">
        <h1>🔒 Security Configuration Required</h1>
        <pre style="background: #2a2a2a; padding: 1rem; border-radius: 8px; overflow-x: auto;">
${errorMessage}
        </pre>
        <p>The application cannot start until these security requirements are met.</p>
      </div>
    `;
    throw error;
  }
  // In production, fail gracefully but securely
  throw new Error('Security configuration error');
}

// Add dark mode class to document by default
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(<App />);
