import { Align } from "@new/Align/Align"
import { TColor } from "@new/Color"
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
  icon?: string
  colorBackground: TColor
  colorForeground: TColor
  message: string
  additionalContent?: React.ReactNode
}

export const Callout = ({
  icon = "info",
  colorBackground: backgroundColor,
  colorForeground: color,
  message,
  additionalContent,
}: CalloutProps) => {
  return (
    <Composition>
      <BackgroundCard colorBackground={backgroundColor} borderRadius={ESize.Tiny} />
      <LayoutCallout
        content={
          <LayoutSingle
            direction={EDirection.Horizontal}
            content={
              <Composition>
                <Align row middle>
                  <Icon name={icon} color={color} size={ESize.Medium} />
                  <Spacer size={ESize.Xsmall} />
                  <Text size={ESize.Tiny} color={color} wrap>
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
