import { ReactElement } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { computeColor, EColor } from "@new/Color"
import { Composition } from "@new/Composition/Composition"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { Align } from "@new/Align/Align"

const Container = styled.div({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  height: "100%",
  outline: "solid 1px red",
})

const Breadcrumbs = styled.div({
  display: "flex",
  flexDirection: "row",
  borderBottom: `solid 1px ${computeColor([EColor.Black, 100])}`,
  height: "calc(var(--BU) * 12)",
})

const SidebarPrimaryAndTertiary = styled.div({
  display: "flex",
  flexDirection: "column",
})

const LayoutSidebarPrimaryAndTertiary = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  padding: "calc(var(--BU) * 4)",

  backgroundColor: "#1F1A2E",
  width: "92px",
})

const ItemSidebarPrimaryAndTertiary = styled.div({
  display: "flex",
  flexDirection: "column",
})

const SidebarSecondary = styled.div({
  display: "flex",
  flexDirection: "column",
})

const LayoutSidebarSecondary = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "calc(var(--BU) * 4)",
})

const CombinedOuter = styled.div({
  display: "flex",
  flexDirection: "row",
  width: "100%",
})

const CombinedInner = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
})

const Main = styled.div({
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
})

export type TLayoutChrome = TLayoutBase & {
  contentBreadcrumbs: ReactElement
  contentPrimaryNavigation: ReactElement | ReactElement[]
  contentSecondaryNavigation: ReactElement | ReactElement[]
  contentTertiaryNavigation: ReactElement | ReactElement[]
  contentMain: ReactElement | ReactElement[]
}

export const LayoutChrome = ({
  contentBreadcrumbs,
  contentPrimaryNavigation,
  contentSecondaryNavigation,
  contentTertiaryNavigation,
  contentMain,
}: TLayoutChrome) => {
  return (
    <Container>
      <SidebarPrimaryAndTertiary>
        <Composition>
          <BackgroundCard colorBackground={[EColor.Primary, 700]} />

          <LayoutSidebarPrimaryAndTertiary>
            <>
              <ItemSidebarPrimaryAndTertiary>{contentPrimaryNavigation}</ItemSidebarPrimaryAndTertiary>

              <ItemSidebarPrimaryAndTertiary>{contentTertiaryNavigation}</ItemSidebarPrimaryAndTertiary>
            </>
          </LayoutSidebarPrimaryAndTertiary>
        </Composition>
      </SidebarPrimaryAndTertiary>

      <CombinedOuter>
        <SidebarSecondary>
          <Composition>
            <BackgroundCard colorBackground={[EColor.Black, 50]} />

            <LayoutSidebarSecondary>{contentSecondaryNavigation}</LayoutSidebarSecondary>
          </Composition>
        </SidebarSecondary>

        <CombinedInner>
          <Breadcrumbs>
            <Align column middle>
              {contentBreadcrumbs}
            </Align>
          </Breadcrumbs>

          <Main>{contentMain}</Main>
        </CombinedInner>
      </CombinedOuter>
    </Container>
  )
}
