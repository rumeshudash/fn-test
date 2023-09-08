import { uuidV4 } from '@/utils/common.utils';
import { BaseHelper } from '.././BaseHelper/base.helper';
import { expect } from '@playwright/test';
import chalk from 'chalk';

export class SignupHelper extends BaseHelper {
    private static SIGNUP_DOM_SELECTOR = '//form/parent::div';

    public async init() {
        await this.navigateTo('SIGNUP');
    }

    public static genRandomEmail() {
        return `test-${uuidV4()}@gmail.com`;
    }

    public async checkNextPage() {
        return this.locate('//button[text()="Next →"]');
    }

    public async isPolicyChecked() {
        return this._page.locator("//input[@type='checkbox']");
    }
    public async clickPolicy() {
        await this._page.locator("//input[@type='checkbox']").click();
    }

    public async fillSignup(data: SignupDetailsInput) {
        const helper = this.locate(SignupHelper.SIGNUP_DOM_SELECTOR);

        await helper.fillInput(data.name, { name: 'name' });
        await helper.fillInput(data.email, { name: 'email' });
        await helper.fillInput(data.password, { name: 'password' });
        await helper.fillInput(data.confirm_password, {
            name: 'confirm\\ password',
        });
    }
    public async checkSignInLink() {
        const result = this.locateByText('Sign In');

        // const element = await result.locator('[href="/login"]');
        expect(result, chalk.red('login link visibility')).toBeVisible();
        await result.click();
        await this._page.waitForURL('**/login', {
            waitUntil: 'commit',
        });
        const signInNode = await this.locateByText('Sign In', {
            role: 'heading',
            exactText: true,
        }).isVisible();
        expect(signInNode, chalk.red('Signup page visibility')).toBe(true);
    }
}
