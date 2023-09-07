import { VerifyPhone } from '@/helpers/SigninHelper/verifyPhone.helper';
import { expect, test } from '@playwright/test';

test.describe('Verify Phone', () => {
    test('without details', async ({ page }) => {
        const verifyPhone = new VerifyPhone(page);
        const number = '9840016500';
        await verifyPhone.init(number);

        await expect(page.getByText('Mobile Number')).toHaveCount(1);
    });

    test('with invalid OTP', async ({ page }) => {
        const verifyPhone = new VerifyPhone(page);
        const number = '9989348388';
        await verifyPhone.init(number);

        await verifyPhone.fillOtp('12347', 4);

        await verifyPhone.clickVerify();
        expect(await verifyPhone.errorMessage()).toBe('Invalid otp');
    });

    test('with valid OTP', async ({ page }) => {
        const verifyPhone = new VerifyPhone(page);
        const number = '9989348388';
        await verifyPhone.init(number);

        await verifyPhone.fillOtp('1111', 4);

        await verifyPhone.clickVerify();
        // expect(
        //     await page.locator('//p[contains(text(), "Select Organization")]')
        // ).toHaveCount(1);
    });
});
