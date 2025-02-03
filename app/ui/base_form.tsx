import { useState, useEffect } from "react";

export interface BaseFormProps {
  title: string;
  fields: Field[];
  submit: any;
  submitText: string;
  defaultValues?: Record<string, any>; // Add defaultValues prop
}

interface Field {
  name: string;
  label: string;
  type:
  | "select"
  | "file"
  | "text"
  | "textarea"
  | "password"
  | "email"
  | "date"
  | "time"
  | "datetime-local"
  | "number"
  | "checkbox"
  | "boolean";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  value?: string;
  description?: string;
  defaultValue?: any;
}

export const BaseForm: React.FC<BaseFormProps> = ({
  title,
  fields,
  submit,
  submitText,
  defaultValues = {}, // Default to an empty object if not provided
}) => {
  const [_, setInitialValues] = useState<Record<string, any>>({});
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    const values = fields.reduce(
      (acc, field) => {
        acc[field.name] = defaultValues[field.name] || field.value || ""; // Use defaultValues if available
        return acc;
      },
      {} as Record<string, any>,
    );

    setInitialValues(values);
    setForm(values);
  }, [fields]);

  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const element = e.target as HTMLFormElement;
    const target = element.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement;

    target.disabled = true;
    target.classList.add("bg-gray-500");
    target.classList.remove("bg-green-600");
    const buttonText = target.innerText;
    target.innerText = "Submitting...";

    setError("");
    setSuccess("");

    for (const field of fields) {
      if (!form[field.name]) {
        if (field?.required === false) {
          continue;
        }
        setError(`${field.label} cannot be empty!`);
        target.disabled = false;
        target.classList.remove("bg-gray-500");
        target.classList.add("bg-red-600");
        target.innerText = buttonText;
        return;
      }
    }

    await submit(form);
    target.disabled = false;
    target.classList.remove("bg-gray-500");
    target.classList.add("bg-green-600");
    target.innerText = buttonText;

    setSuccess("success!");
  };

  return (
    <div className="base-form shadow-md p-4 rounded-md bg-gray-900 text-white">
      <h1 className="text-xl font-black font-mono border-b pb-2 border-blue-200">
        {title}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {fields.map((field: Field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <div className="flex justify-between items-center mt-2">
              <label className="text-lg" htmlFor={field.name}>
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  className="p-2 text-black w-full md:w-2/3 rounded-md"
                >
                  <option value="">Select...</option>
                  {field.options
                    ?.filter((option): option is string => typeof option === "string")
                    .map((option) => (
                      <option key={option.replace(/\s+/g, "-")} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="p-2 text-black w-full md:w-2/3 rounded-md"
                />
              ) : field.type === "file" ? (
                <input
                  type="file"
                  name={field.name}
                  onChange={handleChange}
                  className="p-2 text-black w-full md:w-2/3 rounded-md"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="p-2 text-black w-full md:w-2/3 rounded-md"
                />
              )}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="w-fit bg-green-600 hover:bg-green-800 text-white font-bold px-2 text-xl rounded"
        >
          {submitText}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};
