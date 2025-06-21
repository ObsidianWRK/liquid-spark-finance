# 🖋️ Official Font Configuration

The application uses a single font stack for consistency across all components. This stack is defined in `src/theme/unified.ts` and exposed via a CSS custom property.

```ts
export const vueniTheme = {
  typography: {
    fontFamily: {
      primary:
        '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    },
  },
  // ...
};
```

The `generateCSSProperties()` function exports `--vueni-font-family` so it can be referenced from CSS:

```ts
return {
  '--vueni-font-family': vueniTheme.typography.fontFamily.primary,
  // other properties
};
```

`VueniThemeProvider` applies these properties at runtime and sets the body font:

```tsx
useEffect(() => {
  Object.entries(cssProperties).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
  document.body.style.fontFamily = vueniTheme.typography.fontFamily.primary;
}, [cssProperties]);
```

In `src/index.css` the same stack is applied directly to ensure fonts load immediately:

```css
body,
h1,
h2,
h3,
h4,
h5,
h6,
button,
input,
select,
textarea {
  font-family:
    'SF Pro Display',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    system-ui,
    sans-serif;
}
```

Use the `--vueni-font-family` variable in any new CSS modules to guarantee the stack remains consistent across themes.
