import { lazy, Suspense, useCallback, useState } from "react";
import { useAppSelector } from "../context/Hooks";
import Model from "../components/Others/Model";
import Navbare from "../components/Navebare/Navbare";
import ContentBody from "../components/Layout/ContentBody";
import LogicalComponent from "../components/Layout/LogicalComponent";
import ToastNotify from "../components/Others/ToastNotify";

const NavebareBottom = lazy(() => import("../components/Navebare/NavebareBottom"));

const Layout = () => {
  const model = useAppSelector((state) => state.stateManeger.model);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);
  const [openSidbareMobile, setOpenSidbareMobile] = useState(false);

  const handleCloseMobileSidebare = useCallback((open: boolean) => {
    setOpenSidbareMobile(open);
  }, []);

  return (
    <main>
      {model.status && <Model children={model.children} />}
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
