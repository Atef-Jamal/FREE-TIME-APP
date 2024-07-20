import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Image = ({
  src,
  alt,
  width,
  className,
}: {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}) => {
  return (
    <>
      <LazyLoadImage
        alt={alt}
        className={className}
        src={src}
        effect="blur"
        width={width}
      />
    </>
  );
};

export default Image;
