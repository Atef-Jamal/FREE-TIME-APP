import { BsCheckCircleFill } from "react-icons/bs";
import { AiFillAndroid } from "react-icons/ai";
import { MdDesktopMac } from "react-icons/md";
import { SiApple } from "react-icons/si";
import { useAppSelector } from "../../context/hooks";
import type { IOffer } from "../../types";
import { useTranslation } from "react-i18next";
import { cn } from "../../utilities";
import { selectCurrentUser } from "../../context/appStateSlice";

interface IProps {
  offerDetails: IOffer;
  index: number;
  setOfferId: React.Dispatch<React.SetStateAction<string | null>>;
}

const OfferCard = ({ offerDetails, index, setOfferId }: IProps) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { t } = useTranslation("earn");
  const { _id, description, image, prize, title, isAvailable, devices } = offerDetails;
  const isCompleted = currentUser?.completedOffers.includes(_id);

  return (
    <div
      id={offerDetails._id}
      onClick={() => setOfferId(offerDetails._id)}
      className={cn(
        "relative flex h-[230px] flex-col justify-between overflow-hidden rounded-md border border-gray-700 bg-[#55539b3a] p-2",
        index === 0 && "col-span-2",
      )}
    >
      {currentUser?.completedOffers.includes(_id) ? (
        <div className="absolute -left-7 top-7 z-[1] flex -rotate-45 items-center justify-center gap-2 bg-[#9cf155] px-6 py-1">
          <BsCheckCircleFill />
          <span className="text-xs font-bold text-[#5e5656]">{t("Completed")}</span>
        </div>
      ) : undefined}

      <div className="relative overflow-hidden">
        <div className="mx-auto w-full overflow-hidden">
          <img
            alt={""}
            src={`${import.meta.env.VITE_SERVER_BASE_URL}/${image}`}
            width={"100%"}
            className={`h-[95px] w-full rounded-sm object-fill`}
          />
        </div>
        <span
          className={`absolute left-0 right-0 top-1 mx-auto flex w-[83px] items-center justify-center gap-1 rounded-md border border-gray-600 bg-[#000000c5] px-3 py-1`}
        >
          {devices === "DESKTOP" && <MdDesktopMac className="min-w-fit" />}
          {devices === "ANDROID" && <AiFillAndroid className="min-w-fit" />}
          {devices === "MAC" && <SiApple className="min-w-fit" />}
          {devices === "ALL" && (
            <>
              <MdDesktopMac className="min-w-fit" />
              <AiFillAndroid className="min-w-fit" />
              <MdDesktopMac className="min-w-fit" />
            </>
          )}
        </span>
      </div>
      <div className="flex flex-col">
        <p className="truncate text-sm font-bold text-[#8ad657]">{title}</p>
        <p className="h-4 truncate text-xs text-[#cea5a5]">{description}</p>
        <div className="flex items-center justify-between">
          <span className="py-1 text-xs font-bold text-gray-300">{t("Reward")}</span>
          <span className="pr-1 text-center text-sm font-bold text-[#5dd140] sm:text-xs">{prize}</span>
        </div>
      </div>
      {isCompleted && (
        <button
          className={`w-full rounded-md border border-gray-700 bg-[#171430d5] py-2 text-sm text-white sm:text-xs`}
        >
          {t("Completed")}
        </button>
      )}
      {!isCompleted && isAvailable === "AVAILABLE" && (
        <button className={`w-full rounded-md bg-[#a4ec52cc] py-2 text-center text-sm font-bold sm:text-xs`}>
          {t("START NOW")}
        </button>
      )}
      {isAvailable === "UNAVAILABLE" && (
        <button className={`w-full rounded-md bg-[#528feccc] py-2 text-center text-sm font-bold sm:text-xs`}>
          {t("Not Available")}
        </button>
      )}
    </div>
  );
};

export default OfferCard;
