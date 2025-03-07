import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  
  // Delete the HTTP-only token cookie
  cookieStore.delete('token');
  
  // Also ensure the client-side cookie is deleted with the same path setting
  cookieStore.set('token', '', { 
    expires: new Date(0),
    path: '/',
  });
  
  console.log('User logged out, all cookies cleared');
  
  // Redirect to login page with cache-busting query parameter
  const redirectUrl = new URL('/login?t=' + Date.now(), process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  return NextResponse.redirect(redirectUrl);
}
