"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiFillBug } from "react-icons/ai";
import classNames from "classnames";
import { FaUserCircle } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiLogOut } from "react-icons/fi";


const Navbar = () => {
  const [openUserPopup, setOpenUserPopup] = useState(false);
  const links = [];
  const [userName, setUserName] = useState("");
  const router=useRouter();
  const currentPath = usePathname();

  const {data: session}=useSession();

  if (session) {
    links.push(
      { id: 1, href: "/dashboard", name: "Dashboard" },
      { id: 2, href: "/issues", name: "Issues" }
    );
  }

  const handlePopup = () => {
    setOpenUserPopup(!openUserPopup);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    setOpenUserPopup(false);
    setUserName("")
    toast.success("User Logged out");
  };

  return (
    <nav className="flex justify-between border-b mb-5 px-5 md:px-16 h-14 items-center">
      <Link href="/dashboard" className="flex items-center">
        <span className="text-[orangered] flex items-center text-xl">issue</span><span className="font-bold flex items-center"><span className="text-2xl">T</span>racker</span>
        <AiFillBug size={30} />
      </Link>
      <div className="flex space-x-6 items-center">
        <ul className="flex space-x-6">
          {links.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                className={classNames({
                  "text-[orangered]": link.href === currentPath,
                  "text-zinc-500": link.href !== currentPath,
                  "hover:text-zinc-800 transition-colors text-lg": true,
                })}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        {session && <FaUserCircle
          size={24}
          className="cursor-pointer"
          onClick={handlePopup}
        />}
        {openUserPopup && (
          <div className="absolute rounded border-2 p-2 top-[3.6rem] right-[1rem] flex flex-col bg-gray-100">
            <span className="mb-2">{session?.user?.email}</span>
            <button className="bg-[orangered] hover:bg-red-600 flex justify-center items-center text-white rounded px-2 py-1" onClick={handleLogout}>
          <FiLogOut color="white" size={20} className="mr-2"/>Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
