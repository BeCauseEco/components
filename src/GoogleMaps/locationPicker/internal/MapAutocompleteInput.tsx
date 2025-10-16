import { useState, useRef, useEffect, forwardRef, useCallback } from "react"
import { MapPin } from "lucide-react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes with conflict resolution.
 * Uses clsx for conditional class handling and tailwind-merge to resolve conflicting classes.
 *
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with conflicts resolved
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Internal Input component with consistent styling for the autocomplete field.
 * Implements standard input behavior with Tailwind CSS styling and focus states.
 */
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

/**
 * Props for the MapAutocompleteInput component.
 */
interface PlaceAutocompleteProps {
  /**
   * Callback invoked when a place is selected from the autocomplete predictions.
   * Receives a PlaceResult object containing:
   * - geometry: Location coordinates (lat/lng)
   * - name: Place name
   * - formatted_address: Human-readable address
   * - address_components: Structured address parts (street, city, country, etc.)
   *
   * @param place - Selected place with full details from Google Places API
   */
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void
}

/**
 * MapAutocompleteInput provides a location search input with autocomplete predictions from Google Places API.
 *
 * This component implements a fully accessible autocomplete experience with keyboard navigation,
 * loading states, and proper ARIA attributes. It uses Google Places AutocompleteService for predictions
 * and PlacesService for fetching full place details.
 *
 * Key features:
 * - Debounced API calls (300ms) to minimize unnecessary requests
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Click-outside detection to close dropdown
 * - Loading indicator during API requests
 * - Full ARIA accessibility support
 * - Error handling for API failures
 *
 * Requirements:
 * - Must be wrapped in APIProvider from @vis.gl/react-google-maps
 * - Requires valid Google Maps API key with Places API enabled
 * - Google Maps JavaScript API must be loaded
 *
 * @example
 * ```tsx
 * import { APIProvider } from '@vis.gl/react-google-maps';
 * import { MapAutocompleteInput } from './MapAutocompleteInput';
 *
 * function LocationPicker() {
 *   const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
 *     console.log('Selected place:', place.formatted_address);
 *     console.log('Coordinates:', place.geometry?.location?.lat(), place.geometry?.location?.lng());
 *   };
 *
 *   return (
 *     <APIProvider apiKey="YOUR_API_KEY">
 *       <MapAutocompleteInput onPlaceSelect={handlePlaceSelect} />
 *     </APIProvider>
 *   );
 * }
 * ```
 *
 * Error handling:
 * - Gracefully handles ZERO_RESULTS status (no predictions found)
 * - Handles network errors and API failures silently by closing dropdown
 * - Does not throw errors for API failures to prevent UI disruption
 *
 * Limitations:
 * - Prediction accuracy depends on Google Places API coverage
 * - API rate limits may apply based on your Google Cloud project quotas
 * - Place details fetch may fail for certain place IDs
 *
 * @param props - Component props
 * @param props.onPlaceSelect - Callback invoked when a place is selected with full details
 */
