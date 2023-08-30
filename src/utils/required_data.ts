import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';

//Vendor Onboarding with GSTIN
export const vendorGstinInfo: gstinDataType = {
    trade_name: 'Cloudtail India Private Limited',
    value: '27AAQCS4259Q1ZA',
    pan_number: 'AAQCS4259Q',
    business_type: 'Private Limited',
    address:
        'Sagar Tech Plaza, Andheri Kurla Road, Sakinaka, Unit No-117, Mumbai Suburban, , , 400072, , Maharashtra, NA, 1st Floor, ',
    status: 'Active',
};

export const clientGstinInfo: gstinDataType = {
    trade_name: 'Hidesign India Pvt Ltd',
    value: '33AACCH0586R1Z6',
    business_type: 'Private Limited',
    address:
        'EXPRESS AVENUE, 49/50 L-WHITES ROAD, ROYAPETTAH, SHOP NO.S 161 B, Chennai, , , 600014, , Tamil Nadu, NA, FIRST FLOOR, ',
    pan_number: 'AACCH0586R',
    status: 'Active',
};

export const LOWER_TDS_DETAILS = [
    {
        tdsCert: '333333333',
        tdsPercentage: '22',
    },
];

//Vendor Bank Account Details - (Client Invitation Vendor Managed)
export const BANKDETAILS = [
    {
        accountNumber: '1234567',
        ifsc: 'HDFC0000001',
        address: 'HDFC0000001, TULSIANI CHMBRS - NARIMAN PT ',
    },
];

export const IMAGE_NAME = 'pan-card.jpg';
export const MSME_NUMBER = '22';
export const COI_NUMBER = '23332567';
export const PICK_DATE = '20-06-2023';
