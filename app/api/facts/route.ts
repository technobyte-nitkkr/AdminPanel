import { NextRequest, NextResponse } from 'next/server';
import { getRandomFact } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const fact = await getRandomFact();
    return NextResponse.json({ data: { message: fact } });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get random fact' },
      { status: 500 }
    );
  }
}
