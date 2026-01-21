"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Package,
  Image as Img,
  MoveLeft,
  FolderTree,
  Menu,
  X,
} from "lucide-react";

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Category",
      icon: FolderTree,
      href: "/admin/category",
      description: "Manage your product categories",
    },
    {
      name: "Product",
      icon: Package,
      href: "/admin/product",
      description: "Manage your products and inventory",
    },
    {
      name: "Banner",
      icon: Img,
      href: "/admin/banner",
      description: "Manage promotional banners and images",
    },
  ];

  const isActive = (path: string) => pathname === path;

  const getPageTitle = () => {
    const currentMenu = menuItems.find((item) => item.href === pathname);
    return currentMenu ? currentMenu.name : "Dashboard";
  };

  const getPageDescription = () => {
    const currentMenu = menuItems.find((item) => item.href === pathname);
    return currentMenu
      ? currentMenu.description
      : "Welcome to your admin dashboard";
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <aside
        className={`hidden md:flex fixed h-screen bg-white border-r border-gray-200 flex-col transition-all duration-300 ease-in-out z-50 ${
          isCollapsed ? "w-[70px]" : "w-60"
        }`}
      >
        <div
          className={`flex items-center border-b border-gray-200 px-4 py-4 ${isCollapsed ? "justify-center" : "gap-3"}`}
        >
          <Image
            src="/LogoMain.png"
            width={40}
            height={40}
            alt="Logo"
            className="w-6 h-6 text-gray-900 shrink-0"
          />
          <h1
            className={`font-semibold text-[17px] text-gray-900 whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
          >
            Dashboard Admin
            <p className="text-xs font-medium text-gray-500">Smith Origin</p>
          </h1>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item, idx) => {
              const active = isActive(item.href);
              return (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-red-50 text-red-800"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    } ${isCollapsed ? "justify-center" : "justify-start"}`}
                  >
                    <item.icon
                      className={
                        isCollapsed
                          ? "w-5 h-5 shrink-0 translate-x-1"
                          : "w-5 h-5 shrink-0"
                      }
                    />
                    <span
                      className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                        isCollapsed
                          ? "opacity-0 w-0 overflow-hidden"
                          : "opacity-100 w-auto"
                      }`}
                    >
                      {item.name}
                    </span>

                    {isCollapsed && (
                      <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 flex flex-col gap-2 px-3 py-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center gap-3 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-200 group ${
              isCollapsed
                ? "justify-center w-11 mx-auto"
                : "justify-center pr-3"
            }`}
          >
            <ChevronLeft
              className={`w-5 h-5 translate-x-1 text-gray-500 group-hover:text-gray-900 transition-all duration-300 ${
                isCollapsed && "rotate-180"
              }`}
            />
            <span
              className={`transition-all whitespace-nowrap duration-300 ${
                isCollapsed
                  ? "opacity-0 w-0 overflow-hidden"
                  : "opacity-100 w-auto"
              }`}
            >
              Collapse
            </span>
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/LogoMain.png"
                    width={40}
                    height={40}
                    alt="Logo"
                    className="w-6 h-6"
                  />
                  <h1 className="font-semibold text-sm text-gray-900">
                    Dashboard Admin
                    <p className="text-xs font-medium text-gray-500">
                      Smith Origin
                    </p>
                  </h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="px-3 py-4">
                <ul className="space-y-1">
                  {menuItems.map((item, idx) => {
                    const active = isActive(item.href);
                    return (
                      <li key={idx}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                            active
                              ? "bg-red-50 text-red-800"
                              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <item.icon className="w-5 h-5 shrink-0" />
                          <span className="font-medium text-sm">
                            {item.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "md:ml-[70px]" : "md:ml-60"
        } ml-0 overflow-auto`}
      >
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex flex-col gap-0.5 md:gap-1">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-xs md:text-sm text-gray-500">
                  {getPageDescription()}
                </p>
              </div>
            </div>
            <Link
              href="/user"
              className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              <MoveLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Website</span>
              <span className="sm:hidden">Kembali</span>
            </Link>
          </div>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
