import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';

export class ResetPasswordHelper extends NotificationHelper {
    public _dialogHelper: DialogHelper;

    constructor(page: any) {
        super(page);
        this._dialogHelper = new DialogHelper(page);
    }
    public async init() {
        await this.navigateTo('MYPROFILE');
    }
    public async resetPasswordPage() {
        this._page.getByRole('button', { name: 'Actions' }).click();
        await this._page.waitForTimeout(1000);
        this._page.getByRole('menuitem', { name: 'Change Password' }).click();

        await this._page.waitForTimeout(1000);

        // await expect(this._page.getByText('Change Password')).toHaveCount(1);
        // await this._page.waitForTimeout(1000);
    }
    public async resetPassword(
        password: string,
        newpassword: string,
        confirm: string
    ) {
        this._page.getByRole('button', { name: 'Actions' }).click();
        await this._page.waitForTimeout(1000);
        this._page.getByRole('menuitem', { name: 'Change Password' }).click();

        await this._page.waitForTimeout(1000);

        await this.fillText(password, {
            id: 'old_password',
        });
        await this.fillText(newpassword, {
            id: 'password',
        });
        await this.fillText(confirm, {
            id: 'confirm_password',
        });
        await this.click({ role: 'button', name: 'Save' });
        await this.click({ role: 'button', name: 'Yes' });
    }

    public async resetPasswordsameoldAndNewPassword(
        password: string,
        newpassword: string
    ) {
        this._page.getByRole('button', { name: 'Actions' }).click();
        await this._page.waitForTimeout(1000);
        this._page.getByRole('menuitem', { name: 'Change Password' }).click();

        await this._page.waitForTimeout(1000);

        await this.fillText(password, {
            id: 'old_password',
        });
        await this.fillText(newpassword, {
            id: 'password',
        });

        this._page.waitForTimeout(1000);
    }

    public async errorSameMessage() {
        let message = await this._page
            .locator('//span[contains(@class, "label-text")]')
            .textContent();

        console.log(message);
    }
}
