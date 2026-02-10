import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/admin", "/login"],
};

export const dynamic = "force-dynamic";

export async function proxy(request: NextRequest) {
  const user = request.cookies.get("user")?.value;
  const jwt = request.cookies.get("jwt")?.value;
  if (!user && !jwt && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    (user || jwt) &&
    request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.searchParams.get("guest")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
