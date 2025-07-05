import { NextRequest, NextResponse } from 'next/server';
import { getFAQs } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const faqs = await getFAQs();
    return NextResponse.json({ data: faqs });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}
