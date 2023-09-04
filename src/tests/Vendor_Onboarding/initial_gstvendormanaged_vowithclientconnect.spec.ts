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
    BusinessVendorDetails,
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
describe('TCCC002', () => {
    PROCESS_TEST('Client Connect - Vendor Onboarding', async ({ page }) => {
        const getBankDetails = new BankAccountDetails(BANKDETAILS, page);
        const vendorOnboarding = new VendorOnboarding(LOWER_TDS_DETAILS, page);
        const invitationDetails = new VendorInvitationDetails(
            BANKDETAILS,
            LOWER_TDS_DETAILS,
            page
        );
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

        await test.step('Documents - Vendor Onboarding', async () => {
            await vendorOnboarding.fillDocuments(); // LOWER_TDS_DETAILS
        });

        //Adding Bank Account to vendor
        await test.step('Bank Account - Vendor Onboarding', async () => {
            await vendorOnboarding.clickButton('Next');
            await getBankDetails.fillBankAccount();
            await vendorOnboarding.checkWizardNavigationClickDocument(
                'Bank Account'
            );

            // bankIFSCCode = await getBankDetails.bankIFSCCode();

            const ifscBankDetails =
                await getBankDetails.vendorIfscDetailsValidation();
            expect(ifscBankDetails, 'Bank IFSC Code does not match').toBe(
                getBankDetails.bankDetails.address
            );
            await getBankDetails.vendorIfscLogoVisibilityValidation();

            // expect(
            //     bankIFSCCode.slice(0, -1),
            //     'Bank IFSC Code does not match'
            // ).toBe(BANKDETAILS[0].ifsc);

            await vendorOnboarding.clickButton('Next');
            expect(
                await page.getByText('Onboarding Completed').isVisible()
            ).toBe(true);
            await vendorOnboarding.clickButton('Close');
        });

        //Connects client to vendor
        await test.step('Client Connect', async () => {
            test.slow();
            // vendorOnboarding.gstin_data = clientGstinInfo;
            await vendorOnboarding.clickButton('Connect');

            await vendorOnboarding.clientInvitation(
                vendorGstinInfo.trade_name,
                clientGstinInfo.trade_name
                    ? clientGstinInfo.trade_name
                    : clientGstinInfo.value
            );
        });

        //Verifies client details in card with provided one
        await test.step('Verify Client GSTIN Info', async () => {
            withgstin.gstin_data = clientGstinInfo;
            withgstin.ignore_test_fields = ['gstin_business_address'];

            await withgstin.gstinInfoCheck();
            await getBankDetails.bankAccountNumber();
            await vendorOnboarding.clickButton('Next');
        });

        await test.step('Upload Mandatory Documents - Client Connect', async () => {
            expect(
                await vendorOnboarding.checkButtonVisibility('Submit')
            ).not.toBe(true);

            await vendorOnboarding.uploadImageDocuments(IMAGE_NAME);
            expect(await vendorOnboarding.toastMessage()).toBe(
                'Successfully saved'
            );
            expect(await vendorOnboarding.checkButtonVisibility('Submit')).toBe(
                true
            );
            await vendorOnboarding.clickButton('Submit');
            expect(await vendorOnboarding.toastMessage()).toBe(
                'Successfully created'
            );
        });

        //verifies vendor and client details with provided one
        await test.step('Verify Vendor and Client', async () => {
            const invitationDetails = new VendorInvitationDetails(
                BANKDETAILS,
                LOWER_TDS_DETAILS,
                page
            );

            expect(await invitationDetails.checkFrom()).toBe(
                vendorGstinInfo.trade_name + '…'
            );
            expect(await invitationDetails.checkFromGSTIN()).toBe(
                vendorGstinInfo.value
            );

            expect(await invitationDetails.checkClient()).toBe(
                clientGstinInfo.trade_name + ' '
            );
            expect(await invitationDetails.checkClientGSTIN()).toBe(
                clientGstinInfo.value
            );
        });

        await test.step('Check Uploaded Documents', async () => {
            await invitationDetails.checkDocument('GSTIN Certificate');
            await invitationDetails.checkDocument('Pan Card');
            await invitationDetails.checkDocument('MSME');
            await invitationDetails.checkDocument('Lower TDS');
            await invitationDetails.checkDocument('Bank');
        });

        // await test.step('Client Logout and FinOps Login ', async () => {
        //     await vendorOnboarding.logOut();
        //     const signIn = new SignInHelper(page);
        //     await signIn.signInPage('newtestauto@company.com', '123456');
        // });
    });
});
