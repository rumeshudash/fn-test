import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

export class ExpenseHeadDetailsHelper extends BaseHelper {
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }

    public async clickOnExpenseHead(name: string) {
        this._page.getByRole('tab', { name: 'All', exact: true }).click();

        this._page.waitForTimeout(1000);

        await this._page.getByText(name).click();

        this._page.waitForTimeout(2000);
    }

    public async clickOnManagerName(name: string) {
        await this._page.getByText(name).click();

        this._page.waitForTimeout(2000);
    }

    public async clickOnEditIcon() {
        await this._page.locator('.items-center > button').first().click();

        this._page.waitForTimeout(2000);
    }

    public async EditExpenseHead(
        name: string,
        parent?: string,
        manager?: string
    ) {
        await this._page.waitForTimeout(1000);
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
        await this._page.waitForTimeout(1000);
        await this.click({ role: 'button', name: 'save' });
    }

    public async clickOnActions() {
        this._page.getByRole('button', { name: 'Actions' }).click();
        this._page.waitForTimeout(1000);
    }

    public async clickOnTab(tabName: string) {
        await this._page
            .getByRole('tab', { name: `${tabName}`, exact: true })
            .click();

        this._page.waitForTimeout(2000);
    }
    public async clickOnAddNotes(notes: string) {
        await this.clickButton('Add Notes');
        await this.fillText(notes, {
            name: 'comments',
        });
        await this._page.waitForTimeout(1000);
    }
}
