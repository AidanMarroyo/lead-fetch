// components/ui/textarea.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-xl bg-card text-card-foreground border border-border px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary',
      className
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';
