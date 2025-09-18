import React, { ReactNode } from "react"
import { Align } from "@new/Stack/Align"
import { Stack } from "@new/Stack/Stack"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { Spacer } from "@new/Stack/Spacer"
import styled from "@emotion/styled"

const PaneContainer = styled.div`
  display: flex;
  margin-top: -40px;
  margin-right: -40px;
  margin-bottom: -40px;
`

const MainContentContainer = styled.div`
  width: 100%;
`

const ManagerPageWithOptionalRightPane = ({ children, pane }: { children: ReactNode; pane: ReactNode }) => {
  if (pane) {
    return (
      <Stack horizontal hug>
        <MainContentContainer>{children}</MainContentContainer>
        <PaneContainer>{pane}</PaneContainer>
      </Stack>
    )
  }

  return <>{children}</>
}

const ManagerPageBase = ({
  isLoading,
  title,
  subtitle,
  actionArea,
  children,
  rightPane,
}: {
  isLoading?: boolean
  title: string
  subtitle: string
  actionArea?: ReactNode
  children?: ReactNode
  rightPane?: ReactNode
}) => {
  return (
    <Stack hug vertical loading={isLoading}>
      <ManagerPageWithOptionalRightPane pane={rightPane}>
        <Align vertical>
          <Stack hug horizontal>
            <Align vertical>
              <Text fill={[Color.Neutral, 700]} medium>
                <b>{title}</b>
              </Text>

              <Spacer small />

              <Text fill={[Color.Neutral, 400]} small wrap>
                {subtitle}
              </Text>
            </Align>

            <>
              {actionArea && (
                <Align horizontal topRight>
                  <>{actionArea}</>
                </Align>
              )}
            </>
          </Stack>
          <Spacer huge />
          <Stack hug>
            <>{children}</>
          </Stack>
        </Align>
      </ManagerPageWithOptionalRightPane>
    </Stack>
  )
}

export default ManagerPageBase
