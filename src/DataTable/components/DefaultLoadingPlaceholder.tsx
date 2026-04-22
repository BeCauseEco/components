import { Text } from "@new/Text/Text"
import { Color } from "@new/Color"

interface DefaultLoadingPlaceholderProps {
  text: string
  showSpinner: boolean
}

export const DefaultLoadingPlaceholder = ({ text, showSpinner }: DefaultLoadingPlaceholderProps) => {
  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        borderRadius: "4px",
        border: "1px dashed rgba(0, 0, 0, 0.1)",
      }}
    >
      {showSpinner ? (
        <svg
          style={{ width: "40px", height: "40px", animation: "spin 1s linear infinite" }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Loading"
        >
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          <circle cx="12" cy="12" r="10" stroke="#e0e0e0" strokeWidth="3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#7E6DAD" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        <Text small fill={[Color.Neutral, 700]}>
          <i>{text}</i>
        </Text>
      )}
    </div>
  )
}
