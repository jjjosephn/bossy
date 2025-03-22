"use client"

import { useRef, useState, useEffect } from "react"
import type { MapboxResponse, MapboxSuggestion } from "@/types/search-types"

interface UseMapboxSearchProps {
  query: string
  proximity: string | null
  customLocation: string | null
  searchType?: string
  enabled: boolean
  limit?: number
}

export function useMapboxSearch({
  query,
  proximity,
  customLocation,
  searchType = "poi,address",
  enabled,
  limit = 10,
}: UseMapboxSearchProps) {
  const [results, setResults] = useState<MapboxSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const sessionToken = useRef(`${Math.random().toString(36).substring(2)}-${Date.now()}`)
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (query.trim().length === 0 || !enabled) {
      setResults([])
      return
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(async () => {
      setLoading(true)
      try {
        const encodedSearch = encodeURIComponent(query)
        const response = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=${searchType}&limit=${limit}${
            customLocation || proximity ? `&proximity=${customLocation || proximity}` : ""
          }&session_token=${sessionToken.current}&access_token=${ACCESS_TOKEN}`,
        )

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const data: MapboxResponse = await response.json()
        setResults(data.suggestions)
        setOpen(true)
      } catch (error) {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [query, proximity, customLocation, searchType, enabled, limit])

  return { results, loading, open, setOpen, sessionToken: sessionToken.current }
}

