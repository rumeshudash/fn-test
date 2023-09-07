import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { expect, test } from '@playwright/test';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';

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
        const signUp = new SignupHelper(page);
        await signUp.init();
        const username = SignupHelper.genRandomEmail();
        await signUp.fillSignup({
            name: 'test',
            email: username,
            password: '123456',
            confirm_password: '123456',
        });
        await signUp.clickButton('Next →');

        // const username = 'abcdef@gmail.com';
        const signin = new SignInHelper(page);
        await signin.init();

        await signin.maximumLoginAttempts(username);

        const checklogin = new SignInHelper(page);
        await checklogin.init();

        await signin.CheckLogin({
            username: username,
            password: '123456',
        });

        expect(await signin.errorMessage()).toBe(
            'Account locked for too many invalid attempts. Please try after 5 minutes'
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

    test('SignIn is Clickable link', async ({ page }) => {
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

    test('with invalid phone number', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();

        const mobile = 12345;
        await signin.MobileNumber(mobile);

        expect(await signin.errorMessage()).toBe(
            'Mobile Number is not allowed'
        );
    });
    test('with valid phone number', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const mobile = 9863627507;
        await signin.MobileNumber(mobile);
        await expect(
            page.getByText('Mobile Number', { exact: true })
        ).toBeVisible();
    });
});
