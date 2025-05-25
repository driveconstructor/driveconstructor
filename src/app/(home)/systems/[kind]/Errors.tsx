export default function Errors({
  errors,
  handleDismissClick,
}: {
  errors: string[];
  handleDismissClick: () => void;
}) {
  return (
    <div className="grid">
      <div>&nbsp;</div>
      <div className="text-red-600 text-lg">
        Error: {errors}
        &nbsp;
      </div>
      <div className="flex">
        <div className="grow" />
        <button className="btn flex-none text-sm" onClick={handleDismissClick}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
