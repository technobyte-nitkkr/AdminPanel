import { NextRequest, NextResponse } from 'next/server';
import { deleteQuery } from '@/app/actions/admin';
import { getQuery } from '@/app/actions/manager';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || "";
    const result = await getQuery(authHeader);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch queries' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || "";
    const body = await request.json();
    const result = await deleteQuery(body,authHeader);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete query' },
      { status: 500 }
    );
  }
}
