import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const qhColor = "#962d46";
const previewText = "QH Mailing List - Upcoming Events"; // Keep under 90 characters

export const VercelInviteUserEmail: React.FC<{ preview: string }> = ({
  preview,
}) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-black my-auto mx-auto font-sans">
          <Container>
            <Img src="../static/qh logo.png" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VercelInviteUserEmail;
