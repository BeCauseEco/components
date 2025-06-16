import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandList } from "cmdk"
import { PropsWithChildren, ReactElement, forwardRef, useState } from "react"
import { FilteredListItemProps } from "./FilteredListItem"
import React from "react"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Spacer } from "@new/Stack/Spacer"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { OverflowContainer, OverflowContainerProps } from "@new/OverflowContainer/OverflowContainer"

export type FilteredListProps = ComponentBaseProps & {
  color: Color

  maxHeight?: OverflowContainerProps["maxHeight"]
  value: string
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

const CommandEmptyStyled = styled(CommandEmpty)({
  display: "flex",
  flexDirection: "column",
  padding: "calc(var(--BU) * 2) 0",
  width: "100%",
  userSelect: "none",
})

export const FilteredList = forwardRef<HTMLDivElement, PropsWithChildren<FilteredListProps>>((p, ref) => {
  const [filter, setFilter] = useState("")

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
                    {p.children}
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
