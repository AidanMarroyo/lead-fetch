import { getCurrentUser } from '@/lib/auth';
import { sendConfirmationEmail } from '@/lib/email';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';



export async function POST(req: Request) {
    const supabase = await createClient()
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { email } = await req.json();

  try {
const { data: confirmation, error: confirmationError } = await supabase.from('confirmations').select('*').eq('profile_id', user.id).single();

if (confirmationError) {
    console.error('Error inserting confirmation:', confirmationError);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
}

let confirmationId = confirmation?.id;

if (!confirmation) {
  const { data: newConfirmation, error: createConfirmationError } = await supabase
    .from('confirmations')
    .insert({ profile_id: user.id })
    .select()
    .single();

  if (createConfirmationError) {
    console.error('Error creating confirmation:', createConfirmationError);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }

  confirmationId = newConfirmation.id;
}

await sendConfirmationEmail({
  email,
  confirmationId,
});


    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Email error:', err);
    return NextResponse.json({ success: false, error: 'Email failed' }, { status: 500 });
  }
}
