"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BaseForm } from "@/app/ui/base_form";
import {
  getEventCategoryByKey,
  updateEventCategory,
} from "@/app/actions/eventCategory";
import { EventCategory } from "@/app/actions/eventCategory";

type FieldType =
  | "text"
  | "email"
  | "number"
  | "select"
  | "textarea"
  | "time"
  | "file"
  | "password"
  | "date"
  | "datetime-local"
  | "checkbox";

type FormData = Omit<EventCategory, 'icon'> & {
  icon?: File | string;
};

const EditEventCategoryPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [category, setCategory] = useState<EventCategory | null>(null);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const categoryData = await getEventCategoryByKey(id as string);
          setCategory(categoryData);
        } catch (error) {
          console.error("Error fetching event category:", error);
        }
      })();
    }
  }, [id]);

  const handleSubmit = async (updatedData: FormData) => {
    if (!id || !category) return;

    try {
      const newId = updatedData.key && updatedData.key !== category.key ? updatedData.key : undefined;
    
      const imageFile = updatedData.icon && typeof updatedData.icon !== 'string' 
        ? updatedData.icon 
        : undefined;

      await updateEventCategory(id as string, {
        newId,
        image: imageFile,
      });

      alert("Event category updated successfully!");
      router.push("/panel/view/eventCategory");
    } catch (error) {
      console.error("Error updating event category:", error);
      alert("Failed to update event category.");
    }
  };

  if (!category) {
    return <p>Loading...</p>;
  }

  const fields = [
    {
      name: "key",
      label: "Event Category",
      type: "text" as FieldType,
      value: category.key,
      required: true,
    },
    {
      name: "icon",
      label: "Image",
      type: "file" as FieldType,
      value: category.icon,
      required: true,
      accept: "image/*",
    },
    {
      name: "index",
      label: "Index",
      type: "number" as FieldType,
      value: String(category.index),
      required: true,
      readOnly: true,
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <span className="font-bold">Index: </span>
        <span>{category.index}</span>
      </div>
      <BaseForm
        title="Edit Event Category Details"
        fields={fields.filter((f) => f.name !== "index")}
        submit={handleSubmit}
        submitText="Update"
      />
    </div>
  );
};

export default EditEventCategoryPage;