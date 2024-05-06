import { SetStateAction, useEffect, useRef, useState } from "react";
import UploadIcon from "../../../assets/images/upload-icon.png";
import { TypeFormData } from "../../../types/others";

const UploadImage = ({
  formData,
  setFormData,
}: {
  formData: TypeFormData;
  setFormData: React.Dispatch<SetStateAction<TypeFormData>>;
}) => {
  const [imagePreview, setImagePreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 1) {
      setFormData((prev) => ({
        ...prev,
        profilePicture:
          event.target.files?.length === 1 ? event.target.files[0] : null,
      }));
    }
  };

  useEffect(() => {
    if (!formData.profilePicture) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImagePreview(fileReader.result as string);
    };
    fileReader.readAsDataURL(formData.profilePicture);
  }, [formData.profilePicture]);

  return (
    <div
      onClick={handleClick}
      className="w-[150px] h-[100px] sm:w-[100px] lg:h-[50px]"
    >
      <input
        ref={inputRef}
        type="file"
        className="w-full h-full hidden"
        onChange={handleChange}
      />
      <img
        src={imagePreview || UploadIcon}
        alt=""
        className="object-contain w-full h-full "
      />
    </div>
  );
};

export default UploadImage;
