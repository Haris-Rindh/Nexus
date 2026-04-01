// Mock email utility for 2FA
export const send2FAToken = async (email: string, token: string): Promise<void> => {
  console.log(`\n================================`);
  console.log(`📧 MOCK EMAIL SENT TO: ${email}`);
  console.log(`SUBJECT: Your Nexus 2FA Code`);
  console.log(`BODY: Your verification code is ${token}. It is valid for 10 minutes.`);
  console.log(`================================\n`);
  
  // In production, we'd use Nodemailer:
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ from, to: email, subject, text });
  */
};
