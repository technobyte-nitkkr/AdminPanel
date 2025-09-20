import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllEventCategory, 
  getEventCategoryById, 
  createEventCategory, 
  updateEventCategory, 
  deleteEventCategory 
} from '@/app/actions/eventCategory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const category = await getEventCategoryById(id);
      return NextResponse.json(category, { status: 200 });
    } else {
      const categories = await getAllEventCategory();
      return NextResponse.json(categories, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch event categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const eventCategory = formData.get('eventCategory') as string;
    const image = formData.get('image') as File;
    
    if (!eventCategory || !image) {
      return NextResponse.json(
        { error: 'Event category name and image are required' },
        { status: 400 }
      );
    }
    
    await createEventCategory({ eventCategory, image });
    
    return NextResponse.json(
      { message: 'Event category created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create event category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event category ID is required' },
        { status: 400 }
      );
    }
    
    // Build updated data object
    const updatedData: any = {};
    
    if (formData.has('eventCategory')) {
      updatedData.eventCategory = formData.get('eventCategory') as string;
    }
    
    if (formData.has('image')) {
      updatedData.image = formData.get('image') as File;
    }
    
    await updateEventCategory(id, updatedData);
    
    return NextResponse.json(
      { message: 'Event category updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update event category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event category ID is required' },
        { status: 400 }
      );
    }
    
    await deleteEventCategory(id);
    
    return NextResponse.json(
      { message: 'Event category deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete event category' },
      { status: 500 }
    );
  }
}
