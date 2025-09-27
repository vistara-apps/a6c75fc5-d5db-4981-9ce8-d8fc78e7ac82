import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add wallet address to headers if present in query params
  const walletAddress = request.nextUrl.searchParams.get('walletAddress');

  if (walletAddress) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-wallet-address', walletAddress);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/projects/:path*',
    '/nft/:path*',
    '/community/:path*',
  ],
};

