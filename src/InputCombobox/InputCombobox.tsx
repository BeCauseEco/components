import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandItem, CommandList } from "cmdk"
import { PropsWithChildren, ReactElement, forwardRef, useCallback, useEffect, useMemo, useState } from "react"
import { InputComboboxItemProps } from "./InputComboboxItem"
import React from "react"
import { Text } from "@new/Text/Text"
import { computeColor, Color, ColorWithLightness } from "@new/Color"
import { Popover } from "@new/Popover/Popover"
import { InputButton } from "@new/InputButton/internal/InputButton"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Spacer } from "@new/Stack/Spacer"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { Virtuoso } from "react-virtuoso"
import { Badge } from "@new/Badge/Badge"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { OverflowContainer } from "@new/OverflowContainer/OverflowContainer"

export type InputComboboxProps = ComponentBaseProps & {
  size: "small" | "large"

  textNoSelection: string

  /** Enables filtering, if supplied. */
  filterOptions?: { textFilterNoResults: string; textFilterPlaceholder: string }

  label?: string

  multiple?: boolean

  color: Color

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

  disabled?: boolean
  loading?: boolean
}

const Container = styled.div({
  display: "flex",
  width: "fit-content",
})

const CommandItemStyled = styled(CommandItem)<{
  multiple?: boolean
  selected: boolean
  colorSelected: ColorWithLightness
  colorBackgroundHover: ColorWithLightness
  colorForeground: ColorWithLightness
}>(p => ({
  position: "relative",
  padding: p.multiple ? "calc(var(--BU) * 1)" : "calc(var(--BU) * 1.5) ",
  borderRadius: "var(--BU)",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: "transparent",

  "&[data-selected='true']": {
    backgroundColor: computeColor(p.colorBackgroundHover),
  },
}))

const CommandEmptyStyled = styled(CommandEmpty)({
  padding: "calc(var(--BU) * 1.5) 0",
  userSelect: "none",
})

const LIST_HEIGHT = 360
const LIST_WIDTH = 260

