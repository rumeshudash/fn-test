import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';
import { VerifyEmailHelper } from '../SignupHelper/verifyEmail.helper';

import { NotificationHelper } from '../BaseHelper/notification.helper';

export class VerifyPhone extends NotificationHelper {
    private static VERIFY_EMAIL_DOM_SELECTOR =
        "(//div[contains(@class,'flex-1 h-full')])[1]";

    public async init(number: string) {
        await this.navigateTo(`VERIFYOTP`, number);
    }

    /**
     * Check the error message for invalid OTP.
     * Check the next page after entering the valid OTP.
     *
     * */

    public async clickVerify() {
        await this.clickButton('Verify & Proceed');
        await this._page.waitForTimeout(1000);
    }

    public async clickResendOTP() {
        const locator = await this._page.locator(
            '//button[contains(@class, "link link-hover text-sm")]'
        );

        expect(locator).toBeVisible();
        await this._page.waitForTimeout(1000);
        await locator.click();
        await this._page.waitForTimeout(1000);
    }
}
