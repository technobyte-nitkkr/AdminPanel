"use client";


import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BaseCardProps {
  image: string | null;
  title: string;
  imageAlt: string;
  data: {
    label: string;
    value: string;
    isURL?: boolean;
  }[];
  toEdit: string;
  onDelete: () => void;
}

export default function BaseCard({
  image,
  imageAlt,
  title,
  data,
  toEdit,
  onDelete,
}: BaseCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-gray-900 p-2 shadow-md rounded-md overflow-clip border border-gray-800">
      <div className="flex flex-col items-center justify-between gap-2">
        <div className="flex flex-col items-center">
          <div className="w-[150px] h-[150px] rounded-full overflow-hidden shadow-md shadow-gray-400">
            <Image
              src={image || "https://placehold.co/600x400"}
              alt={imageAlt} 
              layout="responsive"
              width={48}
              height={48}
            />
          </div>
          <h1 className="border-b text-2xl font-black font-mono border-blue-200">
            {title}
          </h1>
        </div>
        <div className="flex items-center justify-between w-full">
          <Link
            href={toEdit}
            className="bg-blue-500 text-white px-4 py-1 rounded-md"
          >
            Edit
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500 text-white px-4 py-1 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="py-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-5 justify-between py-1"
          >
            <span className="text-xl font-bold font-mono">{item.label}</span>
            <span className="text-lg font-mono font-extralight">
              {item.isURL ? (
                <Link
                  href={item.value}
                  className="text-blue-500 hover:underline"
                >
                  {item.value}
                </Link>
              ) : (
                item.value
              )}
            </span>
          </div>
        ))}
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
