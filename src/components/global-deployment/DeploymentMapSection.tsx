"use client";

import { GlobalDeploymentMap } from "@/components/global-deployment/GlobalDeploymentMap";
import { RegionFilterTabs } from "@/components/global-deployment/RegionFilterTabs";
import { DeploymentMapScreenReaderAnnex } from "@/components/global-deployment/DeploymentMapScreenReaderAnnex";
import type { UseDeploymentMapDataReturn } from "@/components/global-deployment/useDeploymentMapData";

export function DeploymentMapSection({
  mapData,
  selectedRegionId,
  onSelectRegionId,
  onCountryInspect,
  inspectCountryId,
}: {
  mapData: UseDeploymentMapDataReturn;
  selectedRegionId: string | null;
  onSelectRegionId: (regionId: string | null) => void;
  onCountryInspect: (countryId: string | null) => void;
  inspectCountryId: string | null;
}) {
  const nodeCount = mapData.visibleNodes.length;

  return (
    <section className="keyra-card overflow-hidden rounded-[var(--keyra-radius-xl)] border border-keyra-border bg-keyra-bg shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.04)]">
      <div className="border-b border-keyra-border bg-keyra-surface/50 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-keyra-primary sm:text-xl">Deployment map</h2>
            <p className="mt-1 text-[13px] text-keyra-text-2">
              {nodeCount} admin market{nodeCount === 1 ? "" : "s"} · hover nodes · scroll to zoom · drag to pan
            </p>
          </div>
          <RegionFilterTabs
            regions={mapData.tree.regions}
            selectedRegionId={selectedRegionId}
            onSelectRegionId={onSelectRegionId}
          />
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <GlobalDeploymentMap
          embedded
          mapData={mapData}
          selectedRegionId={selectedRegionId}
          onCountryInspect={onCountryInspect}
          inspectCountryId={inspectCountryId}
        />
      </div>

      <DeploymentMapScreenReaderAnnex
        visibleNodes={mapData.visibleNodes}
        selectedRegionId={selectedRegionId}
        selectedRegionName={mapData.selectedRegion?.name ?? null}
        onInspectCountry={onCountryInspect}
      />
    </section>
  );
}
