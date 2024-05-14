import React, { useState } from "react";
import { IoMdEye } from "react-icons/io";

interface TypeInput {
  label: string;
  type: string;
  value: string;
  name: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const Input = ({
  label,
  id,
  name,
  type,
  value,
  placeholder,
  onChange,
}: TypeInput) => {
  const [inputType, setInputType] = useState(type);

  const handleShowPassword = () => {
    setInputType((prev) => (prev === "text" ? "password" : "text"));
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <label htmlFor={id} className="font-bold tracking-wider text-[#6be8f8ee]">
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
          className={`w-full outline-none py-2 px-4 text-[#7295f7] bg-[#0d0d22b9] placeholder:opacity-50 sm:text-sm rounded-md`}
        />
        {name === "password" && (
          <button
            type="button"
            onClick={handleShowPassword}
            className="absolute right-2 top-[6px]"
          >
            <IoMdEye className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
