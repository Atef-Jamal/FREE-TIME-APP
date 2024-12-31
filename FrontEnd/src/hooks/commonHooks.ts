import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TypeUseScrollToElementHook } from "../types/othersTypes";

export const useScrollToElement = ({
  key = "to",
  scrollPosition = "center",
  dependencies = [],
  callback,
}: TypeUseScrollToElementHook) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get(key);

  useEffect(() => {
    if (queryParam) {
      const targetElement = document.getElementById(queryParam);
      const handleRemoveAnimation = (event: MouseEvent) => {
        const targetElement = event.currentTarget as HTMLElement;
        targetElement.classList.remove("activeElement");
        setSearchParams((prev) => {
          prev.delete(key);
          return prev;
        });
      };

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: scrollPosition,
        });
        targetElement.classList.add("activeElement");
        targetElement.addEventListener("click", handleRemoveAnimation);
        return () => {
          targetElement.classList.remove("activeElement");
          targetElement.removeEventListener("click", handleRemoveAnimation);
        };
      } else {
        if (callback) callback();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParam, setSearchParams, key, ...dependencies]);
};
