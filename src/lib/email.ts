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
    subject: `${inviterEmail} invited you to join their team`,
    html: `
      <p>${inviterEmail} invited you to join their team on WebbedLeads.</p>
      <p><a href="https://webbedleads.com/auth/signup">Click here to accept your invite</a></p>
    `,
  });

  if (error) console.error('Invite email error:', error);
}
