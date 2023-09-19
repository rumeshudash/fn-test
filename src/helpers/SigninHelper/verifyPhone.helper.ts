import { NotificationHelper } from '../BaseHelper/notification.helper';

import { expect } from '@playwright/test';

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
        const locator = this._page.locator(
            '//div[contains(@class, "link")][text()="Resend OTP"]'
        );

        await expect(locator).toBeVisible({ timeout: 10000 });
        await locator.click();
        await this._page.waitForTimeout(1000);
    }

    public async maximumAttempt() {
        for (let i = 0; i < 10; i++) {
            await this.fillOtp('1234', 4);
            await this.clickVerify();

            const error = await this.getToastError();
            if (
                error.includes('Too many invalid attempts.. try after sometime')
            ) {
                break;
            }
        }
    }
}
