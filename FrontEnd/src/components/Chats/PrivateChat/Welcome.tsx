import { IoChatboxEllipsesOutline } from "react-icons/io5";

interface TypeProps {
  handleOpenSidbare: () => void;
}

const Welcome = ({ handleOpenSidbare }: TypeProps) => {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <IoChatboxEllipsesOutline className="text-6xl" />
      <p className="text-2xl text-[#cf9d9d59] font-bold text-center">
        START YOUR CHAT NOW
      </p>
      <p className="text-lg text-[#cf9d9d59] font-bold text-center">
        WITH MORE SECURITY AND PRIVACY AND MUCH MORE
        <br />
        <button
          onClick={handleOpenSidbare}
          className=" text-lg text-[#9063e481] font-bold underline"
        >
          Select a User
        </button>
      </p>
    </div>
  );
};

export default Welcome;
