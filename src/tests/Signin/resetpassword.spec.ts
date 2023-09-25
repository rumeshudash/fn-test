import { ResetPasswordHelper } from '@/helpers/SigninHelper/resetpassword.helper';
import { test, expect } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

test.describe.configure({ mode: 'serial' });
test.describe('FinOps_SignIn', () => {
    PROCESS_TEST('TRP001 - Reset Password page is open', async ({ page }) => {
        const resetPassword = new ResetPasswordHelper(page);
        await resetPassword.init();
        await resetPassword.resetPasswordPage();

        expect(await resetPassword.dialogHelper.getDialogTitle()).toBe(
            'Change Password'
        );
    });
    PROCESS_TEST(
        'TRP002 - Reset Password with empty password',
        async ({ page }) => {
            const resetPassword = new ResetPasswordHelper(page);
            await resetPassword.init();

            await resetPassword.resetPassword('', '1234567', '1234567');
            expect(await resetPassword.getErrorMessage()).toBe(
                'Old Password is required'
            );
        }
    );
    PROCESS_TEST(
        'TRP003 - Reset Password with Incorrect  new password',
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
        'TRP004 - Reset Password with Without confirm password',
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
        'TRP006 - Reset Password with same old and  new password',
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
        'TRP007 - Check with Invalid Old password',
        async ({ page }) => {
            const resetPassword = new ResetPasswordHelper(page);
            await resetPassword.init();
            await resetPassword.resetPassword(
                '12345677887',
                '123456',
                '123456'
            );
            await resetPassword.click({ role: 'button', name: 'Yes' });

            await resetPassword.checkToastError('Invalid old password');
        }
    );

    PROCESS_TEST(
        'TRP008 -with valid old password and valid new password',
        async ({ page }) => {
            const resetPassword = new ResetPasswordHelper(page);
            await resetPassword.init();
            await resetPassword.resetPassword('123456', '1234567', '1234567');
            await resetPassword.click({ role: 'button', name: 'Yes' });

            await resetPassword.checkToastSuccess(
                'Successfully changed password'
            );

            await PROCESS_TEST.step('Reset to default password', async () => {
                await resetPassword.init();
                await resetPassword.resetPassword(
                    '1234567',
                    '123456',
                    '123456'
                );
                await resetPassword.click({ role: 'button', name: 'Yes' });
            });
        }
    );
});
