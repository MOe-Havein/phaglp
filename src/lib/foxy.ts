import crypto from "crypto";

/**
 * Signs an individual product parameter value using FoxyCart's HMAC cart validation method.
 * Formats the signature as: value||hmac_signature
 */
export function signFoxyValue(
  code: string,
  name: string,
  value: string,
  secret: string,
): string {
  const dataToHash = code + name + value;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(dataToHash)
    .digest("hex");
  return `${value}||${hmac}`;
}

interface FoxyUrlParams {
  code: string;
  name: string;
  price: number;
  userId?: string | undefined;
  userEmail?: string | undefined;
  customParams?: Record<string, string> | undefined;
}

/**
 * Generates a FoxyCart "Add to Cart" checkout link.
 * If FOXY_API_SECRET is set, the parameters are signed using HMAC to prevent tampering.
 */
export function getFoxyCartUrl({
  code,
  name,
  price,
  userId,
  userEmail,
  customParams = {},
}: FoxyUrlParams): string {
  const subdomain = process.env.NEXT_PUBLIC_FOXY_STORE_SUBDOMAIN || "phaglp";
  const secret = process.env.FOXY_API_SECRET;

  const baseUrl = `https://${subdomain}.foxycart.com/cart`;

  const formattedPrice = price.toFixed(2);

  let signedName = name;
  let signedPrice = formattedPrice;
  let signedUserId = userId || "";
  let signedUserEmail = userEmail || "";

  if (secret) {
    signedName = signFoxyValue(code, "name", name, secret);
    signedPrice = signFoxyValue(code, "price", formattedPrice, secret);
    if (userId) {
      signedUserId = signFoxyValue(code, "user_id", userId, secret);
    }
    if (userEmail) {
      signedUserEmail = signFoxyValue(
        code,
        "customer_email",
        userEmail,
        secret,
      );
    }
  }

  const queryParams = new URLSearchParams();
  queryParams.set("code", code);
  queryParams.set("name", signedName);
  queryParams.set("price", signedPrice);

  if (userId) {
    queryParams.set("user_id", signedUserId);
  }
  if (userEmail) {
    queryParams.set("customer_email", signedUserEmail);
  }

  // Add and sign any additional parameters (e.g. sub_frequency)
  for (const [key, val] of Object.entries(customParams)) {
    let signedVal = val;
    if (secret) {
      signedVal = signFoxyValue(code, key, val, secret);
    }
    queryParams.set(key, signedVal);
  }

  return `${baseUrl}?${queryParams.toString()}`;
}

/**
 * Verifies a FoxyCart webhook signature.
 * Webhook signature is an HMAC-SHA256 signature of the raw request payload,
 * verified using the FOXY_API_SECRET.
 */
export function verifyFoxySignature(
  rawBody: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature || !secret) {
    return false;
  }

  try {
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(computedSignature, "hex"),
    );
  } catch (error) {
    console.error("Error verifying Foxy signature:", error);
    return false;
  }
}
