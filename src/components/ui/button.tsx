// components/ui/button.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const buttonVariants = {
  default:
    'inline-flex items-center justify-center rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring',
  outline:
    'inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
  ghost:
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm text-muted-foreground hover:bg-muted focus:outline-none',
  destructive:
    'inline-flex items-center justify-center rounded-xl bg-destructive text-white px-4 py-2 text-sm font-semibold hover:bg-destructive/80 focus:outline-none focus:ring-2 focus:ring-ring',
};

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof buttonVariants;
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants[variant], className)}
    {...props}
  />
));

Button.displayName = 'Button';
