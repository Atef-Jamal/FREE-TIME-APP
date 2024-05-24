import { RiCloseFill } from "react-icons/ri";
import { toggleThisEntity } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import SidebarList from "./SidebarList";

const MobileSidebare = () => {
  const { openSidebarMobile } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();

  const handleCollaps = () =>
    dispatch(toggleThisEntity({ entity: "openSidebarMobile" }));

  return (
    <div
      id={"mobile-sidebar"}
      style={{ height: `calc(100dvh - 70px)` }}
      className={`transition duration-200 ease-linear ${
        openSidebarMobile ? " translate-x-0" : "-translate-x-[100%] "
      } hidden sm:block fixed top-[54px] left-0 z-[2] w-[250px] border-r border-gray-700 bg-[#212134] p-2`}
    >
      <div className="flex items-center justify-between border-b border-gray-700 pb-2">
        <span className="text-2xl text-[#74c43f] font-bold">
          FREE<span className="text-2xl text-[#d0ddc7] font-bold">TIME</span>
        </span>
        <span
          onClick={handleCollaps}
          className="bg-[#489b2f] p-[4px] rounded-sm"
        >
          <RiCloseFill style={{ fontSize: "20px" }} />
        </span>
      </div>
      <SidebarList isMobile={true} />
    </div>
  );
};

export default MobileSidebare;
