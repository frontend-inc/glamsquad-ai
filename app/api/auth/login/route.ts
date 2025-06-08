import { NextRequest, NextResponse } from 'next/server';
import { makeSignedRequest } from '@/services/glamsquad/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await makeSignedRequest('POST', '/api/v1/auth/token', body);
    
    // If response is a Response object (for 202 or 404 status), handle it
    if (response instanceof Response) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.body?.error || error.message || 'Authentication failed' },
      { status: error.res?.status || 401 }
    );
  }
}