import { NextRequest, NextResponse } from 'next/server';
import { getUserEvents, updateUserEvent } from '@/app/actions/users';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || "";
    const events = await getUserEvents(authHeader);
    return NextResponse.json(events, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user events' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || "";
    const body = await request.json();
    
    if (!body.eventName || !body.eventCategory) {
      return NextResponse.json(
        { error: 'Event name and category are required' },
        { status: 400 }
      );
    }
    
    const result = await updateUserEvent(body, authHeader);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user event' },
      { status: 500 }
    );
  }
}
