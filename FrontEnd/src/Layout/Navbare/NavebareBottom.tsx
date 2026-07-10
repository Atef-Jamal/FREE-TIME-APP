import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RiCloseFill } from "react-icons/ri";
import { FaList } from "react-icons/fa";
import { FaMusic } from "react-icons/fa6";
import { useSocketEvents } from "../../hooks/useSocketEvents";
import { useAppSelector } from "../../context/hooks";
import { selectOpenMusicModal, selectPublicMsgNotify } from "../../context/appStateSlice";
import { mobileNavBottomItems } from "../../helper/data";
import { cn } from "../../utilities";

interface IProps {
  handleCloseMobileSidebare: (open: boolean) => void;
  openSidbareMobile: boolean;
}

const NavebareBottom = ({ handleCloseMobileSidebare, openSidbareMobile }: IProps) => {
  const publicMsgNotify = useAppSelector(selectPublicMsgNotify);
  const openMusicModal = useAppSelector(selectOpenMusicModal);
  const [privateMsgRedPoint, setPrivateMsgRedPoint] = useState(false);

  const handleToggleMobileSidbare = () => {
    handleCloseMobileSidebare(!openSidbareMobile);
  };

  useEffect(() => {
    if (openSidbareMobile) {
      setPrivateMsgRedPoint(false);
    }
  }, [openSidbareMobile, setPrivateMsgRedPoint]);

  const handleNotifyNewPrivateMessage = useCallback(() => {
    if (location.pathname !== "/privatechat" && !openSidbareMobile) {
      setPrivateMsgRedPoint(true);
    }
  }, [openSidbareMobile]);

  useSocketEvents({
    private_chat_message: handleNotifyNewPrivateMessage,
  });

  return (
    <ul className="fixed bottom-0 left-0 z-[10] flex h-[60px] w-full items-center justify-between gap-x-1 bg-[#2b2b55] lg:hidden">
      <li className="relative flex h-[65px] w-[17%] items-center justify-center">
        {openSidbareMobile && <RiCloseFill className="text-3xl" onClick={handleToggleMobileSidbare} />}
        {!openSidbareMobile && <FaList className="text-xl" onClick={handleToggleMobileSidbare} />}
        {privateMsgRedPoint && (
          <span className="absolute left-[30%] top-[10%] h-3 w-3 rounded-full bg-[#f82929]"></span>
        )}
        {openMusicModal && (
          <span className="absolute right-[25%] top-1 animate-pulse">
            <FaMusic className="text-sm" />
          </span>
        )}
      </li>

      {mobileNavBottomItems.map((item, i) => (
        <li key={item.path} className={cn("h-[55px] flex-1", i === 1 && "-mt-4")}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              cn(
                "relative flex h-full flex-col items-center justify-center gap-1 rounded-md text-xs font-[500] text-gray-200",
                isActive && "bg-gradient-to-t from-[#d9ff0088] to-[#3e5a2836] text-[#bfbee6]",
                i === 1 && "bg-[#3a3a6b]",
              )
            }
          >
            {publicMsgNotify && item.path === "chat" && (
              <span className="absolute left-[30%] top-[10%] h-3 w-3 rounded-full bg-[#f70606ee]"></span>
            )}
            {item.icon}
            {item.path.replace(item.path[0], item.path[0].toUpperCase())}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavebareBottom;
