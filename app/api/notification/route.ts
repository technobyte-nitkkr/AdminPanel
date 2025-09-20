import { NextRequest, NextResponse } from 'next/server';
import { getNotifications } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const notifications = await getNotifications();
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
