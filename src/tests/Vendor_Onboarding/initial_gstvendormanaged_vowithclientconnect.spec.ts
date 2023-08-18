import { PROCESS_TEST } from '@/fixtures';
import { SavedExpenseCreation } from '@/helpers/ExpenseHelper/savedExpense.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import {
    VendorInvitationDetails,
    VendorOnboarding,
    VendorOnboardingWithoutGSTIN,
} from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';

let businessName: string;
let businessNameGSTIN: string;
let clientName: string;
let clientNameGSTIN: string;
const { expect, describe } = PROCESS_TEST;
const BUSINESSDETAILS = [
    {
        businessName: 'Shopper Stop',
        gstin: '09AABCS4383A1ZJ',
    },
];

//Vendor Managed with Client Connect
describe('TCCC002', () => {
    PROCESS_TEST('Vendor Onboarding Copy Link', async ({ page }) => {
        const vendorOnboarding = new VendorOnboarding(page);
        await vendorOnboarding.clickLink('Vendor Invitations');
        await vendorOnboarding.clickCopyLink();
        expect(await vendorOnboarding.toastMessage()).toBe(
            'Link Successfully Copied!!!'
        );

        await test.step('Open Copied Link', async () => {
            const URL = await vendorOnboarding.linkURL();
            await vendorOnboarding.closeDialog();
            await vendorOnboarding.logOut();
            console.log(URL);
            await vendorOnboarding.init(URL);
        });

        await test.step('Signup - Vendor Onboarding', async () => {
            await vendorOnboarding.clickButton('Sign Up');
            const signup = new SignupHelper(page);
            await signup.fillSignup({
                name: 'User130823',
                email: `User${generateRandomNumber()}@test.com`,
                password: '123456',
                confirm_password: '123456',
            });
            await signup.nextPage();
        });
        await test.step('Verify Email', async () => {
            const verifyEmail = new VerifyEmailHelper(page);
            await verifyEmail.fillCode('1');
            await verifyEmail.verifyPageClick();
            await vendorOnboarding.clickButton('Continue →');
        });

        await test.step('Create Business Client', async () => {
            await vendorOnboarding.clickButton('Create New Business');

            await vendorOnboarding.businessDetails(BUSINESSDETAILS);
            await page.waitForTimeout(1000);
            await vendorOnboarding.clickButton('Next');
            await vendorOnboarding.checkBusinessName();
            businessName = await vendorOnboarding.checkBusinessName();
            await vendorOnboarding.checkGSTIN();
            businessNameGSTIN = await vendorOnboarding.checkGSTIN();
            await vendorOnboarding.checkStatus();
            await vendorOnboarding.checkAddress();
            await vendorOnboarding.checkBusinessType();
            await vendorOnboarding.checkPAN();
            await vendorOnboarding.clickButton('Next');
            await vendorOnboarding.clickButton('Next');
            expect(await vendorOnboarding.toastMessage()).toBe(
                'Successfully saved'
            );
            await vendorOnboarding.uploadDocument([
                {
                    tdsCert: '333333333',
                    tdsPercentage: '22',
                },
            ]);
            await vendorOnboarding.fileUpload('pan-card.jpg');
            await vendorOnboarding.clickButton('Save');
            await vendorOnboarding.clickButton('Next');
            await vendorOnboarding.bankAccount([
                {
                    accountNumber: '1234567',
                    ifsc: 'HDFC0000002',
                },
            ]);
            await vendorOnboarding.clickButton('Next');
            expect(page.getByText('Onboarding Completed')).toBeTruthy();
            await vendorOnboarding.clickButton('Close');
            await vendorOnboarding.clickButton('Connect');
            await vendorOnboarding.clientInvitation();
            await vendorOnboarding.checkBusinessName();
            clientName = await vendorOnboarding.checkBusinessName();
            await vendorOnboarding.checkGSTIN();
            clientNameGSTIN = await vendorOnboarding.checkGSTIN();
            await vendorOnboarding.checkStatus();
            await vendorOnboarding.checkBusinessType();
            // await vendorOnboarding.checkPAN();
            await vendorOnboarding.clickButton('Next');
            await vendorOnboarding.uploadImageDocuments('pan-card.jpg');

            await vendorOnboarding.clickButton('Submit');
            expect(await vendorOnboarding.toastMessage()).toBe(
                'Successfully created'
            );

            await page.waitForTimeout(2000);
        });
        await test.step('Client Verify and Approve', async () => {
            const invitationDetails = new VendorInvitationDetails(page);
            expect(await invitationDetails.checkFrom()).toBe(
                businessName + '…'
            );
            expect(await invitationDetails.checkClient()).toBe(
                clientName + ' '
            );

            expect(await invitationDetails.checkFromGSTIN()).toBe(
                businessNameGSTIN
            );
            expect(await invitationDetails.checkClientGSTIN()).toBe(
                clientNameGSTIN
            );
        });

        await test.step('Check Uploaded Doucments', async () => {
            const withoutGSTIN = new VendorOnboardingWithoutGSTIN(page);
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
