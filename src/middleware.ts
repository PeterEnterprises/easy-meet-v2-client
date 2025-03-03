import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/events',
]

// Define paths that are only accessible to unauthenticated users
const authPaths = [
  '/login',
  '/signup',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the user has a token
  const token = request.cookies.get('token')
  const isAuthenticated = !!token
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && protectedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

// Configure the paths that trigger the middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/events/:path*',
    '/login',
    '/signup',
  ],
}
