import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import {
  resetModel,
  setCurrentUser,
  showPopup,
} from "../../context/StateManeger";
import VerifyEmailBox from "./VerifyEmailBox";
import { handleApiError, makeRequest } from "../../utils";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiErrorAlt } from "react-icons/bi";
import Spinner from "../Others/Spinner";

const ProfileSettings = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [newName, setNewName] = useState<string | undefined>(currentUser?.name);
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [loadingName, setLoadingName] = useState<boolean>(false);
  const [loadingPass, setLoadingPass] = useState<boolean>(false);
  const [openEnterCode, setOpenEnterCode] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleChangeName = (e: any) => {
    setNewName(e.target.value);
  };
  const handleChangeOldPassword = (e: any) => {
    setOldPass(e.target.value);
  };

  const handleChangeNewPassword = (e: any) => {
    setNewPass(e.target.value);
  };

  const handleSaveName = async () => {
    if (!currentUser) {
      return;
    }
    setLoadingName(true);
    try {
      const response = await makeRequest.post("api/auth/changename", {
        newName,
      });
      dispatch(setCurrentUser({ ...currentUser, name: response.data.name }));
      dispatch(
        showPopup({
          status: true,
          message: "Name successfully changed",
          icon: <FaRegCheckCircle />,
        })
      );
    } catch (error) {
      dispatch(
        showPopup({
          status: true,
          message: handleApiError(error),
          icon: <BiErrorAlt />,
        })
      );
    } finally {
      setLoadingName(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentUser) {
      return;
    }
    setLoadingPass(true);
    try {
      await makeRequest.post("api/auth/changepassword", {
        newPass,
        enterdOldPass: oldPass,
      });
      dispatch(
        showPopup({
          status: true,
          message: "Password successfully changed",
          icon: <FaRegCheckCircle />,
        })
      );
    } catch (error) {
      dispatch(
        showPopup({
          status: true,
          message: handleApiError(error),
          icon: <BiErrorAlt />,
        })
      );
    } finally {
      setLoadingPass(false);
    }
  };

  if (openEnterCode) {
    return <VerifyEmailBox />;
  }

  return (
    <div
      className={`transition-all p-6 sm:p-4 xs:px-2 bg-[#414368] flex  flex-col  gap-4 sm:gap-2 rounded-lg relative`}
    >
      <h1 className="text-yellow-500 mx-auto text-2xl font-bold">
        Settings
        <span
          onClick={() => dispatch(resetModel())}
          className="absolute top-0 right-0 text-4xl sm:text-2xl z-[1]  p-1"
        >
          <IoClose />
        </span>
      </h1>
      <div className="flex flex-col gap-2 sm:gap-1">
        <label htmlFor="name" className="font-bold  text-gray-300 w-[120px]">
          Name
        </label>
        <div className="flex items-center gap-4">
          <input
            type="text"
            onChange={handleChangeName}
            value={newName}
            name="name"
            id="name"
            autoComplete="off"
            className="outline-none bg-[#2f2f33] w-[200px] px-2 py-[5px] rounded-md text-gray-400"
          />
          <button
            onClick={handleSaveName}
            className="w-[95px] h-[30px] bg-[#47f76d] text-black font-[700] rounded-sm "
          >
            {loadingName ? <Spinner className="w-4 h-4 mx-auto" /> : "save"}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:gap-1">
        <label htmlFor="email" className=" font-bold text-gray-300  w-[120px]">
          Email
        </label>
        <div className="flex items-center gap-4 ">
          <input
            type="text"
            readOnly={true}
            value={currentUser?.email}
            name="email"
            id="email"
            autoComplete="off"
            className="outline-none bg-[#2f2f33] w-[200px] px-2 py-[5px] rounded-md text-gray-400"
          />
          {currentUser?.emailVerified ? (
            <button className="w-[95px] h-[30px] bg-[#47f76d] text-black font-[700] rounded-sm">
              Verified
            </button>
          ) : (
            <button
              onClick={() => setOpenEnterCode(true)}
              className="w-[95px] h-[30px] bg-[#47f76d] text-black font-[700] rounded-sm "
            >
              Verifiy
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:gap-1">
        <div className="flex flex-col gap-2 sm:gap-1">
          <label
            htmlFor="oldpass"
            className="font-bold text-gray-300 w-[120px]"
          >
            old Password
          </label>
          <input
            type="password"
            onChange={handleChangeOldPassword}
            placeholder="Enter old Password"
            value={oldPass}
            name="oldpass"
            id="oldpass"
            autoComplete="off"
            className="outline-none bg-[#2f2f33] w-[200px] px-2 py-[5px] rounded-md text-gray-400 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2 sm:gap-1">
          <label
            htmlFor="newpass"
            className="font-bold text-gray-300 w-[120px]"
          >
            New Password
          </label>
          <div className="flex items-center gap-4">
            <input
              type="password"
              onChange={handleChangeNewPassword}
              placeholder="Enter New Password"
              value={newPass}
              name="newpass"
              id="newpass"
              autoComplete="off"
              className="outline-none bg-[#2f2f33] w-[200px] px-2 py-[5px] rounded-md text-gray-400 placeholder:text-gray-500"
            />
            <button
              onClick={handleSavePassword}
              className="w-[95px] h-[30px] bg-[#47f76d] text-black font-[700] rounded-sm "
            >
              {loadingPass ? <Spinner className="w-5 h-5 mx-auto" /> : "save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileSettings;
