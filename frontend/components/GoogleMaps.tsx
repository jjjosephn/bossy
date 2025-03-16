'use client'

import React, { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const GoogleMaps = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'quarterly',
        // libraries: ['places'],
      })

      const { Map } = await loader.importLibrary('maps')
      const { Autocomplete } = await loader.importLibrary('places')

      const locationInMap = { lat: 40.712776, lng: -74.005974 }

      const options: google.maps.MapOptions = {
        center: locationInMap,
        zoom: 8,
        mapId: 'NEXT_MAPS_TUTS',
      }

      const map = new Map(mapRef.current as HTMLDivElement, options)

      if (inputRef.current) {
        autocompleteRef.current = new Autocomplete(inputRef.current, {
          fields: ['geometry', 'formatted_address'],
        })

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace()
          if (place?.geometry?.location) {
            map.setCenter(place.geometry.location)
            map.setZoom(12) // Zoom in on the selected location
          }
        })
      }
    }

    initializeMap()
  }, []) // Added empty dependency array to prevent re-initialization

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a place..."
        className="w-full p-2 mb-2 border rounded"
      />
      <div className="h-[600px]" ref={mapRef}>
        GoogleMaps
      </div>
    </div>
  )
}

export default GoogleMaps
