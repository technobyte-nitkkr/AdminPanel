import { NextRequest, NextResponse } from 'next/server';
import { getFoodSponsors } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const foodSponsors = await getFoodSponsors();
    return NextResponse.json({ data: { foodSponsors } });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get food sponsors' },
      { status: 500 }
    );
  }
}
