import { NextRequest, NextResponse } from 'next/server';
import { mailCategory } from '@/app/actions/manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization') || '';
    const {
      eventName,
      eventCategory,
      heading,
      buttontext,
      buttonlink,
      subject,
      thankyou,
      detail
    } = body;

    if (!eventCategory || !eventName) {
      return NextResponse.json(
        { success: false, message: 'Event category and name are required' },
        { status: 400 }
      );
    }

    const result = await mailCategory(
      eventName,
      eventCategory,
      heading,
      buttontext,
      buttonlink,
      subject,
      thankyou,
      detail,authHeader
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: error?.response?.data?.message || error.message || 'Failed to send mail'
      },
      { status: error?.response?.status || 500 }
    );
  }
}
