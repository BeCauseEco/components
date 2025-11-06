import React, { memo } from "react"
import { Feature, Point } from "geojson"
import { Stack } from "@new/Stack/Stack"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { Spacer } from "@new/Stack/Spacer"
import { InputButtonLink } from "@new/InputButton/InputButtonLink"
import { MapMarkerTooltipProperties } from "@new/GoogleMaps/Internal/GoogleMap"

type InfoWindowContentProps = {
  features: Feature<Point>[]
}

export const InfoWindowContent = memo(({ features }: InfoWindowContentProps) => {
  if (features.length === 0) {
    return null
  }

  const f = features[0]
  const tooltipProperties = f.properties! as MapMarkerTooltipProperties
  const { name, href, extraContent } = tooltipProperties

  if (!name) {
    return null
  }

  const extraContentEntries = Object.entries(extraContent || {})

  return (
    <>
      <Stack cornerRadius={"medium"} hug>
        <Text fill={[Color.Neutral, 700]} xsmall wrap>
          {name}
        </Text>
        <Spacer small />

        <>
          {extraContentEntries?.length > 0 ? (
            <Stack hug>
              {extraContentEntries.map(([caption, entries]) => (
                <>
                  <Text fill={[Color.Neutral, 700]} xsmall>
                    <b>{caption}:</b>
                  </Text>
                  <Spacer xsmall />
                  <>
                    {entries.map(entry => (
                      <>
                        <Text fill={[Color.Neutral, 700]} xsmall>
                          {entry}
                        </Text>
                        <Spacer xsmall />
                      </>
                    ))}
                  </>
                </>
              ))}
            </Stack>
          ) : null}
        </>

        <>
          {href ? (
            <InputButtonLink
              size="small"
              href={{
                pathname: href,
              }}
              label="View details"
            />
          ) : null}
        </>
      </Stack>
    </>
  )
})
