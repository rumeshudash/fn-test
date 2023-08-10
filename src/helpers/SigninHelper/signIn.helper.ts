import { TEST_URL } from '@/constants/api.constants';
import { BaseHelper } from '../BaseHelper/base.helper';

export class SignInHelper extends BaseHelper {
    private SIGNIN_DOM_SELECTOR =
        "(//div[contains(@class,'flex-1 h-full')])[1]";

    public async init() {
        await this.navigateTo('SIGNUP');
    }

    public async signInPage(username: string, password: string) {
        const setPassword = '1234567';
        await this.fillText(username, { id: 'username' });
        await this.click({ role: 'button', name: 'Next' });
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
}
