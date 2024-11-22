"use client";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { EdgeStoreProvider } from "@/lib/edgestore";
const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <head>
        <title>INAT JE Dashboard</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${montserrat.className} bg-light `}>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="flex flex-col sm:flex-row min-h-screen">
          {pathname === "/" ? null : (
            <>
              <Sidebar />
              <div className="flex sm:hidden h-28" />
            </>
          )}

          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </div>
      </body>
    </html>
  );
}
