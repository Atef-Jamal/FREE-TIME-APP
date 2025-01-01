import { ChangeEvent, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { resetModel, setCurrentUser, showPopup } from "../../context/StateManeger";
import VerifyEmailBox from "./VerifyEmailBox";
import { changeUserName, changeUserPassword } from "../../utils";
import { handleApiError } from "../../utils/common";

import Spinner from "../Others/Spinner";
import { useMutation } from "@tanstack/react-query";

const ProfileSettings = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const [newName, setNewName] = useState<string | undefined>(currentUser?.name);
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [openEnterCode, setOpenEnterCode] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };
  const handleChangeOldPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setOldPass(e.target.value);
  };
  const handleChangeNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPass(e.target.value);
  };
  const nameMutation = useMutation({
    mutationFn: changeUserName,
    onSuccess: (data) => {
      if (currentUser) dispatch(setCurrentUser({ ...currentUser, name: data.name }));
      dispatch(
        showPopup({
          message: "Name changed successfully",
          type: "SUCESS",
        })
      );
      socket?.emit("user-updated", {
        ...currentUser,
        name: data.name,
      });
    },
    onError: (error) => {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    },
  });
  const passwordMutation = useMutation({
    mutationFn: changeUserPassword,
    onSuccess: () => {
      dispatch(
        showPopup({
          message: "Password changed successfully",
          type: "SUCESS",
        })
      );
    },
    onError: (error) => {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    },
  });

  const changeNameHandler = () => {
    if (!currentUser || !newName) return;
    if (currentUser.name === newName) return;
    nameMutation.mutate({ newName });
  };
  const changePasswordHandler = () => {
    if (!currentUser || !newPass) return;
    if (newPass.trim().length < 6) {
      dispatch(
        showPopup({
          message: "Password must be at least 6 characters",
          type: "ERROR_GENERAL",
        })
      );
      return;
    }
    passwordMutation.mutate({ newPassword: newPass, oldPassword: oldPass });
  };

  if (openEnterCode) {
    return <VerifyEmailBox />;
  }

  return (
    <div
      className={`transition-all p-6 sm:p-4 xs:px-2 bg-[#213743] flex  flex-col  gap-4 sm:gap-2 rounded-lg relative`}
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
            className="outline-none bg-[#1f1f24] w-[200px] px-2 py-[5px] rounded-md text-gray-400"
          />
          <button
            onClick={changeNameHandler}
            className="w-[95px] h-[30px] bg-[#47f76d] text-black font-[700] rounded-sm "
          >
            {nameMutation.isPending ? <Spinner className="w-4 h-4 mx-auto" /> : "save"}
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
            className="outline-none bg-[#1f1f24] w-[200px] px-2 py-[5px] rounded-md text-gray-400"
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
          <label htmlFor="oldpass" className="font-bold text-gray-300 w-[120px]">
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
            className="outline-none bg-[#1f1f24] w-[200px] px-2 py-[5px] rounded-md text-gray-400 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2 sm:gap-1">
          <label htmlFor="newpass" className="font-bold text-gray-300 w-[120px]">
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
              className="outline-none bg-[#1f1f24] w-[200px] px-2 py-[5px] rounded-md text-gray-400 placeholder:text-gray-500"
            />
            <button
              onClick={changePasswordHandler}
              className="w-[95px] h-[30px] bg-[#47f76d] text-black font-[700] rounded-sm "
            >
              {passwordMutation.isPending ? <Spinner className="w-5 h-5 mx-auto" /> : "save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileSettings;
