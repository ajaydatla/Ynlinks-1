import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";

// Public API wrapper - use this in client components
export const publicApi = {
  submitAdvertiserInquiry: async (data: {
    company_name: string;
    contact_name: string;
    email: string;
    phone: string;
    website: string;
    budget: string;
    message: string;
  }) => {
    // Use fetch to call the API directly since we're in a client component
    const response = await fetch("/api/submit-advertiser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to submit inquiry");
    }
    return response.json();
  },
};

// Export the convex api for direct use in convex-connected components
export { api };