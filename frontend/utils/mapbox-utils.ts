"use client";

import { useEffect, useRef, useState } from "react";
import type { MapboxSuggestion } from "@/utils/search-types";
import { useLazyGetMapboxUtilsDataQuery } from "@/app/state/api";

interface UseMapboxSearchProps {
  query: string;
  proximity: string | null;
  customLocation: string | null;
  searchType?: string;
  enabled: boolean;
  limit?: number;
}

export function useMapboxSearch({
  query,
  proximity,
  customLocation,
  searchType = "poi,address",
  enabled,
  limit = 10,
}: UseMapboxSearchProps) {
  const [results, setResults] = useState<MapboxSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const sessionToken = useRef(
    `${Math.random().toString(36).substring(2)}-${Date.now()}`
  );

  const [triggerFetch, { data, isFetching }] = useLazyGetMapboxUtilsDataQuery();

  useEffect(() => {
    if (query.trim().length === 0 || !enabled) {
      setResults([]);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      triggerFetch({
        query,
        proximity: proximity || "",
        customLocation,
        searchType,
        enabled,
        limit: limit.toString(),
      });
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query, proximity, customLocation, searchType, enabled, limit]);

  useEffect(() => {
    if (data?.suggestions) {
      setResults(data.suggestions);
      setOpen(true);
    }
  }, [data]);

  return {
    results,
    loading: isFetching,
    open,
    setOpen,
    sessionToken: sessionToken.current,
  };
}
