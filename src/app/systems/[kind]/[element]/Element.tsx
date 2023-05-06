import { StaticImageData } from "next/image";

export default function Element({
  icon,
  className,
  onClick,
}: {
  icon: StaticImageData;
  className: string;
  onClick?: () => void;
}) {
  const style = {
    backgroundImage: `url(${icon.src})`,
    backgroundRepeat: "no-repeat",
  };
  return (
    <div className={className} onClick={onClick}>
      <div style={style} className="el-icon" />
    </div>
  );
}
