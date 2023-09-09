import { ForgotPasswordHelper } from '@/helpers/SigninHelper/forgotpassword.helper';
import { expect, test } from '@playwright/test';
import chalk from 'chalk';

test.describe('Forgot Password', () => {
    test('without details', async ({ page }) => {
        const forgotpassword = new ForgotPasswordHelper(page);
        await forgotpassword.init();
        await forgotpassword.click({ role: 'button', name: 'Next →' });

        await forgotpassword.checkIsInputHasError('Invalid Email Address', {
            name: 'email',
        });
    });
    test('without Email Field', async ({ page }) => {
        const forgotpassword = new ForgotPasswordHelper(page);
        await forgotpassword.init();
        await forgotpassword.forgotPasswordPage('');
        expect(
            await forgotpassword.errorMessage(),
            chalk.red('Error Message match ')
        ).toBe('Invalid Email Address');
    });
    test('with invalid Email Field', async ({ page }) => {
        const forgotpassword = new ForgotPasswordHelper(page);
        await forgotpassword.init();
        await forgotpassword.forgotPasswordPage('test');
        expect(
            await forgotpassword.errorMessage(),
            chalk.red('Error Message match ')
        ).toBe('Invalid Email Address');
    });
    test('with valid Email Field', async ({ page }) => {
        const forgotpassword = new ForgotPasswordHelper(page);
        await forgotpassword.init();
        await forgotpassword.forgotPasswordPage('test@gmail.com');
    });
});
