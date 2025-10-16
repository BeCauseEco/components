import React, { useCallback, useMemo, useState } from "react"
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps"
import { InputCombobox } from "@new/InputCombobox/InputCombobox"
import { useAutocompleteSuggestions } from "@new/GoogleMaps/locationPicker/internal/useAutocompleteSuggestions"
import { InputComboboxItem } from "@new/InputCombobox/InputComboboxItem"
import { Color } from "@new/Color"
import { InputButton } from "@new/InputButton/internal/InputButton"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { Spacer } from "@new/Stack/Spacer"
import { Badge } from "@new/Badge/Badge"
import { Text } from "@new/Text/Text"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Autocomplete } from "@new/Autocomplete/Autocomplete"
import { MapPin } from "lucide-react"

const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

interface MapAutocompleteInputProps {
  onPlaceSelect: (place: google.maps.places.Place | null) => void
}

//Most of the code below is sourced from:
//https://github.com/visgl/react-google-maps/blob/main/examples/autocomplete/src/components/autocomplete-custom-hybrid.tsx

export const MapAutocompleteInput = ({ onPlaceSelect }: MapAutocompleteInputProps) => {
  const [inputValue, setInputValue] = useState<string>("")

  const { suggestions, resetSession, isLoading } = useAutocompleteSuggestions(inputValue)

  const handleInputChange = useCallback((value: google.maps.places.PlacePrediction | string) => {
    if (typeof value === "string") {
      setInputValue(value)
    }
  }, [])

  const handleSelect = useCallback(
    (prediction: google.maps.places.PlacePrediction | string) => {
      if (typeof prediction === "string") return

      const place = prediction.toPlace()
      place
        .fetchFields({
          fields: ["viewport", "location", "svgIconMaskURI", "iconBackgroundColor"],
        })
        .then(() => {
          resetSession()
          onPlaceSelect(place)
          setInputValue("")
        })
    },
    [onPlaceSelect],
  )

  const predictions = useMemo(
    () => suggestions.filter(suggestion => suggestion.placePrediction).map(({ placePrediction }) => placePrediction!),
    [suggestions],
  )
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Autocomplete
        onLoad={autocomplete => {
          autocompleteRef.current = autocomplete
        }}
        onPlaceChanged={handlePlaceSelect}
      >
        <Input type="text" placeholder="Search for an address..." className="pl-10" />
      </Autocomplete>
    </div>
  )
}
