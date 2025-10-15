import React, { useCallback } from "react"
import Supercluster, { ClusterProperties } from "supercluster"
import { FeaturesClusterMarker } from "./FeaturesClusterMarker"
import { FeatureMarker } from "./FeatureMarker"
import { useSupercluster } from "../hooks/useMapboxSupercluster"
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson"
import { MapMarkerTooltipProperties } from "../GoogleMap"

type ClusteredMarkersProps = {
  disallowClustering: boolean
  geojson: FeatureCollection<Point>
  setInfoWindowData: (
    data: {
      anchor: google.maps.marker.AdvancedMarkerElement
      features: Feature<Point>[]
    } | null,
  ) => void
}

//These numbers are taken from the examples in this project:
//https://github.com/visgl/react-google-maps
const superclusterOptions: Supercluster.Options<GeoJsonProperties, ClusterProperties> = {
  extent: 256,
  radius: 80,
  maxZoom: 12,
  minPoints: null,
}

export const ClusteredMarkers = ({ geojson, disallowClustering, setInfoWindowData }: ClusteredMarkersProps) => {
  if (disallowClustering) {
    superclusterOptions["minPoints"] = Number.MAX_VALUE
  } else {
    superclusterOptions["minPoints"] = null
  }
  const { clusters } = useSupercluster(geojson, superclusterOptions)

  const handleMarkerClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, featureId: string) => {
      const feature = clusters.find(feat => feat.id === featureId) as Feature<Point>

      setInfoWindowData({ anchor: marker, features: [feature] })
    },
    [clusters, setInfoWindowData],
  )

  return (
    <>
      {clusters.map(feature => {
        const [lng, lat] = feature.geometry.coordinates

        const markerProperties = feature.properties as MapMarkerTooltipProperties
        const clusterProperties = feature.properties as ClusterProperties
        const isCluster: boolean = clusterProperties.cluster

        return isCluster ? (
          <FeaturesClusterMarker
            key={feature.id}
            position={{ lat, lng }}
            size={clusterProperties.point_count}
            sizeAsText={String(clusterProperties.point_count)}
          />
        ) : (
          <FeatureMarker
            key={feature.id}
            featureId={feature.id as string}
            position={{ lat, lng }}
            onMarkerClick={handleMarkerClick}
            properties={markerProperties}
          />
        )
      })}
    </>
  )
}
