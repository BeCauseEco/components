import { Stack } from "@new/Stack/Stack"
import styled from "@emotion/styled"
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson"
import { GoogleMap, MapMarkerTooltipProperties } from "../base/GoogleMap"
import { TableMembersProfileModel } from "../../../api/groups/models/GetTableMembersForGroupResponse"
import { SITE_LINKS } from "../../routing/routes"
import { beDateToUtcDate } from "src/utils/dateUtilities"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { Spacer } from "@new/Stack/Spacer"

const MapsContainer = styled.div<{ minHeight?: string }>`
  min-height: ${({ minHeight }) => minHeight || "30vh"};
  }
`

export interface GenericGoogleMapProps {
  entries: TableMembersProfileModel[]
  excludeInvalidCertificationHolders: boolean
  isLoading: boolean
  minHeight?: string
  disallowClustering?: boolean
  defaultCenter?: google.maps.LatLngLiteral
  defaultZoomLevel?: number
}

const prepareMapEntries = (
  entries: TableMembersProfileModel[],
  excludeInvalidCertificationHolders: boolean,
): Feature<Point, GeoJsonProperties>[] => {
  const mappedEntries: Feature<Point, GeoJsonProperties>[] =
    entries
      ?.filter(
        profile =>
          profile.primaryCompanyLocation?.latitude &&
          profile.primaryCompanyLocation?.longitude &&
          (!excludeInvalidCertificationHolders ||
            profile.standardHolders.some(
              h => h.validationState === "Valid" && beDateToUtcDate(h.expirationDateTimeUtc) > new Date(),
            )),
      )
      .map(x => {
        const properties: MapMarkerTooltipProperties = {
          name: x.name,
          href: SITE_LINKS.GROUPS.MEMBERS.MEMBER(x.id),
          extraContent: {},
        }

        return {
          type: "Feature",
          id: x.id,
          geometry: {
            type: "Point",
            coordinates: [x.primaryCompanyLocation.longitude!, x.primaryCompanyLocation.latitude!],
          },

          properties: properties,
        }
      }) ?? []
  return mappedEntries
}

export const GroupMembersMap = ({
  defaultZoomLevel,
  defaultCenter,
  entries,
  excludeInvalidCertificationHolders,
  isLoading,
  minHeight,
  disallowClustering,
}: GenericGoogleMapProps) => {
  const entriesAsPoints: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: prepareMapEntries(entries, excludeInvalidCertificationHolders),
  }

  const inputCount = entries?.length ?? 0
  const filteredCount = entriesAsPoints?.features?.length ?? 0
  const anyFilteredEntries = inputCount > filteredCount
  const disclaimer = excludeInvalidCertificationHolders
    ? "with valid coordinates and certification status."
    : "with valid coordinates."

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
      <Spacer xsmall />
      {!isLoading && anyFilteredEntries ? (
        <Text fill={[Color.Neutral, 400]}>{`The map shows ${filteredCount} establishments ${disclaimer} `}</Text>
      ) : (
        <></>
      )}
    </Stack>
  )
}
