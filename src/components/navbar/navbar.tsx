'use client';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useUserPlan } from '@/lib/userUserPlan';
import ActivityDropdown from './activity';
import MenuDropdown from './menu';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import UserDropdown from './user-dropdown';

type Props = {
  first_name: string;
  last_name: string;
};
export function DashboardNavbar({ userData }: { userData: Props }) {
  const { plan } = useUserPlan();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav className='fixed top-0 z-30 w-full border-b border-gray-200 p-0 sm:p-0 dark:border-gray-700 '>
      <div className='w-full p-3 pr-4'>
        <div className='flex items-center justify-between sm:flex-wrap overflow-x-auto'>
          <div className='flex items-center'>
            <Link href='/' className='mr-14 flex items-center'>
              <Image
                className='mr-3  block dark:hidden'
                alt=''
                src='/logo.png'
                width={120}
                height={120}
              />
              <Image
                className='mr-3 hidden dark:block bg-transparent'
                alt=''
                src='/logo-dark.png'
                width={120}
                height={120}
              />
            </Link>
          </div>
          <div className='flex items-center lg:gap-3'>
            <div className='flex items-center'>
              <ActivityDropdown />
              <MenuDropdown />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  >
                    {isDark ? (
                      <Sun className='w-4 h-4' />
                    ) : (
                      <Moon className='w-4 h-4' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>
              <div className='ml-3 flex items-center'>
                <UserDropdown plan={plan} userData={userData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
