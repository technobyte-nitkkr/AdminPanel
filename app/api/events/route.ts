import { NextRequest, NextResponse } from 'next/server';
import { addEvent } from '@/app/actions/manager';
import { 
  getAllEvents, 
  getEventByName, 
  updateEventByName, 
  deleteEvent 
} from '@/app/actions/events';
import {
  getEventsNames,
  getEventsDescriptionByCategory,
  getTimelineEvents,
  getUpcomingEvents
} from '@/app/actions/information';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const eventCategory = searchParams.get('eventCategory');
    const eventName = searchParams.get('eventName');
    const timestamp = searchParams.get('timestamp');
    const authHeader = request.headers.get('authorization') || "";

    switch (action) {
      case 'description':
        if (!eventCategory) {
          return NextResponse.json({ error: 'Event category is required' }, { status: 400 });
        }
        const eventsDesc = await getEventsDescriptionByCategory(eventCategory, eventName || undefined, authHeader);
        return NextResponse.json({ data: { events: eventsDesc } });

      case 'timeline':
        const timelineEvents = await getTimelineEvents(authHeader);
        return NextResponse.json({ data: { events: timelineEvents } });

      case 'upcoming':
        const upcomingEvents = await getUpcomingEvents(timestamp ? Number(timestamp) : undefined, authHeader);
        return NextResponse.json({ data: { events: upcomingEvents } });

      case 'list':
        const events = await getEventsNames(eventCategory || undefined, authHeader);
        return NextResponse.json({ data: { events } });

      default:
        // Fallback to original behavior
        if (eventName && eventCategory) {
          const event = await getEventByName(eventCategory, eventName);
          return NextResponse.json(event, { status: 200 });
        } else {
          const allEvents = await getAllEvents();
          return NextResponse.json(allEvents, { status: 200 });
        }
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    let eventData;

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      let coordinators: any[] = [];
      let rules: string[] = [];
      
      const coordinatorsJson = formData.get('coordinators');
      const rulesJson = formData.get('rules');
      
      if (coordinatorsJson && typeof coordinatorsJson === 'string') {
        coordinators = JSON.parse(coordinatorsJson);
      }
      if (rulesJson && typeof rulesJson === 'string') {
        rules = JSON.parse(rulesJson);
      }
      
      eventData = {
        coordinators,
        description: formData.get('description') as string,
        document: formData.get('document') as string,
        endTime: Number(formData.get('endTime')),
        eventCategory: formData.get('eventCategory') as string,
        eventName: formData.get('eventName') as string,
        flagship: formData.get('flagship') === 'true',
        rules,
        startTime: Number(formData.get('startTime')),
        venue: formData.get('venue') as string,
        image: formData.get('image') as File,
      };
    } else {
      // Handle JSON data
      eventData = await request.json();
    }
    
    if (!eventData.category || !eventData.eventName) {
      return NextResponse.json(
        { success: false, message: 'Event category and name are required' },
        { status: 400 }
      );
    }
    const authHeader = request.headers.get('authorization') || '';
    const result = await addEvent(eventData,authHeader);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: error?.response?.data?.message || error.message || 'Failed to create event'
      },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const category = formData.get('category') as string;
    const eventName = formData.get('eventName') as string;
    
    if (!category || !eventName) {
      return NextResponse.json(
        { error: 'Event category and name are required' },
        { status: 400 }
      );
    }
    
    // Parse coordinators from form data (expected as JSON string)
    let coordinators: any[] = [];
    const coordinatorsJson = formData.get('coordinators');
    
    if (coordinatorsJson && typeof coordinatorsJson === 'string') {
      coordinators = JSON.parse(coordinatorsJson);
    }
    
    // Parse rules from form data (expected as JSON string)
    let rules: string[] = [];
    const rulesJson = formData.get('rules');
    
    if (rulesJson && typeof rulesJson === 'string') {
      rules = JSON.parse(rulesJson);
    }
    
    // Build updated data object
    const updatedData: any = {
      coordinators,
      description: formData.get('description') as string,
      document: formData.get('document') as string,
      endTime: Number(formData.get('endTime')),
      eventCategory: formData.get('eventCategory') as string,
      eventName: formData.get('eventName') as string,
      flagship: formData.get('flagship') === 'true',
      rules,
      startTime: Number(formData.get('startTime')),
      venue: formData.get('venue') as string,
    };
    
    // Include image if provided
    if (formData.has('image')) {
      updatedData.image = formData.get('image') as File;
    }
    
    const result = await updateEventByName(category, eventName, updatedData);
    
    return NextResponse.json(
      { success: result, message: 'Event updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const eventName = searchParams.get('eventName');
    
    if (!category || !eventName) {
      return NextResponse.json(
        { error: 'Event category and name are required' },
        { status: 400 }
      );
    }
    
    await deleteEvent(category, eventName);
    
    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}
