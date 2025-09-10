import { Box, CircularProgress } from "@mui/material"
import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"

interface DefaultLoadingPlaceholderProps {
  text: string
  showSpinner: boolean
}

export const DefaultLoadingPlaceholder = ({ text, showSpinner }: DefaultLoadingPlaceholderProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        borderRadius: 1,
        border: "1px dashed rgba(0, 0, 0, 0.1)",
      }}
    >
      {showSpinner ? (
        <CircularProgress />
      ) : (
        <Text small fill={[Color.Neutral, 700]}>
          <i>{text}</i>
        </Text>
      )}
    </Box>
  )
}
