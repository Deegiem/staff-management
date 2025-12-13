import { Resend } from "resend";
import WelcomeEmail from "@/emails/WelcomeEmail";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  static async sendWelcomeEmail(to: string, name: string) {
    const html = await render(<WelcomeEmail name={name} />);

    return await resend.emails.send({
      from: "Deegiem Concepts <deegiem25@gmail.com>",
      to,
      subject: "Welcome to the Platform!",
      html,
    });
  }

  static async sendRawEmail(to: string, subject: string, message: string) {
    return await resend.emails.send({
      from: "Deegiem Concepts <deegiem25@gmail.com>",
      to,
      subject,
      html: `<p>${message}</p>`
    });
  }
}
