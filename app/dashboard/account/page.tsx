"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Globe2,
  Image,
  Link2,
  Sparkles,
  Settings,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/app/redux/store/store";
import DashboardPageHeading from "@/app/components/DashboardPageHeading";
import LoadingScreen from "@/app/components/LoadingScreen";

export default function AccountPage() {
  const user = useSelector((state: RootState) => state.user.user);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);
  const displayName = user?.name?.trim();
  const portfolioUrl =
    displayName && typeof window !== "undefined"
      ? `${window.location.origin}/portfolio/${displayName.toLowerCase().replace(/\s+/g, "-")}`
      : "";

  const handleCopy = async () => {
    if (!portfolioUrl) return;
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      toast.success("Portfolio link copied.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the portfolio link.");
    }
  };

  if (!mounted) {
    return <LoadingScreen className="min-h-full" />;
  }

  if (!user) {
    return (
      <main className="portfolio-background flex min-h-full items-center justify-center px-4 py-12 text-white">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-black/60 p-8 text-center backdrop-blur sm:p-10">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <UserRound size={26} />
          </span>
          <h1 className="text-2xl font-bold">Your account is waiting</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Sign in to view your account details and set up your public portfolio.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-300"
          >
            Sign in
            <ArrowUpRight size={17} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="portfolio-background min-h-full px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 sm:mb-10">
          <DashboardPageHeading icon={UserRound}>Account</DashboardPageHeading>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.8fr)]">
          <section
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur sm:p-8"
            aria-labelledby="portfolio-heading"
          >
            <div className="relative">
              <div className="mb-7">
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <Globe2 size={21} />
                </span>
                <h2 id="portfolio-heading" className="text-xl font-bold sm:text-2xl">
                  Public portfolio
                </h2>
              </div>

              {portfolioUrl ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-3 sm:p-4">
                    <p className="mb-2 text-sm font-bold text-zinc-700">
                      Your portfolio link
                    </p>
                    <div className="flex min-w-0 items-center gap-3">
                      <Link2 size={17} className="shrink-0 text-cyan-400" />
                      <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">
                        {portfolioUrl}
                      </span>
                      <a
                        href={portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open public portfolio"
                        className="shrink-0 rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-cyan-300"
                      >
                        <ExternalLink size={17} />
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-300 sm:w-auto"
                  >
                    {copied ? <Check size={17} /> : <Copy size={17} />}
                    {copied ? "Copied" : "Copy portfolio link"}
                  </button>

                  <div className="mt-8 border-t border-white/10 pt-6">
                    <h3 className="mb-4 text-sm font-semibold text-white">
                      Search preview
                    </h3>
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 sm:p-5">
                      <p className="truncate text-base font-semibold text-cyan-300">
                        Portfolio | {user.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-emerald-300/80">
                        {portfolioUrl}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-5 py-8 text-center">
                  <Sparkles className="mx-auto text-cyan-300" size={24} />
                  <h3 className="mt-3 font-semibold text-white">
                    Your portfolio is not ready yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-400">
                    Add a display name to create your public portfolio link and search preview.
                  </p>
                  <Link
                    href="/dashboard/profile"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-300"
                  >
                    Set up your profile
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-5">
            <section
              className="rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur sm:p-6"
              aria-labelledby="account-details-heading"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-300">
                  <UserRound size={19} />
                </span>
                <div>
                  <h2 id="account-details-heading" className="font-bold">
                    Account details
                  </h2>
                </div>
              </div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-[10px] font-bold text-zinc-500">
                    Display name
                  </dt>
                  <dd className="mt-1 break-words text-sm text-zinc-100">
                    {user?.name || "Not set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-zinc-500">
                    Email address
                  </dt>
                  <dd className="mt-1 break-all text-sm text-zinc-100">
                    {user?.email || "Not available"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-zinc-500">
                    Account type
                  </dt>
                  <dd className="mt-1 text-sm capitalize text-zinc-100">
                    {user?.role || "Artist"}
                  </dd>
                </div>
              </dl>
            </section>

            <Link
              href="/dashboard/profile"
              className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-black/60 p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.06] sm:p-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <Image size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-white">Edit profile</span>
              </span>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-zinc-500 transition group-hover:text-cyan-300"
              />
            </Link>
            <Link
              href="/dashboard/settings"
              className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-black/60 p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.06] sm:p-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <Settings size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-white">Settings</span>
              </span>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-zinc-500 transition group-hover:text-cyan-300"
              />
            </Link>
            <Link
              href="/dashboard/readme"
              className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-black/60 p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.06] sm:p-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <BookOpen size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-white">Read me</span>
                <span className="mt-1 block text-xs text-zinc-400">
                  Learn how to use Artfolio
                </span>
              </span>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-zinc-500 transition group-hover:text-cyan-300"
              />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
