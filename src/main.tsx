// Process polyfill for browser compatibility
interface ProcessPolyfill {
  env: Record<string, string | undefined>;
  browser: boolean;
  version: string;
  platform: 'browser';
  nextTick: (fn: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    process?: ProcessPolyfill;
    global?: typeof globalThis;
  }
}

if (typeof window !== "undefined" && typeof window.process === "undefined") {
  window.process = {
    env: {},
    browser: true,
    version: "",
    platform: "browser" as string,
    nextTick: (fn: (...args: unknown[]) => void) => setTimeout(fn, 0)
  };
}
if (typeof window !== "undefined" && typeof window.global === "undefined") {
  window.global = window;
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SecurityEnvValidator } from './utils/envValidation'

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

createRoot(document.getElementById("root")!).render(
  <App />
);