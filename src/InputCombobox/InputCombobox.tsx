import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandItem, CommandList } from "cmdk"
import { PropsWithChildren, ReactElement, forwardRef, useCallback, useEffect, useMemo, useState } from "react"
import { TInputComboboxItem } from "./InputComboboxItem"
import React from "react"
import { Text } from "@new/Text/Text"
import { Size } from "@new/Size"
import { computeColor, Color, ColorWithLightness } from "@new/Color"
import { Popover } from "@new/Popover/Popover"
import { InputButton } from "@new/InputButton/internal/InputButton"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { EShadow } from "@new/EShadow"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { LayoutCombobox } from "./internal/LayoutInputCombobox"
import { EAlignment } from "@new/EAlignment"
import { Spacer } from "@new/Spacer/Spacer"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { PlaywrightProps } from "@new/Playwright"
import { Virtuoso } from "react-virtuoso"
import { Badge } from "@new/Badge/Badge"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Align/Align"

const Container = styled.div({
  display: "flex",
})

const CommandItemStyled = styled(CommandItem)<{
  multiple?: boolean
  selected: boolean
  colorSelected: ColorWithLightness
  colorBackgroundHover: ColorWithLightness
  colorForeground: ColorWithLightness
}>(p => ({
  position: "relative",
  padding: p.multiple ? "calc(var(--BU) * 1.5) 0" : "calc(var(--BU) * 1.5) calc(var(--BU) * 3)",
  borderRadius: "var(--BU)",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: "transparent",

  "&[data-selected='true']": {
    backgroundColor: computeColor(p.colorBackgroundHover),
  },

  ...(p.selected &&
    !p.multiple && {
      ":after": {
        content: `""`,
        display: "flex",
        position: "absolute",
        width: "calc(var(--BU) * 1.5)",
        height: "calc(var(--BU) * 1.5)",
        top: "calc(50% - calc(var(--BU) / 1.5))",
        left: "0",
        borderRadius: "var(--BU)",
        backgroundColor: computeColor(p.colorSelected),
      },
    }),
}))

const CommandEmptyStyled = styled(CommandEmpty)({
  padding: "calc(var(--BU) * 1.5) 0",
  userSelect: "none",
})

const TextWithOverflow = styled(Text)({
  // maxWidth: p.width === Size.Small ? "150px" : "300px",
  overflowX: "hidden",
  overflowY: "hidden",
  textOverflow: "ellipsis",
  textWrap: "nowrap",
  display: "block",
})

export type TInputComboBoxFilterOptions = {
  textFilterNoResults: string
  textFilterPlaceholder: string
}

type TInputCombobox = PlaywrightProps & {
  id?: string

  size: "small" | "large"

  textNoSelection: string

  /** Enables filtering, if supplied. */
  filterOptions?: TInputComboBoxFilterOptions

  label?: string

  multiple?: boolean

  /**
   * When InputCombobox.multiple is set to true; "value" parameter is of type string[].
   *
   * Otherwise the type is of string */
  value: string | string[]

  onChange: (value: string | string[]) => void

  children: ReactElement<TInputComboboxItem> | ReactElement<TInputComboboxItem>[]

  /**
   * Enables the virtuoso list for the combobox. Only use this if you have a large number of items.
   */
  enableVirtuoso?: boolean

  isClearable?: boolean

  disabled?: boolean
  loading?: boolean
}

const LIST_HEIGHT = 360
const LIST_WIDTH = 260

