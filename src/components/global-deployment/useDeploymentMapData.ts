"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PublicDeploymentTree } from "@/lib/deployments/publicTree";
import { filterPublicTree } from "@/lib/deployments/publicTree";
import {
  clusterNodes,
  flattenPublishedCountries,
} from "@/lib/deployments/deployment-map-utils";

const POLL_MS = 90_000;

export function useDeploymentMapData({
  initialTree,
  selectedRegionId,
  enablePolling = true,
}: {
  initialTree: PublicDeploymentTree;
  selectedRegionId: string | null;
  /** Refetch admin registry for near-live updates without full navigation. */
  enablePolling?: boolean;
}) {
  const [tree, setTree] = useState(initialTree);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setTree(initialTree);
  }, [initialTree]);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/public/admin-registry", { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as PublicDeploymentTree;
      setTree(json);
    } catch {
      /* keep last good tree */
    }
  }, []);

  useEffect(() => {
    if (!enablePolling) return;
    void refetch();
    const id = window.setInterval(() => void refetch(), POLL_MS);
    return () => window.clearInterval(id);
  }, [enablePolling, refetch]);

  const allNodes = useMemo(() => flattenPublishedCountries(tree.regions), [tree.regions]);

  const selectedRegion = useMemo(
    () => (selectedRegionId ? tree.regions.find((r) => r.id === selectedRegionId) ?? null : null),
    [tree.regions, selectedRegionId],
  );

  const dimmedIsoKeys = useMemo(() => {
    if (!selectedRegionId) return null as Set<string> | null;
    const allowed = new Set<string>();
    for (const r of tree.regions) {
      if (r.id !== selectedRegionId) continue;
      for (const c of r.countries) allowed.add(c.iso2.trim().toUpperCase());
    }
    return allowed;
  }, [tree.regions, selectedRegionId]);

  const visibleNodes = useMemo(() => {
    if (!selectedRegionId) return allNodes;
    return allNodes.filter((n) => n.regionId === selectedRegionId);
  }, [allNodes, selectedRegionId]);

  const clustered = useMemo(() => clusterNodes(visibleNodes, zoom), [visibleNodes, zoom]);

  const filteredTree = useMemo(
    () => filterPublicTree(tree, { regionId: selectedRegionId ?? undefined }),
    [tree, selectedRegionId],
  );

  return {
    tree,
    filteredTree,
    clusteredNodes: clustered,
    allNodes,
    visibleNodes,
    dimmedIsoKeys,
    selectedRegion,
    refetch,
    zoom,
    setZoom,
  };
}

export type UseDeploymentMapDataReturn = ReturnType<typeof useDeploymentMapData>;
