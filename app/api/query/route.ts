import { NextRequest, NextResponse } from 'next/server';
import { addQuery } from '@/app/actions/users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if(!body.text){
      return NextResponse.json({
        success:false,
        message:'query is required'
      })
    }
    const authHeader = request.headers.get('authorization') || '';
    const result = await addQuery(body,authHeader);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add query' },
      { status: 500 }
    );
  }
}
