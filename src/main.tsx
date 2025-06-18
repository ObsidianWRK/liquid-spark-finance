// Process polyfill for browser compatibility
if (typeof window !== "undefined" && typeof (window as any).process === "undefined") {
  (window as any).process = {
    env: {},
    browser: true,
    version: "",
    platform: "browser",
    nextTick: (fn: Function) => setTimeout(fn, 0)
  };
}
if (typeof window !== "undefined" && typeof (window as any).global === "undefined") {
  (window as any).global = window;
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
  console.error('CRITICAL SECURITY ERROR:', error.message);
  // In development, show a helpful error message
  if (import.meta.env.DEV) {
    document.body.innerHTML = `
      <div style="background: #1a1a1a; color: #ff6b6b; padding: 2rem; font-family: monospace; line-height: 1.6;">
        <h1>🔒 Security Configuration Required</h1>
        <pre style="background: #2a2a2a; padding: 1rem; border-radius: 8px; overflow-x: auto;">
${error.message}
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