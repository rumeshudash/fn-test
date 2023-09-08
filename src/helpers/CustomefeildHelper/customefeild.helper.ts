import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

export class CustofeildHelper extends BaseHelper {
    public async init() {
        await this.navigateTo('CUSTOMEFEILDS');
    }

    public async clickExpenseTab() {
        await this._page
            .getByRole('tab', { name: 'Expense', exact: true })
            .click();
    }
}
