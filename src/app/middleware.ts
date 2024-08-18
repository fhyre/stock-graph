import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  console.log(request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers,
    },
  });
}
