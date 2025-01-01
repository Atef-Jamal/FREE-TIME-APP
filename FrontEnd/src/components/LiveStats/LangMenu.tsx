import egypt from "../../assets/images/eg.svg";
import { MdLanguage } from "react-icons/md";
import { SetStateAction, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useCloseMenuOnClickOutSide } from "../../hooks";

interface TypeProps {
  setOpenLangMenu: React.Dispatch<SetStateAction<boolean>>;
}

const LangMenu = ({ setOpenLangMenu }: TypeProps) => {
  const langRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  const languages = [
    { title: "English", lang: "en" },
    { title: "عربي", lang: "ar" },
  ];

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleClose = () => {
    setOpenLangMenu(false);
  };

  useCloseMenuOnClickOutSide({
    menuRef: langRef,
    handleClose,
  });

  return (
    <div
      ref={langRef}
      className="select__languages absolute top-[60px] lg:top-[64px] sm:top-[35px] left-3 sm:left-1 z-[10s0] rounded-md w-56 sm:w-40  bg-[#33334d] flex flex-col justify-center py-1"
    >
      {languages.map((item) => (
        <button
          key={item.lang}
          onClick={() => handleChangeLanguage(item.lang)}
          className="flex gap-4 items-center hover:bg-slate-500 py-1 pl-2"
        >
          {item.title === "English" ? (
            <MdLanguage className="xs:text-sm text-xl" />
          ) : (
            <img alt={""} src={egypt} className="xs:w-4 xs:h-4 w-5 h-5 rounded-full" />
          )}
          <span className="xs:text-xs font-[500] text-gray-300">{item.title}</span>
          <span className="text-xs font-[500] text-gray-300">( {item.lang.toUpperCase()} )</span>
        </button>
      ))}
    </div>
  );
};

export default LangMenu;
