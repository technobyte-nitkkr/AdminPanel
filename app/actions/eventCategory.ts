import { database, ref, get, update, remove, push, set } from "@/app/db";
import createImgbbUrl from "../helpers/imgbb";

export type EventCategoryData = {
  id: string;  
  icon: string;  // Changed from 'image' to match your schema
  index: number;
};

export type EventCategory = {
  key: string; 
  id: string;
  icon: string;
  index: number;
};


export type EventCategoryInput = {
  id: string; 
  image: File;
};

export async function createEventCategory(
  data: EventCategoryInput
): Promise<void> {
  try {
    const imageResult = await createImgbbUrl(data.image);
    if (!imageResult?.url) {
      throw new Error("Image upload failed");
    }

    const categoryData: EventCategoryData = {
      id: data.id,
      icon: imageResult.url,
      index: Math.floor(1000 + Math.random() * 9000),
    };

    const categoriesRef = ref(database, "events");
    await push(categoriesRef, categoryData);
  } catch (error) {
    console.error("Error creating event category:", error);
    throw new Error("Failed to create event category");
  }
}

export async function getAllEventCategories(): Promise<EventCategory[]> {
  try {
    const categoriesRef = ref(database, "events");
    const snapshot = await get(categoriesRef);

    if (!snapshot.exists()) {
      return [];
    }

    return Object.entries(snapshot.val()).map(([key, value]) => ({
      key,
      ...(value as EventCategoryData)
    }));
  } catch (error) {
    console.error("Error fetching event categories:", error);
    throw new Error("Failed to fetch event categories");
  }
}


export async function getEventCategoryByKey(key: string): Promise<EventCategory> {
  try {
    const categoryRef = ref(database, `events/${key}`);
    const snapshot = await get(categoryRef);

    if (!snapshot.exists()) {
      throw new Error("Event category not found");
    }

    return {
      key,
      ...(snapshot.val() as EventCategoryData)
    };
  } catch (error) {
    console.error("Error fetching event category:", error);
    throw new Error("Failed to fetch event category");
  }
}

export async function updateEventCategory(
  key: string,
  updates: { newId?: string; image?: File }
): Promise<void> {
  try {
    const categoryRef = ref(database, `events/${key}`);
    const snapshot = await get(categoryRef);

    if (!snapshot.exists()) {
      throw new Error("Event category not found");
    }

    const existingData = snapshot.val() as EventCategoryData;

    let updatedData: EventCategoryData = { ...existingData };

    if (updates.image) {
      const imageResult = await createImgbbUrl(updates.image);
      if (!imageResult?.url) {
        throw new Error("Image upload failed");
      }
      updatedData.icon = imageResult.url;
    }

    
    if (updates.newId) {
      const newCategoryRef = ref(database, `events/${updates.newId}`);
      await set(newCategoryRef, updatedData);
      await remove(categoryRef);
    } else {

      await update(categoryRef, updatedData);
    }
  } catch (error) {
    console.error("Error updating event category:", error);
    throw new Error("Failed to update event category");
  }
}


export async function deleteEventCategory(key: string): Promise<void> {
  try {
    const categoryRef = ref(database, `events/${key}`);
    await remove(categoryRef);
  } catch (error) {
    console.error("Error deleting event category:", error);
    throw new Error("Failed to delete event category");
  }
}