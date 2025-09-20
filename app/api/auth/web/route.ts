import { NextRequest, NextResponse } from 'next/server';
import { loginWebUsingGoogleWeb, UpdateUserProfileForWeb } from '@/app/actions/web';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    if (!body.idToken || body.idToken.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Invalid token: Token is missing or empty' 
      }, { status: 400 });
    }
    const result = await loginWebUsingGoogleWeb(body, authHeader ?? undefined);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login request failed' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    if (!body.year || !body.college || !body.phone) {
      return NextResponse.json({ 
        error: 'Required fields missing: year, college, and phone are required' 
      }, { status: 400 });
    }
    const result = await UpdateUserProfileForWeb(body, authHeader ?? undefined);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Profile update failed' },
      { status: 500 }
    );
  }
}
