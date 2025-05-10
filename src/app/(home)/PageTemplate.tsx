export default function PageTemplate({
  title,
  text,
  children,
}: {
  title: React.ReactNode;
  text?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="p-4 text-2xl">{title}</div>
      {text ? <div className="p-4">{text}</div> : null}
      {children}
    </div>
  );
}
