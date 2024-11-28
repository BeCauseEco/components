// import styled from "@emotion/styled"
// import { Composition } from "@new/Composition/Composition"
// import { PropsWithChildren } from "react"
// import { LayoutChrome } from "./internal/LayoutChrome"
// import { Color } from "@new/Color"
// import { EInputButtonVariant, InputButton } from "@new/InputButton/InputButton"
// import { Size } from "@new/Size"
// import { Icon } from "@new/Icon/Icon"
// import { Spacer } from "@new/Stack/Spacer"
// import { Breadcrumbs } from "@new/Chrome/Breadcrumbs"
// // import { useActiveMenuStructure } from "@new/Chrome/hooks/useActiveMenuStructure"
// // import { useGetCurrentMenuPageItem } from "@new/Chrome/hooks/useGetCurrentMenuPageItem"
// // import { Text } from "@new/Text/Text"

// const Container = styled.div({
//   display: "flex",
//   flexDirection: "column",
//   backgroundColor: "white",
//   width: "100%",
//   height: "100%",
// })

// export type TChrome = {}

// export const Chrome = ({ children }: PropsWithChildren<TChrome>) => {
//   // const { activeMenuStructure } = useActiveMenuStructure()
//   // const { breadcrumbs } = useGetCurrentMenuPageItem()

//   // const firstSelectedMenuItem = activeMenuStructure.find(m => m.menuPage.id === breadcrumbs?.[0]?.id)

//   const activeMenuStructure = [{ menuPage: { id: "", pageUrl: "" } }]

//   return (
//     <Container>
//       <Composition>
//         <LayoutChrome
//           contentBreadcrumbs={<Breadcrumbs />}
//           contentPrimaryNavigation={activeMenuStructure?.map(menuItem => (
//             <>
//               <InputButton
//                 key={menuItem.menuPage?.id}
//                 variant={EInputButtonVariant.Link}
//                 size={Size.Medium}
//                 href={menuItem.menuPage?.pageUrl as string}
//               >
//                 <Icon name="settings" color={[Color.White]} size={Size.Medium} />
//               </InputButton>

//               <Spacer small />
//             </>
//           ))}
//           contentSecondaryNavigation={
//             <>
//               {/* {firstSelectedMenuItem?.children.map(menuItem => (
//                 <>
//                   <InputButton
//                     key={firstSelectedMenuItem?.menuPage.id}
//                     variant={EInputButtonVariant.Link}
//                     size={Size.Medium}
//                     href={menuItem.menuPage.pageUrl}
//                   >
//                     <Text size={Size.Xsmall} color={[Color.Neutral, 700]}>
//                       {menuItem.menuPage.menuTitle}
//                     </Text>
//                   </InputButton>

//                   <Spacer small />
//                 </>
//               ))} */}
//             </>
//           }
//           contentTertiaryNavigation={
//             <>
//               <InputButton variant={EInputButtonVariant.Solid} color={Color.Primary} size={Size.Medium}>
//                 <Icon name="settings" color={[Color.White]} size={Size.Medium} />
//               </InputButton>

//               <Spacer small />

//               <InputButton variant={EInputButtonVariant.Solid} color={Color.Primary} size={Size.Medium}>
//                 <Icon name="logout" color={[Color.White]} size={Size.Medium} />
//               </InputButton>
//             </>
//           }
//           contentMain={children}
//         />
//       </Composition>
//     </Container>
//   )
// }
