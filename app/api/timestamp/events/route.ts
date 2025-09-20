import { NextRequest, NextResponse } from 'next/server';
import { getFAQs, getUpcomingEvents } from '@/app/actions/information';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timestamp = searchParams.get('timestamp');
        const upcomingEvents = await getUpcomingEvents(timestamp ? Number(timestamp) : undefined);
        return NextResponse.json({ data: { events: upcomingEvents } });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch upcoming events' },
            { status: 500 }
        );
    }
}
