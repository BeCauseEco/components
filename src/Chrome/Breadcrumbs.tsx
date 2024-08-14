import { EColor } from "@new/Color"
import { EInputButtonVariant, InputButton } from "@new/InputButton/InputButton"
import { ESize } from "@new/ESize"
import { Text } from "@new/Text/Text"
import { Breadcrumb } from "@new/Breadcrumb/Breadcrumb"
// import { useGetCurrentMenuPageItem } from "@new/Chrome/hooks/useGetCurrentMenuPageItem"

export type TBreadcrumbs = {}

export const Breadcrumbs = () => {
  // const { breadcrumbs } = useGetCurrentMenuPageItem()

  const breadcrumbs = [{ id: "", pageUrl: "", menuTitle: "" }]

  return (
    <Breadcrumb>
      {breadcrumbs.map(breadcrumb => (
        <InputButton
          key={breadcrumb.id}
          variant={EInputButtonVariant.Link}
          size={ESize.Small}
          // disabled={!breadcrumb.pageUrl}
          href={breadcrumb.pageUrl}
        >
          <Text size={ESize.Xsmall} color={[EColor.Black, 700]}>
            {breadcrumb.menuTitle}
          </Text>
        </InputButton>
      ))}
    </Breadcrumb>
  )
}
