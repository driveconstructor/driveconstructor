import Image, { StaticImageData } from "next/image";

export default function Element({
  name,
  icon,
  width,
  height,
  active,
  onClick,
}: {
  name?: string;
  icon: StaticImageData;
  width: number;
  height: number;
  active?: boolean;
  onClick?: () => void;
}) {
  console.log("xxx: " + name);
  return (
    <button
      onClick={onClick}
      className={`${active ? "border-blue-400 bg-slate-100" : ""} ${
        onClick ? "border hover:border-blue-400" : "cursor-default"
      }`}
      data-testid={onClick ? `${name}.<icon>` : undefined}
    >
      <Image src={icon.src} alt="element" width={width} height={height} />
    </button>
  );
}
