import Image, { StaticImageData } from "next/image";

export default function Element({
  icon,
  size,
  active,
  onClick,
}: {
  icon: StaticImageData;
  size: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`border ${active ? "bg-slate-100" : ""} ${
        onClick ? "" : "cursor-default"
      }`}
    >
      <Image src={icon.src} alt="element" width={size} height={size} />
    </button>
  );
}
