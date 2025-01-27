import egypt from "../../assets/images/eg.svg";
import { MdLanguage } from "react-icons/md";
import { SetStateAction, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useClickOutside } from "../../hooks/useClickOutside";

interface IProps {
  setOpenLangMenu: React.Dispatch<SetStateAction<boolean>>;
}

const LangMenu = ({ setOpenLangMenu }: IProps) => {
  const langRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  const languages = [
    { title: "English", lang: "en" },
    { title: "عربي", lang: "ar" },
  ];

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  useClickOutside(langRef, () => setOpenLangMenu(false));

  return (
    <div
      ref={langRef}
      className="select__languages absolute left-1 top-full flex w-44 flex-col justify-center rounded-md bg-[#33334d] px-2 py-1"
    >
      {languages.map((item) => (
        <button
          key={item.lang}
          onClick={() => handleChangeLanguage(item.lang)}
          className="flex items-center gap-4 py-1"
        >
          {item.title === "English" ? (
            <MdLanguage className="text-sm md:text-xl" />
          ) : (
            <img alt={""} src={egypt} className="h-4 w-4 rounded-full lg:h-5 lg:w-5" />
          )}
          <span className="text-xs font-[500] text-gray-300">{item.title}</span>
          <span className="text-xs font-[500] text-gray-300">( {item.lang.toUpperCase()} )</span>
        </button>
      ))}
    </div>
  );
};

export default LangMenu;
