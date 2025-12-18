"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import  Image  from "next/image";
import { ChevronLeft, Package, Image as Img, MoveLeft, FolderTree, Store } from "lucide-react";

const AdminLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Category",
      icon: FolderTree,
      href: "/admin/category",
      description: "Manage your product categories"
    },
    {
      name: "Product",
      icon: Package,
      href: "/admin/product",
      description: "Manage your products and inventory"
    },
    {
      name: "Banner",
      icon: Img,
      href: "/admin/banner",
      description: "Manage promotional banners and images"
    },
  ];

  const isActive = (path: string) => pathname === path;

  const getPageTitle = () => {
    const currentMenu = menuItems.find((item) => item.href === pathname);
    return currentMenu ? currentMenu.name : "Dashboard";
  };

  const getPageDescription = () => {
    const currentMenu = menuItems.find((item) => item.href === pathname);
    return currentMenu ? currentMenu.description : "Welcome to your admin dashboard";
  };

  return (
    <div className="fixed flex h-screen overflow-auto w-full">
      <aside
        className={`fixed h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-50 ${isCollapsed ? "w-[70px]" : "w-60"
          }`}
      >
        <div className={`flex items-center border-b border-gray-200 px-4 py-4 ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <Image src="/LogoMain.png" width={2000} height={2000} alt="Logo" className="w-6 h-6 text-gray-900 shrink-0" />
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
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${active
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
                      className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed
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
            className={`flex items-center gap-3 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-200 group ${isCollapsed
              ? "justify-center w-11 mx-auto"
              : "justify-center pr-3"
              }`}
          >
            <ChevronLeft
              className={`w-5 h-5 translate-x-1 text-gray-500 group-hover:text-gray-900 transition-all duration-300 ${isCollapsed && "rotate-180"
                }`}
            />
            <span className={`transition-all whitespace-nowrap duration-300 ${isCollapsed
              ? "opacity-0 w-0 overflow-hidden"
              : "opacity-100 w-auto"
              }`}>Collapse</span>
          </button>
        </div>
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-[70px]" : "ml-60"
          }`}
      >
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-500">{getPageDescription()}</p>
            </div>
            <Link
              href="/user"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              <MoveLeft className="w-4 h-4" />
              <span>Kembali ke Website</span>
            </Link>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;