import { PROCESS_TEST } from '@/fixtures';
import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import {
    BankAccountDetails,
    VendorInvitationDetails,
    VendorOnboarding,
    VendorOnboardingWithGSTIN,
} from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import {
    BANKDETAILS,
    LOWER_TDS_DETAILS,
    IMAGE_NAME,
} from '@/utils/required_data';

//Vendor and Client Details
const vendorGstinInfo: gstinDataType = {
    trade_name: 'Cloudtail India Private Limited',
    value: '27AAQCS4259Q1ZA',
    pan_number: 'AAQCS4259Q',
    business_type: 'Private Limited',
    address:
        'Sagar Tech Plaza, Andheri Kurla Road, Sakinaka, Unit No-117, Mumbai Suburban, 400072, Maharashtra, NA, 1st Floor',
    status: 'Active',
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
// let bankAccountName: string;
let bankAccountNumber: string;
// let bankIFSCCode: string;

const { expect, describe } = PROCESS_TEST;

//Vendor Managed with Client Connect
describe('TCCC001', () => {
    PROCESS_TEST('Client Connect - Vendor Onboarding', async ({ page }) => {
        const getBankDetails = new BankAccountDetails(page);
        const vendorOnboarding = new VendorOnboarding(page);
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
            // vendorOnboarding.gstin_data = vendorGstinInfo;
            await withgstin.gstinInfoCheck();
            await withgstin.gstinDisplayName();
            await vendorOnboarding.clickButton('Next');
            expect(await vendorOnboarding.toastMessage()).toBe(
                'Successfully saved'
            );
        });

        await test.step('Doucments - Vendor Onboarding', async () => {
            await vendorOnboarding.uploadDocument(LOWER_TDS_DETAILS);
            await vendorOnboarding.fileUpload(IMAGE_NAME);
            await vendorOnboarding.clickButton('Save');
        });

        //Adding Bank Account to vendor
        await test.step('Bank Account - Vendor Onboarding', async () => {
            test.slow();
            await vendorOnboarding.clickButton('Next');
            await vendorOnboarding.bankAccount(BANKDETAILS);
            await vendorOnboarding.checkWizardNavigationClickDocument(
                'Bank Account'
            );

            // bankIFSCCode = await getBankDetails.bankIFSCCode();

            const ifscBankDetails = await getBankDetails.vendorIfscDetails();
            expect(ifscBankDetails, 'Bank IFSC Code does not match').toBe(
                BANKDETAILS[0].address
            );
            await getBankDetails.vendorIfscLogoCheck();

            // expect(
            //     bankIFSCCode.slice(0, -1),
            //     'Bank IFSC Code does not match'
            // ).toBe(BANKDETAILS[0].ifsc);

            await vendorOnboarding.clickButton('Next');
            expect(
                await page.getByText('Onboarding Completed').isVisible()
            ).toBe(true);
            // await vendorOnboarding.clickButton('Close');
        });
    });
});