export const InputCombobox = forwardRef<HTMLDivElement, PropsWithChildren<TInputCombobox>>((p, ref) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [height, setHeight] = useState(1)
  const [filteredValues, setFilteredValues] = useState<string[]>([])

  const items: { [value: string]: TInputComboboxItem } = useMemo(() => {
    const output: { [value: string]: TInputComboboxItem } = {}

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

      if (p.isClearable && selectedItem) {
        return (
          <Badge
            size={p.size}
            variant="solid"
            label={selectedItem.label}
            color={Color.Primary}
            onClear={() => {
              p.onChange("")
            }}
          />
        )
      }

      return (
        <TextWithOverflow fill={[Color.Primary, 700]} small={p.size === "small"} medium={p.size !== "small"}>
          {selectedItem?.label || p.textNoSelection}
        </TextWithOverflow>
      )
    }

    const selectedValuesSet = new Set(p.value)
    const selectedItems = Object.entries(items)
      .filter(([id]) => selectedValuesSet.has(id))
      .flatMap(([, value]) => value.label)

    if (selectedItems.length === 0) {
      return (
        <Text small={p.size === "small"} medium={p.size !== "small"} fill={[Color.Primary, 700]}>
          {p.textNoSelection}
        </Text>
      )
    }

    const visibleItems = selectedItems.slice(0, 2)
    const remainingCount = selectedItems.length - 2

    return (
      <>
        {visibleItems?.map((item, index) => (
          <>
            <Badge
              key={index}
              label={item}
              size={p.size}
              variant="solid"
              color={Color.Primary}
              onClear={() => {
                handleRemoveItem(item)
              }}
            />

            {visibleItems.length >= index ? <Spacer tiny /> : null}
          </>
        ))}

        {remainingCount > 0 && (
          <Badge
            key={remainingCount}
            label={`+${remainingCount}`}
            size={p.size}
            variant="solid"
            color={Color.Primary}
          />
        )}
      </>
    )
  }

  const getCommandItem = (index: number, item: TInputComboboxItem): React.ReactNode => {
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
        onSelect={value => (p.multiple ? () => {} : onSelectSingle(value))}
        selected={p.multiple ? (p.value as string[]).includes(item.value) : p.value === item.value}
        colorSelected={[Color.Primary, 400]}
        colorBackgroundHover={[Color.Primary, 100]}
        colorForeground={[Color.Primary, 700]}
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
              />
            </Align>
          </Stack>
        ) : (
          <Text small={p.size === "small"} medium={p.size !== "small"} fill={[Color.Primary, 700]} wrap>
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
    <Container ref={ref} id={p.id} data-playwright-testid={p.playwrightTestId}>
      <Popover
        open={p.disabled || p.loading ? false : open}
        onOpenChange={p.disabled || p.loading ? () => {} : setOpen}
        alignment={EAlignment.Start}
        trigger={
          <InputButton
            size={p.size}
            variant="outlined"
            colorForeground={[Color.Primary, 700]}
            colorOutline={[Color.Primary, 300]}
            colorBackgroundHover={[Color.Primary, 100]}
            colorLoading={[Color.Primary, 700]}
            iconName={open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            iconPlacement="afterLabel"
            disabled={p.disabled}
            loading={p.loading}
            content={
              <Stack horizontal hug>
                <Align horizontal left>
                  <Text xsmall={p.size === "small"} small={p.size !== "small"} fill={[Color.Primary, 700]}>
                    {p.label}
                  </Text>

                  <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

                  {generateCurrentValueLabel(p.multiple)}
                </Align>
              </Stack>
            }
          />
        }
        background={<BackgroundCard colorBackground={[Color.White]} shadow={EShadow.Medium} borderRadius={Size.Tiny} />}
        layout={
          <LayoutCombobox
            contentTop={
              <>
                {p.filterOptions && Object.keys(items).length > 9 && (
                  <InputTextSingle
                    size={p.size}
                    color={Color.Primary}
                    value={search}
                    placeholder={p.filterOptions.textFilterPlaceholder}
                    onChange={value => {
                      setSearch(value)
                      filterWithDebounce(value)
                    }}
                  />
                )}

                <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />
              </>
            }
            contentBottom={
              <Command loop>
                {p.filterOptions && (
                  <CommandEmptyStyled>
                    <Text fill={[Color.Primary, 700]} xsmall={p.size === "small"} small={p.size !== "small"}>
                      {p.filterOptions.textFilterNoResults}
                    </Text>
                  </CommandEmptyStyled>
                )}

                <CommandList>{commandListItems}</CommandList>
              </Command>
            }
          />
        }
      />
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
