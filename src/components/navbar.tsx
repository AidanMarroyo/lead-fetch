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
import {
  Archive,
  Bell,
  Settings,
  DollarSign,
  Eye,
  Inbox,
  LogOut,
  Ticket,
  Search,
  ShoppingBag,
  User,
  Users,
  LayoutGrid,
} from 'lucide-react';
import { useUserPlan } from '@/lib/userUserPlan';

export function DashboardNavbar() {
  const { plan } = useUserPlan();
  //   const sidebar = useSidebarContext();
  //   const isDesktop = useMediaQuery('(min-width: 1024px)');

  //   function handleToggleSidebar() {
  //     if (isDesktop) {
  //       sidebar.desktop.toggle();
  //     } else {
  //       sidebar.mobile.toggle();
  //     }
  //   }

  return (
    <nav className='fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 sm:p-0 dark:border-gray-700 dark:bg-gray-800'>
      <div className='w-full p-3 pr-4'>
        <div className='flex items-center justify-between'>
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
              <Button
                className='cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700'
                variant='ghost'
                size='icon'
              >
                <span className='sr-only'>Search</span>
                <Search className='h-6 w-6' />
              </Button>
              <NotificationBellDropdown />
              <AppDrawerDropdown />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <span className='sr-only'>Toggle theme</span>
                    {/* Place your theme toggle icon here */}
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

function NotificationBellDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          variant='ghost'
          size='icon'
        >
          <span className='sr-only'>Notifications</span>
          <Bell className='h-6 w-6' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80'>
        <div className='block rounded-t-lg bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
          Notifications
        </div>
        {/* Notification items go here */}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href='#'
            className='block text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600'
          >
            <div className='inline-flex items-center gap-x-2'>
              <Eye className='h-5 w-5' />
              <span>View all</span>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppDrawerDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          variant='ghost'
          size='icon'
        >
          <span className='sr-only'>Apps</span>
          <LayoutGrid className='h-6 w-6' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='grid grid-cols-3 gap-4 p-4'>
        <DropdownMenuItem asChild>
          <Link href='#' className='block text-center'>
            <ShoppingBag className='mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400' />
            <div className='text-sm font-medium text-gray-900 dark:text-white'>
              Sales
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#' className='block text-center'>
            <Users className='mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400' />
            <div className='text-sm font-medium text-gray-900 dark:text-white'>
              Users
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#' className='block text-center'>
            <Inbox className='mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400' />
            <div className='text-sm font-medium text-gray-900 dark:text-white'>
              Inbox
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#' className='block text-center'>
            <User className='mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400' />
            <div className='text-sm font-medium text-gray-900 dark:text-white'>
              Profile
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#' className='block text-center'>
            <Settings className='mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400' />
            <div className='text-sm font-medium text-gray-900 dark:text-white'>
              Settings
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#' className='block text-center'>
            <Archive className='mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400' />
            <div className='text-sm font-medium text-gray-900 dark:text-white'>
              Products
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#' className='block text-center'>
            <DollarSign className='mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400' />
            <div className='text-sm font-medium text-gray-900 dark:text-white'>
              Pricing
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#' className='block text-center'>
            <Ticket className='mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400' />
            <div className='text-sm font-medium text-gray-900 dark:text-white'>
              Billing
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#' className='block text-center'>
            <LogOut className='mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400' />
            <div className='text-sm font-medium text-gray-900 dark:text-white'>
              Logout
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
            {plan === 'free'
              ? '🌱 Free Plan'
              : plan === 'individual'
                ? '💼 Pro Plan'
                : '👥 Team Plan'}
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
