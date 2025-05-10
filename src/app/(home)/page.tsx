import Applications from "./Applications";
import PageTemplate from "./PageTemplate";

export default function Home() {
  return (
    <PageTemplate
      title="Welcome to DriveConstructor"
      text="
        Discover the beauty and complexity of the world of standard components.
        Watch the complete list of tutorials on our YouTube channel.
      "
    >
      <Applications />
    </PageTemplate>
  );
}
