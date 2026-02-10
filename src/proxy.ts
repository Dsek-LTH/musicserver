import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "./API";

export const config = {
  matcher: ["/admin", "/login"],
};

export const dynamic = "force-dynamic";

export async function proxy(request: NextRequest) {
  const user = request.cookies.get("user")?.value;
  const jwt = request.cookies.get("jwt")?.value;
  const accessToken = await getAccessToken();

  if (accessToken == null && process.env.NODE_ENV == "production") {
    console.log("test");
    return NextResponse.redirect(new URL("/admin", request.url));
  }

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
