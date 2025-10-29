import { Stack } from "@new/Stack/Stack"
import styled from "@emotion/styled"
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson"
import { GoogleMap, MapMarkerTooltipProperties } from "@new/GoogleMaps/Internal/GoogleMap"

const MapsContainer = styled.div<{ minHeight?: string }>`
  min-height: ${({ minHeight }) => minHeight || "30vh"};
  }
`

export interface MapEntry {
  id: number | string
  name: string
  lat: number
  lng: number

  properties: MapMarkerTooltipProperties
}

const prepareMapEntries = (entries: MapEntry[]): Feature<Point, GeoJsonProperties>[] => {
  return (
    entries
      ?.filter(profile => profile.lat && profile.lng)
      .map(x => {
        return {
          type: "Feature",
          id: x.id,
          geometry: {
            type: "Point",
            coordinates: [x.lng, x.lat],
          },

          properties: x.properties,
        }
      }) ?? []
  )
}

export interface GenericGoogleMapProps {
  entries: MapEntry[]
  minHeight?: string
  disallowClustering?: boolean
  defaultCenter?: google.maps.LatLngLiteral
  defaultZoomLevel?: number
  apiKey: string
}

export const GenericMap = ({
  defaultZoomLevel,
  defaultCenter,
  entries,
  minHeight,
  disallowClustering,
  apiKey,
}: GenericGoogleMapProps) => {
  const entriesAsPoints: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: prepareMapEntries(entries),
  }

  return (
    <Stack hug cornerRadius={"medium"}>
      <MapsContainer minHeight={minHeight}>
        <GoogleMap
          entries={entriesAsPoints}
          disallowClustering={disallowClustering}
          defaultZoomLevel={defaultZoomLevel}
          defaultCenter={defaultCenter}
          googlePlacesApiKey={apiKey}
        />
      </MapsContainer>
    </Stack>
  )
}
