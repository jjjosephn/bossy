export interface MapboxSuggestion {
   name: string
   name_preferred?: string
   mapbox_id: string
   feature_type: string
   address?: string
   full_address?: string
   place_formatted?: string
   maki?: string
   poi_category?: string[]
   distance?: number
   context?: {
     country?: {
       name: string
       country_code: string
     }
     region?: {
       name: string
       region_code: string
     }
     place?: {
       name: string
     }
   }
 }
 
 export interface MapboxResponse {
   suggestions: MapboxSuggestion[]
   attribution: string
   response_id: string
 }
 
export interface MapboxRetrieveResponse {
  features: Array<{
    id: string
    type: string
    place_type: string[]
    properties: {
      name: string
      mapbox_id: string
      feature_type: string
      address?: string
      coordinates?: {
        latitude: number
        longitude: number
      }
    }
    geometry: {
      type: string
      coordinates: [number, number]
    }
    center: [number, number]
  }>
}

 export interface Company {
   mapboxId: string
   name: string
   industry?: string
   fullAddress: string
 }
 
 export type SearchStep = "company" | "custom-search" | "manager"
 
 