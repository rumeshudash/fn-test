import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

export class ResetPasswordHelper extends BaseHelper {
    public async init() {
        await this.navigateTo('MYPROFILE');
    }
    public async resetPasswordPage() {
        this._page.getByRole('button', { name: 'Actions' }).click();
        await this._page.waitForTimeout(1000);
        this._page.getByRole('menuitem', { name: 'Change Password' }).click();

        await this._page.waitForTimeout(1000);

        await expect(this._page.getByText('Change Password')).toHaveCount(1);
    }
}
