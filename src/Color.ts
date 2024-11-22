import { samples, interpolate, formatHex } from "culori"

//Simplistic approach taken from:
//https://medium.com/@steve.alves2/how-to-type-hex-colors-in-typescript-3c3b9a32baa7
//It does not guard against invalid hex values due to an incorrect string such as ##000000, but it does provide a simplistic check, and is a simple solution for now.
export type THexColor = `#${string}`

export enum Color {
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

export type Lightness = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000

export type ColorWithLightness = [Color, Lightness] | [Color.White] | [Color.Transparent] | [THexColor, Lightness]

export const computeColor = (color: ColorWithLightness) => {
  const c = color[0]
  const l = color[1] || 700

  try {
    if (c === Color.Transparent) {
      return c
    } else {
      const colorsLight = samples(28)
        .map(interpolate<"oklab">(["#ffffff", c]))
        .map(formatHex)

      const colorsMedium = samples(18)
        .map(interpolate<"oklab">(["#ffffff", c]))
        .map(formatHex)

      const colorsDark = samples(8)
        .map(interpolate<"oklab">([c, "#000000"]))
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

      return combined[l === 50 ? 0 : l / 100]
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      "Color.ts - missing color* property on component. Run a local build (`yarn build`) to type-check for missing color properties.",
    )
  }
}

export const replaceColorComponent = (colorWithLightness: ColorWithLightness, color: Color): ColorWithLightness => {
  return [color, colorWithLightness[1] || 700]
}

export const replaceLightnessComponent = (
  colorWithLightness: ColorWithLightness,
  lightness: Lightness,
): ColorWithLightness => {
  return [colorWithLightness[0], lightness]
}

export const generateColorPallette = () => {
  throw "generateColorPallette: comment out the code before running"
  // console.log("---")
  // Object.keys(Color).forEach(key => {
  //   console.log(`"${key}":`)
  //   if (key === "White") {
  //     console.log(Color.White)
  //   } else if (key === "Transparent") {
  //     // ...
  //   } else {
  //     const lightness = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
  //     lightness.forEach(l => {
  //       try {
  //         console.log(`lightness ${l}:`, computeColor([Color[key], l as TLightness]))
  //       } catch (e) {
  //         console.error(e)
  //       }
  //     })
  //   }

  //   console.log("---")
  // })
}
