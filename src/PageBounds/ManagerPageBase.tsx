import React, { ReactNode } from "react"
import { Align } from "@new/Stack/Align"
import { Stack } from "@new/Stack/Stack"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"
import { Spacer } from "@new/Stack/Spacer"

const ManagerPageBase = ({
  title,
  subtitle,
  actionArea,
  children,
}: {
  title: string
  subtitle: string
  actionArea?: ReactNode
  children?: ReactNode
}) => {
  return (
    <Stack hug vertical>
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
    </Stack>
  )
}

export default ManagerPageBase
