import { PROCESS_TEST } from '@/fixtures';
import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import {
    BankAccountDetails,
    VendorInvitationDetails,
    VendorOnboarding,
} from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import {
    IMAGE_NAME,
    NON_GSTIN_BANK_DETAILS_TWO,
    NON_GSTIN_LOWER_TDS_DETAILS,
} from '@/utils/required_data';
import { VendorManagedWithoutGSTIN } from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { nonGstinDataType } from '@/helpers/CommonCardHelper/genericNonGstin.card.helper';

//Vendor and Client Details
const vendorNonGstinInfo: nonGstinDataType = {
    trade_name: 'ABD Pvt Ltd',
    display_name: 'ABd Pvt Ltd',
    business_type: 'Partnership Firm',
    pin_code: '110002',
    address: '123 Test address',
};

const clientGstinInfo: gstinDataType = {
    trade_name: 'Hidesign India Pvt Ltd',
    value: '33AACCH0586R1Z6',
    business_type: 'Private Limited',
    address:
        'EXPRESS AVENUE, 49/50 L-WHITES ROAD, ROYAPETTAH, SHOP NO.S 161 B, Chennai, , , 600014, , Tamil Nadu, NA, FIRST FLOOR, ',
    pan_number: 'AACCH0586R',
    status: 'Active',
};

//Bank Details
const NON_GSTIN_BANK_DETAILS_CLIENT_CONNECTS = [
    {
        bankName: 'ABD Pvt Ltd',
        accountNumber: '1234567',
        ifsc: 'HDFC0000009',
        address: 'HDFC0000009, Bangalore - Kasturba Gandhi Marg ',
    },
];

let bankAccountNumber: string;

const { expect, describe } = PROCESS_TEST;

//Vendor Managed with Client Connect
describe('TCVO004', () => {
    PROCESS_TEST(
        'Vendor Onboarding Without GSTIN - Client Connect',
        async ({ page }) => {
            const withnogstin = new VendorManagedWithoutGSTIN(
                vendorNonGstinInfo,
                page
            );
            const vendorOnboarding = new VendorOnboarding(page);
            const invitationDetails = new VendorInvitationDetails(page);
            const getBankDetails = new BankAccountDetails(
                NON_GSTIN_BANK_DETAILS_TWO,
                page
            );

            // const vendorOnboarding = new VendorOnboarding(vendorNonGstinInfo, page);
            await withnogstin.clickLinkInviteVendor('Vendor Invitations');
            await vendorOnboarding.clickCopyLink();
            expect(await withnogstin.toastMessage()).toBe(
                'Link Successfully Copied!!!'
            );

            await test.step('Open Copied Link', async () => {
                const URL = await vendorOnboarding.linkURL();
                await vendorOnboarding.closeDialog();
                await vendorOnboarding.logOut();
                await vendorOnboarding.init(URL);
            });

            await test.step('Signup - Vendor Onboarding', async () => {
                test.slow();
                await withnogstin.clickButton('Sign Up');
                const signup = new SignupHelper(page);
                await signup.fillSignup({
                    name: 'User130823',
                    email: `User${generateRandomNumber()}@test.com`,
                    password: '123456',
                    confirm_password: '123456',
                });
                await signup.clickButton('Next');
            });

            //Verifies account after signup
            await test.step('Verify Email', async () => {
                const verifyEmail = new VerifyEmailHelper(page);
                await verifyEmail.fillCode('1');
                await verifyEmail.clickButton('Verify →');
                await withnogstin.clickButton('Continue →');
            });

            await test.step('Create Business Client', async () => {
                await withnogstin.clickButton('Create New Business');
                await withnogstin.setCheckbox('No');
            });

            await test.step('Fill Business Details', async () => {
                await withnogstin.fillVendorDetails([vendorNonGstinInfo]);
                await withnogstin.clickButton('Next');
                expect(
                    await withnogstin.toastMessage(),
                    'Toast message does not occured'
                ).toBe('Successfully saved');
            });

            await test.step('Fill Document Details', async () => {
                await vendorOnboarding.fillDocuments(
                    NON_GSTIN_LOWER_TDS_DETAILS
                );
                await withnogstin.clickButton('Next');
            });

            await test.step('Fill Bank Account Details', async () => {
                test.slow();

                await getBankDetails.fillBankAccount(
                    NON_GSTIN_BANK_DETAILS_CLIENT_CONNECTS
                );
                await withnogstin.checkWizardNavigationClickDocument(
                    'Bank Account'
                );
            });
            await test.step('Verify Bank Account Details', async () => {
                const ifscBankDetails =
                    await getBankDetails.vendorIfscDetails();
                expect(ifscBankDetails, 'Bank IFSC Code does not match').toBe(
                    NON_GSTIN_BANK_DETAILS_CLIENT_CONNECTS[0].address
                );
                await getBankDetails.vendorIfscLogoCheck();
                await withnogstin.clickButton('Previous');
                await withnogstin.clickButton('Next');

                await getBankDetails.fillBankAccount(
                    NON_GSTIN_BANK_DETAILS_CLIENT_CONNECTS
                );
                await withnogstin.checkWizardNavigationClickDocument(
                    'Bank Account'
                );
                await withnogstin.clickButton('Next');

                expect(
                    await page.getByText('Onboarding Completed').isVisible()
                ).toBe(true);
                await withnogstin.clickButton('Close');
            });

            await test.step('Without GSTIN Client Connect', async () => {
                await withnogstin.clickButton('Connect');
            });
            await test.step('Client Invitation Field', async () => {
                await vendorOnboarding.clientInvitation(
                    vendorNonGstinInfo.trade_name,
                    ''
                );

                await withnogstin.clickButton('Next');
                await vendorOnboarding.uploadImageDocuments(IMAGE_NAME);

                await withnogstin.clickButton('Submit');

                //Adding custom Timeout
                test.slow();
                expect(await withnogstin.toastMessage()).toBe(
                    'Successfully created'
                );
            });

            await test.step('Client Verify and Approve', async () => {
                expect(
                    await invitationDetails.checkNonGstinFrom(),
                    'Business Name does not matched'
                ).toBe(vendorNonGstinInfo.trade_name);
                expect(
                    await invitationDetails.checkNonGstinClient(),
                    'Client Name does not matched'
                ).toBe(clientGstinInfo.trade_name + ' ');

                expect(
                    await invitationDetails.checkGstinFromNonGstin(),
                    'GSTIN does not matched'
                ).toBe('Not Registered Business');
                expect(
                    await invitationDetails.checkNonGstinClientGSTIN(),
                    'Client Gstin does not matched'
                ).toBe(clientGstinInfo.value);
            });

            await test.step('Check Uploaded Doucments', async () => {
                await invitationDetails.checkNonGstinDoument('COI');
                await invitationDetails.checkNonGstinDoument('Pan Card');
                await invitationDetails.checkNonGstinDoument('MSME');
                await invitationDetails.checkNonGstinDoument('Lower TDS');
                await invitationDetails.checkNonGstinDoument('Bank');
            });
        }
    );
});
