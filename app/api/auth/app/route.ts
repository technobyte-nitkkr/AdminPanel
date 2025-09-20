import { NextRequest, NextResponse } from 'next/server';
import { loginUsingOAuth, updateUserProfile } from '@/app/actions/app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.idToken) {
      return NextResponse.json({ error: 'ID Token required' }, { status: 400 });
    }
    const result = await loginUsingOAuth(body.idToken);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to login' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.year || !body.college) {
      return NextResponse.json({ 
        error: 'Year and college are required for profile update' 
      }, { status: 400 });
    }
    const result = await updateUserProfile(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
