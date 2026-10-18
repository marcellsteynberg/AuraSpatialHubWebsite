import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-ClientInfo, Apikey",
};

const RECIPIENT_EMAIL = "auraspatialhub@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, email, phone, company, inquiryType, message } = body;

    if (!name || !email || !inquiryType || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Store the enquiry in the database.
    const { error: dbError } = await supabase.from("enquiries").insert({
      name,
      email,
      phone: phone || null,
      company: company || null,
      inquiry_type: inquiryType,
      message,
    });

    if (dbError) {
      return new Response(
        JSON.stringify({ error: "Failed to save enquiry." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the Resend API key from the app_secrets table.
    const { data: secretRow } = await supabase
      .from("app_secrets")
      .select("value")
      .eq("key", "RESEND_API_KEY")
      .maybeSingle();

    const resendApiKey = secretRow?.value;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found in app_secrets table.");
      // Enquiry is still saved in DB, so we return success.
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build a formatted email body.
    const emailBody = [
      `New enquiry received via the Aura Spatial Hub website.`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Company: ${company || "Not provided"}`,
      `Inquiry Type: ${inquiryType}`,
      ``,
      `Message:`,
      `${message}`,
      ``,
      `---`,
      `Submitted at: ${new Date().toISOString()}`,
    ].join("\n");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Aura Spatial Hub <onboarding@resend.dev>",
        to: [RECIPIENT_EMAIL],
        subject: `New Enquiry: ${inquiryType} — ${name}`,
        text: emailBody,
        reply_to: email,
      }),
    });

    if (!emailResponse.ok) {
      const errText = await emailResponse.text();
      console.error("Resend error:", errText);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
