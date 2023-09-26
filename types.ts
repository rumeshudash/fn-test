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
interface SelectBoxLocatorOptions {
    option?: string | number;
    input?: string | number;
    selector?: string;
    placeholder?: string;
    label?: string;
    name?: string;
    hasText?: string;
    exact?: boolean;
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
interface BusinessDetails {
    to?: string;
    to_nth?: number;
    from?: string;
    from_nth?: number;
}
interface ExpenseDetailInputs {
    invoice?: string;
    date?: string;
    amount?: number;
    taxable_amount?: number;
    department?: string;
    expense_head?: string;
    poc?: string;
    pay_to?: string;
    employee?: string;
    desc?: string;
    comment?: string;
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

interface DepartmentCreationData {
    name?: string;
    NAME?: string;
    parent_id?: string;
    parent?: string;
    'PARENT DEPARTMENT'?: string;
    'APPROVAL MANAGER'?: string;
    manager_id?: string;
    date?: string;
    'ADDED AT'?: string;
    identifier?: string;
    status?: string;
}

interface EmployeeCreationData {
    name?: string;
    email?: string;
    department?: string;
    designation_id?: string;
    designation?: string;
    date?: string;
    identifier?: string;
    manager_id?: string;
    manager?: string;
    parent?: string;
}

interface UserGroupData {
    name?: string;
    manager_id?: string;
    manager?: string;
    description?: string;
    member?: string;
    memberEmail?: string;
    role_id?: string;
    status?: string;
}

interface BankDetails {
    'ACCOUNT NUMBER'?: string;
    'IFSC CODE'?: string;
    NAME?: string;
}

interface ApprovalDelegationData {
    DELEGATOR?: string;
    'START TIME'?: string;
    'END TIME'?: string;
    'ADDED AT'?: string;
    COMMENTS?: string;
}

interface StatusChangeData {
    name?: string;
    status?: string;
    colName?: string;
    // row?: LocatorRoles;
    hasDialog?: boolean;
}

interface DelegationFillData {
    delegated_id?: string;
    start_time?: string;
    end_time?: string;
    comments?: string;
}

interface ErrorType {
    name: string;
    message: string;
}
