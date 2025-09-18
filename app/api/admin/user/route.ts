import { NextRequest, NextResponse } from 'next/server';
import { updateUserByAdmin } from '@/app/actions/admin';

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { success: false, message: 'User data is required' } ,
        { status: 400 }
      );
    }    
    const result = await updateUserByAdmin(body,authHeader);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: error?.response?.data?.message || error.message || 'Failed to update user'
      },
      { status: error?.response?.status || 500 }
    );
  }
}
