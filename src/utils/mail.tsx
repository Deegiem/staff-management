// src/utils/mail.ts
import { Resend } from "resend";
import { render } from "@react-email/render";

// Email components - you'll need to create these
import PasswordResetEmail from "@/emails/PasswordResetEmail";
import WelcomeEmail from "@/emails/WelcomeEmail"; // You need to create this

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const devMode = process.env.DEV_EMAIL_MODE === "true";

  // In dev: log and return preview info
  if (devMode) {
    console.log("📨 [DEV_EMAIL_MODE] Preview email:");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("HTML:", html);
    return {
      ok: true,
      devPreview: true,
      to,
      subject,
      html,
    };
  }

  // Production: require Resend
  if (!resend) {
    console.error("Resend API key not configured and DEV_EMAIL_MODE is off.");
    throw new Error("Email provider not configured");
  }

  try {
    const result = await resend.emails.send({
      from: "Staff Management <onboarding@resend.dev>", // Use Resend verified domain
      to,
      subject,
      html,
    });

    return { ok: true, result };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendPasswordResetEmail(to: string, name: string, resetLink: string) {
  const html = await render(PasswordResetEmail({ name, resetLink }));

  return sendMail({
    to,
    subject: "Reset Your Password",
    html,
  });
}

export async function sendWelcomeEmail(to: string, name: string, setupLink: string) {
  const html = await render(WelcomeEmail({ name, setupLink }));

  return sendMail({
    to,
    subject: "Welcome to Staff Management - Set Up Your Account",
    html,
  });
}