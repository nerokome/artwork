"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Upload,
  BarChart,
  UserRound,
  UsersRound,
  MessageCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { logoutUser } from "@/app/redux/store/userslice";
import { clearNotifications, fetchNotifications } from "@/app/redux/store/messagingslice";
import ThemeToggle from "./ThemeToggle";
import { toast } from "sonner";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);
  const unreadNotifications = useSelector(
    (state: RootState) => state.messaging.notifications.filter((notification) => !notification.isRead).length
  );

  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!token) {
      dispatch(clearNotifications());
      return;
    }

    const request = dispatch(fetchNotifications(token));
    const intervalId = window.setInterval(() => {
      void dispatch(fetchNotifications(token));
    }, 30_000);
    return () => {
      request.abort();
      window.clearInterval(intervalId);
    };
  }, [dispatch, token]);

  const isActive = (path: string) =>
    pathname === path || (path !== "/dashboard" && pathname.startsWith(`${path}/`));

  const links = [
    {
      href: "/dashboard",
      label: "Portfolio",
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: "/dashboard/uploaddocs",
      label: "Upload Docs",
      icon: <Upload size={20} />,
    },
    {
      href: "/dashboard/analyticsdash",
      label: "Analytics",
      icon: <BarChart size={20} />,
    },
    {
      href: "/dashboard/messages",
      label: "Chat",
      icon: <MessageCircle size={20} />,
    },
    {
      href: "/dashboard/account",
      label: "Account",
      icon: <UserRound size={20} />,
    },
    {
      href: "/dashboard/artists",
      label: "Explore Artists",
      icon: <UsersRound size={20} />,
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: <Bell size={20} />,
      badge: unreadNotifications,
    },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("You have been logged out.");
      router.replace("/");
    } catch {
      toast.error("Could not log out. Please try again.");
    }
  };

  if (!mounted) return null;

  return (
    <>
      <nav className="md:hidden fixed top-0 w-full z-[90] bg-black/80 backdrop-blur-xl border-b border-white/5 text-neutral-200 flex items-center justify-between px-4 sm:px-6 py-2">
        <Link
          href="/dashboard/account"
          aria-label="View account"
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400/40 bg-cyan-400/10 text-xs font-bold text-cyan-300"
        >
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={`${user.name} profile picture`}
              width={36}
              height={36}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : user?.name ? (
            user.name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()
          ) : (
            <UserRound size={18} />
          )}
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/notifications"
            aria-label={`Notifications${unreadNotifications > 0 ? `, ${unreadNotifications} unread` : ""}`}
            title="Notifications"
            className={`relative rounded-xl border p-2 transition-colors ${
              isActive("/dashboard/notifications")
                ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-400"
                : "border-white/10 bg-white/5 text-neutral-200 hover:bg-cyan-400/20"
            }`}
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 text-[9px] font-bold text-black">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-cyan-400/20 hover:text-cyan-400"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <nav
        aria-label="Dashboard navigation"
        className="fixed bottom-0 left-0 right-0 z-[90] grid grid-cols-6 border-t border-white/10 bg-black/90 pb-[env(safe-area-inset-bottom)] text-neutral-200 backdrop-blur-xl md:hidden"
      >
        {links.slice(0, 6).map((link) => {
          const active =
            isActive(link.href) ||
            (link.href === "/dashboard/account" &&
              (isActive("/dashboard/profile") || isActive("/dashboard/settings")));
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              aria-current={active ? "page" : undefined}
              title={link.label}
              className={`relative flex min-h-14 items-center justify-center transition-colors ${
                active ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-cyan-400" />}
              {link.icon}
            </Link>
          );
        })}
      </nav>

      <aside
        className={` hidden md:flex h-screen bg-[#090909] text-neutral-200 flex-col border-r border-white/5 transition-all duration-500 ease-in-out sticky top-0
        ${collapsed ? "w-24" : "w-72"}`}
      >
        <div className="flex items-center justify-between px-6 py-10">
          {!collapsed && (
            <Link href="/" className="transition-all hover:brightness-125">
              <Image
                src="/rarrr.png"
                alt="Artfolio Logo"
                width={140}
                height={40}
              />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all ${collapsed ? "mx-auto" : ""}`}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4">
          <div
            className={`mb-6 px-4 text-sm  transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}
          >
            System Menu
          </div>
          <ul className="space-y-2">
            {links.map((link) => (
              <SidebarItem
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={isActive(link.href)}
                collapsed={collapsed}
                badge={"badge" in link ? link.badge : undefined}
              />
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all group ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-sm">Exit</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  active,
  collapsed,
  badge,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`relative group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
        ${
          active
            ? "bg-cyan-400/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.03)]"
            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
        }
        ${collapsed ? "justify-center" : ""}`}
      >
        {active && (
          <div className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#22d3ee]" />
        )}

        <div
          className={`${active ? "scale-110" : "group-hover:scale-110"} transition-transform duration-300`}
        >
          {icon}
        </div>

        {!collapsed && <span className="text-md">{label}</span>}
        {!collapsed && badge !== undefined && badge > 0 && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-black">
            {badge > 99 ? "99+" : badge}
          </span>
        )}

        {collapsed && (
          <div className="absolute left-full ml-6 flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-[10px] uppercase tracking-widest text-cyan-400 opacity-0 transition-all pointer-events-none z-[100] whitespace-nowrap translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0">
            {label}
            {badge !== undefined && badge > 0 && <span>({badge})</span>}
          </div>
        )}
      </Link>
    </li>
  );
}
