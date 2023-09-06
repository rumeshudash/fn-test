import { BaseHelper } from '../BaseHelper/base.helper';

import { expect } from '@playwright/test';

export class ForgotPasswordHelper extends BaseHelper {
    private FORGOT_PASSWORD_DOM_SELECTOR =
        "(//div[contains(@class,'flex-1 h-full')])[1]";

    private Resend_btn_selector = "//span[@class='cursor-pointer']";

    public async init() {
        await this.navigateTo('FORGOTPASSWORD');
    }

    public async forgotPasswordPage(email: string) {
        await this._page.waitForSelector(this.FORGOT_PASSWORD_DOM_SELECTOR);
        await this.fillText(email, { id: 'email' });
        await this.click({ role: 'button', name: 'Next →' });
        await this._page.waitForTimeout(10000);

        // if (this._page.locator(this.Resend_btn_selector).isVisible()) {
        //     await this.click({ role: 'button', name: 'Resend' });
        //     await this._page.waitForTimeout(1000);
        // }

        // if (resendButtonExists) {
        //     await this.click({ role: 'button', name: 'Resend' });
        //     await this._page.waitForTimeout(1000);
        // }

        // await this.click({ role: 'button', name: 'Back' });
        // await this._page.waitForTimeout(1000);
    }

    public async errorMessage() {
        return this._page
            .locator('//span[contains(@class, "label-text-alt text-error")]')
            .textContent();
    }
}
