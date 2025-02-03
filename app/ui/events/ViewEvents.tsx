"use client";
import { useEffect, useState } from "react";
import { getAllEvents, deleteEvent, Event } from "@/app/actions/events";
import ViewEventClient from "./ViewEventClient";

export type EventMap = {
  [category: string]: {
    [eventName: string]: Event;
  };
};

export default function ViewEvents() {
  const [eventCategories, setEventCategories] = useState<EventMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents: EventMap = await getAllEvents();

        setEventCategories(fetchedEvents);
      } catch (err) {
        setError("Failed to fetch events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }
  const toggleCategory = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Events</h1>
      <div className="space-y-4">
        {Object.keys(eventCategories).map((category) => (
          <div key={category} className="border rounded-lg p-4  shadow">
           
            <button
              onClick={() => toggleCategory(category)}
              className="w-full text-left font-semibold text-lg bg-blue-500 text-white p-2 rounded-lg"
            >
              {category} {openCategory === category ? "▲" : "▼"}
            </button>
            {openCategory === category && (
              <div className="mt-2 p-2 border-l-4 border-blue-500">
                <ViewEventClient events={{ [category]: eventCategories[category] }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
