import { NextRequest, NextResponse } from 'next/server';
import { getDevelopers, getAppDevelopers } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const devs = await getDevelopers();
    return NextResponse.json({ data: { devs } });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get developers info' },
      { status: 500 }
    );
  }
}
