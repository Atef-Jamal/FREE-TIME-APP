import { cn } from "../../../utilities";

interface IProps {
  className?: string;
  color?: string;
}
const Spinner = ({ className, color }: IProps) => {
  return (
    <span
      style={{
        borderLeftColor: color || "orange",
        borderTopColor: color || "orange",
        borderRightColor: "transparent",
        borderBottomColor: "transparent",
      }}
      className={cn("h-6 w-6 animate-spin rounded-full border-[3px] lg:border-[4px]", className)}
    ></span>
  );
};

export default Spinner;
