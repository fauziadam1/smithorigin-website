"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Package, Archive, Image, MoveLeft } from "lucide-react";

const AdminLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Category", icon: Archive, href: "/admin/category" },
    { name: "Product", icon: Package, href: "/admin/product" },
    { name: "Banner", icon: Image, href: "/admin/banner" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed flex h-screen overflow-auto w-full bg-gray-100">
      <aside
        className={`fixed h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300 ease-in-out z-50 ${isCollapsed ? "w-[70px]" : "w-[240px]"
          }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <div
            className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
          >
            <h1 className="font-semibold text-[17px] text-gray-900 whitespace-nowrap">
              Dashboard Admin
            </h1>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200 group ${isCollapsed && "mx-auto"
              }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={`w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-all duration-300 ${isCollapsed && "rotate-180"
                }`}
            />
          </button>
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

        <div className="border-t border-gray-200 space-y-3 px-3 py-4">
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${isCollapsed ? "justify-center" : "justify-start"
              }`}
          >
            <div
              className={
                isCollapsed
                  ? "w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 translate-x-1"
                  : "w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
              }
            >
              <span className="text-red-800 text-sm font-semibold">A</span>
            </div>
            <div
              className={`transition-all duration-300 ${isCollapsed
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100 w-auto"
                }`}
            >
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>

          <Link href="/user">
            <button
              className={`flex items-center justify-between gap-3 px-4 py-2 border border-red-800 text-red-800 cursor-pointer text-sm font-medium rounded-lg hover:text-white hover:bg-red-900 transition-all duration-300 ${isCollapsed
                ? "justify-center w-11 mx-auto"
                : "justify w-full"
                }`}
            >
              <MoveLeft className={
                isCollapsed
                  ? "w-4 h-4 shrink-0 translate-x-1"
                  : "w-4 h-4 shrink-0"
              } />
              <span
                className={`transition-all whitespace-nowrap duration-300 ${isCollapsed
                  ? "opacity-0 w-0 overflow-hidden"
                  : "opacity-100 w-auto"
                  }`}
              >
                Kembali
              </span>
            </button>
          </Link>
        </div>
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-[70px]" : "ml-60"
          }`}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
