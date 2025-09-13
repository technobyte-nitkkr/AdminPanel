import { NextRequest, NextResponse } from 'next/server';
import { getTimelineEvents } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const timelineEvents = await getTimelineEvents();
    return NextResponse.json({ data: { events: timelineEvents } });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get timeline events' },
      { status: 500 }
    );
  }
}
