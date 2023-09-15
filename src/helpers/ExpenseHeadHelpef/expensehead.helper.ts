import { ListingHelper } from '../BaseHelper/listing.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { NotesHelper } from '../BaseHelper/notes.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { expect } from '@playwright/test';
import chalk from 'chalk';

export class ExpenseHeadHelper extends ListingHelper {
    public noteHelper: NotesHelper;

    public tabhelper: TabHelper;

    public notificationHelper: NotificationHelper;

    public dialogHelper: DialogHelper;

    constructor(page: any) {
        super(page);
        this.noteHelper = new NotesHelper(page);
        this.tabhelper = new TabHelper(page);
        this.notificationHelper = new NotificationHelper(page);
        this.dialogHelper = new DialogHelper(page);
    }
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }
    // public async clickPolicy() {
    //     await this._page.locator("//input[@type='checkbox']").click();
    // }

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
                name: 'parent_id',
            });
        }
        if (manager) {
            await this.selectOption({
                option: manager,
                name: 'manager_id',
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

    public async changeActiveStatus(name: string) {
        await this.tabHelper.checkTabExists('Active');
        await this.tabHelper.clickTab('Active');

        await this.searchInList(name);
        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, 'STATUS');

        const status = await this.getCellText(row, 'STATUS');

        console.log(chalk.green('Status is changed to ' + status));

        this._page.waitForTimeout(1000);
    }
    public async changeInactiveStatus(name: string) {
        await this.tabHelper.checkTabExists('Inactive');
        await this.tabHelper.clickTab('Inactive');

        await this.searchInList(name);

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, 'STATUS');

        this._page.waitForTimeout(1000);

        const status = await this.getCellText(row, 'STATUS');

        console.log(chalk.green('Status is changed to ' + status));

        this._page.waitForTimeout(1000);
    }

    public async editExpenseHead(name: string, newname: string) {
        await this.tabHelper.checkTabExists('All');
        await this.tabHelper.clickTab('All');

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, 'ACTION');

        this.fillText(newname, {
            name: 'name',
        });

        await this.click({ role: 'button', name: 'save' });

        this._page.waitForTimeout(1000);
    }

    public async addAndClickCheckbox(name: string) {
        await this.clickButton('Add Expense Head');
        await this.fillText(name, {
            name: 'name',
        });

        await this.saveAndCreateCheckbox();

        await this.click({ role: 'button', name: 'save' });
    }

    public async verifyTabs() {
        await this.tabHelper.checkTabExists(['All', 'Active', 'Inactive']);
    }
    public async checkTableHeader() {
        const headers = await this.getTableColumnNames();

        expect(headers).toEqual([
            'NAME',
            'MANAGER',
            'STATUS',
            'PARENT',
            'ACTION',
        ]);
    }
}
