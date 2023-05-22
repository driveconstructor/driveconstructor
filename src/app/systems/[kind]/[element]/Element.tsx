import Image, { StaticImageData } from "next/image";

export default function Element({
  icon,
  width,
  height,
  active,
  onClick,
}: {
  icon: StaticImageData;
  width: number;
  height: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`border ${active ? "border-blue-400 bg-slate-100" : ""} ${
        onClick ? " hover:border-blue-400" : "cursor-default"
      }`}
    >
      <Image src={icon.src} alt="element" width={width} height={height} />
    </button>
  );
}
