import { IoStar } from "react-icons/io5";

interface TypeOfferPartener {
  image: string;
}

const ParnterCard = ({ image }: TypeOfferPartener) => {
  return (
    <div className="w-[150px] flex flex-col gap-2 items-center justify-center bg-[#40364d85] rounded-md p-2">
      <img
        alt={""}
        src={image}
        className="w-full h-[50px] object-contain object-center"
      />
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
