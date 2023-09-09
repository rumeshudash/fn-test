import { ResetPasswordHelper } from '@/helpers/SigninHelper/resetpassword.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { test, expect } from '@playwright/test';

test.describe('Reset Password', () => {
    test('Reset Password page is open', async ({ page }) => {
        const signIn = new SignInHelper(page);
        await signIn.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signIn.checkDashboard({
            username: username,
            password: password,
        });
        const resetPassword = new ResetPasswordHelper(page);
        await resetPassword.init();
        await resetPassword.resetPasswordPage();

        await expect(page.getByText('Change Password')).toHaveCount(1);
    });
    test('Reset Password with empty password', async ({ page }) => {
        const signIn = new SignInHelper(page);
        await signIn.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signIn.checkDashboard({
            username: username,
            password: password,
        });
        const resetPassword = new ResetPasswordHelper(page);
        await resetPassword.init();

        await resetPassword.resetPassword('', '1234567', '1234567');
        expect(await signIn.errorMessage()).toBe('Old Password is required');
    });
    test('Reset Password with Incorrect  new password', async ({ page }) => {
        const signIn = new SignInHelper(page);
        await signIn.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signIn.checkDashboard({
            username: username,
            password: password,
        });
        const resetPassword = new ResetPasswordHelper(page);
        await resetPassword.init();

        await resetPassword.resetPassword('1234544', '12', '12345678');

        expect(await signIn.errorMessage()).toBe(
            'Confirm New Password does not match'
        );
    });
    test('Reset Password with Without confirm password', async ({ page }) => {
        const signIn = new SignInHelper(page);
        await signIn.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signIn.checkDashboard({
            username: username,
            password: password,
        });
        const resetPassword = new ResetPasswordHelper(page);
        await resetPassword.init();
        await resetPassword.resetPassword('1234544', '121234544', '');

        expect(await signIn.errorMessage()).toBe(
            'Confirm New Password is required'
        );
    });
    test('Reset Password with same old and  new password', async ({ page }) => {
        const signIn = new SignInHelper(page);
        await signIn.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signIn.checkDashboard({
            username: username,
            password: password,
        });
        const resetPassword = new ResetPasswordHelper(page);
        await resetPassword.init();
        await resetPassword.resetPassword('1234544', '1234544', '1234544');

        expect(await signIn.errorMessage()).toBe(
            "Your old password can't be same as your New password"
        );
    });
    test('Validate The length of new password', async ({ page }) => {});
});
