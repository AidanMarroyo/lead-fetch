import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    const supabase = await createClient()
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { email } = await req.json();



  try {
const { data: confirmation, error: confirmationError } = await supabase.from('confirmations').insert({
    profile_id: user.id,
}).select().single();

if (confirmationError) {
    console.error('Error inserting confirmation:', confirmationError);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
}

const plainText = `
Welcome to WebbedLeads!

You're almost ready to start discovering high-converting leads.

Please confirm your account by visiting the link below:
https://webbedleads.com/auth/confirm-email/${confirmation?.id}

If you did not sign up for WebbedLeads, you can safely ignore this message.

— The WebbedLeads Team
https://webbedleads.com
`;

    await resend.emails.send({
        from: 'WebbedLeads Team <noreply@webbedleads.com>',
        to: [email],
        subject: 'Welcome to WebbedLeads – Confirm Your Account',
        html: `
          <div style="max-width:600px;margin:0 auto;padding:40px;font-family:Helvetica,Arial,sans-serif;background-color:#ffffff;color:#0f172a;border-radius:8px;border:1px solid #e2e8f0;">
            <div style="text-align:center;margin-bottom:30px;">
              <img src="https://webbedleads.com/webbed-logo.png" alt="WebbedLeads Logo" style="width:120px;height:auto;" />
            </div>
      
            <h1 style="font-size:22px;margin-bottom:20px;">You're almost there!</h1>
      
            <p style="font-size:16px;line-height:1.6;">
              Welcome to <strong>WebbedLeads</strong> — the lead machine for web agencies.
              To activate your account and start discovering high-converting leads, please confirm your email address.
            </p>
      
            <div style="text-align:center;margin:40px 0;">
              <a href="https://webbedleads.com/auth/confirm-email/${confirmation.id}" style="background-color:#3b82f6;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;font-size:16px;">
                Confirm My Account
              </a>
            </div>
      
            <p style="font-size:14px;color:#64748b;">
              If you didn’t create this account, you can safely ignore this email.
            </p>
      
            <hr style="margin:40px 0;border:none;border-top:1px solid #e2e8f0;" />
      
            <p style="font-size:12px;color:#94a3b8;text-align:center;">
              © ${new Date().getFullYear()} WebbedLeads. All rights reserved.<br />
              <a href="https://webbedleads.com" style="color:#94a3b8;text-decoration:none;">webbedleads.com</a>
            </p>
          </div>
        `,
        text: plainText,
      });
      



    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Email error:', err);
    return NextResponse.json({ success: false, error: 'Email failed' }, { status: 500 });
  }
}
