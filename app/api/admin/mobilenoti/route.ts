import { NextRequest, NextResponse } from 'next/server';
import { sendNotification } from '@/app/actions/admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { success: false, message: 'Notification data is required' },
        { status: 400 }
      );
    }    const result = await sendNotification(body,authHeader);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: error?.response?.data?.message || error.message || 'Failed to send notification'
      },
      { status: error?.response?.status || 500 }
    );
  }
}
