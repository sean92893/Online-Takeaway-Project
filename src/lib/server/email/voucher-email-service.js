//X00224599

import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export async function sendVoucherEmail({ voucher }) {
  const amountFormatted = `€${(voucher.amount / 100).toFixed(2)}`;

  const { error } = await resend.emails.send({
    from: 'Ready To Eat <onboarding@resend.dev>',
    to: voucher.recipientEmail,
    subject: `You've received a Ready To Eat Gift Voucher — ${amountFormatted}`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background: #f4f4f4; font-family: 'Segoe UI', Arial, sans-serif;">
  <div style="max-width:600px; margin:40px auto; background: #fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.1);">
    <div style="background:#343a40; padding:32px; text-align:center;">
      <h1 style="color:#fff; margin:0; font-size:1.8rem; letter-spacing:2px;">READY TO EAT</h1>
      <p style="color:#adb5bd; margin:6px 0 0; font-size:0.85rem; letter-spacing:4px;">GIFT VOUCHER</p>
    </div>

    <div style="padding:40px 48px;">
      <p style="font-size:1.1rem; color: black; margin:0 0 8px;">Hi <strong>${voucher.recipientName}</strong>,</p>
      <p style="color: #6c757d; line-height:1.6; margin:0 0 24px;">
        <strong style="color: black;">${voucher.senderName}</strong> has sent you a gift voucher for Ready To Eat.
      </p>

      ${voucher.message ? `
      <div style="background: #f8f9fa; border-left:4px solid #ff912b; padding:16px 20px; margin:0 0 32px; border-radius:0 4px 4px 0;">
        <p style="margin:0; font-style:italic; color:#495057;">"${voucher.message}"</p>
        <p style="margin:8px 0 0; font-size:0.8rem; color:#adb5bd;">— ${voucher.senderName}</p>
      </div>
      ` : ''}

      <div style="background:#212529; border-radius:8px; padding:36px; text-align:center; margin:0 0 32px;">
        <p style="margin:0 0 6px; color:#6c757d; letter-spacing:4px; font-size:0.7rem; text-transform:uppercase;">Your Voucher Code</p>
        <p style="margin:0 0 16px; font-size:1.8rem; font-weight:700; letter-spacing:6px; color: #fff; font-family:'Courier New',monospace;">${voucher.code}</p>
        <div style="border-top:1px solid #343a40; padding-top:16px; margin-top:4px;">
          <p style="margin:0; font-size:2rem; color: #ff912b; font-weight:700;">${amountFormatted}</p>
        </div> 
      </div>

      <p style="color: #6c757d; font-size:0.875rem; line-height:1.6; text-align:center;">
        Present this code when ordering at Ready To Eat.<br/>
        Valid for one use. No expiry.
      </p>
    </div>

    <div style="background: #f8f9fa; border-top:1px solid #f8f9fa; padding:20px; text-align:center;">
      <p style="color: #adb5bd; font-size:0.75rem; margin:0;">© Ready To Eat &nbsp;|&nbsp; Enjoy your meal!</p>
    </div>
  </div>
</body>
</html>
    `
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error('Email failed');
  }

  console.log(`Gift voucher email sent to ${voucher.recipientEmail} | Code: ${voucher.code}`);
}