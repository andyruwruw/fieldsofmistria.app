// Packages
import { cva } from 'class-variance-authority';

/**
 * Button component that provides various styles and sizes for buttons.
 * It can be used for actions like submitting forms, navigating, etc.
 */
export default cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background shadow hover:bg-foreground/90',
        destructive: 'bg-danger text-on-brand shadow-sm hover:bg-danger-hover',
        positive: 'bg-brand text-on-brand shadow-sm hover:bg-brand-hover',
        outline: 'border border-border bg-surface shadow-sm hover:bg-muted hover:text-foreground',
        secondary: 'bg-muted text-foreground shadow-sm hover:bg-muted/80',
        ghost: 'hover:bg-muted hover:text-foreground',
        link: 'text-foreground underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
