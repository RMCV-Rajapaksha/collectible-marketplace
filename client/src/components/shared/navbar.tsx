"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Search, Menu, X, Coins, User, ArrowRight, LogOut } from "lucide-react";

const ROLE_LABELS = {
  BUYER: "Collector",
  SELLER: "Consignor",
  APPRAISER: "Appraiser",
  ADMIN: "Administrator",
} as const;

export function Navbar() {
  const router = useRouter();
  const { user, status, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [signingOut, setSigningOut] = React.useState(false);

  // Keyword search across title, description, era and denomination (GET /listings?q=).
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setMobileMenuOpen(false);
    router.push(q ? `/listings?q=${encodeURIComponent(q)}` : "/listings");
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      setMobileMenuOpen(false);
      router.refresh();
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled
          ? "shadow-[0_1px_0_0_var(--border),0_8px_24px_-16px_rgba(20,20,20,0.25)]"
          : "shadow-[0_1px_0_0_var(--border)]"
      }`}
    >
      {/* Top utility bar */}
      <div className="hidden sm:block bg-ink text-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-center gap-2 text-[11px] tracking-wide">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-live" />
          <span className="font-semibold text-white">Colombo Floor Bourse:</span>
          <span>Over රු 42.5M authenticated this cycle • SLNS &amp; PCGS Dual-Certified</span>
          <span className="text-white/30 hidden md:inline">|</span>
          <span className="hidden md:inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-white/70" /> 100% Central Bank Compliant Escrow
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-[72px]">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="h-10 w-10 rounded-full border border-ink flex items-center justify-center">
              <Coins className="h-5 w-5 text-ink group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[22px] font-semibold tracking-tight text-ink font-serif">
                {SITE_NAME}
              </span>
              <span className="mt-1 text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                Sri Lanka Rare Collectibles
              </span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={submitSearch} role="search" className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search listings"
                placeholder="Search Kahavanu, 1957 Crown, VOC..."
                className="w-full h-11 bg-surface text-sm text-ink placeholder:text-[#9a968d] rounded-full pl-10 pr-24 border border-transparent focus:outline-none focus:bg-white focus:border-ink transition-colors"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 rounded-full bg-ink text-white text-xs font-semibold hover:bg-[#2b2b2b] transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Auth Actions */}
          <div className="hidden sm:flex items-center gap-2 min-w-[160px] justify-end shrink-0">
            {status === "authenticated" && user ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-surface border border-line flex items-center justify-center text-ink">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden lg:flex flex-col leading-tight">
                    <span className="text-[13px] font-semibold text-ink max-w-[140px] truncate">{user.name}</span>
                    <span className="text-[11px] text-muted-foreground">{ROLE_LABELS[user.role]}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  isLoading={signingOut}
                  onClick={handleSignOut}
                  className="gap-1.5"
                >
                  {!signingOut && <LogOut className="h-3.5 w-3.5" />}
                  Sign Out
                </Button>
              </>
            ) : status === "guest" ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider text-zinc-300">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="gold" size="sm" className="text-xs uppercase tracking-wider gap-1.5 shadow-md">
                    <span>Join Bourse</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="h-8 w-36 rounded-lg bg-white/5 animate-pulse" aria-hidden />
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0a0e17]/98 backdrop-blur-2xl border-b border-[rgba(201,162,39,0.2)] px-5 pt-4 pb-6 space-y-4">
          <form onSubmit={submitSearch} role="search" className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search listings"
              placeholder="Search Kahavanu, Ceylon notes, stamps..."
              className="w-full bg-[#0d1524] text-sm text-zinc-200 placeholder:text-zinc-500 rounded-xl pl-10 pr-3 py-2.5 border border-[rgba(201,162,39,0.25)] focus:outline-none"
            />
          </form>
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-zinc-200 hover:text-[#f1d27a] hover:bg-white/5 rounded-lg"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {status === "authenticated" && user ? (
              <>
                <p className="text-sm text-zinc-300 px-1">
                  Signed in as <span className="font-semibold text-white">{user.name}</span>{" "}
                  <span className="text-xs text-[#8fa0be]">({ROLE_LABELS[user.role]})</span>
                </p>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  isLoading={signingOut}
                  onClick={handleSignOut}
                >
                  {!signingOut && <LogOut className="h-4 w-4 mr-2" />} Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    <User className="h-4 w-4 mr-2" /> Collector Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gold" className="w-full justify-center">
                    Register for Bourse <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
