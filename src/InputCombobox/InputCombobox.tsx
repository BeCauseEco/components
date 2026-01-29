import React, {
  forwardRef,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { InputComboboxItemProps } from "./InputComboboxItem"
import { Text } from "@new/Text/Text"
import { Color, ColorWithLightness } from "@new/Color"
import { Popover } from "@new/Popover/Popover"
import { InputButton } from "@new/InputButton/internal/InputButton"
import { Spacer } from "@new/Stack/Spacer"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { Align } from "@new/Stack/Align"
import { Container } from "./internal/InputCombobox.styles"
import { debounce } from "./internal/utils"
import { ComboboxLabel } from "./internal/ComboboxLabel"
import { ComboboxTriggerContent } from "./internal/ComboboxTriggerContent"
import { ComboboxItem } from "./internal/ComboboxItem"
import { ComboboxItemList } from "./internal/ComboboxItemList"
import { ComboboxPopoverContent } from "./internal/ComboboxPopoverContent"

export type InputComboboxProps = ComponentBaseProps & {
  size: "small" | "large"
  width: "fixed" | "auto"

  textNoSelection: string

  /** Enables filtering, if supplied. */
  filterOptions?: { textFilterNoResults: string; textFilterPlaceholder: string }

  label?: ["outside" | "outside-small" | "inside", string]
  hint?: string
  error?: string

  multiple?: boolean

  color: Color
  borderColor?: ColorWithLightness

  /**
   * When InputCombobox.multiple is set to true; "value" parameter is of type string[].
   *
   * Otherwise the type is of string */
  value: string | string[]

  onChange: (value: string | string[]) => void

  children: ReactElement<InputComboboxItemProps> | ReactElement<InputComboboxItemProps>[]

  /**
   * Enables the virtuoso list for the combobox. Only use this if you have a large number of items.
   */
  enableVirtuoso?: boolean

  clearable?: boolean
  resettable?: boolean

  disabled?: boolean
  loading?: boolean

  required?: boolean

  /**
   * When true, sorts items alphabetically by label. When items are grouped, groups are also sorted alphabetically.
   */
  sortAlphabetically?: boolean

  /**
   * When provided, displays the combobox trigger as a button with the specified label and optional icon.
   * If undefined, shows the default behavior with selected values.
   */
  button?: {
    label: string
    icon?: string
  }

  tooltip?: string

  /** When true, allows the label text to wrap to multiple lines instead of staying on a single line */
  labelWrap?: boolean

  /**
   * When true, renders the popover dropdown within the component's container instead of at the document root.
   * Can also accept a ref to a specific container element to render the popover within.
   * Use this when the combobox is inside a modal, dialog, or other overlay component to ensure proper stacking context.
   * Default behavior (false) renders the popover at document root for better positioning in most cases.
   */
  renderPopoverInParentContainer?: boolean | HTMLElement
}

export const InputCombobox = forwardRef<HTMLDivElement, PropsWithChildren<InputComboboxProps>>((p, ref) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filteredValues, setFilteredValues] = useState<string[]>([])
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined)
  const [mountedContainer, setMountedContainer] = useState<HTMLDivElement | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // Measure container width when component mounts or size/width props change
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      setContainerWidth(width)
    }
  }, [p.size, p.width])

  // Merge the forwarded ref with our internal ref
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      setMountedContainer(node)

      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref],
  )

  const items: { [key: string]: InputComboboxItemProps } = useMemo(() => {
    const output: { [key: string]: InputComboboxItemProps } = {}

    React.Children.forEach(p.children, child => {
      if (React.isValidElement<InputComboboxItemProps>(child)) {
        // Create unique key combining value and grouping to allow duplicates in different groups
        const uniqueKey = `${child.props.value}__${child.props.groupingLabel || "ungrouped"}`
        output[uniqueKey] = child.props
      }
    })

    return output
  }, [p.children])

  // Derive filtered values: when no search, show all items; otherwise use filteredValues state
  const allItemKeys = useMemo(() => Object.keys(items), [items])
  const effectiveFilteredValues = search === "" ? allItemKeys : filteredValues

  const filteredItems = useMemo(() => {
    const filteredItemIdsSet = new Set(effectiveFilteredValues)

    const itemsList = Object.entries(items)
      .filter(([id]) => filteredItemIdsSet.has(id))
      .map(([, value]) => value)

    // Sort items alphabetically if sortAlphabetically is true
    if (p.sortAlphabetically) {
      return itemsList.sort((a, b) => a.label.localeCompare(b.label))
    }

    return itemsList
  }, [effectiveFilteredValues, items, p.sortAlphabetically])

  //Grouping logic created with claude code
  const groupedItems = useMemo(() => {
    const groups: { [groupName: string]: InputComboboxItemProps[] } = {}
    const dividerItems: InputComboboxItemProps[] = []
    let hasAnyGroupingLabel = false

    filteredItems.forEach(item => {
      if (item.groupingLabel === "-") {
        // Items with dash groupingLabel should be rendered with dividers
        dividerItems.push(item)
      } else {
        const groupName = item.groupingLabel || ""
        if (item.groupingLabel) {
          hasAnyGroupingLabel = true
        }

        if (!groups[groupName]) {
          groups[groupName] = []
        }
        groups[groupName].push(item)
      }
    })

    // If no grouping labels exist, return null to use flat rendering
    if (!hasAnyGroupingLabel && dividerItems.length === 0) {
      return null
    }

    // If grouping labels exist, rename the empty group to "Other"
    if (groups[""]) {
      groups["Other"] = groups[""]
      delete groups[""]
    }

    // Sort items within each group alphabetically if sortAlphabetically is true
    if (p.sortAlphabetically) {
      Object.keys(groups).forEach(groupName => {
        groups[groupName].sort((a, b) => a.label.localeCompare(b.label))
      })

      dividerItems.sort((a, b) => a.label.localeCompare(b.label))
    }

    return { groups, dividerItems }
  }, [filteredItems, p.sortAlphabetically])

  const onSelectSingle = (label: string) => {
    setOpen(false)

    const item = Object.values(items).findLast(item => item.label?.trim() === label?.trim())

    if (item) {
      p.onChange(item.value)
    }
  }

  const onSelectMultiple = (selectedItemId: string, newValue: boolean) => {
    const currentValue = p.value as string[]
    const selectedItemsIds = newValue
      ? [...currentValue, selectedItemId]
      : currentValue.filter(item => item !== selectedItemId)

    p.onChange(selectedItemsIds)
  }

  const handleRemoveItem = (label: string) => {
    const item = Object.values(items).findLast(item => item.label.toLowerCase() === label.toLowerCase())

    if (!item) {
      return
    }

    const updatedItems = (p.value as string[]).filter(id => id !== item.value)

    p.onChange(updatedItems)
  }

  const filterResults = useCallback(
    (value: string) => {
      // When value is empty, effectiveFilteredValues will use allItemKeys directly
      // so we only need to compute filtered results for non-empty searches
      if (value === "") {
        return
      }

      const searchTerm = value.toLowerCase()
      const itemsFiltered = Object.entries(items).filter(([, item]) => {
        const labelMatch = item.label.toLowerCase().includes(searchTerm)
        const sublabelMatch = item.sublabel?.toLowerCase().includes(searchTerm) ?? false
        return labelMatch || sublabelMatch
      })

      setFilteredValues(itemsFiltered.map(([key]) => key))
    },
    [items],
  )

  const filterWithDebounce = useMemo(() => debounce(filterResults, 300), [filterResults])

  let strokeColor: ColorWithLightness = [p.color, 300]
  if (p.disabled) {
    strokeColor = [p.color, 100]
  } else if (p.error) {
    strokeColor = [Color.Error, 300]
  } else if (p.borderColor) {
    strokeColor = p.borderColor
  }

  const commandListItems = (
    <ComboboxItemList
      filteredItems={filteredItems}
      groupedItems={groupedItems}
      enableVirtuoso={p.enableVirtuoso}
      sortAlphabetically={p.sortAlphabetically}
      size={p.size}
      width={p.width}
      containerWidthPx={containerWidth}
      renderItem={(index, item) => (
        <ComboboxItem
          key={index}
          item={item}
          index={index}
          multiple={p.multiple}
          value={p.value}
          size={p.size}
          color={p.color}
          colorSelected={[p.color, 400]}
          colorBackgroundHover={[p.color, 50]}
          colorForeground={[p.color, 700]}
          onSelectSingle={onSelectSingle}
          onSelectMultiple={onSelectMultiple}
        />
      )}
    />
  )

  return (
    <Container
      ref={mergedRef}
      id={p.id}
      data-playwright-testid={p["data-playwright-testid"]}
      className="<InputCombobox /> - "
      size={p.size}
      width={p.width}
    >
      <ComboboxLabel
        label={p.label}
        hint={p.hint}
        required={p.required}
        tooltip={p.tooltip}
        size={p.size}
        color={p.color}
        wrap={p.labelWrap}
      />

      <Popover
        alignment="start"
        open={p.disabled || p.loading ? false : open}
        onOpenChange={p.disabled || p.loading ? () => {} : setOpen}
        container={
          p.renderPopoverInParentContainer
            ? ((typeof p.renderPopoverInParentContainer === "boolean"
                ? mountedContainer
                : p.renderPopoverInParentContainer) ?? undefined)
            : undefined
        }
        trigger={
          <InputButton
            size={p.size}
            width="full"
            variant="outlined"
            colorForeground={[p.color, 700]}
            borderColor={strokeColor}
            borderColorHover={p.disabled ? [p.color, 100] : [p.color, 700]}
            colorBackground={p.disabled ? [p.color, 50] : [Color.White, 700]}
            colorBackgroundHover={[p.color, 50]}
            colorLoading={[p.color, 700]}
            iconName={p.button ? undefined : open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            iconPlacement={p.button ? undefined : "afterLabel"}
            disabled={p.disabled ? true : undefined}
            loading={p.loading ? true : undefined}
            content={
              <ComboboxTriggerContent
                button={p.button}
                label={p.label}
                multiple={p.multiple}
                value={p.value}
                items={items}
                size={p.size}
                color={p.color}
                disabled={p.disabled}
                clearable={p.clearable}
                resettable={p.resettable}
                required={p.required}
                tooltip={p.tooltip}
                textNoSelection={p.textNoSelection}
                onChange={p.onChange}
                onRemoveItem={handleRemoveItem}
              />
            }
          />
        }
      >
        <ComboboxPopoverContent
          filterOptions={p.filterOptions}
          itemsCount={Object.keys(items).length}
          search={search}
          onSearchChange={value => {
            setSearch(value)
            filterWithDebounce(value)
          }}
          size={p.size}
          color={p.color}
          enableVirtuoso={p.enableVirtuoso}
          commandListItems={commandListItems}
        />
      </Popover>

      {p.error ? (
        <Align vertical left hug>
          <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

          <Text tiny={p.size === "small"} xsmall={p.size !== "small"} fill={[Color.Error, 700]}>
            {p.error}
          </Text>
        </Align>
      ) : (
        <></>
      )}
    </Container>
  )
})
