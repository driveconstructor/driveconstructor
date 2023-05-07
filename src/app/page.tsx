import Applications from "./Applications";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Welcome to DriveConstructor!</h1>
      <p>
        Discover the beauty and complexity of the world of standard components.
        Watch the complete list of tutorials on our YouTube channel.
      </p>
      <div className="flex">
        <Applications />
      </div>
    </div>
  );
}
