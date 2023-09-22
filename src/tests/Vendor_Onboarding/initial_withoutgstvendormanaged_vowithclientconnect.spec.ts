// import { PROCESS_TEST } from '@/fixtures';
// import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';
// import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
// import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
// import { VendorOnboarding } from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
// import { generateRandomNumber } from '@/utils/common.utils';
// import { test } from '@playwright/test';
// import {
//     IMAGE_NAME,
//     NON_GSTIN_BANK_DETAILS_TWO,
//     NON_GSTIN_LOWER_TDS_DETAILS,
// } from '@/utils/required_data';
// import { nonGstinDataType } from '@/helpers/CommonCardHelper/genericNonGstin.card.helper';
// import chalk from 'chalk';
// import { VendorManagedWithoutGSTIN } from '@/helpers/VendorOnboardingHelper/vendorOnboardingWithoutGstin.helper';
// import { VendorInvitationDetails } from '@/helpers/VendorOnboardingHelper/InvitationDetails.helper';
// import { BankAccountDetails } from '@/helpers/VendorOnboardingHelper/bankDetails.helper';

// //Vendor and Client Details
// const vendorNonGstinInfo: nonGstinDataType = {
//     trade_name: 'ABD Pvt Ltd',
//     display_name: 'ABd Pvt Ltd',
//     business_type: 'Partnership Firm',
//     pin_code: '110002',
//     address: '123 Test address',
// };

// const clientGstinInfo: gstinDataType = {
//     trade_name: 'Hidesign India Pvt Ltd',
//     gstin: '33AACCH0586R1Z6',
//     business_type: 'Private Limited',
//     address:
//         'EXPRESS AVENUE, 49/50 L-WHITES ROAD, ROYAPETTAH, SHOP NO.S 161 B, Chennai, , , 600014, , Tamil Nadu, NA, FIRST FLOOR, ',
//     pan_number: 'AACCH0586R',
//     status: 'Active',
// };

// //Bank Details
// const NON_GSTIN_BANK_DETAILS_CLIENT_CONNECTS = [
//     {
//         bankName: 'ABD Pvt Ltd',
//         accountNumber: '1234567',
//         ifsc: 'HDFC0000009',
//         address: 'HDFC0000009, Bangalore - Kasturba Gandhi Marg ',
//     },
// ];

// let bankAccountNumber: string;

// const { expect, describe } = PROCESS_TEST;

// //Vendor Managed with Client Connect
// describe('TCVO004', () => {
//     PROCESS_TEST('TCVO004', async ({ page }) => {
//         const withnogstin = new VendorManagedWithoutGSTIN(
//             vendorNonGstinInfo,
//             page
//         );
//         const vendorOnboarding = new VendorOnboarding(
//             NON_GSTIN_LOWER_TDS_DETAILS,
//             page
//         );
//         const invitationDetails = new VendorInvitationDetails(
//             NON_GSTIN_BANK_DETAILS_TWO,
//             NON_GSTIN_LOWER_TDS_DETAILS,
//             page
//         );
//         const getBankDetails = new BankAccountDetails(
//             NON_GSTIN_BANK_DETAILS_TWO,
//             page
//         );

//         // const vendorOnboarding = new VendorOnboarding(vendorNonGstinInfo, page);
//         await withnogstin.clickLinkInviteVendor('Vendor Invitations');
//         await vendorOnboarding.clickCopyLink();
//         await vendorOnboarding.notification.checkToastSuccess(
//             'Link Successfully Copied!!!'
//         );
//         // expect(
//         //     await withnogstin.toastMessage(),
//         //     chalk.red('ToastMessage match')
//         // ).toBe('Link Successfully Copied!!!');

//         await PROCESS_TEST.step('Open Copied Link', async () => {
//             const URL = await vendorOnboarding.linkURL();
//             await vendorOnboarding.closeDialog();
//             await vendorOnboarding.logOut();
//             await vendorOnboarding.init(URL);
//         });

//         await PROCESS_TEST.step('Signup - Vendor Onboarding', async () => {
//             test.slow();
//             await withnogstin.clickButton('Sign Up');
//             const signup = new SignupHelper(page);
//             await signup.fillSignup({
//                 name: 'User130823',
//                 email: `User${generateRandomNumber()}@test.com`,
//                 password: '123456',
//                 confirm_password: '123456',
//             });
//             await signup.clickButton('Next');
//             test.slow();
//         });

