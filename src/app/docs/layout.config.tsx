import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import logo from "../../images/logo.svg";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image src={logo} width={24} height={24} alt="DriveConstructor logo" />
        DriveConstructor
      </>
    ),
  },
  themeSwitch: { enabled: false },
};
