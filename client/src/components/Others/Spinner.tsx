interface TypeProps {
  className?: string;
  stop?: boolean;
}

const Spinner = ({ className, stop }: TypeProps) => {
  return (
    <div
      className={`rounded-full border-2 border-t-transparent border-r-transparent border-b-yellow-400  border-l-yellow-400 ${
        !stop && "spinner-animation"
      } ${className || "w-10 h-10"}`}
    ></div>
  );
};

export default Spinner;
