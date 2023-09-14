import { ResetPasswordHelper } from '@/helpers/SigninHelper/resetpassword.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { test, expect } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

test.describe('TRP001', () => {
    PROCESS_TEST('Reset Password page is open', async ({ page }) => {
        const resetPassword = new ResetPasswordHelper(page);
        await resetPassword.init();
        await resetPassword.resetPasswordPage();

        const dialog = await resetPassword._dialogHelper;

        await expect(await dialog.getDialogTitle()).toBe('Change Password');
    });
    PROCESS_TEST('Reset Password with empty password', async ({ page }) => {
        const resetPassword = new ResetPasswordHelper(page);
        await resetPassword.init();

        await resetPassword.resetPassword('', '1234567', '1234567');
        expect(await resetPassword.getErrorMessage()).toBe(
            'Old Password is required'
        );
    });
    PROCESS_TEST(
        'Reset Password with Incorrect  new password',
        async ({ page }) => {
            const resetPassword = new ResetPasswordHelper(page);
            await resetPassword.init();

            await resetPassword.resetPassword('1234544', '12', '12345678');

            expect(await resetPassword.getErrorMessage()).toBe(
                'Confirm New Password does not match'
            );
        }
    );
    PROCESS_TEST(
        'Reset Password with Without confirm password',
        async ({ page }) => {
            const resetPassword = new ResetPasswordHelper(page);
            await resetPassword.init();
            await resetPassword.resetPassword('1234544', '121234544', '');

            expect(await resetPassword.getErrorMessage()).toBe(
                'Confirm New Password is required'
            );
        }
    );
    PROCESS_TEST(
        'Reset Password with same old and  new password',
        async ({ page }) => {
            const resetPassword = new ResetPasswordHelper(page);
            await resetPassword.init();
            await resetPassword.resetPassword('1234544', '1234544', '1234544');

            expect(await resetPassword.getErrorMessage()).toBe(
                "Your old password can't be same as your New password"
            );
        }
    );
    PROCESS_TEST(
        ' with valid old password and  valid new password',
        async ({ page }) => {
            const resetPassword = new ResetPasswordHelper(page);
            await resetPassword.init();
            await resetPassword.resetPassword('123456', '1234567', '1234567');
            expect(await resetPassword.getToastSuccess()).toBe(
                'Successfully changed password'
            );
        }
    );

    PROCESS_TEST('Check with Invalid Old password', async ({ page }) => {
        const resetPassword = new ResetPasswordHelper(page);
        await resetPassword.init();
        await resetPassword.resetPassword('12345677887', '123456', '123456');

        await page.waitForTimeout(1000);

        const dialog = await resetPassword._dialogHelper;

        await expect(await dialog.getDialogTitle()).toBe('Change Password');

        await page.waitForTimeout(1000);
        expect(await resetPassword.getToastError()).toBe(
            'Invalid old password'
        );
    });
});
