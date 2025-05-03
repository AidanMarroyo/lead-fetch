'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () =>
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
        {/* Logo */}
        <Link
          href='/'
          className='text-xl font-bold tracking-tight text-primary'
        >
          WebbedLeads
        </Link>

        {/* Desktop Nav */}
        <nav className='hidden md:flex items-center gap-4'>
          <Link
            href='#features'
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition'
          >
            Features
          </Link>
          <Link
            href='#pricing'
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition'
          >
            Pricing
          </Link>
          <Link
            href='#faq'
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition'
          >
            FAQ
          </Link>

          <Button
            variant='ghost'
            onClick={toggleTheme}
            aria-label='Toggle theme'
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className='w-5 h-5' />
            ) : (
              <Moon className='w-5 h-5' />
            )}
          </Button>

          <Link href='/dashboard/leads'>
            <Button>Launch App</Button>
          </Link>
        </nav>

        {/* Mobile Nav */}
        <div className='md:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' aria-label='Menu'>
                <Menu className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem asChild>
                <Link href='#features'>Features</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='#pricing'>Pricing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='#faq'>FAQ</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={toggleTheme}
                className='flex items-center justify-between'
              >
                <span>Toggle Theme</span>
                {mounted && resolvedTheme === 'dark' ? (
                  <Sun className='h-4 w-4' />
                ) : (
                  <Moon className='h-4 w-4' />
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href='/app' className='w-full text-center font-medium'>
                  🚀 Launch App
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
