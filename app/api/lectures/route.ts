import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllLecture, 
  getLectureById, 
  createLecture, 
  updateLecture, 
  deleteLecture, 
  Lecture
} from '@/app/actions/lecture';
import { getGuestLectures } from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const lecture = await getLectureById(id);
      return NextResponse.json(lecture, { status: 200 });
    } else {
      const lectures = await getAllLecture();
      return NextResponse.json(lectures, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch lectures' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Create lecture object from form data
    const lecture: any = {
      date: formData.get('date') as string,
      desc: formData.get('desc') as string,
      name: formData.get('name') as string,
      time: formData.get('time') as string,
      image: formData.get('image') as File,
    };
    
    // Add optional fields if provided
    if (formData.has('facebook')) lecture.facebook = formData.get('facebook') as string;
    if (formData.has('insta')) lecture.insta = formData.get('insta') as string;
    if (formData.has('linkedin')) lecture.linkedin = formData.get('linkedin') as string;
    if (formData.has('link')) lecture.link = formData.get('link') as string;
    
    if (!lecture.date || !lecture.desc || !lecture.name || !lecture.time) {
      return NextResponse.json(
        { error: 'Date, description, name, and time are required' },
        { status: 400 }
      );
    }
    
    const result = await createLecture(lecture);
    
    if (typeof result === 'object' && 'err_desc' in result) {
      return NextResponse.json(
        { error: result.err_desc },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { id: result, message: 'Lecture created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create lecture' },
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
        { error: 'Lecture ID is required' },
        { status: 400 }
      );
    }
    
    // Build lecture object from form data
    const updatedData: Partial<Lecture> = {}; // Use Partial<Lecture> for type safety
    
    // Add fields if provided
    if (formData.has('date')) updatedData.date = formData.get('date') as string;
    if (formData.has('desc')) updatedData.desc = formData.get('desc') as string;
    if (formData.has('name')) updatedData.name = formData.get('name') as string;
    if (formData.has('time')) updatedData.time = formData.get('time') as string;
    if (formData.has('facebook')) updatedData.facebook = formData.get('facebook') as string;
    if (formData.has('insta')) updatedData.insta = formData.get('insta') as string;
    if (formData.has('linkedin')) updatedData.linkedin = formData.get('linkedin') as string;
    if (formData.has('link')) updatedData.link = formData.get('link') as string;
    if (formData.has('image')) updatedData.image = formData.get('image') as File;
    
    await updateLecture(id, updatedData); // Pass id and updatedData separately
    
    return NextResponse.json(
      { message: 'Lecture updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update lecture' },
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
        { error: 'Lecture ID is required' },
        { status: 400 }
      );
    }
    
    await deleteLecture(id);
    
    return NextResponse.json(
      { message: 'Lecture deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete lecture' },
      { status: 500 }
    );
  }
}
