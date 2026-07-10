import { lazy, Suspense, useCallback, useState } from "react";
import Navbare from "./Navbare/Navbare";
import Toast from "../components/Shared/Common/Toast";
import Modal from "../components/Shared/Modals/Modal";
import ContentBody from "./ContentBody/ContentBody";
import { useAppSelector } from "../context/hooks";
import { selectSmallScreen } from "../context/appStateSlice";
import { AppInitializer } from "./AppInitializer";

const NavebareBottom = lazy(() => import("./Navbare/NavebareBottom"));

const Layout = () => {
  const mobileScreen = useAppSelector(selectSmallScreen);
  const [openSidbareMobile, setOpenSidbareMobile] = useState(false);

  const handleCloseMobileSidebare = useCallback((open: boolean) => {
    setOpenSidbareMobile(open);
  }, []);

  return (
    <main>
      <Modal />
      <Toast />
      <Navbare />
      <ContentBody
        openSidbareMobile={openSidbareMobile}
        handleCloseMobileSidebare={handleCloseMobileSidebare}
      />
      {mobileScreen && (
        <Suspense
          children={
            <NavebareBottom
              handleCloseMobileSidebare={handleCloseMobileSidebare}
              openSidbareMobile={openSidbareMobile}
            />
          }
        />
      )}
      <AppInitializer />
      <audio src={undefined} id="audioElement" className="hidden" />
    </main>
  );
};

export default Layout;
