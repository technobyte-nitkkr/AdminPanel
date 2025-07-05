import { NextRequest, NextResponse } from 'next/server';
import { getEventsDescriptionByCategory } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventCategory = searchParams.get('eventCategory');
    const eventName = searchParams.get('eventName');

    if (!eventCategory) {
      return NextResponse.json(
        { error: 'Event category is required' },
        { status: 400 }
      );
    }

    const eventsDesc = await getEventsDescriptionByCategory(eventCategory, eventName || undefined);
    return NextResponse.json({ data: { events: eventsDesc } });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get event description' },
      { status: 500 }
    );
  }
}
