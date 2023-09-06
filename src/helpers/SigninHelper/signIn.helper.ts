import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';
import { uuidV4 } from '@/utils/common.utils';

type LoginDetailsInput = {
    username: string;
    password: string;
};

export class SignInHelper extends BaseHelper {
    private SIGNIN_DOM_SELECTOR =
        "(//div[contains(@class,'flex-1 h-full')])[1]";

    private Dashboard_DOM_SELECTOR = '';

    public async init() {
        await this.navigateTo('SIGNIN');
    }

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

    public async errorMessage() {
        const errorMessage = await this._page
            .locator('//span[contains(@class, "label-text-alt text-error")]')
            .textContent();

        const messageToDisplay = errorMessage
            ? errorMessage
            : 'Invalid username or password';
        return messageToDisplay;
    }

    public async checkSignUpLink() {
        const result = await this.locateByText('Sign Up');

        // const element = await result.locator('[href="/login"]');
        expect(result, {
            message: 'login link is not found !!',
        }).toBeVisible();
        await result.click();
        await this._page.waitForURL('**/signup', {
            waitUntil: 'commit',
        });
        const signInNode = await this.locateByText('Sign Up', {
            role: 'heading',
            exactText: true,
        }).isVisible();
        await expect(signInNode, {
            message: 'Sign Up page not found !!',
        }).toBe(true);
    }

    public static genRandomEmail() {
        return `test-${uuidV4()}@gmail.com`;
    }
    // public async errorMessagepass() {
    //     this._page.locator("//span[@class='label-text-alt']").textContent();
    // }

    public async CheckLogin(data: LoginDetailsInput) {
        await this._page.waitForSelector(this.SIGNIN_DOM_SELECTOR);

        await this.fillText(data.username, { id: 'username' });
        await this.click({ role: 'button', name: ' Next → ' });
        await this._page.waitForTimeout(3000);

        await this.fillText(data.password, { id: 'password' });
        await this.click({ role: 'button', name: 'Submit' });
        await this._page.waitForTimeout(3000);

        // await this._page.getByText('Select Portal');

        // await this._page.waitForTimeout(1000);

        // await this._page.getByText('FinOps Portal').click();

        // await this._page.getByText('Dashboard');

        await this._page.waitForTimeout(1000);
    }

    public async isValidEmail(username: string) {
        await this._page.waitForSelector(this.SIGNIN_DOM_SELECTOR);
        await this.fillText(username, { id: 'username' });
        await this.click({ role: 'button', name: ' Next → ' });
        await this._page.waitForTimeout(1000);
    }
}
