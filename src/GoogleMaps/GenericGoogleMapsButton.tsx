import React, { ReactNode, useState } from "react"
import { LocationPickerDialog } from "@new/GoogleMaps/Internal/LocationPickerDialog"

export type InitialLocation = {
  latitude: number
  longitude: number
}

export type SelectedLocation = {
  latitude: number | null
  longitude: number | null
  street: string
  city: string
  zipCode: string
  region: string
  country: string
}

const GenericGoogleMapsButton = ({
  children,
  initialLocation,
  onLocationSelected,
}: {
  children: ReactNode
  initialLocation: InitialLocation
  onLocationSelected: (location: SelectedLocation) => void
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const handleLocationSelect = (selectedLocation: SelectedLocation) => {
    if (onLocationSelected) {
      onLocationSelected(selectedLocation)
    }
  }

  return (
    <>
      <div className={"tw"} onClick={() => setShowLocationPicker(true)}>
        {children}
      </div>
      <LocationPickerDialog
        open={showLocationPicker}
        onOpenChange={setShowLocationPicker}
        initialLocation={{
          lat: initialLocation.latitude,
          lng: initialLocation.longitude,
        }}
        onLocationSelect={handleLocationSelect}
      />
    </>
  )
}

export default GenericGoogleMapsButton
