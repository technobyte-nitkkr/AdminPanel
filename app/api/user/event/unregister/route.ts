import { NextRequest, NextResponse } from 'next/server';
import { unregisterUserEvent } from '@/app/actions/users';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    if (!body.eventName || !body.eventCategory) {
      return NextResponse.json(
        { error: 'Event name and category are required' },
        { status: 400 }
      );
    }
    const result = await unregisterUserEvent(body, authHeader ?? undefined);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to unregister from event' },
      { status: 500 }
    );
  }
}
