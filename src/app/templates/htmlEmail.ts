export function generateEmailTemplate(
  templateName: string,
  templateData: Record<string, any>
): string {
  // Central colors and design tokens for consistency
  const COLORS = {
    primary: "#0070f3",
    background: "#f9fafb",
    card: "#ffffff",
    border: "#e5e7eb",
    text: "#22223b",
    subtext: "#6b7280",
    danger: "#d90429",
  };

  switch (templateName) {
    case "otp":
      return `
        <html>
          <body style="margin:0;padding:0;background:${COLORS.background};font-family: 'Segoe UI', Arial, sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background:${COLORS.card}; margin:2em auto; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid ${COLORS.border}; overflow: hidden;">
              <tr>
                <td style="padding: 2.5em 2em 1.2em 2em;">
                  <img src="https://planora.app/email-logo.png" alt="Planora Logo" height="36" style="display:block;margin-bottom:1.5em;">
                  <h2 style="margin-top:0;margin-bottom:.8em;font-size:2em;color:${COLORS.primary};font-weight:600;letter-spacing:-1px;">
                    Hello, ${templateData.name ? escapeStr(templateData.name) : "there"}!
                  </h2>
                  <p style="font-size:1.1em; margin: 0 0 1.6em 0; color: ${COLORS.text};">
                    Thank you for choosing Planora.<br/>
                    Please use the following One-Time Password (OTP) to proceed:
                  </p>
                  <div style="padding:1.2em 0;text-align:center;">
                    <span style="
                      font-size:2.6em;
                      font-weight:bold;
                      letter-spacing:0.24em;
                      color: ${COLORS.primary}; 
                      background: rgba(0,112,243,0.07);
                      border-radius: 8px;
                      display: inline-block;
                      min-width: 170px;">
                      ${templateData.otp ? escapeStr(templateData.otp) : "<em style='color:" + COLORS.danger + "'>Invalid code</em>"}
                    </span>
                  </div>
                  <p style="font-size:1em;color:${COLORS.subtext};margin:1.7em 0 0 0;">
                    <strong>Note:</strong> This code is valid for a limited time only. For your security, do not share this code with anyone.
                  </p>
                  <hr style="border: none; border-top: 1px solid ${COLORS.border}; margin:2em 0;">
                  <footer style="font-size:0.93em; color:${COLORS.subtext}; margin-bottom:0;">
                    Best regards,<br/>
                    <strong>The Planora Team</strong>
                  </footer>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    default:
      return `
        <html>
          <body style="margin:0;padding:0;background:${COLORS.background};font-family: 'Segoe UI', Arial, sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background:${COLORS.card}; margin:2em auto; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.04); border:1px solid ${COLORS.border}; overflow: hidden;">
              <tr>
                <td style="padding: 2.5em 2em 1.4em 2em;">
                  <img src="https://planora.app/email-logo.png" alt="Planora Logo" height="36" style="display:block;margin-bottom:1.5em;">
                  <h2 style="margin:0 0 .7em 0; color:${COLORS.primary};font-size:2em;font-weight:600;letter-spacing:-1px;">Email from Planora</h2>
                  <p style="font-size:1.1em; color: ${COLORS.text};">
                    This is a default email template.<br/>
                    Please contact our support team if you believe you received this in error.
                  </p>
                  <hr style="border:none; border-top:1px solid ${COLORS.border}; margin:2em 0;">
                  <footer style="font-size:0.93em; color:${COLORS.subtext};">
                    Thanks,<br/><strong>The Planora Team</strong>
                  </footer>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
  }
}
function escapeStr(str: string): string {
  return str.replace(/[&<>"'`]/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
    "`": "&#96;",
  }[m] as string));
}
