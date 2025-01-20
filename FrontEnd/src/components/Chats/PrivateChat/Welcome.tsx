import { IoChatboxEllipsesOutline } from "react-icons/io5";

interface IProps {
  handleOpenSidbare: () => void;
}

const Welcome = ({ handleOpenSidbare }: IProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <IoChatboxEllipsesOutline className="text-6xl" />
      <p className="text-center text-2xl font-bold text-[#cf9d9d59]">START YOUR CHAT NOW</p>
      <p className="text-center text-lg font-bold text-[#cf9d9d59]">
        WITH MORE SECURITY AND PRIVACY AND MUCH MORE
        <br />
        <button onClick={handleOpenSidbare} className="text-lg font-bold text-[#9063e481] underline">
          Select a IUser
        </button>
      </p>
    </div>
  );
};

export default Welcome;
