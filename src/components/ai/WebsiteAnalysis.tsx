import { toast } from 'sonner';
import { Button } from '../ui/button';

export default function WebsiteAnalysis({
  auto_pitch,
}: {
  auto_pitch: string;
}) {
  return (
    <div className='border bg-muted p-4 rounded'>
      <div className='flex justify-between items-center mb-2'>
        <h4 className='text-sm font-semibold'>📬 AI Pitch Summary</h4>
        <Button
          variant='ghost'
          onClick={() => {
            navigator.clipboard.writeText(auto_pitch);
            toast.success('Pitch copied to clipboard');
          }}
          className='hover:cursor-pointer'
        >
          Copy
        </Button>
      </div>
      <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
        {auto_pitch}
      </p>
    </div>
  );
}
