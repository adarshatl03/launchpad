import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail(
  toEmail: string,
  inviterName: string,
  orgName: string,
  inviteLink: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipping email send.");
    return { success: false, error: "Missing API Key" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "AtoZyx LaunchPad <onboarding@resend.dev>",
      to: toEmail,
      subject: `${inviterName} invited you to join ${orgName} on LaunchPad`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>You've been invited!</h1>
          <p><strong>${inviterName}</strong> has invited you to join the organization <strong>${orgName}</strong> on AtoZyx LaunchPad.</p>
          <p>Click the button below to accept the invitation:</p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Accept Invitation
          </a>
          <p style="margin-top: 24px; color: #666; font-size: 14px;">
            Link expires in 7 days.<br/>
            If you didn't expect this invitation, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Email Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Resend Exception:", error);
    return { success: false, error };
  }
}
