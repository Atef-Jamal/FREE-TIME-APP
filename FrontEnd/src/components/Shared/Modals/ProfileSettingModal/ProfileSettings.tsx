import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../../context/hooks";
import {
  resetModel,
  setCurrentUser,
  openToast,
  selectSocket,
  selectCurrentUser,
} from "../../../../context/appStateSlice";
import { changeUserName, changeUserPassword } from "../../../../services";
import Spinner from "../../Common/Spinner";
import { handleApiError } from "../../../../utilities";
import VerifyEmailBox from "../../../../pages/MyProfile/VerifyEmailBox";

const ProfileSettings = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const socket = useAppSelector(selectSocket);
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
        openToast({
          message: "Name changed successfully",
          type: "SUCESS",
        }),
      );
      socket?.emit("user-updated", {
        ...currentUser,
        name: data.name,
      });
    },
    onError: (error) => {
      dispatch(
        openToast({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
      );
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changeUserPassword,
    onSuccess: () => {
      dispatch(
        openToast({
          message: "Password changed successfully",
          type: "SUCESS",
        }),
      );
    },
    onError: (error) => {
      dispatch(
        openToast({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
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
        openToast({
          message: "Password must be at least 6 characters",
          type: "ERROR_GENERAL",
        }),
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
      className={`relative flex w-[90%] max-w-[500px] flex-col gap-2 rounded-lg bg-[#213743] p-3 transition-all md:gap-4 lg:p-6`}
    >
      <h1 className="mx-auto text-2xl font-bold text-yellow-500">
        Settings
        <span
          onClick={() => dispatch(resetModel())}
          className="absolute right-0 top-0 z-[1] p-1 text-2xl md:text-4xl"
        >
          <IoClose />
        </span>
      </h1>
      <div className="flex flex-col gap-1 sm:gap-2">
        <label htmlFor="name" className="w-[120px] font-bold text-gray-300">
          Name
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            onChange={handleChangeName}
            value={newName}
            name="name"
            id="name"
            autoComplete="off"
            className="flex-1 rounded-md bg-[#1f1f24] px-2 py-[5px] text-gray-400 outline-none"
          />
          <button
            onClick={changeNameHandler}
            className="flex h-[30px] w-[95px] items-center justify-center rounded-sm bg-[#47f76d] font-bold text-black"
          >
            {nameMutation.isPending ? <Spinner color="blue" /> : "save"}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1 sm:gap-2">
        <label htmlFor="email" className="w-[120px] font-bold text-gray-300">
          Email
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly={true}
            value={currentUser?.email}
            name="email"
            id="email"
            autoComplete="off"
            className="flex-1 rounded-md bg-[#1f1f24] px-2 py-[5px] text-gray-400 outline-none"
          />
          {currentUser?.emailVerified ? (
            <button className="h-[30px] w-[95px] rounded-sm bg-[#47f76d] font-[700] text-black">
              Verified
            </button>
          ) : (
            <button
              onClick={() => setOpenEnterCode(true)}
              className="h-[30px] w-[95px] rounded-sm bg-[#47f76d] font-[700] text-black"
            >
              Verifiy
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 md:gap-4">
        <div className="flex flex-col gap-1 md:gap-2">
          <label htmlFor="oldpass" className="w-[120px] font-bold text-gray-300">
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
            className="w-[200px] rounded-md bg-[#1f1f24] px-2 py-[5px] text-gray-400 outline-none placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2 sm:gap-1">
          <label htmlFor="newpass" className="w-[120px] font-bold text-gray-300">
            New Password
          </label>
          <div className="flex items-center gap-2">
            <input
              type="password"
              onChange={handleChangeNewPassword}
              placeholder="Enter New Password"
              value={newPass}
              name="newpass"
              id="newpass"
              autoComplete="off"
              className="flex-1 rounded-md bg-[#1f1f24] px-2 py-[5px] text-gray-400 outline-none placeholder:text-gray-500"
            />
            <button
              onClick={changePasswordHandler}
              className="flex h-[30px] w-[95px] items-center justify-center rounded-sm bg-[#47f76d] font-bold text-black"
            >
              {passwordMutation.isPending ? <Spinner color="blue" /> : "save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileSettings;
