import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface IScrollToElementHook {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key?: string;
  startScroll?: boolean;
  scrollPosition?: "center" | "start" | "end" | "nearest";
  callback?: () => void;
}

export const useScrollToElement = ({
  key = "to",
  startScroll = true,
  scrollPosition = "center",
  callback,
}: IScrollToElementHook) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get(key);

  useEffect(() => {
    console.log("first");
    if (queryParam && startScroll) {
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
  }, [queryParam, setSearchParams, key, scrollPosition, callback, startScroll]);
};
