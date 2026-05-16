import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_for_development_replace_in_prod",
)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(JWT_SECRET)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, JWT_SECRET, {
    algorithms: ["HS256"],
  })
  return payload
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function logout() {
  ;(await cookies()).set("session", "", { expires: new Date(0) })
}
