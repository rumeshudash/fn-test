import { PROCESS_TEST } from '@/fixtures';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import { VendorOnboarding } from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';

const { expect, describe } = PROCESS_TEST;

//Vendor Managed Onboarding
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

            await vendorOnboarding.businessDetails([
                {
                    businessName: 'ferrari  India',
                    gstin: '36AATFN8007H1ZW',
                },
            ]);
            await vendorOnboarding.beforeGstinNameNotVisibleDisplayName();
            await vendorOnboarding.checkWizardNavigationClickDocument();
            await vendorOnboarding.clickButton('Next');
            await vendorOnboarding.checkBusinessName();
            await vendorOnboarding.checkGSTIN();
            await vendorOnboarding.checkStatus();
            await vendorOnboarding.checkAddress();
            await vendorOnboarding.checkBusinessType();
            await vendorOnboarding.checkPAN();

            await vendorOnboarding.checkDisplayName();

            await vendorOnboarding.clickButton('Next');

            expect(await vendorOnboarding.toastMessage()).toBe(
                'Successfully saved'
            );
            await page.waitForTimeout(2 * 1000);
            // await vendorOnboarding.clickButton('Next');
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
            expect(page.getByText('Onboarding Completed')).toBeTruthy();
            await vendorOnboarding.clickButton('Close');
        });
    });
});
