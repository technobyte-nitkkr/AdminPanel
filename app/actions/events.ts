import { database, ref, set, get, update, remove, query, orderByChild, equalTo } from "@/app/db"; // Ensure `db` is initialized for Realtime Database
import createImgbbUrl from "@/app/helpers/imgbb";

export type Event = {
  coordinators: Coordinator[];
  description: string;
  document: string;
  endTime: number;
  eventCategory: string;
  eventName: string;
  flagship: boolean;
  poster?: string;
  rules: string[];
  startTime: number;
  venue: string;
};

type EventMap = {
  [category: string]: {
    [eventName: string]: Event;
  };
};

type eventData = Event & {
  image: File;
};

export type Coordinator = {
  coordinator_name: string;
  coordinator_number: string;
};

export async function createEvent(eventData: eventData): Promise<string> {
  try {
    const { image, ...event } = eventData;
    if (!image) {
      throw new Error("No image provided");
    }
    const imageUrl = await createImgbbUrl(image);
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const uniqueDocId = `${event.eventName}-${randomSuffix}`;
    const { eventName, startTime, endTime } = event;
    const startTimeNumber = new Date(startTime).getTime();
    const endTimeNumber = new Date(endTime).getTime();

    const fullEventData = {
      ...event,
      poster: imageUrl?.url,
      startTime: startTimeNumber,
      endTime: endTimeNumber,
    };

    await set(ref(database, `eventDescription/${uniqueDocId}`), fullEventData);

    return uniqueDocId;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function getAllEvents(): Promise<EventMap> {
  try {
    const eventsRef = ref(database, "eventDescription");
    const snapshot = await get(eventsRef);
    
    if (!snapshot.exists()) {
      return {};
    }

    return snapshot.val();
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw new Error("Failed to fetch all events");
  }
}


export async function deleteEvent(
  eventName: string,
  eventCategory: string,
): Promise<void> {
  try {
    const eventsRef = ref(database, "eventDescription");
    const eventQuery = query(
      eventsRef,
      orderByChild("eventCategory"),
      equalTo(eventCategory),
    );
    const snapshot = await get(eventQuery);

    if (!snapshot.exists()) {
      console.error(
        `Event '${eventName}' not found in category '${eventCategory}'.`,
      );
      throw new Error("Event does not exist.");
    }

    let eventKey: string | null = null;

    snapshot.forEach((childSnapshot) => {
      const event = childSnapshot.val() as Event;
      if (event.eventName === eventName) {
        eventKey = childSnapshot.key;
      }
    });

    if (eventKey) {
      await remove(ref(database, `eventDescription/${eventKey}`));
    } else {
      throw new Error("Event not found.");
    }
  } catch (error) {
    console.error(
      `Failed to delete event '${eventName}' in category '${eventCategory}':`,
      error,
    );
    throw new Error("Failed to delete event");
  }
}

export async function updateEventByName(
  eventCategory: string,
  eventName: string,
  updatedData: any,
): Promise<void> {
  try {
    const eventsRef = ref(database, "eventDescription");
    const eventQuery = query(
      eventsRef,
      orderByChild("eventCategory"),
      equalTo(eventCategory),
    );

    const snapshot = await get(eventQuery);

    if (!snapshot.exists()) {
      throw new Error(
        `Event '${eventName}' in category '${eventCategory}' does not exist.`,
      );
    }

    let eventKey: string | null = null;
    let poster: string | undefined;

    snapshot.forEach((childSnapshot) => {
      const event = childSnapshot.val() as Event;
      if (event.eventName === eventName) {
        eventKey = childSnapshot.key;
        poster = event.poster;
      }
    });

    if (!eventKey) {
      throw new Error("Event not found.");
    }

    if (updatedData.image) {
      const imageUrl = await createImgbbUrl(updatedData.image);
      poster = imageUrl?.url as string;
    }

    const updatedEventData = {
      ...updatedData,
      poster,
    };

    delete updatedEventData.image;

    await update(ref(database, `eventDescription/${eventKey}`), updatedEventData);
  } catch (error) {
    console.error(
      `Failed to update event '${eventName}' in category '${eventCategory}':`,
      error,
    );
    throw new Error("Failed to update event");
  }
}

export async function getEventByName(
  eventCategory: string,
  eventName: string,
): Promise<Event | null> {
  try {
    const eventsRef = ref(database, "eventDescription");
    const eventQuery = query(
      eventsRef,
      orderByChild("eventCategory"),
      equalTo(eventCategory),
    );

    const snapshot = await get(eventQuery);

    if (!snapshot.exists()) {
      console.error(
        `Event '${eventName}' in category '${eventCategory}' does not exist.`,
      );
      return null;
    }

    let foundEvent: Event | null = null;

    snapshot.forEach((childSnapshot) => {
      const event = childSnapshot.val() as Event;
      if (event.eventName === eventName) {
        foundEvent = event;
      }
    });

    return foundEvent;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Failed to fetch event");
  }
}
