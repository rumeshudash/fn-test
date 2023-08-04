import { CreateBusinessHelper } from '@/helpers/createBusiness.helper';
import { SignupHelper } from '@/helpers/signup.helper';
import { VerifyEmailHelper } from '@/helpers/verifyEmail.helper';
import { expect, test } from '@playwright/test';

test.describe('Signup', () => {
    test('without details', async ({ page }) => {
        const signup = new SignupHelper(page);
        await signup.init();
        await signup.nextPage();
        await expect(
            page.locator('//span[contains(@class, "label-text")]')
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
        await signup.nextPage();
        expect(await signup.errorMessage()).toBe('Name is required');
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
        await signup.nextPage();
        expect(await signup.errorMessage()).toBe('Email is required');
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
        expect(await signup.errorMessage()).toBe('Password is required');
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
        await signup.nextPage();
        expect(await signup.errorMessage()).toBe(
            'Confirm Password is required'
        );
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
        expect(await signup.isPolicyChecked()).toBeChecked();
        await signup.nextPage();
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
        expect(await signup.isPolicyChecked()).not.toBeChecked();
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
        await signup.nextPage();
        await expect(
            page.getByText('Verify Your Email', { exact: true })
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
        await signup.nextPage();
        const verifyEmail = new VerifyEmailHelper(page);
        const business = new CreateBusinessHelper(page);

        await test.step('without OTP', async () => {
            await verifyEmail.verifyPageClick();
            expect(await verifyEmail.toastMessage()).toBe('Invalid code!');
        });

        await test.step('with valid OTP', async () => {
            await verifyEmail.fillCode('1');
            await verifyEmail.verifyPageClick();
        });

        await test.step('click continue', async () => {
            await verifyEmail.clickContinue();
        });

        await test.step('Create Business after Email Verification', async () => {
            await business.fillBusiness({ business_name: 'ABCD Company LTD' });
            await business.clickContinue();
            await expect(page).toHaveTitle('Finnoto - Analytical Dashboard');
        });
    });
});