import React from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineAssignmentReturned } from "react-icons/md";

const Faq = () => {
  const { t } = useTranslation("home");
  function handleExpand(e: React.MouseEvent<HTMLDivElement>, height: string) {
    e.currentTarget.children[1].classList.toggle(height);
    e.currentTarget.children[1].classList.toggle("py-4");
  }

  return (
    <div className="bg-[#1d1e31] w-full flex flex-col items-center justify-center gap-8 py-8">
      <p className="text-3xl font-bold tracking-wider text-white">FAQ</p>
      <div className="w-[60%] mx-auto flex flex-col gap-4 sm:w-[90%]">
        <div
          onClick={(event) => handleExpand(event, "h-[330px]")}
          className="flex flex-col gap-3 bg-[#3d1846] border-[0.6px] border-gray-400 pt-4 rounded-md overflow-hidden"
        >
          <div className="flex gap-2 items-center cursor-pointer pl-5">
            <MdOutlineAssignmentReturned className="text-2xl" />
            <p className="text-white xs:text-[14px]  ">{t("HowToMakeMoney")}</p>
          </div>
          <div className={"h-0 px-4 transition-all bg-[rgb(44,16,51)]"}>
            <p className="pb-4 text-sm tracking-wide">
              {t("freeTimeWorkingTogther")}
            </p>
          </div>
        </div>
        <div
          onClick={(event) => handleExpand(event, "h-[180px]")}
          className="flex flex-col gap-3 bg-[#3d1846] border-[0.6px] border-gray-400 pt-4 rounded-md overflow-hidden"
        >
          <div className="flex gap-2 items-center cursor-pointer  pl-5">
            <MdOutlineAssignmentReturned className="text-2xl" />
            <p className="text-white xs:text-[14px]  ">{t("howisFreetime")}</p>
          </div>

          <div className={"h-0 px-4 transition-all bg-[#2c1033]"}>
            <p className="pb-4 text-sm tracking-wide">
              {t("usersCompleteTasksFrom")}
            </p>
          </div>
        </div>
        <div
          onClick={(event) => handleExpand(event, "h-[138px]")}
          className="flex flex-col gap-3 bg-[#3d1846] border-[0.6px] border-gray-400 pt-4 rounded-md overflow-hidden"
        >
          <div className="flex gap-2 items-center cursor-pointer  pl-5">
            <MdOutlineAssignmentReturned className="text-2xl" />
            <p className="text-white xs:text-[14px]  ">
              {t("howMuchMoenyCan")}
            </p>
          </div>

          <div className={"h-0 px-4 transition-all bg-[#2c1033]"}>
            <p className="pb-4 text-sm tracking-wide">
              {t("itIsEasyPossible")}
            </p>
          </div>
        </div>
        <div
          onClick={(event) => handleExpand(event, "h-[138px]")}
          className="flex flex-col gap-3 bg-[#3d1846] border-[0.6px] border-gray-400 pt-4 rounded-md overflow-hidden"
        >
          <div className="flex gap-2 items-center cursor-pointer  pl-5">
            <MdOutlineAssignmentReturned className="text-2xl" />
            <p className="text-white xs:text-[14px]  ">{t("howLongDoesIt")}</p>
          </div>

          <div className={"h-0 px-4 transition-all bg-[#2c1033]"}>
            <p className="pb-4 text-sm tracking-wide">
              {t("freetimeHasAliveSupport")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
