import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { expect, test } from '@playwright/test';

test.describe('Signin', () => {
    test('without details', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.clickButton('Next →');
        await expect(
            page.locator(
                '//*[@id="__next"]/div/div[1]/div/div/div[3]/div[1]/form'
            )
        ).toHaveCount(1);
    });

    test('without Email Field', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.CheckLogin({
            username: '',
            password: '',
        });
        // await signin.clickButton('Next →');
        expect(await signin.errorMessage()).toBe('Email Address  is required');
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
        await signin.CheckLogin({
            username: 'test',
            password: '123456',
        });
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
        expect(await signin.errorMessage()).toBe(
            `Invalid username or password`
        );
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
        const username = 'newtestauto@company.com';
        const password = '1234567aaaaashsjh';
        for (let i = 0; i <= 5; i++) {
            await signin.CheckLogin({
                username: username,
                password: password,
            });
            // await signin.clickButton('Submit');
            await page.waitForTimeout(1000);
        }
        expect(await signin.errorMessage()).toBe(
            `Maximum login attempts exceeded. Please try again later.`
        );
    });
    test('with valid username and password', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.CheckLogin({
            username: username,
            password: password,
        });
        // await signin.clickButton('Submit');
        await page.waitForTimeout(1000);
    });
    test('with invalid username and password', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'anahshsjh@gmail.com';
        const password = '1234567aaaaashsjh';
        await signin.CheckLogin({
            username: username,
            password: password,
        });
        // await signin.clickButton('Submit');
        expect(await signin.errorMessage()).toBe(
            'Invalid username or password'
        );
    });
});
