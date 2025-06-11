import { NextRequest, NextResponse } from 'next/server';
import { makeSignedRequest } from '@/services/glamsquad/client';

export async function POST(req: NextRequest) {
  try {
    let body = await req.json();
    body = {
      grant_type: "password",
      ...body 
    }
    
    const data = await makeSignedRequest('POST', '/api/v1/auth/token', body);
    
    return NextResponse.json(data, { status: 200 });  
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.body?.error || error.message || 'Authentication failed' },
      { status: error.res?.status || 401 }
    );
  }
}