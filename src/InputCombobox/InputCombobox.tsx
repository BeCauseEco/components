import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "cmdk"
import { PropsWithChildren, ReactElement, forwardRef, useEffect, useId, useState } from "react"
import { TInputComboboxItem } from "./InputComboboxItem"
import React from "react"
import { Text, TText } from "@new/Text/Text"
import { ESize } from "@new/ESize"
import { computeColor, EColor } from "@new/Color"
import { Popover } from "@new/Popover/Popover"
import { EInputButtonVariant, InputButton } from "@new/InputButton/InputButton"
import { KeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { EDirection } from "@new/EDirection"
import { Icon, TIcon } from "@new/Icon/Icon"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { EShadow } from "@new/EShadow"
import { InputText } from "@new/InputText/InputText"
import { LayoutCombobox } from "./internal/LayoutInputCombobox"
import { EAlignment } from "@new/EAlignment"
import { Spacer } from "@new/Spacer/Spacer"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { TPlaywright } from "@new/TPlaywright"
import { Chip } from "@new/Chip/Chip"

const Container = styled.div({
  display: "flex",
})

const CommandItemStyled = styled(CommandItem)<
  Pick<TInputComboboxItem, "colorBackground" | "colorBackgroundHover" | "colorForeground"> & {
    multiple: boolean
    selected: boolean
  }
>(p => ({
  position: "relative",
  padding: p.multiple ? "calc(var(--BU) * 1.5) 0" : "calc(var(--BU) * 1.5) calc(var(--BU) * 3)",
  borderRadius: "var(--BU)",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: p.multiple ? "transparent" : computeColor([p.colorBackground, 700]),

  "&[data-selected='true']": {
    backgroundColor: computeColor([p.colorBackgroundHover, 100]),
  },

  // border: !p.multiple && p.selected ? `dotted 1px ${computeColor([p.colorBackgroundHover, 200])}` : "none",

  ...(p.selected && {
    ":after": {
      content: `""`,
      display: "flex",
      position: "absolute",
      width: "calc(var(--BU) * 1.5)",
      height: "calc(var(--BU) * 1.5)",
      top: "calc(50% - calc(var(--BU) / 1.5))",
      left: "0",
      borderRadius: "var(--BU)",
      backgroundColor: computeColor([p.colorBackgroundHover, 200]),
    },
  }),
}))

const CommandEmptyStyled = styled(CommandEmpty)({
  padding: "calc(var(--BU) * 1.5) 0",
  userSelect: "none",
})

const CommandInputStyled = styled(CommandInput)({
  unset: "all",
  display: "flex",
  overflow: "hidden",
  width: 0,
  height: 0,
  border: 0,
  opacity: 0,
  pointerEvents: "none",
})

const Label = styled.label({
  display: "flex",
  userSelect: "none",
  cursor: "pointer",
})

const TextWithOverflow = styled(Text)<Pick<TInputCombobox, "width">>(p => ({
  minWidth: p.width === ESize.Small ? "150px" : "300px",
  overflowX: "hidden",
  overflowY: "hidden",
  textOverflow: "ellipsis",
  textWrap: "nowrap",
  display: "block",
}))

const TitleText = styled(Text)({
  marginRight: "5px",
})

const SelectedItemsContainer = styled.div({
  display: "flex",
  gap: "3px",
})

export type TInputComboBoxFilterOptions = {
  textFilterNoResults: string
  textFilterPlaceholder: string
}

export type TInputComboboxValue = string | boolean[]

type TInputCombobox = TPlaywright & {
  colorButtonBackground: EColor
  colorButtonForeground: EColor
  colorPopOverBackground: EColor
  colorPopOverForeground: EColor
  textNoSelection: string
  width: ESize.Small | ESize.Medium

  /** Enables filtering, if supplied. */
  filterOptions?: TInputComboBoxFilterOptions

  label?: ReactElement<TText>
  icon?: ReactElement<TIcon>
  value: TInputComboboxValue

  /**
   * Enables multiple selection.
   *
   * When InputCombobox.multiple is set to true both InputCombobox.value and parameter: "value" of the onChange function types are of boolean[]
   *
   * Otherwise both types are of string. */
  multiple?: boolean

  /**
   * When InputCombobox.multiple is set to true; "value" parameter is of type boolean[].
   *
   * Otherwise the type is of string */
  id?: string

  title?: string
  onChange: (value: TInputComboboxValue) => void

  children: ReactElement<TInputComboboxItem> | ReactElement<TInputComboboxItem>[]
}

export const InputCombobox = forwardRef<HTMLDivElement, PropsWithChildren<TInputCombobox>>((props, ref) => {
  const {
    colorButtonBackground,
    colorButtonForeground,
    colorPopOverBackground,
    colorPopOverForeground,
    textNoSelection,
    width,
    filterOptions,
    label,
    icon,
    value,
    multiple = false,
    id,
    title,
    onChange,
    children,
    playwrightTestId,
  } = props

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<TInputComboboxItem[]>([])

  const key = useId()

  useEffect(() => {
    const a: TInputComboboxItem[] = []

    React.Children.forEach(children, child => {
      if (React.isValidElement(child)) {
        a.push(child.props)
      }
    })

    setItems(a)
  }, [children])

  const generateCurrentValueLabel = multiple => {
    if (!multiple) {
      return items.findLast(item => (item.value as string) === value)?.label || textNoSelection
    }
    const selectedItems = items.filter(item => item.value === true).flatMap(item => item.label)
    if (selectedItems.length === 0) {
      return textNoSelection
    }

    const visibleItems = selectedItems.slice(0, 2)
    const remainingCount = selectedItems.length - 2

    return (
      <SelectedItemsContainer>
        {visibleItems?.map((item, index) => (
          <Chip
            colorBackground={[EColor.Black, 100]}
            key={index}
            children={
              <KeyValuePair direction={EDirection.Horizontal} spacing={ESize.Xsmall}>
                <Text size={ESize.Small} color={[EColor.Black, 700]} alignment={EAlignment.Start}>
                  {item}
                </Text>
                <InputButton size={ESize.Xsmall} variant={EInputButtonVariant.Transparent} color={EColor.Transparent}>
                  <Icon
                    name="close"
                    size={ESize.Small}
                    color={[EColor.Black, 700]}
                    onClick={(event: Event) => handleRemoveItem(event, item)}
                  />
                </InputButton>
              </KeyValuePair>
            }
          />
        ))}
        {remainingCount > 0 && (
          <Chip
            key={remainingCount}
            colorBackground={[EColor.Black, 100]}
            children={
              <Text size={ESize.Small} color={[EColor.Black, 700]} alignment={EAlignment.Start}>
                +{remainingCount}
              </Text>
            }
          />
        )}
      </SelectedItemsContainer>
    )
  }

  const handleRemoveItem = (event: Event, label: string) => {
    event.preventDefault()
    const updatedItems = items.map(item => (item.label === label ? { ...item, value: false } : item))

    const booleanValues = updatedItems.map(item => item.value as boolean)
    onChange(booleanValues)
  }

  const onSelectSingle = (value: string) => {
    setOpen(false)

    const item = items.findLast(item => item.label.toLowerCase() === (value as unknown as string).toLowerCase())

    onChange((item?.value as string) || "")
  }

  const onSelectMultiple = (index: number, value: boolean) => {
    const onChangeValuesTemp: TInputComboboxValue = []
    const itemsTemp: TInputComboboxItem[] = []

    items.forEach((fItem, fIndex) => {
      if (fIndex === index) {
        itemsTemp.push({ ...fItem, ...{ value: value } })
        onChangeValuesTemp.push(value)
      } else {
        itemsTemp.push(fItem)
        onChangeValuesTemp.push(fItem.value as boolean)
      }
    })

    setItems(itemsTemp)
    onChange(onChangeValuesTemp)
  }

  return (
    <Container ref={ref} id={id} data-playwright-testid={playwrightTestId}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        alignment={EAlignment.Start}
        trigger={
          <KeyValuePair direction={EDirection.Vertical} spacing={ESize.Xsmall}>
            {label && <Label htmlFor={key}>{label}</Label>}

            <InputButton
              size={ESize.Large}
              variant={EInputButtonVariant.Outlined}
              color={colorButtonBackground}
              colorBackgroundHover={[colorButtonBackground, 50]}
              outlineColor={[colorButtonBackground, 100]}
            >
              <KeyValuePair direction={EDirection.Horizontal} spacing={ESize.Large}>
                <>
                  {icon && (
                    <>
                      {icon} <Spacer size={ESize.Small} />
                    </>
                  )}
                  {title && (
                    <TitleText color={[colorButtonForeground, 500]} size={ESize.Small} alignment={EAlignment.Start}>
                      {title}
                    </TitleText>
                  )}
                  <TextWithOverflow
                    color={[colorButtonForeground, 1000]}
                    size={ESize.Small}
                    alignment={EAlignment.Start}
                    width={width}
                  >
                    {generateCurrentValueLabel(multiple)}
                  </TextWithOverflow>
                </>

                <Icon
                  name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                  size={ESize.Medium}
                  color={[colorButtonForeground, 1000]}
                />
              </KeyValuePair>
            </InputButton>
          </KeyValuePair>
        }
        background={
          <BackgroundCard
            colorBackground={[colorPopOverBackground, 700]}
            shadow={EShadow.Medium}
            borderRadius={ESize.Tiny}
          />
        }
        layout={
          <LayoutCombobox
            contentTop={
              filterOptions &&
              items.length > 9 && (
                <>
                  <InputText
                    width={ESize.Full}
                    color={colorButtonBackground}
                    value={search}
                    onChange={value => setSearch(value)}
                    placeholder={filterOptions.textFilterPlaceholder}
                  />
                  <Spacer size={ESize.Xsmall} />
                </>
              )
            }
            contentBottom={
              <Command loop>
                <CommandInputStyled value={search} />

                {filterOptions && (
                  <CommandEmptyStyled>
                    <Text color={[colorPopOverForeground, 700]} size={ESize.Xsmall}>
                      {filterOptions.textFilterNoResults}
                    </Text>
                  </CommandEmptyStyled>
                )}

                <CommandGroup>
                  {items.map((item, index) => (
                    <CommandItemStyled
                      multiple={multiple}
                      key={index}
                      value={item.label}
                      onSelect={value => (multiple ? () => {} : onSelectSingle(value))}
                      selected={value === item.value}
                      colorBackground={item.colorBackground}
                      colorBackgroundHover={item.colorBackgroundHover}
                      colorForeground={item.colorForeground}
                      data-playwright-testid={item.playwrightTestId}
                    >
                      {multiple ? (
                        <InputCheckbox
                          value={item.value === true}
                          onChange={value => onSelectMultiple(index, value)}
                          colorBackground={item.colorBackground}
                          colorForeground={item.colorForeground}
                          icon={item.icon}
                          label={
                            <Text size={ESize.Xsmall} color={[item.colorBackground, 700]}>
                              {item.label}
                            </Text>
                          }
                        />
                      ) : (
                        <Text size={ESize.Xsmall} color={[item.colorForeground, 700]}>
                          {item.label}
                        </Text>
                      )}
                    </CommandItemStyled>
                  ))}
                </CommandGroup>
              </Command>
            }
          />
        }
      />
    </Container>
  )
})
