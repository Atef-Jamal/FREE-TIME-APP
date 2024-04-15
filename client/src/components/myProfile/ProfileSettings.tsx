import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import {
  resetModel,
  setCurrentUser,
  showPopup,
} from "../../context/StateManeger";
import VerifyEmailBox from "./VerifyEmailBox"
import { makeRequest } from "../../utils";

const ProfileSettings = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [newName, setNewName] = useState<string | undefined>(currentUser?.name);
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
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
    try {
      const response = await makeRequest.post("api/auth/changename", {
        newName,
      });
      dispatch(setCurrentUser({ ...currentUser, name: response.data.name }));
      dispatch(
        showPopup({ status: true, message: "your name successfully changed" })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSavePassword = async () => {
    if (!currentUser) {
      return;
    }
    try {
      await makeRequest.post("api/auth/changepassword", {
        newPass,
        enterdOldPass: oldPass,
      });
      dispatch(
        showPopup({
          status: true,
          message: "your password successfully changed",
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (openEnterCode) {
    return <VerifyEmailBox />;
  }

  return (
    <div
      className={`transition-all p-6 sm:p-4 xs:px-2 bg-[#414368] flex  flex-col  gap-4 rounded-lg relative`}
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
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-bold text-gray-400 w-[120px]">
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
            className="outline-none bg-[#2f2f33] w-[200px] p-2 rounded-md text-gray-300 "
          />
          <button
            onClick={handleSaveName}
            className="px-8 py-[6px] bg-[#47f76d] text-black font-[700] rounded-sm "
          >
            save
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className=" font-bold text-gray-400  w-[120px]">
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
            className="outline-none bg-[#2f2f33] w-[200px] p-2 rounded-md text-gray-300"
          />
          {currentUser?.emailVerified ? (
            <button className="px-8 py-[6px] bg-[#47f76d] text-black font-[700] rounded-sm">
              Verified
            </button>
          ) : (
            <button
              onClick={() => setOpenEnterCode(true)}
              className="px-6 py-[6px] bg-[#47f76d] text-black font-[700] rounded-sm "
            >
              Verifiy
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="oldpass"
            className="font-bold text-gray-400 w-[120px]"
          >
            old Password
          </label>
          <input
            type="text"
            onChange={handleChangeOldPassword}
            placeholder="Enter old Password"
            value={oldPass}
            name="oldpass"
            id="oldpass"
            autoComplete="off"
            className="outline-none bg-[#2f2f33] w-[200px] p-2 rounded-md text-gray-300 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2 ">
          <label
            htmlFor="newpass"
            className="font-bold text-gray-400 w-[120px]"
          >
            New Password
          </label>
          <div className="flex items-center gap-4">
            <input
              type="text"
              onChange={handleChangeNewPassword}
              placeholder="Enter New Password"
              value={newPass}
              name="newpass"
              id="newpass"
              autoComplete="off"
              className="outline-none bg-[#2f2f33] w-[200px] p-2 rounded-md text-gray-300 placeholder:text-gray-500"
            />
            <button
              onClick={handleSavePassword}
              className="px-8 py-1 bg-[#47f76d] text-black font-[700] rounded-sm "
            >
              save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileSettings;
