import { lazy, Suspense, useCallback, useState } from "react";
import Navbare from "./Navbare/Navbare";
import Toast from "../components/Shared/Common/Toast";
import Modal from "../components/Shared/Modals/Modal";
import ContentBody from "./ContentBody/ContentBody";
import { useInitialization } from "../hooks/useInitialization";
import { useAppSelector } from "../context/hooks";
import { selectSmallScreen } from "../context/appStateSlice";

const NavebareBottom = lazy(() => import("./Navbare/NavebareBottom"));

const Layout = () => {
  const smallScreen = useAppSelector(selectSmallScreen);
  const [openSidbareMobile, setOpenSidbareMobile] = useState(false);

  const handleCloseMobileSidebare = useCallback((open: boolean) => {
    setOpenSidbareMobile(open);
  }, []);

  useInitialization();

  return (
    <main>
      <Modal />
      <Toast />
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
