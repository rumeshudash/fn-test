import { ForgotPasswordHelper } from '@/helpers/SigninHelper/forgotpassword.helper';
import { expect, test } from '@playwright/test';

test.describe('Forgot Password', () => {
    test('without details', async ({ page }) => {
        const forgotPassword = new ForgotPasswordHelper(page);
        await forgotPassword.init();
        await forgotPassword.click({ role: 'button', name: 'Next →' });

        await forgotPassword.checkIsInputHasErrorMessage(
            'Invalid Email Address',
            {
                name: 'email',
            }
        );
    });
    test('without Email Field', async ({ page }) => {
        const forgotPassword = new ForgotPasswordHelper(page);
        await forgotPassword.init();
        await forgotPassword.forgotPasswordPage('');

        await forgotPassword.checkIsInputHasErrorMessage(
            'Invalid Email Address',
            {
                name: 'email',
            }
        );
    });
    test('with invalid Email Field', async ({ page }) => {
        const forgotPassword = new ForgotPasswordHelper(page);
        await forgotPassword.init();
        await forgotPassword.forgotPasswordPage('test');

        await forgotPassword.checkIsInputHasErrorMessage(
            'Invalid Email Address',
            {
                name: 'email',
            }
        );
    });
    test('with valid Email Field', async ({ page }) => {
        const forgotPassword = new ForgotPasswordHelper(page);
        await forgotPassword.init();
        await forgotPassword.forgotPasswordPage('test@gmail.com');

        expect(
            page.locator('h1', { hasText: 'Check Your Email !!' }),
            'Check your email page open?'
        ).toBeVisible();
    });
});
