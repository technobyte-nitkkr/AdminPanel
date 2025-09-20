import { NextRequest, NextResponse } from 'next/server';
import { getAllContacts } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const contacts = await getAllContacts();
    return NextResponse.json({ data: { contacts } });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get contacts' },
      { status: 500 }
    );
  }
}
