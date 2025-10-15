import React from "react"
import GenericGoogleMapsButton, { SelectedLocation } from "@new/GoogleMaps/GenericGoogleMapsButton"
import { MapPin } from "lucide-react"

const GoogleMapsCoordinatesButton = ({
  latitude,
  longitude,
  onLocationSelected,
}: {
  latitude
  longitude
  onLocationSelected: (location: SelectedLocation) => void
}) => {
  return (
    <GenericGoogleMapsButton initialLocation={{ latitude, longitude }} onLocationSelected={onLocationSelected}>
      <>
        <MapPin className="mr-2 h-4 w-4" />
        {latitude && longitude ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : "Set location on map"}
      </>
    </GenericGoogleMapsButton>
  )
}

export default GoogleMapsCoordinatesButton
