import { ListingHelper } from '../BaseHelper/listing.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { NotesHelper } from '../BaseHelper/notes.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { StatusHelper } from '../BaseHelper/status.helper';

export class ExpenseHeadHelper extends ListingHelper {
    public noteHelper: NotesHelper;

    public tabhelper: TabHelper;

    public notificationHelper: NotificationHelper;

    public dialogHelper: DialogHelper;

    public statusHelper: StatusHelper;

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
        // await this.clickButton('Add Expense Head');
        await this.fillText(name, {
            name: 'name',
        });
        if (parent) {
            await this.selectOption({
                input: parent,
                name: 'parent_id',
            });
        }
        if (manager) {
            await this.selectOption({
                input: manager,
                name: 'manager_id',
            });
        }
        if (abc) {
            await this.fillText(abc, {
                name: 'date',
            });
        }
        await this._page.waitForTimeout(1000);
        await this.clickButton('Save');
    }

    public async searchExpense(name: string) {
        await this.searchInList(name);
        await this._page.waitForTimeout(1000);
    }

    public async changeStatus(name: string) {
        await this.tabHelper.checkTabExists('All');
        await this.tabHelper.clickTab('All');

        await this.searchInList(name);
        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, 'STATUS');

        await this._page.waitForTimeout(1000);

        const status = await this.getCellText(row, 'STATUS');

        console.log(chalk.green('Status is changed to ' + status));
    }

    public async changeActiveStatus(name: string) {
        await this.changeStatus(name);

        await this.tabHelper.clickTab('Inactive');

        await this._page.waitForTimeout(2000);

        await this.searchInList(name);

        await this._page.waitForTimeout(2000);
    }

    public async changeInactiveStatus(name: string) {
        await this.changeStatus(name);

        await this.tabHelper.clickTab('Active');

        await this.searchInList(name);
        await this._page.waitForTimeout(2000);
    }

    public async editExpenseHead(name: string, newname: string) {
        await this.tabHelper.checkTabExists('All');
        await this.tabHelper.clickTab('All');

        await this.searchInList(name);

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, 'ACTION');

        await this.fillText(newname, {
            name: 'name',
        });

        await this.click({ role: 'button', name: 'save' });

        // await this.tabHelper.clickTab('All');
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
            'S.N',
            'NAME',
            'APPROVAL MANAGER',
            'STATUS',
            'PARENT',
            'ACTION',
        ]);
    }

    public async checkExpenseHeadClickable(name: string) {
        const row = await this.findRowInTable(name, 'NAME');

        await this.clickTextOnTable(row, 'NAME');

        await this._page.waitForTimeout(2000);

        expect(await this._page.getByText(name)).toHaveCount(1);
    }

    public async checkWarning(name: string) {
        // await this.clickButton('Add Expense Head');

        await this.fillText(name, {
            name: 'name',
        });

        await this.dialogHelper.checkConfirmDialogOpenOrNot();
    }
}
