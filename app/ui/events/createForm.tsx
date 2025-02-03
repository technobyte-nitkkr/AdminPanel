"use client";

import { useEffect, useState } from "react";
import { BaseForm } from "../base_form";
import { createEvent } from "@/app/actions/events";
import { getAllEventCategories } from "@/app/actions/eventCategory";
import {
  createEventFormConfig as baseEventFormConfig,
  addCoordinatorFormConfig,
} from "@/app/constants/events";
import type { EventCategory } from "@/app/actions/eventCategory";
type Coordinator = {
  coordinator_name: string;
  coordinator_number: string;
};

interface FormState {
  coordinators: Coordinator[];
  description: string;
  document: string;
  endTime: number;
  eventCategory: string;
  eventName: string;
  flagship: boolean;
  rules: string[];
  startTime: number;
  venue: string;
  image: File;
}

export default function CreateForm() {
  const [coordinators, setCoordinators] = useState([0, 1]);
  const [form, setForm] = useState<FormState>({
    coordinators: [],
    description: "",
    document: "",
    endTime: 0,
    eventCategory: "",
    eventName: "",
    flagship: false,
    rules: [],
    startTime: 0,
    venue: "",
    image: {} as File,
  });
  const [errorText, setErrorText] = useState<string>("");
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllEventCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorText("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const addCoordinators = () => {
    setCoordinators([...coordinators, coordinators.length]);
  };

  const removeCoordinators = () => {
    if (coordinators.length === 2) {
      setErrorText("At least two coordinators are required.");
      setTimeout(() => setErrorText(""), 2000);
      return;
    }
    setCoordinators(coordinators.slice(0, coordinators.length - 1));
  };

  const handleFormCreate = (data: Partial<FormState>) => {
    setForm((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleAddCoordinators = (data: Coordinator) => {
    setForm((prev) => ({
      ...prev,
      coordinators: [...(prev.coordinators || []), data],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error_message = "";

    const target = e.target as HTMLButtonElement;
    target.disabled = true;
    target.innerText = "Submitting...";

    if (!form.eventName || !form.startTime || !form.endTime) {
      error_message = "Please fill in all the event details.";
    } else if (!form.coordinators || form.coordinators.length < 2) {
      error_message = "At least two coordinators are required.";
    } else {
      for (const coordinator of form.coordinators) {
        if (!coordinator.coordinator_name || !coordinator.coordinator_number) {
          error_message = "Please fill in all coordinator details properly.";
          break;
        }
      }
    }

    if (error_message) {
      setErrorText(error_message);
      target.disabled = false;
      target.innerText = "Submit";
      return;
    }

    try {
      await createEvent({
        ...form,
        coordinators: Array.from(
          new Map(
            form.coordinators.map((c) => [c.coordinator_number, c]),
          ).values(),
        ),
      });
      setForm({
        coordinators: [],
        description: "",
        document: "",
        endTime: 0,
        eventCategory: "",
        eventName: "",
        flagship: false,
        rules: [],
        startTime: 0,
        venue: "",
        image: {} as File,
      });
      setCoordinators([0, 1]);
      setErrorText("");
      target.innerText = "Submitted";
      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
      }, 1000);
      window.location.reload();
    } catch (error) {
      console.error("Error creating event: ", error);
      target.innerText = "Error...";
      target.style.backgroundColor = "red";
      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
      }, 1000);
      setErrorText("An error occurred while creating the event.");
    }
  };

  const dynamicEventFormConfig = {
    ...baseEventFormConfig,
    fields: baseEventFormConfig.fields.map((field) =>
      field.name === "eventCategory"
        ? {
            ...field,
            options: loading
              ? ["Loading..."]
              : categories.map((category) => category.key),
            placeholder: loading
              ? "Loading categories..."
              : "Select the category",
          }
        : field,
    ),
  };

  return (
    <div className="create-form">
      <BaseForm {...dynamicEventFormConfig} submit={handleFormCreate} />
      {coordinators.map((_, index) => (
        <BaseForm
          key={index}
          {...addCoordinatorFormConfig}
          submit={handleAddCoordinators}
        />
      ))}
      <div className="flex items-center gap-5">
        <button
          onClick={addCoordinators}
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
          type="button"
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-700 duration-500 text-white font-bold px-2 text-2xl ml-auto rounded"
        >
          Create Event
        </button>
      </div>
      <div className="text-red-500 mt-2 font-mono">
        {errorText && <p>{errorText}</p>}
      </div>
    </div>
  );
}
