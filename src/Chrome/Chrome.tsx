import styled from "@emotion/styled"
import { Composition } from "@new/Composition/Composition"
import { PropsWithChildren } from "react"
import { LayoutChrome } from "./LayoutChrome"
import { EColor } from "@new/Color"
import { EInputButtonVariant, InputButton } from "@new/InputButton/InputButton"
import { ESize } from "@new/ESize"
import { Icon } from "@new/Icon/Icon"
import { Spacer } from "@new/Spacer/Spacer"
import { Breadcrumbs } from "@new/Chrome/Breadcrumbs"
// import { useActiveMenuStructure } from "@new/Chrome/hooks/useActiveMenuStructure"
// import { useGetCurrentMenuPageItem } from "@new/Chrome/hooks/useGetCurrentMenuPageItem"
// import { Text } from "@new/Text/Text"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  width: "100%",
  height: "100%",
})

export type TChrome = {}

export const Chrome = ({ children }: PropsWithChildren<TChrome>) => {
  // const { activeMenuStructure } = useActiveMenuStructure()
  // const { breadcrumbs } = useGetCurrentMenuPageItem()

  // const firstSelectedMenuItem = activeMenuStructure.find(m => m.menuPage.id === breadcrumbs?.[0]?.id)

  const activeMenuStructure = [{ menuPage: { id: "", pageUrl: "" } }]

  return (
    <Container>
      <Composition>
        <LayoutChrome
          contentBreadcrumbs={<Breadcrumbs />}
          contentPrimaryNavigation={activeMenuStructure?.map(menuItem => (
            <>
              <InputButton
                key={menuItem.menuPage?.id}
                variant={EInputButtonVariant.Link}
                size={ESize.Medium}
                href={menuItem.menuPage?.pageUrl as string}
              >
                <Icon name="settings" color={[EColor.White]} size={ESize.Medium} />
              </InputButton>
              <Spacer size={ESize.Xsmall} />
            </>
          ))}
          contentSecondaryNavigation={
            <>
              {/* {firstSelectedMenuItem?.children.map(menuItem => (
                <>
                  <InputButton
                    key={firstSelectedMenuItem?.menuPage.id}
                    variant={EInputButtonVariant.Link}
                    size={ESize.Medium}
                    href={menuItem.menuPage.pageUrl}
                  >
                    <Text size={ESize.Xsmall} color={[EColor.Black, 700]}>
                      {menuItem.menuPage.menuTitle}
                    </Text>
                  </InputButton>

                  <Spacer size={ESize.Xsmall} />
                </>
              ))} */}
            </>
          }
          contentTertiaryNavigation={
            <>
              <InputButton variant={EInputButtonVariant.Solid} color={EColor.Primary} size={ESize.Medium}>
                <Icon name="settings" color={[EColor.White]} size={ESize.Medium} />
              </InputButton>

              <Spacer size={ESize.Xsmall} />

              <InputButton variant={EInputButtonVariant.Solid} color={EColor.Primary} size={ESize.Medium}>
                <Icon name="logout" color={[EColor.White]} size={ESize.Medium} />
              </InputButton>
            </>
          }
          contentMain={children}
        />
      </Composition>
    </Container>
  )
}
