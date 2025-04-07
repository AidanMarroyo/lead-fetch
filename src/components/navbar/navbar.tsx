import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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

export function DashboardNavbar() {
  const { plan } = useUserPlan();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav className='fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 sm:p-0 dark:border-gray-700 dark:bg-gray-800'>
      <div className='w-full p-3 pr-4'>
        <div className='flex items-center justify-between sm:flex-wrap overflow-x-auto'>
          <div className='flex items-center'>
            <Link href='/' className='mr-14 flex items-center'>
              <Image
                className='mr-3 h-8'
                alt=''
                src='/images/logo.svg'
                width={32}
                height={32}
              />
              <h1 className='text-xl font-bold'>WebbedLead</h1>
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
                <UserDropdown plan={plan} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function UserDropdown({ plan }: { plan: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='rounded-full p-0'>
          <Avatar>
            <AvatarImage src='/images/users/neil-sims.png' alt='User' />
            <AvatarFallback>NS</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <div className='px-4 py-3'>
          <p className='text-sm'>Neil Sims</p>
          <div className='text-sm text-muted-foreground'>
            {plan && (
              <span
                className={`ml-2 mt-0.5 text-xs px-2 py-0.5 rounded font-medium ${
                  plan === 'free'
                    ? 'bg-yellow-200 text-yellow-800'
                    : plan === 'individual'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                }`}
              >
                {plan === 'free'
                  ? 'Free Plan'
                  : plan === 'individual'
                    ? 'Pro Plan'
                    : 'Team Plan'}
              </span>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='#'>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#'>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#'>Earnings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action='/auth/signout' method='post'>
          <DropdownMenuItem asChild>
            <button>Sign out</button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
