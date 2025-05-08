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
  const first_initial =
    first_name === null ? 'W' : first_name.charAt(0).toUpperCase();
  const last_initial =
    last_name === null ? 'U' : last_name?.charAt(0).toUpperCase();
  const initials = `${first_initial}${last_initial}`;
  const name =
    userData.first_name === null || userData.last_name === null
      ? 'Webbed User'
      : `${first_name} ${last_name}`;

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free':
        return {
          label: 'Free Plan',
          className: 'bg-blue-100 text-blue-700',
        };
      case 'pro':
        return {
          label: 'Pro Plan',
          className: 'bg-yellow-200 text-yellow-800 ',
        };
      case 'unlimited':
        return {
          label: 'Unlimited Plan',
          className: 'bg-purple-100 text-purple-700',
        };
      case 'team':
        return { label: 'Team Plan', className: 'bg-green-100 text-green-700' };
      case 'trial':
        return {
          label: 'Trial Plan',
          className: 'bg-orange-100 text-orange-700',
        };
      default:
        return { label: 'Unknown', className: 'bg-gray-200 text-gray-700' };
    }
  };

  const { label, className } = getPlanLabel(plan);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='rounded-full p-0'>
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <div className='px-4 py-3'>
          <p className='text-sm'>{name}</p>
          <div className='text-sm text-muted-foreground'>
            <span
              className={`ml-2 mt-0.5 text-xs px-2 py-0.5 rounded font-medium ${className}`}
            >
              {label}
            </span>
          </div>
        </div>

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
