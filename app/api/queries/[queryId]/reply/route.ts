import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { FieldValue } from "firebase-admin/firestore";
import {
  getAdminAuth,
  getAdminDb,
} from "@/lib/firebase-admin";

export const runtime = "nodejs";

interface ReplyRequest {
  reply: string;
  adminName?: string;
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{ queryId: string }>;
  }
) {
  try {
    const { queryId } = await context.params;

    if (!queryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Query ID is required.",
        },
        { status: 400 }
      );
    }

    // Verify the logged-in Firebase user.
    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const token =
      authorization.substring("Bearer ".length);

    const adminAuth = getAdminAuth();
    const decodedToken =
      await adminAuth.verifyIdToken(token);

    const adminDb = getAdminDb();

    // Verify SCMS admin role.
    const userSnapshot = await adminDb
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userSnapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "SCMS user profile not found.",
        },
        { status: 403 }
      );
    }

    const userData = userSnapshot.data() as {
      role?: string;
      status?: string;
      name?: string;
    };

    if (
      userData.role !== "admin" ||
      userData.status !== "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Active admin access required.",
        },
        { status: 403 }
      );
    }

    const body =
      (await request.json()) as ReplyRequest;

    const reply = cleanText(body.reply);
    const adminName =
      cleanText(body.adminName) ||
      userData.name ||
      "SCMS Administration";

    if (!reply) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a reply.",
        },
        { status: 400 }
      );
    }

    if (reply.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reply cannot exceed 5000 characters.",
        },
        { status: 400 }
      );
    }

    const queryRef = adminDb
      .collection("queries")
      .doc(queryId);

    const querySnapshot = await queryRef.get();

    if (!querySnapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Query not found.",
        },
        { status: 404 }
      );
    }

    const query = querySnapshot.data() as {
      name?: string;
      email?: string;
      subject?: string;
    };

    const recipientEmail =
      cleanText(query.email);

    if (!recipientEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This query does not contain a valid email address.",
        },
        { status: 400 }
      );
    }

    const emailUser =
      process.env.SCMS_EMAIL_USER;

    const emailAppPassword =
      process.env.SCMS_EMAIL_APP_PASSWORD;

    const fromName =
      process.env.SCMS_EMAIL_FROM_NAME ||
      "SCMS - The National Degree College, Bagepalli";

    if (!emailUser || !emailAppPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        { status: 500 }
      );
    }

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailAppPassword,
        },
      });

    const htmlMessage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
    }
    .wrapper {
      padding: 32px 12px;
    }
    .card {
      max-width: 700px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(15, 61, 145, 0.10);
    }
    .header {
      background: linear-gradient(135deg, #0f3d91, #1769d1);
      color: #ffffff;
      padding: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .header p {
      margin: 8px 0 0;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .reply {
      margin-top: 20px;
      padding: 20px;
      border-radius: 12px;
      background: #f8fafc;
      border-left: 4px solid #1769d1;
      line-height: 1.7;
      white-space: pre-wrap;
    }
    .subject {
      margin-top: 20px;
      padding: 16px;
      border-radius: 12px;
      background: #eef6ff;
    }
    .footer {
      padding: 22px 30px;
      text-align: center;
      background: #f8fafc;
      color: #64748b;
      font-size: 12px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1>Reply from SCMS Administration</h1>
        <p>The National Degree College, Bagepalli</p>
      </div>

      <div class="content">
        <p>
          Hello ${escapeHtml(query.name || "User")},
        </p>

        <p>
          The college administration has replied to your query.
        </p>

        <div class="reply">
          ${escapeHtml(reply)}
        </div>

        <div class="subject">
          <strong>Subject</strong><br />
          ${escapeHtml(query.subject || "College Query")}
        </div>

        <p>
          Regards,<br />
          ${escapeHtml(adminName)}<br />
          The National Degree College, Bagepalli
        </p>
      </div>

      <div class="footer">
        This message was sent through the Smart College Management System.
      </div>
    </div>
  </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"${fromName}" <${emailUser}>`,
      to: recipientEmail,
      replyTo: emailUser,
      subject: `Re: ${query.subject || "Your SCMS Query"}`,
      text: `
Hello ${query.name || "User"},

The college administration has replied to your query.

Reply:
${reply}

Subject:
${query.subject || "College Query"}

Regards,
${adminName}
The National Degree College, Bagepalli
      `.trim(),
      html: htmlMessage,
    });

    // Save reply and mark resolved.
    await queryRef.update({
      reply,
      repliedBy: adminName,
      repliedAt: FieldValue.serverTimestamp(),
      replyEmailSent: true,
      status: "resolved",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Reply sent successfully to the user's Gmail.",
        emailSent: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "QUERY REPLY API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to send reply.",
      },
      { status: 500 }
    );
  }
}