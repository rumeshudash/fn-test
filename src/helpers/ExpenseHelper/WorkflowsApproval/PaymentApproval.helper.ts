import { BaseHelper } from '@/helpers/BaseHelper/base.helper';

let finopsEmail: string;
export class PaymentVerificationHelper extends BaseHelper {
    private PAYMENT_VERIFICATION_DOM_SELECTOR =
        '//div[@aria-label="Payment Approvals"]';
    helper = this.locate(this.PAYMENT_VERIFICATION_DOM_SELECTOR);
    public async getLevelName() {
        return await this.helper._page
            .locator('span.level-name')
            .first()
            .textContent();
    }

    public async getLevelStatus() {
        return await this.helper._page
            .locator('div.approval-status')
            .first()
            .textContent();
    }

    public async getPaymentEmail() {
        finopsEmail = await this.helper._page
            .getByLabel('Payment Approvals')
            .locator('span.approval-user-email')
            .first()
            .textContent();
        return finopsEmail;
    }

    public async getEmailName() {
        return await this.helper._page
            .locator('p.approval-user-name')
            .first()
            .textContent();
    }
}
