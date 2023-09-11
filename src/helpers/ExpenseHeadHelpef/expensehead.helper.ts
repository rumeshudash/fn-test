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
        if (manager) {
            await this.selectOption({
                option: manager,
                hasText: 'Select a manager',
            });
        }
        if (abc) {
            await this.fillText(abc, {
                name: 'date',
            });
        }
        await this._page.waitForTimeout(1000);
        await this.click({ role: 'button', name: 'save' });
    }

    public changeActiveStatus(name: string) {
        // this._page.getByRole('tab', { name: 'Active', exact: true }).click();
        async function performAction(element: any) {
            await element.click();
        }

        const btnlocator = '//button';

        this.FindrowAndperformAction(name, 3, btnlocator, performAction);

        this._page.waitForTimeout(1000);
    }
    public async changeInactiveStatus(name: string) {
        this._page.getByRole('tab', { name: 'Inactive', exact: true }).click();

        this._page.waitForTimeout(1000);

        await this._page.getByText(name);

        // this._page.waitForTimeout(1000);

        async function performAction(element: any) {
            await element.click();
        }

        const btnlocator = '//button';

        this.FindrowAndperformAction(name, 3, btnlocator, performAction);

        this._page.waitForTimeout(1000);
    }

    public async EditExpenseHead(name: string, newname: string) {
        this._page.getByRole('tab', { name: 'All', exact: true }).click();

        this._page.waitForTimeout(1000);

        await this._page.getByText(name);

        async function performAction(element: any) {
            await element.click();
        }

        const btnlocator = '//button';

        this.FindrowAndperformAction(name, 5, btnlocator, performAction);

        this.fillText(newname, {
            name: 'name',
        });

        await this.click({ role: 'button', name: 'save' });

        this._page.waitForTimeout(1000);
    }
}
