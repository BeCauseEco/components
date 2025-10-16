import React from "react"
// import { useLoadScript, Marker, Autocomplete } from "@react-google-maps/api"
import { MapPin } from "lucide-react"
// import { toast } from "sonner"
import { SelectedLocation } from "@new/GoogleMaps/locationPicker/LocationPickerButtonTrigger"
import { Dialog } from "@new/Dialog/Dialog"
import { InputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import { InputButtonSecondary } from "@new/InputButton/InputButtonSecondary"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { Size } from "@new/Size"
import { GoogleMap } from "@new/GoogleMaps/Internal/GoogleMap"
import { ControlPosition } from "@vis.gl/react-google-maps/dist/components/map-control"
import { MapAutocompleteInput } from "@new/GoogleMaps/locationPicker/internal/MapAutocompleteInput"
import { MapControl } from "@vis.gl/react-google-maps"

interface LocationPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialLocation: { lat: number; lng: number }
  onLocationSelect: (data: SelectedLocation) => void
  googleMapsApiKey: string
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
}

export const LocationPickerDialog = ({
  open,
  onOpenChange,
  initialLocation,
  onLocationSelect,
  googleMapsApiKey,
}: LocationPickerDialogProps) => {
  // const [markerPosition, setMarkerPosition] = useState(initialLocation)
  // const [mapCenter, setMapCenter] = useState(initialLocation)
  // const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: apiKey,
  //   libraries,
  // })
  //
  // useEffect(() => {
  //   setMarkerPosition(initialLocation)
  //   setMapCenter(initialLocation)
  // }, [initialLocation])
  //
  // const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
  //   if (e.latLng) {
  //     const newPosition = {
  //       lat: e.latLng.lat(),
  //       lng: e.latLng.lng(),
  //     }
  //     setMarkerPosition(newPosition)
  //   }
  // }, [])
  //
  // const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
  //   if (e.latLng) {
  //     const newPosition = {
  //       lat: e.latLng.lat(),
  //       lng: e.latLng.lng(),
  //     }
  //     setMarkerPosition(newPosition)
  //   }
  // }, [])

  // const handlePlaceSelect = useCallback(() => {
  //   const place = autocompleteRef.current?.getPlace()
  //   if (place?.geometry?.location) {
  //     const newPosition = {
  //       lat: place.geometry.location.lat(),
  //       lng: place.geometry.location.lng(),
  //     }
  //     setMarkerPosition(newPosition)
  //     setMapCenter(newPosition)
  //
  //     // Extract address components
  //     const addressComponents = place.address_components || []
  //     const getComponent = (type: string) => {
  //       const component = addressComponents.find(c => c.types.includes(type))
  //       return component?.long_name || ""
  //     }
  //
  //     toast.success("Location set from address search")
  //   }
  // }, [])
  //
  // const handleConfirm = async () => {
  //   // Reverse geocode to get address details
  //   if (window.google && window.google.maps) {
  //     const geocoder = new google.maps.Geocoder()
  //     const latlng = { lat: markerPosition.lat, lng: markerPosition.lng }
  //
  //     geocoder.geocode({ location: latlng }, (results, status) => {
  //       if (status === "OK" && results && results[0]) {
  //         const addressComponents = results[0].address_components
  //         const getComponent = (type: string) => {
  //           const component = addressComponents.find(c => c.types.includes(type))
  //           return component?.long_name || ""
  //         }
  //
  //         const locationData: SelectedLocation = {
  //           latitude: markerPosition.lat,
  //           longitude: markerPosition.lng,
  //           street: `${getComponent("route")} ${getComponent("street_number")}`.trim(),
  //           city: getComponent("locality") || getComponent("postal_town"),
  //           zipCode: getComponent("postal_code"),
  //           region: getComponent("administrative_area_level_1"),
  //           country: getComponent("country"),
  //         }
  //
  //         onLocationSelect(locationData)
  //         onOpenChange(false)
  //         toast.success("Location confirmed!")
  //       } else {
  //         // If geocoding fails, just send coordinates
  //         onLocationSelect({
  //           latitude: markerPosition.lat,
  //           longitude: markerPosition.lng,
  //         })
  //         onOpenChange(false)
  //         toast.success("Location confirmed!")
  //       }
  //     })
  //   } else {
  //     // Fallback if Google Maps is not loaded
  //     onLocationSelect({
  //       latitude: markerPosition.lat,
  //       longitude: markerPosition.lng,
  //     })
  //     onOpenChange(false)
  //     toast.success("Location confirmed!")
  //   }
  // }

  // if (loadError) {
  //   return (
  //     <Dialog open={open} onOpenChange={onOpenChange}>
  //       <DialogContent>
  //         <DialogHeader>
  //           <DialogTitle>Error Loading Map</DialogTitle>
  //         </DialogHeader>
  //         <p className="text-sm text-destructive">Failed to load Google Maps. Please try again.</p>
  //       </DialogContent>
  //     </Dialog>
  //   )
  // }
  //
  // if (!isLoaded) {
  //   return (
  //     <Dialog open={open} onOpenChange={onOpenChange}>
  //       <DialogContent>
  //         <div className="flex items-center justify-center py-12">
  //           <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //         </div>
  //       </DialogContent>
  //     </Dialog>
  //   )
  // }

  if (!googleMapsApiKey) {
    console.error("Google Maps API key is required to display the map.")
    return null
  }

  return (
    <Dialog
      size={Size.Medium}
      open={open}
      onOpenChange={onOpenChange}
      buttonPrimary={<InputButtonPrimary width={"auto"} label={"Confirm Location"} size={"large"} />}
      buttonSecondary={
        <InputButtonSecondary width={"auto"} label={"Cancel"} size={"large"} onClick={() => onOpenChange(false)} />
      }
      title={
        <Text fill={[Color.Neutral, 700]} medium wrap>
          <b>Set Location</b>
        </Text>
      }
      content={
        <div className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            {/*<Autocomplete*/}
            {/*  onLoad={autocomplete => {*/}
            {/*    autocompleteRef.current = autocomplete*/}
            {/*  }}*/}
            {/*  onPlaceChanged={handlePlaceSelect}*/}
            {/*>*/}
            {/*  <InputTextSingle type="text" placeholder="Search for an address..." className="pl-10" />*/}
            {/*</Autocomplete>*/}
          </div>
          <div className="rounded-lg overflow-hidden border border-border h-[500px]">
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
            >
                <MapAutocompleteInput onPlaceSelect={() => {}} />
            </GoogleMap>
          </div>
          <p className="text-sm text-muted-foreground">
            Search for an address, click on the map, or drag the marker to set your location.
          </p>
        </div>
      }
    />
  )
}
