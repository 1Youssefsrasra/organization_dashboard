"use client";
import {
  LogOut,
  Mail,
  X,
  ChevronDown,
  Handshake,
  CalendarHeart,
  Binary,
  ScrollText,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const pages = [
  { title: "Documents", route: "/documents", icon: ScrollText },
  { title: "Demandes Devis", route: "/demandes", icon: ReceiptText },
  { title: "INAT Chiffres", route: "/inat-numbers", icon: Binary },
  { title: "Événements", route: "/events", icon: CalendarHeart },
  { title: "Partenaires", route: "/partners", icon: Handshake },
  { title: "Messages", route: "/messages", icon: Mail },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [toggle, setToggle] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <nav className="hidden w-fit min-h-screen sm:flex flex-col justify-start rounded-r-3xl items-center bg-light px-4 py-6 gap-12 ">
        <Link href="/" className="flex lg:hidden">
          <img src="/logos/circular.png" alt="logo" className="h-12" />
        </Link>
        <Link href="/" className="hidden lg:flex">
          <img
            src="/logos/circular.png"
            alt="logo"
            className="md:h-32 w-full"
          />
        </Link>
        <div className="flex flex-col items-center justify-center w-full gap-4">
          {pages.map((page, index) => (
            <Link
              href={page.route}
              key={index}
              className={`${
                pathname === page.route
                  ? "bg-primary text-white"
                  : " text-black"
              } group rounded-xl flex items-center justify-start gap-4 w-full py-4 px-6 hover:bg-teritiary cursor-pointer app_transition `}
            >
              <page.icon
                size={26}
                className={`${
                  pathname === page.route ? " text-white" : " text-black"
                } `}
              />
              <span className="hidden lg:flex font-bold truncate">
                {page.title}
              </span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="group rounded-xl flex items-center justify-start gap-4 w-full py-3 px-5 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white cursor-pointer app_transition"
          >
            <LogOut size={26} />
            <span className="hidden lg:flex font-bold truncate">
              Se Déconnecter
            </span>
          </button>
        </div>
      </nav>

      <nav className="sm:hidden w-full h-fit fixed z-[50] flex flex-row justify-between items-center px-4 py-6 bg-white">
        <Link href="/" className="flex lg:hidden">
          <img src="/logos/circular.png" alt="logo" className="h-12" />
        </Link>
        <div className="sm:hidden w-[35px] h-[35px] relative flex justify-center items-center ">
          <ChevronDown
            onClick={() => setToggle(true)}
            className="w-[100%] h-[100%] "
            color="#234189"
          />

          {toggle && (
            <div className="lg:hidden fixed z-[5] w-full h-fit flex justify-end items-end flex-col bg-secondary text-white py-6 pb-16 right-0 inset-y-0 text-center">
              <div className="w-[35px] h-[35px] flex justify-center items-center rounded-full mx-4 my-2">
                <X
                  className="w-[100%] h-[100%] text-white "
                  onClick={() => setToggle(false)}
                />
              </div>

              <ul className="h-full w-full flex justify-center items-center flex-col m-0 px-8 list-none gap-8 select-none cursor-pointer ">
                {pages.map((page, index) => (
                  <Link
                    href={page.route}
                    key={index}
                    className={`${
                      pathname === page.route ? "bg-gray-950" : ""
                    } group rounded-xl flex items-center justify-start gap-4 w-full py-4 px-6 hover:bg-gray-950 cursor-pointer app_transition `}
                  >
                    <page.icon size={26} color="white" />
                    <span className="flex font-bold truncate">
                      {page.title}
                    </span>
                  </Link>
                ))}
                <li
                  onClick={handleLogout}
                  className="group rounded-xl flex items-center justify-start gap-4 w-full py-4 px-6 bg-red-500 text-white hover:bg-red-700 cursor-pointer app_transition"
                >
                  <LogOut size={26} />
                  <span className="flex font-bold truncate">Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
