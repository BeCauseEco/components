import { samples, interpolate, formatHex } from "culori"

export enum EColor {
  Black = "#000000",
  White = "#FFFFFF",
  Transparent = "#FFFFFF00",
  Primary = "#4E4073",
  Secondary = "#57BAAF",
  Tertiary = "#D7444F",
  Quarternary = "#1F73B7",
  Quinary = "#F8685B",
  SDG1 = "#EA263D",
  SDG2 = "#D8A93F",
  SDG3 = "#37A557",
  SDG4 = "#C8263F",
  SDG5 = "#EF4C3D",
  SDG6 = "#20B8DC",
  SDG7 = "#FCBE38",
  SDG8 = "#981D41",
  SDG9 = "#F3793A",
  SDG10 = "#E2238F",
  SDG11 = "#F8A640",
  SDG12 = "#D3973F",
  SDG13 = "#54814B",
  SDG14 = "#1289C2",
  SDG15 = "#4DB85A",
  SDG16 = "#0A6294",
  SDG17 = "#1D4072",
  Success = "#5AB884",
  Warning = "#F3B359",
  Error = "#DF5052",
}

export type TLightness = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000

export type TColor = [EColor, TLightness] | [EColor.White] | [EColor.Transparent]

export const computeColor = (color: TColor) => {
  const baseColor = color[0]
  const lightness = color[1] || 700

  try {
    if (baseColor === EColor.Transparent) {
      return baseColor
    } else {
      const colorsLight = samples(28)
        .map(interpolate<"oklab">(["#ffffff", baseColor]))
        .map(formatHex)

      const colorsMedium = samples(18)
        .map(interpolate<"oklab">(["#ffffff", baseColor]))
        .map(formatHex)

      const colorsDark = samples(8)
        .map(interpolate<"oklab">([baseColor, "#000000"]))
        .map(formatHex)

      const combined = [
        colorsLight[1],
        colorsMedium[2],
        colorsMedium[6],
        colorsMedium[8],
        colorsMedium[10],
        colorsMedium[12],
        colorsMedium[14],
        colorsMedium[17],
        colorsDark[1],
        colorsDark[2],
        colorsDark[3],
      ]

      return combined[lightness === 50 ? 0 : lightness / 100]
    }
  } catch (e) {
    throw "Color.ts - missing color* property on component. Run a local build (`yarn build`) to type-check for missing color properties."
  }
}

export const generateColorPallette = () => {
  console.log("---")
  Object.keys(EColor).forEach(key => {
    console.log(`"${key}":`)
    if (key === "White") {
      console.log(EColor.White)
    } else if (key === "Transparent") {
      // ...
    } else {
      const lightness = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
      lightness.forEach(l => {
        try {
          console.log(`lightness ${l}:`, computeColor([EColor[key], l as TLightness]))
        } catch (e) {
          console.error(e)
        }
      })
    }

    console.log("---")
  })
}
