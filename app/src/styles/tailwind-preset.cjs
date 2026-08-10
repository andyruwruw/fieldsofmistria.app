/**
 * arw shared Tailwind preset.
 *
 * Maps semantic color/radius/font/shadow tokens to the CSS custom properties
 * defined by the active style's `style.css` (`--arw-*`). This ONE preset is
 * shared by every style: swapping a site's look means swapping which
 * `styles/<name>/style.css` is imported, never this file. Because every
 * color resolves through a CSS variable, templates never need a `dark:`
 * variant for token colors: the variable itself flips under `.dark`.
 *
 * Usage in a consuming repo's tailwind.config.js:
 *
 *   module.exports = {
 *     presets: [require('./src/styles/tailwind-preset')],
 *     content: ['./src/**\/*.{ts,tsx}'],
 *   };
 *
 * See themes/README.md in the frontend-bootstrap skill for the full token
 * contract and setup steps.
 */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--arw-bg)',
          alt: 'var(--arw-bg-alt)',
        },
        surface: 'var(--arw-surface)',
        muted: 'var(--arw-muted)',
        border: 'var(--arw-border)',
        divider: 'var(--arw-divider)',
        foreground: {
          DEFAULT: 'var(--arw-text-1)',
          muted: 'var(--arw-text-2)',
          subtle: 'var(--arw-text-3)',
        },
        brand: {
          DEFAULT: 'var(--arw-brand)',
          hover: 'var(--arw-brand-hover)',
          muted: 'var(--arw-brand-muted-bg)',
          'muted-foreground': 'var(--arw-brand-muted-text)',
        },
        'on-brand': 'var(--arw-on-brand)',
        danger: {
          DEFAULT: 'var(--arw-danger)',
          hover: 'var(--arw-danger-hover)',
        },
        ring: 'var(--arw-ring)',
        status: {
          default: {
            DEFAULT: 'var(--arw-status-default-bg)',
            foreground: 'var(--arw-status-default-text)',
            dot: 'var(--arw-status-default-dot)',
          },
          running: {
            DEFAULT: 'var(--arw-status-running-bg)',
            foreground: 'var(--arw-status-running-text)',
            dot: 'var(--arw-status-running-dot)',
          },
          pending: {
            DEFAULT: 'var(--arw-status-pending-bg)',
            foreground: 'var(--arw-status-pending-text)',
            dot: 'var(--arw-status-pending-dot)',
          },
          retry: {
            DEFAULT: 'var(--arw-status-retry-bg)',
            foreground: 'var(--arw-status-retry-text)',
            dot: 'var(--arw-status-retry-dot)',
          },
          success: {
            DEFAULT: 'var(--arw-status-success-bg)',
            foreground: 'var(--arw-status-success-text)',
            dot: 'var(--arw-status-success-dot)',
          },
          error: {
            DEFAULT: 'var(--arw-status-error-bg)',
            foreground: 'var(--arw-status-error-text)',
            dot: 'var(--arw-status-error-dot)',
          },
          warning: {
            DEFAULT: 'var(--arw-status-warning-bg)',
            foreground: 'var(--arw-status-warning-text)',
            dot: 'var(--arw-status-warning-dot)',
          },
        },
      },
      borderRadius: {
        sm: 'var(--arw-radius-sm)',
        md: 'var(--arw-radius-md)',
        lg: 'var(--arw-radius-lg)',
      },
      fontFamily: {
        sans: 'var(--arw-font-sans)',
        mono: 'var(--arw-font-mono)',
      },
      boxShadow: {
        overlay: 'var(--arw-shadow-overlay)',
      },
    },
  },
};
