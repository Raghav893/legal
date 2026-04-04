import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow Next internals and typical static assets. If middleware runs on these
  // (matcher edge cases in dev/prod), a redirect would return HTML instead of CSS/JS.
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get("legalcase_session")?.value;

  const isApi = pathname.startsWith("/api");
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";
  const isPublicApi = pathname.startsWith("/api/auth/login");
  const isRegisterApi = pathname.startsWith("/api/auth/register");
  const isLogoutApi = pathname.startsWith("/api/auth/logout");

  if (isPublicApi || isRegisterApi || isLogoutApi) {
    return NextResponse.next();
  }

  if (!session && !isLogin && !isSignup && !isApi) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)"
  ]
};
