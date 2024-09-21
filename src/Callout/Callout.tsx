import { Align } from "@new/Align/Align"
import { EColor } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { Composition } from "@new/Composition/Composition"
import { LayoutSingle } from "@new/Composition/LayoutSingle"
import { EDirection } from "@new/EDirection"
import { ESize } from "@new/ESize"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Spacer/Spacer"
import { Text } from "@new/Text/Text"
import { LayoutCallout } from "./internal/LayoutCallout"

type CalloutProps = {
  isLoading: boolean
  icon?: string
  message: string
  additionalContent?: React.ReactNode
}

export const Callout = ({ isLoading, icon = "info", message, additionalContent }: CalloutProps) => {
  return (
    <Composition loading={isLoading}>
      <BackgroundCard colorBackground={[EColor.Black, 50]} borderRadius={ESize.Tiny} />
      <LayoutCallout
        content={
          <LayoutSingle
            direction={EDirection.Horizontal}
            content={
              <Composition>
                <Align row middle>
                  <Icon name={icon} color={[EColor.Black, 300]} size={ESize.Medium} />
                  <Spacer size={ESize.Xsmall} />
                  <Text size={ESize.Tiny} color={[EColor.Black, 600]} wrap>
                    {message}
                  </Text>
                  {additionalContent && additionalContent}
                </Align>
              </Composition>
            }
            omitPadding
          />
        }
      />
    </Composition>
  )
}
