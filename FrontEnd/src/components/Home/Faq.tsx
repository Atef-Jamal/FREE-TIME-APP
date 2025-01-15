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
    <div className="flex w-full flex-col items-center justify-center gap-8 bg-[#1d1e31] py-8">
      <p className="text-3xl font-bold tracking-wider text-white">FAQ</p>
      <div className="mx-auto flex w-[90%] flex-col gap-4 sm:w-[60%]">
        <div
          onClick={(event) => handleExpand(event, "h-[330px]")}
          className="flex flex-col gap-3 overflow-hidden rounded-md border border-gray-400 bg-[#3d1846] pt-4"
        >
          <div className="flex cursor-pointer items-center gap-2 pl-5">
            <MdOutlineAssignmentReturned className="text-2xl" />
            <p className="text-[14px] text-white sm:text-base">{t("How to make money on Freetime")}</p>
          </div>
          <div className={"h-0 bg-[rgb(44,16,51)] px-4 transition-all"}>
            <p className="pb-4 text-sm tracking-wide">
              {t(
                "Freetime.com works together with companies that want to advertise their apps, surveys and products. A task could be: Download an app and reach level 5 within 2 days to earn 4000 coins. To get started choose an offer or survey. We can recommend the featured offers at the top of the Earn page. These tasks are very simple and many people have already successfully completed them in the past . After you have completed a task you will get coins. 1000 coins equal $1.00. You can cashout the coins for PayPal, VISA cards, Bitcoin, CS:GO Skins Amazon gift cards and multiple other types of gift cards",
              )}
            </p>
          </div>
        </div>
        <div
          onClick={(event) => handleExpand(event, "h-[180px]")}
          className="flex flex-col gap-3 overflow-hidden rounded-md border border-gray-400 bg-[#3d1846] pt-4"
        >
          <div className="flex cursor-pointer items-center gap-2 pl-5">
            <MdOutlineAssignmentReturned className="text-2xl" />
            <p className="text-[14px] text-white">{t("How is Freetime able to pay users")}</p>
          </div>

          <div className={"h-0 bg-[#2c1033] px-4 transition-all"}>
            <p className="pb-4 text-sm tracking-wide">
              {t(
                "Users complete tasks from advertisers Advertisers provide various tasks for users, including downloading an app, signing up for a website, watching videos, reaching a certain in-game level and much more. Advertisers pay Freetime for promotion For every completed task, advertisers pay Freetime a commission. Freetime sends user payouts After completing all task requirements, Freetime will send the user a payout",
              )}
            </p>
          </div>
        </div>
        <div
          onClick={(event) => handleExpand(event, "h-[138px]")}
          className="flex flex-col gap-3 overflow-hidden rounded-md border border-gray-400 bg-[#3d1846] pt-4"
        >
          <div className="flex cursor-pointer items-center gap-2 pl-5">
            <MdOutlineAssignmentReturned className="text-2xl" />
            <p className="text-[14px] text-white">{t("How much money can you really earn on Freetime")}</p>
          </div>

          <div className={"h-0 bg-[#2c1033] px-4 transition-all"}>
            <p className="pb-4 text-sm tracking-wide">
              {t(
                "It is easily possible to earn more than $100 per month on Freetime, some users even reach $1000+ each month. You can check out the Leaderboard to see how much the most active Freetime users earn",
              )}
            </p>
          </div>
        </div>
        <div
          onClick={(event) => handleExpand(event, "h-[138px]")}
          className="flex flex-col gap-3 overflow-hidden rounded-md border border-gray-400 bg-[#3d1846] pt-4"
        >
          <div className="flex cursor-pointer items-center gap-2 pl-5">
            <MdOutlineAssignmentReturned className="text-2xl" />
            <p className="xs:text-[14px] text-white">{t("How long does it take to cash out your money")}</p>
          </div>

          <div className={"h-0 bg-[#2c1033] px-4 transition-all"}>
            <p className="pb-4 text-sm tracking-wide">
              {t(
                "Freetime.com has a live support that is always online. Our team is working 24/7 and you can contact us any time at the top of the chat. If you request a withdrawal, it will most likely get approved in less than 2 minutes",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
