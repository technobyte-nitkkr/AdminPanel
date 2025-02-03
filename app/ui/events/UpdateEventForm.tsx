"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getEventByName, updateEventByName } from "@/app/actions/events";
import { BaseForm, BaseFormProps } from "../base_form";
import { getAllEventCategories } from "@/app/actions/eventCategory";
import { createEventFormConfig } from "@/app/constants/events";
import Image from "next/image";
import type { EventCategory } from "@/app/actions/eventCategory";

type Coordinator = {
  coordinator_name: string;
  coordinator_number: string;
};

export default function UpdateEventForm({
  eventCategory,
  eventName,
}: {
  eventCategory?: string;
  eventName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const categoryFromURL = decodeURIComponent(pathname.split("/").slice(-2, -1)[0] || "");
  const resolvedEventCategory = eventCategory || categoryFromURL;

  const [formData, setFormData] = useState<any>(null);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventData, categoriesData] = await Promise.all([
          getEventByName(resolvedEventCategory, eventName),
          getAllEventCategories(),
        ]);
        console.log(eventData);

        if (eventData) {
          const processedEventData = {
            ...eventData,
            rules: eventData.rules
              ? Array.isArray(eventData.rules)
                ? eventData.rules
                : String(eventData.rules)
                  .split("|")
                  .filter((rule) => rule.trim())
              : [],
            flagship: String(eventData.flagship).toLowerCase() === "true",
            startTime: new Date(eventData.startTime),
            endTime: new Date(eventData.endTime),
          };

          setFormData(processedEventData);
          setCategories(categoriesData);
          setCoordinators(
            eventData.coordinators || [
              { coordinator_name: "", coordinator_number: "" },
              { coordinator_name: "", coordinator_number: "" },
            ]
          );

          setImageURL(eventData.poster || null);
          // Pre-select category
          const categoryFromEvent = eventData.eventCategory|| categoryFromURL;
          setSelectedCategory(categoryFromEvent); // Select category from event if present, else URL category
        } else {
          setErrorText("Event not found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorText("Error loading event data or categories.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [resolvedEventCategory, eventName, categoryFromURL]);

  const dynamicEventFormConfig = {
    ...createEventFormConfig,
    fields: createEventFormConfig.fields
      .map((field) =>
        field.name === "eventCategory"
          ? {
            ...field,
            options: loading
              ? ["Loading..."]
              : categories.map((category) => category.key),
            placeholder: loading ? "Loading categories..." : "Select the category",
            value: selectedCategory,  // Ensure value is set for the select
          }
          : field
      )
      .filter((field) => field.name !== "image"),
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleCoordinatorChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedCoordinators = [...coordinators];
    updatedCoordinators[index] = {
      ...updatedCoordinators[index],
      [field]: value,
    };
    setCoordinators(updatedCoordinators);
  };

  const addCoordinator = () => {
    if (coordinators.length < 5) {
      setCoordinators([
        ...coordinators,
        { coordinator_name: "", coordinator_number: "" },
      ]);
    }
  };

  const removeCoordinators = () => {
    if (coordinators.length === 2) {
      setErrorText("At least two coordinators are required");
      setTimeout(() => setErrorText(""), 2000);
      return;
    }
    setCoordinators(coordinators.slice(0, coordinators.length - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData || !formData.eventName || !formData.startTime || !formData.endTime) {
      setErrorText("Please fill in all required fields.");
      return;
    }

    if (coordinators.length < 2) {
      setErrorText("At least two coordinators are required.");
      return;
    }

    for (const coordinator of coordinators) {
      if (!coordinator.coordinator_name || !coordinator.coordinator_number) {
        setErrorText("Please fill in all coordinator details.");
        return;
      }
    }

    const processedRules = Array.isArray(formData.rules)
      ? formData.rules
      : (formData.rules || "").split("|").filter((rule: string) => rule.trim());

    try {
      const formDataForSubmit = new FormData();

      const resolvedEventCategory = eventCategory || ""; // Ensure it's always a string
      const resolvedEventName = eventName || ""; // Ensure eventName is not undefined

      formDataForSubmit.append("eventCategory", resolvedEventCategory);
      formDataForSubmit.append("eventName", resolvedEventName);

      if (imageFile) {
        formDataForSubmit.append("image", imageFile);
      }

      await updateEventByName(resolvedEventCategory, eventName, {
        ...formData,
        coordinators,
        rules: processedRules,
        flagship: formData.flagship ? "true" : "false",
        ...(imageFile ? { image: imageFile } : {}),
      });

      alert("Event updated successfully!");
      router.push("/panel/view/events");
    } catch (error) {
      console.error("Error updating event:", error);
      setErrorText("Failed to update event.");
    }
  };

  if (loading) return <p>Loading event data...</p>;
  if (errorText) return <p className="text-red-500">{errorText}</p>;

  return (
    <div>
      <BaseForm
        {...dynamicEventFormConfig as BaseFormProps}
        defaultValues={{
          ...(formData || {}),
          startTime:
            formData?.startTime instanceof Date
              ? formData.startTime.toISOString().slice(0, 16)
              : formData?.startTime ?? "",
          endTime:
            formData?.endTime instanceof Date
              ? formData.endTime.toISOString().slice(0, 16)
              : formData?.startTime ?? "",
        }}
        submit={(data: any) => {
          const processedData = {
            ...data,
            rules: Array.isArray(data.rules)
              ? data.rules
              : (data.rules || "")
                .split("|")
                .filter((rule: string) => rule.trim()),
            flagship: data.flagship === "true" || data.flagship === true,
            startTime: new Date(data.startTime).getTime(),
            endTime: new Date(data.endTime).getTime(),
          };
          setFormData({ ...formData, ...processedData });
        }}
      />

      <div className="mt-4">
        <h4 className="font-bold mb-2">Current Event Poster</h4>
        {imageURL && (
          <Image
            src={imageURL}
            alt="Event Poster"
            width={200}
            height={200}
            className="object-cover rounded mb-2"
            style={{ width: "auto", height: "auto" }}
          />
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            {imageURL ? "Change Image" : "Upload Image"}
          </label>
        </div>
      </div>

      <h3 className="mt-4 font-bold">Coordinators</h3>

      {coordinators.map((coordinator, index) => (
        <div key={index} className="flex flex-col mb-2">
          <input
            type="text"
            placeholder="Coordinator Name"
            value={coordinator.coordinator_name}
            onChange={(e) =>
              handleCoordinatorChange(index, "coordinator_name", e.target.value)
            }
            className="border text-black p-2 rounded"
          />
          <input
            type="text"
            placeholder="Coordinator Number"
            value={coordinator.coordinator_number}
            onChange={(e) =>
              handleCoordinatorChange(
                index,
                "coordinator_number",
                e.target.value
              )
            }
            className="border text-black p-2 rounded mt-1"
          />
        </div>
      ))}

      <div className="flex items-center gap-5">
        <button
          onClick={addCoordinator}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 text-3xl rounded-full"
        >
          +
        </button>
        <button
          onClick={removeCoordinators}
          className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 text-3xl rounded-full"
        >
          -
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-700 duration-500 text-white font-bold px-4 py-2 rounded"
        >
          Update Event
        </button>
      </div>

      <div className="text-red-500 mt-2 font-mono">
        {errorText && <p>{errorText}</p>}
      </div>
    </div>
  );
}
