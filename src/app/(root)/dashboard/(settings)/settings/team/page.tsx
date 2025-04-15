import { InviteForm } from '@/components/team/InviteForm';
import { TeamManagement } from '@/components/team/TeamManagment';

export default function TeamSettingsPage() {
  return (
    <div className='max-w-2xl mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-semibold'>Team Settings</h1>

      <InviteForm />
      <TeamManagement />
    </div>
  );
}
