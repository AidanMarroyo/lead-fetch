import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail({
  to,
  inviterEmail,
}: {
  to: string;
  inviterEmail: string;
}) {
  const { error } = await resend.emails.send({
    from: 'WebbedLeads Team <noreply@webbedleads.com>',
    to,
    subject: `${inviterEmail} invited you to join their team on WebbedLeads`,
    html: `
      <div style="max-width:600px;margin:0 auto;padding:40px;font-family:Helvetica,Arial,sans-serif;background-color:#ffffff;color:#0f172a;border-radius:8px;border:1px solid #e2e8f0;">
        <div style="text-align:center;margin-bottom:30px;">
          <img src="https://webbedleads.com/webbed-logo.png" alt="WebbedLeads Logo" style="width:120px;height:auto;" />
        </div>
  
        <h2 style="font-size:22px;margin-bottom:16px;">You've been invited to WebbedLeads</h2>
  
        <p style="font-size:15px;">${inviterEmail} has invited you to join their team on <strong>WebbedLeads</strong> — the lead machine for freelancers and agencies.</p>
  
        <p style="margin:24px 0;">
          <a href="https://webbedleads.com/auth/signup" style="display:inline-block;background-color:#3b82f6;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;">
            Join the Team
          </a>
        </p>
  
        <p style="font-size:14px;color:#64748b;">If you don’t recognize this invitation, you can safely ignore this email.</p>
  
        <hr style="margin-top:40px;border:none;border-top:1px solid #e2e8f0;" />
        <p style="font-size:12px;color:#94a3b8;text-align:center;">
          WebbedLeads • webbedleads.com
        </p>
      </div>
    `,
    text: `
  You've been invited to WebbedLeads
  
  ${inviterEmail} invited you to join their team on WebbedLeads — the lead machine for freelancers and agencies.
  
  Click below to join:
  https://webbedleads.com/auth/signup
  
  If you don’t recognize this invitation, you can safely ignore this email.
  
  – WebbedLeads
  webbedleads.com
    `,
  });
  

  if (error) console.error('Invite email error:', error);
}

export async function sendConfirmationEmail({
  email,
  confirmationId,
}: {
  email: string;
  confirmationId: string;
}) {
  const { error } =   await resend.emails.send({
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
          <a href="https://webbedleads.com/auth/confirm-email/${confirmationId}" style="background-color:#3b82f6;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;font-size:16px;">
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
  text: `
Welcome to WebbedLeads!

You're almost ready to start discovering high-converting leads.

Please confirm your account by visiting the link below:
https://webbedleads.com/auth/confirm-email/${confirmationId}

If you did not sign up for WebbedLeads, you can safely ignore this message.

— The WebbedLeads Team
https://webbedleads.com
`
  });
  

  if (error) console.error('Invite email error:', error);
}
