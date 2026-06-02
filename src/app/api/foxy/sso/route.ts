import { NextResponse } from "next/server"
import { auth } from "@/auth"
import crypto from "crypto"

/**
 * FoxyCart Customer Portal Single Sign-On (SSO) Endpoint.
 *
 * When a user attempts to access the FoxyCart customer portal or checkout profile,
 * FoxyCart redirects them to this endpoint to verify their authentication session.
 *
 * Incoming GET request from FoxyCart contains:
 * - foxy_customer_action: The return URL on FoxyCart to redirect back to.
 * - timestamp: Unix timestamp of the request.
 * - foxy_hash: HMAC-SHA256 signature from FoxyCart to verify the request's integrity.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const foxyCustomerAction = searchParams.get("foxy_customer_action")
  const incomingTimestamp = searchParams.get("timestamp")
  const incomingHash = searchParams.get("foxy_hash")

  const secret = process.env.FOXY_API_SECRET

  if (!foxyCustomerAction) {
    return NextResponse.json({ error: "Missing foxy_customer_action parameter" }, { status: 400 })
  }

  // 1. Verify NextAuth session
  const session = await auth()
  if (!session?.user?.email) {
    // If user is not logged in, redirect them to the local login page
    // Include a callbackUrl so they return to this SSO endpoint after logging in
    const loginUrl = new URL("/login", request.url)
    const callbackUrl = new URL(request.url)
    loginUrl.searchParams.set("callbackUrl", callbackUrl.pathname + callbackUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  const customerEmail = session.user.email

  // 2. If FOXY_API_SECRET is configured, we can verify the incoming signature from Foxy
  if (secret && incomingTimestamp && incomingHash) {
    const dataToVerify = incomingTimestamp + foxyCustomerAction
    const computedIncomingHash = crypto
      .createHmac("sha256", secret)
      .update(dataToVerify)
      .digest("hex")

    if (computedIncomingHash !== incomingHash) {
      console.error("[Foxy SSO] Invalid incoming hash from FoxyCart")
      return NextResponse.json({ error: "Invalid Foxy signature" }, { status: 401 })
    }
  }

  // 3. Generate response credentials for FoxyCart
  const responseTimestamp = Math.floor(Date.now() / 1000).toString()
  let responseHash = ""

  if (secret) {
    // Sign the response to let FoxyCart know the customer is verified
    // Format: responseTimestamp + customerEmail
    const dataToSign = responseTimestamp + customerEmail
    responseHash = crypto
      .createHmac("sha256", secret)
      .update(dataToSign)
      .digest("hex")
  }

  // 4. Construct redirection URL back to FoxyCart
  const redirectUrl = new URL(foxyCustomerAction)
  redirectUrl.searchParams.set("foxy_customer_email", customerEmail)
  redirectUrl.searchParams.set("timestamp", responseTimestamp)
  if (responseHash) {
    redirectUrl.searchParams.set("foxy_hash", responseHash)
  }

  console.log(`[Foxy SSO] Successfully authenticated ${customerEmail} and redirecting to FoxyCart`)
  return NextResponse.redirect(redirectUrl)
}
