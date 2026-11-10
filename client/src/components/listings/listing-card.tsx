"use client";

import Link from "next/link";
import { Clock, ShieldCheck, ArrowRight, Gavel, Tag, Flame } from "lucide-react";
import type { ListingCard as ListingCardData } from "@/lib/api";
import { useLiveAuction } from "@/hooks/use-live-auction";
import { CATEGORY_LABELS, CONDITION_LABELS } from "@/lib/constants";
import { formatLKR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListingImage } from "./listing-image";
import { AuctionCountdown } from "./auction-countdown";

/**
 * Card for one listing from GET /listings or /listings/featured. Auction
 * cards subscribe to live bid events, so the price and bid count move without
 * a reload.
 */
export function ListingCard({ listing }: { listing: ListingCardData }) {
  const auction = useLiveAuction(listing.auction);
  const href = `/listings/${listing.id}`;
  const isAuction = listing.listingType === "AUCTION" && auction !== null;
  const isLive = isAuction && auction.status === "ACTIVE";
  const isSold = listing.status === "SOLD" || auction?.status === "ENDED";
  const price = isAuction ? auction.currentPrice : listing.startingPrice;

  return (
    <div className="group flex flex-col">
      {/* Image */}
      <Link
        href={href}
        className="relative block aspect-square w-full overflow-hidden rounded-md border border-line bg-surface transition-shadow duration-300 group-hover:shadow-[0_10px_28px_-14px_rgba(20,20,20,0.25)]"
      >
        <ListingImage
          src={listing.images[0]?.url}
          alt={listing.title}
          className="h-full w-full object-contain object-center p-5 transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute top-2.5 inset-x-2.5 flex items-center gap-1.5 flex-wrap">
          {listing.isVerified && (
            <Badge variant="gold" className="gap-1">
              <ShieldCheck className="h-3 w-3" /> Expert Verified
            </Badge>
          )}
          {listing.isFeatured && (
            <Badge variant="cyan" className="gap-1">
              <Flame className="h-3 w-3" /> Featured
            </Badge>
          )}
          {isSold && <Badge variant="secondary">Sold</Badge>}
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col pt-3.5">
        <Link href={href}>
          <h3 className="text-[15px] font-medium leading-snug text-ink line-clamp-2 group-hover:underline underline-offset-2 decoration-1">
            {listing.title}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{CATEGORY_LABELS[listing.category]}</span>
          <span aria-hidden>·</span>
          <span className="whitespace-nowrap">{CONDITION_LABELS[listing.condition]}</span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <span className="block text-xs text-muted-foreground">
              {isAuction
                ? auction.bidCount > 0
                  ? "Current High Bid"
                  : "Opening Bid"
                : "Fixed Price"}
            </span>
            <div className="text-lg font-bold tabular-nums text-ink">{formatLKR(price)}</div>
          </div>
          {isAuction && listing.auction?.buyNowPrice && (
            <div className="text-right">
              <span className="block text-xs text-muted-foreground">Buy Now</span>
              <span className="text-sm font-semibold tabular-nums text-ink-soft">
                {formatLKR(listing.auction.buyNowPrice)}
              </span>
            </div>
          )}
        </div>

        {isAuction && (
          <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 font-medium tabular-nums text-live">
              <Clock className="h-3.5 w-3.5" />
              {auction.status === "SCHEDULED" ? (
                "Opens soon"
              ) : auction.status === "ACTIVE" ? (
                <>
                  <AuctionCountdown endTime={auction.endTime} /> left
                </>
              ) : (
                "Auction closed"
              )}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {auction.bidCount} {auction.bidCount === 1 ? "Bid" : "Bids"}
            </span>
          </div>
        )}

        <div className="mt-auto pt-4 space-y-3">
          <Link href={isLive ? `${href}#bid` : href} className="block">
            <Button
              variant={isLive || (!isAuction && !isSold) ? "gold" : "outline"}
              size="sm"
              className="w-full text-xs font-semibold gap-1.5"
            >
              {isLive ? (
                <>
                  <Gavel className="h-3.5 w-3.5" /> Place a Bid
                </>
              ) : !isAuction && !isSold ? (
                <>
                  <Tag className="h-3.5 w-3.5" /> View &amp; Buy
                </>
              ) : (
                <>
                  Inspect Lot <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </Link>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/5">
          <span className="flex items-center gap-1.5 text-zinc-300 truncate">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            {listing.seller.name}
          </span>
          <span className="font-mono">{listing.viewCount} views</span>
        </div>
      </div>
    </div>
  );
}

/** Placeholder card shown while listings load. */
export function ListingCardSkeleton() {
  return (
    <div className="rounded-3xl border border-[rgba(201,162,39,0.12)] bg-[#0d1424]/50 overflow-hidden animate-pulse">
      <div className="h-60 bg-[#111a2b]" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-1/3 rounded bg-[#1a2438]" />
        <div className="h-5 w-4/5 rounded bg-[#1a2438]" />
        <div className="h-8 w-1/2 rounded bg-[#1a2438] mt-6" />
        <div className="h-8 w-full rounded bg-[#1a2438]" />
      </div>
    </div>
  );
}
