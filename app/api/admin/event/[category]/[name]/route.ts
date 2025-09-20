import { NextRequest, NextResponse } from 'next/server';
import { getDataOfEvent } from '@/app/actions/manager';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; name: string } }
) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    if (!params.category || !params.name) {
      return NextResponse.json({ error: 'Event category and name are required' }, { status: 400 });
    }
    const result = await getDataOfEvent(params.category, params.name,authHeader);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch event data' },
      { status: 500 }
    );
  }
}
