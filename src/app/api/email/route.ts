import { EmailService } from "@/lib/emailService";

export async function POST(req: Request) {
  try {
    const { to, subject, message, name, template } = await req.json();

    let result;

    if (template === "welcome") {
      result = await EmailService.sendWelcomeEmail(to, name);
    } else {
      result = await EmailService.sendRawEmail(to, subject, message);
    }

    return Response.json(
      { success: true, data: result },
      { status: 200 }
    );

  } catch (error) {
    console.error("Email Dispatch Error:", error);

    return Response.json(
      { success: false, error: "Email sending failed." },
      { status: 500 }
    );
  }
}
