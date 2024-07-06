"use client";

import AppWalletProvider from "../../components/AppWalletProvider";
import "@/app/globals.css";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import { LngButton } from "../../components/LngButton/client";
import { useTranslation } from "@/i18n/client";
import { dir } from "i18next";
import { languages } from "../../i18n/settings";

interface LayoutParams {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}

const RootLayout: React.FC<LayoutParams> = ({ children, params: { lng } }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation(lng, "main");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <html lang={lng} dir={dir(lng)}>
      <body>
        <AppWalletProvider>
          <header className="z-20 p-4 bg-white shadow-md border-b opacity-90 w-full fixed">
            <div className="px-2 mx-auto flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/images/logo_image.svg"
                  alt="Logo Image"
                  className="h-9 w-9"
                />
                <img
                  src="/images/logo.svg"
                  alt="Logo Text"
                  className="h-7 pt-1"
                />
              </Link>
              <nav className="flex items-center justify-between w-full ml-14">
                <div className="flex items-center space-x-7 text-sm"></div>
                <div className="flex items-center space-x-4">
                  <LngButton lng={lng} />
                  <WalletMultiButton />
                </div>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="bg-baseblue text-white py-6 pb-24">
            <div className="container mx-auto flex justify-start items-center">
              <Link href="/" passHref>
                <div className="flex items-center cursor-pointer">
                  <img
                    src="/images/footer_logo.png"
                    alt={t("layout.footer_logo_alt")}
                    width={250}
                    height={80}
                    className="mr-4"
                  />
                </div>
              </Link>
            </div>
          </footer>
        </AppWalletProvider>
      </body>
    </html>
  );
};

export default RootLayout;