export const MapAutocompleteInput = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [inputValue, setInputValue] = useState("")
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const requestIdRef = useRef(0)
  const isMountedRef = useRef(true)

  const places = useMapsLibrary("places")
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)

  /**
   * Initialize Google Places API services when the library is loaded.
   * Creates AutocompleteService for predictions and PlacesService for place details.
   * PlacesService requires a DOM element, so we create a detached div element.
   */
  useEffect(() => {
    if (!places) {
      return
    }

    autocompleteServiceRef.current = new places.AutocompleteService()
    // PlacesService requires a DOM element or map instance
    placesServiceRef.current = new places.PlacesService(document.createElement("div"))

    return () => {
      // Cleanup refs on unmount
      autocompleteServiceRef.current = null
      placesServiceRef.current = null
    }
  }, [places])

  /**
   * Cleanup effect for debounce timer and mounted state tracking.
   * Prevents memory leaks and state updates on unmounted components.
   */
  useEffect(() => {
    return () => {
      // Clear pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      // Mark component as unmounted to prevent async state updates
      isMountedRef.current = false
    }
  }, [])

  /**
   * Close dropdown when clicking outside the component.
   * Listens for mousedown events and checks if the click target is outside
   * both the input field and the dropdown menu.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /**
   * Fetches autocomplete predictions from Google Places API.
   * Requests all types of places (cities, addresses, establishments) for maximum flexibility.
   *
   * Implements race condition prevention by tracking request IDs - only the most recent
   * request's response will update the component state.
   *
   * Handles three status cases:
   * - OK: Displays predictions in dropdown
   * - ZERO_RESULTS: Clears predictions and closes dropdown
   * - Other errors: Silently fails by closing dropdown (network errors, quota exceeded, etc.)
   *
   * @param input - Search query string from user input
   */
  const fetchPredictions = useCallback((input: string) => {
    if (!autocompleteServiceRef.current || !input.trim()) {
      setPredictions([])
      setIsLoading(false)
      return
    }

    // Increment request ID to handle race conditions
    const currentRequestId = ++requestIdRef.current

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input,
        // Request all types of places for maximum flexibility
      },
      (results, status) => {
        // Ignore stale responses from earlier requests
        if (currentRequestId !== requestIdRef.current || !isMountedRef.current) {
          return
        }

        setIsLoading(false)
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results)
          setIsOpen(true)
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setPredictions([])
          setIsOpen(false)
        } else {
          // Handle other statuses (e.g., network errors, quota exceeded, invalid request)
          // Fail silently to avoid disrupting user experience
          console.error(`Places API error: ${status}`)
          setPredictions([])
          setIsOpen(false)
        }
      },
    )
  }, [])

  /**
   * Handles input change with debouncing to minimize API requests.
   * Waits 300ms after user stops typing before fetching predictions.
   *
   * Rationale for 300ms delay:
   * - Balances responsiveness with API efficiency
   * - Reduces API costs by avoiding requests for every keystroke
   * - Allows users to type naturally without lag
   *
   * Edge cases handled:
   * - Empty/whitespace-only input: Clears predictions immediately
   * - Rapid typing: Cancels previous timers to avoid redundant requests
   * - Selected index reset: Prevents stale keyboard selection state
   *
   * @param e - Input change event
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInputValue(value)
      setSelectedIndex(-1)

      // Clear existing timer to avoid redundant API calls
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      if (!value.trim()) {
        setPredictions([])
        setIsOpen(false)
        setIsLoading(false)
        return
      }

      // Set loading state and debounce API call by 300ms
      setIsLoading(true)
      debounceTimerRef.current = setTimeout(() => {
        fetchPredictions(value)
      }, 300)
    },
    [fetchPredictions],
  )

  /**
   * Fetches full place details from Google Places API and invokes the onPlaceSelect callback.
   * Requests specific fields to optimize API usage and costs:
   * - geometry: Latitude/longitude coordinates
   * - name: Place name
   * - formatted_address: Human-readable address string
   * - address_components: Structured address data (street, city, postal code, country, etc.)
   *
   * On success:
   * - Calls onPlaceSelect with complete place details
   * - Updates input with selected place description
   * - Closes dropdown and clears predictions
   *
   * On failure:
   * - Logs error to console for debugging
   * - Silently fails without updating state (maintains current input value)
   *
   * @param placeId - Unique identifier for the place from Google Places API
   * @param description - Display text for the selected place (used to update input)
   */
  const selectPlace = useCallback(
    (placeId: string, description: string) => {
      if (!placesServiceRef.current) {
        console.error("PlacesService not initialized")
        return
      }

      placesServiceRef.current.getDetails(
        {
          placeId,
          fields: ["geometry", "name", "formatted_address", "address_components"],
        },
        (place, status) => {
          // Guard against updates after component unmount
          if (!isMountedRef.current) {
            return
          }

          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            onPlaceSelect(place)
            setInputValue(description)
            setIsOpen(false)
            setPredictions([])
          } else {
            // Log error for debugging while failing silently for users
            console.error(`Place details error: ${status}`)
          }
        },
      )
    },
    [onPlaceSelect],
  )

  /**
   * Handles prediction selection via mouse click.
   * Extracts place_id and description from the prediction and fetches full place details.
   *
   * @param prediction - The autocomplete prediction that was clicked
   */
  const handlePredictionClick = useCallback(
    (prediction: google.maps.places.AutocompletePrediction) => {
      selectPlace(prediction.place_id, prediction.description)
    },
    [selectPlace],
  )

  /**
   * Handles keyboard navigation for accessibility.
   * Implements WCAG-compliant combobox pattern with arrow key navigation.
   *
   * Supported keys:
   * - ArrowDown: Move selection down (wraps to top at end)
   * - ArrowUp: Move selection up (wraps to bottom at start)
   * - Enter: Select currently highlighted prediction (or first if none highlighted)
   * - Escape: Close dropdown and clear selection
   *
   * All keyboard events are prevented from default behavior to ensure
   * proper autocomplete UX without form submission or page scrolling.
   *
   * @param e - Keyboard event from input field
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || predictions.length === 0) {
        return
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex(prev => (prev < predictions.length - 1 ? prev + 1 : 0))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : predictions.length - 1))
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < predictions.length) {
            // Select the highlighted prediction
            const prediction = predictions[selectedIndex]
            selectPlace(prediction.place_id, prediction.description)
          } else if (predictions.length > 0) {
            // If no prediction is highlighted, select the first one
            const prediction = predictions[0]
            selectPlace(prediction.place_id, prediction.description)
          }
          break
        case "Escape":
          e.preventDefault()
          setIsOpen(false)
          setSelectedIndex(-1)
          break
      }
    },
    [isOpen, predictions, selectedIndex, selectPlace],
  )

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search for an address..."
        className="pl-10"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="predictions-list"
        aria-activedescendant={selectedIndex >= 0 ? `prediction-${selectedIndex}` : undefined}
        aria-autocomplete="list"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {/* Predictions dropdown */}
      {isOpen && predictions.length > 0 && (
        <div
          ref={dropdownRef}
          id="predictions-list"
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {predictions.map((prediction, index) => (
            <div
              key={prediction.place_id}
              id={`prediction-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={cn(
                "px-4 py-2 cursor-pointer transition-colors",
                index === selectedIndex ? "bg-gray-100" : "hover:bg-gray-50",
              )}
              onClick={() => handlePredictionClick(prediction)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="text-sm font-medium text-gray-900">{prediction.structured_formatting.main_text}</div>
              <div className="text-xs text-gray-500">{prediction.structured_formatting.secondary_text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
