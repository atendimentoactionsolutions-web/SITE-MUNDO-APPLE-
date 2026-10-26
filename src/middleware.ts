import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie || sessionCookie.value !== "authenticated_adm") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Also protect admin API endpoints from unauthorized direct fetch
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login")) {
    const sessionCookie = request.cookies.get("admin_session");
    if (!sessionCookie || sessionCookie.value !== "authenticated_adm") {
      return NextResponse.json(
        { success: false, error: "Acesso não autorizado. Faça login." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
