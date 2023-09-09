import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

export class ResetPasswordHelper extends BaseHelper {
    public async init() {
        await this.navigateTo('MYPROFILE');
    }
    public async resetPasswordPage() {
        this.clickButton('Actions');
        this._page
            .locator('//span[contains(text(),"Change Password")]')
            .click();
        this._page.waitForTimeout(1000);
    }
}
