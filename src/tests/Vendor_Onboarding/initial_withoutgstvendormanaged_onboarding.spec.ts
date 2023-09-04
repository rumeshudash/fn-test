import { PROCESS_TEST } from '@/fixtures';
import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import {
    BankAccountDetails,
    VendorOnboarding,
} from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import {
    BANKDETAILS,
    LOWER_TDS_DETAILS,
    IMAGE_NAME,
    NON_GSTIN_LOWER_TDS_DETAILS,
    NON_GSTIN_BANK_DETAILS_ONE,
    NON_GSTIN_BANK_DETAILS_TWO,
} from '@/utils/required_data';
import { VendorManagedWithoutGSTIN } from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { nonGstinDataType } from '@/helpers/CommonCardHelper/genericNonGstin.card.helper';

//Vendor and Client Details
const vendorNonGstinInfo: nonGstinDataType = {
    trade_name: 'ABC Pvt Ltd',
    display_name: 'ABC Pvt Ltd',
    business_type: 'Partnership Firm',
    pin_code: '110001',
    address: '123/45 Test address',
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

let bankAccountNumber: string;

const { expect, describe } = PROCESS_TEST;

//Vendor Managed with Client Connect
describe('TCVO003', () => {
    PROCESS_TEST('Vendor Onboarding Without GSTIN', async ({ page }) => {
        const withnogstin = new VendorManagedWithoutGSTIN(
            vendorNonGstinInfo,
            page
        );
        const vendorOnboarding = new VendorOnboarding(
            NON_GSTIN_LOWER_TDS_DETAILS,
            page
        );

        const getBankDetails = new BankAccountDetails(
            NON_GSTIN_BANK_DETAILS_ONE,
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
            await vendorOnboarding.fillDocuments();
            await withnogstin.clickButton('Next');
        });

        await test.step('Fill Bank Account Details', async () => {
            test.slow();
            await getBankDetails.validateBankAccountName();
            await getBankDetails.fillBankAccount();
            await withnogstin.checkWizardNavigationClickDocument(
                'Bank Account'
            );
        });
        await test.step('Verify Bank Account Details', async () => {
            const ifscBankDetails =
                await getBankDetails.vendorIfscDetailsValidation();
            expect(ifscBankDetails, 'Bank IFSC Code does not match').toBe(
                getBankDetails.bankDetails.address
            );
            await getBankDetails.vendorIfscLogoVisibilityValidation();
            await withnogstin.clickButton('Previous');
            await withnogstin.clickButton('Next');

            await getBankDetails.fillBankAccount();
            await withnogstin.checkWizardNavigationClickDocument(
                'Bank Account'
            );
            await withnogstin.clickButton('Next');

            expect(
                await page.getByText('Onboarding Completed').isVisible()
            ).toBe(true);
            await withnogstin.clickButton('Close');
        });
    });
});
