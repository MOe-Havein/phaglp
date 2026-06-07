"use server";

export async function subscribeToNewsletter(email: string) {
  try {
    const API_KEY = process.env.CONVERTKIT_API_KEY;
    const FORM_ID = process.env.CONVERTKIT_FORM_ID;

    if (!API_KEY || !FORM_ID) {
      console.error(
        "Missing ConvertKit API Key or Form ID in environment variables.",
      );
      return { success: false, message: "Configuration error" };
    }

    const url = `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: API_KEY,
        email: email,
      }),
    });

    if (response.ok) {
      return { success: true, message: "Successfully subscribed!" };
    } else {
      const errorData = await response.json();
      console.error("ConvertKit API Error:", errorData);
      return {
        success: false,
        message: errorData.message || "Something went wrong",
      };
    }
  } catch (error) {
    console.error("Subscription Error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