//         //Verifies account after signup
//         await PROCESS_TEST.step('Verify Email', async () => {
//             const verifyEmail = new VerifyEmailHelper(page);
//             await verifyEmail.fillCode('1');
//             await verifyEmail.clickButton('Verify →');
//             await withnogstin.clickButton('Continue →');
//         });

//         await PROCESS_TEST.step('Create Business Client', async () => {
//             await withnogstin.clickButton('Create New Business');
//             await withnogstin.setCheckbox('No');
//         });

//         await PROCESS_TEST.step('Fill Business Details', async () => {
//             await withnogstin.fillVendorDetails([vendorNonGstinInfo]);
//             await withnogstin.clickButton('Next');
//             await vendorOnboarding.notification.checkToastSuccess(
//                 'Successfully saved'
//             );
//             // expect(
//             //     await withnogstin.toastMessage(),
//             //     chalk.red('Toast message does not occured')
//             // ).toBe('Successfully saved');
//         });

//         await PROCESS_TEST.step('Fill Document Details', async () => {
//             await vendorOnboarding.fillDocuments();
//             await withnogstin.clickButton('Next');
//         });

//         await PROCESS_TEST.step('Fill Bank Account Details', async () => {
//             test.slow();

//             await getBankDetails.fillBankAccount();
//             await withnogstin.checkWizardNavigationClickDocument(
//                 'Bank Account'
//             );
//         });
//         await PROCESS_TEST.step('Verify Bank Account Details', async () => {
//             const ifscBankDetails =
//                 await getBankDetails.vendorIfscDetailsValidation();
//             expect(ifscBankDetails, chalk.red('Bank IFSC Code match')).toBe(
//                 getBankDetails.bankDetails.address
//             );
//             await getBankDetails.vendorIfscLogoVisibilityValidation();
//             await withnogstin.clickButton('Previous');
//             await withnogstin.clickButton('Next');

//             await getBankDetails.fillBankAccount();
//             await withnogstin.checkWizardNavigationClickDocument(
//                 'Bank Account'
//             );
//             await withnogstin.clickButton('Next');

//             expect(
//                 await page.getByText('Onboarding Completed').isVisible(),
//                 chalk.red('Onboarding Completed text visibility')
//             ).toBe(true);
//             await withnogstin.clickButton('Close');
//         });

//         await PROCESS_TEST.step('Without GSTIN Client Connect', async () => {
//             await withnogstin.clickButton('Connect');
//         });
//         await PROCESS_TEST.step('Client Invitation Field', async () => {
//             // await vendorOnboarding.clientInvitation(
//             //     vendorNonGstinInfo.trade_name,
//             //     ''
//             // );

//             await withnogstin.clickButton('Next');
//             await vendorOnboarding.uploadImageDocuments();

//             await withnogstin.clickButton('Submit');

//             //Adding custom Timeout
//             test.slow();
//             await vendorOnboarding.notification.checkToastSuccess(
//                 'Successfully saved'
//             );
//             // expect(
//             //     await withnogstin.toastMessage(),
//             //     chalk.red('ToastMessage match')
//             // ).toBe('Successfully created');
//         });

//         await PROCESS_TEST.step('Client Verify and Approve', async () => {
//             expect(
//                 await invitationDetails.checkNonGstinFrom(),
//                 chalk.red('Business Name does not matched')
//             ).toBe(vendorNonGstinInfo.trade_name);
//             expect(
//                 await invitationDetails.checkNonGstinClient(),
//                 chalk.red('Client Name does not matched')
//             ).toBe(clientGstinInfo.trade_name + ' ');

//             expect(
//                 await invitationDetails.checkGstinFromNonGstin(),
//                 chalk.red('GSTIN does not matched')
//             ).toBe('Not Registered Business');
//             expect(
//                 await invitationDetails.checkNonGstinClientGSTIN(),
//                 chalk.red('Client Gstin does not matched')
//             ).toBe(clientGstinInfo.gstin);
//         });

//         await PROCESS_TEST.step('Check Uploaded Doucments', async () => {
//             await invitationDetails.checkDocument('COI');
//             await invitationDetails.checkDocument('Pan Card');
//             await invitationDetails.checkDocument('MSME');
//             await invitationDetails.checkDocument('Lower TDS');
//             await invitationDetails.checkDocument('Bank');
//         });
//     });
// });
