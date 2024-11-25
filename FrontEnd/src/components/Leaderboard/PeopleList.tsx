import { FaRankingStar, FaUserLarge } from "react-icons/fa6";
import { useFetchAllUsers } from "../../hooks";
import Spinner from "../others/Spinner";
import { useState } from "react";
import Empty from "../others/Empty";

const PeopleList = () => {
  const [page, setPage] = useState(1);
  const { users, loading, error } = useFetchAllUsers(page);

  const handlePagination = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: number
  ) => {
    if (users.length === 0 && item + 1 > page) return;
    const element = Array.from(event.currentTarget.parentElement!.children);
    element.forEach((ele) => ele.classList.remove("bg-[#92f16c]"));
    event.currentTarget.classList.add("bg-[#92f16c]");
    setPage(item + 1);
  };

  return (
    <div className="w-full">
      <div className=" w-full flex items-center justify-between bg-[#3b2f5cc4] rounded-[4px] ">
        <span className="w-[20%] border-r flex items-center justify-evenly overflow-scroll scrollbar-none sm:text-sm text-[#86b3ee] py-3">
          <FaRankingStar className="text-lg opacity-50 sm:text-sm" />
          Rank
        </span>
        <span className="w-[60%]  border-r flex items-center justify-center gap-2 overflow-scroll scrollbar-none text-[#86b3ee] py-3 sm:text-sm">
          <FaUserLarge className="opacity-50 sm:text-sm " />
          Users
        </span>
        <span className="w-[20%] flex items-center justify-center overflow-scroll scrollbar-none text-[#86b3ee] py-3 sm:text-sm">
          points
        </span>
      </div>
      {error && <div className="text-center py-8">{error}</div>}
      {loading && (
        <div className="w-full py-8 flex items-center justify-center">
          <Spinner className="w-7 h-7" />
        </div>
      )}

      {!loading &&
        users.map((user, index) => (
          <div
            key={user._id}
            className=" w-full flex items-center justify-between rounded-[4px] h-[50px] border-b border-gray-400"
          >
            <span className="w-[20%] flex items-center justify-center overflow-scroll scrollbar-none font-bold text-[#86b3ee] h-full border-r">
              <span className="w-9 rounded-md h-9 bg-[#e4b42f31] flex items-center justify-center text-[#c3ccf5] ">
                {(page - 1) * 20 + index + 1}
              </span>
            </span>
            <span className="w-[60%]  flex items-center justify-evenly overflow-scroll scrollbar-none font-bold text-[#86b3ee] h-full border-r">
              <span className="xs:w-5 xs:h-5 w-7 h-7 rounded-full min-w-fit min-h-fit">
                <img
                  src={user.profilePicture}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              </span>
              <span className="xs:text-xs text-sm whitespace-nowrap w-[70%] text-[#6baaf1ee]">
                {user.name}
              </span>
            </span>
            <span className=" w-[20%] flex items-center justify-center overflow-scroll scrollbar-none font-bold text-[#86b3ee] h-full text-sm">
              {user.points}
            </span>
          </div>
        ))}
      {!loading && users.length === 0 && <Empty emptyText="No More Peoples" />}
      <ul className="flex gap-2 items-center mx-auto mt-8 sm:w-[90%] sm:gap-1 sm:flex-wrap justify-center ">
        {[...Array(11).keys()].map((item) => (
          <li
            key={item}
            onClick={(event) => handlePagination(event, item)}
            className={`flex items-center justify-center w-[40px]  h-[40px] sm:text-sm  text-black rounded-md bg-[#393b61] ${
              item === 0 ? "bg-[#92f16c]" : ""
            }`}
          >
            {item + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeopleList;
