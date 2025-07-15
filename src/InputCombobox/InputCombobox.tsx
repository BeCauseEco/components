import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "cmdk"
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
import { Divider } from "@new/Divider/Divider"
import { Icon } from "@new/Icon/Icon"

export type InputComboboxProps = ComponentBaseProps & {
  size: "small" | "large"
  width: "fixed" | "auto"

  textNoSelection: string

  /** Enables filtering, if supplied. */
  filterOptions?: { textFilterNoResults: string; textFilterPlaceholder: string }

  label?: ["outside" | "inside", string]
  hint?: string
  error?: string

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
  resettable?: boolean

  disabled?: boolean
  loading?: boolean

  required?: boolean
}

const Container = styled.div<Pick<InputComboboxProps, "size" | "width">>(p => ({
  display: "flex",
  flexDirection: "column",
  width: p.width === "fixed" ? (p.size === "small" ? "calc(var(--BU) * 70)" : "calc(var(--BU) * 80)") : "auto",
}))

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
  maxWidth: "100%",
  overflow: "hidden",
})

export const InputCombobox = forwardRef<HTMLDivElement, PropsWithChildren<InputComboboxProps>>((p, ref) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filteredValues, setFilteredValues] = useState<string[]>([])

  const items: { [value: string]: InputComboboxItemProps } = useMemo(() => {
    const output: { [value: string]: InputComboboxItemProps } = {}

    React.Children.forEach(p.children, child => {
      if (React.isValidElement<InputComboboxItemProps>(child)) {
        output[child.props.value] = child.props
      }
    })

    return output
  }, [p.children])

  useEffect(() => {
    const newItems = Object.values(items).map(item => item.value)

    setFilteredValues(newItems)
  }, [items])

  const LabelContainer = styled.div({
    display: "flex",
    overflow: "hidden",
    width: "100%",
    maxWidth: "100%",

    "& [class^='<Badge']:not(:nth-child(n+4))": {
      minWidth: "25%",
    },
  })

  const generateCurrentValueLabel = (multiple?: boolean) => {
    if (!multiple) {
      const selectedItem = Object.values(items).findLast(item => p.value === item.value)

      if (p.clearable && selectedItem) {
        return (
          <Badge
            size={p.size}
            variant={p.disabled ? "opaque" : "solid"}
            label={selectedItem.label}
            title={selectedItem.label}
            color={p.disabled ? p.color : Color.Primary}
            onClear={() => {
              p.onChange("")
            }}
            textOverflow
          />
        )
      }

      return (
        <Stack horizontal hug overflowHidden>
          <Align horizontal left hug>
            {selectedItem?.icon ? (
              <>
                {selectedItem.icon}

                <Spacer xsmall />
              </>
            ) : null}

            <Text fill={[p.color, 700]} xsmall={p.size === "small"} small={p.size === "large"} textOverflow>
              {selectedItem?.label || p.textNoSelection}
            </Text>
          </Align>
        </Stack>
      )
    }

    const selectedValuesSet = new Set(p.value)

    const selectedItems = Object.entries(items)
      .filter(([id]) => selectedValuesSet.has(id))
      .flatMap(([, value]) => value.label)

    if (selectedItems.length === 0) {
      return (
        <Text xsmall={p.size === "small"} small={p.size === "large"} fill={[Color.Neutral, 700]} wrap>
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
              title={item}
              size={p.size}
              variant={p.disabled ? "opaque" : "solid"}
              color={p.disabled ? p.color : Color.Primary}
              onClear={
                p.clearable
                  ? () => {
                      handleRemoveItem(item)
                    }
                  : undefined
              }
              textOverflow
            />

            <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />
          </>
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

      const item = Object.values(items).findLast(item => item.label === value.trim())

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
        colorSelected={[p.color, 400]}
        colorBackgroundHover={[p.color, 50]}
        colorForeground={[p.color, 700]}
        data-playwright-testid={item["data-playwright-testid"]}
      >
        {p.multiple ? (
          <Stack horizontal hug overflowHidden>
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
          <Stack horizontal hug overflowHidden>
            <Align horizontal left hug>
              {item.icon ? (
                <>
                  {item.icon}

                  <Spacer xsmall />
                </>
              ) : null}

              <Text
                xsmall={p.size === "small"}
                small={p.size === "large"}
                fill={[p.color, 700]}
                textOverflow
                title={item.label}
              >
                {item.label}
              </Text>
            </Align>
          </Stack>
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

  const groupedItems = useMemo(() => {
    const groups: { [groupName: string]: InputComboboxItemProps[] } = {}
    let hasAnyGroupingLabel = false

    filteredItems.forEach(item => {
      const groupName = item.groupingLabel || ""
      if (item.groupingLabel) {
        hasAnyGroupingLabel = true
      }
      
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(item)
    })

    // If no grouping labels exist, return null to use flat rendering
    if (!hasAnyGroupingLabel) {
      return null
    }

    // If grouping labels exist, rename the empty group to "Other"
    if (groups[""]) {
      groups["Other"] = groups[""]
      delete groups[""]
    }

    return groups
  }, [filteredItems])

  let commandListItems: ReactElement | null = null

  if (p.enableVirtuoso) {
    // For virtuoso, we need to use flat rendering even with groups
    // TODO: Future enhancement could add virtuoso support for groups
    commandListItems = (
      <Virtuoso
        style={{
          height: "calc(var(--radix-popover-content-available-height) / 2)",
          minWidth: "100%",
          maxWidth: "calc(var(--radix-popover-content-available-width) - var(--BU) * 4)",

          overflowX: "hidden",
        }}
        increaseViewportBy={100}
        data={filteredItems}
        itemContent={(index, item) => getCommandItem(index, item)}
      />
    )
  } else {
    if (groupedItems) {
      // Render grouped items
      commandListItems = (
        <>
          {Object.entries(groupedItems).map(([groupName, groupItems]) => (
            <CommandGroup key={groupName} heading={groupName}>
              {groupItems.map((item, index) => getCommandItem(index, item))}
            </CommandGroup>
          ))}
        </>
      )
    } else {
      // Render flat items
      commandListItems = <>{filteredItems.map((item, index) => getCommandItem(index, item))}</>
    }
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

  const Label = styled.label({
    display: "flex",
    userSelect: "none",
    cursor: "pointer",
    alignItems: "center",
  })

  return (
    <Container
      ref={ref}
      id={p.id}
      data-playwright-testid={p["data-playwright-testid"]}
      className="<InputCombobox /> - "
      size={p.size}
      width={p.width}
    >
      {p.label && p.label[0] === "outside" ? (
        <Stack vertical hug>
          <>
            <Align vertical left hug="width">
              <Label>
                <Text xsmall={p.size === "small"} small={p.size !== "small"} fill={[p.color, 700]}>
                  <b>{p?.label?.[1]}</b>
                </Text>

                {p.required && (
                  <>
                    <Spacer tiny={p.size === "small"} xsmall={p.size === "large"} />

                    <Icon
                      name="asterisk"
                      small={p.size === "small"}
                      medium={p.size === "large"}
                      fill={[Color.Error, 700]}
                    />
                  </>
                )}
              </Label>

              <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
            </Align>

            {p.hint ? (
              <Align vertical left hug>
                <Text tiny={p.size === "small"} xsmall={p.size !== "small"} fill={[p.color, 700]}>
                  {p.hint}
                </Text>

                <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
              </Align>
            ) : (
              <></>
            )}
          </>
        </Stack>
      ) : (
        <></>
      )}

      <Popover
        alignment="start"
        open={p.disabled || p.loading ? false : open}
        onOpenChange={p.disabled || p.loading ? () => {} : setOpen}
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
                  {p.label && p.label[0] === "inside" ? (
                    <>
                      <Text xsmall={p.size === "small"} small={p.size === "large"} fill={[p.color, 500]}>
                        {p.label[1]}
                      </Text>

                      <Spacer xsmall={p.size === "small"} small={p.size === "large"} />
                    </>
                  ) : (
                    <></>
                  )}

                  <LabelContainer>{generateCurrentValueLabel(p.multiple)}</LabelContainer>
                </Align>

                {p.resettable && ((!p.multiple && !p.clearable) || (p.multiple && p.value.length > 1)) ? (
                  <Align horizontal right hug="width">
                    <Spacer xsmall={p.size === "small"} small={p.size === "large"} />

                    <InputButton
                      variant="blank"
                      width="auto"
                      size={p.size}
                      colorForeground={p.value ? [p.color, 700] : [Color.Transparent]}
                      iconName="clear"
                      iconPlacement="labelNotSpecified"
                      onClick={() => {
                        if (p.onChange) {
                          p.onChange(p.multiple ? [] : "")
                        }
                      }}
                    />

                    <Divider vertical fill={p.value ? [p.color, 300] : [Color.Transparent]} overrideHeight="50%" />
                  </Align>
                ) : (
                  <></>
                )}
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

          {p.enableVirtuoso ? (
            <Command style={{ width: "100%" }} loop>
              {p.filterOptions && (
                <CommandEmptyStyled>
                  <Text fill={[p.color, 700]} xsmall={p.size === "small"} small={p.size !== "small"} textOverflow>
                    {p.filterOptions.textFilterNoResults}
                  </Text>
                </CommandEmptyStyled>
              )}

              <CommandList>{commandListItems}</CommandList>
            </Command>
          ) : (
            <OverflowContainer
              axes="vertical"
              colorBackground={[Color.White]}
              colorForeground={Color.Neutral}
              maxHeight="radix-popover-content-available-height-SAFE-AREA-INPUTTEXT"
              minWidth="radix-popover-trigger-width"
              maxWidth="radix-popover-content-available-width"
              hug
            >
              <Command loop>
                {p.filterOptions && (
                  <CommandEmptyStyled>
                    <Text fill={[p.color, 700]} xsmall={p.size === "small"} small={p.size !== "small"} textOverflow>
                      {p.filterOptions.textFilterNoResults}
                    </Text>
                  </CommandEmptyStyled>
                )}

                <CommandList>{commandListItems}</CommandList>
              </Command>
            </OverflowContainer>
          )}
        </Align>
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

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced
}
