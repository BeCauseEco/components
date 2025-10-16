import React, { ReactNode, useState } from "react"
import { LocationPickerDialog } from "@new/GoogleMaps/locationPicker/internal/LocationPickerDialog"
import { InputButtonPrimary } from "@new/InputButton/InputButtonPrimary"

export type InitialLocation = {
  latitude: number
  longitude: number
}

export type SelectedLocation = {
  name?: string
  street?: string
  city?: string
  latitude?: number | null
  longitude?: number | null
}

const LocationPickerButtonTrigger = ({
  initialLocation,
  onLocationSelected,
  googleMapsApiKey,
}: {
  initialLocation: InitialLocation
  onLocationSelected: (location: SelectedLocation) => void
  googleMapsApiKey: string
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const handleLocationSelect = (selectedLocation: SelectedLocation) => {
    if (onLocationSelected) {
      onLocationSelected(selectedLocation)
    }
  }

  return (
    <div>
      <InputButtonPrimary
        label={"Pick location"}
        onClick={() => setShowLocationPicker(true)}
        size={"large"}
        width={"auto"}
      />
      <LocationPickerDialog
        open={showLocationPicker}
        onOpenChange={setShowLocationPicker}
        initialLocation={{
          lat: initialLocation.latitude,
          lng: initialLocation.longitude,
        }}
        onLocationSelect={handleLocationSelect}
        googleMapsApiKey={googleMapsApiKey}
      />
    </div>
  )
}

export default LocationPickerButtonTrigger
