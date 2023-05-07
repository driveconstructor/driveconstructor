import Image, { StaticImageData } from "next/image";

export default function Element({
  icon,
  onClick,
}: {
  icon: StaticImageData;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick}>
      <Image src={icon.src} alt="element" width={80} height={80} />
    </div>
  );
}