export const InputCombobox = forwardRef<HTMLDivElement, PropsWithChildren<InputComboboxProps>>((p, ref) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [height, setHeight] = useState(1)
  const [filteredValues, setFilteredValues] = useState<string[]>([])

  const items: { [value: string]: InputComboboxItemProps } = useMemo(() => {
    const output: { [value: string]: InputComboboxItemProps } = {}

    React.Children.forEach(p.children, child => {
      if (React.isValidElement(child)) {
        output[child.props.value] = child.props
      }
    })

    return output
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [React.Children.count(p.children)])

  useEffect(() => {
    const newItems = Object.values(items).map(item => item.value)

    setFilteredValues(newItems)
  }, [items])

  const generateCurrentValueLabel = (multiple?: boolean) => {
    if (!multiple) {
      const selectedItem = Object.values(items).findLast(item => p.value === item.value)

      if (p.clearable && selectedItem) {
        return (
          <Badge
            size={p.size}
            variant={p.disabled ? "opaque" : "solid"}
            label={selectedItem.label}
            color={p.disabled ? p.color : Color.Primary}
            maxWidth="160px"
            onClear={() => {
              p.onChange("")
            }}
          />
        )
      }

      return (
        <Text fill={[p.color, 700]} xsmall={p.size === "small"} small={p.size === "large"} maxWidth="160px">
          {selectedItem?.label || p.textNoSelection}
        </Text>
      )
    }

    const selectedValuesSet = new Set(p.value)

    const selectedItems = Object.entries(items)
      .filter(([id]) => selectedValuesSet.has(id))
      .flatMap(([, value]) => value.label)

    if (selectedItems.length === 0) {
      return (
        <Text xsmall={p.size === "small"} small={p.size === "large"} fill={[Color.Neutral, 700]}>
          {p.textNoSelection}
        </Text>
      )
    }

    const visibleItems = selectedItems.slice(0, 2)
    const remainingCount = selectedItems.length - 2

    return (
      <>
        {visibleItems?.map((item, index) => (
          <Stack key={index} horizontal hug>
            <Align horizontal>
              <Badge
                label={item}
                size={p.size}
                variant={p.disabled ? "opaque" : "solid"}
                color={p.disabled ? p.color : Color.Primary}
                maxWidth="160px"
                onClear={
                  p.clearable
                    ? () => {
                      handleRemoveItem(item)
                    }
                    : undefined
                }
              />
            </Align>

            {visibleItems.length >= index ? <Spacer tiny /> : <></>}
          </Stack>
        ))}

        {remainingCount > 0 && (
          <Badge
            key={remainingCount}
            label={`+${remainingCount}`}
            size={p.size}
            variant={p.disabled ? "opaque" : "solid"}
            color={p.disabled ? p.color : Color.Primary}
          />
        )}
      </>
    )
  }

  const getCommandItem = (index: number, item: InputComboboxItemProps): React.ReactNode => {
    const onSelectSingle = (value: string) => {
      setOpen(false)

      const item = Object.values(items).findLast(item => item.label.toLowerCase() === value.trim().toLowerCase())

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

    return (
      <CommandItemStyled
        key={index}
        multiple={p.multiple}
        value={item.label}
        onSelect={value => (p.multiple ? () => { } : onSelectSingle(value))}
        selected={p.multiple ? (p.value as string[]).includes(item.value) : p.value === item.value}
        colorSelected={[p.color, 400]}
        colorBackgroundHover={[p.color, 50]}
        colorForeground={[p.color, 700]}
        data-playwright-testid={item.playwrightTestId}
      >
        {p.multiple ? (
          <Stack horizontal hug>
            <Align horizontal left hug>
              {item.icon ? (
                <>
                  {item.icon}

                  <Spacer xsmall />
                </>
              ) : null}

              <InputCheckbox
                size={p.size}
                value={p.multiple ? (p.value as string[]).includes(item.value) : p.value === item.value}
                onChange={value => onSelectMultiple(item.value, value)}
                color={Color.Primary}
                label={item.label}
                maxWidth="320px"
              />
            </Align>
          </Stack>
        ) : (
          <Text xsmall={p.size === "small"} small={p.size === "large"} fill={[p.color, 700]} maxWidth="320px">
            {item.label}
          </Text>
        )}
      </CommandItemStyled>
    )
  }

  const filteredItems = useMemo(() => {
    const filteredItemIdsSet = new Set(filteredValues)

    return Object.entries(items)
      .filter(([id]) => filteredItemIdsSet.has(id))
      .map(([, value]) => value)
  }, [filteredValues, items])

  let commandListItems: ReactElement | null = null

  if (p.enableVirtuoso) {
    commandListItems = (
      <Virtuoso
        style={{
          height: `${height}px`,
          maxHeight: "calc(var(--radix-popover-content-available-height) - calc(var(--BU) * 20))",
          minWidth: `${LIST_WIDTH}px`,
          overflowX: "hidden",
        }}
        increaseViewportBy={100}
        totalListHeightChanged={h => setHeight(h > LIST_HEIGHT ? LIST_HEIGHT : h)}
        data={filteredItems}
        itemContent={(index, item) => getCommandItem(index, item)}
      />
    )
  } else {
    commandListItems = <>{filteredItems.map((item, index) => getCommandItem(index, item))}</>
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
      if (value === "") {
        setFilteredValues(Object.values(items).map(item => item.value))

        return
      }

      const itemsFiltered = Object.values(items).filter(item => item.label.toLowerCase().includes(value.toLowerCase()))

      setFilteredValues(itemsFiltered.map(item => item.value))
    },
    [items],
  )

  const filterWithDebounce = useMemo(() => debounce(filterResults, 300), [filterResults])

  return (
    <Container ref={ref} id={p.id} data-playwright-testid={p.playwrightTestId} className="<InputCombobox /> - ">
      <Popover
        alignment="start"
        open={p.disabled || p.loading ? false : open}
        onOpenChange={p.disabled || p.loading ? () => { } : setOpen}
        trigger={
          <InputButton
            size={p.size}
            width="full"
            variant="outlined"
            colorForeground={[p.color, 700]}
            colorOutline={p.disabled ? [p.color, 100] : [p.color, 300]}
            colorOutlineHover={p.disabled ? [p.color, 100] : [p.color, 700]}
            colorBackground={p.disabled ? [p.color, 50] : [Color.White]}
            colorBackgroundHover={[p.color, 50]}
            colorLoading={[p.color, 700]}
            iconName={open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            iconPlacement="afterLabel"
            disabled={p.disabled ? true : undefined}
            loading={p.loading ? true : undefined}
            content={
              <Stack horizontal hug>
                <Align horizontal left>
                  <Text xsmall={p.size === "small"} small={p.size === "large"} fill={[p.color, 500]}>
                    {p.label}
                  </Text>

                  <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

                  <div style={{ display: "flex", width: "100%", flexShrink: 1, flexGrow: 1, overflow: "hidden" }}>
                    {generateCurrentValueLabel(p.multiple)}
                  </div>
                </Align>
              </Stack>
            }
          />
        }
      >
        <Align vertical topLeft>
          {p.filterOptions && Object.keys(items).length > 9 && (
            <InputTextSingle
              size="small"
              width="auto"
              color={p.color}
              value={search}
              placeholder={p.filterOptions.textFilterPlaceholder}
              onChange={value => {
                setSearch(value)
                filterWithDebounce(value)
              }}
            />
          )}

          <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />

          <OverflowContainer
            axes="vertical"
            colorBackground={[Color.White]}
            colorForeground={Color.Neutral}
            maxHeight="radix-popover-content-available-height-SAFE-AREA-INPUTTEXT"
            hug
          >
            <Command loop>
              {p.filterOptions && (
                <CommandEmptyStyled>
                  <Text fill={[p.color, 700]} xsmall={p.size === "small"} small={p.size !== "small"}>
                    {p.filterOptions.textFilterNoResults}
                  </Text>
                </CommandEmptyStyled>
              )}

              <CommandList>{commandListItems}</CommandList>
            </Command>
          </OverflowContainer>
        </Align>
      </Popover>
    </Container>
  )
})

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced
}
