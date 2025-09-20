import { NextRequest, NextResponse } from 'next/server';
import { addCategory } from '@/app/actions/admin';

export async function POST(request: NextRequest) {
  try {

    const authHeader = request.headers.get('authorization') || '';
    const body = await request.json();
    const result = await addCategory(body,authHeader);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add category' },
      { status: 500 }
    );
  }
}
