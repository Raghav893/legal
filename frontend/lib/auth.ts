import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.APP_JWT_SECRET || "replace-this-in-production"
);

export type SessionPayload = {
  id: number;
  email: string;
  role: string;
  fullName: string;
  token: string;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);

  cookies().set("legalcase_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  return token;
}

export async function getSession() {
  const token = cookies().get("legalcase_session")?.value;
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as SessionPayload;
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().delete("legalcase_session");
}
