import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

export class ExpenseHeadHelper extends BaseHelper {
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }

    public async AddExpenseHead(
        name: string,
        parent?: string,
        manager?: string,
        abc?: string
    ) {
        await this.clickButton('Add Expense Head');
        await this.fillText(name, {
            name: 'name',
        });
        if (parent) {
            await this.selectOption({
                option: parent,
                hasText: 'Select a Parent',
            });
        }
        // if(manager){
        //     await this.selectOption({
        //         option: manager,
        //         hasText: 'Select Manager',
        //     });
        // }
        // if(abc){
        //     await this.selectOption({
        //         option: abc,
        //         hasText: 'Select ABC',
        //     });
        // }
        await this._page.waitForTimeout(1000);
        await this.click({ role: 'button', name: 'save' });
    }
}
