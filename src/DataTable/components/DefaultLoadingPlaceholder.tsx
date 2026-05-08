interface DefaultLoadingPlaceholderProps {
  text: string
  showSpinner: boolean
}

export const DefaultLoadingPlaceholder = ({ text, showSpinner }: DefaultLoadingPlaceholderProps) => {
  return (
    <div className="tw flex h-[500px] w-full items-center justify-center rounded border border-dashed border-black/10 bg-black/[0.02]">
      {showSpinner ? (
        <svg
          className="h-10 w-10 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Loading"
        >
          <circle cx="12" cy="12" r="10" stroke="#e0e0e0" strokeWidth="3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#7E6DAD" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        <span className="text-sm italic text-neutral-700">{text}</span>
      )}
    </div>
  )
}
