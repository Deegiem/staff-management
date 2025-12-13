// src/emails/WelcomeEmail.tsx
import { Html, Head, Body, Container, Section, Text, Link, Button } from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  setupLink: string;
}

export default function WelcomeEmail({ name, setupLink }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Welcome to Staff Management System!</Text>
          <Text style={paragraph}>Hello {name},</Text>
          <Text style={paragraph}>
            Your account has been created. Please set up your password to get started.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={setupLink}>
              Set Up Your Account
            </Button>
          </Section>
          <Text style={paragraph}>
            This link will expire in 24 hours. If you didn&apos;t request this, please ignore this email.
          </Text>
          <Text style={footer}>
            Best regards,<br />
            Staff Management Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: 'Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const heading = {
  fontSize: "24px",
  color: "#333333",
  fontWeight: "bold",
};

const paragraph = {
  fontSize: "16px",
  color: "#666666",
  lineHeight: "1.5",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#0070f3",
  borderRadius: "5px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
};

const footer = {
  fontSize: "14px",
  color: "#888888",
  marginTop: "20px",
};