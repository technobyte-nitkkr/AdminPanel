import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/app/actions/admin';
import { auth } from 'firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const result = await updateUser(authHeader);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update users' },
      { status: 500 }
    );
  }
}
