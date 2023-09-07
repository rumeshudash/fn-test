import { PROCESS_TEST } from '@/fixtures';
import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import {
    BankAccountDetails,
    VendorOnboarding,
    VendorOnboardingWithGSTIN,
} from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import { BANKDETAILS, LOWER_TDS_DETAILS } from '@/utils/required_data';

//Vendor and Client Details
const vendorGstinInfo: gstinDataType = {
    trade_name: 'Cloudtail India Private Limited',
    value: '27AAQCS4259Q1Z8',
    pan_number: 'AAQCS4259Q',
    business_type: 'Private Limited',
    address:
        'Sagar Tech Plaza, Andheri Kurla Road, Sakinaka, Unit No-117, Mumbai Suburban, 400072, Maharashtra, NA, 1st Floor',
    status: 'Active',
};

const { expect, describe } = PROCESS_TEST;

//Vendor Managed with Client Connect
describe('test123', () => {
    PROCESS_TEST('Vendor Onboarding', async ({ page }) => {
        const getBankDetails = new BankAccountDetails(BANKDETAILS, page);
        const vendorOnboarding = new VendorOnboarding(LOWER_TDS_DETAILS, page);
        const withgstin = new VendorOnboardingWithGSTIN(vendorGstinInfo, page);
        await vendorOnboarding.clickLinkInviteVendor('Vendor Invitations');
        await vendorOnboarding.clickCopyLink();
        expect(await vendorOnboarding.toastMessage()).toBe(
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
            await vendorOnboarding.clickButton('Sign Up');
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
            await vendorOnboarding.clickButton('Continue →');
        });

        await test.step('Create Business Client', async () => {
            await vendorOnboarding.clickButton('Create New Business');
            await vendorOnboarding.setCheckbox('Yes');
            await withgstin.fillGstinInput();
            await vendorOnboarding.beforeGstinNameNotVisibleDisplayName();
            await vendorOnboarding.checkWizardNavigationClickDocument(
                'Documents'
            );
        });

        //Verifies vendor details in card with provided one
        await test.step('Verify Vendor GSTIN Info then Save', async () => {
            await withgstin.gstinInfoCheck();
            await withgstin.gstinDisplayName();
            await vendorOnboarding.clickButton('Next');
            expect(await vendorOnboarding.toastMessage()).toBe(
                'Successfully saved'
            );
        });

        await test.step('Documents - Vendor Onboarding', async () => {
            await vendorOnboarding.fillDocuments(); // LOWER_TDS_DETAILS
        });

        //Adding Bank Account to vendor
        await test.step('Bank Account - Vendor Onboarding', async () => {
            await vendorOnboarding.clickButton('Next');
            await getBankDetails.fillBankAccount(); //BANKDETAILS
            await vendorOnboarding.checkWizardNavigationClickDocument(
                'Bank Account'
            );

            const ifscBankDetails =
                await getBankDetails.vendorIfscDetailsValidation();
            expect(ifscBankDetails, 'Bank IFSC Code does not match').toBe(
                getBankDetails.bankDetails.address
            );
            await getBankDetails.vendorIfscLogoVisibilityValidation();

            await vendorOnboarding.clickButton('Next');
            expect(
                await page.getByText('Onboarding Completed').isVisible()
            ).toBe(true);
        });
    });
});
