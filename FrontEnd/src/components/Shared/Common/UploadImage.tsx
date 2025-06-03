import { SetStateAction, useEffect, useRef, useState } from "react";
import UploadIcon from "../../../assets/images/upload-icon.png";
import type { IFormData } from "../../../types";
import { cn } from "../../../utilities";

interface IProps {
  formData: IFormData;
  setFormData: React.Dispatch<SetStateAction<IFormData>>;
}

const UploadImage = ({ formData, setFormData }: IProps) => {
  const [imagePreview, setImagePreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: event.target.files ? event.target.files[0] : null,
      }));
    }
  };

  useEffect(() => {
    if (!formData.profilePicture) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(formData.profilePicture);
    fileReader.onload = () => {
      setImagePreview(fileReader.result as string);
    };
  }, [formData.profilePicture]);

  return (
    <div onClick={handleClick} className="relative h-[100px] w-[100px] lg:h-[110px] lg:w-[110px]">
      {/* {percentage !== 0 && (
        <div className="absolute left-0 top-0 h-2 w-full bg-white">
          <div style={{ width: percentage }} className="h-[95%] border-y border-l bg-red-800"></div>
        </div>
      )} */}
      <input ref={inputRef} type="file" className="hidden h-full w-full" onChange={handleChange} />
      <img
        src={imagePreview || UploadIcon}
        alt=""
        className={cn("h-full w-full object-fill", imagePreview && "border")}
      />
    </div>
  );
};

export default UploadImage;
