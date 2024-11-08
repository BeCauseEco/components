// import { Color } from "@new/Color"
// import { EInputButtonVariant, InputButton } from "@new/InputButton/InputButton"
// import { Size } from "@new/Size"
// import { Text } from "@new/Text/Text"
// import { Breadcrumb } from "@new/Breadcrumb/Breadcrumb"
// // import { useGetCurrentMenuPageItem } from "@new/Chrome/hooks/useGetCurrentMenuPageItem"

// export type TBreadcrumbs = {}

// export const Breadcrumbs = () => {
//   // const { breadcrumbs } = useGetCurrentMenuPageItem()

//   const breadcrumbs = [{ id: "", pageUrl: "", menuTitle: "" }]

//   return (
//     <Breadcrumb color={Color.Black}>
//       {breadcrumbs.map(breadcrumb => (
//         <InputButton
//           key={breadcrumb.id}
//           variant={EInputButtonVariant.Link}
//           size={Size.Small}
//           // disabled={!breadcrumb.pageUrl}
//           href={breadcrumb.pageUrl}
//         >
//           <Text size={Size.Xsmall} color={[Color.Black, 700]}>
//             {breadcrumb.menuTitle}
//           </Text>
//         </InputButton>
//       ))}
//     </Breadcrumb>
//   )
// }
