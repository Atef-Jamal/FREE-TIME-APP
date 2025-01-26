import { lazy, Suspense, useCallback, useState } from "react";
import { useAppSelector } from "../context/Hooks";
import Navbare from "./Navbare/Navbare";
import ToastNotify from "../components/Shared/Common/ToastNotify";
import Modal from "../components/Shared/Modals/Modal";
import ContentBody from "./ContentBody/ContentBody";
import LogicalComponent from "./LogicalComponent";

const NavebareBottom = lazy(() => import("./Navbare/NavebareBottom"));

const Layout = () => {
  const smallScreen = useAppSelector((state) => state.appState.smallScreen);
  const [openSidbareMobile, setOpenSidbareMobile] = useState(false);

  const handleCloseMobileSidebare = useCallback((open: boolean) => {
    setOpenSidbareMobile(open);
  }, []);

  return (
    <main>
      <audio src={undefined} id="audioElement" className="hidden" />
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
              setOpenSidbareMobile={setOpenSidbareMobile}
              openSidbareMobile={openSidbareMobile}
            />
          }
        />
      )}
      <LogicalComponent />
    </main>
  );
};

export default Layout;
