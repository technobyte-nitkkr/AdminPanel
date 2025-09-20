import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/app/actions/admin';

export async function GET(request: NextRequest) {
  try {    const result = await updateUser();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: error?.response?.data?.message || error.message || 'Failed to update users'
      },
      { status: error?.response?.status || 500 }
    );
  }
}
