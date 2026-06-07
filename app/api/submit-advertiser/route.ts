import { NextResponse } from "next/server";

// POST endpoint to submit advertiser inquiry
// Note: The actual Convex mutation would be called from a client component
// For now, we'll just log the submission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company_name, contact_name, email, phone, website, budget, message } = body;

    // Validate required fields
    if (!company_name || !contact_name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the inquiry (in production, this would call Convex directly)
    console.log("Advertiser inquiry received:", {
      company_name,
      contact_name,
      email,
      phone,
      website,
      budget,
      message: message?.substring(0, 100),
    });

    return NextResponse.json({ success: true, message: "Inquiry submitted successfully" });
  } catch (error) {
    console.error("Error submitting advertiser inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}