"use client";
import BaseCard from "../base_card";
import { Event } from "@/app/actions/events";
import { deleteEvent } from "@/app/actions/events";
import { useRouter } from "next/navigation";
export type EventMap = {
  [category: string]: {
    [eventName: string]: Event;
  };
};

export type Coordinator = {
  name: string;
  contact: string;
};

export default function ViewEventClient({ events }: { events: EventMap }) {
  const router = useRouter();

  const handleDelete = async (name: string, category: string) => {
    try {
      await deleteEvent(name, category);
      console.log(`${name} from ${category} deleted`);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Error deleting the event. Please try again.");
    }
  };
  return (
    <div className="flex flex-wrap justify-center items-center">
      {Object.entries(events).map(([category, categoryEvents]) =>
        Object.entries(categoryEvents).map(([eventName, event]) => {
          const limitWords = (text: string, wordLimit: number) => {
            const words = text.split(" ");
            if (words.length > wordLimit) {
              return words.slice(0, wordLimit).join(" ") + "...";
            }
            return text;
          };
          
          const dataArray: { label: string; value: string; isUrl?: boolean }[] = [
            { label: "Name", value: event.eventName },
            { label: "Category", value: category },
            { 
              label: "Description", 
              value: limitWords(event.description as string, 10), 
              isUrl: true 
            },
          ];

          return (
            <div key={`${category}-${eventName}`} className="m-4">
              <BaseCard
                data={dataArray}
                imageAlt={event.eventName}
                title={event.eventName}
                image={event.poster || null}
                toEdit={`events/${category}/${event.eventName}`}
                onDelete={() => handleDelete(event.eventName, category)}
              />
            </div>
          );
        }),
      )}
    </div>
  );
}
