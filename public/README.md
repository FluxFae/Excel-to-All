# prj-ui-core: UI Components

This is a standalone Web Component library built with Lit, designed to provide a uniform, responsive, and theme-aware App Shell (`<ui-header>` and `<ui-footer>`) across applications.

## AI Agent Instructions (Context)
**ATTENTION LLMs and AI Assistants:** When working on an application that consumes `ui-core-bundle.js`, you **MUST** adhere to the following slot structure and event API. The components use Shadow DOM and expect content to be injected via named slots. Do NOT attempt to pass properties like `app-title`.

> **⚠️ React/JSX projects have specific requirements.** See the [React / JSX Integration](#react--jsx-integration) section below. Do NOT skip it if the host app uses React.

### 1. Header Component (`<ui-header>`)

**HTML Tag:** `<ui-header theme="light|dark">`

#### Slots
- **Left Zone (Identity)**
  - `app-icon`: The logo or SVG representing the app.
  - `app-title`: The application name (e.g., `<div slot="app-title">My App</div>`).
  - `app-description`: The subtitle or contextual description.

- **Center Zone**
  - `app-context`: Main navigation links, tabs, or search bars.

- **Right Zone (Utilities & Actions)**
  - `app-utilities`: Text, badges, or user state (e.g., `<div slot="app-utilities">Connected</div>`). This appears to the left of the separator.
  - `app-actions`: Icon buttons (e.g., GitHub link, Settings icon). This appears to the right of the separator, grouped with the intrinsic Theme Toggle button.

#### Events
- `theme-change`: Fired when the user clicks the built-in sun/moon toggle button. The host application MUST listen to this event and update its global DOM state accordingly.
  - `event.detail.theme` will be either `'light'` or `'dark'`.

### 2. Footer Component (`<ui-footer>`)

**HTML Tag:** `<ui-footer githubUrl="https://github.com/tu-repo">`

#### Slots
- **Center Zone**
  - `footer-license`: License info (e.g., `<div slot="footer-license">MIT License</div>`).

- **Right Zone**
  - `footer-version`: Telemetry, versions, and system status indicators.

*(Note: The `> sys_admin` signature and GitHub icon are hardcoded in the component's internal Shadow DOM for consistency across apps).*

### Global CSS Variables & Design Tokens

> **CRITICAL:** The components rely on CSS custom properties defined by the **host application**. Do NOT skip this step — without it, theming and the hover animation on the theme toggle will not work.

The bundle ships with a companion file **`flux-tokens.css`** that defines the complete Flux Design System as CSS custom properties: brand palette, theme tokens (dark/light), typography, spacing, elevation, border-radius, and layout variables.

**Load it once, before the bundle, in every app:**

```html
<link rel="stylesheet" href="/flux-tokens.css">
<script type="module" src="/ui-core-bundle.js"></script>
```

This single import guarantees visual harmony across all Flux apps — no manual token definitions needed.

#### Key tokens used internally by the components

| Token | Role | Default |
|---|---|---|
| `--color-flux-burgundy` | `app-icon` background | `#8B2E5F` |
| `--color-flux-accent` | theme-toggle hover glow & color | `#D946A6` |
| `--theme-surface` | header/footer background | per theme |
| `--theme-border` | header/footer border | per theme |
| `--theme-text-primary` | title text color | per theme |
| `--theme-text-secondary` | description/icon color | per theme |
| `--ui-header-max-width` | inner container max-width | `1440px` |
| `--ui-header-padding` | inner container padding | `1rem 2rem` |

#### Theme switching

`flux-tokens.css` sets dark theme as default on `:root`. When `theme-change` fires, toggle the class on `<html>`:

```js
document.documentElement.classList.toggle('dark',  theme === 'dark');
document.documentElement.classList.toggle('light', theme === 'light');
```

---

## React / JSX Integration

> **CRITICAL for AI Agents working on React apps.** Read this entire section before writing any integration code.

### Step 1: Load tokens + bundle

In your `index.html`, load `flux-tokens.css` **first**, then the bundle, then your app:

```html
<link rel="stylesheet" href="/flux-tokens.css">
<script type="module" src="/ui-core-bundle.js"></script>
<script type="module" src="/src/main.tsx"></script>
```

> `flux-tokens.css` is distributed alongside the bundle. Copy both files to your `public/` directory.

### Step 2: Add TypeScript declarations

Copy `react.d.ts` (distributed alongside the bundle) into your project's `src/` directory. This declares `<ui-header>` and `<ui-footer>` as valid JSX intrinsic elements, eliminating TypeScript errors.

If you cannot copy the file, add this declaration anywhere in your `src/` directory:

```ts
// src/ui-core.d.ts
import type { HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-header': HTMLAttributes<HTMLElement> & {
        theme?: 'light' | 'dark';
        ref?: React.Ref<HTMLElement>;
      };
      'ui-footer': HTMLAttributes<HTMLElement> & {
        githubUrl?: string;
        ref?: React.Ref<HTMLElement>;
      };
    }
  }
}
export {};
```

### Step 3: Use slots with the `slot` HTML attribute

In React, the `slot` attribute works on **native HTML elements** (`<div>`, `<span>`, `<a>`, etc.) placed as direct children of the web component. This is standard DOM behavior — React passes `slot` through to the DOM.

```tsx
// ✅ CORRECT — native elements with slot attribute
<ui-header theme="dark">
  <div slot="app-icon">...</div>
  <div slot="app-title">My App</div>
  <div slot="app-description">A description</div>
  <div slot="app-context">...</div>
</ui-header>

// ❌ WRONG — React component as direct slotted child (won't work)
<ui-header>
  <MyReactIcon slot="app-icon" />  // React components don't pass slot to DOM
</ui-header>

// ✅ CORRECT — wrap React component in a native element
<ui-header>
  <div slot="app-icon">
    <MyReactIcon />
  </div>
</ui-header>
```

### Step 4: Listen to custom events via `ref` + `addEventListener`

React does **NOT** support custom events via JSX props (`onThemeChange` will NOT work). You MUST use a `ref` and `addEventListener` manually:

```tsx
import { useEffect, useRef } from 'react';

function AppShell() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleThemeChange = (e: Event) => {
      const { theme } = (e as CustomEvent<{ theme: 'light' | 'dark' }>).detail;
      document.documentElement.className = theme;
    };

    header.addEventListener('theme-change', handleThemeChange);
    return () => header.removeEventListener('theme-change', handleThemeChange);
  }, []);

  return (
    <ui-header ref={headerRef} theme="dark">
      <div slot="app-title">My App</div>
    </ui-header>
  );
}
```

### React Gotchas Summary

| Pitfall | Solution |
|---|---|
| TypeScript error: `ui-header` is not a valid element | Add `react.d.ts` type declarations to `src/` |
| `onThemeChange` prop does nothing | Use `ref` + `addEventListener('theme-change', ...)` |
| React component in slot doesn't render | Wrap in a native `<div slot="...">` element |
| `className` on `<ui-header>` | Use `className` (React normalizes it). Does not affect Shadow DOM styles. |
| Setting `theme` attribute | Pass as JSX prop: `<ui-header theme="dark">` — React passes string props as attributes to unknown elements |

---

### Example Integration (Vanilla HTML)
```html
<!-- The components are loaded via a single bundle -->
<script type="module" src="ui-core-bundle.js"></script>

<ui-header theme="dark">
  <svg slot="app-icon" viewBox="0 0 24 24">...</svg>
  <div slot="app-title">Capture-TS</div>
  <div slot="app-description">DVB-T Transport Stream Recorder</div>
  
  <div slot="app-utilities"><span class="badge">Online</span></div>
  <button slot="app-actions"><svg>...</svg></button>
</ui-header>

<main>App Content</main>

<ui-footer githubUrl="https://github.com/your-repo">
  <div slot="footer-license" style="font-size: 0.75rem; opacity: 0.5;">MIT License</div>
  <div slot="footer-version">
    <span>v1.0.4-beta</span>
  </div>
</ui-footer>
```
