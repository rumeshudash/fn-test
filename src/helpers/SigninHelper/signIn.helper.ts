import { Page, expect } from '@playwright/test';
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
        await this.fillText(username, { id: 'username' });
        await this.click({ role: 'button', name: ' Next → ' });
        await this.fillText(password, { id: 'password' });
        await this.click({ role: 'button', name: 'Submit' });
        await this._page.waitForTimeout(1000);

        const createPassword = await this._page
            .getByText('Create New Password', {
                exact: true,
            })
            .isVisible();
        if (username === 'newtestauto@company.com') {
            await this._page
                .getByRole('dialog')
                .getByText('FinOps Portal')
                .click();
            await this._page.waitForTimeout(1000);
        }
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
            await this._page.waitForTimeout(1000);
        }
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
        // await this._page.getByText('FinOps Portal').click();

        this._page.getByText('Dashboard');

        await this._page.waitForTimeout(1000);
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
            const password = SignInHelper.generateRandomPassword();
            await this.fillText(password, { id: 'password' });
            await this.click({ role: 'button', name: 'Submit' });

            const errorMessage = await this.getErrorMessage();

            if (errorMessage) {
                if (
                    errorMessage ===
                    'Account locked for too many invalid attempts. Please try after 5 minutes'
                ) {
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
