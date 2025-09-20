import { NextRequest, NextResponse } from 'next/server';
import { getDevelopers, getAppDevelopers } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
        
        const appDevs = await getAppDevelopers();
        return NextResponse.json({ data: { information: appDevs } });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get developers info' },
      { status: 500 }
    );
  }
}
