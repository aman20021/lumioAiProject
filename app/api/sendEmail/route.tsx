// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
const RESEND_API_KEY = 're_BnFTT19L_MU5nSQoAVUhXmTSMnDCSAYiB';
const resend = new Resend(RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, prompt, result } = await request.json();

    // Validate inputs
    if (!email || !prompt || !result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email
    const { error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your AI Assistant Result',
      html: `
        <h1>Here's your requested information</h1>
        <h3>Your Prompt:</h3>
        <p>${prompt}</p>
        <h3>AI Response:</h3>
        <pre>${result}</pre>
        <hr>
        <p>Sent by AI Assistant</p>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}