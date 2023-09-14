import { CreateBusinessHelper } from '@/helpers/SignupHelper/createBusiness.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import { expect, test } from '@playwright/test';
import chalk from 'chalk';

test.describe('Signup', () => {
    test('without details', async ({ page }) => {
        const signup = new SignupHelper(page);
        await signup.init();
        await signup.clickButton('Next →');
        await expect(
            page.locator('//span[contains(@class, "label-text")]'),
            chalk.red('Error Message count')
        ).toHaveCount(4);
    });

    test('without Name Field', async ({ page }) => {
        const signup = new SignupHelper(page);
        await signup.init();
        await signup.fillSignup({
            name: '',
            email: SignupHelper.genRandomEmail(),
            password: '123456',
            confirm_password: '123456',
        });
        await signup.clickButton('Next →');
        expect(
            await signup.getErrorMessage(),
            chalk.red('Name field match')
        ).toBe('Name is required');
    });

    test('without Email Field', async ({ page }) => {
        const signup = new SignupHelper(page);
        await signup.init();
        await signup.fillSignup({
            name: 'Testing',
            email: '',
            password: '123456',
            confirm_password: '123456',
        });
        await signup.clickButton('Next →');
        expect(
            await signup.getErrorMessage(),
            chalk.red('Email field match')
        ).toBe('Email is required');
    });

    test('without Password Field', async ({ page }) => {
        const signup = new SignupHelper(page);
        await signup.init();
        await signup.fillSignup({
            name: 'Testing',
            email: SignupHelper.genRandomEmail(),
            password: '',
            confirm_password: '123456',
        });
        await page.waitForTimeout(2000);
        expect(
            await signup.getErrorMessage(),
            chalk.red('Password field match')
        ).toBe('Password is required');
    });

    test('without Confirm Password Field', async ({ page }) => {
        const signup = new SignupHelper(page);
        await signup.init();
        await signup.fillSignup({
            name: 'Testing',
            email: SignupHelper.genRandomEmail(),
            password: '123456',
            confirm_password: '',
        });
        await signup.clickButton('Next →');
        expect(
            await signup.getErrorMessage(),
            chalk.red('Confirm Password match')
        ).toBe('Confirm Password is required');
    });

    test('terms and condition check', async ({ page }) => {
        const signup = new SignupHelper(page);
        await signup.init();
        await signup.fillSignup({
            name: 'Testing',
            email: SignupHelper.genRandomEmail(),
            password: '123456',
            confirm_password: '123456',
        });
        expect(
            await signup.isPolicyChecked(),
            chalk.red('Checkbox state check')
        ).toBeChecked();
        await signup.clickButton('Next →');
    });

    test('terms and condition unchecked', async ({ page }) => {
        const signup = new SignupHelper(page);
        await signup.init();
        await signup.fillSignup({
            name: 'Testing',
            email: SignupHelper.genRandomEmail(),
            password: '123456',
            confirm_password: '123456',
        });
        await signup.clickPolicy();
        expect(
            await signup.isPolicyChecked(),
            chalk.red('Checkbox state check')
        ).not.toBeChecked();
        await page.waitForTimeout(1000);
    });

    test('Signup Flow with valid info', async ({ page }) => {
        const signup = new SignupHelper(page);

        await signup.init();
        await signup.fillSignup({
            name: 'Testing',
            email: SignupHelper.genRandomEmail(),
            password: '123456',
            confirm_password: '123456',
        });
        await signup.clickButton('Next →');
        await expect(
            page.getByText('Verify Your Email', { exact: true }),
            chalk.red('Verify Email page visibility')
        ).toBeVisible();
    });

    test('Verify Email Page with OTP', async ({ page }) => {
        const signup = new SignupHelper(page);

        await signup.init();
        await signup.fillSignup({
            name: 'Testing',
            email: SignupHelper.genRandomEmail(),
            password: '123456',
            confirm_password: '123456',
        });
        await signup.clickButton('Next →');
        const verifyEmail = new VerifyEmailHelper(page);
        const business = new CreateBusinessHelper(page);

        await test.step('without OTP', async () => {
            await verifyEmail.clickButton('Verify →');
            expect(
                await verifyEmail.toastMessage(),
                chalk.red('ToastMessage match')
            ).toBe('Invalid code!');
        });

        await test.step('with valid OTP', async () => {
            await verifyEmail.fillCode('1');
            await verifyEmail.clickButton('Verify →');
        });

        await test.step('click continue', async () => {
            await verifyEmail.clickContinue();
        });

        await test.step('Create Business after Email Verification', async () => {
            await business.fillBusiness({ business_name: 'ABCD Company LTD' });
            await business.clickContinue();
            await expect(page, chalk.red('Title match')).toHaveTitle(
                'Finnoto - Analytical Dashboard'
            );
        });
    });
    test('Verify Sign In clickable link', async ({ page }) => {
        const signup = new SignupHelper(page);
        await signup.init();
        await signup.checkSignInLink();
    });
});
