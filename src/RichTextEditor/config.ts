export const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
}

export const LIST_TYPES = ["numbered-list", "bulleted-list"]

export type ToolbarItem = {
  format: string
  label: string
  iconName: string
}

export const TOOLBAR_ITEMS = {
  marks: [
    {
      format: "bold",
      label: "Bold",
      iconName: "format_bold",
    },
    {
      format: "italic",
      label: "Italic",
      iconName: "format_italic",
    },
    {
      format: "underline",
      label: "Underline",
      iconName: "format_underlined",
    },
    {
      format: "code",
      label: "Code",
      iconName: "code",
    },
  ] as ToolbarItem[],
  blocks: [
    {
      format: "heading-one",
      label: "Heading 1",
      iconName: "looks_one",
    },
    {
      format: "heading-two",
      label: "Heading 2",
      iconName: "looks_two",
    },
    {
      format: "block-quote",
      label: "Quote",
      iconName: "format_quote",
    },
    {
      format: "numbered-list",
      label: "Numbered list",
      iconName: "format_list_numbered",
    },
    {
      format: "bulleted-list",
      label: "Bulleted list",
      iconName: "format_list_bulleted",
    },
  ] as ToolbarItem[],
  tooltip: { format: "tooltip", label: "Tooltip (wrap selection)", iconName: "info" },
  link: { label: "Link (wrap selection)" },
}
