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

export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const { error } = await resend.emails.send({
    from: 'WebbedLeads Team <noreply@webbedleads.com>',
    to: ['sanovasoftwareinc@gmail.com'],
    subject: `New Contact Submission – WebbedLeads`,
    html: `
      <p><strong>${name}</strong> submitted a message via the WebbedLeads contact form.</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 12px; margin: 8px 0;">${message}</blockquote>
    `,
  });

  if (error) console.error('📩 Contact notification email failed:', error);
}


export async function sendContactConfirmationEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const { error } = await resend.emails.send({
    from: 'WebbedLeads Team <noreply@webbedleads.com>',
    to: [email],
    subject: `We've received your message – WebbedLeads`,
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for reaching out to the WebbedLeads team. We’ve received your message and will be in touch within 24 hours.</p>
      <p>In the meantime, feel free to explore our features or review your lead dashboard.</p>
      <p>– The WebbedLeads Team</p>
    `,
  });

  if (error) console.error('📩 Contact confirmation email failed:', error);
}


