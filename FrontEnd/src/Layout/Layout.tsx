import { lazy, Suspense, useCallback, useState } from "react";
import Navbare from "./Navbare/Navbare";
import ToastNotify from "../components/Shared/Common/ToastNotify";
import Modal from "../components/Shared/Modals/Modal";
import ContentBody from "./ContentBody/ContentBody";
import { useGlobalLogicInitializer } from "../hooks/useGlobalLogicInitializer";
import { useAppSelector } from "../context/hooks";

const NavebareBottom = lazy(() => import("./Navbare/NavebareBottom"));

const Layout = () => {
  const smallScreen = useAppSelector((state) => state.appState.smallScreen);
  const [openSidbareMobile, setOpenSidbareMobile] = useState(false);

  const handleCloseMobileSidebare = useCallback((open: boolean) => {
    setOpenSidbareMobile(open);
  }, []);

  useGlobalLogicInitializer();

  return (
    <main>
      <Modal />
      <ToastNotify />
      <Navbare />
      <ContentBody
        openSidbareMobile={openSidbareMobile}
        handleCloseMobileSidebare={handleCloseMobileSidebare}
      />
      {smallScreen && (
        <Suspense
          children={
            <NavebareBottom
              handleCloseMobileSidebare={handleCloseMobileSidebare}
              openSidbareMobile={openSidbareMobile}
            />
          }
        />
      )}
      <audio src={undefined} id="audioElement" className="hidden" />
    </main>
  );
};

export default Layout;
