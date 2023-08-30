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
    vendorGstinInfo,
    clientGstinInfo,
    BANKDETAILS,
    LOWER_TDS_DETAILS,
    IMAGE_NAME,
} from '@/utils/required_data';

//Bank Details
// let bankAccountName: string;
let bankAccountNumber: string;
// let bankIFSCCode: string;

const { expect, describe } = PROCESS_TEST;

//Vendor Managed with Client Connect
describe('TCCC002', () => {
    // test.setTimeout(1 * 110 * 1000);
    PROCESS_TEST('Client Connect - Vendor Onboarding', async ({ page }) => {
        const getBankDetails = new BankAccountDetails(page);
        const vendorOnboarding = new VendorOnboarding(vendorGstinInfo, page);
        await vendorOnboarding.clickLink('Vendor Invitations');

        //@todo also you have to give clear message for copy field
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
            await vendorOnboarding.clickButton('Sign Up');
            const signup = new SignupHelper(page);
            await signup.fillSignup({
                name: 'User130823',
                email: `User`,
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
            await vendorOnboarding.fillGstinInput();
            await vendorOnboarding.beforeGstinNameNotVisibleDisplayName();
            await vendorOnboarding.checkWizardNavigationClickDocument(
                'Documents'
            );
        });

        //Verifies vendor details in card with provided one
        await test.step('Verify Vendor GSTIN Info then Save', async () => {
            // vendorOnboarding.gstin_data = vendorGstinInfo;
            await vendorOnboarding.gstinInfoCheck();
            await vendorOnboarding.gstinDisplayName();
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
            await vendorOnboarding.clickButton('Close');
        });

        //Connects client to vendor
        await test.step('Client Connect', async () => {
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
            vendorOnboarding.gstin_data = clientGstinInfo;

            vendorOnboarding.ignore_test_fields = ['gstin_business_address'];

            await vendorOnboarding.gstinInfoCheck();
            bankAccountNumber = await getBankDetails.bankAccountNumber();
            await vendorOnboarding.clickButton('Next');
        });

        await test.step('Upload Mandatory Documents - Client Connect', async () => {
            expect(
                await vendorOnboarding.checkButtonVisibility('Submit')
            ).not.toBe(true);

            await vendorOnboarding.uploadImageDocuments('pan-card.jpg');
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
            const invitationDetails = new VendorInvitationDetails(page);

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

        await test.step('Check Uploaded Doucments', async () => {
            const withoutGSTIN = new VendorOnboardingWithGSTIN(page);
            await withoutGSTIN.checkDoument('GSTIN Certificate');
            await withoutGSTIN.checkDoument('Pan Card');
            await withoutGSTIN.checkDoument('MSME');
            await withoutGSTIN.checkDoument('Lower TDS');
            await withoutGSTIN.checkDoument('Bank');
        });

        // await test.step('Client Logout and FinOps Login ', async () => {
        //     await vendorOnboarding.logOut();
        //     const signIn = new SignInHelper(page);
        //     await signIn.signInPage('newtestauto@company.com', '123456');
        // });
    });
});
