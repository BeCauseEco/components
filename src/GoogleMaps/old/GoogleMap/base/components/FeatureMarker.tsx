import React, { useCallback } from "react"
import { AdvancedMarker, AdvancedMarkerAnchorPoint, useAdvancedMarkerRef } from "@vis.gl/react-google-maps"
import styled from "@emotion/styled"
import { Icon } from "@new/Icon/Icon"
import { Color, computeColor } from "@new/Color"
import { keyframes } from "@emotion/react"
import { MapMarkerTooltipProperties } from "../GoogleMap"
import { Text } from "@new/Text/Text"

const appearAnimation = keyframes`
    from {
        opacity: 0.5;
        scale: 0.8;
    }
    80% {
        scale: 1.05;
    }
    to {
        opacity: 1;
        scale: 1;
    }
`

const IconContainer = styled.div`
  background-color: ${computeColor([Color.Primary, 700])};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  flex-grow: 1;
`

const MarkerContentContainer = styled.div`
  background-color: white;
  border-radius: 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  border: 1px solid white;

  filter: drop-shadow(rgba(0, 0, 0, 0.7) 2px 4px 12px);

  width: 100%;
  height: 100%;

  animation: ${appearAnimation} 300ms both;
`

type TreeMarkerProps = {
  position: google.maps.LatLngLiteral
  featureId: string
  onMarkerClick?: (marker: google.maps.marker.AdvancedMarkerElement, featureId: string) => void
  properties: MapMarkerTooltipProperties
}

export const FeatureMarker = ({ position, featureId, onMarkerClick, properties }: TreeMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef()
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, featureId),
    [onMarkerClick, marker, featureId],
  )

  const markerColor = properties?.entryColor ?? [Color.White, 700]

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      onClick={handleClick}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      className={"marker feature"}
      style={{ width: 40, height: 40 }}
    >
      <MarkerContentContainer>
        <IconContainer>
          <Icon name={"home"} fill={markerColor} medium />
        </IconContainer>
        {properties?.entryText ? (
          <>
            <Text fill={[Color.Neutral, 500]} xsmall>
              {properties?.entryText}
            </Text>
          </>
        ) : null}
      </MarkerContentContainer>
    </AdvancedMarker>
  )
}
