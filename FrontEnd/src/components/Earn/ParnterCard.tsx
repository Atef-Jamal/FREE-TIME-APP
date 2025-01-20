import { IoStar } from "react-icons/io5";

interface IPartenerCard {
  image: string;
}

const ParnterCard = ({ image }: IPartenerCard) => {
  return (
    <div className="flex w-[150px] flex-col items-center justify-center gap-2 rounded-md bg-[#40364d85] p-2">
      <img alt={""} src={image} className="h-[50px] w-full object-contain object-center" />
      <div className="flex items-center justify-center">
        <IoStar />
        <IoStar />
        <IoStar />
        <IoStar />
        <IoStar />
      </div>
    </div>
  );
};

export default ParnterCard;
