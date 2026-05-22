"use client";

import type { PublicRegion } from "@/lib/deployments/publicTree";
import { cn } from "@/components/ui/cn";

export function RegionFilterTabs({
  regions,
  selectedRegionId,
  onSelectRegionId,
  className,
}: {
  regions: PublicRegion[];
  selectedRegionId: string | null;
  onSelectRegionId: (regionId: string | null) => void;
  className?: string;
}) {
  const pill = (active: boolean) =>
    cn(
      "shrink-0 rounded-[var(--keyra-radius-md)] border px-2.5 py-1.5 text-[11px] font-medium leading-none transition focus-visible:outline-none focus-visible:keyra-focus",
      active
        ? "border-black/20 bg-keyra-primary text-white shadow-sm"
        : "border-keyra-border bg-keyra-bg text-keyra-text-2 hover:border-black/15 hover:text-keyra-primary",
    );

  return (
    <div
      className={cn("flex w-full flex-wrap gap-1.5", className)}
      role="tablist"
      aria-label="Filter deployment map by region"
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedRegionId === null}
        className={pill(selectedRegionId === null)}
        onClick={() => onSelectRegionId(null)}
      >
        All regions
      </button>
      {regions.map((region) => {
        const active = selectedRegionId === region.id;
        return (
          <button
            key={region.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={pill(active)}
            onClick={() => onSelectRegionId(active ? null : region.id)}
          >
            {region.name}
          </button>
        );
      })}
    </div>
  );
}
