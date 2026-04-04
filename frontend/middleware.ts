import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("legalcase_session")?.value;
  const { pathname } = request.nextUrl;

  const isApi = pathname.startsWith("/api");
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";
  const isPublicApi = pathname.startsWith("/api/auth/login");
  const isRegisterApi = pathname.startsWith("/api/auth/register");

  if (isPublicApi || isRegisterApi) {
    return NextResponse.next();
  }

  if (!session && !isLogin && !isSignup && !isApi) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && (isLogin || isSignup)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
