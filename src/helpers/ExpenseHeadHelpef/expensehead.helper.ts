import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

export class ExpenseHeadHelper extends BaseHelper {
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }
}
