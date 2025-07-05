import { NextRequest, NextResponse } from 'next/server';
import { getVideos } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const videos = await getVideos();
    return NextResponse.json({ data: videos });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get videos' },
      { status: 500 }
    );
  }
}
