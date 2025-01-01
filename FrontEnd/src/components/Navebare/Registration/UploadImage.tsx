import { SetStateAction, useEffect, useRef, useState } from "react";
import UploadIcon from "../../../assets/images/upload-icon.png";
import { TypeFormData } from "../../../types/othersTypes";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase";
import { useAppDispatch } from "../../../context/Hooks";
import { showPopup } from "../../../context/StateManeger";

interface TypeProps {
  setFormData: React.Dispatch<SetStateAction<TypeFormData>>;
  setImageIsUploading: React.Dispatch<SetStateAction<boolean>>;
}

const UploadImage = ({ setFormData, setImageIsUploading }: TypeProps) => {
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
            })
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
        }
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
    <div onClick={handleClick} className="relative w-[150px] h-[150px] lg:w-[100px] lg:h-[100px]">
      {percentage !== 0 && (
        <div className="absolute w-full top-0 left-0 h-2 bg-white ">
          <div style={{ width: percentage }} className="bg-red-800 h-[95%] border-y border-l"></div>
        </div>
      )}
      <input ref={inputRef} type="file" className="w-full h-full hidden" onChange={handleChange} />
      <img
        src={imagePreview || UploadIcon}
        alt=""
        className={`object-fill w-full h-full ${imagePreview && "border"}`}
      />
    </div>
  );
};

export default UploadImage;
