import Link from 'next/link';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type Props = {
  first_name: string;
  last_name: string;
};

export default function UserDropdown({
  plan,
  userData,
}: {
  plan: string;
  userData: Props;
}) {
  const { first_name, last_name } = userData;
  const first_initial = first_name.charAt(0).toUpperCase();
  const last_initial = last_name.charAt(0).toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='rounded-full p-0'>
          <Avatar>
            <AvatarFallback>
              {first_initial}
              {last_initial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <div className='px-4 py-3'>
          <p className='text-sm'>
            {first_name} {last_name}
          </p>
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
          <Link href='/dashboard/settings'>Settings</Link>
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
