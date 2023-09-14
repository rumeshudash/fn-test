import { VerifyPhone } from '@/helpers/SigninHelper/verifyPhone.helper';
import { expect, test } from '@playwright/test';
import chalk from 'chalk';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';

test.describe('Verify Phone', () => {
    test('without details', async ({ page }) => {
        const verifyPhone = new VerifyPhone(page);
        const number = '9840016500';
        await verifyPhone.init(number);

        await expect(
            page.getByText('Mobile Number'),
            chalk.red('Error Message check ')
        ).toHaveCount(1);
    });

    test('with invalid OTP', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const mobile = 9816934348;
        await signin.MobileNumber(mobile);
        const verifyPhone = new VerifyPhone(page);

        // const number = '9816934348';
        // await verifyPhone.init(number);

        await verifyPhone.fillOtp('1234', 4);

        await verifyPhone.clickVerify();

        await page.waitForTimeout(1000);

        expect(
            await verifyPhone.getToastError(),
            chalk.red('Error Message match ')
        ).toBe('Invalid otp');
    });

    test('with valid OTP', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const mobile = 9816934348;
        await signin.MobileNumber(mobile);
        const verifyPhone = new VerifyPhone(page);
        // const number = '9816934348';
        // await verifyPhone.init(number);

        await signin.fillOtp('1111', 4);

        await verifyPhone.clickVerify();
        // expect(
        //     await page.locator('//p[contains(text(), "Select Organization")]')
        // ).toHaveCount(1);
    });
    test('Click On resend OTP', async ({ page }) => {
        const verifyPhone = new VerifyPhone(page);
        const number = '9816934348';
        await verifyPhone.init(number);

        await verifyPhone.clickResendOTP();
    });

    test('With already sent OTP', async ({ page }) => {});
});
