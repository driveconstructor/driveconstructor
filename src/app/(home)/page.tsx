import Link from "next/link";
import Applications from "./Applications";
import PageTemplate from "./PageTemplate";

export default function Home() {
  return (
    <PageTemplate
      title="Welcome to DriveConstructor"
      text={
        <>
          Discover the beauty and complexity of the world of standard
          components. Watch introduction videos for{" "}
          <Link
            href="https://www.youtube.com/watch?v=9fkdTpHpYyM"
            className="underline"
          >
            professors
          </Link>{" "}
          and{" "}
          <Link
            href="https://www.youtube.com/watch?v=12ptSRRTnCY"
            className="underline"
          >
            students{" "}
          </Link>{" "}
          along with the complete list of tutorials on our{" "}
          <Link
            href="https://www.youtube.com/@driveconstructor5112"
            className="underline"
          >
            YouTube channel.
          </Link>
        </>
      }
    >
      <Applications />
    </PageTemplate>
  );
}
