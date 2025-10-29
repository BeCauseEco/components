import React, { useCallback } from "react"
import { AdvancedMarker, AdvancedMarkerAnchorPoint, useAdvancedMarkerRef, useMap } from "@vis.gl/react-google-maps"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { Text } from "@new/Text/Text"
import { Color, computeColor } from "@new/Color"

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

const MarkerContentContainer = styled.div`
  background-color: white;
  border-radius: 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  border: 2px solid white;

  filter: drop-shadow(rgba(0, 0, 0, 0.7) 2px 4px 12px);

  width: 100%;
  height: 100%;

  animation: ${appearAnimation} 300ms both;
`

const TextContainer = styled.div`
  background-color: ${computeColor([Color.Primary, 500])};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`

type TreeClusterMarkerProps = {
  position: google.maps.LatLngLiteral
  size: number
  sizeAsText: string
}

export const FeaturesClusterMarker = ({ position, size, sizeAsText }: TreeClusterMarkerProps) => {
  const [markerRef] = useAdvancedMarkerRef()
  const map = useMap()

  //When a cluster is clicked, a zoom is just triggered...We can always expand this later
  const handleClick = useCallback(() => {
    const currentZoom = map?.getZoom()
    map?.setZoom(currentZoom! + 1)
  }, [map])

  let markerSizeInPx = 20

  // Reduced sizes by ~20% and removed icon size variables since we're removing the icon
  if (size > 1000) {
    markerSizeInPx = 80
  } else if (size > 500) {
    markerSizeInPx = 72
  } else if (size > 250) {
    markerSizeInPx = 64
  } else if (size > 125) {
    markerSizeInPx = 56
  } else if (size > 65) {
    markerSizeInPx = 48
  } else {
    markerSizeInPx = 44
  }

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={size}
      onClick={handleClick}
      className={"marker cluster"}
      style={{ width: markerSizeInPx, height: markerSizeInPx }}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
      <MarkerContentContainer>
        <TextContainer>
          <Text fill={[Color.White, 700]} xsmall>
            {sizeAsText}
          </Text>
        </TextContainer>
      </MarkerContentContainer>
    </AdvancedMarker>
  )
}
