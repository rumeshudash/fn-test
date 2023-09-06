import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { expect, test } from '@playwright/test';

test.describe('Signin', () => {
    test('without details', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.clickButton('Next →');
        await expect(
            page.locator('//span[contains(@class, "label-text")]')
        ).toHaveCount(1);
    });

    test('without Email Field', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.isValidEmail('');
        // await signin.clickButton('Next →');
        expect(await signin.errorMessage()).toBe('Email Address is required');
    });
    test('without Password Field', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();

        await signin.CheckLogin({
            username: SignInHelper.genRandomEmail(),
            password: '',
        });
        // await signin.clickButton('Submit');
        expect(await signin.errorMessage()).toBe('Password is required');
    });
    test('with invalid Email Field', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.isValidEmail('test');
        // await signin.clickButton('Next →');
        expect(await signin.errorMessage()).toBe(
            'Email Address must be a valid email'
        );
    });
    test('with invalid username', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = SignInHelper.genRandomEmail();
        await signin.CheckLogin({
            username: username,
            password: '123456',
        });
        // await signin.clickButton('Submit');
        expect(await signin.errorToast()).toBe(`Invalid username or password`);
    });
    test('with invalid password', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        await signin.CheckLogin({
            username: username,
            password: '1234567aaaaashsjh',
        });
        // await signin.clickButton('Submit');
        expect(await signin.errorMessage()).toBe(
            `Invalid username or password..`
        );
    });
    test('with maximum login attempts', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'payiwav158@searpen.com';

        await signin.maximumLoginAttempts(username);
        expect(await signin.errorMessage()).toBe(
            `Account locked for too many invalid attempts. Please try after 5 minutes`
        );
    });
    test('with valid username and password', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });
        // await signin.clickButton('Submit');
        await page.waitForTimeout(1000);
    });

    test('SignUp is Clickable link', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkSignUpLink();
    });
    test('Forgot Password is Clickable link', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'abc@test.com';
        await signin.checkForgotPasswordLink(username);
    });
});
