import { NextRequest, NextResponse } from 'next/server';
import { getDataOfEvent } from '@/app/actions/manager';

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url);
    const eventCategory = searchParams.get('eventCategory');
    const eventName = searchParams.get('eventName');
    const authHeader = request.headers.get('authorization');

    if (!eventCategory || !eventName) {
      return NextResponse.json(
        { success: false, message: 'Event category and name are required' },
        { status: 400 }
      );
    }

    const result = await getDataOfEvent(
      eventCategory,
      eventName,
      authHeader ?? undefined
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          error?.response?.data?.message ||
          error.message ||
          'Failed to fetch event data',
      },
      { status: error?.response?.status || 500 }
    );
  }
}
