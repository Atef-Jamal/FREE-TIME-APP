import { SetStateAction, useEffect, useRef, useState } from "react";
import UploadIcon from "../../../assets/images/upload-icon.png";
import { IFormData } from "../../../types/othersTypes";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase";
import { useAppDispatch } from "../../../context/Hooks";
import { showPopup } from "../../../context/StateManeger";
import { cn } from "../../../utils/common";

interface IProps {
  setFormData: React.Dispatch<SetStateAction<IFormData>>;
  setImageIsUploading: React.Dispatch<SetStateAction<boolean>>;
}

const UploadImage = ({ setFormData, setImageIsUploading }: IProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [percentage, setPercentage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 1) {
      setImage(event.target.files[0]);
      const storageRef = ref(storage, `images/${event.target.files[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, event.target.files[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageIsUploading(true);
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentage(progress);
        },
        () => {
          setImageIsUploading(false);
          setPercentage(0);
          dispatch(
            showPopup({
              type: "ERROR_GENERAL",
              message: "Can't upload Image, May be its bigger than 5 MB",
            }),
          );
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            profilePicture: url,
          }));
          setPercentage(0);
          setImageIsUploading(false);
        },
      );
    }
  };

  useEffect(() => {
    if (!image) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.onload = () => {
      setImagePreview(fileReader.result as string);
    };
  }, [image]);

  return (
    <div onClick={handleClick} className="relative h-[100px] w-[100px] lg:h-[110px] lg:w-[110px]">
      {percentage !== 0 && (
        <div className="absolute left-0 top-0 h-2 w-full bg-white">
          <div style={{ width: percentage }} className="h-[95%] border-y border-l bg-red-800"></div>
        </div>
      )}
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
