import { useTranslation } from "react-i18next";
import { egypt } from "../../assets";
import { MdLanguage } from "react-icons/md";

const SelectLang = () => {
  const { i18n } = useTranslation();
  const languages = [
    { title: "Global", lang: "en" },
    { title: "Egypt", lang: "ar" },
  ];

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="select__languages absolute top-[70px] lg:top-[68px] sm:top-[50px] left-3 rounded-lg w-56 sm:w-40 sm:h-16 bg-[#33334d] flex flex-col py-4 justify-center ">
      {languages.map((item) => (
        <button
          key={item.lang}
          onClick={() => handleChange(item.lang)}
          className="flex gap-4 items-center rounded-lg mx-2 px-4 py-2 sm:py-1 hover:bg-slate-500"
        >
          {item.title === "Global" ? (
            <MdLanguage />
          ) : (
            <img alt={""} src={egypt} className="w-4 h-4 rounded-full" />
          )}
          <span className="text-[11px] font-[500] text-gray-300">
            {item.title}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SelectLang;
