import { useState, useEffect } from "react";
import BaseCard from "../base_card";
import {
  getAllEventCategory,
  deleteEventCategory,
} from "@/app/actions/eventCategory";

interface EventCategory {
  id: string;
  eventCategory: string;
  image: string;
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
      const data = await getAllEventCategory();
      const updatedData = data.map((category: any) => ({
        ...category,
        image: category.icon,
      }));
  
      setEventCategories(updatedData);
      console.log(updatedData);
    } catch (err) {
      setError("Failed to load event categories");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDelete = async (id: string) => {
    try {
      await deleteEventCategory(id);
      setEventCategories(
        eventCategories.filter((category) => category.id !== id),
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
          key={category.id}
          image={category.image}
          title={`${category.id}`}
          data={[]}
          toEdit={`/panel/view/eventCategory/${category.id}`}
          onDelete={() => handleDelete(category.id)}
        />
        );
      })}
    </div>
  );
}
