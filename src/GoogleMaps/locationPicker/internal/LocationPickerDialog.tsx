import React, { useCallback, useEffect, useState } from "react"
import { SelectedLocation } from "src/components/pages/certificationArea/application/overview/components/LocationPickerButtonTrigger"
import { Dialog } from "@new/Dialog/Dialog"
import { InputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import { InputButtonSecondary } from "@new/InputButton/InputButtonSecondary"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { Size } from "@new/Size"
import { GoogleMap } from "@new/GoogleMaps/Internal/GoogleMap"
import { MapMouseEvent, Marker, useMap } from "@vis.gl/react-google-maps"

export interface LocationData {
  latitude: number
  longitude: number
  street?: string
  city?: string
  zipCode?: string
  region?: string
  country?: string
}

interface LocationPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialLocation: { lat: number; lng: number }
  onLocationSelect: (data: SelectedLocation) => void
  googleMapsApiKey: string
}

export const LocationPickerDialog = ({
  open,
  onOpenChange,
  initialLocation,
  onLocationSelect,
  googleMapsApiKey,
}: LocationPickerDialogProps) => {
  const map = useMap()
  const [markerPosition, setMarkerPosition] = useState(initialLocation)
  const [locationInfo, setLocationInfo] = useState<{
    name?: string
    street?: string
    city?: string
    coordinates: string
  } | null>(null)

  useEffect(() => {
    setMarkerPosition(initialLocation)
  }, [initialLocation])

  const updateLocationInfo = useCallback(
    (position: { lat: number; lng: number }, placeResult?: google.maps.places.PlaceResult) => {
      if (placeResult) {
        const addressComponents = placeResult.address_components || []
        const getComponent = (type: string) => {
          const component = addressComponents.find(c => c.types.includes(type))
          return component?.long_name || ""
        }

        setLocationInfo({
          name: placeResult.name || placeResult.formatted_address,
          street: `${getComponent("route")} ${getComponent("street_number")}`.trim(),
          city: getComponent("locality") || getComponent("postal_town"),
          coordinates: `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`,
        })
      } else {
        // Reverse geocode
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const addressComponents = results[0].address_components
            const getComponent = (type: string) => {
              const component = addressComponents.find(c => c.types.includes(type))
              return component?.long_name || ""
            }

            setLocationInfo({
              name: results[0].formatted_address,
              street: `${getComponent("route")} ${getComponent("street_number")}`.trim(),
              city: getComponent("locality") || getComponent("postal_town"),
              coordinates: `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`,
            })
          }
        })
      }
    },
    [],
  )

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (e.detail?.latLng) {
        const newPosition = {
          lat: e.detail.latLng.lat,
          lng: e.detail.latLng.lng,
        }
        setMarkerPosition(newPosition)
        updateLocationInfo(newPosition)
      }
    },
    [updateLocationInfo],
  )

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPosition = {
          lat: typeof e.latLng.lat === "function" ? (e.latLng.lat() as number) : (e.latLng.lat as number),
          lng: typeof e.latLng.lng === "function" ? (e.latLng.lng() as number) : (e.latLng.lng as number),
        }
        setMarkerPosition(newPosition)
        updateLocationInfo(newPosition)
      }
    },
    [updateLocationInfo],
  )

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      if (place?.geometry?.location) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        setMarkerPosition(newPosition)
        map?.setCenter(newPosition)
        updateLocationInfo(newPosition, place)
        // toast.success("Location set from address search")
      }
    },
    [map, updateLocationInfo],
  )

  const handleConfirm = useCallback(async () => {
    if (window.google && window.google.maps) {
      const geocoder = new google.maps.Geocoder()
      const latlng = { lat: markerPosition.lat, lng: markerPosition.lng }

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const addressComponents = results[0].address_components
          const getComponent = (type: string) => {
            const component = addressComponents.find(c => c.types.includes(type))
            return component?.long_name || ""
          }

          const locationData: LocationData = {
            latitude: markerPosition.lat,
            longitude: markerPosition.lng,
            street: `${getComponent("route")} ${getComponent("street_number")}`.trim(),
            city: getComponent("locality") || getComponent("postal_town"),
            zipCode: getComponent("postal_code"),
            region: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
          }

          onLocationSelect(locationData)
          onOpenChange(false)
          // toast.success("Location confirmed!")
        } else {
          onLocationSelect({
            latitude: markerPosition.lat,
            longitude: markerPosition.lng,
          })
          onOpenChange(false)
          // toast.success("Location confirmed!")
        }
      })
    } else {
      onLocationSelect({
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
      })
      onOpenChange(false)
      // toast.success("Location confirmed!")
    }
  }, [markerPosition, onLocationSelect, onOpenChange])

  if (!googleMapsApiKey) {
    console.error("Google Maps API key is required to display the map.")
    return null
  }

  return (
    <Dialog
      size={Size.Medium}
      open={open}
      onOpenChange={onOpenChange}
      buttonPrimary={
        <InputButtonPrimary width={"auto"} label={"Confirm Location"} size={"large"} onClick={handleConfirm} />
      }
      buttonSecondary={
        <InputButtonSecondary width={"auto"} label={"Cancel"} size={"large"} onClick={() => onOpenChange(false)} />
      }
      title={
        <Text fill={[Color.Neutral, 700]} medium wrap>
          <b>Set Location</b>
        </Text>
      }
      content={
        <>
          <div className="space-y-4 p-4 gap-2">
            <div className="rounded-lg overflow-hidden h-[500px]">
              <GoogleMap
                entries={{
                  type: "FeatureCollection",
                  features: [],
                }}
                googlePlacesApiKey={googleMapsApiKey}
                defaultCenter={{
                  lat: initialLocation.lat,
                  lng: initialLocation.lng,
                }}
                onClick={handleMapClick}
                onPlaceSelect={handlePlaceSelect}
                streetViewControl={false}
                cameraControl={false}
                mapTypeControl={false}
              >
                <Marker position={markerPosition} draggable onDragEnd={handleMarkerDragEnd} />
              </GoogleMap>
            </div>
            {locationInfo && (
              <div className="p-4 rounded border border-neutral-100 bg-card space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    {locationInfo.name && <p className="font-medium text-sm">{locationInfo.name}</p>}
                    {locationInfo.street && (
                      <p className="text-sm text-muted-foreground">
                        {locationInfo.street}
                        {locationInfo.city && `, ${locationInfo.city}`}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono">{locationInfo.coordinates}</p>
                  </div>
                </div>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Search for an address, click on the map, or drag the marker to set your location.
            </p>
          </div>
        </>
      }
    />
  )
}
