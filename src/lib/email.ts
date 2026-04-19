import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ecommercepro-moran.vercel.app";
  const url = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[DEV] Verification link for ${email}: ${url}`);
    return;
  }

  await transporter.sendMail({
    from: `"EcommercePro" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verificá tu email · EcommercePro",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0">
    <tr><td align="center">
      <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:40px;text-align:center">
            <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
              <span style="font-size:28px">🛍️</span>
            </div>
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;letter-spacing:-0.5px">EcommercePro</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px">
            <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:800">Hola, ${name || "usuario"} 👋</h2>
            <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6">
              Gracias por registrarte en EcommercePro. Para activar tu cuenta y poder ingresar, confirmá tu dirección de email haciendo click en el botón de abajo.
            </p>
            <div style="text-align:center;margin:32px 0">
              <a href="${url}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-weight:700;font-size:15px;border-radius:50px;text-decoration:none;box-shadow:0 4px 16px rgba(99,102,241,0.4)">
                Verificar mi email →
              </a>
            </div>
            <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;text-align:center">
              El link expira en 24 horas.
            </p>
            <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;text-align:center;border-top:1px solid #f3f4f6;padding-top:24px">
              Si no creaste una cuenta, ignorá este email.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
