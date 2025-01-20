interface IProps {
  className?: string;
  stop?: boolean;
}

const Spinner = ({ className, stop }: IProps) => {
  return (
    <div
      className={`rounded-full border-2 border-b-[#6ccc3f] border-l-[#6ccc3f] border-r-transparent border-t-transparent ${
        !stop && "animate-spin"
      } ${className || "h-10 w-10"}`}
    ></div>
  );
};

export default Spinner;
