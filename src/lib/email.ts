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
    from: 'LeadFetch Team <noreply@yourdomain.com>',
    to,
    subject: `${inviterEmail} invited you to join their team`,
    html: `
      <p>${inviterEmail} invited you to join their team on LeadFetch.</p>
      <p><a href="https://lead-fetch.vercel.app/auth/signup">Click here to accept your invite</a></p>
    `,
  });

  if (error) console.error('Invite email error:', error);
}
