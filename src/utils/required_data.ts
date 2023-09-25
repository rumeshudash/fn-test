import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';

//Vendor Onboarding with GSTIN Vendor Info Card
export const vendorGstinInfo: gstinDataType = {
    trade_name: 'Cloudtail India Private Limited',
    gstin: '27AAQCS4259Q1ZA',
    pan_number: 'AAQCS4259Q',
    business_type: 'Private Limited',
    address:
        'Sagar Tech Plaza, Andheri Kurla Road, Sakinaka, Unit No-117, Mumbai Suburban, , , 400072, , Maharashtra, NA, 1st Floor, ',
    status: 'Active',
};

//Vendor Onboarding with GSTIN Clinet Info Card

//For Vendor Managed Onboarding NON GSTIN

export const IMAGE_NAME = 'invoice3.png';
export const MSME_NUMBER = '22';
export const PAN_CARD = 'BAJPC4350M';
export const COI_NUMBER = '23332567';
export const PICK_DATE = '20-06-2023';
export const PAN_CODE_ADDRESS = 'New Delhi Central, Delhi';

//For Vendor and Client Info to fill

//For checking client info from card
export const ClientBusinessDetails: gstinDataType = {
    trade_name: 'Hidesign India Pvt Ltd',
    gstin: '33AACCH0586R1Z6',
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

//For Employee Creation in HR

//Add Documents
export const DocumentInfo = {
    comment: {
        comments: 'Adding Document',
    },
    document: {
        file: 'pan-card.jpg',
    },
};
