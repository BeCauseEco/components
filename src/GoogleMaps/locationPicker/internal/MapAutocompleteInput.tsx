import { useState, useRef, useEffect, forwardRef } from "react"
import { MapPin } from "lucide-react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const Input = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void
}

export const MapAutocompleteInput = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const places = useMapsLibrary("places")

  useEffect(() => {
    if (!places || !inputRef.current) {
      return
    }

    const options = {
      fields: ["geometry", "name", "formatted_address", "address_components"],
    }

    const autocomplete = new places.Autocomplete(inputRef.current, options)

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place) {
        onPlaceSelect(place)
      }
    })
  }, [places, onPlaceSelect])

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10000000000" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search for an address..."
        className="pl-10 z-1000000000"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
    </div>
  )
}
