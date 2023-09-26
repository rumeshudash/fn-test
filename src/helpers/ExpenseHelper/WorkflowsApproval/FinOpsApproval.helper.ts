import { BaseHelper } from '@/helpers/BaseHelper/base.helper';

let finopsEmail: string;
export class FinOpsVerificationHelper extends BaseHelper {
    private FINOPS_VERIFICATION_DOM_SELECTOR =
        '//div[@aria-label="FinOps Approvals"]';
    helper = this.locate(this.FINOPS_VERIFICATION_DOM_SELECTOR);
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

    public async getFinopsEmail() {
        finopsEmail = await this.helper._page
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
