import * as React from "react";

export default function PasswordResetEmail({
  name,
  resetLink,
}: {
  name: string;
  resetLink: string;
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <h2>Reset Your Password</h2>
      <p>Hello {name},</p>
      <p>
        We received a request to reset your password. Click the button below to
        set a new password. This link will expire shortly.
      </p>

      <a
        href={resetLink}
        style={{
          display: "inline-block",
          padding: "10px 16px",
          background: "#1a73e8",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          marginTop: "12px",
        }}
      >
        Reset Password
      </a>

      <p>
        If you did not request this action, you can ignore this email — no
        changes will be made.
      </p>

      <p>Warm regards,<br />Your Security Team</p>
    </div>
  );
}
