import { BiMenu } from "react-icons/bi";
import { toggleThisEntity } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import SidebarList from "./SidebarList";

const Sidebar = () => {
  const { resizeSidebare } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();

  const handleCollaps = () =>
    dispatch(toggleThisEntity({ entity: "resizeSidebare" }));

  return (
    <div
      style={{
        height: `calc(100dvh - 76px)`,
      }}
      className={`transition-all bg-[#29293a] ${
        resizeSidebare ? "w-[80px]" : "w-[250px]"
      } sticky top-[75px] sm:hidden py-4 border-r border-r-gray-700`}
    >
      <div
        onClick={handleCollaps}
        className={`${
          !resizeSidebare ? "ml-auto mr-1" : "mx-auto"
        } p-[10px] w-[65px] flex items-center justify-center rounded-md mb-2 hover:bg-[#40496975] `}
      >
        <BiMenu className="text-2xl" />
      </div>
      <SidebarList isMobile={false} />
    </div>
  );
};

export default Sidebar;
