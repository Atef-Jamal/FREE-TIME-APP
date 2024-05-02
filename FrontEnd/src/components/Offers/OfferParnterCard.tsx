import { IoStar } from "react-icons/io5";

interface TypeOfferPartener {
  image: string;
  title: string;
}

const OfferParnterCard = ({ image, title }: TypeOfferPartener) => {
  return (
    <div className="flex flex-col justify-center gap-6 h-[200px] w-[150px] bg-[#222339] rounded-md pl-4">
      <img alt={""} src={image} className="w-28 h-12" />
      <span>{title}</span>
      <div className="flex ">
        <IoStar />
        <IoStar />
        <IoStar />
        <IoStar />
        <IoStar />
      </div>
    </div>
  );
};

export default OfferParnterCard;
