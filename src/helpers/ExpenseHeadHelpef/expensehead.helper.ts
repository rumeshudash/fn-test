import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { NotesHelper } from '../BaseHelper/notes.helper';

export class ExpenseHeadHelper extends BaseHelper {
    public noteHelper: NotesHelper;

    public tabhelper: TabHelper;

    public notificationHelper: NotificationHelper;

    constructor(page: any) {
        super(page);
        this.noteHelper = new NotesHelper(page);
        this.tabhelper = new TabHelper(page);
        this.notificationHelper = new NotificationHelper(page);
    }
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }
    public async clickPolicy() {
        await this._page.locator("//input[@type='checkbox']").click();
    }

    public async addExpenseHead(
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

        this.findrowAndperformAction(name, 3, btnlocator, performAction);

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

        this.findrowAndperformAction(name, 3, btnlocator, performAction);

        this._page.waitForTimeout(1000);
    }

    public async editExpenseHead(name: string, newname: string) {
        this._page.getByRole('tab', { name: 'All', exact: true }).click();

        this._page.waitForTimeout(1000);

        await this._page.getByText(name);

        async function performAction(element: any) {
            await element.click();
        }

        const btnlocator = '//button';

        this.findrowAndperformAction(name, 5, btnlocator, performAction);

        this.fillText(newname, {
            name: 'name',
        });

        await this.click({ role: 'button', name: 'save' });

        this._page.waitForTimeout(1000);
    }

    public async addandClickCheckbox(name: string) {
        await this.clickButton('Add Expense Head');
        await this.fillText(name, {
            name: 'name',
        });

        await this.clickPolicy();

        await this.click({ role: 'button', name: 'save' });
    }
}
