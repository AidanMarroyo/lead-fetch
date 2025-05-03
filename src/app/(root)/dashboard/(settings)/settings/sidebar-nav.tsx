'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex flex-col space-y-1 px-3 py-4 bg-muted/30 rounded-2xl border shadow-sm',
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} className='w-full'>
            <Button
              variant='ghost'
              className={cn(
                'w-full justify-start rounded-xl text-sm px-4 py-2 transition-all',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-primary text-white font-semibold shadow-md'
                  : 'text-muted-foreground'
              )}
            >
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
