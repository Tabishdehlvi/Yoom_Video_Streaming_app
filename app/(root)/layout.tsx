import React, { ReactNode } from "react";
import { Metadata } from "next";
import SteamVideoProvider from "@/providers/StreamClientProvider";

export const metadata: Metadata = {
  title: "YOOM",
  description: "Video calling app",
  icons: {
    icon: "/icons/logo.svg",
  },
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <SteamVideoProvider>{children}</SteamVideoProvider>
    </main>
  );
};

export default RootLayout;
