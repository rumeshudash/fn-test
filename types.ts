interface LocatorOptions {
    role?: LocatorRoles;
    id?: string;
    placeholder?: string;
    name?: string;
    text?: string | RegExp;
    label?: string;
    type?: string;
    class?: string[];
    exactText?: boolean;
}

interface InputFieldLocatorOptions {
    selector?: string;
    placeholder?: string;
    label?: string;
    name?: string;
    type?: string;
    hasText?: string;
}

type LocatorRoles =
    | 'alert'
    | 'alertdialog'
    | 'application'
    | 'article'
    | 'banner'
    | 'blockquote'
    | 'button'
    | 'caption'
    | 'cell'
    | 'checkbox'
    | 'code'
    | 'columnheader'
    | 'combobox'
    | 'complementary'
    | 'contentinfo'
    | 'definition'
    | 'deletion'
    | 'dialog'
    | 'directory'
    | 'document'
    | 'emphasis'
    | 'feed'
    | 'figure'
    | 'form'
    | 'generic'
    | 'grid'
    | 'gridcell'
    | 'group'
    | 'heading'
    | 'img'
    | 'insertion'
    | 'link'
    | 'list'
    | 'listbox'
    | 'listitem'
    | 'log'
    | 'main'
    | 'marquee'
    | 'math'
    | 'meter'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'menuitemcheckbox'
    | 'menuitemradio'
    | 'navigation'
    | 'none'
    | 'note'
    | 'option'
    | 'paragraph'
    | 'presentation'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'region'
    | 'row'
    | 'rowgroup'
    | 'rowheader'
    | 'scrollbar'
    | 'search'
    | 'searchbox'
    | 'separator'
    | 'slider'
    | 'spinbutton'
    | 'status'
    | 'strong'
    | 'subscript'
    | 'superscript'
    | 'switch'
    | 'tab'
    | 'table'
    | 'tablist'
    | 'tabpanel'
    | 'term'
    | 'textbox'
    | 'time'
    | 'timer'
    | 'toolbar'
    | 'tooltip'
    | 'tree'
    | 'treegrid'
    | 'treeitem';

interface LoginInfo {
    email?: string;
    password?: string;
    portal?: string;
    organization?: string;
}

interface ExpenseDetailInputs {
    to?: string;
    to_nth?: number;
    from?: string;
    from_nth?: number;
    invoice?: string;
    amount?: number;
    taxable_amount?: number;
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
interface ClientBusinessDetails {
    businessName: string;
    gstin: string;
}
interface ClientBankAccountDetails {
    accountNumber: string;
    ifsc: string;
    imagePath?: string;
}

interface VENDORACCOUNTDETAILS {
    businessName: string;
    vendorBusiness: string;
    displayName?: string;
    pinCode: string;
    address: string;
    businessType: string;
    vendorEmail: string;
    vendorNumber: string;
}

interface BUSINESSMANAGEDONBOARDING {
    businessName: string;
    gstin: string;
    vendorEmail: string;
    vendorNumber: string;
}
interface UploadDocuments {
    imagePath?: string;
    tdsCert?: string;
    tdsPercentage?: string;
}

interface VENDORDETAILS {
    businessName: string;
    displayName?: string;
    businessType: string;
    pinCode: string;
    address: string;
}

interface VENDORDOCUMENTDETAILS {
    selectInput?: string;
    imagePath?: string;
    tdsNumber?: string;
    date?: string;
    tdsPercentage?: string;
    msme?: string;
}

// interface BANKACCOUNTDETAILS {
//     bankAccount: string;
//     ifsc: string;
// }

interface DepartmentCreationData {
    name?: string;
    parent?: string;
    manager?: string;
    date?: string;
    identifier?: string;
}

interface EmployeeCreationData {
    name?: string;
    email?: string;
    department?: string;
    designation?: string;
    date?: string;
    identifier?: string;
    manager?: string;
    parent?: string;
}

interface UserGroupData {
    name?: string;
    manager?: string;
    description?: string;
    member?: string;
    memberEmail?: string;
    role?: string;
}
