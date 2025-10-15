import { Stack } from "@new/Stack/Stack"
import styled from "@emotion/styled"
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson"
import { GoogleMap, MapMarkerTooltipProperties } from "../base/GoogleMap"
import { DestinationCertificationHolderProfileResponseModel } from "../../../api/statistics/contracts/DestinationCertificationHolderProfileResponseModel"
import { SITE_LINKS } from "../../routing/routes"

const MapsContainer = styled.div<{ minHeight?: string }>`
  min-height: ${({ minHeight }) => minHeight || "30vh"};
  }
`

interface DestinationsOverviewMapProps {
  profiles: DestinationCertificationHolderProfileResponseModel[]
  minHeight?: string
  disallowClustering?: boolean
  defaultCenter?: google.maps.LatLngLiteral
  defaultZoomLevel?: number
}

const prepareMapEntries = (
  profiles: DestinationCertificationHolderProfileResponseModel[],
): Feature<Point, GeoJsonProperties>[] => {
  return profiles
    .filter(profile => profile.latitude && profile.longitude)
    .map(x => {
      const properties: MapMarkerTooltipProperties = {
        name: x.profileName,
        href: SITE_LINKS.COMPANY_PROFILE(x.profileUsername),
        extraContent: {
          ["Certifications"]: x.certificationHolders.map(x => x.certificationName),
        },
      }

      return {
        type: "Feature",
        properties: properties,
        geometry: {
          type: "Point",
          coordinates: [x.longitude!, x.latitude!],
        },
      }
    })
}

export const DestinationsOverviewMap = ({
  defaultZoomLevel,
  defaultCenter,
  profiles,
  minHeight,
  disallowClustering,
}: DestinationsOverviewMapProps) => {
  const entriesAsPoints: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: prepareMapEntries(profiles),
  }

  return (
    <Stack hug cornerRadius={"medium"}>
      <MapsContainer minHeight={minHeight}>
        <GoogleMap
          entries={entriesAsPoints}
          disallowClustering={disallowClustering}
          defaultZoomLevel={defaultZoomLevel}
          defaultCenter={defaultCenter}
        />
      </MapsContainer>
    </Stack>
  )
}
