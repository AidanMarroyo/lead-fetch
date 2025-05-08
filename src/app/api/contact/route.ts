import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  try {
    await resend.emails.send({
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

    await resend.emails.send({
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Email error:', err);
    return NextResponse.json({ success: false, error: 'Email failed' }, { status: 500 });
  }
}
