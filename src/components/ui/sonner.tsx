'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'bg-card text-card-foreground border border-border shadow-xl rounded-xl p-4 font-medium',
          description: 'text-muted-foreground text-sm mt-1',
          actionButton:
            'inline-flex items-center justify-center h-8 px-3 rounded-md border text-sm font-medium bg-muted text-foreground hover:bg-muted/80',
          cancelButton:
            'inline-flex items-center justify-center h-8 px-3 rounded-md border border-transparent text-sm font-medium text-muted-foreground hover:bg-muted',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--card)',
          '--normal-text': 'var(--foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
