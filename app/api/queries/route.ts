import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

interface QueryRequest {
  name: string;
  email: string;
  phone?: string;
  category?: string;
  subject: string;
  message: string;
}

function cleanText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QueryRequest;

    const name = cleanText(body.name);
    const email = cleanText(body.email).toLowerCase();
    const phone = cleanText(body.phone);
    const category = cleanText(body.category) || "General";
    const subject = cleanText(body.subject);
    const message = cleanText(body.message);

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your name.",
        },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must contain at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a subject.",
        },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your query.",
        },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Query must contain at least 10 characters.",
        },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is too long.",
        },
        { status: 400 }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject is too long.",
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "Query is too long. Maximum 5000 characters.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // ENVIRONMENT VARIABLES
    // --------------------------------------------------

    const emailUser = process.env.SCMS_EMAIL_USER;
    const emailAppPassword = process.env.SCMS_EMAIL_APP_PASSWORD;
    const recipientsString = process.env.SCMS_QUERY_RECIPIENTS;
    const fromName =
      process.env.SCMS_EMAIL_FROM_NAME ||
      "SCMS - The National Degree College, Bagepalli";

    if (!emailUser) {
      console.error("Missing SCMS_EMAIL_USER");

      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        { status: 500 }
      );
    }

    if (!emailAppPassword) {
      console.error("Missing SCMS_EMAIL_APP_PASSWORD");

      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        { status: 500 }
      );
    }

    if (!recipientsString) {
      console.error("Missing SCMS_QUERY_RECIPIENTS");

      return NextResponse.json(
        {
          success: false,
          message: "Query recipients are not configured.",
        },
        { status: 500 }
      );
    }

    const recipients = recipientsString
      .split(",")
      .map((emailAddress) => emailAddress.trim())
      .filter(Boolean);

    if (recipients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No admin or faculty email addresses configured.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // SAVE QUERY TO FIRESTORE
    // --------------------------------------------------

    const queryRef = adminDb.collection("queries").doc();

    const queryId = queryRef.id;

    await queryRef.set({
      id: queryId,

      name,
      email,
      phone: phone || null,

      category,
      subject,
      message,

      status: "new",

      emailSent: false,

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // --------------------------------------------------
    // CREATE GMAIL TRANSPORTER
    // --------------------------------------------------

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: emailUser,
        pass: emailAppPassword,
      },
    });

    // --------------------------------------------------
    // EMAIL HTML
    // --------------------------------------------------

    const htmlMessage = `
<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8">

  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
    }

    .container {
      width: 100%;
      padding: 30px 10px;
    }

    .card {
      max-width: 700px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    .header {
      background: linear-gradient(135deg, #0f3d91, #1769d1);
      color: white;
      padding: 28px;
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
      padding: 28px;
    }

    .alert {
      background: #eef6ff;
      border-left: 5px solid #1769d1;
      padding: 15px;
      margin-bottom: 22px;
      border-radius: 8px;
    }

    .row {
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .label {
      font-weight: bold;
      color: #374151;
      display: block;
      margin-bottom: 4px;
    }

    .value {
      color: #111827;
    }

    .message {
      margin-top: 22px;
      padding: 18px;
      background: #f8fafc;
      border-radius: 10px;
      white-space: pre-wrap;
      line-height: 1.6;
    }

    .footer {
      background: #f8fafc;
      padding: 20px 28px;
      color: #6b7280;
      font-size: 13px;
      text-align: center;
    }

    .query-id {
      font-family: monospace;
      background: #f3f4f6;
      padding: 4px 7px;
      border-radius: 5px;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="card">

      <div class="header">
        <h1>New College Query</h1>
        <p>The National Degree College, Bagepalli</p>
      </div>

      <div class="content">

        <div class="alert">
          A new query has been submitted through the
          Smart College Management System.
        </div>

        <div class="row">
          <span class="label">Query ID</span>
          <span class="value query-id">${escapeHtml(queryId)}</span>
        </div>

        <div class="row">
          <span class="label">Name</span>
          <span class="value">${escapeHtml(name)}</span>
        </div>

        <div class="row">
          <span class="label">Email</span>
          <span class="value">${escapeHtml(email)}</span>
        </div>

        <div class="row">
          <span class="label">Phone</span>
          <span class="value">${escapeHtml(phone || "Not provided")}</span>
        </div>

        <div class="row">
          <span class="label">Category</span>
          <span class="value">${escapeHtml(category)}</span>
        </div>

        <div class="row">
          <span class="label">Subject</span>
          <span class="value">${escapeHtml(subject)}</span>
        </div>

        <div class="message">
          <strong>Query:</strong>

          ${escapeHtml(message)}
        </div>

      </div>

      <div class="footer">
        This notification was generated automatically by
        SCMS - The National Degree College, Bagepalli.
      </div>

    </div>

  </div>

</body>
</html>
`;

    // --------------------------------------------------
    // SEND EMAIL
    // --------------------------------------------------

    try {
      await transporter.sendMail({
        from: `"${fromName}" <${emailUser}>`,

        to: recipients,

        replyTo: email,

        subject: `New SCMS Query: ${subject}`,

        text: `
New College Query

The National Degree College, Bagepalli

Query ID: ${queryId}

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Category: ${category}
Subject: ${subject}

Query:
${message}
        `,

        html: htmlMessage,
      });

      // ------------------------------------------------
      // UPDATE FIRESTORE AFTER EMAIL SUCCESS
      // ------------------------------------------------

      await queryRef.update({
        emailSent: true,
        emailSentAt: FieldValue.serverTimestamp(),
        emailRecipients: recipients,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json(
        {
          success: true,
          message:
            "Your query has been submitted successfully. Admin/Faculty have been notified.",
          queryId,
        },
        { status: 201 }
      );
    } catch (emailError) {
      console.error("SCMS EMAIL ERROR:", emailError);

      // Keep the query in Firestore even if email fails
      await queryRef.update({
        emailSent: false,
        emailError:
          emailError instanceof Error
            ? emailError.message
            : "Unknown email error",
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json(
        {
          success: true,
          emailSent: false,
          message:
            "Your query was saved successfully, but email notification could not be sent.",
          queryId,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("SCMS QUERY API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit your query. Please try again.",
      },
      { status: 500 }
    );
  }
}