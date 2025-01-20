import React, { useState } from "react";
import { IoMdEye } from "react-icons/io";

interface IInput {
  label: string;
  type: string;
  value: string;
  name: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const Input = ({ label, id, name, type, value, placeholder, onChange }: IInput) => {
  const [inputType, setInputType] = useState(type);

  const handleShowPassword = () => {
    setInputType((prev) => (prev === "text" ? "password" : "text"));
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={id} className="tracking-wider text-[#6be8f8ee]">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-md bg-[#0d0d22b9] px-4 py-2 text-[#7295f7] outline-none placeholder:opacity-50 sm:text-sm`}
        />
        {name === "password" && (
          <button type="button" onClick={handleShowPassword} className="absolute right-2 top-[6px]">
            <IoMdEye className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
