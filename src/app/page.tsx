import Applications from "./Applications";

export default function Home() {
  return (
    <div className="space-y-4">
      <div className="text-2xl">Welcome to DriveConstructor!</div>
      <div>
        Discover the beauty and complexity of the world of standard components.
        Watch the complete list of tutorials on our YouTube channel.
      </div>
      <div className="flex">
        <Applications />
      </div>
    </div>
  );
}
