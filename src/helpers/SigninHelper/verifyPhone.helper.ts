import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';
import { VerifyEmailHelper } from '../SignupHelper/verifyEmail.helper';

export class VerifyPhone extends BaseHelper {
    private static VERIFY_EMAIL_DOM_SELECTOR =
        "(//div[contains(@class,'flex-1 h-full')])[1]";

    public async init(number: string) {
        await this.navigateTo(`VERIFYOTP`, number);
    }

    public async clickVerify() {
        await this.click({ role: 'button', name: 'Verify & Proceed' });
        await this._page.waitForTimeout(1000);
    }
}
