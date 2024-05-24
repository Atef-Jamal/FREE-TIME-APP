import { BiSolidReport } from "react-icons/bi";
import { moneyActive } from "../assets";
import { withdrawCash, withdrawGiftCards, withdrawSkins } from "../helper/data";

const CashOut = () => {
  return (
    <div>Hello</div>
    // <div className="flex flex-col p-5 sm:p-3 gap-6 bg-[#222339]">
    //   <div className="flex gap-4 sm:mt-4">
    //     <img alt={""} src={moneyActive} className="w-10 h-10" />
    //     <h1 className="text-white font-bold tracking-wider text-2xl">
    //       CashOut
    //     </h1>
    //   </div>
    //   <div className="flex gap-4 justify-center bg-[#0703033b] rounded-md w-[60%] sm:w-full py-8 px-4 border border-gray-700">
    //     <BiSolidReport className="text-4xl min-w-fit" />
    //     <p className="text-xs text-[#785f9ee0]">
    //       Use your earned coins on Freetime.com to withdraw PayPal, Bitcoin,
    //       VISA, Amazon & much more! Crypto withdrawals start from $0.50, Stake
    //       withdrawals at $0.25
    //     </p>
    //   </div>
    //   <h1 className=" text-blue-200 font-extrabold">WITHDRAW CASH</h1>
    //   <div className=" grid grid-cols-5 gap-3 sm:grid-cols-4 xs:grid-cols-2">
    //     {withdrawCash.map((item, i) => (
    //       <div
    //         key={i + new Date().toString()}
    //         className={`${item.bgColor} flex items-center justify-center h-[80px] rounded-lg`}
    //       >
    //         <img alt={""} className="w-[60%] h-[60%]" src={item.image} />
    //       </div>
    //     ))}
    //   </div>
    //   <h1 className=" text-blue-200 font-extrabold">WITHDRAW GIFTCARDS</h1>
    //   <div className=" grid grid-cols-5 gap-3 sm:grid-cols-4 xs:grid-cols-2">
    //     {withdrawGiftCards.map((item, i) => (
    //       <div
    //         key={i + new Date().toString()}
    //         className={`${item.bgColor} flex items-center justify-center h-[80px] rounded-lg`}
    //       >
    //         <img alt={""} className="w-[60%] h-[60%]" src={item.image} />
    //       </div>
    //     ))}
    //   </div>
    //   <h1 className="text-gray-300 font-extrabold ">WITHDRAW SKINS</h1>
    //   <div className="flex gap-2 flex-wrap">
    //     <div className=" grid grid-cols-5 gap-3 sm:grid-cols-4 xs:grid-cols-2">
    //       {withdrawSkins.map((item, i) => (
    //         <div
    //           key={i + new Date().toString()}
    //           className={`${item.bgColor} flex items-center justify-center h-[80px] rounded-lg`}
    //         >
    //           <img alt={""} className="w-[60%] h-[60%]" src={item.image} />
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
  );
};

export default CashOut;
