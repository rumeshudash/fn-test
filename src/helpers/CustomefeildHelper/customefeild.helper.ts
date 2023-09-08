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

    public async AddExpenseCustomeFeild(
        name: string,
        type: string,
        priority: number
    ) {
        await this.clickExpenseTab();
        await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            hasText: 'Select Field Type',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        await this.click({ role: 'button', name: 'save' });
    }
    public async AddExpenseWithTextType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: string
    ) {
        await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            hasText: 'Select Field Type',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        if (defaultValue) {
            await this.fillText(defaultValue, {
                text: 'Default Value',
            });
        }

        await this.click({ role: 'button', name: 'save' });
    }
    public async AddExpenseWitBooleanType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: string
    ) {
        await this.clickExpenseTab();
        await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            hasText: 'Select Field Type',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        if (defaultValue) {
            await this.click({ role: 'radio', name: defaultValue });
        }
        await this.click({ role: 'button', name: 'save' });
    }
}
