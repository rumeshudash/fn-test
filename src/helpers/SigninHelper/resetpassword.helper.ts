import { NotificationHelper } from '../BaseHelper/notification.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';

export class ResetPasswordHelper extends NotificationHelper {
    public dialogHelper: DialogHelper;

    constructor(page: any) {
        super(page);
        this.dialogHelper = new DialogHelper(page);
    }
    public async init() {
        await this.navigateTo('MYPROFILE');
    }
    public async resetPasswordPage() {
        this.clickButton('Actions');
        await this._page.waitForTimeout(1000);
        this._page.getByRole('menuitem', { name: 'Change Password' }).click();

        await this._page.waitForTimeout(1000);

        // await expect(this._page.getByText('Change Password')).toHaveCount(1);
        // await this._page.waitForTimeout(1000);
    }
    public async resetPassword(
        password: string,
        newPassword: string,
        confirm: string
    ) {
        this.clickButton('Actions');
        await this._page.waitForTimeout(1000);
        this._page.getByRole('menuitem', { name: 'Change Password' }).click();

        await this._page.waitForTimeout(1000);

        await this.fillText(password, {
            id: 'old_password',
        });
        await this.fillText(newPassword, {
            id: 'password',
        });
        await this.fillText(confirm, {
            id: 'confirm_password',
        });
        await this.click({ role: 'button', name: 'Save' });
    }

    public async resetPasswordsameoldAndNewPassword(
        password: string,
        newPassword: string
    ) {
        this.clickButton('Actions');
        await this._page.waitForTimeout(1000);
        this._page.getByRole('menuitem', { name: 'Change Password' }).click();

        await this._page.waitForTimeout(1000);

        await this.fillText(password, {
            id: 'old_password',
        });
        await this.fillText(newPassword, {
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
