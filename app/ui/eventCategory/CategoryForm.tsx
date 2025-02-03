import { useState, useEffect } from "react";
import BaseCard from "../base_card";
import {
  getAllEventCategories,
  deleteEventCategory,
} from "@/app/actions/eventCategory";

interface EventCategory {
  key: string;
  id: string;
  icon: string;
  index: number;
}

export default function EventCategoryTable() {
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEventCategories();
  }, []);

  const loadEventCategories = async () => {
    try {
      const data = await getAllEventCategories();
      const validatedData = data.map(category => ({
        key: category.key,
        id: category.id || '', 
        icon: category.icon || '',  
        index: category.index || 0 
      }));
      
      setEventCategories(validatedData);
    } catch (err) {
      setError("Failed to load event categories");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await deleteEventCategory(key);
      setEventCategories(
        eventCategories.filter((category) => category.key !== key)
      );
    } catch (err) {
      console.error("Failed to delete event category:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg font-semibold text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {eventCategories.map((category) => {
         
        return (
          <BaseCard
            key={category.key}
            image={category.icon}
            imageAlt={`Icon for ${category.id} category`}
            title={category.key}
            data={[]}
            toEdit={`/panel/view/eventCategory/${category.key}`}
            onDelete={() => handleDelete(category.key)}
          />
        );
      })}
    </div>
  );
}