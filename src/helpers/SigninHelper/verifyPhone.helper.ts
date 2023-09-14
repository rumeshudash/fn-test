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
        await this.click({ role: 'button', name: 'Verify & Proceed' });
        await this._page.waitForTimeout(1000);
    }
}
