import React from "react";
import { BiSolidHide } from "react-icons/bi";
import { avatar } from "../../../assets";

interface TypeInput {
  label: string;
  type: string;
  value?: string;
  name: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: () => void;
  placeholder: string;
  progress?: number | null;
  image?: string;
  home?: boolean;
}

const Input = ({
  label,
  id,
  onChange,
  type,
  name,
  placeholder,
  value,
  progress,
  image,
  home,
  showPassword,
}: TypeInput) => {
  return (
    <div className="relative flex flex-col justify-center gap-1 ">
      {type !== "file" && (
        <label
          htmlFor={id}
          className="font-[300] text-sm sm:text-[12px] tracking-widest text-white "
        >
          {label}
        </label>
      )}
      <input
        autoComplete="off"
        type={type}
        value={value}
        id={id}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className={` sm:text-sm placeholder:text-[#6b91fa83] placeholder:font-bold text-[#7295f7] font-bold tracking-wider ${
          home ? "bg-[#3f3c69]" : "bg-[#323252]"
        } border-none py-1 px-4 outline-none rounded-md mr-1  ${
          type === "file"
            ? " z-[1] opacity-0 mb-10 sm:mb-1 lg:mb-4 w-[130px] h-[130px] sm:w-[60px] sm:h-[60px] self-center rounded-full flex items-center justify-center "
            : "w-full"
        }`}
      />
      {id === "password" ? (
        <div onClick={showPassword} className=" absolute top-8 right-3">
          <BiSolidHide />
        </div>
      ) : undefined}
      {type === "file" ? (
        <>
          <img
            src={image || avatar}
            alt={""}
            className="absolute self-center mb-10 sm:mb-0 lg:mb-4 w-[140px] h-[140px] sm:w-[60px] sm:h-[60px] rounded-full transition-all"
          />
          <span className="absolute self-center mt-14 lg:mt-20 sm:mt-12 w-[100px] rounded-b-full flex items-center justify-center text-5xl sm:text-xl lg:text-4xl font-extrabold text-black">
            +
          </span>
          {progress && (
            <div className="transition-all relative h-[6px] w-[85%] self-center bg-white rounded-full overflow-hidden mb-2 ">
              <div
                className={`transition-all h-[6px] w-[${progress}%] bg-[#3e4edd]`}
              ></div>
            </div>
          )}
        </>
      ) : undefined}
    </div>
  );
};

export default Input;
