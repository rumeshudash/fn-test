import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';

//Vendor Onboarding with GSTIN Vendor Info Card
export const vendorGstinInfo: gstinDataType = {
    trade_name: 'Cloudtail India Private Limited',
    value: '27AAQCS4259Q1ZA',
    pan_number: 'AAQCS4259Q',
    business_type: 'Private Limited',
    address:
        'Sagar Tech Plaza, Andheri Kurla Road, Sakinaka, Unit No-117, Mumbai Suburban, , , 400072, , Maharashtra, NA, 1st Floor, ',
    status: 'Active',
};

//Vendor Onboarding with GSTIN Clinet Info Card
export const clientGstinInfo: gstinDataType = {
    trade_name: 'Hidesign India Pvt Ltd',
    value: '33AACCH0586R1Z6',
    business_type: 'Private Limited',
    address:
        'EXPRESS AVENUE, 49/50 L-WHITES ROAD, ROYAPETTAH, SHOP NO.S 161 B, Chennai, , , 600014, , Tamil Nadu, NA, FIRST FLOOR, ',
    pan_number: 'AACCH0586R',
    status: 'Active',
};

//For Vendor Managed Onboarding GSTIN
export const LOWER_TDS_DETAILS = {
    selectInput: 'Lower TDS',
    tdsCertNumber: '333333333',
    tdsPercentage: '22',
    date: '22-02-2023',
};

export const NON_GSTIN_LOWER_TDS_DETAILS = {
    selectInput: 'Lower TDS',
    tdsCertNumber: '10',
    date: '22-02-2023',
    tdsPercentage: '20',
};

//For Vendor Managed Onboarding GSTIN
export const BANKDETAILS = {
    bankName: vendorGstinInfo.trade_name,
    accountNumber: '1234567',
    ifsc: 'HDFC0000002',
    address: 'HDFC0000002,MUMBAI - KHAR WEST',
};

//For Vendor Managed Onboarding NON GSTIN
export const NON_GSTIN_BANK_DETAILS_ONE = {
    bankName: 'ABC Pvt Ltd',
    accountNumber: '12345678',
    ifsc: 'HDFC0000009',
    address: 'HDFC0000009, Bangalore - Kasturba Gandhi Marg ',
};

//For Vendor Managed Onboarding Client Connect NON GSTIN
export const NON_GSTIN_BANK_DETAILS_TWO = {
    bankName: 'ABD Pvt Ltd',
    accountNumber: '1234567',
    ifsc: 'HDFC0000002',
    address: 'HDFC0000002,MUMBAI - KHAR WEST',
};

export const IMAGE_NAME = 'pan-card.jpg';
export const MSME_NUMBER = '22';
export const PAN_CARD = '20';
export const COI_NUMBER = '23332567';
export const PICK_DATE = '20-06-2023';
export const PAN_CODE_ADDRESS = 'New Delhi Central, Delhi';

//Data used in Business Managed Onboarding with GSTIN
export const businessVendorGstin: gstinDataType = {
    trade_name: 'D Mart',
    value: '29AKAPD8772G1Z0',
    pan_number: 'AKAPD8772G',
    business_type: 'Proprietorship',
    address:
        'CITY TOWER, SULTANPET MAIN ROAD, BENGALURU, SHOP NO. 204/15, Bengaluru Urban, 560053, Karnataka, NA, 1ST FLOOR',
    status: 'Active',
};

//For Vendor and Client Info to fill
export const VendorClientInfo = {
    trade_name: 'Hidesign India Pvt Ltd', //Client Business Name
    displayName: businessVendorGstin.trade_name.slice(5),
    value: businessVendorGstin.value, //Vendor GSTIN
    vendorEmail: 'meatshop@gmail.com',
    vendorNumber: '9876543210',
};
//For checking client info from card
export const ClientBusinessDetails: gstinDataType = {
    trade_name: 'Hidesign India Pvt Ltd',
    value: '33AACCH0586R1Z6',
    status: 'Active',
    pan_number: '',
    business_type: '',
    address: '',
};

//Data used in Business Managed Onboarding without GSTIN
export const VendorInfo_NonGstin = {
    businessName: ClientBusinessDetails.trade_name.slice(0, 7),
    vendorBusiness: 'listed without GST',
    // displayName: 'Motors Pvt Ltd',
    pinCode: '110001',
    address: 'Delhi',
    businessType: 'Private Limited',
    vendorEmail: 'PineApple@PineApple.com',
    vendorNumber: '9876543210',
};

//For Designation Info
//Click Checkout Create and Save Another Designation
export const designationInfo_Save_And_Create = {
    name: 'Testing Save_Create039',
};

//Create Designation Info
export const Create_Designation_Info = {
    name: 'Testing Designation022',
};

export const designationUpdateInfo = {
    name: 'Updating Designation023',
};

//Update Designation Info from Details Page
export const designationInfo = {
    name: designationUpdateInfo.name,
};

//designationInfo must be valid to change in details page
export const designation_details_page_Info = {
    name: Create_Designation_Info.name,
};

//Add Employee in Designation field
export const employeeInfo = {
    name: 'CTO',
    email: 'testemploye1213@email.com',
    employee_code: 'EMPP1213',
    department: 'Test',
    grade: 'E2',
    reporting_manager: 'Amit Raj',
    approval_mananger: 'Ravi',
    notes: 'Adding Notes for testing',
    IMAGE_NAME: 'pan-card.jpg',
    comments: 'Testing upload document comments',
};

//For Payment Modes in Configuration
export const paymentMode_Save_And_Create = {
    name: 'Test Payment SnC1',
    type: 'Cheque',
    bank: '111111',
};
export const paymentModeInfo = {
    name: 'Test Payment0',
    type: 'Cash',
    bank: paymentMode_Save_And_Create.bank,
    updateName: 'Test Mode Update',
};

//For Employee Creation in HR

export const employeeCreationInfo_SaveAndCreate = {
    name: 'Admin SnC7',
    email: 'employeecreationSnc7@test.com',
    employee_code: 'EC0037',
    department: 'Test',
    designation: 'Chief Marketing Officer',
    grade: 'E3',
    reporting_manager: 'Amit Raj',
    approval_mananger: 'Ravi',
    notes: 'Adding Notes for testing',
};

export const employeeCreationInfo = {
    name: 'Admin Create7',
    email: 'employeecreation7@test.com',
    status: 'Active',
    employee_code: 'EC07',
    department: 'Test',
    designation: 'Chief Marketing Officer',
    grade: 'E3',
    reporting_manager: 'Amit Raj',
    approval_mananger: 'Ravi',
    notes: 'Adding Notes for testing',
};
