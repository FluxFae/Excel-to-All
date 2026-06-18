/**
 * Type declarations for ui-core Web Components in React/JSX environments.
 *
 * Usage: copy this file into your React project's `src/` directory
 * (or any path included in your tsconfig), and TypeScript will
 * recognize <ui-header> and <ui-footer> as valid JSX elements.
 *
 * @example tsconfig.json — make sure "src" (or the directory containing
 * this file) is in "include":
 *   { "include": ["src"] }
 */

import type { HTMLAttributes, Ref } from 'react';

type UiHeaderProps = HTMLAttributes<HTMLElement> & {
  /** Current color theme. Reflects to attribute. */
  theme?: 'light' | 'dark';
  /** Use a React ref to listen for 'theme-change' custom events */
  ref?: Ref<HTMLElement>;
};

type UiFooterProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * UI Header Web Component.
       *
       * @slot app-icon - Left zone: The application logo or icon.
       * @slot app-title - Left zone: The main application title.
       * @slot app-description - Left zone: The application subtitle or description.
       * @slot app-context - Center zone: For navigation or search bars.
       * @slot app-utilities - Right zone (before separator): Text, badges, user profile state.
       * @slot app-actions - Right zone (after separator): Extra action icons alongside the theme toggle.
       *
       * @fires theme-change - Emitted when the theme toggle button is clicked.
       *   Listen via ref + addEventListener, NOT via onThemeChange prop.
       */
      'ui-header': UiHeaderProps;

      /**
       * UI Footer Web Component.
       *
       * @slot footer-signature - Left zone: Identity and signature (e.g., copyright, sys_admin).
       * @slot footer-repo - Center zone: Code repository links and license info.
       * @slot footer-status - Right zone: Telemetry, versions, and system status indicators.
       */
      'ui-footer': UiFooterProps;
    }
  }
}

export {};
