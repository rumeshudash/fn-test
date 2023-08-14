import { PROCESS_TEST } from '@/fixtures';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import { VendorOnboarding } from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { test } from '@playwright/test';

const { expect, describe } = PROCESS_TEST;

describe('TCVO001', () => {
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
                email: 'User1308185@test.com',
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
            await page.waitForTimeout(1000);
            await vendorOnboarding.businessDetails([
                {
                    businessName: 'Reebok India',
                    gstin: '27AAACR3007K1ZJ',
                },
            ]);
            await vendorOnboarding.clickButton('Next');
            await vendorOnboarding.checkBusinessName();
            await vendorOnboarding.checkGSTIN();
            await vendorOnboarding.checkStatus();
            await vendorOnboarding.checkAddress();
            await vendorOnboarding.checkBusinessType();
            await vendorOnboarding.checkPAN();
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
                    ifsc: 'HDFC0000001',
                },
            ]);
            await vendorOnboarding.clickButton('Next');
            await vendorOnboarding.clickButton('Close');
            await page.waitForTimeout(2000);
            await vendorOnboarding.clickButton('Connect');
            await page.waitForTimeout(2000);

            await vendorOnboarding.clientInvitation('pan-card.jpg');
            await page.waitForTimeout(2000);
        });

        await test.step('Client Logout and FinOps Login ', async () => {
            await vendorOnboarding.logOut();
            const signIn = new SignInHelper(page);
            await signIn.signInPage('newtestauto@company.com', '123456');
        });

        await test.step('Client Verify and Approve', async () => {});
    });
});
