interface TypeProps {
  className?: string;
  stop?: boolean;
}

const Spinner = ({ className, stop }: TypeProps) => {
  return (
    <div
      className={`rounded-full border-2 border-t-transparent border-r-transparent border-b-[#5aff44]  border-l-[#5aff44] ${
        !stop && "spinner-animation"
      } ${className || "w-10 h-10"}`}
    ></div>
  );
};

export default Spinner;
