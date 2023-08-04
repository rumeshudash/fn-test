interface LocatorOptions {
  role?: LocatorRoles;
  id?: string;
  placeholder?: string;
  name?: string;
  text?: string | RegExp;
  label?: string;
  class?: string[];
}

type LocatorRoles =
  | "alert"
  | "alertdialog"
  | "application"
  | "article"
  | "banner"
  | "blockquote"
  | "button"
  | "caption"
  | "cell"
  | "checkbox"
  | "code"
  | "columnheader"
  | "combobox"
  | "complementary"
  | "contentinfo"
  | "definition"
  | "deletion"
  | "dialog"
  | "directory"
  | "document"
  | "emphasis"
  | "feed"
  | "figure"
  | "form"
  | "generic"
  | "grid"
  | "gridcell"
  | "group"
  | "heading"
  | "img"
  | "insertion"
  | "link"
  | "list"
  | "listbox"
  | "listitem"
  | "log"
  | "main"
  | "marquee"
  | "math"
  | "meter"
  | "menu"
  | "menubar"
  | "menuitem"
  | "menuitemcheckbox"
  | "menuitemradio"
  | "navigation"
  | "none"
  | "note"
  | "option"
  | "paragraph"
  | "presentation"
  | "progressbar"
  | "radio"
  | "radiogroup"
  | "region"
  | "row"
  | "rowgroup"
  | "rowheader"
  | "scrollbar"
  | "search"
  | "searchbox"
  | "separator"
  | "slider"
  | "spinbutton"
  | "status"
  | "strong"
  | "subscript"
  | "superscript"
  | "switch"
  | "tab"
  | "table"
  | "tablist"
  | "tabpanel"
  | "term"
  | "textbox"
  | "time"
  | "timer"
  | "toolbar"
  | "tooltip"
  | "tree"
  | "treegrid"
  | "treeitem";

interface ExpenseDetailInputs {
  to?: string;
  to_nth?: number;
  from?: string;
  from_nth?: number;
  amount: number;
  taxable_amount: number;
  department?: string;
  expense_head?: string;
  poc?: string;
  pay_to?: string;
  desc?: string;
}

interface AddTaxesData {
  gst?: string;
  cess?: string;
  tds?: string;
  tcs?: string;
}

interface SignupDetailsInput {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface CreateBusinessInput {
  business_name: string;
}