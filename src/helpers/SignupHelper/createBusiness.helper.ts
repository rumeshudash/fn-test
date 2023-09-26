import { BaseHelper } from '../BaseHelper/base.helper';

export class CreateBusinessHelper extends BaseHelper {
    private CREATE_BUSINESS_DOM_SELECTOR =
        "(//div[@data-state='open']//div)[1]";

    public async fillBusiness(name: CreateBusinessInput) {
        await this._page.waitForTimeout(2000);
        const helper = this.locate(this.CREATE_BUSINESS_DOM_SELECTOR);
        await helper.fillText(name.business_name, {
            placeholder: 'Enter your organization name',
        });
    }

    public async clickContinue() {
        await this._page.getByRole('button', { name: 'Continue' }).click();
        await this._page.waitForTimeout(6000);
        await this._page.waitForLoadState('networkidle');
    }

    public async init() {
        await this.navigateTo('BUSINESSESS');
        await this._page.waitForTimeout(1000);
    }
}
