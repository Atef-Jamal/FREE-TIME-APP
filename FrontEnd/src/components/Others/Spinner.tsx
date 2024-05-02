interface TypeProps {
  className?: string;
  stop?: boolean;
}

const Spinner = ({ className, stop }: TypeProps) => {
  return (
    <div
      className={`rounded-full border-2 border-t-transparent border-r-transparent border-b-blue-900  border-l-blue-900 ${
        !stop && "animate-spin"
      } ${className || "w-10 h-10"}`}
    ></div>
  );
};

export default Spinner;
