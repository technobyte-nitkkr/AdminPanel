import { NextRequest, NextResponse } from 'next/server';
import { getCategoriesName } from '@/app/actions/information';
import { addCategory } from '@/app/actions/admin';
import { Category } from '@/app/dtos/category.dto';

export async function GET(request: NextRequest) {
  try {
    const categories = await getCategoriesName();
    return NextResponse.json({ data: { categories } });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.categoryName || typeof body.categoryName !== 'string') {
      return NextResponse.json(
        { error: 'Category name is required and must be a string' },
        { status: 400 }
      );
    }
    if (!body.imgUrl || typeof body.imgUrl !== 'string') {
      return NextResponse.json(
        { error: 'Image URL is required and must be a string' },
        { status: 400 }
      );
    }
    if (!body.icon || typeof body.icon !== 'string') {
      return NextResponse.json(
        { error: 'Icon is required and must be a string' },
        { status: 400 }
      );
    }

    const category = {
      categoryName: body.categoryName,
      imgUrl: body.imgUrl,
      icon: body.icon
    };
    const authHeader = request.headers.get('authorization') || '';
    const result = await addCategory(category,authHeader);
    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add category' },
      { status: error.response?.status || 500 }
    );
  }
}
