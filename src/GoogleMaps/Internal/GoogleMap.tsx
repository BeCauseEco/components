import React, { useCallback, useState } from "react"
import { APIProvider, Map, InfoWindow, MapMouseEvent } from "@vis.gl/react-google-maps"
import { Feature, FeatureCollection, Point } from "geojson"
import { ColorWithLightness } from "@new/Color"
import { ClusteredMarkers } from "@new/GoogleMaps/Internal/components/ClusteredMarkers"
import { InfoWindowContent } from "@new/GoogleMaps/Internal/components/InfoWindowContent"
import { MapAutocompleteInput } from "@new/GoogleMaps/locationPicker/internal/MapAutocompleteInput"

export interface GenericGoogleMapProps {
  entries: FeatureCollection<Point>
  disallowClustering?: boolean
  defaultCenter?: google.maps.LatLngLiteral
  defaultZoomLevel?: number
  googlePlacesApiKey: string
  children?: React.ReactNode
  onClick?: ((event: MapMouseEvent) => void) | undefined
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void
  streetViewControl?: boolean
}

export interface MapMarkerTooltipProperties {
  name?: string
  href?: string
  entryColor?: ColorWithLightness
  entryText?: string
  extraContent?: Record<string, string[]>
}

//Everything in this file is heavily inspired from
//https://github.com/visgl/react-google-maps/blob/main/examples/custom-marker-clustering/src/app.tsx
export const GoogleMap = ({
  googlePlacesApiKey,
  defaultZoomLevel,
  defaultCenter,
  entries,
  disallowClustering,
  children,
  onClick,
  onPlaceSelect,
  streetViewControl = true,
}: GenericGoogleMapProps) => {
  const [infowindowData, setInfowindowData] = useState<{
    anchor: google.maps.marker.AdvancedMarkerElement
    features: Feature<Point>[]
  } | null>(null)

  const handleInfoWindowClose = useCallback(() => setInfowindowData(null), [setInfowindowData])

  if (!googlePlacesApiKey) {
    return
  }

  return (
    // The "places" library is required for Google Maps Places API features such as autocomplete, place search, and place details.
    // By including libraries={["places"]}, we ensure that both the map and any components using Places functionality (e.g., autocomplete search)
    // can work together on the same page without script conflicts or missing features.
    // Other optional libraries (not needed in this case) include:
    // - "geometry": for advanced math/geospatial operations (e.g. compute distances or areas)
    // - "drawing": enables drawing tools on the map (e.g. circles, polygons, custom shapes)
    // - "visualization": for rendering heatmaps and other complex visual layers
    //
    // Do NOT include extra libraries unless you actually use their features,
    // as each one increases bundle size and can affect performance.
    <APIProvider apiKey={googlePlacesApiKey} libraries={["places"]}>
      {onPlaceSelect && (
        <div className={"mb-4"}>
          <MapAutocompleteInput
            onPlaceSelect={pr => {
              onPlaceSelect(pr)
            }}
          />
        </div>
      )}
      <Map
        streetViewControl={streetViewControl}
        mapId={"992ebfe9-cf01-4f45-b884-2c4eba19f61e"} //Randomly generated. Required for advanced markers. Purpose can be seen here: https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over
        defaultCenter={defaultCenter || { lat: 45.4046987, lng: 12.2472504 }}
        defaultZoom={defaultZoomLevel ?? 3}
        gestureHandling={"greedy"}
        onClick={e => {
          if (onClick) {
            onClick(e)
          } else {
            setInfowindowData(null)
          }
        }}
      >
        <ClusteredMarkers
          geojson={entries}
          disallowClustering={disallowClustering ?? false}
          setInfoWindowData={setInfowindowData}
        />
        {infowindowData && (
          <InfoWindow onCloseClick={handleInfoWindowClose} anchor={infowindowData.anchor}>
            <InfoWindowContent features={infowindowData.features} />
          </InfoWindow>
        )}
        {children}
      </Map>
    </APIProvider>
  )
}
