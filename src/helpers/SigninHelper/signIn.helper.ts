import test, { Page, expect } from '@playwright/test';
import chalk from 'chalk';
import { BaseHelper } from '../BaseHelper/base.helper';
import { PortalSelectorHelper } from '../BaseHelper/portalSelector.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';

type LoginDetailsInput = {
    username: string;
    password: string;
};

export class SignInHelper extends NotificationHelper {
    public dialogHelper: DialogHelper;

    private SIGNIN_DOM_SELECTOR =
        "(//div[contains(@class,'flex-1 h-full')])[1]";
    // private Dashboard_DOM_SELECTOR = '';

    private portalSelectorHelper: PortalSelectorHelper;

    constructor(page: Page) {
        super(page);
        this.portalSelectorHelper = new PortalSelectorHelper(page);

        this.dialogHelper = new DialogHelper(page);
    }

    public async init() {
        await this.navigateTo('SIGNIN');
    }

    /**
     * Fill the input feild with username and password.
     *
     * @param {string} username - Username input for the login .
     * @param {number} password - Password input feild for login.
     
     */
    public async signInPage(username: string, password: string) {
        const setPassword = '1234567';

        if (username === 'newtestauto@company.com') {
            await this.fillText(username, { id: 'username' });
            await this.click({ role: 'button', name: ' Next → ' });
            await this.fillText('123456', { id: 'password' });
            await this.click({ role: 'button', name: 'Submit' });
        } else {
            await this.fillText(username, { id: 'username' });
            await this.click({ role: 'button', name: ' Next → ' });
            await this.fillText(password, { id: 'password' });
            await this.click({ role: 'button', name: 'Submit' });
        }
        const createPassword = await this._page
            .getByText('Create New Password', {
                exact: true,
            })
            .isVisible();
        if (createPassword === true) {
            await this.fillText(setPassword, {
                placeholder: 'Enter Current Password',
            });
            await this.fillText(setPassword, {
                placeholder: 'Enter New Password',
            });
            await this.fillText(setPassword, {
                placeholder: 'Re-Enter New Password',
            });
            await this.click({ role: 'button', name: 'Submit' });
            await this.click({ role: 'button', name: 'Back To Sign In →' });

            await this.fillText(username, { id: 'username' });
            await this.fillText(password, { id: 'password' });
            await this.click({ role: 'button', name: 'Submit' });
            await this._page.waitForLoadState('networkidle');
        }

        // const selectOrgPortal = async () => {
        const org = await this.locate(
            '//div[@role="dialog"]//p[text()="Select Organization"]'
        )._locator.isVisible();
        if (org) await this.locate('div', { id: 'org-1' })._locator.click();

        await this._page.waitForTimeout(300);
        await this._page.waitForLoadState('networkidle');

        const portal = await this.locate(
            '//div[@role="dialog"]//h2[text()="Select Portal"]'
        )._locator.isVisible();
        if (portal) await this.locate('div', { id: 'pro-3' })._locator.click();
        await this._page.waitForTimeout(3000);
        await this._page.waitForLoadState('networkidle');
        await this._page.waitForLoadState('domcontentloaded');
        // };
        // if (username === 'newtestauto@company.com') selectOrgPortal;

        // selectOrgPortal;
    }

    /**
     * Check the Login after username and password feild is Filled.
     *
     * @param {string} data.username - Username input for the login .
     * @param {number} data.password - Password input feild for login.
     
     */
    public async CheckLogin(data: LoginDetailsInput) {
        await this._page.waitForSelector(this.SIGNIN_DOM_SELECTOR);

        await this.fillText(data.username, { id: 'username' });
        await this.click({ role: 'button', name: ' Next → ' });
        await this._page.waitForTimeout(3000);

        await this.fillText(data.password, { id: 'password' });
        await this.click({ role: 'button', name: 'Submit' });
        await this._page.waitForTimeout(1000);
        await this._page.waitForLoadState('networkidle');
    }

    /**
     * Check the email feild has appropiate email
     *
     * @param {string}username - Username input for the login .
     */
    public async isValidEmail(username: string) {
        await this._page.waitForSelector(this.SIGNIN_DOM_SELECTOR);
        await this.fillText(username, { id: 'username' });
        await this.click({ role: 'button', name: ' Next → ' });
        await this._page.waitForTimeout(1000);
    }
    /**
     * Check if dashboard is displayed after login
     *
     * @param {string}username - Username input for the login .
     * @param {string}password - Password input feild for login.
     */
    public async checkDashboard(data: LoginDetailsInput) {
        await this._page.waitForSelector(this.SIGNIN_DOM_SELECTOR);

        await this.CheckLogin(data);

        if (await this.isVisible({ text: 'Select Organization' })) {
            await this.click({ id: 'org-1' });
        }
        await this.portalSelectorHelper.selectFinopsPortal();

        this._page.getByText('Dashboard');

        await this._page.waitForTimeout(1000);

        await this._page.waitForLoadState('networkidle');
    }

    /**
     * Check if Maximum login attempts is valid or not
     *
     * @param {string}username - Username input for the login .
     *
     */
    public async maximumLoginAttempts(username: string) {
        await this._page.waitForSelector(this.SIGNIN_DOM_SELECTOR);
        await this.fillText(username, { id: 'username' });
        await this.click({ role: 'button', name: ' Next → ' });

        for (let i = 0; i <= 10; i++) {
            await test.step(`Attempt ${i + 1}`, async () => {
                const password = SignInHelper.generateRandomPassword();
                await this.fillText(password, { id: 'password' });
                await this.click({ role: 'button', name: 'Submit' });
            });

            const errorMessage = await this.getErrorMessage();
            if (errorMessage) {
                if (errorMessage.includes('Account locked')) {
                    break;
                }
            }
        }
    }

    /**
     * Check if Mobile number is valid or not if Mobile number is entered in login feild
     *
     * @param {number}mobile - Mobile number of user for login .
     *
     */
    public async MobileNumber(mobile: number) {
        await this._page.waitForSelector(this.SIGNIN_DOM_SELECTOR);
        await this.fillText(mobile.toString(), { id: 'username' });
        await this.click({ role: 'button', name: ' Next → ' });
        await this._page.waitForTimeout(1000);
    }

    /**
     * Check if forgot password feild is clickable or not
     *
     *@param {string}username - Username input for the logi
     */
    public async checkForgotPasswordLink(username: string) {
        await this._page.waitForSelector(this.SIGNIN_DOM_SELECTOR);
        await this.isValidEmail(username);
        await this._page.waitForTimeout(1000);
        const result = this.locateByText('Forgot Password?');
        expect(result, chalk.red('Forgot Password visibility')).toBeVisible();
        await result.click();
        await this._page.waitForURL('**/forgot-password', {
            waitUntil: 'commit',
        });
        const forgotPasswordNode = await this.locateByText('Forget Password', {
            role: 'heading',
            exactText: true,
        }).isVisible();
        expect(
            forgotPasswordNode,
            chalk.red('Forgot Password page visibility')
        ).toBe(true);
    }

    /**
     * Check if signup feild is clickable or not
     *
     *
     */
    public async checkSignUpLink() {
        const result = this.locateByText('Sign Up');

        // const element = await result.locator('[href="/login"]');
        expect(result, chalk.red('Signup visibility')).toBeVisible();
        await result.click();
        await this._page.waitForURL('**/signup', {
            waitUntil: 'commit',
        });
        const signInNode = await this.locateByText('Sign Up', {
            role: 'heading',
            exactText: true,
        }).isVisible();
        expect(signInNode, chalk.red('Signup page visibility')).toBe(true);
    }
}
