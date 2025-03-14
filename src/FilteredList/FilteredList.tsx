import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandItem, CommandList } from "cmdk"
import { PropsWithChildren, ReactElement, forwardRef, isValidElement, useState } from "react"
import { FilteredListItemProps } from "./FilteredListItem"
import React from "react"
import { Text } from "@new/Text/Text"
import { computeColor, Color, ColorWithLightness } from "@new/Color"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Spacer } from "@new/Stack/Spacer"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { OverflowContainer, OverflowContainerProps } from "@new/OverflowContainer/OverflowContainer"
import { Avatar } from "@new/Avatar/Avatar"

export type FilteredListProps = ComponentBaseProps & {
  color: Color

  maxHeight?: OverflowContainerProps["maxHeight"]

  value: string

  onChange: (value: string) => void

  children: ReactElement<FilteredListItemProps> | ReactElement<FilteredListItemProps>[]

  disabled?: boolean
  loading?: boolean
}

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",

  "& [cmdk-root]": {
    width: "100%",
  },

  "& [cmdk-label]": {
    display: "none",
  },
})

const CommandItemStyled = styled(CommandItem)<{
  selected: boolean
  colorSelected: ColorWithLightness
  colorBackgroundHover: ColorWithLightness
  colorForeground: ColorWithLightness
}>(p => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "calc(var(--BU) * 2)",
  borderRadius: "var(--BU)",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: "transparent",

  "&[data-selected='true']": {
    backgroundColor: computeColor(p.colorBackgroundHover),
  },
}))

const CommandEmptyStyled = styled(CommandEmpty)({
  display: "flex",
  flexDirection: "column",
  padding: "calc(var(--BU) * 2) 0",
  width: "100%",
  userSelect: "none",
})

export const FilteredList = forwardRef<HTMLDivElement, PropsWithChildren<FilteredListProps>>((p, ref) => {
  const [filter, setFilter] = useState("")
  const output: ReactElement[] = []

  React.Children.forEach(p.children, child => {
    if (isValidElement(child)) {
      const label = child.props["label"]
      const value = child.props["value"]
      const avatarTitle = child.props["title"]
      const avatarSrc = child.props["src"]
      const playwrightTestId = child.props["data-playwright-testid"]

      if (label.toLowerCase().includes(filter.toLowerCase())) {
        output.push(
          <CommandItemStyled
            value={value}
            onSelect={value => p.onChange(value)}
            selected={p.value === value}
            colorSelected={[p.color, 400]}
            colorBackgroundHover={[p.color, 50]}
            colorForeground={[p.color, 700]}
            data-playwright-testid={playwrightTestId}
          >
            <Stack horizontal hug>
              <Align horizontal left hug>
                <Avatar src={avatarSrc} title={avatarTitle} />
              </Align>

              <Spacer xsmall />

              <Align horizontal left>
                <Text small fill={[p.color, 700]}>
                  {label}
                </Text>
              </Align>
            </Stack>
          </CommandItemStyled>,
        )
      }
    }
  })

  return (
    <Container ref={ref} id={p.id} data-playwright-testid={p["data-playwright-testid"]} className="<FilteredList /> - ">
      <Stack vertical data-playwright-testid={p["data-playwright-testid"]}>
        <Align vertical topLeft>
          <Command loop>
            <InputTextSingle
              size="large"
              width="auto"
              color={p.color}
              value={filter}
              onChange={value => setFilter(value)}
            />

            <Spacer xsmall />

            <CommandList>
              <CommandEmptyStyled>
                <Text fill={[p.color, 700]} small>
                  Nothing found
                </Text>
              </CommandEmptyStyled>

              <Stack vertical hug>
                <Align vertical topLeft>
                  <OverflowContainer
                    axes="vertical"
                    colorBackground={[Color.White]}
                    colorForeground={Color.Neutral}
                    maxHeight={p.maxHeight}
                    hug
                  >
                    {output}
                  </OverflowContainer>
                </Align>
              </Stack>
            </CommandList>
          </Command>
        </Align>
      </Stack>
    </Container>
  )
})
