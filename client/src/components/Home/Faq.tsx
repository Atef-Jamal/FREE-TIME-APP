import React from "react";
import { MdOutlineAssignmentReturned } from "react-icons/md";

const Faq = () => {
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
            <p className="text-white xs:text-[14px]  ">
              How to make money on Freetime?
            </p>
          </div>
          <div className={"h-0 px-4 transition-all bg-[rgb(44,16,51)]"}>
            <p className="pb-4 text-sm tracking-wide">
              Freetime.com works together with companies that want to advertise
              their apps, surveys and products. A task could be: Download an app
              and reach level 5 within 2 days to earn 4000 coins. To get started
              choose an offer or survey. We can recommend the featured offers at
              the top of the Earn page. These tasks are very simple and many
              people have already successfully completed them in the past.
            </p>
            <p>
              After you have completed a task you will get coins. 1000 coins
              equal $1.00. You can cashout the coins for PayPal, VISA cards,
              Bitcoin, CS:GO Skins Amazon gift cards and multiple other types of
              gift cards.
            </p>
          </div>
        </div>
        <div
          onClick={(event) => handleExpand(event, "h-[180px]")}
          className="flex flex-col gap-3 bg-[#3d1846] border-[0.6px] border-gray-400 pt-4 rounded-md overflow-hidden"
        >
          <div className="flex gap-2 items-center cursor-pointer  pl-5">
            <MdOutlineAssignmentReturned className="text-2xl" />
            <p className="text-white xs:text-[14px]  ">
              How is Freetime able to pay users?
            </p>
          </div>

          <div className={"h-0 px-4 transition-all bg-[#2c1033]"}>
            <p className="pb-4 text-sm tracking-wide">
              Users complete tasks from advertisers Advertisers provide various
              tasks for users, including downloading an app, signing up for a
              website, watching videos, reaching a certain in-game level and
              much more. Advertisers pay Freetime for promotion For every
              completed task, advertisers pay Freetime a commission. Freetime
              sends user payouts After completing all task requirements,
              Freetime will send the user a payout.
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
              How much money can you really earn on Freetime?
            </p>
          </div>

          <div className={"h-0 px-4 transition-all bg-[#2c1033]"}>
            <p className="pb-4 text-sm tracking-wide">
              It is easily possible to earn more than $100 per month on
              Freetime, some users even reach $1000+ each month. You can check
              out the Leaderboard to see how much the most active Freetime users
              earn.
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
              How long does it take to cash out your money?
            </p>
          </div>

          <div className={"h-0 px-4 transition-all bg-[#2c1033]"}>
            <p className="pb-4 text-sm tracking-wide">
              Freetime.com has a live support that is always online. Our team is
              working 24/7 and you can contact us any time at the top of the
              chat. If you request a withdrawal, it will most likely get
              approved in less than 2 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
