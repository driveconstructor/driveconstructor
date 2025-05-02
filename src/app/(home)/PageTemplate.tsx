export default function Page({
  title,
  text,
  children,
}: {
  title: React.ReactNode;
  text: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="p-4 text-2xl">{title}</div>
      <div className="p-4">{text}</div>
      {children}
    </div>
  );
}
