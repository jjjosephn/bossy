"use client"

import { useEffect, useState } from "react"

export function useLocation() {
  const [userLocation, setUserLocation] = useState<string | null>(null)
  const [locationLoading, setLocationLoading] = useState(true)

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const proximity = `${position.coords.longitude},${position.coords.latitude}`
          setUserLocation(proximity)
          setLocationLoading(false)
        },
        () => {
          // Silently fall back to New York City coordinates without error logging
          setUserLocation("-73.990593,40.740121")
          setLocationLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      )
    } else {
      // Geolocation not available, use default
      setUserLocation("-73.990593,40.740121")
      setLocationLoading(false)
    }
  }, [])

  return { userLocation, locationLoading }
}

