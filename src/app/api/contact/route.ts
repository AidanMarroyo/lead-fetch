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
        <div style="max-width:600px;margin:0 auto;padding:40px;font-family:Helvetica,Arial,sans-serif;background-color:#ffffff;color:#0f172a;border-radius:8px;border:1px solid #e2e8f0;">
          <div style="text-align:center;margin-bottom:30px;">
            <img src="https://webbedleads.com/webbed-logo.png" alt="WebbedLeads Logo" style="width:120px;height:auto;" />
          </div>
    
          <h2 style="font-size:20px;margin-bottom:10px;">📥 New Contact Submission</h2>
          <p><strong>${name}</strong> submitted a message via the WebbedLeads contact form.</p>
    
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #3b82f6; padding-left: 12px; color:#334155;">
            ${message}
          </blockquote>
    
          <hr style="margin-top:40px;border:none;border-top:1px solid #e2e8f0;" />
          <p style="font-size:12px;color:#94a3b8;text-align:center;">
            WebbedLeads Team — <a href="https://webbedleads.com" style="color:#94a3b8;text-decoration:none;">webbedleads.com</a>
          </p>
        </div>
      `,
      text: `
    New Contact Submission – WebbedLeads
    
    ${name} submitted a message via the WebbedLeads contact form.
    
    Email: ${email}
    
    Message:
    ${message}
    
    – WebbedLeads Team
    webbedleads.com
      `,
    });
    

    await resend.emails.send({
      from: 'WebbedLeads Team <noreply@webbedleads.com>',
      to: [email],
      subject: `We've received your message – WebbedLeads`,
      html: `
        <div style="max-width:600px;margin:0 auto;padding:40px;font-family:Helvetica,Arial,sans-serif;background-color:#ffffff;color:#0f172a;border-radius:8px;border:1px solid #e2e8f0;">
          <div style="text-align:center;margin-bottom:30px;">
            <img src="https://webbedleads.com/webbed-logo.png" alt="WebbedLeads Logo" style="width:120px;height:auto;" />
          </div>
    
          <h2 style="font-size:20px;margin-bottom:10px;">Thanks for reaching out, ${name.split(' ')[0]}!</h2>
          <p>We’ve received your message and one of our team members will be in touch within the next 24 hours.</p>
    
          <p style="margin-top:20px;">In the meantime, you can explore your <a href="https://webbedleads.com/dashboard/leads" style="color:#3b82f6;text-decoration:none;">lead dashboard</a> or learn more about our <a href="https://webbedleads.com/features" style="color:#3b82f6;text-decoration:none;">features</a>.</p>
    
          <p style="margin-top:30px;">– The WebbedLeads Team</p>
    
          <hr style="margin-top:40px;border:none;border-top:1px solid #e2e8f0;" />
          <p style="font-size:12px;color:#94a3b8;text-align:center;">
            WebbedLeads • webbedleads.com
          </p>
        </div>
      `,
      text: `
    Thanks for reaching out, ${name}!
    
    We’ve received your message and will be in touch within 24 hours.
    
    In the meantime, you can visit your lead dashboard or check out our features:
    
    https://webbedleads.com/dashboard/leads
    https://webbedleads.com/features
    
    – The WebbedLeads Team
    webbedleads.com
      `,
    });
    

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Email error:', err);
    return NextResponse.json({ success: false, error: 'Email failed' }, { status: 500 });
  }
}
